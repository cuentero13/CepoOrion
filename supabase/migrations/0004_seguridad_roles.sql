-- ============================================================================
-- 0004_seguridad_roles.sql — Fase (i): corrección CRÍTICA de la revisión
-- de seguridad del 22-nov-2026.
--
-- EL HUECO (revisión de seguridad, hallazgo crítico):
--   La política «Perfiles: crear el propio» (0001:48-49) solo exigía
--   auth.uid() = id, SIN limitar el rol. Y el trigger
--   trg_evitar_cambio_rol es solo BEFORE UPDATE: no hay ningún trigger
--   de INSERT. El registro del sitio inserta rol: 'estudiante' desde
--   el navegador (lib/auth.ts), pero eso no es garantía del servidor:
--   un registro directo por la API de Supabase Auth con rol='admin' en
--   la fila de profiles funcionaba. Cualquiera podía auto-asignarse
--   admin. La afirmación del plan §1.1/§2.2 de que el trigger impide
--   la auto-asignación era FALSA para INSERT.
--
-- LA CORRECCIÓN (defensa en profundidad, dos capas):
--   (a) La política de INSERT ahora exige rol = 'estudiante' en el
--       WITH CHECK: ni siquiera llega a insertarse una fila admin
--       por PostgREST.
--   (b) Un trigger BEFORE INSERT fuerza rol='estudiante' en toda fila
--       nueva, aunque alguien insertara directo por SQL con un rol
--       que se salta el RLS (service_role): el trigger sigue aplicando.
--
-- QUÉ NO CAMBIA:
--   * El procedimiento del primer admin sigue igual (es un UPDATE, no
--     un INSERT): deshabilitar trg_evitar_cambio_rol, UPDATE
--     rol='admin', rehabilitar. Ver docs/manual-docente.md, fase (i).
--   * Las políticas de lectura del buzón NO se tocan (siguen admin +
--     docentes; solo el cambio de estado es admin, decisión de Mike).
--   * El registro normal sigue igual: ya insertaba 'estudiante'.
--
-- Cómo se corre:
--   En Supabase (panel web) → SQL Editor → pegar este archivo completo
--   y pulsar Run. Se puede correr junto con la 0003 o después; son
--   independientes. Re-ejecutable: usa DROP IF EXISTS / CREATE OR
--   REPLACE, así que correrlo dos veces no da error.
--
-- DESPUÉS DE CORRERLA, AUDITORÍA OBLIGATORIA (correr en el SQL Editor
-- y revisar el resultado antes de dar la fase por terminada):
--   SELECT rol, count(*) FROM profiles GROUP BY rol;
--   SELECT alias, rol, created_at FROM profiles
--     WHERE rol <> 'estudiante' ORDER BY created_at;
--   Lo esperado hoy: solo 'estudiante' (Mike con alias el-cuentero y
--   Exon Gonzales). Si aparece un 'admin' o 'docente' que nadie
--   reconoce, NO seguir: avisar a Mike y devolver ese perfil a
--   'estudiante' con el procedimiento del primer admin (deshabilitar
--   trg_evitar_cambio_rol, UPDATE, rehabilitar).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- (a) Política de INSERT: solo se puede crear el propio perfil Y solo
--     con rol 'estudiante'.
-- ---------------------------------------------------------------------------
drop policy if exists "Perfiles: crear el propio" on public.profiles;
create policy "Perfiles: crear el propio" on public.profiles
  for insert with check (auth.uid() = id and rol = 'estudiante');

-- ---------------------------------------------------------------------------
-- (b) Trigger BEFORE INSERT: fuerza rol='estudiante' en toda fila nueva,
--     aunque el insert venga por SQL directo con un rol que se salta
--     el RLS. Segunda capa: si la política fallara o se borrara, el
--     trigger sigue cerrando el hueco.
-- ---------------------------------------------------------------------------
create or replace function public.forzar_rol_estudiante()
returns trigger
language plpgsql
as $$
begin
  new.rol := 'estudiante';
  return new;
end;
$$;

drop trigger if exists trg_forzar_rol_estudiante on public.profiles;
create trigger trg_forzar_rol_estudiante
  before insert on public.profiles
  for each row execute function public.forzar_rol_estudiante();
