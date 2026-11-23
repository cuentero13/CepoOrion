# supabase/

Migraciones SQL del sitio CEPO. Se aplican a mano en el proyecto Supabase
(Dashboard > SQL Editor) — ver `docs/supabase-setup.md`. No hay proyecto
Supabase creado todavía; las migraciones están listas para cuando Mike lo
cree.

- `migrations/0001_cepo_schema.sql` — tablas + RLS:
  - `profiles` (alias, curso, rol estudiante/docente/admin, consentimiento
    del tutor, correo opcional)
  - `diagnosticos`, `actitudes`, `progreso_juegos` (solo el dueño los ve;
    admin y docentes pueden leerlos)
  - `buzon` (cualquiera puede enviar, incluso sin cuenta; solo admin y
    docentes leen; solo admin cambia el estado)
  - `horarios`, `preguntas` (lectura pública, escritura solo admin)
  - Función `public.mi_rol()` (SECURITY DEFINER) y triggers
    `trg_evitar_cambio_rol` (UPDATE: solo un admin cambia roles) y
    `trg_forzar_rol_estudiante` (INSERT: toda cuenta nueva nace
    `'estudiante'`; migración 0004, corrección crítica 22-nov-2026)
