-- ============================================================
-- CEPO — Migración 0002: orientación vocacional (fase h)
-- ============================================================
-- Cómo aplicar: en el proyecto Supabase, Dashboard > SQL Editor,
-- pegar este archivo completo y ejecutar. Ver docs/supabase-setup.md.
-- Idempotente: se puede ejecutar más de una vez sin error.
-- IMPORTANTE: sin correr esta migración, el cuestionario vocacional
-- (/vocacional) muestra el resultado en pantalla pero NO lo guarda en
-- la cuenta (la API responde error y el componente avisa). El resto
-- del sitio (diagnóstico, lógica, /futuro) no depende de ella.
--
-- Privacidad (igual que `actitudes`, decisión de Mike 22-nov-2026):
-- cada estudiante solo ve su propio perfil; docentes y admin lo leen
-- para orientar. No es un test psicológico ni una prueba oficial.

-- ---------- orientacion_vocacional ----------
create table if not exists public.orientacion_vocacional (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  dimensiones jsonb not null default '{}'::jsonb,
  perfil_top2 jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_orientacion_user
  on public.orientacion_vocacional (user_id, created_at desc);
alter table public.orientacion_vocacional enable row level security;

drop policy if exists "Orientación: solo el dueño" on public.orientacion_vocacional;
create policy "Orientación: solo el dueño" on public.orientacion_vocacional
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Orientación: admin y docentes leen" on public.orientacion_vocacional;
create policy "Orientación: admin y docentes leen" on public.orientacion_vocacional
  for select using (public.mi_rol() in ('admin', 'docente'));

-- ---------- Permisos (GRANT) ----------
-- Sin esto, PostgREST responde 42501 "permission denied for table ..."
-- aunque las políticas RLS existan (lección de la migración 0001).
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.orientacion_vocacional to anon, authenticated;
