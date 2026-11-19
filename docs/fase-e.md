# Fase (e) — Juegos de conocimiento útil — reporte

**Fecha:** 19-nov-2026. **Estado:** código completo, build verificado,
flujos probados en local contra los datos reales (72 ítems).

## Hecho

### Los 6 juegos (`/juegos`, rutas `/juegos/<juego>`)

| Juego | Ruta | Ítems reales | Contenido |
|---|---|---|---|
| Aventura Madidi | `/juegos/madidi` | 12 preguntas | Madidi, SERNAP, Ixiamas |
| Mi primer presupuesto | `/juegos/presupuesto` | 10 escenarios | Educación financiera en Bs |
| Detective de noticias | `/juegos/detective` | 12 casos | Verdadero/falso con pistas |
| Primeros auxilios | `/juegos/primeros-auxilios` | 12 situaciones | Situación + pregunta |
| Mapa de Bolivia | `/juegos/mapa` | 14 preguntas | Departamentos, capitales, ríos |
| Constelaciones | `/juegos/constelaciones` | 12 preguntas | Orión, cielo del sur |

- **Datos** (`data/juegos/*.json`, 72 ítems verificados, esquema
  validado sin errores): los crea y mantiene el trabajador de
  contenido. La interfaz NO los toca: los lee con import estático
  (`lib/juegos-datos.ts`). Esquema y cómo añadir ítems sin programar:
  ver `data/README.md` (sección `juegos/*.json`).
- **Jugadores** (`components/juegos/`): `JuegoPreguntas.tsx` (los 4
  juegos de 4 opciones; Primeros auxilios muestra además la
  `situacion`), `JuegoDetective.tsx` (Verdadera/Falsa; tras elegir se
  ven explicación, pistas y fuente) y `JuegoPresupuesto.tsx` (muestra
  ingreso mensual, meta de ahorro y categorías con su consejo; cada
  opción muestra cuánto se ahorra con esa decisión).
- **Flujo de partida:** una pregunta/caso/escenario por vez, botones
  grandes, retroalimentación inmediata con justificación y fuente,
  barra de progreso, `aria-live` (`role="status"`) en el resultado de
  cada respuesta, navegación por teclado (botones nativos, foco
  visible, `autoFocus` en «Siguiente»). Al final: puntaje, insignias
  ganadas, confeti solo CSS y botones para repetir, ver los juegos o
  ir a Mi progreso.
- **Confeti** (`components/juegos/Confeti.tsx` + `.confeti-pieza` en
  `app/globals.css`): solo CSS, sin librerías. Si el usuario prefiere
  movimiento reducido (`prefers-reduced-motion`), no se muestra nada
  (además la regla global de `globals.css` anula animaciones).
- **Iconos:** SVG inline (`components/juegos/IconoJuego.tsx`). La
  interfaz no usa emojis.
- **Catálogo** (`/juegos`, `components/juegos/ListaJuegos.tsx`):
  tarjetas con título, descripción, mejor puntaje local, partidas
  jugadas y nivel global. El progreso local se lee solo en el cliente
  (localStorage no existe en el servidor).

### Sistema de puntos, niveles e insignias (`lib/juegos.ts`)

- **Puntos:** +10 por acierto, +5 extra por partida perfecta (sin
  fallos). Funciones puras: `calcularPuntos(aciertos, total)`,
  `nivelDesdePuntos(puntos)` = `1 + floor(puntos / 100)`,
  `insigniasGanadas(partida)`.
- **Insignias** (IDs estables, con nombre y descripción en
  `INSIGNIAS`):
  - `explorador-madidi` — completar Aventura Madidi.
  - `presupuesto-en-orden` — ahorrar ≥ meta en un escenario.
  - `ojo-critico` — ≥80% en Detective de noticias.
  - `guardian` — ≥80% en Primeros auxilios.
  - `cartografo` — ≥80% en Mapa de Bolivia.
  - `cazador-de-orion` — ≥80% en Constelaciones.
  - `estrella-cepo` — 100 puntos totales.
  - El umbral es el 80% (no 8 fijo): los juegos tienen 10–14 ítems,
    así que con 12 ítems hacen falta 10 aciertos y con 14 hacen falta
    12. Ver `cumpleOchoDeDiez` en `lib/juegos.ts`.
- **Guardado** (`guardarPartida`, nunca lanza): siempre guarda en
  localStorage (clave `cepo_juegos_v1`: por juego puntos, insignias,
  partidas, mejor puntaje/aciertos) y, si hay sesión Supabase,
  además hace upsert en `public.progreso_juegos` (`user_id, juego,
  puntos, insignias, nivel`, `onConflict: "user_id,juego"`) con el
  cliente navegador y `auth.getUser()` (patrón de `lib/auth.ts`). Sin
  Supabase o sin sesión, el resultado igual se muestra en pantalla y
  queda guardado en el dispositivo. La tabla ya existía en la
  migración `supabase/migrations/0001_cepo_schema.sql` (RLS: solo el
  dueño; docentes/admin leen).
