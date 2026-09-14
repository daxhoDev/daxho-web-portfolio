# CHANGELOG de las specs

Historial de cambios de la especificación. No confundir con el changelog del
producto.

## [2026-09-14] El typing sustituye al glitch

Decisión del usuario: *"eliminaremos el efecto de glitch, lo sustituiremos por el
de typing"*. Registrada en `DEVIATIONS.md` por partida doble.

- **ADR-0014 §5 reescrita.** "Glitch en encabezados" pasa a "Typing en los
  encabezados": disparado al entrar en viewport, una sola vez, sin repetición con
  hover ni foco, con cursor efímero. Actualizados también el contexto de la ADR y
  la regla transversal de `prefers-reduced-motion`, que citaban el glitch.
- **Propagación por concepto, no solo por nombre de archivo.** El glitch estaba
  citado en 12 specs que no siempre nombraban ADR-0014: `00-vision.md`
  (principios), `02-design-system.md` (reglas duras de movimiento),
  `03-architecture.md` (islas y CSS puro), `06-components.md` (`SectionHeading`),
  `07-conventions.md` (cuándo se escribe CSS propio), `11-styleguide.md` (las
  tres veces), `13-roadmap.md` (alcance de la fase 1), `05-pages/404.md`,
  `05-pages/about.md`, ADR-0013, ADR-0019 y ADR-0021.
- **Contradicción anterior corregida:** `03-architecture.md` y `06-components.md`
  listaban `TypingHero` como isla React `client:load`, cuando el typing se
  implementó en la fase 1 en CSS puro, sin isla. Se elimina la fila de ambas
  tablas y se documenta `TypingText` como primitivo `ui/` con sus props
  (`trigger`, `caret`).
- **`OPEN-QUESTIONS.md`:** la resolución "Glitch con PowerGlitch" se marca
  derogada y se añade la nueva, sin duplicar la pregunta entre secciones.
- **Efecto medido:** fuera la dependencia `powerglitch`; el presupuesto de JS baja
  de 62,6 KB a 59,2 KB gzip de los 75 KB. Los tests E2E pasan de 23 a 26.

## [2026-09-10] Consistencia de specs tras la fase 1

