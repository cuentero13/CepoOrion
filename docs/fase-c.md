# Fase (c) — Autenticación y buzón privado — reporte

**Fecha:** 19-nov-2026. **Estado:** código completo, build verificado,
rutas verificadas 200 en local. Push a GitHub y despliegue en Vercel según
sección «Despliegue» abajo.

## Hecho

### Autenticación (Supabase Auth + Postgres con RLS)

- **Base (coordinación):** `lib/supabase/config.ts` (`supabaseConfigurado`,
  `turnstileConfigurado`), `lib/supabase/client.ts`
  (`crearClienteNavegador()`, null si no configurado),
  `lib/supabase/server.ts` (`crearClienteServidor()`, `obtenerUsuario()`,
  `obtenerPerfil()`, tipo `Perfil`), `middleware.ts` (protege `/progreso`
  y `/admin`: sin sesión redirige a `/login?siguiente=...`),
  `lib/turnstile.ts` (`verificarTurnstile` en servidor),
  `.env.example` (todas las claves como `[COMPLETAR]`).
- **`lib/auth.ts`:** login por **alias** (correo sintético
  `alias@alias.cepo.local`), `validarAlias`
  (`^[a-z0-9_][a-z0-9_-]{2,29}$`), `registrar` (alias, contraseña ≥ 8,
  curso 1.º–6.º de Secundaria, correo opcional, mayor/menor de edad con
  casilla obligatoria de autorización del tutor si es menor; `signUp` +
  insert en `profiles` con rol siempre `'estudiante'`),
  `iniciarSesion`, `cerrarSesion`. Mensajes de error en español claro.
- **`/login` y `/registro`:** formularios con validación, errores con
  `role="alert"`, redirección a `?siguiente=` (solo rutas internas) o a
  `/progreso`. Sin Supabase: aviso de configuración pendiente y formulario
  deshabilitado.
- **`/progreso` (Server Component, `force-dynamic`):** saludo con alias y
  curso; consulta real de `diagnosticos`, `actitudes` y
  `progreso_juegos` del usuario (RLS); tarjetas Historial de
  diagnósticos, Evolución por área, Insignias y Metas personales con
  estados vacíos honestos (se llenan en las fases (d) y (e)).
- **`components/Nav.tsx`:** estado de sesión (alias + "Salir" / enlace
  "Entrar"), también en el menú móvil; tema y tamaño de letra intactos.
- **Migración `supabase/migrations/0001_cepo_schema.sql`:** tablas
  `profiles`, `diagnosticos`, `actitudes`, `progreso_juegos`, `buzon`,
  `horarios`, `preguntas` + RLS (cada estudiante solo ve sus resultados;
  buzón solo lo leen admin/docente; trigger que impide auto-asignarse un
  rol mayor; función `public.mi_rol()` SECURITY DEFINER).
- **`docs/supabase-setup.md`:** pasos exactos para Mike (crear proyecto
  gratuito, ejecutar la migración, desactivar "Confirm email", copiar
  claves, variables en Vercel, crear el primer admin por SQL, Turnstile
  opcional).

### Buzón privado

