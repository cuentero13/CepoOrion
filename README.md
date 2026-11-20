# CEPO — Centro Educativo Privado Orion

Sitio web del **Centro Educativo Privado Orion (CEPO)**, en Ixiamas,
provincia Abel Iturralde, departamento de La Paz, Bolivia.

> «Aprendamos en la selva» — lema propuesto, pendiente de
> aprobación de la dirección.

## Stack

- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 +
  **Supabase** (Auth + Postgres con RLS) — ver `docs/supabase-setup.md`
- **PWA** instalable con offline básico (manifest + service worker)
- Datos institucionales en `config/institucion.json`
- Banco de contenido editable en `data/` (ver `data/README.md`)

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # verifica que el build pasa
npm start          # sirve el build de producción
```

## Estructura

```
app/                  # Rutas (App Router): Inicio, Nosotros, Horarios, Diagnóstico, Juegos, Mi progreso, Buzón, Contacto, Privacidad
components/           # Hero, Nav, Footer, OrionLogo, EnConstruccion, RegisterSW
components/fauna/     # Ilustraciones SVG propias: jaguar, paraba, tapir, bufeo
config/               # institucion.json — TODOS los datos del colegio, con [COMPLETAR]
data/                 # Banco de contenido editable (horarios, preguntas)
docs/                 # guia-contenido-fuentes.md — fuentes oficiales a usar
lib/                  # Cargador tipado de config/institucion.json
public/               # manifest PWA, service worker, iconos SVG
```

## Regla de oro: datos reales

No se inventan cifras, testimonios, nombres de docentes, fotos de personas
ni estadísticas. Lo que falta va como `[COMPLETAR]` y lo dudoso como
`[VERIFICAR]`, centralizado en `config/institucion.json`. Ver
`docs/guia-contenido-fuentes.md`.

## Fases

| Fase | Contenido | Estado |
|---|---|---|
| (a) Base y diseño | Scaffold, paleta, hero de Orión, PWA, esqueleto | ✅ Terminada |
| (b) Secciones informativas | Nosotros, Horarios, Contacto | ✅ Terminada |
| (c) Autenticación y buzón | Login, Mi progreso, Buzón privado, Privacidad, Admin | ✅ Terminada (falta crear el proyecto Supabase — ver `docs/supabase-setup.md`) |
| (d) Exámenes | Diagnóstico adaptativo + actitudes y hábitos | ✅ Terminada (falta crear el proyecto Supabase para guardar resultados — ver `docs/supabase-setup.md`) |
| (e) Juegos | 6 juegos con puntos, insignias y niveles | Pendiente |
| (f) Pulido | Animaciones, Lighthouse ≥ 90, pruebas en móvil | Pendiente |

## Despliegue

- **GitHub:** `github.com/cuentero13/CepoOrion` — ramas `main` y `dev`.
- **Vercel:** conectar el repo en [vercel.com](https://vercel.com) (importar
  proyecto → elegir el repo → Deploy). Variables de entorno: Supabase
  (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) y, si se
  usa, Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
  `TURNSTILE_SECRET_KEY`). Ver `docs/supabase-setup.md`.

## Datos reales confirmados

- Director: **Irguen Rosas**
- Niveles: solo **bachillerato** por ahora (se espera crecer)
- Contacto oficial: **+591 73956239** (WhatsApp `[VERIFICAR]`)
- Logo real: la dirección lo enviará después; mientras tanto, SVG propio de Orión.