Auditoría de referencias cruzadas al mergear `feat/design-system` a `development`
(PR #1, `7a48f63`). Se corrigen los desfases acumulados en las rondas 5-7 y en la
implementación de la fase 1:

- **`OPEN-QUESTIONS.md` reescrito.** Se contradecía a sí mismo: Q-M, Q-N y Q-O
  aparecían a la vez en "Abiertas" y en "Resueltas"; Q37 y Q40 en "Resueltas" y
  en "Aplazado"; seguía vivo el bloqueo `⛔ no tires código aún` de antes de la
  fase 1; y **Q38 y Q41, los dos únicos bloqueos reales, no figuraban como
  abiertas**. Ahora cada pregunta vive en una sola sección, con recomendación
  razonada para las dos abiertas. Añadida una tabla de specs en BORRADOR con la
  fase que consume cada una.
- **Tres citas llamaban "pendiente" a ADRs ya aprobadas**, lo que por la Regla 2
  detendría a un agente sin motivo: `02-design-system.md` §7 (ADR-0014),
  `05-pages/README.md` (ADR-0010) y `08-integrations.md` (ADR-0015).
- **La desviación de iconografía no se había propagado.** El cambio de lineart a
  siluetas sólidas estaba en `DEVIATIONS.md` y ADR-0018, pero seguían diciendo
  "lineart" `05-pages/home.md` (carrusel), `05-pages/about.md` (skills),
  `04-content-model.md` (campo `icon`) y `10-tech-catalog.md` (columna "Icono").
  Reescrita la §6 de `02-design-system.md`, que abría declarando lineart como
  regla general y repetía dos veces la línea de Lucide.
- **Estados de cabecera actualizados:** `13-roadmap.md` PROPUESTA → APROBADA
  (se ejecutó la fase 1 contra un plan formalmente no aprobado),
  `02-design-system.md` BORRADOR v0 → APROBADA (paleta y temas aprobados en
  `/styleguide`), `10-tech-catalog.md` deja de decir "selección del carrusel
  PENDIENTE" (la cerró Q-K).
- **Fase 1 marcada como completada** en el roadmap, con su cierre real medido, y
  fase 2 marcada como siguiente con el prerrequisito de aprobar
  `06-components.md`.
- **Nueva skill `.claude/skills/spec-sync/`**: obliga a inventariar y propagar
  todas las referencias a una spec al editarla. Nace de esta auditoría — el
  desfase de iconografía sobrevivió porque se buscó por nombre de archivo y no
  por concepto.

## [2026-09-09] Especificación inicial

- Creado `AGENTS.md` con las tres reglas duras (specs como fuente de verdad, nunca
  decidir sin aprobación, documentar desviaciones por partida doble).
- Creada la estructura de `specs/`.
- Añadido `09-testing.md`, no previsto en la estructura propuesta inicialmente, por
  el énfasis del usuario en Q8 ("documenta que vas a testear cada nueva feature y
  fix importante").
- Registradas las decisiones de la primera ronda de preguntas (Q1-Q44) como ADRs
  0001-0017.
- Abiertas 9 preguntas en `OPEN-QUESTIONS.md`.

## [2026-09-09] Ronda 2 de decisiones

- Aprobadas ADR-0006 (ESLint + Prettier), ADR-0010 (rutas sin traducir), ADR-0014
  (movimiento y efectos) y ADR-0015 (Vercel Web Analytics).
- Resuelta Q-A: los iconos de tecnologías se dibujan a mano, uno por archivo →
  **ADR-0018**. Actualizada la §6 de `02-design-system.md`.
- Q34 (lista de tecnologías) pasa de "aplazado" a **bloqueante**, como consecuencia
  de ADR-0018: sin la lista no se puede dimensionar el trabajo de iconos.
- Nueva **ADR-0019** (pantalla de carga): análisis de qué se ve durante el script
  del tema y del coste de un overlay de carga. Pendiente de decisión.
- Nueva **ADR-0020** (envío de correo): reemplaza el análisis de Q-H, que estaba
  mal planteado — el riesgo de spam afecta al buzón del destinatario, y el
  destinatario aquí es el propio usuario. Pendiente de decisión.
- Nueva **ADR-0021** (proceso de diseño): viabilidad de mockups en Figma frente a
  una ruta `/styleguide` en el propio proyecto. Pendiente de decisión.
- Q-H retirada y sustituida por Q-J en `OPEN-QUESTIONS.md`.

## [2026-09-09] Ronda 3

- Aprobadas ADR-0019 (boot sequence acotada, primera visita de sesión, retirada
  por CSS), ADR-0020 (Resend con dominio de pruebas → Gmail, con Nodemailer+SMTP
  como alternativa) y ADR-0021 (ruta `/styleguide` en lugar de mockups en Figma).
- Nuevo `10-tech-catalog.md` con las 10 tecnologías confirmadas por el usuario y
  una ampliación propuesta en tres grupos.
- `04-content-model.md` actualizado para apuntar al nuevo catálogo.
- Q34 deja de ser bloqueante para el grueso del trabajo: hay lista base con la que
  empezar.

## [2026-09-09] Ronda 3 — decisiones menores

- **Q-B** resuelta: el home usa la misma `ProjectCard` que `/projects`, con prop
  `variant` reservada para el futuro. → `05-pages/home.md`, `06-components.md`.
- **Q-C** resuelta: sin filtros en `/projects`. → `05-pages/projects.md`.
- **Q-D** resuelta: skills solo agrupadas por categoría, sin nivel de dominio.
  → `05-pages/about.md`.
- **Q-E** resuelta: galería del detalle en línea con enlace a imagen completa, sin
  lightbox. → `05-pages/project-detail.md`.
- **Q-G** sigue abierta (PDF del CV estático o generado).

## [2026-09-09] Ronda 4

- Catálogo de tecnologías cerrado en **25 entradas** (`10-tech-catalog.md`).
  Selección del carrusel pendiente.
- Detectado que Express **no tiene logotipo icónico**: su marca es la palabra
  escrita. Se recomienda dejarlo fuera del carrusel y mantenerlo como etiqueta de
  texto.
- **Q-G** resuelta: PDF del CV estático, mantenido por el usuario.
  → `05-pages/resume.md`, con nota de riesgo de desincronización.
- **ADR-0021 corregida** a petición del usuario: se reconoce explícitamente que
  `/styleguide` **es implementación**, no una fase previa. La comparación original
  con Figma estaba mal planteada.
- Nuevo `11-styleguide.md`: alcance acotado del primer incremento de
  implementación, aprobado por el usuario.

## [2026-09-09] Ronda 5

- **Q-K** resuelta: el carrusel muestra **las 25** tecnologías, no una selección de
  16. Es una derogación de una regla previa → primera entrada en `DEVIATIONS.md`.
  Consecuencia: la fase 1 de iconos pasa de 16 a 25 dibujos.
- **Q-L** resuelta: Express entra en el carrusel con la marca circular "ex"
  aportada por el usuario. Segunda entrada en `DEVIATIONS.md`. Anotada la reserva
  de legibilidad a 24px, a validar en la hoja de calibración.
- Ambas decisiones propagadas a `10-tech-catalog.md` y `05-pages/home.md`.
- Detectados dos huecos no vistos en rondas anteriores: **Q-M** (marca, logotipo y
  favicon: nunca definidos) y **Q-N** (densidad del header: 8 elementos). Añadida
  también **Q-O** (traducción del titular del hero).

## [2026-09-09] Ronda 6

- **Q-M** resuelta: marca denominativa "Daxho" en JetBrains Mono → nuevo
  `12-brand.md`, con las variantes de favicon y tres candidatos de detalle de
  acento a elegir en la hoja de calibración.
- **Q-N** resuelta de forma distinta a la recomendada: en lugar de eliminar
  "Home", la navegación cambia de forma en tres modos (completo / dropdown /
  sidebar). Los 5 enlaces se conservan. → `06-components.md`.
- **Q37** resuelta: tres campos (nombre, correo, mensaje). Sin asunto.
- **Q40** resuelta: destinatario `developer.daxho@gmail.com`. Anotado el requisito
  operativo de registrar la cuenta de Resend con esa misma dirección.
- `05-pages/contact.md` deja de estar bloqueada; quedan Q38 (anti-spam) y Q41
  (persistencia).

## [2026-09-09] Ronda 7

- **Q-O** resuelta: se conserva el texto original del brief; el registro underground
  lo aporta la forma (minúsculas, monoespaciada, prompt `>`, cursor `▮`, typing
  encadenado con la boot sequence). En español se elige **"guarida"** sobre
  "rincón". Sin desviación del brief, por tanto sin entrada en `DEVIATIONS.md`.
  Fijado que el subtítulo debe contener "Software Engineer".
  → `05-pages/home.md`.
- Nuevo `13-roadmap.md`: plan de implementación en 10 fases con camino crítico,
  entregable revisable por fase y acciones del usuario. Pendiente de aprobación.

## [2026-09-09] Fase 1 — implementación

- Implementado el incremento 1 (`11-styleguide.md`) en la rama
  `feat/design-system`. Lint, typecheck y 39 tests unitarios en verde.
- **Hallazgo de contraste:** `border-default` daba 1.68:1 (claro) y 1.35:1
  (oscuro) contra el fondo, incumpliendo el 3:1 que WCAG 1.4.11 exige a los
  bordes que delimitan un control. Añadido el token `--border-interactive`
  (ink-400), que cumple sobre todas las superficies de ambos temas. Protegido
  por test. → `02-design-system.md`.
- **Hallazgo de presupuesto:** React son 57 KB gzip solo por su runtime.
  Presupuesto elevado a 75 KB por decisión del usuario → `DEVIATIONS.md`.
- Añadida `src/lib/contrast.ts`: calcula los ratios WCAG reales en el build, de
  modo que `/styleguide` muestra valores medidos y no estimaciones.
- Añadida `src/lib/palette.ts` como espejo de `tokens.css`, con un test que
  impide que ambos se desincronicen.

## [2026-09-09] Fase 1 — revisión visual del usuario

Cinco correcciones sobre lo implementado, más dos cambios de mecanismo:

- **Glitch:** rehecho con **PowerGlitch** por petición del usuario (antes CSS
  puro). Más agresivo, capas teñidas en varios rojos de la rampa Blood en lugar
  de gris, y deformación de las letras aportada por CSS. Sigue siendo disparado
  y sigue sin inicializarse bajo `prefers-reduced-motion`. → `DEVIATIONS.md`.
- **Iconos:** se abandona el dibujo a mano y el lineart. 24 de 25 desde Simple
  Icons como siluetas sólidas; Playwright es el único propio. Dos entradas en
  `DEVIATIONS.md` (estrategia y estilo). **La fase 3 del roadmap desaparece.**
- **Carrusel:** los iconos se apelotonaban en el centro porque cada grupo era
  más estrecho que el contenedor; ahora la lista se repite hasta llenar. La
  velocidad pasa a definirse **por icono** (3 s) en lugar de como duración
  total, para que se perciba igual con 3 tecnologías que con 25.
- **Grain:** opacidad subida de 0.035 a 0.11 (claro) y de 0.05 a 0.16 (oscuro).
- **Caret:** tenía tres estados de color porque se solapaban dos animaciones
  cuyos valores se componían. Ahora es una sola animación con `step-end`: corte
  seco entre invisible y opaco.
- **Cursor:** Tailwind v4 dejó de dar `cursor: pointer` a `<button>` en su
  preflight. Restituido en la capa base, con `not-allowed` para deshabilitados.
- **ProjectCard** pasa a ser `<article>`: es contenido autónomo y además lo hace
  localizable por rol en los tests.
- Catálogo de las 25 tecnologías escrito en código, con `TechIcon.astro` como
  único punto de entrada; falla el build si una clave no existe.

**Verificación:** lint limpio · typecheck 0 errores · 39 tests unitarios ·
**23 tests E2E en verde** · JS 62,6 KB gzip de los 75 KB de presupuesto.

## [2026-09-09] Cierre de la fase 1

- **Q-M resuelta:** marca `>daxho▮` — prompt más cursor de bloque. Combina los
  dos candidatos más fuertes y encadena con la boot sequence y con el prompt del
  hero. → `12-brand.md`. Eliminadas las variantes descartadas del componente.
- **Paleta y sistema de temas aprobados por el usuario** tras revisarlos en
  `/styleguide`. El rojo sangre queda fijado con la rampa doble de ADR-0012.
- **Grain rehecho.** No se veía en tema claro por dos motivos: `feTurbulence`
  genera ruido de color con alfa variable que sobre fondo claro queda lavado, y
  la opacidad era demasiado baja. Ahora el ruido pasa por `feColorMatrix` a
  escala de grises y la capa se sitúa **detrás del contenido** (`z-index: -1`)
  en lugar de encima, lo que permite subir la intensidad sin tocar ningún ratio
  de contraste. Intensidad por tema mediante `--grain-opacity`: 0.42 en claro,
  0.16 en oscuro. → `02-design-system.md` §8.1.
