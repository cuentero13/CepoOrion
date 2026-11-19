# Fase (f) — Pulido final — reporte

**Fecha:** 19-nov-2026. **Estado:** código completo, build verificado,
Lighthouse medido, flujos QA probados en local, manual del docente
entregado.

## Hecho

### 1. Pulido visual y accesibilidad

- **Contraste WCAG AA (4.5:1) corregido con cálculo exacto:** nuevos
  tokens en `app/globals.css` — `--color-rio-oscuro: #00695c`
  (6.18:1 sobre fondo claro), `--color-tierra-oscuro: #a63e00`
  (5.93:1), `--color-achiote-claro: #ef5350` (4.84:1 sobre noche).
  Aplicados a etiquetas, enlaces, títulos y botones en las 22 páginas.
- **Logo sobre fondo oscuro:** `OrionLogo` ganó la prop
  `sobreOscuro` (texto `text-sol` / `text-rio-claro`). Se usa en el pie
  de página y en la tarjeta «Por qué Orión» de `/nosotros`, donde antes
  el texto verde oscuro sobre azul noche no tenía contraste.
- **Nombre accesible del logo:** el enlace de inicio del Nav ya no
  lleva `aria-label` distinto del texto visible y `OrionLogo` ya no
  usa `role="img"` + `aria-label` propio; el nombre accesible es el
  texto visible («CEPO / CENTRO EDUCATIVO PRIVADO ORION»), con lo que
  se resolvió el `label-content-name-mismatch` de Lighthouse.
- **Aparición al scroll:** nuevo `components/Reveal.tsx`
  (IntersectionObserver, una sola vez). El CSS solo oculta el contenido
  bajo `prefers-reduced-motion: no-preference`; con movimiento reducido
  o sin IntersectionObserver el contenido nunca se oculta. El parallax
  del Hero se desactiva con movimiento reducido; el confeti CSS ya se
  suprimía.
- **Skip link, foco visible, ARIA, teclado:** verificados — skip link
  a `#contenido`, `:focus-visible` global, sin `outline-none` en el
  proyecto, `aria-live` en juegos, `role="progressbar"` con valores,
  `fieldset`/`legend` en preguntas, `aria-current`/`aria-expanded` en
  el menú móvil, etiquetas asociadas en los formularios.
- **Modo claro/oscuro y A/A+/A++:** funcionan en todas las rutas.
  **Nuevo:** script inline en `app/layout.tsx` que aplica el tema y el
  tamaño de letra guardados en `localStorage` ANTES del primer pintado
  (elimina el flash inicial; lee las mismas claves que `Nav.tsx`).
- **Tipografías:** Baloo 2/Poppins en títulos, Nunito en cuerpo, en
  todas las páginas; SVG de fauna solo con hex de la paleta.

### 2. Rendimiento — Lighthouse (móvil, throttling por defecto)

Medido con Lighthouse 12.8.2 + Chromium 131 en esta VM
(`~/workspace/cepo-orion`, servidor de producción local). Los JSON
están en `/tmp/cepo-qa/passF2/lh-v2-*.json` (última pasada).

| Página | Perf | A11y | Buenas práct. | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| / | 82 | 100 | 100 | 100 | 2,5 s | 590 ms | 0 |
| /nosotros | 73 | 100 | 100 | 100 | 2,7 s | 1.100 ms | 0 |
| /horarios | 88 | 100 | 100 | 100 | 2,6 s | 370 ms | 0 |
| /diagnostico | 93 | 100 | 100 | 100 | 2,4 s | 260 ms | 0 |
| /juegos | 82 | 100 | 100 | 100 | 2,5 s | 610 ms | 0 |
| /progreso | 75 | 100 | 100 | 90 | 2,4 s | 1.020 ms | 0 |

