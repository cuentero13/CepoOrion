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
| `preguntas.json` | Banco de preguntas del examen diagnóstico | Esquema + 1 pregunta de ejemplo |
| `actitudes.json` | (fase d) Cuestionario de actitudes y hábitos | Pendiente |
| `juegos.json` | (fase e) Preguntas de los juegos | Pendiente |

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
| `area` | `Matemática`, `Lenguaje`, `Ciencias Naturales`, `Ciencias Sociales` o `Inglés` |
| `nivel` | `1` (fácil), `2` (medio) o `3` (difícil) — para la dificultad adaptativa |
| `pregunta` | Enunciado |
| `opciones` | 4 opciones |
| `respuesta_correcta` | Índice (0–3) de la opción correcta |
| `justificacion` | Por qué esa es la respuesta correcta |
| `fuente` | Fuente verificable (ver `docs/guia-contenido-fuentes.md`) |

**Ejemplo real incluido en el archivo:** `MAT-1-001` (multiplicación básica,
fuente: Currículo Base del Ministerio de Educación de Bolivia, Matemática).

## Fuentes obligatorias

Ver `docs/guia-contenido-fuentes.md`: currículo del Ministerio de Educación
de Bolivia, INE, SERNAP y datos oficiales del Parque Nacional Madidi.
