# Plan fase (h) — Orientación: nivel, lógica matemática y posibles carreras

**Fecha del plan:** 22 de noviembre de 2026
**Estado:** CONSTRUIDO 22-nov-2026 (fase h). **Aprobado por Mike 22-nov-2026 19:07:** (1) plan completo sí; (2) orden: tests primero, contenido después; (3) Muse actualiza las convocatorias 2027 en diciembre (para esta fase, las convocatorias 2027 van con marcador [VERIFICAR]); (4) los docentes TAMBIÉN ven el perfil vocacional (RLS igual que diagnósticos). Las 2 preguntas de división MAT-1-004 y MAT-1-005 quedan aprobadas dentro del plan. Push main + dev: ver SHAs en el informe de entrega. Pendiente de Mike: correr la migración `supabase/migrations/0002_fase_h.sql` en el SQL Editor de Supabase para que `/vocacional` guarde.
**Pide Mike (22-nov-2026, 18:53):** mejorar todos los tests para que, al terminar los 6 cuestionarios del diagnóstico, el estudiante vea su nivel de conocimiento, su nivel de lógica matemática y sus posibles carreras; y añadir contenido sobre qué hacer después del bachillerato (dónde estudiar, becas, otras opciones).

**Fuentes de este plan (leídas completas):**
- `educacion-superior-becas-bolivia.md` — informe de fuentes oficiales (22-nov-2026). Todo dato de universidades, becas y demanda laboral sale de ahí. Lo no verificado está marcado en ese informe y se traslada aquí como `[VERIFICAR]`.
- Investigación TikTok/redes (resumen entregado con el encargo): las preguntas top son «qué estudiar», «dónde estudiar», «¿puedo conseguir beca?», «carreras mejor pagadas», «universidad o carrera técnica», «estudiar y trabajar», «qué carreras va a reemplazar la IA». Formatos que funcionan: video corto vertical 30–90 s, rankings numerados, carruseles paso a paso, testimonios reales de egresados. **Advertencia: los sueldos de los infográficos virales NO son oficiales y los propios jóvenes los cuestionan — nunca usarlos como dato duro.**
- Código y datos actuales del sitio (leídos 22-nov-2026): `data/preguntas.json`, `data/actitudes.json`, `data/juegos/*.json`, `lib/diagnostico.ts`, `app/diagnostico/ExamenDiagnostico.tsx`, `app/diagnostico/page.tsx`, `app/progreso/page.tsx`, `app/actitudes/CuestionarioActitudes.tsx`, `supabase/migrations/0001_cepo_schema.sql`, `config/institucion.json`, `components/Nav.tsx`.

**Regla de oro (vigente):** solo datos reales, nada inventado (ni cifras, ni testimonios, ni nombres). Lo que falte va como `[COMPLETAR]` o `[VERIFICAR]` centralizado en `config/institucion.json`.

---

## 1. Estado actual: qué mide cada test y qué muestra hoy la pantalla de resultados

### 1.1 Diagnóstico académico (`/diagnostico`)

- **Qué mide:** 6 áreas (Matemática, Lenguaje, Ciencias Naturales, Ciencias Sociales, Inglés, Filosofía). Banco de 60 preguntas, 10 por área, dificultad 1–3, con justificación y fuente obligatorias.
- **Cómo se hace:** por área, 6 preguntas adaptativas: se empieza en dificultad 2, sube con cada acierto y baja con cada error. No requiere cuenta; con sesión, el resultado se guarda en la tabla `diagnosticos` (área, nivel, puntaje, respuestas JSONB).
- **Qué muestra hoy:**
  - Al terminar un área: nivel (Inicial / Básico / Intermedio / Avanzado), correctas de 6, puntaje 0–100 ponderado por dificultad, consejo por nivel, recomendaciones del área y revisión pregunta por pregunta con justificación y fuente.
  - Resumen general (botón «Ver mi resumen general»): nivel general = media de los puntajes de las áreas hechas, gráfico radar por área y recomendaciones por área.
- **Qué falta (brechas que motivan esta fase):**
  1. El resumen general **solo existe en la memoria del navegador** durante el examen: si el estudiante cierra la página, lo pierde. `/progreso` reconstruye el radar desde los últimos diagnósticos guardados, pero **no muestra nivel general ni ninguna orientación vocacional**.
  2. **No hay desglose por tema dentro de un área.** Un estudiante puede salir «Básico» en Matemática sin saber si falló en división, en álgebra o en geometría. Es exactamente el caso de Exon (14 años, no sabe dividir bien): hoy el diagnóstico no puede decir «no divide bien», porque ninguna pregunta mide la división sola (la división solo aparece escondida en MAT-1-003, MAT-2-001, MAT-2-003 y MAT-3-003) y porque, con 10 preguntas en el banco y 6 servidas por examen, ni siquiera hay garantía de que una pregunta de aritmética básica aparezca.
  3. **No existe medida de lógica matemática.** Hay preguntas que exigen razonar (regla de tres, despejar x, Pitágoras, media, silogismo en Filosofía), pero ninguna puntuación separada de «lógica».
  4. **No existe ninguna orientación vocacional.** Nada conecta los resultados con carreras, universidades ni becas.

### 1.2 Actitudes y hábitos (`/actitudes`)

- **Qué mide:** 24 ítems Likert 1–5 en 6 dimensiones (Hábitos de estudio, Motivación, Autorregulación, Manejo del tiempo, Trabajo en equipo, Proyecto de vida), con aviso «solo orientativo, no es un diagnóstico psicológico». Se guarda en la tabla `actitudes` (dimensiones JSONB).
- **Qué muestra hoy:** promedio por dimensión (1–5) con 3 bandas (≥4 «Una fortaleza», 3–3,99 «Buen camino», <3 «Un espacio para crecer») y sugerencias por dimensión.
- **Relevancia para esta fase:** la dimensión «Proyecto de vida» (4 ítems) mide si el estudiante piensa en su futuro, pero **no mide intereses vocacionales** (qué le gusta hacer). No basta para sugerir carreras: hace falta un instrumento de intereses (ver §4).

### 1.3 Juegos (`/juegos`)

