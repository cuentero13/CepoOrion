# Carpeta `data/` — contenido editable sin programar

Los archivos de esta carpeta son el **banco de contenido** del sitio. La
dirección o un docente los edita con un editor de texto o de JSON; el sitio
los lee tal cual.

## Regla de oro

**No inventar datos.** Todo lo que va aquí debe ser real y verificable. Lo
que falte se marca `[COMPLETAR]` y lo dudoso `[VERIFICAR]`.

## Archivos

| Archivo | Uso | Estado |
|---|---|---|
| `horarios.json` | Tabla de horarios por nivel, turno y materia | Esqueleto con `[COMPLETAR]` |
| `preguntas.json` | Banco de preguntas del examen diagnóstico | 68 preguntas: 10 por área + 2 de división (MAT-1-004/005) + 6 de lógica (LOG-*) (fase h) |
| `actitudes.json` | Cuestionario de actitudes y hábitos | Fase (d) |
| `vocacional.json` | Cuestionario vocacional RIASEC (18 ítems) | Fase (h) |
| `despues-del-cole.json` | Contenido de «Tu futuro»: universidades, becas, plazos, demanda, trabajos y cursos | Fase (h) — última revisión 22-nov-2026 |
| `juegos/` | (fase e) Bancos de datos de los 6 juegos, un archivo por juego | Fase (e) — contenido real verificado, 19-nov-2026 |
| `juegos/madidi.json` | Trivia fauna/flora de Madidi | 12 preguntas (MAD-001–012), fuente SERNAP |
| `juegos/presupuesto.json` | Simulador de educación financiera en bolivianos | 10 escenarios (PRE-001–010), fuente BCB; montos de ejemplo, no precios oficiales |
| `juegos/detective.json` | Identificar desinformación | 12 casos (DET-001–012), 8 falsos / 4 verdaderos |
| `juegos/primeros-auxilios.json` | Decisiones ante emergencias | 12 preguntas (PAU-001–012), fuente Cruz Roja / OPS; nunca remedios caseros |
| `juegos/mapa.json` | Geografía de Bolivia | 14 preguntas (MAP-001–014), fuente INE |
| `juegos/constelaciones.json` | Astronomía básica, Orión protagonista | 12 preguntas (CON-001–012), fuente UAI; mejor visibilidad de Orión en enero, verificada 19-nov-2026 (Wikipedia + Meteored) |

## `horarios.json`

Dos secciones:

- **`niveles`**: el horario REAL. Hoy solo tiene marcadores
  `[COMPLETAR]`. Cuando la dirección entregue los horarios definitivos, se
  reemplazan los marcadores y la página `/horarios` muestra
  automáticamente el horario real (y deja de mostrar el ejemplo).
- **`ejemplo`**: una tabla de ejemplo que muestra solo el FORMATO. Las
  materias, horas y turnos son inventados para ilustrar el diseño y NO son
  el horario real de CEPO. No editar salvo que se quiera cambiar el ejemplo.

```json
{
  "nota": "…",
  "niveles": [
    {
      "nivel": "1ro de Secundaria",
      "turno": "[COMPLETAR: mañana/tarde]",
      "dias": [
        { "dia": "Lunes", "bloques": [
          { "hora": "[COMPLETAR: 08:00–08:45]", "materia": "[COMPLETAR]", "docente": "[COMPLETAR]" }
        ]}
      ]
    }
  ],
  "ejemplo": { "aviso": "EJEMPLO — …", "niveles": [ … ] }
}
```

La página tiene vista **Hoy** (según el día actual) y vista **Semana**.

## `preguntas.json`

Cada pregunta tiene obligatoriamente estos campos:

| Campo | Descripción |
|---|---|
| `id` | Identificador único, ej. `MAT-1-001` |
| `area` | `Matemática`, `Lenguaje`, `Ciencias Naturales`, `Ciencias Sociales`, `Inglés` o `Filosofía` |
| `nivel` | `1` (fácil), `2` (medio) o `3` (difícil) — para la dificultad adaptativa |
| `pregunta` | Enunciado |
| `opciones` | 4 opciones |
| `respuesta_correcta` | Índice (0–3) de la opción correcta |
| `justificacion` | Por qué esa es la respuesta correcta |
| `fuente` | Fuente verificable (ver `docs/guia-contenido-fuentes.md`) |

**Ejemplo real incluido en el archivo:** `MAT-1-001` (multiplicación básica,
fuente: Currículo Base del Ministerio de Educación de Bolivia, Matemática).

El examen usa 6 preguntas por área y dificultad adaptativa: empieza en
nivel 2, sube con cada acierto y baja con cada error (ver
`lib/diagnostico.ts`). Por eso cada área necesita preguntas en los tres
niveles.

## `actitudes.json`

Cuestionario de actitudes y hábitos de estudio (escala Likert 1–5).
Herramienta **orientativa**, no un diagnóstico psicológico.

| Campo | Descripción |
|---|---|
| `nota` | Nota general del cuestionario |
| `instrumentos_referencia` | Instrumentos reconocidos en los que se basa (MSLQ, IHE) |
| `aviso` | Aviso claro de que es orientativo, no psicológico |
| `escala` | Valores 1–5 con su etiqueta (Nunca…Siempre) |
| `dimensiones` | 6 dimensiones × 4 ítems (`id`, `nombre`, `descripcion`, `items`) |
| `interpretacion.bandas` | 3 bandas positivas según el promedio (1–2,99 / 3–3,99 / 4–5) |
| `sugerencias` | 3 sugerencias prácticas por dimensión, contextualizadas a Ixiamas |

Cada ítem tiene `id`, `texto` e `invertida` (si es `true`, se puntúa al
revés: 6 − valor). Dimensiones: Hábitos de estudio, Motivación,
Autorregulación, Manejo del tiempo, Trabajo en equipo, Proyecto de vida.

