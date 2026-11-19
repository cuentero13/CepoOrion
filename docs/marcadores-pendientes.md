# Marcadores pendientes — CEPO (lista final consolidada)

> **Fecha de la lista:** 19-nov-2026 (fase f).
> **Cómo se hizo:** búsqueda con `grep` en todo el repositorio (excepto
> `node_modules` y `.next`), patrón `[COMPLETAR...]` y `[VERIFICAR...]`.
>
> **Totales vigentes: 64 marcadores — 50 `[COMPLETAR]` y 14 `[VERIFICAR]`.**
> (Antes de esta fase eran 67: los 3 `[VERIFICAR]` de
> `data/juegos/constelaciones.json` — ítem CON-010 — quedaron
> **resueltos** el 19-nov-2026; ver
> [Resueltos en esta fase](#resueltos-en-esta-fase).)
>
> **Ojo al volver a contar con grep:** este conteo (64) **excluye** este
> archivo y `docs/manual-docente.md`, que citan los marcadores como
> documentación (101 menciones entre los dos). Un grep ingenuo sobre
> todo el repo da 165: 64 pendientes reales + 101 citas en estos dos
> documentos nuevos. Para repetir el conteo, excluya ambos archivos:
> `grep -rn --exclude-dir=node_modules --exclude-dir=.next --exclude=manual-docente.md --exclude=marcadores-pendientes.md -o -E '\[(COMPLETAR|VERIFICAR)[^]]*\]' .`
>
> **Ocurrencias vs. hechos:** un mismo hecho pendiente puede aparecer
> en varios archivos (por ejemplo, lo de WhatsApp está en 3 archivos).
> Esta lista cuenta **ocurrencias** (64). Los hechos distintos son
> menos; se indica en cada caso.
>
> **Dos tipos de entradas:**
> - **A. Dato pendiente real:** falta un dato o una confirmación. Es lo
>   que hay que resolver.
> - **B. Mención en documentación o código:** el texto solo *habla* de
>   los marcadores (explica la regla, describe el estado o es el código
>   que los detecta). No es un dato pendiente: se actualiza o se
>   resuelve sola cuando se resuelve el dato real.

---

## Resueltos en esta fase

| Dónde estaba | Marcador resuelto | Cómo se verificó |
|---|---|---|
| `data/juegos/constelaciones.json` — descripción del juego | `[VERIFICAR: confirmar el mes exacto de mejor visibilidad desde Ixiamas con el Observatorio Astronómico Nacional de Tarija o un planetario antes de publicar esta pregunta como dato cerrado]` | Confirmado con fuentes públicas (ver abajo). Texto nuevo: "en verano austral (diciembre a febrero) se ve alta en el cielo al anochecer; su mejor mes es enero, alrededor de las 21:00". |
| `data/juegos/constelaciones.json` — CON-010, justificación | `[VERIFICAR: confirmar el mes exacto de mejor visibilidad desde Ixiamas con el Observatorio Astronómico Nacional de Tarija antes de publicar este dato como cerrado]` | Idem. Justificación nueva con el matiz por mes (diciembre: aparece tras el atardecer; enero: punto más alto ~21:00; febrero: alta al anochecer). |
| `data/juegos/constelaciones.json` — CON-010, opción correcta | `[VERIFICAR]` (al final de "En verano austral (diciembre a febrero), alta al anochecer") | Idem. Opción correcta sin cambios de contenido, solo sin el marcador. Fuente del ítem actualizada con las fuentes consultadas. |

**Fuentes usadas para CON-010:** Wikipedia (ES) "Orión (constelación)" —
mejor mes enero a las 21:00, visible toda la noche en el verano del
hemisferio sur, visibilidad completa entre 67° S y 79° N (Ixiamas está
a 13° S, dentro del rango); Wikipedia (EN) "Orion (constellation)" —
mejor visible a las 21:00 en enero, más visible de enero a abril en el
hemisferio sur en verano; Meteored — "Cómo ver la constelación de
Orión desde el Hemisferio Sur" (diciembre a marzo, mejor entre las
22:00 y la 01:00). La afirmación original ("verano austral, diciembre
a febrero, alta al anochecer") quedó **confirmada**; el matiz es que la
temporada buena se extiende de noviembre/diciembre a marzo, con enero
como mejor mes.

**⚠️ Texto que quedó desactualizado y hay que corregir (fuera del
alcance de esta fase, porque no se me permitió tocar ese archivo):**
`data/README.md:25` sigue diciendo "CON-010 con `[VERIFICAR]` (mes
exacto de mejor visibilidad desde Ixiamas)". Esa línea ya no es
cierta: CON-010 está verificado. Debe actualizarse a "CON-010
verificado 19-nov-2026".

---

## A. Datos pendientes reales

### A1. `config/institucion.json` — 17 marcadores (16 COMPLETAR + 1 VERIFICAR)

Es el archivo con más pendientes. Todos dependen de la **dirección del
CEPO** (salvo el de WhatsApp, que es una confirmación).

| Línea | Marcador exacto | Qué falta para resolverlo | Depende de |
|---|---|---|---|
| 3 | `[COMPLETAR: año lectivo vigente]` | Año lectivo vigente (ej. 2026) | Dirección |
| 5 | `[COMPLETAR: correo oficial]` | Correo oficial del colegio | Dirección |
| 6 | `[COMPLETAR: página de Facebook, si existe]` | Página de Facebook, si existe; si no existe, dejar vacío y avisar a quien mantiene el sitio | Dirección |
| 7 | `[COMPLETAR: horario de atención al público]` | Horario de atención al público | Dirección |
| 8 | `[COMPLETAR: cuenta de Instagram, si existe]` | Cuenta de Instagram, si existe; si no existe, dejar vacío y avisar | Dirección |
| 10 | `[VERIFICAR: confirmar si +591 73956239 es WhatsApp]` | Confirmar si el número oficial +591 73956239 atiende por WhatsApp (mismo hecho que en README.md:70 y docs/guia-contenido-fuentes.md:48) | Dirección (probar el número o preguntar al director) |
| 14 | `[COMPLETAR: historia del colegio]` | Historia del colegio | Dirección |
| 15 | `[COMPLETAR: tabla de horarios por nivel, turno y materia — ver data/horarios.json]` | Horarios definitivos (se resuelve junto con A2) | Dirección |
| 17 | `[COMPLETAR: lema oficial — propuesta pendiente de aprobación de la dirección]` | Que la dirección apruebe el lema propuesto ("Bajo Orión, aprendemos de la selva") o entregue otro; el campo `lema` ya tiene la propuesta | Dirección (aprobación) |
| 18 | `[COMPLETAR: misión institucional]` | Misión institucional | Dirección |
| 24 | `[COMPLETAR: nombres y materias del plantel docente — solo datos reales proporcionados por la dirección]` | Nombres y materias del plantel docente; solo datos reales | Dirección |
| 26 | `[COMPLETAR: turnos (mañana/tarde) y horarios por nivel]` | Turnos y horarios por nivel (se resuelve junto con A2) | Dirección |
| 29 | `[COMPLETAR: dirección exacta del colegio]` | Dirección exacta del colegio en Ixiamas | Dirección |
| 33 | `[COMPLETAR]` (en la nota de `mapa_centro`: "La ubicación exacta del colegio sigue [COMPLETAR]") | Ubicación exacta del colegio; las coordenadas actuales (-13.23979, -68.26586) son del centro de Ixiamas, no del colegio | Dirección |
| 35 | `[COMPLETAR: enlace de Google Maps / OpenStreetMap a la ubicación exacta del colegio]` | Enlace al mapa con la ubicación exacta | Dirección (tras conocer la dirección exacta) |
| 40 | `[COMPLETAR: valores institucionales]` | Valores institucionales | Dirección |
| 41 | `[COMPLETAR: visión institucional]` | Visión institucional | Dirección |

### A2. `data/horarios.json` — 5 marcadores (todos COMPLETAR)

| Línea | Marcador exacto | Qué falta para resolverlo | Depende de |
|---|---|---|---|
| 144 | `[COMPLETAR]` (docente del bloque del lunes de 1ro de Secundaria) | Nombre real del docente de ese bloque | Dirección |
| 145 | `[COMPLETAR: hora de inicio–fin]` (hora del mismo bloque) | Hora real de inicio–fin del bloque | Dirección |
| 146 | `[COMPLETAR]` (materia del mismo bloque) | Materia real del bloque | Dirección |
| 169 | `[COMPLETAR: mañana/tarde]` (turno de 1ro de Secundaria) | Turno real (mañana o tarde) | Dirección |
| 172 | `[COMPLETAR]` (en la `nota`: "reemplazar los marcadores [COMPLETAR] de \"niveles\" con los datos reales") | Es la nota que explica el sistema; se resuelve sola cuando los 4 marcadores de arriba tengan datos reales (y los días martes a viernes, hoy con `"bloques": []`, tengan sus bloques) | Dirección |

Nota: los días martes a viernes de 1ro de Secundaria hoy tienen
`"bloques": []` (vacíos, sin marcador). Completarlos es parte del mismo
pendiente, aunque no lleven el texto `[COMPLETAR]`.

### A3. `.env.example` — 5 marcadores (todos COMPLETAR)

No son datos del colegio ni del docente: son **claves técnicas** que se
llenan al crear el proyecto en Supabase / Turnstile. No los toca el
docente.

| Línea | Marcador exacto | Qué falta para resolverlo | Depende de |
|---|---|---|---|
| 6 | `[COMPLETAR: URL del proyecto Supabase]` | Crear el proyecto Supabase y copiar su URL | Quien configura Supabase (ver `docs/supabase-setup.md`) |
| 7 | `[COMPLETAR: clave anon / publishable del proyecto]` | Clave anon del proyecto Supabase | Quien configura Supabase |
| 9 | `[COMPLETAR: clave service_role — solo servidor]` | Clave service_role (solo servidor; nunca exponerla ni subirla) | Quien configura Supabase |
| 13 | `[COMPLETAR: site key de Turnstile — opcional]` | Site key de Cloudflare Turnstile (opcional; sin ella el buzón funciona sin captcha) | Quien configura Turnstile (opcional) |
| 14 | `[COMPLETAR: secret key de Turnstile — opcional]` | Secret key de Turnstile (opcional) | Quien configura Turnstile (opcional) |

---

## B. Menciones en documentación o código (no son datos pendientes)

Estas ocurrencias **no se resuelven con un dato**: son texto que explica
el sistema de marcadores, describe el estado del proyecto en los
reportes de fase, o es el código que detecta los marcadores. Se
actualizan solas (o se reescriben) cuando se resuelven los datos reales
de la sección A.

### B1. `data/README.md` — 9 marcadores

| Línea | Marcador exacto | Qué es |
|---|---|---|
| 10 | `[COMPLETAR]` y `[VERIFICAR]` | La regla de oro: "lo que falte se marca `[COMPLETAR]` y lo dudoso `[VERIFICAR]`" (texto explicativo, permanente) |
| 16 | `[COMPLETAR]` | Tabla de archivos: horarios es "Esqueleto con `[COMPLETAR]`" (se actualiza cuando A2 se resuelva) |
| 25 | `[VERIFICAR]` | "CON-010 con `[VERIFICAR]`…" — **desactualizado desde el 19-nov-2026** (CON-010 verificado; ver nota arriba) |
| 32 | `[COMPLETAR]` | Explicación de `niveles`: "Hoy solo tiene marcadores `[COMPLETAR]`" (se actualiza cuando A2 se resuelva) |
| 45 | `[COMPLETAR: mañana/tarde]` | Ejemplo de formato del turno (texto de ejemplo, permanente) |
| 48 | `[COMPLETAR: 08:00–08:45]`, `[COMPLETAR]`, `[COMPLETAR]` (3 ocurrencias) | Ejemplo de formato de un bloque (texto de ejemplo, permanente) |

### B2. `README.md` (raíz) — 4 marcadores

| Línea | Marcador exacto | Qué es |
|---|---|---|
| 32 | `[COMPLETAR]` | Estructura: `institucion.json` "con [COMPLETAR]" (se actualiza cuando A1 se resuelva) |
| 42 | `[COMPLETAR]` | Regla de oro (texto explicativo, permanente) |
| 43 | `[VERIFICAR]` | Regla de oro (texto explicativo, permanente) |
| 70 | `[VERIFICAR]` | "Contacto oficial: +591 73956239 (WhatsApp `[VERIFICAR]`)" — mismo hecho que A1 línea 10; se resuelve con esa confirmación |

### B3. `docs/guia-contenido-fuentes.md` — 4 marcadores

| Línea | Marcador exacto | Qué es |
|---|---|---|
| 5 | `[VERIFICAR]` | Regla de contenido (texto explicativo, permanente) |
| 6 | `[COMPLETAR]` | Regla de contenido (texto explicativo, permanente) |
| 37 | `[COMPLETAR]` | Regla 5: los datos del colegio son "`[COMPLETAR]` en `config/institucion.json`" (se actualiza cuando A1 se resuelva) |
| 48 | `[VERIFICAR]` | "Contacto oficial: +591 73956239 (teléfono; WhatsApp `[VERIFICAR]`)" — mismo hecho que A1 línea 10 |

### B4. Reportes de fase (`docs/fase-*.md`) — 16 marcadores

Son **reportes históricos** de las fases a–d: describen el estado en el
momento en que se escribieron. No se editan (son registro), y sus
menciones se resuelven solas cuando se resuelvan los datos reales.

| Archivo | Líneas y marcadores |
|---|---|
| `docs/fase-a.md` | 19: `[COMPLETAR]` y `[VERIFICAR]` (descripción del sistema de marcadores) |
| `docs/fase-b.md` | 14: `[COMPLETAR]` (plantel docente); 18: `[COMPLETAR]`; 20: `[COMPLETAR]` (niveles = horario real); 27: `[VERIFICAR]` (WhatsApp); 28: `[COMPLETAR]` (correo y redes); 29: `[COMPLETAR]` ×2 (dirección exacta, horario de atención); 49: `[COMPLETAR]` y `[VERIFICAR]`; 95: `[VERIFICAR]` (lema propuesto pendiente de aprobación) |
| `docs/fase-c.md` | 18: `[COMPLETAR]` (claves en `.env.example`); 69: `[COMPLETAR]` (correo); 133: `[VERIFICAR]` (lema propuesto) |
| `docs/fase-d.md` | 127: `[VERIFICAR]` (lema propuesto) |

### B5. Código — 3 marcadores

| Archivo | Línea | Marcador exacto | Qué es |
|---|---|---|---|
| `app/horarios/page.tsx` | 63 | `[COMPLETAR]` | Texto visible en la página de horarios que explica al docente que al reemplazar los marcadores la página muestra el horario real (texto explicativo; se mantiene mientras haya marcadores) |
| `lib/institucion.ts` | 45 | `[COMPLETAR]` y `[VERIFICAR]` | Comentario de la función `esMarcador` (código, permanente) |
| `lib/turnstile.ts` | 5 | `[COMPLETAR]` | Comentario: la clave queda como `[COMPLETAR]` en `.env.example` (código, permanente) |

No se cuentan como marcadores (no llevan corchete de cierre, son el
mecanismo de detección, no un pendiente): `lib/institucion.ts:47` y
`lib/horarios.ts:43-44`, donde el código busca `"[COMPLETAR"` y
`"[VERIFICAR"` dentro de los valores para decidir si son marcadores.

---

## Resumen por archivo (ocurrencias)

| Archivo | COMPLETAR | VERIFICAR | Total |
|---|---|---|---|
| `config/institucion.json` | 16 | 1 | 17 |
| `docs/fase-b.md` | 7 | 3 | 10 |
| `data/README.md` | 7 | 2 | 9 |
| `data/horarios.json` | 5 | 0 | 5 |
| `.env.example` | 5 | 0 | 5 |
| `README.md` | 2 | 2 | 4 |
| `docs/guia-contenido-fuentes.md` | 2 | 2 | 4 |
| `docs/fase-c.md` | 2 | 1 | 3 |
| `docs/fase-a.md` | 1 | 1 | 2 |
| `lib/institucion.ts` | 1 | 1 | 2 |
| `app/horarios/page.tsx` | 1 | 0 | 1 |
| `docs/fase-d.md` | 0 | 1 | 1 |
| `lib/turnstile.ts` | 1 | 0 | 1 |
| **Total** | **50** | **14** | **64** |

**Hechos distintos pendientes (sin contar menciones):** 17 en
`config/institucion.json` (uno de ellos, WhatsApp, repetido en 2
archivos más), 4 en `data/horarios.json` (+ los días vacíos) y 5
claves técnicas en `.env.example`. Todo lo demás es documentación,
reportes históricos o código.

---

*Lista generada el 19-nov-2026 (fase f). Para saber cómo completar cada
dato, ver `docs/manual-docente.md`.*