- **Qué miden:** 6 juegos sin ranking público, con puntos, niveles e insignias: Constelaciones (12 preguntas), Detective de noticias (12 casos verdadero/falso), Aventura Madidi (12), Mapa de Bolivia (14), Mi primer presupuesto (10 escenarios), Primeros auxilios (12).
- **Relevancia para esta fase:** dos juegos ya entrenan habilidades cercanas a la lógica — **Detective de noticias** (pensamiento crítico: verificar fuentes, detectar bulos) y **Mi primer presupuesto** (decisiones con dinero en bolivianos) — pero **ninguno puntúa lógica matemática ni alimenta el perfil vocacional**. No se propone cambiar los juegos en esta fase; solo se los menciona en la orientación como práctica complementaria (por ejemplo, el Detective es práctica directa para no caer en bulos de becas falsas por WhatsApp).

### 1.4 Mi progreso (`/progreso`)

- **Qué muestra hoy:** historial de diagnósticos, evolución por área (radar con el último nivel), última medición de actitudes, insignias y puntos de juegos, y «Metas personales» (vacía: «cuando la próxima fase habilite las metas…»).
- **Qué falta:** nivel general consolidado, nivel de lógica, perfil vocacional y enlace a «Después del bachillerato».

### 1.5 Contenido «después del bachillerato»

- **Hoy no existe nada.** No hay ninguna página, sección ni dato sobre universidades, becas o carreras. Todo el contenido se crea en esta fase a partir del informe oficial (ver §6).

---

## 2. Diseño 1 — Nivel por área y nivel general, mejorados

Se mantiene la escala actual (Inicial / Básico / Intermedio / Avanzado, cortes 40 / 60 / 80 sobre puntaje ponderado 0–100) y el motor adaptativo. Los cambios son de **presentación, desglose y persistencia**, no de la escala:

1. **Desglose por tema dentro de cada área.** Se añade un campo `tema` a cada pregunta del banco (solo metadato, sin cambiar el texto de ninguna pregunta). En Matemática: `Aritmética`, `Álgebra`, `Geometría`, `Estadística`. La pantalla de resultado de un área muestra, además del nivel, **«Temas a reforzar»**: los temas con 0 aciertos entre las preguntas servidas. Con esto, si Exon falla las preguntas de división, su resultado dirá literalmente «Aritmética: división — a reforzar».
   - Clasificación propuesta para las 10 preguntas actuales de Matemática (ver §3.2).
2. **Tarjeta «Tu perfil» en el resumen general.** Cuando el estudiante completó las 6 áreas: fortalezas (las 2 áreas con mayor puntaje), a reforzar (las 2 con menor puntaje) y nivel general. Si faltan áreas, el resumen dice «Te faltan N áreas para ver tu perfil completo» con el avance «N de 6» (hoy ya existe el contador, pero sin el mensaje de desbloqueo).
3. **El resumen general pasa a vivir también en `/progreso`.** No hace falta una tabla nueva para el nivel: `/progreso` ya lee los últimos diagnósticos por área y reconstruye el radar; se le añade el cálculo del nivel general (media de puntajes, misma función `nivelGeneral` de `lib/diagnostico.ts`) y la tarjeta «Tu perfil». Así el estudiante lo ve cada vez que entra con su cuenta, aunque haya cerrado el examen.
4. **Aviso honesto permanente** (en el resumen y en `/progreso`): «Este diagnóstico mide lo que sabés hoy en 6 áreas del colegio. No es un examen de admisión ni una prueba oficial: las universidades tienen sus propios exámenes (PSA, curso preuniversitario).»

---

## 3. Diseño 2 — Lógica matemática

### 3.1 Decisión de diseño

**Se crea un módulo aparte, «Lógica matemática», de 6 preguntas fijas (no adaptativas), como 7.ª tarjeta del examen, después de las 6 áreas.** No se mete dentro de Matemática. Razones:

- La lógica es una **habilidad transversal**, no un tema más de Matemática: se usa en matemática, en filosofía y en la vida (y el examen de las ESFM la mide aparte: 30 de 100 preguntas de la prueba 2026 son de razonamiento lógico-matemático — dato del informe oficial, §3).
- Con 6 preguntas dedicadas, el puntaje de lógica se basa siempre en los mismos 6 ítems: es **comparable** entre estudiantes y entre intentos. Si la lógica se midiera solo con las preguntas de Matemática que «tocan» salir en cada examen adaptativo, algunos estudiantes tendrían 0 preguntas de lógica servidas y el puntaje no significaría nada.
- El módulo es corto (unos 5 minutos) y **sirve como práctica directa para la prueba de las ESFM**, lo que se dice explícitamente en la página: «Estas preguntas son parecidas a las de razonamiento lógico-matemático del examen de las Escuelas de Maestros».

El módulo usa la misma escala de 4 niveles y los mismos cortes (40 / 60 / 80). Se muestra en el resumen general y en `/progreso` como una barra aparte (no como 7.º eje del radar, para no mezclar una habilidad transversal con las 6 áreas de conocimiento).

### 3.2 Qué preguntas existentes ya sirven (y cómo se etiquetan)

Se añade un campo `habilidad` a las preguntas del banco. Estas ya exigen razonar y se etiquetan `logica` (sin cambiar su texto):

| Pregunta | Tema | Por qué es lógica |
|---|---|---|
| MAT-1-003 (25% de 80) | Aritmética | Razonamiento proporcional |
| MAT-2-001 (regla de tres) | Aritmética | Razonamiento proporcional |
| MAT-2-003 (despejar x) | Álgebra | Razonamiento algebraico |
| MAT-2-004 (Pitágoras) | Geometría | Razonamiento espacial |
| MAT-3-002 (interés simple) | Aritmética | Razonamiento con dinero |
| MAT-3-003 (media) | Estadística | Razonamiento estadístico |
| FIL-2-003 (silogismo) | — | Razonamiento deductivo |
| FIL-2-004 (qué estudia la lógica) | — | Conocimiento de lógica |

Clasificación por tema de las 10 preguntas actuales de Matemática (campo `tema` nuevo):

