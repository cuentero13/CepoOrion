-- ============================================================
-- CEPO — Migración 0001: esquema base + seguridad por fila (RLS)
-- ============================================================
-- Cómo aplicar: en el proyecto Supabase, Dashboard > SQL Editor,
-- pegar este archivo completo y ejecutar. Ver docs/supabase-setup.md.
-- Idempotente: se puede ejecutar más de una vez sin error.
--
-- Reglas de privacidad (muchos usuarios son menores de edad):
-- - Cada estudiante solo ve sus propios resultados.
-- - El buzón solo lo leen dirección y docentes autorizados.
-- - El rol (estudiante/docente/admin) solo lo cambia un admin por SQL;
--   ningún usuario puede auto-asignarse un rol mayor.

-- ---------- Función auxiliar: rol del usuario actual ----------
-- SECURITY DEFINER para evitar recursión en las políticas de `profiles`.
create or replace function public.mi_rol()
returns text
language sql
security definer
stable
as $$
  select rol from public.profiles where id = auth.uid();
$$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  alias text not null unique
    check (alias ~ '^[a-z0-9_][a-z0-9_-]{2,29}$'),
  curso text,
  email text,
  rol text not null default 'estudiante'
    check (rol in ('estudiante', 'docente', 'admin')),
  es_menor boolean not null default false,
  tutor_consent boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "Perfiles: ver el propio" on public.profiles;
create policy "Perfiles: ver el propio" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Perfiles: crear el propio" on public.profiles;
create policy "Perfiles: crear el propio" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Perfiles: actualizar el propio" on public.profiles;
create policy "Perfiles: actualizar el propio" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Perfiles: admin y docentes ven todos" on public.profiles;
create policy "Perfiles: admin y docentes ven todos" on public.profiles
  for select using (public.mi_rol() in ('admin', 'docente'));

-- Nadie puede auto-asignarse un rol mayor: solo un admin cambia `rol`.
create or replace function public.evitar_cambio_rol()
returns trigger
language plpgsql
as $$
begin
  if new.rol is distinct from old.rol
     and coalesce(public.mi_rol(), '') <> 'admin' then
    raise exception 'Solo un administrador puede cambiar el rol.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_evitar_cambio_rol on public.profiles;
create trigger trg_evitar_cambio_rol
  before update on public.profiles
  for each row execute function public.evitar_cambio_rol();

-- ---------- diagnosticos ----------
create table if not exists public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  area text not null,
  nivel text not null,
  puntaje integer,
  respuestas jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_diagnosticos_user
  on public.diagnosticos (user_id, created_at desc);
alter table public.diagnosticos enable row level security;

drop policy if exists "Diagnósticos: solo el dueño" on public.diagnosticos;
create policy "Diagnósticos: solo el dueño" on public.diagnosticos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Diagnósticos: admin y docentes leen" on public.diagnosticos;
create policy "Diagnósticos: admin y docentes leen" on public.diagnosticos
  for select using (public.mi_rol() in ('admin', 'docente'));

-- ---------- actitudes ----------
create table if not exists public.actitudes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  dimensiones jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_actitudes_user
  on public.actitudes (user_id, created_at desc);
alter table public.actitudes enable row level security;

drop policy if exists "Actitudes: solo el dueño" on public.actitudes;
create policy "Actitudes: solo el dueño" on public.actitudes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Actitudes: admin y docentes leen" on public.actitudes;
create policy "Actitudes: admin y docentes leen" on public.actitudes
  for select using (public.mi_rol() in ('admin', 'docente'));

-- ---------- progreso_juegos ----------
create table if not exists public.progreso_juegos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  juego text not null,
  puntos integer not null default 0,
  insignias jsonb not null default '[]'::jsonb,
  nivel integer not null default 1,
  updated_at timestamptz not null default now(),
  unique (user_id, juego)
);
create index if not exists idx_progreso_user
  on public.progreso_juegos (user_id, juego);
alter table public.progreso_juegos enable row level security;

drop policy if exists "Progreso: solo el dueño" on public.progreso_juegos;
create policy "Progreso: solo el dueño" on public.progreso_juegos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Progreso: admin y docentes leen" on public.progreso_juegos;
create policy "Progreso: admin y docentes leen" on public.progreso_juegos
  for select using (public.mi_rol() in ('admin', 'docente'));

-- ---------- buzon ----------
-- Los mensajes solo los leen admin y docentes. Cualquiera (incluso sin
-- cuenta) puede enviar: user_id queda null cuando es anónimo o visitante.
create table if not exists public.buzon (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  anonimo boolean not null default false,
  alias_visible text,
  tipo text not null default 'consulta'
    check (tipo in ('comentario', 'sugerencia', 'consulta')),
  mensaje text not null check (char_length(mensaje) <= 2000),
  estado text not null default 'nuevo'
    check (estado in ('nuevo', 'en_revision', 'resuelto')),
  created_at timestamptz not null default now()
);
create index if not exists idx_buzon_estado
  on public.buzon (estado, created_at desc);
alter table public.buzon enable row level security;

drop policy if exists "Buzón: cualquiera puede enviar" on public.buzon;
create policy "Buzón: cualquiera puede enviar" on public.buzon
  for insert with check (user_id is null or user_id = auth.uid());

drop policy if exists "Buzón: solo admin y docentes leen" on public.buzon;
create policy "Buzón: solo admin y docentes leen" on public.buzon
  for select using (public.mi_rol() in ('admin', 'docente'));

drop policy if exists "Buzón: solo admin cambia estado" on public.buzon;
create policy "Buzón: solo admin cambia estado" on public.buzon
  for update using (public.mi_rol() = 'admin')
  with check (public.mi_rol() = 'admin');

-- ---------- horarios ----------
-- Lectura pública (la página /horarios la lee sin login); solo admin escribe.
create table if not exists public.horarios (
  id uuid primary key default gen_random_uuid(),
  nivel text not null,
  turno text not null,
  dia text not null,
  materia text not null,
  hora_inicio time not null,
  hora_fin time not null
);
alter table public.horarios enable row level security;

drop policy if exists "Horarios: lectura pública" on public.horarios;
create policy "Horarios: lectura pública" on public.horarios
  for select using (true);

drop policy if exists "Horarios: solo admin escribe" on public.horarios;
create policy "Horarios: solo admin escribe" on public.horarios
  for all using (public.mi_rol() = 'admin')
  with check (public.mi_rol() = 'admin');

-- ---------- preguntas ----------
-- Lectura pública (los exámenes las leen sin login); solo admin escribe.
create table if not exists public.preguntas (
  id uuid primary key default gen_random_uuid(),
  area text not null,
  dificultad integer not null default 1 check (dificultad between 1 and 3),
  texto text not null,
  opciones jsonb not null,
  correcta integer not null,
  fuente text not null,
  justificacion text not null
);
alter table public.preguntas enable row level security;

drop policy if exists "Preguntas: lectura pública" on public.preguntas;
create policy "Preguntas: lectura pública" on public.preguntas
  for select using (true);

drop policy if exists "Preguntas: solo admin escribe" on public.preguntas;
create policy "Preguntas: solo admin escribe" on public.preguntas
  for all using (public.mi_rol() = 'admin')
  with check (public.mi_rol() = 'admin');
