import type { Metadata } from "next";
import Link from "next/link";
import GraficoRadar, { type ValorRadar } from "@/components/GraficoRadar";
import Reveal from "@/components/Reveal";
import SeccionJuegosProgreso from "@/components/SeccionJuegosProgreso";
import {
  AREA_LOGICA,
  AREAS,
  nivelGeneral,
  type Nivel,
} from "@/lib/diagnostico";
import {
  AVISO_VOCACIONAL,
  DIMENSIONES_RIASEC,
  mapearFamilias,
  type PerfilVocacional,
} from "@/lib/vocacional";
import { INSIGNIAS } from "@/lib/juegos";
import { supabaseConfigurado } from "@/lib/supabase/config";
import {
  crearClienteServidor,
  obtenerPerfil,
  obtenerUsuario,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mi progreso | CEPO",
  description:
    "Tu progreso en CEPO: resultados del diagnóstico, actitudes y hábitos, puntos, insignias y niveles de los juegos. Solo tú ves tus datos.",
};

export const dynamic = "force-dynamic";

type Diagnostico = {
  id: string;
  area: string;
  nivel: string;
  puntaje: number | null;
  created_at: string;
};

type Actitud = {
  id: string;
  dimensiones: Record<string, unknown>;
  created_at: string;
};

type ProgresoJuego = {
  id: string;
  juego: string;
  puntos: number;
  insignias: unknown;
  nivel: number;
  updated_at: string;
};

type Orientacion = {
  id: string;
  dimensiones: Record<string, unknown>;
  perfil_top2: unknown;
  created_at: string;
};