- MAT-1-001 (7 × 8) → Aritmética. MAT-1-002 ((−5) + 8) → Aritmética. MAT-1-003 (25% de 80) → Aritmética.
- MAT-2-001 (regla de tres) → Aritmética. MAT-2-002 (área rectángulo) → Geometría. MAT-2-003 (2x + 5 = 13) → Álgebra. MAT-2-004 (Pitágoras) → Geometría.
- MAT-3-001 (x² − 5x + 6 = 0) → Álgebra. MAT-3-002 (interés simple) → Aritmética. MAT-3-003 (media) → Estadística.

**Importante:** las preguntas etiquetadas `logica` NO se suman al puntaje del módulo de lógica (el módulo tiene sus 6 preguntas propias). Las etiquetas sirven para que el resultado de Matemática diga qué tipo de razonamiento falló, y para que el docente vea el mapa completo. No mezclar los dos puntajes: sería engañoso.

### 3.3 Las 2 preguntas de división (ya propuestas a Mike, pendientes de su 👍)

Se añaden al banco en el formato exacto del resto (nivel 1, área Matemática, tema Aritmética):

```json
{
  "area": "Matemática",
  "fuente": "Currículo Base del Ministerio de Educación de Bolivia — Matemática, Educación Secundaria Comunitaria Productiva.",
  "id": "MAT-1-004",
  "justificacion": "96 ÷ 8 = 12, porque 12 × 8 = 96.",
  "nivel": 1,
  "opciones": ["11", "12", "14", "16"],
  "pregunta": "¿Cuál es el resultado de 96 ÷ 8?",
  "respuesta_correcta": 1,
  "tema": "Aritmética"
}
```

```json
{
  "area": "Matemática",
  "fuente": "Currículo Base del Ministerio de Educación de Bolivia — Matemática, Educación Secundaria Comunitaria Productiva.",
  "id": "MAT-1-005",
  "justificacion": "120 ÷ 6 = 20 bolivianos para cada estudiante.",
  "nivel": 1,
  "opciones": ["15 bolivianos", "18 bolivianos", "20 bolivianos", "24 bolivianos"],
  "pregunta": "Se reparten 120 bolivianos en partes iguales entre 6 estudiantes. ¿Cuánto le toca a cada uno?",
  "respuesta_correcta": 2,
  "tema": "Aritmética"
}
```

**Advertencia de diseño (no esconderla):** con 12 preguntas en el banco de Matemática y 6 servidas por examen, estas dos preguntas **no aparecen garantizadas en cada intento**. Para que la división se mida de verdad se añade una cuota mínima al motor adaptativo: la primera pregunta de Matemática es siempre una de nivel 1 etiquetada `Aritmética` (rota entre MAT-1-001, MAT-1-002, MAT-1-003, MAT-1-004 y MAT-1-005), y al menos 2 de las 6 preguntas servidas son de Aritmética de nivel 1–2. Así, repitiendo el área, el estudiante se encuentra seguro con la división, y el desglose por tema (§2.1) la muestra cuando falla.

### 3.4 Las 6 preguntas nuevas de lógica (formato banco exacto)

Área: `Lógica matemática` (nueva, no es una de las 6 áreas). Orden fijo: 2 de nivel 1, 2 de nivel 2, 2 de nivel 3, en ese orden (de fácil a difícil). Fuente común: «Currículo Base del Ministerio de Educación de Bolivia — Matemática, Educación Secundaria Comunitaria Productiva» y, para el silogismo, «Cosmovisiones, Filosofía y Psicología (Filosofía)». Todas verificadas a mano (cálculo y razonamiento revisados):

```json
{
  "area": "Lógica matemática",
  "fuente": "Currículo Base del Ministerio de Educación de Bolivia — Matemática, Educación Secundaria Comunitaria Productiva.",
  "id": "LOG-1-001",
  "justificacion": "La serie suma 2 cada vez: 2, 4, 6, 8, 10.",
  "nivel": 1,
  "opciones": ["9", "10", "11", "12"],
  "pregunta": "En la serie 2, 4, 6, 8, ¿qué número sigue?",
  "respuesta_correcta": 1
}
```

```json
{
  "area": "Lógica matemática",
  "fuente": "Currículo Base del Ministerio de Educación de Bolivia — Cosmovisiones, Filosofía y Psicología (Filosofía), Educación Secundaria Comunitaria Productiva.",
  "id": "LOG-1-002",
  "justificacion": "Si todos los gatos son animales y Tom es un gato, entonces Tom tiene que ser un animal. Es un razonamiento con dos premisas y una conclusión.",
  "nivel": 1,
  "opciones": ["Tom es un animal", "Tom es un perro", "No se puede saber", "Tom no es un animal"],
  "pregunta": "Si todos los gatos son animales y Tom es un gato, ¿qué se puede afirmar de Tom?",
  "respuesta_correcta": 0
}
```

```json
{
  "area": "Lógica matemática",
  "fuente": "Currículo Base del Ministerio de Educación de Bolivia — Matemática, Educación Secundaria Comunitaria Productiva.",
  "id": "LOG-2-001",
  "justificacion": "En el peor de los casos sacás primero las 2 azules; la tercera bola ya tiene que ser roja. Por eso hay que sacar 3 para estar seguro.",
  "nivel": 2,
  "opciones": ["1", "2", "3", "5"],
  "pregunta": "Una caja tiene 3 bolas rojas y 2 azules. Sin mirar, ¿cuántas bolas hay que sacar para estar seguro de tener al menos una roja?",
  "respuesta_correcta": 2
}
```

```json
{
  "area": "Lógica matemática",
  "fuente": "Currículo Base del Ministerio de Educación de Bolivia — Matemática, Educación Secundaria Comunitaria Productiva.",
  "id": "LOG-2-002",
  "justificacion": "Dentro de 6 años María tendrá 18, así que hoy tiene 12. Su hermano tiene la mitad: 6 años.",
  "nivel": 2,
  "opciones": ["4 años", "6 años", "8 años", "9 años"],
  "pregunta": "María tiene el doble de la edad de su hermano. Dentro de 6 años, María tendrá 18 años. ¿Cuántos años tiene su hermano ahora?",
  "respuesta_correcta": 1
}
```

