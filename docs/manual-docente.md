# Manual del docente — Sitio CEPO (Centro Educativo Privado Orion, Ixiamas)

> **Para quién es:** docentes y dirección del CEPO que necesitan actualizar
> el contenido del sitio **sin tocar código**.
>
> **Regla de oro (la misma de `data/README.md`): no inventar datos.**
> Todo lo que va en estos archivos debe ser real y verificable. Lo que
> falte se marca `[COMPLETAR]` y lo dudoso `[VERIFICAR]`. Nunca se escribe
> un dato inventado para "rellenar".
>
> **Archivos que usted puede editar:** `config/institucion.json` y todo lo
> que está en `data/` (horarios, preguntas, actitudes y juegos).
> **Archivos que usted NO debe tocar:** ver la sección
> [Advertencias](#advertencias-qué-no-tocar-y-cómo-no-romper-nada).

## Cómo editar (en general, para todos los archivos)

1. Abra el archivo con un **editor de texto plano** (por ejemplo, VS Code
   o el Bloc de notas). **No use Word ni Google Docs**: rompen el formato.
2. **Antes de cambiar nada, haga una copia de seguridad** del archivo
   (por ejemplo, `horarios-copia-2026-11-19.json`). Si algo sale mal,
   se restaura la copia.
3. Respete el formato JSON: **comillas dobles** (`"`), **comas entre
   elementos** y **ninguna coma después del último elemento** de una lista.
   Un solo error de estos hace que el sitio no cargue ese contenido.
4. **Valide el archivo antes de guardar** (ver
   [Validar JSON antes de guardar](#validar-json-antes-de-guardar)).
5. Guarde. Los cambios se ven en el sitio **tras reconstruir y desplegar**
   (ver [Cuándo se ven los cambios](#cuándo-se-ven-los-cambios)).

---

## (a) Horarios — `data/horarios.json`

El archivo tiene **dos secciones**. No las confunda:

| Sección | Qué es | ¿Se edita? |
|---|---|---|
| `niveles` | El horario **REAL** de CEPO | **Sí**: aquí van los horarios verdaderos |
| `ejemplo` | Una tabla de **ejemplo** que muestra solo el formato | **No**, salvo que se quiera cambiar el ejemplo |

Hoy `niveles` solo tiene marcadores `[COMPLETAR]`, por eso la página
`/horarios` muestra el ejemplo (con un aviso que dice que es un ejemplo).
En cuanto `niveles` tenga al menos un bloque real, la página muestra
automáticamente el horario real y deja de mostrar el ejemplo.

### El horario real hoy (esqueleto)

```json
{
  "nivel": "1ro de Secundaria",
  "turno": "[COMPLETAR: mañana/tarde]",
  "dias": [
    { "dia": "Lunes", "bloques": [
      { "docente": "[COMPLETAR]",
        "hora": "[COMPLETAR: hora de inicio–fin]",
        "materia": "[COMPLETAR]" }
    ]},
    { "dia": "Martes", "bloques": [] },
    { "dia": "Miércoles", "bloques": [] },
    { "dia": "Jueves", "bloques": [] },
    { "dia": "Viernes", "bloques": [] }
  ]
}
```

El colegio hoy tiene **solo bachillerato** (1ro de Secundaria en el
esqueleto), pero cuando crezca a más niveles se añade un bloque como el
de arriba por cada nivel nuevo (por ejemplo, "2do de Secundaria").

### El ejemplo (solo formato, NO es el horario real)

```json
{
  "nivel": "1ro de Secundaria",
  "turno": "Mañana",
  "dias": [
    { "dia": "Lunes", "bloques": [
      { "hora": "08:00–08:45", "materia": "Matemática" },
      { "hora": "08:45–09:30", "materia": "Lenguaje y Comunicación" },
      { "hora": "09:30–09:45", "materia": "Recreo" },
      { "hora": "09:45–10:30", "materia": "Ciencias Naturales" },
      { "hora": "10:30–11:15", "materia": "Ciencias Sociales" }
    ]}
  ]
}
```

Las materias, horas y turnos del ejemplo son **inventados para ilustrar
el diseño**. No los tome como datos reales.

### Cómo completar un día

1. En `niveles`, busque el nivel (por ejemplo, `"1ro de Secundaria"`).
2. Busque el día (por ejemplo, `"Martes"`, que hoy tiene
   `"bloques": []`).
3. Añada un bloque por cada clase, en orden de hora, con este formato:

```json
{ "hora": "08:00–08:45", "materia": "Matemática", "docente": "Irguen Rosas" }
```

- `hora`: inicio–fin con el guion largo, por ejemplo `"08:00–08:45"`.
- `materia`: nombre oficial de la materia (por ejemplo, `"Matemática"`,
  `"Lenguaje y Comunicación"`, `"Recreo"`).
- `docente`: nombre real del docente. **No invente nombres**: solo los
  que la dirección confirme.
- Los días se escriben siempre así: `"Lunes"`, `"Martes"`,
  `"Miércoles"`, `"Jueves"`, `"Viernes"`.
- El `turno` es `"Mañana"` o `"Tarde"` (sin el marcador, con mayúscula
  inicial, igual que en el ejemplo).

### Vistas Hoy / Semana

La página `/horarios` tiene dos vistas que el visitante elige:

- **Hoy**: muestra solo el día actual (según la fecha del visitante).
  Si hoy es domingo o no hay clases, no muestra bloques.
- **Semana**: muestra la tabla completa de lunes a viernes.

Usted no tiene que configurar nada para estas vistas: se generan solas
a partir de `niveles`. Si un día queda con `"bloques": []`, ese día
aparece vacío.

---

## (b) Preguntas del diagnóstico — `data/preguntas.json`

Banco de preguntas del examen diagnóstico. Hoy tiene **50 preguntas:
10 por área** (Matemática, Lenguaje, Ciencias Naturales, Ciencias
Sociales, Inglés). Por área, los niveles están repartidos así: **3
fáciles (nivel 1), 4 medias (nivel 2) y 3 difíciles (nivel 3)**.

### Cómo funciona el examen (para entender por qué importa el nivel)

- El examen hace **6 preguntas por área**.
- Empieza en **dificultad media (nivel 2)**; con cada acierto sube de
  nivel y con cada error baja. Por eso **cada área necesita preguntas
  en los tres niveles**: si un área no tiene preguntas de nivel 3, el
  examen no puede subir; si no tiene de nivel 1, no puede bajar.
- El nivel final por área es: Avanzado (≥80%), Intermedio (≥60%),
  Básico (≥40%) o Inicial (<40%), con puntaje ponderado por dificultad.

### Estructura de cada pregunta (todos los campos son obligatorios)

| Campo | Qué es |
|---|---|
| `id` | Identificador único, con el formato `ÁREA-NIVEL-NÚMERO` (ej. `MAT-1-001`) |
| `area` | Exactamente una de estas: `Matemática`, `Lenguaje`, `Ciencias Naturales`, `Ciencias Sociales`, `Inglés` |
| `nivel` | `1` (fácil), `2` (medio) o `3` (difícil) |
| `pregunta` | El enunciado |
| `opciones` | Exactamente **4** opciones |
| `respuesta_correcta` | El **índice (0–3)** de la opción correcta (0 = primera, 1 = segunda, 2 = tercera, 3 = cuarta) |
| `justificacion` | Por qué esa es la respuesta correcta (se muestra al estudiante después de responder) |
| `fuente` | Fuente verificable (ver `docs/guia-contenido-fuentes.md`) |

### Ejemplo real del archivo (`MAT-1-001`)

```json
{
  "id": "MAT-1-001",
  "area": "Matemática",
  "nivel": 1,
  "pregunta": "¿Cuál es el resultado de 7 × 8?",
  "opciones": ["54", "56", "64", "48"],
  "respuesta_correcta": 1,
  "justificacion": "7 × 8 = 56. La multiplicación es una suma repetida: 7 sumado 8 veces da 56.",
  "fuente": "Currículo Base del Ministerio de Educación de Bolivia — Matemática, Educación Secundaria Comunitaria Productiva."
}
```

Fíjese: `respuesta_correcta` es `1` porque la opción correcta
(`"56"`) es la **segunda** de la lista (se cuenta desde 0).

### Cómo añadir una pregunta sin romper el esquema

1. Copie una pregunta existente **del mismo área y nivel** que la
   nueva (así hereda el formato correcto).
2. Cambie el `id` por uno **nuevo y único**, siguiendo el patrón:
   prefijo del área + nivel + número correlativo. Prefijos usados:
   `MAT` (Matemática), `LEN` (Lenguaje), `CIE` (Ciencias Naturales),
   `SOC` (Ciencias Sociales), `ING` (Inglés). Ejemplo: la siguiente
   pregunta fácil de Matemática sería `MAT-1-004`.
3. Escriba el enunciado, las **4 opciones**, la `respuesta_correcta`
   (índice 0–3), la `justificacion` y la `fuente`.
4. **Mínimo 10 preguntas por área** (hoy hay exactamente 10 en cada
   una: no borre ninguna sin reemplazarla). Y mantenga preguntas en
   los tres niveles de cada área.
5. Valide el JSON antes de guardar.

### Fuentes que se usan

La fuente principal es el **Currículo Base del Ministerio de Educación
de Bolivia** (Educación Secundaria Comunitaria Productiva). Cada
pregunta lleva su fuente en el campo `fuente`. **Sin fuente, la
pregunta no entra al banco** (regla de `docs/guia-contenido-fuentes.md`).

---

## (c) Actitudes y hábitos — `data/actitudes.json`

Cuestionario orientativo de actitudes y hábitos de estudio, con escala
**Likert de 1 a 5**. Es una herramienta **orientativa, no un
diagnóstico psicológico**: así lo dicen su `nota` y su `aviso`:

> "Este cuestionario es solo orientativo: sirve para conocerte mejor
> como estudiante y no es un diagnóstico psicológico. Si algo de lo que
> respondés te preocupa, hablá con un docente o con tu familia."

### La escala (1–5)

| Valor | Etiqueta |
|---|---|
| 1 | Nunca |
| 2 | Casi nunca |
| 3 | A veces |
| 4 | Casi siempre |
| 5 | Siempre |

### Dimensiones e ítems

Hay **6 dimensiones × 4 ítems = 24 ítems** en total:

1. **Hábitos de estudio** (`habitos`)
2. **Motivación** (`motivacion`)
3. **Autorregulación** (`autorregulacion`)
4. **Manejo del tiempo** (`tiempo`)
5. **Trabajo en equipo** (`equipo`)
6. **Proyecto de vida** (`proyecto`)

Cada dimensión tiene `id`, `nombre`, `descripcion` e `items`. Cada ítem
tiene `id`, `texto` e `invertida`. Ejemplo real (dimensión Hábitos de
estudio):

```json
{
  "id": "habitos",
  "nombre": "Hábitos de estudio",
  "descripcion": "Cómo organizás tu estudio y tus materiales para aprender mejor.",
  "items": [
    { "id": "habitos-1", "texto": "Repaso mis apuntes después de clase, aunque no tenga tarea.", "invertida": false },
    { "id": "habitos-2", "texto": "Tengo un lugar y un momento del día para estudiar.", "invertida": false },
    { "id": "habitos-3", "texto": "Cuando estudio, uso mis apuntes y mis libros aunque no tenga internet.", "invertida": false },
    { "id": "habitos-4", "texto": "Me cuesta empezar las tareas aunque tenga tiempo.", "invertida": true }
  ]
}
```

### Ítems invertidos (¡ojo con esto!)

En cada dimensión, **el cuarto ítem es invertido** (`"invertida": true`):

- `habitos-4`, `motivacion-4`, `autorregulacion-4`, `tiempo-4`,
  `equipo-4`, `proyecto-4`.

Un ítem invertido es una frase **negativa** (por ejemplo, "Me cuesta
empezar las tareas aunque tenga tiempo"): estar de acuerdo con ella es
malo, al revés que en los demás ítems. Por eso se puntúa al revés:
**puntaje = 6 − valor elegido**. Si el estudiante marca 5 ("Siempre")
en un ítem invertido, vale 1; si marca 1 ("Nunca"), vale 5.

**Si usted redacta un ítem nuevo:** si la frase es positiva (un buen
hábito), `"invertida": false`. Si es negativa (un mal hábito o una
dificultad), `"invertida": true`. Si se equivoca en este campo, el
resultado de esa dimensión sale al revés.

### Interpretación y sugerencias

- El resultado se calcula como **promedio por dimensión** y se ubica en
  una de 3 bandas: **1–2,99 "Un espacio para crecer"**, **3–3,99 "Buen
  camino"**, **4–5 "Una fortaleza"**.
- Hay **3 sugerencias prácticas por dimensión** (en `sugerencias`,
  con las mismas claves que las dimensiones: `habitos`, `motivacion`,
  `autorregulacion`, `tiempo`, `equipo`, `proyecto`), contextualizadas
  a Ixiamas. Si cambia un ítem, revise que las sugerencias de su
  dimensión sigan teniendo sentido.
- El cuestionario se basa en instrumentos reconocidos, citados en
  `instrumentos_referencia`: el **MSLQ** (Motivated Strategies for
  Learning Questionnaire, Pintrich, Smith, García y McKeachie, 1991)
  y el **IHE** (Inventario de Hábitos de Estudio, Pozar).

### Qué NO cambiar

- No cambie los `id` de las dimensiones ni de los ítems existentes
  (el código los usa para calcular los resultados).
- No cambie la escala (los valores 1–5 y sus etiquetas).
- No añada ni quite ítems sin revisar las bandas de interpretación:
  el cuestionario está calibrado con 4 ítems por dimensión.

---

## (d) Juegos — `data/juegos/*.json`

Hay **6 juegos, un archivo por juego**, con **72 ítems en total**.
Cada archivo tiene `juego`, `titulo`, `descripcion`,
`fuente_general` y la lista de ítems.

| Archivo | Juego | Ítems | Fuente general |
|---|---|---|---|
| `madidi.json` | Aventura Madidi | 12 preguntas (MAD-001–012) | SERNAP — Parque Nacional Madidi |
| `mapa.json` | Mapa de Bolivia | 14 preguntas (MAP-001–014) | INE (ine.gob.bo) |
| `constelaciones.json` | Constelaciones | 12 preguntas (CON-001–012) | UAI — 88 constelaciones oficiales |
| `detective.json` | Detective de noticias | 12 casos (DET-001–012), 8 falsos / 4 verdaderos | Criterios de verificación de información (UNESCO, ChequeaBolivia, AFP Factual) |
| `primeros-auxilios.json` | Primeros auxilios | 12 preguntas (PAU-001–012) | Cruz Roja Boliviana / Ministerio de Salud y Deportes de Bolivia |
| `presupuesto.json` | Mi primer presupuesto | 10 escenarios (PRE-001–010) | Banco Central de Bolivia — billetes y monedas en circulación (bcb.gob.bo) |

### Reglas comunes a todos los juegos

- **IDs únicos**: cada ítem tiene un `id` único dentro de su archivo,
  con el prefijo del juego (`MAD-`, `MAP-`, `CON-`, `DET-`, `PAU-`,
  `PRE-`). Nunca repita un `id` ni reutilice el de un ítem borrado.
- **No cambie los nombres de los campos**: la interfaz los lee tal
  cual. Si cambia `respuesta_correcta` por `respuesta`, el juego deja
  de funcionar.
- **Cada ítem lleva `fuente`** (fuente verificable). Sin fuente, el
  ítem no entra.
- **Insignias**: se gana la insignia de un juego con **al menos el 80%
  de aciertos** (por ejemplo, 10 de 12; 12 de 14). Las insignias son:
  `explorador-madidi` (Madidi), `cartografo` (Mapa), `cazador-de-orion`
  (Constelaciones), `ojo-critico` (Detective), `guardian` (Primeros
  auxilios) y `presupuesto-en-orden` (Presupuesto, cuando el ahorro
  elegido llega a la meta en al menos un escenario).

### Juegos de preguntas con 4 opciones (Madidi, Mapa, Constelaciones)

Esquema (ejemplo real, `MAD-001`):

```json
{
  "id": "MAD-001",
  "pregunta": "¿Cuál es la superficie aproximada del Parque Nacional y ANMI Madidi?",
  "opciones": ["Unas 190.000 hectáreas", "Unas 1.895.750 hectáreas (casi 1,9 millones)", "Unas 50.000 hectáreas", "Unas 10 millones de hectáreas"],
  "respuesta_correcta": 1,
  "justificacion": "El Madidi fue creado con una superficie de 1.895.750 hectáreas, de las cuales 1.271.500 corresponden a parque nacional y 624.250 a Área Natural de Manejo Integrado.",
  "fuente": "SERNAP — Parque Nacional y ANMI Madidi (sernap.gob.bo)"
}
```

Ejemplo real de Constelaciones (`CON-010`, dato verificado el
19-nov-2026):

```json
{
  "id": "CON-010",
  "pregunta": "¿Cuándo se ve mejor Orión desde Bolivia?",
  "opciones": ["En verano austral (diciembre a febrero), alta al anochecer", "Solo en junio, al mediodía", "Nunca, porque Bolivia está en el hemisferio sur", "Solo con telescopio, nunca a simple vista"],
  "respuesta_correcta": 0,
  "justificacion": "Orión está sobre el ecuador celeste, por eso se ve desde los dos hemisferios; desde Bolivia, en el hemisferio sur, se ve alta en el cielo en los meses de verano austral (diciembre a febrero): en diciembre aparece poco después del atardecer, en enero está en su punto más alto alrededor de las 21:00 y en febrero sigue alta al anochecer. Ixiamas (13° S) está dentro del rango de visibilidad completa de Orión.",
  "fuente": "Wikipedia — Orión (constelación): mejor mes enero a las 21:00, visible toda la noche en el verano del hemisferio sur; Meteored — Cómo ver la constelación de Orión desde el Hemisferio Sur (diciembre a marzo, mejor entre las 22:00 y la 01:00)"
}
```

### Primeros auxilios (situación + pregunta)

Igual que arriba, pero cada ítem lleva además `situacion` (lo que está
pasando, antes de la pregunta). Ejemplo real (`PAU-001`):

```json
{
  "id": "PAU-001",
  "situacion": "Quemadura con agua hirviendo en la cocina del colegio.",
  "pregunta": "Tu compañero se quema la mano con agua hirviendo en la cocina. ¿Qué hacés primero?",
  "opciones": ["Ponerle pasta dental y manteca encima", "Enfriarla con agua fresca corriente unos 10 minutos, cubrirla con una tela limpia y buscar atención médica", "Ponerle hielo directo y apretar fuerte", "Reventar las ampollas para que se seque"],
  "respuesta_correcta": 1,
  "justificacion": "La quemadura se enfría con agua fresca corriente unos 10 minutos, luego se cubre con una tela limpia y floja y se busca atención médica. Nunca se ponen pasta dental, manteca, aceite ni hielo directo: empeoran la lesión.",
  "fuente": "Cruz Roja / IFRC — quemaduras: enfriar con agua fresca corriente unos 10 minutos, no aplicar remedios caseros."
}
```

**Regla de este juego: nunca remedios caseros.** Solo protocolos de
Cruz Roja / OPS / Ministerio de Salud.

### Detective de noticias (verdadero / falso)

Cada caso tiene `titular`, `texto`, `es_verdadera` (true/false),
`pistas`, `explicacion` y `fuente`. Ejemplo real (`DET-001`):

```json
{
  "id": "DET-001",
  "titular": "Cadena de WhatsApp: regalan Bs 1.000 a todos los jóvenes",
  "texto": "'¡ATENCIÓN BOLIVIA! El gobierno está regalando Bs 1.000 a todos los jóvenes. Solo tienes que reenviar este mensaje a 10 contactos y entrar al enlace. ¡Hoy mismo te llega el dinero!'",
  "es_verdadera": false,
  "pistas": ["Promete dinero gratis a cambio de reenviar el mensaje", "No cita ninguna fuente oficial ni enlace verificable", "Usa urgencia: 'hoy mismo', 'última oportunidad'"],
  "explicacion": "Es un bulo típico de cadena de WhatsApp: promete dinero gratis, usa urgencia ('hoy mismo') y no cita ninguna fuente oficial. Ninguna institución anuncia bonos por cadenas reenviadas: los bonos reales se anuncian en medios y portales oficiales, con requisitos y fechas claras.",
  "fuente": "Tipo de bulo documentado: cadenas de WhatsApp con promesas de dinero — verificadores de hechos (ChequeaBolivia, AFP Factual) advierten que las ofertas que exigen reenviar el mensaje son falsas."
}
```

### Mi primer presupuesto (escenarios)

Cada escenario tiene `titulo`, `descripcion`, `ingreso_mensual_bs`,
`meta_ahorro_bs`, `categorias` (cada una con `nombre`,
`sugerencia_bs` y `consejo`), `pregunta`, `opciones` (cada una con
`texto`, `ahorro_bs` y `justificacion`), `respuesta_correcta` y
`fuente`. Ejemplo real (`PRE-001`, primer escenario):

```json
{
  "id": "PRE-001",
  "titulo": "La mesada de Daniel",
  "descripcion": "Daniel, 16 años, recibe Bs 1.500 al mes para sus gastos y quiere ahorrar Bs 150 para comprar una mochila nueva. ¿Cómo le va mejor?",
  "ingreso_mensual_bs": 1500,
  "meta_ahorro_bs": 150,
  "categorias": [
    { "nombre": "Alimentación", "sugerencia_bs": 500, "consejo": "Compra en la feria o en el mercado local y cocina en casa; gastar menos aquí deja más para el ahorro." },
    { "nombre": "Transporte", "sugerencia_bs": 200, "consejo": "Caminar y compartir transporte ahorra más que tomar taxi o trufi solo." },
    { "nombre": "Útiles y recargas", "sugerencia_bs": 200, "consejo": "Útiles y recargas son necesarios, pero un antojo cada día se suma rápido." },
    { "nombre": "Ahorro", "sugerencia_bs": 150, "consejo": "Separar el ahorro al recibir el dinero es más fácil que ahorrar lo que sobra." }
  ],
  "pregunta": "¿Qué decisión le conviene más a Daniel?",
  "opciones": [
    { "texto": "Separar Bs 150 de ahorro al recibir el dinero y gastar el resto con el plan de las categorías.", "ahorro_bs": 150, "justificacion": "Al separar primero los Bs 150 de ahorro y controlar alimentación y transporte, cumple su meta sin dejar de comer ni de moverse." },
    { "texto": "Gastar sin llevar cuentas y ver qué sobra a fin de mes.", "ahorro_bs": 0, "justificacion": "Gastar sin orden suele dejar Bs 0 al final del mes y la mochila no se compra." },
    { "texto": "Comprar refresco y golosinas cada día en la tienda.", "ahorro_bs": 50, "justificacion": "Comprar refresco y golosinas todos los días en la tienda suma mucho en un mes y la meta no se cumple." },
    { "texto": "Pedir prestado a un amigo para comprar unos audífonos que no necesita.", "ahorro_bs": 0, "justificacion": "Pedir prestado para un antojo crea una deuda que se come el dinero del mes siguiente." }
  ],
  "respuesta_correcta": 0,
  "fuente": "Banco Central de Bolivia — billetes de Bs 10, 20, 50, 100 y 200 y monedas de 10, 20 y 50 centavos y Bs 1, 2 y 5 (bcb.gob.bo)"
}
```

Los montos son **de ejemplo para aprender**, no precios oficiales.
`ahorro_bs` es cuánto se ahorra con esa decisión.

### Cómo añadir un ítem a un juego

1. Abra el JSON del juego con un editor de texto.
2. Copie un ítem existente y cambie el `id` (único, con el prefijo del
   juego) y todo el contenido.
3. Ponga siempre `justificacion` y `fuente` (en Detective,
   `explicacion` y `fuente`).
4. Guarde: el sitio muestra el ítem nuevo sin tocar código.
5. Recuerde la insignia del 80%: con 12 ítems hacen falta 10 aciertos;
   con 14, 12; con 10, 8.

---

## (e) Datos institucionales — `config/institucion.json`

Aquí viven **todos los datos del colegio** que muestra el sitio
(nombre, director, contacto, misión, visión, ubicación, etc.). Es el
archivo con más datos pendientes: la dirección debe entregar los datos
reales y solo entonces se reemplazan los marcadores.

### Campos que ya tienen datos reales (no tocar salvo que cambien)

| Campo | Valor actual |
|---|---|
| `nombre` | Centro Educativo Privado Orion |
| `sigla` | CEPO |
| `director` | Irguen Rosas |
| `niveles` | Bachillerato (nota: actualmente solo bachillerato; se espera crecer) |
| `contacto.telefono` | +591 73956239 |
| `contacto.whatsapp_url` | https://wa.me/59173956239 |
| `ubicacion.pais` / `departamento` / `provincia` / `municipio` | Bolivia / La Paz / Iturralde / Ixiamas |
| `ubicacion.mapa_centro.latitud` / `longitud` | -13.23979 / -68.26586 (centro de Ixiamas, verificado por geocodificación) |
| `ubicacion.direccion_exacta` | Avenida Sucre, Calle Santa Cruz, Ixiamas Centro |
| `ubicacion.mapa_url` | https://www.openstreetmap.org/?mlat=-13.23979&mlon=-68.26586#map=16/-13.23979/-68.26586 |
| `lema` | "Aprendamos en la selva" (lema oficial, aprobado por la dirección 20-nov-2026) |
| `lema_estado` | Lema oficial, aprobado por la dirección (20-nov-2026) |
| `mision` | Fortalecer y complementar los conocimientos y destrezas de los jóvenes en Ixiamas. |
| `vision` | Desarrollar una plataforma permanente de capacitación para jóvenes de todas las edades. |
| `materias` | Matemática, Física, Filosofía, Historia, Literatura, Inglés |
| `costos` | Inscripción: Bs 10. Por materia: Bs 10. |
| `horarios` | Clases lunes, miércoles y viernes, 19:00, 20:00 y 21:00. Horario sujeto a cambios. |
| `turnos` | Noche |
| `contacto.horario_atencion` | Lunes a viernes, 10:00–15:00 |
| `contacto.tiktok` / `tiktok_usuario` | https://www.tiktok.com/@cepoixiamas / @cepoixiamas (única red social) |
| `plantel_docente` | Irguen Rosas (director), Clarivel Loayza y Michael Navarro Hernández — ver la sección Nuestro equipo en `/nosotros` (fotos y semblanzas en `data/equipo.json`) |

### Campos con `[COMPLETAR]` (pendientes de la dirección)

| Campo | Qué falta |
|---|---|
| `anio_lectivo` | Año lectivo vigente |
| `contacto.correo` | Correo oficial |
| `historia` | Historia del colegio |
| `valores` | Valores institucionales |

> La tabla detallada por día y materia (`data/horarios.json`, sección
> `niveles`) sigue pendiente: el marco real ya está (lunes, miércoles y
> viernes, 19:00, 20:00 y 21:00), pero falta el reparto de materias por
> día que debe dar la dirección.

Además, la `nota` dentro de `mapa_centro` ya incluye la dirección
exacta del colegio (Avenida Sucre, Calle Santa Cruz, Ixiamas Centro);
las coordenadas siguen siendo del **centro de Ixiamas**, no del
colegio. Si la dirección da las coordenadas exactas, se actualizan
`mapa_centro` y `mapa_url`.

### Campo con `[VERIFICAR]`

| Campo | Qué falta |
|---|---|
| `contacto.whatsapp` | Confirmar si +591 73956239 es WhatsApp (el número es el teléfono oficial; falta confirmar que también atiende por WhatsApp) |

### Cómo completar un campo

Reemplace **todo el marcador** (incluidos los corchetes) por el dato
real. Ejemplo:

```json
// Antes
"correo": "[COMPLETAR: correo oficial]",
// Después
"correo": "contacto@cepo-ixiamas.edu.bo",
```

- Si un campo no aplica (por ejemplo, no hay Instagram), **no lo deje
  en `[COMPLETAR]` ni lo borre**: escriba el valor vacío `""` o
  avise a quien mantiene el sitio para que lo quite del archivo con
  cuidado. Borrar un campo sin avisar puede romper la página que lo
  muestra.
- No cambie los **nombres de los campos** (por ejemplo, `mision` no se
  escribe `misión` con tilde): el código los lee tal cual.

---

## Advertencias: qué NO tocar y cómo no romper nada

### Qué NO tocar (código y configuración técnica)

| No tocar | Por qué |
|---|---|
| `app/` | Las páginas del sitio (código). |
| `components/` | Los componentes visuales (incluido `Marcador`, que muestra los pendientes). |
| `lib/` | La lógica: cómo se leen los datos, el diagnóstico adaptativo, los juegos, los marcadores. |
| `supabase/` y `supabase/migrations/` | La base de datos (login, progreso, buzón). |
| `middleware.ts`, `next.config.ts`, `tsconfig.json`, `package.json` | Configuración del proyecto. |
| `.env.local` | Las claves reales (Supabase, Turnstile). **Nunca** se suben a GitHub ni se comparten por chat. |
| `node_modules/`, `.next/` | Carpetas generadas automáticamente. |
| `.env.example` | La plantilla de variables de entorno (sus `[COMPLETAR]` los llena quien crea el proyecto en Supabase/Turnstile, no el docente). |

Si algo de ahí necesita cambiar, avise a quien mantiene el sitio.

### Validar JSON antes de guardar

Un JSON con un error (una coma de más, una comilla sin cerrar) hace que
ese contenido no cargue. Valide **siempre** antes de guardar:

- **Opción 1 (recomendada, sin instalar nada):** pegue el contenido en
  https://jsonlint.com y pulse "Validate JSON". Debe decir "Valid JSON".
- **Opción 2 (VS Code):** al abrir un `.json`, VS Code marca los
  errores con rojo y los explica al pasar el cursor.
- **Opción 3 (terminal, si tiene Python):**
  `python3 -m json.tool data/horarios.json` — si no muestra nada, el
  archivo está bien; si muestra un error, indica la línea.

Errores típicos: coma después del último elemento de una lista,
comillas simples (`'`) en vez de dobles (`"`), llaves o corchetes sin
cerrar, y tildes o caracteres especiales fuera de las comillas.

### Cuándo se ven los cambios

- **En local** (`npm run dev`): los cambios en `data/` y
  `config/institucion.json` se ven al recargar la página.
- **En la web publicada:** los datos se leen al construir el sitio,
  así que los cambios se ven **tras reconstruir y desplegar** (en
  Vercel, al subir los archivos cambiados al repositorio, el despliegue
  es automático). Si edita un archivo y la web no cambia, casi seguro
  falta ese paso: avise a quien despliega.
- **Si una página muestra un marcador** (por ejemplo, el texto
  `[COMPLETAR: ...]` visible en la web), es que ese dato sigue
  pendiente: no es un error del sitio, es el sistema avisando de que
  falta el dato real.

### Lista de pendientes

La lista consolidada de todos los `[COMPLETAR]` y `[VERIFICAR]` del
proyecto, por archivo, está en `docs/marcadores-pendientes.md`.
Consúltela antes de empezar a completar datos: ahí dice qué falta y de
quién depende cada cosa.

---

*Manual creado el 19-nov-2026 (fase f). Fuentes de contenido:
`docs/guia-contenido-fuentes.md`, `data/README.md`,
`docs/fase-d.md`, `docs/fase-e.md`.*
