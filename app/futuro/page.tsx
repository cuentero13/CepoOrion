import type { Metadata } from "next";
import Link from "next/link";
import datos from "@/data/despues-del-cole.json";
import Reveal from "@/components/Reveal";
import MapaEstudios from "@/components/MapaEstudios";

export const metadata: Metadata = {
  title: "Tu futuro | CEPO",
  description:
    "Qué hacer después del bachillerato: dónde estudiar, becas, carreras con futuro y trabajos modernos con cursos gratis. Datos reales y verificables para jóvenes de Ixiamas.",
};

type Estado = "vigente" | "cerrado" | "por confirmar";

function EstadoBadge({ estado }: { estado: string }) {
  const estilos: Record<string, string> = {
    vigente: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    cerrado: "bg-stone-200 text-stone-700 dark:bg-stone-700/60 dark:text-stone-200",
    "por confirmar": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${estilos[estado] ?? estilos["por confirmar"]}`}
    >
      {estado === "vigente"
        ? "Vigente"
        : estado === "cerrado"
          ? "Ciclo cerrado"
          : "Por confirmar"}
    </span>
  );
}

function EnlaceExterno({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
    >
      {children}
    </a>
  );
}

function Seccion({
  id,
  numero,
  titulo,
  intro,
  children,
}: {
  id: string;
  numero: string;
  titulo: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={id} className="mt-12 scroll-mt-24">
      <Reveal>
        <h2 className="font-display text-2xl font-extrabold text-noche dark:text-white sm:text-3xl">
          <span className="text-rio-oscuro dark:text-rio-claro">{numero}.</span>{" "}
          {titulo}
        </h2>
        {intro && (
          <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
            {intro}
          </p>
        )}
        <div className="mt-5 flex flex-col gap-4">{children}</div>
      </Reveal>
    </section>
  );
}

function Tarjeta({
  children,
  titulo,
}: {
  children: React.ReactNode;
  titulo?: string;
}) {
  return (
    <article className="rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-md dark:border-white/10 dark:bg-noche-claro">
      {titulo && (
        <h3 className="font-display text-xl font-bold text-noche dark:text-white">
          {titulo}
        </h3>
      )}
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
        {children}
      </div>
    </article>
  );
}

export default function Futuro() {
  const d = datos as unknown as {
    ultima_revision: string;
    como_entrar: {
      titulo: string;
      texto: string;
      vias: { nombre: string; descripcion: string }[];
      nota: string;
      fuente: string;
      verificado: string;
    };
    instituciones: {
      id: string;
      nombre: string;
      ciudad: string;
      como_se_entra: string;
      carreras_cercanas: string[];
      costo_examen: string;
      enlace: string;
      estado: Estado;
      nota: string;
    }[];
    becas: {
      id: string;
      nombre: string;
      para_quien: string;
      que_cubre: string;
      estado: Estado;
      fuente: string;
      nota: string;
    }[];
    becas_no_existen: string[];
    checklist_beca: string[];
    demanda: {
      fuente: string;
      limite: string;
      areas_mas_demandadas: { area: string; porcentaje: string }[];
      carreras_mas_demandadas: string[];
      perfiles_tecnicos_mas_buscados: string[];
      titulados_por_anio: string;
      demanda_estimada: string;
      carreras_con_mas_titulados_que_demanda: string[];
      contexto_ine: {
        desempleo_urbano: string;
        desempleo_juvenil: string;
        empleo_informal: string;
        sectores_con_mas_empleo: string;
      };
      conclusion: string;
    };
    aviso_sueldos: string;
    pregunta_ia: { pregunta: string; respuesta: string };
    trabajar_ya: {
      intro: string;
      infocal: string;
      tecnicas: string[];
      ruta: string[];
      trabajos: {
        id: string;
        nombre: string;
        descripcion: string;
        que_necesita: string;
        cursos: {
          nombre: string;
          plataforma: string;
          enlace: string | null;
          costo: string;
          descripcion: string;
          estado: string;
        }[];
        herramienta?: string;
        advertencia?: string;
      }[];
      bonus: { nombre: string; descripcion: string }[];
      advertencias: string[];
      donde_buscar: string[];
    };
    cursos_mejora: {
      matematica: {
        titulo: string;
        nota: string;
        cursos: {
          nombre: string;
          plataforma: string;
          enlace: string;
          costo: string;
          descripcion: string;
          recomendado?: boolean;
          videos?: { tema: string; enlace: string }[];
        }[];
      };
      lectura: {
        titulo: string;
        nota: string;
        cursos: {
          nombre: string;
          plataforma: string;
          enlace: string;
          costo: string;
          descripcion: string;
          recomendado?: boolean;
          estado?: string;
        }[];
        habito: string[];
      };
    };
    plazos: { fecha: string; que: string; estado: Estado; fuente: string }[];
    preguntas_frecuentes: { pregunta: string; respuesta: string }[];
    invitacion_testimonios: string;
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-noche dark:text-white sm:text-4xl">
          Tu futuro
        </h1>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
          Terminás el cole, ¿y ahora? Acá están las opciones reales para un
          bachiller de Ixiamas: dónde estudiar, qué becas existen, qué carreras
          piden las empresas y qué trabajos se pueden aprender ya, con cursos
          gratis. Todo con su fuente: si un dato no se pudo verificar, lo dice.
        </p>
        <p className="mt-3 rounded-2xl border border-rio/20 bg-rio/5 px-4 py-3 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
          Última revisión: <strong>{d.ultima_revision}</strong>. Las fechas de
          las convocatorias pasan rápido: si una fecha ya pasó, verificá la
          convocatoria nueva en el enlace oficial de cada institución.
        </p>
      </header>

      <Seccion
        id="donde-estudiar"
        numero="1"
        titulo="Dónde estudiar"
        intro="Estas son las universidades públicas y las rutas técnicas que un bachiller de Ixiamas puede mirar. La más cercana por distancia es la UABJB en Riberalta; la más práctica sin mudarse es la UAP virtual."
      >
        <div>
          <h3 className="font-display text-xl font-bold text-noche dark:text-white">
            ¿Dónde quieres estudiar?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            Los lugares más viables para un bachiller de Ixiamas: lo más
            cercano primero, y las universidades públicas grandes. Tocá un
            punto para ver qué se puede estudiar ahí.
          </p>
          <div className="mt-4">
            <MapaEstudios />
          </div>
        </div>
        <Tarjeta titulo={d.como_entrar.titulo}>
          <p>{d.como_entrar.texto}</p>
          <ul className="flex flex-col gap-2">
            {d.como_entrar.vias.map((via) => (
              <li key={via.nombre}>
                <strong className="text-noche dark:text-white">
                  {via.nombre}:
                </strong>{" "}
                {via.descripcion}
              </li>
            ))}
          </ul>
          <p>{d.como_entrar.nota}</p>
        </Tarjeta>
        {d.instituciones.map((inst) => (
          <Tarjeta key={inst.id} titulo={inst.nombre}>
            <p className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-noche dark:text-white">
                {inst.ciudad}
              </span>
              <EstadoBadge estado={inst.estado} />
            </p>
            <p>
              <strong className="text-noche dark:text-white">
                Cómo se entra:
              </strong>{" "}
              {inst.como_se_entra}
            </p>
            <div>
              <p>
                <strong className="text-noche dark:text-white">
                  Carreras cercanas:
                </strong>
              </p>
              <ul className="mt-1 list-disc pl-5">
                {inst.carreras_cercanas.map((carrera) => (
                  <li key={carrera}>{carrera}</li>
                ))}
              </ul>
            </div>
            <p>
              <strong className="text-noche dark:text-white">Costo:</strong>{" "}
              {inst.costo_examen}
            </p>
            {inst.nota !== "" && <p>{inst.nota}</p>}
            <p>
              Convocatoria oficial:{" "}
              <EnlaceExterno href={inst.enlace}>{inst.enlace}</EnlaceExterno>
            </p>
          </Tarjeta>
        ))}
      </Seccion>

      <Seccion
        id="becas"
        numero="2"
        titulo="Becas"
        intro="Sí, se puede conseguir beca. La más importante es la del Ministerio de Educación, pero hay más. Leé cada una con su estado: algunas están cerradas hasta la próxima convocatoria."
      >
        {d.becas.map((beca) => (
          <Tarjeta key={beca.id} titulo={beca.nombre}>
            <p className="flex flex-wrap items-center gap-2">
              <EstadoBadge estado={beca.estado} />
            </p>
            <p>
              <strong className="text-noche dark:text-white">
                Para quién:
              </strong>{" "}
              {beca.para_quien}
            </p>
            <p>
              <strong className="text-noche dark:text-white">
                Qué cubre:
              </strong>{" "}
              {beca.que_cubre}
            </p>
            <p>{beca.nota}</p>
            <p>
              Fuente oficial:{" "}
              <EnlaceExterno href={beca.fuente}>{beca.fuente}</EnlaceExterno>
            </p>
          </Tarjeta>
        ))}
        <Tarjeta titulo="Lo que no existe (para no buscar en vano)">
          <ul className="list-disc pl-5">
            {d.becas_no_existen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Tarjeta>
        <Tarjeta titulo="Qué necesitás para pedir una beca">
          <ol className="list-decimal pl-5">
            {d.checklist_beca.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </Tarjeta>
      </Seccion>

      <Seccion
        id="carreras-con-futuro"
        numero="3"
        titulo="Carreras con futuro"
        intro="Antes de elegir, mirá qué piden las empresas y cuántos se gradúan en cada carrera. La fuente es la Encuesta de Mercado Laboral del BID (2019), difundida por el IBCE."
      >
        <Tarjeta titulo="Lo que piden las empresas">
          <p>{d.demanda.limite}</p>
          <ul className="list-disc pl-5">
            {d.demanda.areas_mas_demandadas.map((area) => (
              <li key={area.area}>
                <strong className="text-noche dark:text-white">
                  {area.area}:
                </strong>{" "}
                {area.porcentaje} de la demanda
              </li>
            ))}
          </ul>
          <p>
            <strong className="text-noche dark:text-white">
              Las 10 carreras más demandadas:
            </strong>{" "}
            {d.demanda.carreras_mas_demandadas.join(", ")}.
          </p>
          <p>
            <strong className="text-noche dark:text-white">
              Perfiles técnicos más buscados:
            </strong>{" "}
            {d.demanda.perfiles_tecnicos_mas_buscados.join(", ")}.
          </p>
        </Tarjeta>
        <Tarjeta titulo="El problema: hay más titulados que puestos">
          <p>{d.demanda.titulados_por_anio}.</p>
          <p>{d.demanda.demanda_estimada}.</p>
          <p>
            <strong className="text-noche dark:text-white">
              Carreras con más egresados que demanda:
            </strong>{" "}
            {d.demanda.carreras_con_mas_titulados_que_demanda.join(", ")}.
          </p>
          <p>{d.demanda.conclusion}</p>
        </Tarjeta>
        <Tarjeta titulo="El mercado laboral en Bolivia hoy (INE)">
          <ul className="list-disc pl-5">
            <li>
              Desempleo urbano: {d.demanda.contexto_ine.desempleo_urbano};
              desempleo juvenil: {d.demanda.contexto_ine.desempleo_juvenil}.
            </li>
            <li>{d.demanda.contexto_ine.empleo_informal}.</li>
            <li>
              Sectores urbanos con más empleo:{" "}
              {d.demanda.contexto_ine.sectores_con_mas_empleo}.
            </li>
          </ul>
        </Tarjeta>
        <div className="rounded-3xl border-2 border-amber-400/60 bg-amber-50 p-5 shadow-md dark:border-amber-400/30 dark:bg-amber-900/20">
          <h3 className="font-display text-xl font-bold text-noche dark:text-white">
            Ojo con los sueldos de TikTok
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            {d.aviso_sueldos}
          </p>
        </div>
        <Tarjeta titulo={d.pregunta_ia.pregunta}>
          <p>{d.pregunta_ia.respuesta}</p>
        </Tarjeta>
      </Seccion>

      <Seccion
        id="trabajar-ya"
        numero="4"
        titulo="¿Y si quiero trabajar ya?"
        intro={d.trabajar_ya.intro}
      >
        <Tarjeta titulo="La ruta recomendada (para no perderse)">
          <ol className="list-decimal pl-5">
            {d.trabajar_ya.ruta.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </Tarjeta>
        <Tarjeta titulo="Formación técnica rápida">
          <p>{d.trabajar_ya.infocal}</p>
          <ul className="list-disc pl-5">
            {d.trabajar_ya.tecnicas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Tarjeta>
        {d.trabajar_ya.trabajos.map((trabajo) => (
          <Tarjeta key={trabajo.id} titulo={trabajo.nombre}>
            <p>{trabajo.descripcion}</p>
            <p>
              <strong className="text-noche dark:text-white">
                Qué se necesita:
              </strong>{" "}
              {trabajo.que_necesita}
            </p>
            {trabajo.herramienta && <p>{trabajo.herramienta}</p>}
            {trabajo.advertencia && <p>{trabajo.advertencia}</p>}
            <div>
              <p>
                <strong className="text-noche dark:text-white">
                  Cursos gratis:
                </strong>
              </p>
              <ul className="mt-2 flex flex-col gap-3">
                {trabajo.cursos.map((curso) => (
                  <li
                    key={curso.nombre + curso.plataforma}
                    className="rounded-2xl border border-rio/20 px-4 py-3"
                  >
                    <p className="font-bold text-noche dark:text-white">
                      {curso.nombre} — {curso.plataforma}
                    </p>
                    <p className="mt-1">{curso.descripcion}</p>
                    <p className="mt-1">
                      <strong className="text-noche dark:text-white">
                        Costo:
                      </strong>{" "}
                      {curso.costo}
                    </p>
                    {curso.enlace ? (
                      <p className="mt-1">
                        <EnlaceExterno href={curso.enlace}>
                          {curso.enlace}
                        </EnlaceExterno>
                      </p>
                    ) : (
                      <p className="mt-1">
                        Sin enlace directo: ver la descripción.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Tarjeta>
        ))}
        <Tarjeta titulo="Bonus: otros trabajos sin curso largo">
          <ul className="list-disc pl-5">
            {d.trabajar_ya.bonus.map((item) => (
              <li key={item.nombre}>
                <strong className="text-noche dark:text-white">
                  {item.nombre}:
                </strong>{" "}
                {item.descripcion}
              </li>
            ))}
          </ul>
        </Tarjeta>
        <div className="rounded-3xl border-2 border-red-400/60 bg-red-50 p-5 shadow-md dark:border-red-400/30 dark:bg-red-900/20">
          <h3 className="font-display text-xl font-bold text-noche dark:text-white">
            Antes de empezar: leé esto
          </h3>
          <ul className="mt-3 list-disc pl-5 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            {d.trabajar_ya.advertencias.map((aviso) => (
              <li key={aviso}>{aviso}</li>
            ))}
          </ul>
        </div>
        <Tarjeta titulo="Dónde buscar trabajo">
          <ul className="list-disc pl-5">
            {d.trabajar_ya.donde_buscar.map((lugar) => (
              <li key={lugar}>{lugar}</li>
            ))}
          </ul>
        </Tarjeta>
      </Seccion>

      <Seccion
        id="mejorar"
        numero="5"
        titulo="Mejorar en matemática y en lectura"
        intro="Antes de cualquier carrera o trabajo, las bases. Todo desde cero, en español, en video, gratis."
      >
        <Tarjeta titulo={d.cursos_mejora.matematica.titulo}>
          <p>{d.cursos_mejora.matematica.nota}</p>
          <ul className="flex flex-col gap-3">
            {d.cursos_mejora.matematica.cursos.map((curso) => (
              <li
                key={curso.nombre + curso.plataforma}
                className="rounded-2xl border border-rio/20 px-4 py-3"
              >
                <p className="font-bold text-noche dark:text-white">
                  {curso.nombre} — {curso.plataforma}
                  {curso.recomendado && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                      Recomendado
                    </span>
                  )}
                </p>
                <p className="mt-1">{curso.descripcion}</p>
                <p className="mt-1">
                  <strong className="text-noche dark:text-white">
                    Costo:
                  </strong>{" "}
                  {curso.costo}
                </p>
                <p className="mt-1">
                  <EnlaceExterno href={curso.enlace}>
                    {curso.enlace}
                  </EnlaceExterno>
                </p>
                {curso.videos && (
                  <ul className="mt-2 list-disc pl-5">
                    {curso.videos.map((video) => (
                      <li key={video.tema}>
                        {video.tema}:{" "}
                        <EnlaceExterno href={video.enlace}>
                          {video.enlace}
                        </EnlaceExterno>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Tarjeta>
        <Tarjeta titulo={d.cursos_mejora.lectura.titulo}>
          <p>{d.cursos_mejora.lectura.nota}</p>
          <ul className="flex flex-col gap-3">
            {d.cursos_mejora.lectura.cursos.map((curso) => (
              <li
                key={curso.nombre + curso.plataforma}
                className="rounded-2xl border border-rio/20 px-4 py-3"
              >
                <p className="font-bold text-noche dark:text-white">
                  {curso.nombre} — {curso.plataforma}
                  {curso.recomendado && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                      Recomendado
                    </span>
                  )}
                </p>
                <p className="mt-1">{curso.descripcion}</p>
                <p className="mt-1">
                  <strong className="text-noche dark:text-white">
                    Costo:
                  </strong>{" "}
                  {curso.costo}
                </p>
                <p className="mt-1">
                  <EnlaceExterno href={curso.enlace}>
                    {curso.enlace}
                  </EnlaceExterno>
                </p>
              </li>
            ))}
          </ul>
          <p>
            <strong className="text-noche dark:text-white">
              El hábito (sin curso, lo más importante):
            </strong>
          </p>
          <ul className="list-disc pl-5">
            {d.cursos_mejora.lectura.habito.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ul>
        </Tarjeta>
      </Seccion>

      <Seccion
        id="calendario"
        numero="6"
        titulo="Calendario de convocatorias"
        intro="Fechas verificadas al 22 de noviembre de 2026. Si una fecha ya pasó, verificá la convocatoria nueva en el enlace oficial."
      >
        <div className="overflow-x-auto rounded-3xl border-2 border-rio/20 bg-white shadow-md dark:border-white/10 dark:bg-noche-claro">
          <table className="w-full min-w-[540px] text-left text-sm leading-relaxed">
            <thead>
              <tr className="border-b border-rio/20 text-noche dark:text-white">
                <th className="px-4 py-3 font-bold">Fecha</th>
                <th className="px-4 py-3 font-bold">Qué</th>
                <th className="px-4 py-3 font-bold">Estado</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-white/85">
              {d.plazos.map((plazo) => (
                <tr
                  key={plazo.que}
                  className="border-b border-rio/10 last:border-b-0"
                >
                  <td className="px-4 py-3 font-bold text-noche dark:text-white">
                    {plazo.fecha}
                  </td>
                  <td className="px-4 py-3">{plazo.que}</td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={plazo.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>

      <Seccion
        id="preguntas"
        numero="7"
        titulo="Preguntas frecuentes"
        intro="Las preguntas que más se hacen los jóvenes en redes, respondidas con los datos de esta página."
      >
        {d.preguntas_frecuentes.map((item) => (
          <Tarjeta key={item.pregunta} titulo={item.pregunta}>
            <p>{item.respuesta}</p>
          </Tarjeta>
        ))}
      </Seccion>

      <section className="mt-12 rounded-3xl border-2 border-rio/20 bg-rio/5 p-5 shadow-md dark:border-white/10 dark:bg-noche-claro">
        <h2 className="font-display text-2xl font-extrabold text-noche dark:text-white">
          ¿Ya terminaste el cole?
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
          {d.invitacion_testimonios}
        </p>
        <p className="mt-3">
          <Link
            href="/buzon"
            className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
          >
            Contanos por el Buzón →
          </Link>
        </p>
      </section>

      <p className="mt-10 text-sm leading-relaxed text-neutral-500 dark:text-white/60">
        Fuente de los datos: informe de educación superior y becas en Bolivia
        (fuentes oficiales, 22-nov-2026) y listado de trabajos modernos con
        cursos online (22-nov-2026). Ningún dato de esta página fue inventado:
        lo no verificado se marca como «por confirmar».
      </p>
    </main>
  );
}