```json
{
  "area": "Lógica matemática",
  "fuente": "Currículo Base del Ministerio de Educación de Bolivia — Matemática, Educación Secundaria Comunitaria Productiva.",
  "id": "LOG-3-001",
  "justificacion": "Si Ana está delante de Bruno y detrás de Carla, el orden es Carla, Ana, Bruno: Ana está en el medio.",
  "nivel": 3,
  "opciones": ["Ana", "Bruno", "Carla", "No se puede saber"],
  "pregunta": "En una fila, Ana está delante de Bruno y detrás de Carla. ¿Quién está en el medio?",
  "respuesta_correcta": 0
}
```

```json
{
  "area": "Lógica matemática",
  "fuente": "Currículo Base del Ministerio de Educación de Bolivia — Matemática, Educación Secundaria Comunitaria Productiva.",
  "id": "LOG-3-002",
  "justificacion": "Primera venta: 100 − 80 = 20 de ganancia. Segunda venta: 130 − 110 = 20 de ganancia. En total ganó 40 bolivianos.",
  "nivel": 3,
  "opciones": ["20 bolivianos", "30 bolivianos", "40 bolivianos", "50 bolivianos"],
  "pregunta": "Un comerciante compra un producto en Bs 80 y lo vende en Bs 100. Después lo vuelve a comprar en Bs 110 y lo vende en Bs 130. ¿Cuánto ganó en total?",
  "respuesta_correcta": 2
}
```

Con estas 6, el banco pasa de 60 a **68 preguntas** (Matemática 12, resto 10 por área, Lógica 6).

---

## 4. Diseño 3 — Cuestionario vocacional general nuevo

### 4.1 Decisión de diseño

**Se crea un cuestionario vocacional nuevo y corto, y se cruza con los 6 diagnósticos.** No basta con cruzar los 6 cuestionarios existentes. Razones:

- **Saber hacer no es lo mismo que querer hacer.** Un estudiante puede tener Matemática en Avanzado y no querer estudiar ingeniería. El diagnóstico mide capacidad; el cuestionario vocacional mide **interés**. Sin intereses, las «posibles carreras» serían solo un reflejo de las notas.
- La dimensión «Proyecto de vida» de actitudes (4 ítems) mide si el estudiante **piensa** en su futuro, no **qué** le interesa. No sirve como instrumento vocacional.
- El instrumento elegido es el modelo **RIASEC de Holland** (Realista, Investigativo, Artístico, Social, Emprendedor, Convencional): es el modelo estándar en orientación vocacional, se explica en una línea y cada dimensión se mide con 3 ítems. Se presenta siempre como **orientativo** («esto muestra qué te interesa hoy, no decide tu futuro») y nunca como diagnóstico psicológico.

### 4.2 Formato

- **18 preguntas, escala Likert 1–5** (la misma que actitudes: Nada / Poco / Más o menos / Bastante / Mucho), 3 ítems por dimensión. Unos 5 minutos. Sin respuestas correctas ni incorrectas.
- **Puntuación:** promedio por dimensión (1–5). Bandas iguales que actitudes: ≥4 «interés fuerte», 3–3,99 «interés medio», <3 «poco interés». El perfil es **las 2 dimensiones más altas**. Desempate: si dos dimensiones empatan, se ordena por el puntaje del área del diagnóstico afín (por ejemplo, Investigativo se desempatiza con Matemática); si persiste el empate, se muestran las dos.
- **Cuándo se hace:** se puede hacer en cualquier momento (ruta propia `/vocacional`, sin cuenta obligatoria, como actitudes), pero **las carreras sugeridas solo aparecen cuando el diagnóstico de las 6 áreas + lógica + vocacional están completos**. Antes de eso, el resultado vocacional muestra solo los intereses («te interesa mucho lo social y lo práctico») con el mensaje «Completá el diagnóstico para ver qué carreras combinan con tus intereses y tus fortalezas».
- **Dónde se guarda:** tabla nueva `orientacion_vocacional` (ver §7). Mismo patrón RLS que `actitudes` (solo el dueño; docentes leen — ver pregunta abierta 8).
- **Aviso obligatorio** en la página y en el resultado: «Esto no es un test psicológico ni una prueba oficial. Muestra qué te interesa hoy. Hablalo con tu familia y con tus docentes antes de decidir.»

### 4.3 Los 18 ítems (borrador, con contexto de Ixiamas y Madidi)

Dimensión **Realista** (trabajo práctico, con las manos, al aire libre):
- R1. «Me gusta arreglar aparatos, máquinas o cosas que se rompen.»
- R2. «Me gusta trabajar al aire libre, en el campo, el río o la selva.»
- R3. «Me gusta construir o armar cosas con mis manos.»

Dimensión **Investigativo** (entender cómo funcionan las cosas):
- I1. «Me gusta entender cómo funcionan las cosas y por qué pasan.»
- I2. «Me gusta hacer experimentos o investigar un tema hasta entenderlo.»
- I3. «Me gustan los números, los datos y resolver problemas difíciles.»

Dimensión **Artístico** (crear, expresarse):
- A1. «Me gusta dibujar, pintar, cantar, bailar o actuar.»
- A2. «Me gusta inventar historias, escribir o crear cosas nuevas.»
- A3. «Me gusta tomar fotos o grabar videos.»

Dimensión **Social** (ayudar, enseñar, cuidar):
- S1. «Me gusta ayudar y explicar cosas a otras personas.»
- S2. «Me gustaría trabajar cuidando la salud de otros o enseñando.»
- S3. «Me gusta trabajar en grupo y escuchar a los demás.»

Dimensión **Emprendedor** (vender, organizar, liderar):
- E1. «Me gusta vender, atender clientes o convencer a otros de una idea.»
- E2. «Me gustaría tener mi propio negocio o proyecto.»
- E3. «Me gusta organizar actividades y que otros me sigan.»

Dimensión **Convencional** (orden, registros, números exactos):
- C1. «Me gusta organizar papeles, cuentas y horarios, y que todo esté en orden.»
- C2. «Me gusta trabajar con planillas, registros y números exactos.»
- C3. «Me gusta seguir instrucciones claras y terminar lo que empiezo.»

