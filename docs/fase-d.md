# Fase (d) — Exámenes diagnóstico y de actitudes — reporte

**Fecha:** 19-nov-2026. **Estado:** código completo, build verificado,
flujos probados en local, push a GitHub según sección «Despliegue» abajo.

## Hecho

### Examen diagnóstico académico (`/diagnostico`)

- **Banco de preguntas** (`data/preguntas.json`): **50 preguntas, 10 por
  área** — Matemática, Lenguaje, Ciencias Naturales, Ciencias Sociales,
  Inglés — distribución nivel 1 ×3, nivel 2 ×4, nivel 3 ×3 por área.
  Cada pregunta lleva `fuente` y `justificacion` obligatorias. Fuentes:
  Currículo Base del Ministerio de Educación de Bolivia (R.M. 1040/2022,
  Planes y Programas de Educación Secundaria Comunitaria Productiva),
  SERNAP (Madidi, D.S. N.º 24123, 21-sep-1995, ≈1.895.750 ha) e INE
  (departamentos, capitales, hidrografía). Las 50 respuestas correctas
  fueron revisadas una por una por el coordinador (cálculos, gramática,
  datos de Madidi, ríos y fechas verificados contra la investigación de
  la fase).
- **Motor adaptativo** (`lib/diagnostico.ts`, funciones puras): 6
  preguntas por área; empieza en dificultad 2, sube con cada acierto y
  baja con cada error; sin repeticiones (con respaldo al nivel más
  cercano cuando un nivel se agota). Nivel por puntaje ponderado por
  dificultad: ≥80 Avanzado, ≥60 Intermedio, ≥40 Básico, <40 Inicial.
  Recomendaciones de estudio por área y por nivel, en lenguaje positivo.
- **Flujo** (`app/diagnostico/ExamenDiagnostico.tsx`): elegir área →
  6 preguntas con retroalimentación inmediata (justificación + fuente) →
  resultado del área (nivel, puntaje, revisión pregunta por pregunta) →
  resumen general con **gráfico radar por área** (`components/GraficoRadar.tsx`,
  SVG sin librerías, con lista accesible de valores). No hace falta
  cuenta para hacerlo.
- **Guardado** (`app/api/diagnostico/route.ts`): inserta en la tabla
  `diagnosticos` cuando hay sesión y Supabase; si no, responde
  `{ok: true, guardado: false}` y el resultado igual se muestra en
  pantalla (aviso claro en la interfaz).

### Cuestionario de actitudes y hábitos (`/actitudes`)

- **Contenido** (`data/actitudes.json`): 6 dimensiones × 4 ítems = **24
  ítems Likert 1–5** (Nunca…Siempre), 1 ítem invertido por dimensión.
  Dimensiones: Hábitos de estudio, Motivación, Autorregulación, Manejo
  del tiempo, Trabajo en equipo, Proyecto de vida. Basado en
  instrumentos reconocidos: MSLQ (Pintrich, Smith, García y McKeachie,
  1991) e Inventario de Hábitos de Estudio — IHE (Pozar); ítems
  adaptados al contexto de Ixiamas (estudiar sin internet, tareas del
  hogar o del campo, agroforestería, ecoturismo, castaña, salud,
  educación).
- **Aviso claro** en la página: es una herramienta orientativa, **no un
  diagnóstico psicológico**; si algo preocupa, hablar con un docente o
  la familia.
- **Resultados** (`app/actitudes/CuestionarioActitudes.tsx`): promedio
  por dimensión (ítems invertidos: 6 − valor), bandas en lenguaje
  positivo — «Una fortaleza» (≥4), «Buen camino» (3–3,99), «Un espacio
  para crecer» (<3) — sin etiquetas negativas, con 3 sugerencias
  prácticas por dimensión.
- **Guardado** (`app/api/actitudes/route.ts`): inserta en la tabla
  `actitudes` cuando hay sesión y Supabase; si no, mismo patrón
  `guardado: false` sin fallar.

### Mi progreso (`/progreso`)

- Los textos que decían «llegan en la próxima fase» ahora enlazan a
  `/diagnostico` y `/actitudes`. La tarjeta «Evolución por área»
  muestra el **gráfico radar con el último diagnóstico por área** (áreas
  pendientes marcadas «Pendiente») además de la lista. La lectura de
  `actitudes` ya existía y sigue funcionando.

### Navegación

- `components/Nav.tsx`: enlace nuevo «Actitudes» después de
  «Diagnóstico» (menú de escritorio y móvil).

## Verificación

- `npm run build`: **OK**, 16 páginas, First Load JS 103–180 kB (meta
  < 1 MB cumplida).
- Servidor de producción local (puerto 3104): `/`, `/diagnostico`,
  `/actitudes`, `/progreso` — todos **200**. Contenido comprobado:
  «Descubrí tu nivel» en `/diagnostico`; «orientativo» y «no es un
  diagnóstico psicológico» en `/actitudes`; «Configuración pendiente»
  en `/progreso` (sin Supabase, como corresponde).
- `POST /api/diagnostico` y `POST /api/actitudes` → **200**
  `{ok: true, guardado: false, motivo: "sin_supabase"}` (sin proyecto
  Supabase, el resultado se muestra igual sin fallar).
- `GET /api/diagnostico` → 405 (solo POST, correcto).
- **Motor adaptativo** (test en `/tmp/test-motor.mjs`, Node 24): en las
  5 áreas, todo-bien → 100/Avanzado, todo-mal → 0/Inicial, mixto →
  60/Intermedio, sin preguntas repetidas; umbrales y nivel general
  verificados. Nota: con 3 preguntas de nivel 3 por área, un estudiante
  que acierta todo agota el nivel 3 en la 4.ª pregunta y el motor baja
  al nivel más cercano disponible (comportamiento previsto y documentado
  en `lib/diagnostico.ts`); la evaluación sigue siendo válida.

## Pendiente (no es código, es configuración de Mike)

- **Proyecto Supabase sin crear.** Sin esto, login, progreso, buzón y el
  guardado de exámenes muestran el aviso de configuración pendiente (ver
  `docs/supabase-setup.md`).
- **Vercel:** ver sección «Despliegue».

## Despliegue

- **Repo:** https://github.com/cuentero13/CepoOrion — ramas `main` y `dev`.
- **Push fase (d):** (completar con SHA y fecha al hacer el push).
- **Vercel:** (completar: bloqueado por acceso al equipo `cuentero13`
  salvo que se haya autorizado; ver `docs/fase-c.md`).

## Pendientes de datos reales (dirección)

Ver `config/institucion.json`: dirección exacta, correo oficial, horarios
definitivos, misión, visión, valores, historia, plantel docente, redes
sociales, horario de atención, logo oficial. WhatsApp por confirmar
(`[VERIFICAR]`). Lema propuesto pendiente de aprobación de Mike.
