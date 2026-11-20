# Marcadores pendientes — CEPO (lista final consolidada)

> **Fecha de la lista:** 20-nov-2026 (fase g).
> **Cómo se hizo:** búsqueda con `grep` en todo el repositorio (excepto
> `node_modules` y `.next`), patrón `[COMPLETAR...]` y `[VERIFICAR...]`.
>
> **Totales vigentes: 51 marcadores — 38 `[COMPLETAR]` y 13 `[VERIFICAR]`.**
> (Antes de este ajuste eran 52, según el conteo tras la fase g. El
> movimiento es −1: el 20-nov-2026 Mike dio el correo oficial,
> `Cepo.ixiamas@gmail.com`, que estaba `[COMPLETAR]` en
> `config/institucion.json`. Ver [Resueltos tras la fase
> g](#resueltos-tras-la-fase-g).)
>
> **Ojo al volver a contar con grep:** este conteo (52) **excluye** este
> archivo y `docs/manual-docente.md`, que citan los marcadores como
> documentación (101 menciones entre los dos). Un grep ingenuo sobre
> todo el repo da 153: 52 pendientes reales + 101 citas en estos dos
> documentos nuevos. Para repetir el conteo, excluya ambos archivos:
> `grep -rn --exclude-dir=node_modules --exclude-dir=.next --exclude=manual-docente.md --exclude=marcadores-pendientes.md -o -E '\[(COMPLETAR|VERIFICAR)[^]]*\]' .`
>
> **Ocurrencias vs. hechos:** un mismo hecho pendiente puede aparecer
> en varios archivos (por ejemplo, lo de WhatsApp está en 3 archivos).
> Esta lista cuenta **ocurrencias** (55). Los hechos distintos son
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

## Resueltos en fase g

Datos reales entregados por la dirección el 20-nov-2026 (correcciones
de Mike). Todos estaban en `config/institucion.json` (12
`[COMPLETAR]`).

| Dónde estaba | Marcador resuelto | Dato real ahora |
|---|---|---|
| `config/institucion.json` — `contacto.facebook` / `contacto.instagram` | `[COMPLETAR: página de Facebook, si existe]` / `[COMPLETAR: cuenta de Instagram, si existe]` | No hay Facebook ni Instagram: la única red social es TikTok (`contacto.tiktok` = https://www.tiktok.com/@cepoixiamas, `contacto.tiktok_usuario` = @cepoixiamas). Las claves de Facebook/Instagram se eliminaron del config. |
| `config/institucion.json` — `contacto.horario_atencion` | `[COMPLETAR: horario de atención al público]` | Lunes a viernes, 10:00–15:00. |
| `config/institucion.json` — `horarios` | `[COMPLETAR: tabla de horarios por nivel, turno y materia — ver data/horarios.json]` | Clases lunes, miércoles y viernes, 19:00, 20:00 y 21:00. Horario sujeto a cambios. (La tabla por materia y día sigue pendiente: ver A2.) |
| `config/institucion.json` — `lema_estado` | `[COMPLETAR: lema oficial — propuesta pendiente de aprobación de la dirección]` | Lema oficial, aprobado por la dirección (20-nov-2026). El lema es «Aprendamos en la selva». |
| `config/institucion.json` — `mision` | `[COMPLETAR: misión institucional]` | Fortalecer y complementar los conocimientos y destrezas de los jóvenes en Ixiamas. |
| `config/institucion.json` — `vision` | `[COMPLETAR: visión institucional]` | Desarrollar una plataforma permanente de capacitación para jóvenes de todas las edades. |
| `config/institucion.json` — `plantel_docente` | `[COMPLETAR: nombres y materias del plantel docente — solo datos reales proporcionados por la dirección]` | Irguen Rosas (director), Clarivel Loayza y Michael Navarro Hernández. Fotos y semblanzas en `data/equipo.json` (fotos públicas en Drive, carpeta «CEPO — Fotos del equipo»). |
| `config/institucion.json` — `turnos` | `[COMPLETAR: turnos (mañana/tarde) y horarios por nivel]` | Noche (clases 19:00, 20:00 y 21:00). |
| `config/institucion.json` — `ubicacion.direccion_exacta` | `[COMPLETAR: dirección exacta del colegio]` | Avenida Sucre, Calle Santa Cruz, Ixiamas Centro. |
| `config/institucion.json` — `mapa_centro.nota` | `[COMPLETAR]` (en la nota: "La ubicación exacta del colegio sigue [COMPLETAR]") | La nota ya incluye la dirección exacta. Las coordenadas siguen siendo del centro de Ixiamas (-13.23979, -68.26586), no del colegio. |
| `config/institucion.json` — `ubicacion.mapa_url` | `[COMPLETAR: enlace de Google Maps / OpenStreetMap a la ubicación exacta del colegio]` | https://www.openstreetmap.org/?mlat=-13.23979&mlon=-68.26586#map=16/-13.23979/-68.26586 (centro de Ixiamas; actualizar cuando haya coordenadas exactas). |

También se resolvió en esta fase (sin marcador asociado): el nombre
del director es **Irguen Rosas** (no "Irgen"); se añadieron las
materias (Matemática, Física, Filosofía, Historia, Literatura,
Inglés), los costos (Bs 10 inscripción, Bs 10 por materia) y
Filosofía como sexta área del diagnóstico (10 preguntas nuevas, 60 en
total); y se varió «selva» con «monte» y «jungla» en los textos del
sitio. Quedan pendientes en el config: año lectivo, correo oficial,
historia y valores (ver A1). La confirmación de WhatsApp se resolvió
tras esta fase (ver [Resueltos tras la fase g](#resueltos-tras-la-fase-g)).

## Resueltos tras la fase g

El 20-nov-2026 Mike confirmó que **+591 73956239 sí es WhatsApp**.
El hecho estaba marcado `[VERIFICAR]` en 3 archivos; en los 3 se
reemplazó por el dato confirmado. En el sitio, el pie de página, la
página de inicio y la de contacto ahora muestran "WhatsApp: +591
73956239" como enlace a https://wa.me/59173956239 (el enlace ya
existía en el config como `whatsapp_url`). Los próximos afiches
llevan el logo de WhatsApp junto al número.

El mismo día Mike dio el correo oficial: **Cepo.ixiamas@gmail.com**.
Estaba `[COMPLETAR: correo oficial]` en `config/institucion.json`.
En el sitio, el pie de página y la página de contacto ahora muestran
el correo como enlace `mailto:`.

El mismo día Mike decidió que el logo oficial es **el de Orión
diseñado por Muse** (el que ya usa el sitio en el encabezado, el pie
y la página Nosotros; componente `OrionLogo`). Ya no se espera un
logo de la dirección. La versión animada (GIF) quedó guardada en
Drive, carpeta «CEPO — Logo oficial» (id
`1jtxm6IRGVOkR1x8jxmUfDxKJg5vx5aAv`, archivo
`183BwKoEWLQczgrG3645g25212JTj_814`, enlace público verificado).

## Resueltos en fase f

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

**Nota (actualizada 20-nov-2026):** el texto desactualizado de
`data/README.md:25` ("CON-010 con `[VERIFICAR]`…") ya se corrigió: la
línea ahora dice "mejor visibilidad de Orión en enero, verificada
19-nov-2026 (Wikipedia + Meteored)". Nada pendiente aquí.

---

## A. Datos pendientes reales

### A1. `config/institucion.json` — 3 marcadores (todos COMPLETAR)

Es el archivo con más pendientes. Todos dependen de la **dirección del
CEPO**. En la fase g se resolvieron 12 de los 17 que tenía, y tras la
fase g se resolvieron la confirmación de WhatsApp y el correo oficial
(ver [Resueltos tras la fase g](#resueltos-tras-la-fase-g)).

| Línea | Marcador exacto | Qué falta para resolverlo | Depende de |
|---|---|---|---|
| 3 | `[COMPLETAR: año lectivo vigente]` | Año lectivo vigente (ej. 2026) | Dirección |
| 19 | `[COMPLETAR: historia del colegio]` | Historia del colegio | Dirección |
| 53 | `[COMPLETAR: valores institucionales]` | Valores institucionales | Dirección |

### A2. `data/horarios.json` — 5 marcadores (todos COMPLETAR)

| Línea | Marcador exacto | Qué falta para resolverlo | Depende de |
|---|---|---|---|
| 144 | `[COMPLETAR]` (docente del bloque del lunes de 1ro de Secundaria) | Nombre real del docente de ese bloque | Dirección |
| 145 | `[COMPLETAR: hora de inicio–fin]` (hora del mismo bloque) | Hora real de inicio–fin del bloque | Dirección |
| 146 | `[COMPLETAR]` (materia del mismo bloque) | Materia real del bloque | Dirección |
| 169 | `[COMPLETAR: mañana/tarde]` (turno de 1ro de Secundaria) | Turno real (mañana o tarde) | Dirección |
| 172 | `[COMPLETAR]` (en la `nota`: "reemplazar los marcadores [COMPLETAR] de \"niveles\" con los datos reales") | Es la nota que explica el sistema; se resuelve sola cuando los 4 marcadores de arriba tengan datos reales (y los días martes a viernes, hoy con `"bloques": []`, tengan sus bloques). La nota ya incluye el marco real (lunes, miércoles y viernes, 19:00, 20:00 y 21:00, sujeto a cambios — 20-nov-2026). | Dirección |

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

### B1. `data/README.md` — 8 marcadores

| Línea | Marcador exacto | Qué es |
|---|---|---|
| 10 | `[COMPLETAR]` y `[VERIFICAR]` | La regla de oro: "lo que falte se marca `[COMPLETAR]` y lo dudoso `[VERIFICAR]`" (texto explicativo, permanente) |
| 16 | `[COMPLETAR]` | Tabla de archivos: horarios es "Esqueleto con `[COMPLETAR]`" (se actualiza cuando A2 se resuelva) |
| 25 | — | "CON-010 con `[VERIFICAR]`…" era la línea 25 en la fase f; **resuelta en la fase f** (CON-010 verificado 19-nov-2026; la línea ahora dice "mejor visibilidad de Orión en enero, verificada 19-nov-2026"). Ya no lleva marcador. |
| 32 | `[COMPLETAR]` | Explicación de `niveles`: "Hoy solo tiene marcadores `[COMPLETAR]`" (se actualiza cuando A2 se resuelva) |
| 45 | `[COMPLETAR: mañana/tarde]` | Ejemplo de formato del turno (texto de ejemplo, permanente) |
| 48 | `[COMPLETAR: 08:00–08:45]`, `[COMPLETAR]`, `[COMPLETAR]` (3 ocurrencias) | Ejemplo de formato de un bloque (texto de ejemplo, permanente) |

### B2. `README.md` (raíz) — 3 marcadores

| Línea | Marcador exacto | Qué es |
|---|---|---|
| 32 | `[COMPLETAR]` | Estructura: `institucion.json` "con [COMPLETAR]" (se actualiza cuando A1 se resuelva) |
| 42 | `[COMPLETAR]` | Regla de oro (texto explicativo, permanente) |
| 43 | `[VERIFICAR]` | Regla de oro (texto explicativo, permanente) |
| 70 | — | "Contacto oficial: +591 73956239 (WhatsApp `[VERIFICAR]`)" era la línea 70 hasta el 20-nov-2026; **resuelto ese día** (Mike confirmó que sí es WhatsApp). La línea ahora dice "(teléfono y WhatsApp, confirmado 20-nov-2026)". |

### B3. `docs/guia-contenido-fuentes.md` — 3 marcadores

| Línea | Marcador exacto | Qué es |
|---|---|---|
| 5 | `[VERIFICAR]` | Regla de contenido (texto explicativo, permanente) |
| 6 | `[COMPLETAR]` | Regla de contenido (texto explicativo, permanente) |
| 37 | `[COMPLETAR]` | Regla 5: los datos del colegio son "`[COMPLETAR]` en `config/institucion.json`" (se actualiza cuando A1 se resuelva) |
| 48 | — | "Contacto oficial: +591 73956239 (teléfono; WhatsApp `[VERIFICAR]`)" era la línea 48 hasta el 20-nov-2026; **resuelto ese día** (Mike confirmó que sí es WhatsApp). |

### B4. Reportes de fase (`docs/fase-*.md`) — 20 marcadores

Son **reportes históricos** de las fases a–f: describen el estado en el
momento en que se escribieron. No se editan (son registro), y sus
menciones se resuelven solas cuando se resuelvan los datos reales.
(`docs/fase-e.md` no tiene marcadores.)

| Archivo | Líneas y marcadores |
|---|---|
| `docs/fase-a.md` | 19: `[COMPLETAR]` y `[VERIFICAR]` (descripción del sistema de marcadores) |
| `docs/fase-b.md` | 14: `[COMPLETAR]` (plantel docente); 18: `[COMPLETAR]`; 20: `[COMPLETAR]` (niveles = horario real); 27: `[VERIFICAR]` (WhatsApp); 28: `[COMPLETAR]` (correo y redes); 29: `[COMPLETAR]` ×2 (dirección exacta, horario de atención); 49: `[COMPLETAR]` y `[VERIFICAR]`; 95: `[VERIFICAR]` (lema propuesto pendiente de aprobación) |
| `docs/fase-c.md` | 18: `[COMPLETAR]` (claves en `.env.example`); 69: `[COMPLETAR]` (correo); 133: `[VERIFICAR]` (lema propuesto) |
| `docs/fase-d.md` | 127: `[VERIFICAR]` (lema propuesto) |
| `docs/fase-f.md` | 127: `[VERIFICAR]` (CON-010); 148–149: `[COMPLETAR]` y `[VERIFICAR]` (totales de la lista: 64); 158: `[VERIFICAR]` (CON-010) |

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
| `config/institucion.json` | 3 | 0 | 3 |
| `docs/fase-b.md` | 7 | 3 | 10 |
| `data/README.md` | 7 | 1 | 8 |
| `data/horarios.json` | 5 | 0 | 5 |
| `.env.example` | 5 | 0 | 5 |
| `README.md` | 2 | 1 | 3 |
| `docs/guia-contenido-fuentes.md` | 2 | 1 | 3 |
| `docs/fase-f.md` | 1 | 3 | 4 |
| `docs/fase-c.md` | 2 | 1 | 3 |
| `docs/fase-a.md` | 1 | 1 | 2 |
| `lib/institucion.ts` | 1 | 1 | 2 |
| `app/horarios/page.tsx` | 1 | 0 | 1 |
| `docs/fase-d.md` | 0 | 1 | 1 |
| `lib/turnstile.ts` | 1 | 0 | 1 |
| **Total** | **38** | **13** | **51** |

**Hechos distintos pendientes (sin contar menciones):** 3 en
`config/institucion.json`, 4 en `data/horarios.json` (+ los días
vacíos) y 5 claves técnicas en `.env.example`. Todo lo demás es
documentación, reportes históricos o código.

---

*Lista generada el 20-nov-2026 (fase g). Para saber cómo completar cada
dato, ver `docs/manual-docente.md`.*