---

## 5. Diseño 4 — Orientación vocacional: del perfil a las carreras

### 5.1 Reglas de mapeo (sin inventar nada)

El perfil vocacional combina **2 fuentes**: las 2 áreas más fuertes del diagnóstico (+ el nivel de lógica) y las 2 dimensiones RIASEC más altas. Una familia de carreras se muestra cuando cumple **al menos una** de estas condiciones:

- el área del diagnóstico ligada a esa familia está en **Intermedio o Avanzado**, o
- la dimensión RIASEC ligada está en **«interés fuerte» (≥4)**.

Se muestran **2–3 familias** como «para explorar», ordenadas por la combinación de ambas fuentes. Si ninguna familia cumple el mínimo, no se inventa un perfil: se muestra «Tu perfil todavía está en construcción: reforzá tus áreas más bajas y repetí el diagnóstico» + los intereses vocacionales solos.

**Nunca se presenta una carrera como «la tuya» ni como una predicción.** El texto exacto propuesto para la pantalla: «Según lo que sabés hoy y lo que te interesa hoy, estas familias de carreras combinan con vos. No es una decisión: es un punto de partida para averiguar más.»

### 5.2 Tabla de mapeo (solo carreras e instituciones del informe oficial)

| Familia | Áreas que pesan | RIASEC | Carreras (solo del informe) | Vías reales en Bolivia (del informe) | Advertencia |
|---|---|---|---|---|---|
| Ingenierías y tecnología | Matemática, Lógica | Investigativo, Realista | Ing. de Sistemas, Civil, Forestal, Agronómica, Comercial, Eléctrica, Electrónica, Mecánica Automotriz, Mecánica Industrial, Electromecánica, Topografía/Geodesia, Química Industrial, Ing. en Inteligencia Artificial | UMSA Tecnología (PSA Bs 150), UTO, UAGRM, UMSS, UABJB Riberalta (Civil, Forestal), UAP virtual (Ing. en IA) | Son las áreas con mayor demanda empresarial (32% según BID 2019) |
| Salud y cuidado | Ciencias Naturales | Social, Investigativo | Medicina, Enfermería, Nutrición, Tecnología Médica, Bioquímica y Farmacia, Veterinaria y Zootecnia | UMSA, UABJB Trinidad (Medicina 5 años, Veterinaria), UTO (Medicina 210 plazas, Enfermería 78), UATF | Mucha competencia y sobredemanda de titulados (BID 2019) |
| Educación y docencia | Lenguaje, Ciencias Sociales | Social | Maestro/a (ESFM), Ciencias de la Educación, Educación Especial, Educación Virtual | ESFM (examen único nacional, Bs 108, 3.010 plazas en 2026), UABJB Riberalta, UAP virtual | La convocatoria ESFM 2027 aún no está publicada [VERIFICAR] |
| Derecho, comunicación y ciencias sociales | Lenguaje, Ciencias Sociales | Social, Artístico, Emprendedor | Derecho, Comunicación Social, Lingüística, Ciencias de la Educación | UABJB (Derecho en Riberalta, Comunicación en Trinidad), UMSA Humanidades | Derecho está entre las carreras con más egresados (sobredemanda) |
| Administración, economía y negocios | Matemática, Ciencias Sociales | Emprendedor, Convencional | Contaduría Pública, Administración de Empresas, Ingeniería Comercial, Economía, Marketing Digital, Comercio Internacional y Aduanas | UMSA Económicas, UABJB, UAGRM, UMSS, UAP virtual (Contaduría, Administración Secretarial) | Contabilidad, Administración e Ing. Comercial: muy demandadas Y con muchísimos titulados (BID 2019) |
| Agro, ambiente y territorio | Ciencias Naturales | Realista, Investigativo | Ing. Agronómica, Ing. Forestal, Ing. Agropecuaria, Veterinaria y Zootecnia, Gestión Turística y Hotelera, Turismo, Turismo Sostenible, Gestión Ganadera | UABJB (Riberalta, Guayaramerín, Trinidad), UAP, UPEA (Turismo escalonado Técnico Medio → Superior → Licenciatura), UMSA Agronomía | Hotelería y Turismo está entre las 10 carreras más demandadas (BID 2019) |
| Carreras técnicas cortas | (práctico; no exige nivel alto) | Realista, Convencional | Técnico Superior INFOCAL: Enfermería, Mecánica Automotriz, Mecánica Industrial, Sistemas Informáticos, Gastronomía, Contaduría General, Administración Industrial, Mercadotecnia, Informática Industrial, Parvulario, Secretariado Ejecutivo; técnicos UMSA Tecnología y UPEA | INFOCAL (3 años, 70% práctico), UMSA Tecnología, UPEA | INFOCAL no otorga becas (FAQ oficial). Es la vía más rápida al trabajo |
| Si no te podés mudar | — | — | Las carreras 100% virtuales de la UAP (Diseño Gráfico, Psicología, Contaduría Pública, Ing. en IA, entre otras) + cursos tecnológicos del MinEdu | UAP campus virtual; Becas Tecnológicas MinEdu (cursos Oracle, Google, Microsoft) | Convocatoria MinEdu 2027 aún no publicada [VERIFICAR] |

Cada familia mostrada enlaza a su ficha en la sección «Después del bachillerato» (§6), con los pasos concretos (cómo se entra, cuánto cuesta el examen, fechas vigentes o [VERIFICAR]).

### 5.3 Qué NO se promete

- **No se muestran sueldos.** No hay ninguna cifra oficial de sueldos por carrera en Bolivia (el INE no publica demanda por carrera; la fuente es la encuesta BID 2019, que no da sueldos). En la página «Carreras con futuro» va un aviso visible: «En TikTok circulan infográficos con sueldos por carrera. Esos números no son oficiales: ningún organismo público de Bolivia publica sueldos por carrera. No tomes una decisión por un número de un video.»
- **No se promete admisión ni beca.** Cada vía dice cómo se entra y qué falta (examen, costo, fecha) o «convocatoria aún no publicada».
- **No se inventan carreras.** Solo aparecen carreras que el informe oficial confirma que existen en las instituciones listadas. Si una carrera interesa y no está en el informe, no se añade hasta verificarla.