- **`/buzon`:** tipo (comentario/sugerencia/consulta), mensaje con
  contador (máx. 2000), casilla de anonimato, alias opcional prellenado
  con la sesión, honeypot oculto, widget Turnstile solo si hay site key,
  confirmación ("Gracias, tu mensaje llegó solo a la dirección del
  colegio"). Sin Supabase: aviso y envío deshabilitado.
- **`app/api/buzon/route.ts`:** valida tipo/longitud, rechaza honeypot,
  verifica Turnstile, 503 claro si no hay Supabase, asocia `user_id` de
  la sesión (null si anónimo) e inserta con RLS.
- **`/admin` (Server Component, `force-dynamic`):** aviso si no hay
  Supabase; redirige a login sin sesión; "Sin acceso" si el rol no es
  admin ni docente; lista hasta 100 mensajes (tipo, fecha, alias o
  "Anónimo", mensaje, estado). Server Action `actualizarEstadoBuzon`
  (solo admin, con `revalidatePath`).

### Privacidad

- **`/privacidad`:** lenguaje sencillo — datos mínimos (alias, curso,
  correo opcional), para qué, quién los ve, consentimiento y
  autorización del tutor para menores, qué NO se recoge (sin anuncios
  ni rastreadores de terceros), cómo pedir el borrado de datos, contacto
  (director Irgen Rosas, +591 73956239; correo sigue `[COMPLETAR]`).
  El Footer ya enlazaba a `/buzon` y `/privacidad`, sin cambios.

## Verificación

- `npm run build`: OK, 15 páginas, First Load JS 103–180 kB (meta
  < 1 MB cumplida).
- Servidor de producción local (puerto 3101/3102/3103): `/`, `/login`,
  `/registro`, `/progreso`, `/buzon`, `/admin`, `/privacidad`,
  `/nosotros`, `/horarios`, `/contacto`, `/diagnostico`, `/juegos`,
  `/manifest.webmanifest`, `/sw.js` — todos **200**.
- Contenido comprobado: "Configuración pendiente" en `/progreso`,
  `/registro` y `/admin`; aviso de login; `POST /api/buzon` → 503 con
  mensaje claro (sin Supabase configurado, como corresponde).
- Corrección del coordinador: `/buzon` era `"use client"` y no podía
  exportar `metadata`; se separó en `FormularioBuzon.tsx` (cliente) +
  `page.tsx` (servidor con el título "Buzón privado | CEPO").

## Pendiente (no es código, es configuración de Mike)

- **Proyecto Supabase sin crear.** Ver `docs/supabase-setup.md`: crear
  proyecto `cepo-orion` (región São Paulo), ejecutar la migración,
  desactivar "Confirm email", copiar URL + anon key (+ service_role solo
  servidor) y ponerlas como variables en Vercel. Sin esto, login,
  progreso y buzón muestran el aviso de configuración pendiente.
- **Turnstile (opcional):** site key + secret key en Vercel; sin ellas
  el buzón funciona sin captcha.
- Flujo real registro → login → /progreso sin verificar contra un
  proyecto real (no existe todavía).

## Despliegue — actualizado 19-nov-2026

**Repo verificado:** el repo es **`cuentero13/CepoOrion`** (público,
vacío, creado 17:47 UTC; Mike dijo "Creada repoorion"). No existe ningún
`cepo-orion` ni `repoorion`.

**Push HECHO 19-nov-2026:**

- Repo: https://github.com/cuentero13/CepoOrion
- Rama `main`: commit `96c9cc8f5311204309530341b8b5fef84afeb1b0`
  ("Fases (a), (b) y (c)..."), 66 archivos, 420.596 bytes, texto plano
  (verificado: `package.json` en el remoto es JSON real con las
  dependencias Supabase).
- Rama `dev` creada desde `main` (mismo commit).
- Commit local `3c1a38f` (fase c) = mismo contenido.

**Vercel: BLOQUEADO (verificado 19-nov-2026).** La conexión Vercel está
activa (usuario `mcuentero@gmail.com`), pero `list_projects` devuelve
**403**: «Not authorized: Trying to access resource under scope
"cuentero13"» (teamId `team_pOAiJtpzKagsKwjhwCYhhzX7`). La herramienta
`authorize_team_access` que sugiere el error **no existe** en el
catálogo MCP de Vercel (verificado en `list-tools`). **Lo que debe hacer
Mike:** en el panel de Vercel, autorizar la integración de Muse para el
equipo `cuentero13` (o re-autenticar la integración con ese alcance).
Cuando el equipo quede autorizado, el despliegue es inmediato:
importar `cuentero13/CepoOrion` en Vercel → Deploy (sin variables de
entorno obligatorias para esta fase; Supabase se agrega cuando el
proyecto exista).

## Pendientes de datos reales (dirección)

Ver `config/institucion.json`: dirección exacta, correo oficial, horarios
definitivos, misión, visión, valores, historia, plantel docente, redes
sociales, horario de atención, logo oficial. WhatsApp por confirmar
(`[VERIFICAR]`). Lema propuesto pendiente de aprobación de Mike.
