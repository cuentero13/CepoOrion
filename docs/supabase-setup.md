# Supabase — qué debe crear Mike (y qué ya está listo)

El código de autenticación, buzón y panel ya está construido y usa solo
variables de entorno. **No existe ningún proyecto Supabase todavía**: hay
que crearlo una vez (plan gratuito) y pegar las claves. Sin eso, el sitio
funciona en todo lo público, pero el login, Mi progreso y el buzón
muestran un aviso de "configuración pendiente" en lugar de fallar.

## 1. Crear el proyecto (gratuito)

1. Entrar a https://supabase.com y crear cuenta (o iniciar sesión).
2. **New project** → nombre `cepo-orion` → contraseña segura para la base
   de datos (guardarla; no va en el chat ni en el código) → región
   **South America (São Paulo)** (la más cercana a Bolivia) → Create.
3. Esperar a que el proyecto quede listo (~2 minutos).

## 2. Ejecutar la migración (tablas + seguridad por fila)

1. En el proyecto: **SQL Editor** → **New query**.
2. Pegar el contenido completo de `supabase/migrations/0001_cepo_schema.sql`
   (está en el repo) y pulsar **Run**.
3. Debe terminar sin errores. Crea las tablas `profiles`,
   `diagnosticos`, `actitudes`, `progreso_juegos`, `buzon`, `horarios`,
   `preguntas` con políticas RLS: cada estudiante solo ve sus resultados;
   el buzón solo lo leen admin y docentes; nadie puede auto-asignarse
   un rol mayor.

## 3. Desactivar la confirmación por correo (importante)

El login usa **alias** (no correo real): por dentro, Supabase recibe el
correo sintético `alias@alias.cepo.local`. Si la confirmación por correo
está activa, nadie podrá entrar.

1. **Authentication** → **Providers** → **Email** → desactivar
   **Confirm email** (dejarlo en OFF).
2. Dejar activado el proveedor Email con contraseña (es el que usa el login).

## 4. Copiar las claves

**Project Settings** → **API**:

- `URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (solo servidor; nunca
  exponerla en el cliente ni subirla a GitHub)

## 5. Variables de entorno en Vercel

En el proyecto de Vercel → **Settings** → **Environment Variables**,
agregar las tres de arriba. Sin `service_role` el sitio también funciona;
solo se necesita si en el futuro se agrega borrado o tareas de servidor.

## 6. Crear el primer administrador

1. Registrarse en el sitio con un alias (por ejemplo `direccion`).
2. En Supabase → **SQL Editor** → ejecutar:

```sql
update public.profiles set rol = 'admin' where alias = 'direccion';
```

3. Volver a entrar: ese usuario ya ve el panel `/admin` y los mensajes
   del buzón. Los docentes se crean igual, con `rol = 'docente'`.

## 7. Anti-spam del buzón (opcional, Cloudflare Turnstile, gratuito)

Si no se configura, el buzón funciona sin captcha (queda un campo
oculto anti-bots y validación en el servidor).

1. Entrar a https://dash.cloudflare.com → **Turnstile** → **Add site** →
   nombre `CEPO buzón` → dominio del sitio → **Create**.
2. Copiar **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y
   **Secret Key** → `TURNSTILE_SECRET_KEY` (variables en Vercel).
3. El formulario muestra el captcha automáticamente cuando existe la
   site key; el servidor verifica el token antes de guardar el mensaje.

## 8. Variables en local (desarrollo)

Copiar `.env.example` a `.env.local` y llenar los valores. `.env.local`
nunca se sube a GitHub (está en `.gitignore`).