---

## 6. Diseño 5 — Sección «Después del bachillerato»

### 6.1 Estructura

Nueva ruta **`/futuro`**, entrada en el menú principal con la etiqueta **«Tu futuro»** (ver pregunta abierta 3). Página pública, sin necesidad de cuenta, con 4 bloques + calendario. El título de la página: «Después del bachillerato: qué podés hacer». Tono: voseo, directo, como el resto del sitio.

1. **Dónde estudiar** — tarjetas por institución, con ciudad, cómo se entra, costo del examen donde esté verificado, enlace oficial y estado de la convocatoria. Instituciones (solo las del informe): UMSA (La Paz), UPEA (El Alto), UABJB (Trinidad, Riberalta, Guayaramerín), UAP (Cobija, virtual), UAGRM (Santa Cruz), UMSS (Cochabamba), UTO (Oruro), USFX (Sucre), UAJMS (Tarija), UATF (Potosí), ESFM (todo el país) e INFOCAL (9 departamentos). Cada tarjeta lleva: qué carreras ofrece en la sede más cercana a Ixiamas (Riberalta para UABJB; virtual para UAP), cómo se entra (PSA / curso preuniversitario / admisión especial), costo verificado o «costo por confirmar en la convocatoria» y enlace oficial.
2. **Becas** — las del informe, en orden de importancia para Ixiamas:
   - Programa de Becas para Jóvenes del MinEdu: Becas Sociales 7.000 (licenciaturas en universidades privadas y técnico superior) y Becas Tecnológicas 10.000 (cursos virtuales Oracle, Google, Microsoft). **Ciclo 2026 cerrado; convocatoria 2027 no publicada → [VERIFICAR], con el aviso «Revisá minedu.gob.bo en diciembre».**
   - Becas internas de la UPEA (comedor, ayudantía, trabajo, tesis): **detalle no verificado [VERIFICAR]**.
   - UCB: Beca Bachiller (100%) y Beca Patiño (100%, la selecciona la Fundación Patiño); Beca Estrella del Sur (área rural).
   - Convenio GAMLP–UPB (9 becas completas): **elegibilidad de un bachiller de Ixiamas NO verificada [VERIFICAR]** — Ixiamas es del departamento de La Paz pero no del municipio de La Paz.
   - Internacionales de grado (MEXT Japón, Türkiye Bursları, Stipendium Hungaricum): solo con inglés y promedios altos y un año de anticipación; montos y plazos 2027 **por confirmar en las webs oficiales [VERIFICAR]**.
   - Lo que NO existe (para no buscar en vano): no se encontró beca de la Gobernación de La Paz ni beca específica para Ixiamas/Iturralde.
   - Checklist «Cómo postular a una beca» (pasos genéricos y verificables: cédula, diploma de bachiller, promedio, registro en la convocatoria; cada requisito con su fuente o [VERIFICAR]).
3. **Carreras con futuro** — el contenido honesto del informe, sin ranking inventado:
   - Las 10 carreras más demandadas por las empresas (BID 2019, vía IBCE): Contabilidad, Ingeniería Comercial, Administración de Empresas, Hotelería y Turismo, Geografía y Geodesia, Ingeniería de Sistemas, Ingeniería Eléctrica, Marketing y Publicidad, Auditoría e Ingeniería Electrónica. Con la fecha y el límite de la fuente («encuesta de 2019, solo eje troncal La Paz–Cochabamba–Santa Cruz»).
   - El problema: ~19.000 licenciados titulados por año frente a 3.032–5.054 puestos demandados; carreras con más egresados (Derecho, Medicina, Contabilidad, Administración, Ing. Comercial, Ciencias de la Educación, Odontología, Sistemas, Enfermería, Bioquímica y Farmacia).
   - Contexto INE: desempleo urbano 2,9% (3.er trim. 2025), juvenil 4,4%, 80–85% del empleo es informal.
   - Aviso sobre sueldos virales (ver §5.3).
   - «¿Qué carreras va a reemplazar la IA?» (pregunta top de TikTok): respuesta honesta en la página — no hay ninguna lista oficial; lo que sí se sabe es que la demanda empresarial se concentra en economía/finanzas/administración (50%) e ingeniería/tecnología (32%) (BID 2019), que la UAP ofrece Ingeniería en Inteligencia Artificial 100% virtual y que el MinEdu beca cursos de IA, datos y software. Texto de orientación, no dato: «La IA cambia todas las carreras: la ventaja es combinar tu oficio con herramientas digitales». Sin prometer nada.
4. **¿Y si quiero trabajar ya?** — INFOCAL (Técnico Superior en 3 años, 70% práctico, sin becas), carreras técnicas de la UMSA Tecnología y la UPEA (ruta escalonada Técnico Medio → Superior → Licenciatura) y los oficios y proyectos de Ixiamas que ya aparecen en el cuestionario de actitudes (agroforestería, ecoturismo, castaña, salud, educación) como opciones para conocer de cerca — **sin inventar ingresos ni empleos**.

**Calendario (bloque final de la página):** línea de tiempo con las fechas verificadas al 22-nov-2026 y las que hay que vigilar:

| Fecha | Qué | Estado |
|---|---|---|
| Hasta 6-dic-2026 | UMSA Agronomía: inscripción PSA | Vigente (verificado 22-nov) |
| Hasta 9-dic-2026, examen 10-dic-2026 | UATF PSA 1/2027 (~45 carreras) | Vigente (verificado 22-nov) |
| Hasta 11-dic-2026 | UMSA Humanidades: inscripción PSA | Vigente (verificado 22-nov) |
| Hasta 18-dic-2026 | UAJMS CPU: inscripciones | Vigente (verificado 22-nov) |
| Diciembre 2026 | Vigilar minedu.gob.bo: convocatoria 2027 de Becas para Jóvenes y de ESFM | **[VERIFICAR]** |
| Hasta 14-ene-2027 | UMSA Económicas/Contaduría: inscripción PSA | Vigente (verificado 22-nov) |
| Hasta 23-ene-2027; exámenes 25, 27, 29 y 30-ene-2027 | UMSA Tecnología: inscripción PSA (Bs 150) | Vigente (verificado 22-nov) |
| Hasta 29-ene-2027; examen 4-feb-2027 | UAJMS segunda PSA | Vigente (verificado 22-nov) |

