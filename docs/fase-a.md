# Fase (a) — Base y diseño — reporte

**Fecha:** 19-nov-2026. **Estado:** código completo, build verificado, push a
GitHub pendiente de que Mike cree el repo vacío.

## Hecho

- Scaffold Next.js 15 (App Router) + TypeScript + Tailwind CSS 4, mobile-first.
- Paleta amazónica completa, tipografías Baloo 2 (títulos) y Nunito (cuerpo).
- Logo SVG propio de Orión (Las Tres Marías) animado; hero con cielo
  estrellado parpadeante, parallax de selva, hojas flotantes y lema propuesto
  «Bajo Orión, aprendemos de la selva».
- Ilustraciones SVG propias: jaguar, paraba, tapir, bufeo.
- Modo claro/oscuro, tamaño de letra ajustable (A / A+ / A++), skip link,
  ARIA, navegación por teclado, `prefers-reduced-motion` respetado.
- PWA: `manifest.webmanifest` + `sw.js` (offline básico, fallback
  `/sin-conexion`).
- `config/institucion.json` con todos los datos reales y marcadores
  `[COMPLETAR]` / `[VERIFICAR]`; `data/` con README, `horarios.json` y
  `preguntas.json` (esquema + 1 ejemplo real con fuente).
- `docs/guia-contenido-fuentes.md` con las fuentes oficiales
  (Ministerio de Educación, INE, SERNAP, Madidi, Cruz Roja, BCB).
- Páginas placeholder para las fases (b)–(e): Nosotros, Horarios,
  Diagnóstico, Juegos, Mi progreso, Buzón, Contacto, Privacidad.
- Build verificado: `npm run build` OK, 13 páginas estáticas, First Load JS
  109 kB en inicio (meta < 1 MB cumplida). Prueba local: `/` 200,
  `/diagnostico` 200, manifest 200, `sw.js` 200.

## Bloqueo 1 — GitHub: el repo no se pudo crear desde aquí

`create_repository` devolvió **403 «Resource not accessible by integration»**:
el token de la GitHub App de Muse no puede crear repositorios en la cuenta
personal. **Lo que debe hacer Mike** (1 minuto):

1. Crear el repo vacío en github.com/cuentero13/cepo-orion (público, sin
   README, sin .gitignore, sin licencia).
2. Darle acceso a la app de Muse en
   https://github.com/apps/meta-muse-ai/installations/new (incluir el repo
   nuevo en la instalación).

Después de eso, el push está listo: manifiesto en `/tmp/cepo-paths.txt`
(41 archivos, texto plano, sin binarios), rama `main`, mensaje
«Fase (a): base y diseño — scaffold Next.js, hero de Orión, PWA y esqueleto».
Luego crear la rama `dev` desde `main`.

## Bloqueo 2 — Vercel: sin conectar

El conector Vercel está en `not_connected`. **Lo que debe hacer Mike:**
autorizar en https://agent.meta.ai/connectors/connect/vercel y después
importar el repo `cuentero13/cepo-orion` en Vercel (Deploy, sin variables
de entorno en esta fase).

## Listo para la fase (b)

Secciones informativas (Nosotros, Horarios, Contacto) sobre el esqueleto
actual. Pendientes de datos reales de la dirección: dirección exacta, correo,
horarios, misión/visión/valores, plantel docente y logo oficial (ver
`config/institucion.json`).