- **SIN ranking público:** en ningún lado se muestran puntos de otros
  usuarios; cada estudiante solo ve lo suyo.

### Mi progreso (`/progreso`)

- Nueva sección «Mis juegos» (`components/SeccionJuegosProgreso.tsx`,
  cliente): puntos totales, nivel global, insignias con nombre y
  descripción, y puntos por juego. Lee las filas de Supabase que el
  servidor ya cargaba cuando hay sesión; en caso contrario (sin
  Supabase o sin sesión) lee localStorage, solo en cliente, sin romper
  el render en servidor. La sección aparece también en las pantallas
  de «Configuración pendiente» y «entra con tu cuenta», para que el
  progreso local se vea siempre.
- La tarjeta «Insignias» existente ahora muestra los nombres de las
  insignias (antes los IDs) y su texto vacío enlaza a `/juegos`. El
  resto de la página quedó intacto.

## Verificación

- `npm run build`: **OK** — compilado en 8,5 s, 22 páginas, sin
  errores de tipos ni de lint. `/juegos` estática y `/juegos/[juego]`
  (SSG) con las 6 rutas. First Load JS: `/juegos` 180 kB,
  `/juegos/[juego]` 183 kB (meta < 1 MB cumplida).
- Servidor de producción local (puerto 3105): `/juegos`, las 6 rutas
  de juego y `/progreso` responden **200**; `/juegos/noexiste`
  responde **404**. El HTML servido incluye el título y la primera
  pregunta/caso/escenario real de cada juego (madidi Q1 con sus 4
  opciones, detective con botones Verdadera/Falsa, presupuesto con
  ingreso Bs 1.500 y meta Bs 150, primeros auxilios con su situación).
  En `/progreso` aparece la sección «Mis juegos» con el estado vacío
  («Aún no jugaste») junto al aviso «Configuración pendiente».
  (Nota: en el HTML servido los textos dinámicos llevan separadores
  `<!-- -->` de React — p. ej. `Pregunta <!-- -->1<!-- --> de
  <!-- -->12` — por eso las búsquedas literales de «Pregunta 1 de 12»
  no coinciden; el contenido sí está renderizado.)
- **Funciones puras** (test en `/tmp/test-juegos.cjs`, compilado con
  `tsc` a CommonJS temporal): **29 aserciones, todas pasaron** —
  puntos (0, 10, 90, perfecta 105/125, total 0 → 0), niveles (0→1,
  99→1, 100→2, 200→3), insignias (cada juego en su umbral y por
  debajo, presupuesto por meta con y sin aciertos, estrella a los 100
  puntos) y `guardarPartida` sin Supabase (125 puntos, nivel 2,
  `guardado: "local"`, insignias nuevas correctas).
- **Flujo de partida simulado** (mismo test): partida perfecta de
  Madidi (12/12 → 125 puntos, insignia `explorador-madidi` +
  `estrella-cepo` al superar 100) y partida 8/12 de Detective (sin
  `ojo-critico`, porque el 80% con 12 casos son 10 aciertos).
- **Datos reales verificados antes del build:** 72 ítems, 0
  ocurrencias de «EJEMPLO» en `data/juegos/`, esquema validado sin
  errores (opciones = 4, `respuesta_correcta` 0–3, `es_verdadera`
  booleano, montos numéricos, IDs únicos).
- **No verificado con navegador real:** el clic a clic (elegir
  respuesta → ver justificación → siguiente → resultado con confeti)
  se verificó por inspección del render HTML y por las funciones
  puras; no hubo sesión de navegador interactiva disponible para
  esta fase. El flujo de guardado en Supabase tampoco se pudo probar
  de punta a punta porque el proyecto Supabase sigue sin crearse
  (ver «Pendiente»).

## Pendiente (no es código, es configuración de Mike)

- **Proyecto Supabase sin crear.** Sin esto, login, progreso y el
  guardado de juegos muestran el aviso de configuración pendiente y
  el progreso queda solo en localStorage del dispositivo (ver
  `docs/supabase-setup.md`). La tabla `progreso_juegos` ya está en
  la migración 0001, lista para cuando se cree el proyecto.
- **Vercel:** bloqueado como en la fase (d) — la integración de Muse
  no está autorizada para el equipo `cuentero13` (403 en
  `list_projects`); lo debe autorizar Mike en el panel de Vercel.
  Ver `docs/fase-d.md`, sección «Despliegue».

## Despliegue

- **Repo:** https://github.com/cuentero13/CepoOrion — ramas `main` y `dev`.
- **Push fase (e):** pendiente (lo hace el orquestador o Mike; esta
  fase solo entrega el código en el workspace).