### 6.2 Cómo se guardan los datos (gobernanza del contenido)

- **Un solo archivo de datos:** `data/despues-del-cole.json` (instituciones, becas, plazos, demanda). Cada entrada lleva `fuente` (URL oficial), `verificado` (fecha de la última revisión, 22-nov-2026) y `estado` (`vigente` | `cerrado` | `por confirmar`). La página muestra «Última revisión: 22 de noviembre de 2026» y un aviso cuando una fecha ya pasó («Esta fecha ya pasó: verificá la convocatoria nueva en el enlace oficial»).
- **Marcadores nuevos en `config/institucion.json`** (clave nueva `despues_del_cole`): convocatoria MinEdu 2027, convocatoria ESFM 2027, elegibilidad GAMLP–UPB para Ixiamas, detalle de becas internas UPEA, costos PSA 2027 por facultad, montos Türkiye Bursları, plazos 2027 MEXT y Stipendium Hungaricum, distancias y transporte Ixiamas–Riberalta / Ixiamas–Cobija / Ixiamas–La Paz, demanda laboral posterior a 2019, testimonios de egresados ([COMPLETAR]).
- **Regla de actualización:** cada fecha de convocatoria se revisa en diciembre de 2026 (MinEdu y ESFM). El responsable de actualizarlo se decide en la pregunta abierta 7. Se anota el procedimiento en `docs/manual-docente.md`.

### 6.3 Formato (lo que funciona en TikTok, adaptado a la web)

El sitio no publica video, pero el contenido se escribe en los formatos que los jóvenes ya consumen:

- **Rankings numerados** («Las 10 carreras más pedidas por las empresas», con fuente y fecha).
- **Caruseles paso a paso** («3 pasos para postular a la UMSA», «4 pasos para pedir una beca») — en la web, como listas numeradas cortas.
- **Preguntas frecuentes con la pregunta literal de TikTok** («¿Puedo conseguir beca?», «¿Universidad o carrera técnica?», «¿Se puede estudiar y trabajar?»), cada una respondida en 3–4 líneas con su fuente.
- **Testimonios reales de egresados: [COMPLETAR].** No hay ningún testimonio todavía y no se inventa ninguno. La página lleva una invitación: «¿Ya terminaste el cole y estás estudiando o trabajando? Contanos tu historia por el Buzón y la publicamos con tu nombre, solo si vos querés.» El testimonio solo se publica con nombre real y consentimiento, recogido por el Buzón. (Ver pregunta abierta 5.)

---

## 7. Alcance exacto de cambios (código y datos)

### Datos nuevos o modificados

| Archivo | Cambio |
|---|---|
| `data/preguntas.json` | +2 MAT-1-004 y MAT-1-005 (división); +6 LOG-1-001 a LOG-3-002 (lógica); campo `tema` nuevo en las 10 preguntas de Matemática; campo `habilidad` nuevo (`logica`) en las 8 preguntas listadas en §3.2. Total: 60 → **68 preguntas**. Actualizar `data/README.md`. |
| `data/vocacional.json` | **Nuevo.** 18 ítems RIASEC (§4.3), dimensiones, bandas de interpretación y aviso orientativo. Mismo patrón que `data/actitudes.json`. |
| `data/despues-del-cole.json` | **Nuevo.** Instituciones, becas, plazos y demanda laboral, cada entrada con `fuente`, `verificado` y `estado` (§6.2). Contenido tomado solo del informe oficial. |
| `config/institucion.json` | Clave nueva `despues_del_cole` con los marcadores `[VERIFICAR]` y `[COMPLETAR]` de §6.2. |

### Código

| Archivo | Cambio |
|---|---|
| `lib/diagnostico.ts` | Constantes del módulo de lógica (`AREA_LOGICA`, `PREGUNTAS_LOGICA = 6`); `calcularNivelLogica(respuestas)` (reusa `nivelDesdePorcentaje`); cuota de primera pregunta en Matemática (nivel 1, `tema: Aritmética`) y mínimo de 2 preguntas de Aritmética por examen; `perfilFortalezas(resultados)` (2 áreas más fuertes y 2 más bajas); tipos `Tema` y `Habilidad` en `Pregunta`. |
| `lib/vocacional.ts` | **Nuevo.** Constantes RIASEC, `calcularPerfilVocacional(promedios)`, `mapearFamilias(perfil, resultadosDiagnostico, nivelLogica)` (tabla §5.2 + reglas §5.1), textos de aviso. Funciones puras, como `lib/diagnostico.ts`. |
| `app/diagnostico/ExamenDiagnostico.tsx` | 7.ª tarjeta «Lógica matemática» (6 preguntas fijas en orden, sin adaptativo); resumen general con 3 bloques nuevos — nivel de lógica, «Tu perfil» (fortalezas/a reforzar) y «Tus posibles carreras» (solo si 6 áreas + lógica + vocacional están completos; si no, mensaje de lo que falta); enlaces a `/vocacional` y `/futuro`. |
| `app/diagnostico/page.tsx` | Sin cambios de estructura (el banco se sigue leyendo de `data/preguntas.json`); actualizar la descripción de metadatos (ahora menciona lógica y orientación). |
| `app/vocacional/` | **Nuevo.** `page.tsx` + `CuestionarioVocacional.tsx` (18 ítems Likert 1–5, mismo patrón visual que `CuestionarioActitudes.tsx`; guarda en `orientacion_vocacional` si hay sesión). |
| `app/futuro/` | **Nuevo.** `page.tsx` con los 4 bloques + calendario (§6.1), leyendo `data/despues-del-cole.json`. Sin cuenta, sin guardado. |
| `app/progreso/page.tsx` | Tarjeta nueva «Tu perfil vocacional» (último perfil guardado + nivel de lógica) y nivel general en la tarjeta de evolución. La lógica se muestra como barra aparte, no como 7.º eje del radar. |
| `app/api/vocacional/route.ts` | **Nuevo.** POST que guarda el perfil vocacional; espejo de `/api/actitudes`. |
| `app/api/diagnostico/route.ts` | Sin cambios (ya acepta `area` como texto; la lógica se guarda con `area: "Lógica matemática"`). |
| `components/Nav.tsx` | Entrada nueva «Tu futuro» → `/futuro` (y «Vocacional» dentro de Diagnóstico, no en el menú principal, para no saturarlo). |
| `supabase/migrations/0002_fase_h.sql` | **Nueva.** Tabla `orientacion_vocacional` (`id`, `user_id`, `dimensiones jsonb`, `perfil_top2 jsonb`, `created_at`) con RLS igual que `actitudes` (solo el dueño; docentes leen — ver pregunta 8) + GRANTs a `anon, authenticated` (lección de la fase de Supabase: sin GRANTs, PostgREST da 42501). La lógica **no** necesita tabla nueva: se guarda en `diagnosticos` con `area = 'Lógica matemática'`. |
| `docs/manual-docente.md` | Añadir: cómo se actualizan las convocatorias (diciembre), cómo se lee el perfil vocacional, qué NO es el cuestionario vocacional. |
| `docs/marcadores-pendientes.md` | Añadir los marcadores nuevos de §6.2. |