**Accesibilidad 100 y Buenas prácticas 100 en las 6 páginas; SEO 100
en 5 de 6.** Performance varía mucho entre pasadas en esta VM
compartida (1,5 CPU, throttling 4×): en pasadas anteriores las mismas
páginas dieron 91–98. El objetivo ≥90 se alcanza en la mayoría de las
pasadas, pero no de forma estable en este entorno; en un teléfono real
o en Vercel los valores serán mejores. First Load JS: 103–183 kB por
ruta (meta < 1 MB cumplida).

**Cambios que subieron el puntaje:**
- `next.config.ts`: `experimental.inlineCss: true` (eliminó el CSS
  que bloqueaba el render), `poweredByHeader: false`,
  `compiler.removeConsole: true`.
- `app/layout.tsx`: Baloo 2 solo con pesos 700/800 (500/600 nunca se
  renderizaban).
- **Cliente Supabase diferido y condicionado (mayor palanca):** el
  chunk de Supabase (~51 KiB sin usar por página) se descargaba en
  todas las páginas porque `Nav` lo importaba en el layout y los
  prefetch de Next lo arrastraban. Ahora `Nav`, `FormularioBuzon`,
  `lib/auth.ts` y `lib/juegos.ts` lo importan con `import()` dinámico
  y SOLO si `supabaseConfigurado` es true. Comprobado en el navegador:
  la página inicial pasó de 18 a 9 scripts y el chunk 48 ya no se
  descarga sin Supabase. Sin proyecto configurado no hay sesión que
  comprobar, así que el comportamiento es idéntico.
- **Meta description en `<head>`:** `/diagnostico` era
  `force-dynamic` sin necesidad (solo lee un JSON estático); pasó a
  `force-static` y su descripción quedó en el `<head>` inicial.
  `/progreso` sigue dinámica por necesidad (lee la sesión de las
  cookies): su descripción se sirve en el cuerpo por el streaming de
  Next.js y Lighthouse no la ve (SEO 90). Es una página privada, así
  que no es un problema para el usuario.
- **Sin `<h1>` en juegos:** las 6 páginas de juego ahora tienen
  `<h1>` con el título del juego (antes era un `<p>`).
- **Orden de encabezados:** los días de `/horarios` pasaron de
  `<h3>` a `<h2>` (la página solo tenía `<h1>` antes).

**No accionable (constancia):** los `?_rsc=… ERR_ABORTED` y los
«Failed to load resource: 400» en consola son prefetches de Next.js
cancelados al navegar en el navegador headless; no son fallos del
sitio. El `bf-cache` falla en páginas dinámicas por el `Cache-Control:
no-store` de Next (Lighthouse lo marca «Not actionable»).

### 3. Móvil (viewport 390×844, Playwright, 19 rutas)

- **Corregido — /horarios se veía alejada:** `innerWidth` medido era
  436 px. Causa: la tabla con `min-w-96` dentro de un artículo grid
  sin `min-w-0`. Arreglo: `min-w-0` en el artículo + tabla a `min-w-80`.
  Verificado: `innerWidth` 390 y `scrollWidth` 390 en `/`, `/horarios`,
  `/juegos`, `/diagnostico` y `/progreso`.
- Sin botones de acción por debajo de 44 px (salvo enlaces de texto
  en línea, excepción WCAG 2.2).
- El mapa OpenStreetMap de `/nosotros` no cargó en esta VM
  (`ERR_TUNNEL_CONNECTION_FAILED`, el sandbox no llega a
  openstreetmap.org); no es defecto del sitio — verificar en conexión
  real.

### 4. QA final de flujos (Chromium real, sin Supabase)

| Paso | Resultado |
|---|---|
| Registro → /registro | OK — «Configuración pendiente», sin formulario |
| Login → /login | OK — «Configuración pendiente», sin formulario |
| Diagnóstico → /diagnostico (Matemática) | OK — 6 preguntas, resultado «Nivel Inicial», aviso de que el resultado queda solo en pantalla |
| Actitudes → /actitudes | OK — 24 frases, resultado «Así están tus hábitos hoy» |
| Juegos → /juegos/madidi | OK — partida completa de 12 preguntas, puntos e insignias |
| Progreso → /progreso | OK — «Configuración pendiente» + estados vacíos honestos |
| Buzón → /buzon | OK — formulario deshabilitado sin Supabase; POST directo a `/api/buzon` → 503 con mensaje claro |