## `juegos/*.json` (fase e)

Un archivo por juego en `data/juegos/`. **No cambiar los nombres de
los campos**: la interfaz los lee tal cual (ver `lib/juegos.ts` para
el esquema completo en TypeScript).

| Archivo | Contenido |
|---|---|
| `madidi.json` | Aventura Madidi — preguntas con 4 opciones |
| `primeros-auxilios.json` | Primeros auxilios — situación + pregunta con 4 opciones |
| `mapa.json` | Mapa de Bolivia — preguntas con 4 opciones |
| `constelaciones.json` | Constelaciones — preguntas con 4 opciones |
| `detective.json` | Detective de noticias — casos verdadero/falso |
| `presupuesto.json` | Mi primer presupuesto — escenarios con ingreso, meta y categorías |

### Preguntas (`madidi`, `mapa`, `constelaciones`)

```json
{
  "juego": "madidi",
  "titulo": "Aventura Madidi",
  "descripcion": "…",
  "fuente_general": "SERNAP — Parque Nacional Madidi.",
  "preguntas": [
    {
      "id": "MAD-001",
      "pregunta": "…",
      "opciones": ["…", "…", "…", "…"],
      "respuesta_correcta": 0,
      "justificacion": "Por qué esa es la respuesta correcta.",
      "fuente": "Fuente verificable de esta pregunta."
    }
  ]
}
```

`respuesta_correcta` es el índice (0–3) de la opción correcta.
`justificacion` y `fuente` se muestran después de responder.

### Primeros auxilios (`primeros-auxilios.json`)

Igual que arriba, pero cada ítem lleva además `situacion` (lo que
está pasando, antes de la pregunta):

```json
{ "id": "PA-001", "situacion": "…", "pregunta": "…", "opciones": ["…","…","…","…"], "respuesta_correcta": 0, "justificacion": "…", "fuente": "…" }
```

### Detective (`detective.json`)

```json
{
  "juego": "detective",
  "titulo": "Detective de noticias",
  "descripcion": "…",
  "fuente_general": "…",
  "casos": [
    {
      "id": "DET-001",
      "titular": "…",
      "texto": "…",
      "es_verdadera": true,
      "pistas": ["Pista 1…", "Pista 2…"],
      "explicacion": "Por qué es verdadera o falsa.",
      "fuente": "Fuente verificable del caso."
    }
  ]
}
```

### Presupuesto (`presupuesto.json`)

```json
{
  "juego": "presupuesto",
  "titulo": "Mi primer presupuesto",
  "descripcion": "…",
  "fuente_general": "…",
  "escenarios": [
    {
      "id": "PRE-001",
      "titulo": "…",
      "descripcion": "…",
      "ingreso_mensual_bs": 500,
      "meta_ahorro_bs": 100,
      "categorias": [
        { "nombre": "Comida", "sugerencia_bs": 200, "consejo": "…" }
      ],
      "pregunta": "¿Qué decisión tomás este mes?",
      "opciones": [
        { "texto": "…", "ahorro_bs": 100, "justificacion": "…" }
      ],
      "respuesta_correcta": 0,
      "fuente": "…"
    }
  ]
}
```

`ahorro_bs` es cuánto se ahorra con esa decisión; la insignia
«Presupuesto en orden» se gana cuando el ahorro elegido llega a la
`meta_ahorro_bs` en al menos un escenario.

### Cómo añadir ítems sin programar

1. Abrir el JSON del juego con un editor de texto.
2. Copiar un ítem existente y cambiarle el `id` (único) y el contenido.
3. Guardar: el sitio muestra el ítem nuevo sin tocar código.
4. Las insignias de rendimiento piden al menos el 80% de aciertos
   (8 de 10). Los juegos actuales tienen entre 10 y 14 ítems, así que
   con 12 ítems hacen falta 10 aciertos y con 14 hacen falta 12.

## `vocacional.json` (fase h)

Cuestionario vocacional RIASEC: 18 ítems (3 por dimensión: Realista,
Investigativo, Artístico, Social, Emprendedor, Convencional), escala
Likert 1–5 (Nada / Poco / Más o menos / Bastante / Mucho). Bandas de
interpretación: ≥4 interés fuerte, 3–3,99 medio, <3 bajo. Lleva un aviso
claro: es solo orientativo, no decide por el estudiante. Las familias de
carreras y el cruce con el diagnóstico viven en `lib/vocacional.ts`
(ver `docs/plan-fase-h-orientacion.md` §4–§5).

## `despues-del-cole.json` (fase h)

Contenido de la página pública `/futuro` («Tu futuro»): universidades,
becas, plazos, demanda laboral, trabajos modernos con cursos gratis y
cursos para mejorar en matemática y en lectura. Cada entrada lleva
`fuente` (URL oficial), `verificado` (fecha de la última revisión) y
`estado` (`vigente` | `cerrado` | `por confirmar`).

- **CERO sueldos por carrera:** ningún organismo público de Bolivia
  publica sueldos por carrera. La página lleva un aviso que lo dice.
- **Actualización:** las convocatorias 2027 del MinEdu (becas y ESFM)
  se revisan en diciembre de 2026 en `minedu.gob.bo`. Al actualizar una
  fecha, cambiar su `estado` y su `verificado`, y quitar el marcador
  correspondiente de `config/institucion.json` → `despues_del_cole`.
- Los marcadores nuevos de esta fase están en
  `docs/marcadores-pendientes.md` (sección fase h).

## Fuentes obligatorias

Ver `docs/guia-contenido-fuentes.md`: currículo del Ministerio de Educación
de Bolivia, INE, SERNAP y datos oficiales del Parque Nacional Madidi.