### Fuera del alcance de esta fase (anotar como seguimiento)

- Cambios en los 6 juegos (solo se los menciona como práctica complementaria).
- Afiches nuevos («Después del cole» con QR a `/futuro`) — se pueden hacer después, con el mismo procedimiento de afiches.
- Videos para TikTok — el CEPO no publica video desde la web; los textos de `/futuro` están escritos para reutilizarse en TikTok/WhatsApp.
- Metas personales en `/progreso` (pendiente de una fase anterior; no se toca aquí).

### Criterios de aceptación (para la verificación, cuando se construya)

1. `npm run build` pasa; el sitio sigue sirviendo en https://cepo-orion.vercel.app.
2. El examen completo (6 áreas + lógica + vocacional) muestra: nivel por área con temas a reforzar, nivel general, nivel de lógica y 2–3 familias de carreras con sus vías reales.
3. Sin cuenta, todo se ve en pantalla; con cuenta, lógica y vocacional quedan guardados y aparecen en `/progreso`.
4. RLS: un estudiante solo ve sus propios resultados de lógica y vocacional.
5. **Cero cifras inventadas:** grep de la página `/futuro` y de los datos no devuelve ningún sueldo por carrera; todas las fechas llevan fuente o `[VERIFICAR]`; ningún testimonio publicado sin nombre real y consentimiento.

---

## 8. Preguntas abiertas (solo Mike puede decidir)

1. **Módulo de lógica:** ¿va como cuestionario aparte de 6 preguntas («Reto de lógica», recomendado) o dentro de Matemática? Si va dentro, el puntaje de lógica sería débil (pocas preguntas servidas por examen).
2. **Vocacional:** ¿se hace el cuestionario nuevo de 18 preguntas (recomendado) o basta con cruzar los 6 diagnósticos existentes? Sin el cuestionario, las carreras saldrían solo de las notas, no de los intereses.
3. **Nombre de la sección:** ¿«Tu futuro» (recomendado, ruta `/futuro`) u otro nombre para el menú?
4. **Aviso sobre sueldos virales:** ¿se publica tal cual la advertencia «los sueldos que circulan en TikTok no son oficiales» en «Carreras con futuro»? (Recomendado: sí, porque es la pregunta que más hacen.)
5. **Testimonios de egresados:** ¿se habilita la invitación por el Buzón («contanos tu historia») para publicar testimonios reales con nombre y consentimiento? (Recomendado: sí; sin esto la sección no tendrá nunca testimonios.)
6. **División:** las 2 preguntas MAT-1-004 y MAT-1-005 ya se te propusieron aparte el 22-nov (mensaje 17:15) y siguen esperando tu 👍. La fase (h) las incluye tal cual.
7. **Actualización de convocatorias:** las convocatorias 2027 del MinEdu (becas y ESFM) salen en diciembre y hay que revisarlas. ¿Quién las actualiza en la página: vos, Irguen o Clarivel?
8. **Privacidad del perfil vocacional:** hoy los docentes pueden leer los diagnósticos (política RLS vigente). ¿El perfil vocacional también lo ven los docentes, o solo el estudiante? (Recomendado: que lo vean los docentes, para orientar; pero es tu decisión.)
9. **Texto del aviso:** ¿se añade el aviso «esto no es un test psicológico ni una prueba oficial de admisión» en el resumen y en `/progreso`? (Recomendado: sí.)
10. **Orden de trabajo:** ¿primero los tests mejorados (lógica + vocacional + niveles) o primero la sección «Después del bachillerato»? Las convocatorias de diciembre apuran el contenido, pero los tests son el corazón del pedido. (Recomendado: tests primero, contenido después, en ese orden.)

---

## 9. Orden de trabajo sugerido (cuando Mike apruebe)

1. **Banco:** añadir MAT-1-004/005 + 6 LOG + campos `tema`/`habilidad` (+ `data/README.md`).
2. **Motor:** cuota de Aritmética en Matemática + `calcularNivelLogica` + `perfilFortalezas` en `lib/diagnostico.ts`.
3. **Vocacional:** `data/vocacional.json` + `lib/vocacional.ts` + página `/vocacional` + API + migración `0002`.
4. **Resultados:** resumen general con los 3 bloques (nivel, lógica, carreras) + tarjeta en `/progreso`.
5. **Contenido:** `data/despues-del-cole.json` + página `/futuro` + entrada en el menú + marcadores en `config/institucion.json`.
6. **Cierre:** `npm run build`, push por el procedimiento snapshot (main + dev), verificación en vivo, actualización de `docs/manual-docente.md` y `docs/marcadores-pendientes.md`.

---

*Documento de diseño — fase (h). Nada de lo aquí descrito está construido todavía.*