function fechaCorta(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-BO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Tarjeta({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={titulo}
      className="rounded-2xl border border-rio/30 bg-white p-5 shadow-sm sm:p-6 dark:border-rio-claro/30 dark:bg-noche-claro"
    >
      <h2 className="font-display text-xl font-extrabold text-selva dark:text-sol">
        {titulo}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function EstadoVacio({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border-2 border-dashed border-sol bg-sol/10 px-4 py-3 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
      {children}
    </p>
  );
}

export default async function PaginaProgreso() {
  if (!supabaseConfigurado) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
          Mi progreso
        </h1>
        <div
          role="alert"
          className="mt-6 rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-5 text-sm leading-relaxed text-neutral-700 dark:text-white/85"
        >
          <p className="font-display text-base font-bold text-noche dark:text-sol">
            Configuración pendiente
          </p>
          <p className="mt-2">
            Tu panel de progreso aún no está disponible: el colegio todavía
            no creó el proyecto Supabase. Cuando esté listo, aquí verás tus
            diagnósticos, tu evolución, tus insignias y tus metas.
          </p>
        </div>
        <div className="mt-6">
          <SeccionJuegosProgreso />
        </div>
      </section>
    );
  }

  const usuario = await obtenerUsuario();
  if (!usuario) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
        <h1 className="font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
          Mi progreso
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-neutral-700 dark:text-white/85">
          Para ver tu progreso, primero entra con tu cuenta.
        </p>
        <Link
          href="/login?siguiente=/progreso"
          className="mt-6 inline-block rounded-full bg-selva px-6 py-3 font-display font-bold text-white dark:bg-sol dark:text-noche"
        >
          Entrar →
        </Link>
        <div className="mt-8 text-left">
          <SeccionJuegosProgreso />
        </div>
      </section>
    );
  }

  const perfil = await obtenerPerfil();
  const supabase = await crearClienteServidor();

  let diagnosticos: Diagnostico[] = [];
  let actitudes: Actitud[] = [];
  let juegos: ProgresoJuego[] = [];
  let orientacion: Orientacion | null = null;
  let errorCarga = "";

  if (supabase) {
    const [rDiag, rAct, rJuegos] = await Promise.all([
      supabase
        .from("diagnosticos")
        .select("id, area, nivel, puntaje, created_at")
        .eq("user_id", usuario.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("actitudes")
        .select("id, dimensiones, created_at")
        .eq("user_id", usuario.id)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("progreso_juegos")
        .select("id, juego, puntos, insignias, nivel, updated_at")
        .eq("user_id", usuario.id)
        .order("updated_at", { ascending: false }),
    ]);
    if (rDiag.error || rAct.error || rJuegos.error) {
      errorCarga =
        "No se pudieron cargar tus datos ahora mismo. Inténtalo de nuevo más tarde.";
    } else {
      diagnosticos = (rDiag.data ?? []) as Diagnostico[];
      actitudes = (rAct.data ?? []) as Actitud[];
      juegos = (rJuegos.data ?? []) as ProgresoJuego[];
    }
    // Fase h: el perfil vocacional se lee aparte. Si la migración 0002
    // aún no se corrió, la tabla no existe: esto simplemente no muestra
    // nada y no rompe el resto del panel.
    const rOri = await supabase
      .from("orientacion_vocacional")
      .select("id, dimensiones, perfil_top2, created_at")
      .eq("user_id", usuario.id)
      .order("created_at", { ascending: false })
      .limit(1);
    if (!rOri.error && rOri.data && rOri.data.length > 0) {
      orientacion = rOri.data[0] as Orientacion;
    }
  }

  // Último diagnóstico por área (para la evolución).
  const porArea = new Map<string, Diagnostico>();
  for (const d of diagnosticos) {
    if (!porArea.has(d.area)) porArea.set(d.area, d);
  }

  // Fase h: nivel general (solo las 6 áreas), lógica y perfil vocacional.
  const diagnosticoLogica = porArea.get(AREA_LOGICA) ?? null;
  const puntajesPorArea: Partial<Record<(typeof AREAS)[number], number>> = {};
  const nivelesPorArea: Partial<Record<(typeof AREAS)[number], Nivel>> = {};
  for (const a of AREAS) {
    const d = porArea.get(a);
    if (d) {
      if (d.puntaje !== null) puntajesPorArea[a] = d.puntaje;
      nivelesPorArea[a] = d.nivel as Nivel;
    }
  }
  const puntajesHechos = Object.values(puntajesPorArea);
  const nivelGeneralTexto =
    puntajesHechos.length > 0 ? nivelGeneral(puntajesHechos) : null;
  const perfilVocacional: PerfilVocacional | null =
    orientacion && orientacion.dimensiones
      ? {
          dimensiones: Object.fromEntries(
            Object.entries(orientacion.dimensiones).map(([k, v]) => [
              k,
              typeof v === "number" ? v : 0,
            ])
          ),
          top2: (
            Array.isArray(orientacion.perfil_top2)
              ? orientacion.perfil_top2.filter(
                  (v): v is string =>
                    typeof v === "string" &&
                    DIMENSIONES_RIASEC.some((dim) => dim.id === v)
                )
              : []
          ).slice(0, 2) as PerfilVocacional["top2"],
        }
      : null;
  const diagnosticoCompleto = AREAS.every((a) => porArea.get(a));
  const familiasProgreso =
    perfilVocacional && diagnosticoCompleto && diagnosticoLogica
      ? mapearFamilias(
          perfilVocacional,
          puntajesPorArea,
          nivelesPorArea,
          diagnosticoLogica.nivel as Nivel
        )
      : [];

  // Insignias ganadas en los juegos (sin duplicados, en orden de juego).
  const insignias: string[] = [];
  for (const j of juegos) {
    if (Array.isArray(j.insignias)) {
      for (const ins of j.insignias) {
        if (typeof ins === "string" && !insignias.includes(ins)) {
          insignias.push(ins);
        }
      }
    }
  }

  const ultimaActitud = actitudes[0] ?? null;
  const dimensiones =
    ultimaActitud && ultimaActitud.dimensiones
      ? Object.entries(ultimaActitud.dimensiones)
      : [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Panel personal
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Mi progreso
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
        {perfil
          ? `Hola, ${perfil.alias}${perfil.curso ? ` — ${perfil.curso}` : ""}. Aquí están solo tus resultados.`
          : "Hola. Aquí están solo tus resultados."}
      </p>

      {errorCarga && (
        <p
          role="alert"
          className="mt-6 rounded-xl border-2 border-achiote bg-achiote/10 px-4 py-3 text-sm font-bold text-achiote dark:text-achiote-claro"
        >
          {errorCarga}
        </p>
      )}

      <Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Tarjeta titulo="Historial de diagnósticos">
          {diagnosticos.length === 0 ? (
            <EstadoVacio>
              Aún no tienes diagnósticos. Hacé el{" "}
              <Link
                href="/diagnostico"
                className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
              >
                examen diagnóstico
              </Link>{" "}
              y cada área que completes aparecerá aquí con su fecha y nivel.
            </EstadoVacio>
          ) : (
            <ul className="flex flex-col gap-3">
              {diagnosticos.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rio/20 px-4 py-3"
                >
                  <span className="font-bold text-noche dark:text-white">
                    {d.area}
                  </span>
                  <span className="text-sm text-neutral-600 dark:text-white/75">
                    Nivel {d.nivel}
                    {d.puntaje !== null ? ` · ${d.puntaje} puntos` : ""}
                    {" · "}
                    {fechaCorta(d.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta titulo="Evolución por área">
          {porArea.size === 0 && dimensiones.length === 0 ? (
            <EstadoVacio>
              Aún no hay evolución que mostrar. Hacé el{" "}
              <Link
                href="/diagnostico"
                className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
              >
                examen diagnóstico
              </Link>{" "}
              o el{" "}
              <Link
                href="/actitudes"
                className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
              >
                cuestionario de actitudes
              </Link>{" "}
              y acá vas a ver tu último nivel en cada área.
            </EstadoVacio>
          ) : (
            <div className="flex flex-col gap-4">
              {porArea.size > 0 && (
                <>
                  <GraficoRadar
                    valores={
                      AREAS.map((area) => {
                        const d = porArea.get(area);
                        return d
                          ? {
                              area,
                              valor: d.puntaje ?? 0,
                              etiqueta: d.nivel,
                            }
                          : { area, valor: 0, pendiente: true };
                      }) as ValorRadar[]
                    }
                    titulo="Tu último nivel en cada área"
                  />
                  {/* Fase h: nivel general + lógica (barra aparte, no es un 7.º eje del radar). */}
                  {nivelGeneralTexto && (
                    <p className="text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                      Nivel general:{" "}
                      <strong className="text-selva dark:text-sol">
                        {nivelGeneralTexto}
                      </strong>
                      . Este diagnóstico mide lo que sabés hoy: no es un
                      examen de admisión ni una prueba oficial.
                    </p>
                  )}
                  {diagnosticoLogica && (
                    <div>
                      <p className="flex flex-wrap justify-between gap-2 text-sm">
                        <span className="font-bold text-noche dark:text-white">
                          Lógica matemática
                        </span>
                        <span className="text-neutral-600 dark:text-white/75">
                          Nivel {diagnosticoLogica.nivel}
                          {diagnosticoLogica.puntaje !== null
                            ? ` · ${diagnosticoLogica.puntaje} puntos`
                            : ""}
                        </span>
                      </p>
                      {diagnosticoLogica.puntaje !== null && (
                        <div
                          className="mt-2 h-3 overflow-hidden rounded-full bg-rio/20"
                          role="progressbar"
                          aria-valuenow={diagnosticoLogica.puntaje}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Lógica matemática: ${diagnosticoLogica.puntaje} de 100`}
                        >
                          <div
                            className="h-full rounded-full bg-rio"
                            style={{
                              width: `${diagnosticoLogica.puntaje}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <ul className="flex flex-col gap-3">
                    {[...porArea.values()]
                      .filter((d) => d.area !== AREA_LOGICA)
                      .map((d) => (
                      <li
                        key={d.area}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rio/20 px-4 py-3"
                      >
                        <span className="font-bold text-noche dark:text-white">
                          {d.area}
                        </span>
                        <span className="text-sm text-neutral-600 dark:text-white/75">
                          Nivel {d.nivel}
                          {d.puntaje !== null ? ` · ${d.puntaje} puntos` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {dimensiones.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-selva dark:text-rio-claro">
                    Actitudes — última medición ({fechaCorta(ultimaActitud!.created_at)})
                  </h3>
                  <ul className="mt-2 flex flex-col gap-2">
                    {dimensiones.map(([nombre, valor]) => (
                      <li
                        key={nombre}
                        className="flex flex-wrap justify-between gap-2 rounded-xl border border-rio/20 px-4 py-2 text-sm"
                      >
                        <span className="font-bold text-noche dark:text-white">
                          {nombre}
                        </span>
                        <span className="text-neutral-600 dark:text-white/75">
                          {String(valor)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Tarjeta>

        {/* Fase h: perfil vocacional + posibles carreras */}
        <Tarjeta titulo="Tu perfil vocacional">
          {!perfilVocacional ? (
            <EstadoVacio>
              Aún no hiciste el{" "}
              <Link
                href="/vocacional"
                className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
              >
                cuestionario vocacional
              </Link>
              . Son 18 frases sobre lo que te gusta hacer, unos 5 minutos.
            </EstadoVacio>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                Tus intereses más fuertes:{" "}
                <strong className="text-selva dark:text-sol">
                  {perfilVocacional.top2
                    .map(
                      (id) =>
                        DIMENSIONES_RIASEC.find((d) => d.id === id)?.nombre ??
                        id
                    )
                    .join(" y ")}
                </strong>
                .
              </p>
              {familiasProgreso.length > 0 ? (
                <>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                    Según lo que sabés hoy y lo que te interesa hoy, estas
                    familias de carreras combinan con vos. No es una
                    decisión: es un punto de partida para averiguar más.
                  </p>
                  <ul className="flex flex-col gap-3">
                    {familiasProgreso.map((f) => (
                      <li
                        key={f.id}
                        className="rounded-xl border border-rio/20 px-4 py-3"
                      >
                        <p className="font-bold text-noche dark:text-white">
                          {f.nombre}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                          {f.carreras.join(", ")}.
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                          {f.vias.join(" · ")}.
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                  Para ver qué carreras combinan con vos, completá el
                  diagnóstico de las 6 áreas y el reto de lógica. Mientras
                  tanto, explorá las opciones en{" "}
                  <Link
                    href="/futuro"
                    className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
                  >
                    Tu futuro
                  </Link>
                  .
                </p>
              )}
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                {AVISO_VOCACIONAL}
              </p>
              <p>
                <Link
                  href="/futuro"
                  className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
                >
                  Ver Tu futuro: dónde estudiar, becas y carreras →
                </Link>
              </p>
            </div>
          )}
        </Tarjeta>

        <Tarjeta titulo="Insignias">
          {insignias.length === 0 ? (
            <EstadoVacio>
              Aún no tienes insignias. Jugá a los{" "}
              <Link
                href="/juegos"
                className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
              >
                juegos
              </Link>{" "}
              y cuando completes retos, tus insignias aparecerán aquí.
            </EstadoVacio>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {insignias.map((ins) => (
                <li
                  key={ins}
                  className="rounded-full bg-sol/20 px-4 py-2 text-sm font-bold text-noche dark:text-sol"
                >
                  {INSIGNIAS.find((i) => i.id === ins)?.nombre ?? ins}
                </li>
              ))}
            </ul>
          )}
          {juegos.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {juegos.map((j) => (
                <li
                  key={j.id}
                  className="flex flex-wrap justify-between gap-2 text-sm text-neutral-600 dark:text-white/75"
                >
                  <span className="font-bold text-noche dark:text-white">
                    {j.juego}
                  </span>
                  <span>
                    Nivel {j.nivel} · {j.puntos} puntos
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <SeccionJuegosProgreso juegosServidor={juegos} />

        <Tarjeta titulo="Metas personales">
          <EstadoVacio>
            Aún no tienes metas personales. Cuando la próxima fase habilite
            las metas, podrás fijarlas aquí y seguir tu avance.
          </EstadoVacio>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-white/75">
            Mientras tanto, tu progreso se construye con cada diagnóstico y
            cada juego que completes.
          </p>
        </Tarjeta>
      </div>
      </Reveal>
    </section>
  );
}
