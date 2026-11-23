-- ============================================================================
-- 0003_fase_i.sql — Fase (i): panel super admin — tabla `actividad`.
--
-- Qué hace:
--   Crea la tabla `actividad`, donde queda el tiempo que cada estudiante
--   pasa en cada intento (diagnóstico, actitudes, vocacional). El panel
--   de administración (/admin/actividad) la lee para mostrar el uso real
--   del sitio. Sin esta tabla, el panel muestra la sección vacía.
--
-- Cómo se corre:
--   En Supabase (panel web) → SQL Editor → pegar este archivo completo
--   y pulsar Run. La fase (h) ya corre en producción sin esta tabla:
--   el registro de inicio/fin en los POST no falla si la tabla no
--   existe todavía (los POST la ignoran con un try/catch).
--
-- NOTA (verificación pedida por el plan, §5.3): la migración
-- 0002_fase_h.sql SÍ incluye la lectura de 'admin' sobre
-- `orientacion_vocacional` (su política combina admin y docente:
-- `p.rol in ('admin','docente')`), así que esta migración NO necesita
-- añadir nada para el vocacional.
--
-- Seguridad (igual que las demás tablas):
--   * RLS activado. El estudiante inserta y lee SOLO sus propias filas.
--   * El admin lee TODAS las filas (función `mi_rol()`).
--   * Nadie actualiza ni borra desde el cliente: el registro es
--     solo-lectura una vez escrito.
--   * Sin `service_role` en el código del sitio: el panel usa la
--     clave anon y estas políticas.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tabla `actividad`: un intento = una fila.
-- ---------------------------------------------------------------------------
create table public.actividad (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Qué se hizo: 'diagnostico' | 'actitudes' | 'vocacional' | 'juego'.
  -- 'juego' queda reservado: los juegos guardan hoy directo desde el
  -- navegador (sin POST), así que en la v1 no registran tiempo aquí.
  tipo text not null check (tipo in ('diagnostico', 'actitudes', 'vocacional', 'juego')),
  -- Momento en que el estudiante abrió el cuestionario/examen.
  inicio timestamptz not null default now(),
  -- Momento en que lo terminó (o lo abandonó, si se registra el cierre).
  fin timestamptz,
  -- Segundos entre inicio y fin. Se calcula al cerrar el intento; si el
  -- estudiante cierra la ventana sin terminar, queda NULL.
  duracion_segundos integer,
  created_at timestamptz not null default now()
);

-- El panel lista la actividad por fecha y por estudiante.
create index actividad_user_idx on public.actividad (user_id, inicio desc);
create index actividad_tipo_idx on public.actividad (tipo, inicio desc);

-- ---------------------------------------------------------------------------
-- RLS: el dueño inserta y lee lo suyo; el admin lee todo.
-- ---------------------------------------------------------------------------
alter table public.actividad enable row level security;

-- El estudiante registra sus propios intentos y ve su propio historial.
create policy "Actividad: el dueño inserta lo suyo"
  on public.actividad for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Actividad: el dueño lee lo suyo"
  on public.actividad for select to authenticated
  using (auth.uid() = user_id);

-- El admin (dirección: Mike, Irguen Rosas, Clarivel Loayza) lee toda la
-- actividad desde el panel. Sin esta política el panel vería la tabla
-- vacía aunque tenga filas.
create policy "Actividad: admin lee todo"
  on public.actividad for select to authenticated
  using (public.mi_rol() = 'admin');

-- Nadie actualiza ni borra actividad desde el cliente.
create policy "Actividad: nadie actualiza"
  on public.actividad for update to authenticated
  using (false);

create policy "Actividad: nadie borra"
  on public.actividad for delete to authenticated
  using (false);

-- ---------------------------------------------------------------------------
-- GRANTs: sin esto PostgREST responde 42501 aunque la política permita.
-- (Lección de la fase (a): las tablas nuevas necesitan sus GRANTs.)
-- ---------------------------------------------------------------------------
grant select, insert on public.actividad to anon, authenticated;
grant select, insert, update, delete on public.actividad to service_role;