### 5. Dato de Orión verificado

El `[VERIFICAR]` de `data/juegos/constelaciones.json` (CON-010)
quedó **confirmado y actualizado**: Orión se ve mejor en verano
austral, con **enero como mejor mes (~21:00)** y temporada buena de
diciembre a marzo. Fuentes: Wikipedia (ES/EN) y Meteored; la fuente
quedó citada en el campo `fuente` de CON-010. No se pudo verificar
directamente con el Observatorio de Tarija (sin fuente pública
accesible), pero la convergencia de las tres fuentes basta para un
dato escolar.

### 6. Manual del docente — `docs/manual-docente.md`

Guía en español para editar sin tocar código, con ejemplos literales
de los archivos reales: horarios (`niveles` real vs `ejemplo`, vistas
Hoy/Semana), diagnóstico (50 preguntas, 10/área, esquema y cómo
añadir), actitudes (24 ítems, 6 dimensiones, ítems invertidos),
juegos (6 archivos, 72 ítems, insignias al 80%) y
`config/institucion.json`. Incluye advertencias de qué no tocar y cómo
validar el JSON antes de guardar.

### 7. Marcadores — `docs/marcadores-pendientes.md`

Lista final consolidada: **64 marcadores (50 `[COMPLETAR]` + 14
`[VERIFICAR]`)**. Por archivo: `config/institucion.json` 17,
`docs/fase-b.md` 10, `data/README.md` 9, `data/horarios.json` 5,
`.env.example` 5, `README.md` 4, `docs/guia-contenido-fuentes.md` 4,
`docs/fase-c.md` 3, `docs/fase-a.md` 2, `lib/institucion.ts` 2,
`app/horarios/page.tsx` 1, `docs/fase-d.md` 1, `lib/turnstile.ts` 1.
Hechos distintos pendientes: 17 en `institucion.json` (dirección,
correo, misión, visión, valores, historia, plantel, redes, horarios,
turnos, año lectivo, logo, lema), 4 en `horarios.json` y 5 claves
técnicas en `.env.example`; el resto es documentación o reportes
históricos. Los 3 `[VERIFICAR]` de CON-010 se resolvieron en esta
fase (eran 67).

## Verificación

- `npx tsc --noEmit`: limpio. `npm run build`: OK, 22 páginas.
- Rutas 200 en servidor de producción local (puerto 3108).
- `data/juegos/constelaciones.json` validado con
  `python3 -m json.tool` tras el cambio de CON-010.

## Pendiente (no es código, es configuración de Mike)

- **Proyecto Supabase sin crear.** Sin esto, login, progreso, buzón y
  guardado de exámenes/juegos muestran «configuración pendiente» y el
  progreso queda solo en el dispositivo (ver
  `docs/supabase-setup.md`).
- **Vercel:** bloqueado — la integración de Muse no está autorizada
  para el equipo `cuentero13` (403 en `list_projects` y en
  `create_project`; la herramienta `authorize_team_access` no existe
  en el catálogo MCP de Vercel). Lo debe autorizar Mike en el panel de
  Vercel. Ver `docs/fase-d.md`, sección «Despliegue».
- **Logo real de CEPO:** Mike lo pasa; mientras tanto sigue el SVG
  propio de Orión. Lema «Bajo Orión, aprendemos de la selva» pendiente
  de aprobación. WhatsApp en +591 73956239 pendiente de confirmación.

## Despliegue

- **Repo:** https://github.com/cuentero13/CepoOrion — ramas `main` y `dev`.
- **Push fases (e)+(f):** (ver reporte del coordinador; esta fase
  entrega el código en el workspace y el push por la vía establecida).
