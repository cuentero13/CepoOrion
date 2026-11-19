# Fase (b) — Secciones informativas — reporte

**Fecha:** 19-nov-2026. **Estado:** código completo, build verificado,
rutas verificadas 200 en local. Push a GitHub y despliegue en Vercel según
sección «Despliegue» abajo.

## Hecho

- **`/nosotros`**: significado de CEPO = Centro Educativo Privado Orion;
  director Irgen Rosas; niveles (solo bachillerato + nota de crecimiento);
  lema propuesto «Bajo Orión, aprendemos de la selva» con su estado
  (propuesta pendiente de aprobación); historia, misión, visión y valores
  como texto editable desde `config/institucion.json` (hoy todos
  `[COMPLETAR]`, mostrados con el componente `Marcador`); plantel docente
  SIN nombres — solo el marcador, hasta recibir datos reales; ubicación con
  mapa embebido de Ixiamas (OpenStreetMap, sin API key; centro verificado
  por geocodificación: lat -13.23979, lon -68.26586) y dirección exacta
  como `[COMPLETAR]`.
- **`/horarios`**: tabla editable desde `data/horarios.json` (secciones
  `niveles` = horario real, hoy solo `[COMPLETAR]`; `ejemplo` = tabla de
  ejemplo claramente marcada «EJEMPLO — no es el horario real»). Vista
  semanal y vista «Hoy» (día actual calculado en el cliente, fin de semana
  con mensaje propio), selector de nivel, tablas con `<caption>` y
  `scope="col"`. Cuando la dirección llene los datos reales, la página
  muestra automáticamente el horario real y oculta el ejemplo.
- **`/contacto`**: teléfono real +591 73956239 (enlace `tel:`), WhatsApp
  con marcador `[VERIFICAR]` y enlace wa.me/59173956239 marcado como
  pendiente de verificar, correo y redes como `[COMPLETAR]`, dirección
  exacta `[COMPLETAR]`, horario de atención `[COMPLETAR]`, enlace al mapa
  y al Buzón privado.
- **Pie de página**: ya reutilizaba `config/institucion.json` como única
  fuente (fase a); sin cambios necesarios.
- **Nuevos archivos**: `components/Marcador.tsx`,
  `components/HorariosTabla.tsx`, `lib/horarios.ts`; `config/institucion.json`
  ampliado con `ubicacion.mapa_centro` (coordenadas verificadas) y
  `contacto.horario_atencion`.
- **Docs**: `data/README.md` actualizado (estructura de `horarios.json`),
  `README.md` con la fase (b) marcada como terminada.

## Verificación

- `npm run build`: OK, 13 páginas estáticas, First Load JS 104–109 kB
  (meta < 1 MB cumplida).
- Servidor de producción local (puerto 3100): `/`, `/nosotros`,
  `/horarios`, `/contacto`, `/diagnostico`, `/juegos`, `/buzon`,
  `/progreso`, `/privacidad`, `/sin-conexion`, `/manifest.webmanifest`,
  `/sw.js` — todos **200**. Contenido comprobado en el HTML servido:
  «Irgen Rosas», embed de OpenStreetMap, «EJEMPLO», «+591 73956239»,
  marcadores `[COMPLETAR]` y `[VERIFICAR]`.

## Despliegue — BLOQUEADO (verificado 19-nov-2026, no inventar URL)

El código está listo y versionado en local (commit `eba0ee0` en `main`,
46 archivos, fases (a) y (b)). El push y el despliegue NO se pudieron
hacer por dos bloqueos exactos:

### Bloqueo 1 — El repo GitHub no existe (o no es accesible)

Verificado con la conexión autenticada de GitHub (cuenta `cuentero13`):

- `search_repositories` «cepo-orion in:name user:cuentero13» → 0 resultados.
- `search_repositories` «user:cuentero13 cepo» y «user:cuentero13 orion» → 0.
- `get_file_contents` en `cuentero13/cepo-orion` → **404 Not Found**.
- Sin sesión, `github.com/cuentero13/cepo-orion` también da 404.

Es decir: el repo no está creado con ese nombre, o se creó privado sin
incluirlo en la instalación de la app de Muse. **Lo que debe hacer Mike:**

1. Crear el repo vacío en `github.com/cuentero13/cepo-orion` (si no
   existe) o confirmar el nombre exacto si se creó con otro nombre.
2. Incluirlo en la instalación de la app de Muse
   (https://github.com/apps/meta-muse-ai/installations/new).
3. Avisar: el push es inmediato con `git remote add origin
   git@github.com:cuentero13/cepo-orion.git && git push -u origin main`,
   luego crear la rama `dev` desde `main`.

Nota: la app de Muse tampoco puede crear el repo por sí misma
(`create_repository` → 403, ya documentado en la fase (a)).

### Bloqueo 2 — Vercel: conexión sin acceso al equipo «cuentero13»

Vercel está conectado a nivel de identidad, pero `list_projects` devuelve
**403**: «Not authorized: Trying to access resource under scope
"cuentero13"» (teamId `team_pOAiJtpzKagsKwjhwCYhhzX7`). La herramienta
`authorize_team_access` que sugiere el error NO está en el catálogo MCP de
Vercel, así que la autorización del equipo debe hacerla Mike en el panel
de Vercel (autorizar la integración de Muse para el equipo cuentero13).
Sin repo GitHub tampoco hay nada que importar en Vercel todavía.

## Pendientes de datos reales (dirección)

Ver `config/institucion.json`: dirección exacta, correo oficial, horarios
definitivos, misión, visión, valores, historia, plantel docente, redes
sociales, horario de atención, logo oficial. WhatsApp por confirmar
(`[VERIFICAR]`). Lema propuesto pendiente de aprobación de Mike.
