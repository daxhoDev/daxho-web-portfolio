# DEVIATIONS.md

Registro de reglas de `specs/` que el usuario ha decidido **explícitamente**
cambiar o romper. Obligatorio por la Regla 3 de `../AGENTS.md`.

---

## [2026-09-16] Los correos pasan a HTML con React Email (fase 11)

- **Regla anterior:** ADR-0020 — *"El cuerpo incluye nombre, correo y mensaje en
  texto plano legible."*
- **Regla nueva:** a partir de la **fase 11**, el aviso se envía también en HTML
  generado con React Email, siguiendo la estética del sitio; el texto plano se
  conserva como alternativa (ADR-0022, `14-email.md`). **Hasta entonces sigue
  rigiendo el texto plano**, que es lo desplegado.
- **Motivo (palabras del usuario):** *"Crea la especificación y una etapa de
  implementación para más adelante, los emails seguirán la estética y diseño de
  la web."*
- **Consecuencias asumidas:**
  - Una dependencia nueva, solo de servidor: el presupuesto de JS del sitio no
    cambia.
  - La estética se traduce, no se copia: sin fuentes web, sin variables CSS y
    sin animación, porque Gmail no los soporta.
  - Queda abierta Q-Q (tema claro u oscuro), que bloquea la fase 11.
  - Se advirtió al usuario de que el único destinatario es él mismo mientras no
    haya dominio propio (Q39); aun así decidió especificarlo.
- **Aprobada por:** usuario.
- **Archivos actualizados:** ADR-0020, ADR-0022 (nueva), `14-email.md` (nueva),
  `13-roadmap.md`, `OPEN-QUESTIONS.md`, `03-architecture.md`,
  `08-integrations.md`, `05-pages/contact.md`, `README.md`,
  `01-decisions/README.md`, `CHANGELOG.md`.

---

## [2026-09-16] Se elimina `/resume`; el CV se descarga desde `/about`

- **Reglas anteriores:**
  - `05-pages/resume.md` (APROBADA ese mismo día) — página `/resume` con botón de
    descarga, contacto, perfil, experiencia, skills, formación e idiomas.
  - `06-components.md` y Q-N — navegación con **5 enlaces** (Home · About ·
    Projects · Resume · Contact).
- **Reglas nuevas:**
  - `/resume` no existe. `resume.md` pasa a SUPERSEDED.
  - `/about` lleva el botón de descarga del CV tras la entradilla, y formación e
    idiomas tras la experiencia. Perfil profesional y datos de contacto se
    eliminan.
  - La navegación tiene 4 enlaces.
- **Motivo (palabras del usuario):** *"podemos eliminar la página resume y el
  botón de descarga del CV mostrarlo en about. Se debe a que about y resume
  muestran lo mismo"*. Colocación del botón y destino de cada bloque elegidos por
  el usuario entre opciones: botón tras la entradilla; formación e idiomas a
  `/about`; perfil (repetía la bio) y contacto (ya en el CTA y el footer) fuera.
- **Consecuencias asumidas:**
  - El sitio no está desplegado todavía: no hay URL pública de `/resume` que
    redirigir.
  - `social.ts` deja de compartirse, pero se mantiene como fuente de las redes del
    footer.
  - La hoja de impresión se conserva, ahora para `/about`.
- **Aprobada por:** usuario.
- **Archivos actualizados:** `05-pages/about.md`, `05-pages/resume.md`,
  `05-pages/README.md`, `06-components.md`, `03-architecture.md`,
  `04-content-model.md`, `13-roadmap.md`, `OPEN-QUESTIONS.md`, `CHANGELOG.md`.

---

## [2026-09-14] El plan termina en `development`; `master` lo gestiona el usuario

- **Reglas anteriores:**
  - `13-roadmap.md`, fase 9 — *"Merge `development` → `master`"*, con la fase 10
    (contenido real) **después**.
  - `AGENTS.md` y ADR-0017 — *"`development` mergea a `master`"*, sin decir
    quién.
  - `09-testing.md` y ADR-0016 — auditorías y verificaciones *"antes de cada
    merge a `master`"*.
- **Reglas nuevas:**
  - La fase 10 va **antes** de la 9. Se conserva la numeración.
  - Ninguna fase mergea a `master`. Todo el trabajo del agente termina en
    `development`; el agente no abre PRs ni mergea hacia `master`.
  - Las auditorías se hacen en la fase 9, sobre el contenido real y contra
    `development`. Repetirlas antes de un release es decisión del usuario.
- **Motivo (palabras del usuario):** *"Adelantamos la fase de contenido real, el
  merge a master queda fuera del plan, todo a development, de master me encargo
  yo cuando lo crea conveniente."* Resuelve Q-P con la opción (a).
- **Consecuencias asumidas:**
  - Desaparece el bloqueo de la fase 9.
  - Las auditorías de rendimiento se miden sobre capturas reales, que es lo único
    que dice algo del sitio.
  - La guarda de CI sobre `master` (`scripts/check-drafts.mjs`) se mantiene: ahora
    protege los merges que haga el usuario.
- **Aprobada por:** usuario.
- **Archivos actualizados:** `13-roadmap.md`, `OPEN-QUESTIONS.md`, `AGENTS.md`,
  ADR-0017, `07-conventions.md`, `09-testing.md`, ADR-0016,
  `04-content-model.md`, `CHANGELOG.md`.

---

## [2026-09-14] Los drafts se filtran solo en el despliegue a producción

- **Regla anterior:** `04-content-model.md` — *"no se hace merge a `master` con
  `draft: true` en producción. El esquema debe filtrarlos del build de
  producción."*
- **Regla nueva:** los drafts se excluyen **solo cuando `VERCEL_ENV=production`**,
  y un job de CI hace fallar cualquier PR hacia `master` que contenga
  `draft: true`.
- **Motivo:** las previews de Vercel también son builds de producción
  (`import.meta.env.PROD`). Filtrando en todo `astro build`, la galería de las
  fases 4 a 9 —que trabajan con contenido de relleno— saldría vacía en cada
  preview, y la validación de "exactamente 3 destacados" fallaría con 0
  proyectos. El usuario eligió la opción recomendada: *"Solo en el despliegue a
  producción + guarda en CI"*.
- **Consecuencias asumidas:**
  - La garantía real pasa a ser la guarda de CI, no un flag del build.
  - Las validaciones que cuentan elementos se evalúan sobre lo que se publica en
    cada entorno.
  - Destapa un conflicto del roadmap: la fase 9 mergea a `master` antes de que
    la 10 traiga el contenido real. Registrado como **Q-P**, bloquea la fase 9.
    *Resuelta el mismo día: ver la entrada "El plan termina en `development`".*
- **Aprobada por:** usuario.
- **Archivos actualizados:** `04-content-model.md`, `13-roadmap.md`,
  `OPEN-QUESTIONS.md`, `CHANGELOG.md`.

---

## [2026-09-14] Todo proyecto existe en ambos idiomas, sin excepción

- **Regla anterior:** `04-content-model.md` — *"Todo `slug` en inglés debe tener
  su equivalente en español (o declararse explícitamente como no traducido)."*
- **Regla nueva:** todo `slug` existe en ambos idiomas **o el build falla**. Se
  elimina la escapatoria de "no traducido".
- **Motivo:** el usuario eligió la opción recomendada, *"No: ambos idiomas
  siempre, o falla el build"*. Sin versión en español, el selector de idioma de
  `/projects/x` llevaría a una 404, rompiendo la regla de ADR-0008 de ir siempre
  a la página equivalente.
- **Consecuencias asumidas:** la escapatoria nunca hacía falta. Por Q15, lo que
  el usuario no entregue traducido lo traduce el agente, marcado con
  `translatedByAgent: true` para su revisión.
- **Aprobada por:** usuario.
- **Archivos actualizados:** `04-content-model.md`, `CHANGELOG.md`.

---

## [2026-09-14] El glitch se elimina; lo sustituye el typing

- **Regla anterior:** ADR-0014 §5 — *"Glitch en encabezados, respetando la
  petición de tenerlo en todos, pero disparado, no en bucle"*, implementado con
  PowerGlitch (entrada del 2026-09-09, arriba).
- **Regla nueva:** **no hay glitch en ninguna parte del sitio.** Todos los
  encabezados llevan el efecto de **tecleo**, disparado al entrar en pantalla y
  una sola vez. El typing pasa a ser el único efecto de texto del sitio.
- **Motivo (palabras del usuario):** *"eliminaremos el efecto de glitch, lo
  sustituiremos por el de typing"*.
- **Decisiones que la sustitución no resolvía por sí sola, aprobadas por el
  usuario en la misma conversación:**
  1. **Alcance:** sustitución 1:1 — donde había glitch, hay typing. No se pierde
     el efecto en ningún encabezado.
  2. **Disparo:** al entrar en viewport, no al cargar la página. Un encabezado
     bajo el pliegue terminaría de teclearse sin que nadie lo viera.
  3. **Hover y foco:** no repiten el efecto. Se teclea una sola vez.
  4. **Cursor:** efímero en los encabezados (acompaña al tecleo y se apaga);
     permanente solo en el hero, donde es la marca.
- **Consecuencias asumidas:**
  - **Se retira la dependencia `powerglitch`.** El presupuesto de JS baja de
    62,6 KB a **59,2 KB** gzip de los 75 KB.
  - El disparo por viewport necesita un `IntersectionObserver` de unos cientos
    de bytes, en un `<script is:inline>` (no una isla). Es **mejora progresiva**:
    marca `<html>` de forma síncrona antes del primer pintado para que el CSS
    pueda pausar el tecleo, y si no llega a ejecutarse el tecleo arranca con la
    carga. **El texto nunca queda invisible por falta de JavaScript**, así que no
    se rompe la regla 10 de `07-conventions.md`.
  - El typing ya no es "cero JavaScript" sin matices: el del hero sí lo sigue
    siendo; el de los encabezados paga ese observador. Se corrige el texto de
    `03-architecture.md`, que lo afirmaba sin excepciones.
  - Desaparece la reorganización del DOM que hacía PowerGlitch (envolturas y
    clones `aria-hidden`), y con ella su superficie de accesibilidad.
  - **Se corrige de paso una contradicción anterior:** `03-architecture.md` y
    `06-components.md` listaban `TypingHero` como isla React `client:load`,
    cuando el typing se implementó en la fase 1 sin isla y sin JavaScript. La
    fila se elimina de ambas tablas y se documenta `TypingText` como primitivo
    `ui/`. No es una decisión nueva: es la spec poniéndose al día con lo que ya
    se construyó y aprobó.
- **Aprobada por:** usuario.
- **Archivos actualizados:** ADR-0014 (§5 reescrita, contexto y regla
  transversal), ADR-0013, ADR-0019, ADR-0021, `00-vision.md`,
  `02-design-system.md`, `03-architecture.md`, `06-components.md`,
  `07-conventions.md`, `11-styleguide.md`, `13-roadmap.md`, `05-pages/404.md`,
  `05-pages/about.md`, `05-pages/home.md`, `OPEN-QUESTIONS.md`, `CHANGELOG.md`.
- **Código:** eliminado `src/components/GlitchObserver.astro` y el bloque glitch
  de `src/styles/effects.css`; creado `src/components/TypingObserver.astro`;
  `TypingText.astro` gana `trigger` y `caret`; `SectionHeading.astro` pasa a
  teclear; `powerglitch` fuera de `package.json`; los 2 tests E2E de PowerGlitch
  se sustituyen por 5 del typing (23 → 26 E2E).

---

## [2026-09-09] El glitch se implementa con PowerGlitch, no con CSS puro

> **SUPERSEDED por la entrada del 2026-09-14.** El glitch ya no existe: no
> queda ni el efecto ni la dependencia. Se conserva el registro porque explica
> por qué PowerGlitch estuvo en `package.json` durante la fase 1.

- **Regla anterior:** `03-architecture.md` — *"El carrusel de tecnologías, el
  efecto glitch y el grain se resuelven con CSS puro, sin isla y sin
  JavaScript."*
- **Regla nueva:** el glitch usa la librería **PowerGlitch** (~2,5 KB gzip). El
  carrusel y el grain siguen siendo CSS puro.
- **Motivo (palabras del usuario):** *"usa powerglitch para los glitches"*,
  tras valorar que la versión en CSS quedaba pobre.
- **Consecuencias asumidas:**
  - El glitch pasa a depender de JavaScript. Sin JS el texto se ve estático y
    perfectamente legible, así que no rompe la regla 10 de `07-conventions.md`.
  - PowerGlitch **reorganiza el DOM**: envuelve el elemento en dos contenedores
    y lo clona una vez por rebanada. Los clones se marcan `aria-hidden` desde el
    script, o un lector de pantalla leería el texto una vez por capa.
  - Coste medido: 2,5 KB gzip. Total del build: 62,6 KB de los 75 KB de
    presupuesto.
- **Lo que se mantiene:** sigue siendo **disparado, no en bucle**
  (`playMode: 'manual'`, se dispara al entrar en viewport y con hover/focus), y
  bajo `prefers-reduced-motion` **ni siquiera se inicializa**.
- **Aprobada por:** usuario.
- **Archivos actualizados:** `03-architecture.md`, ADR-0014,
  `02-design-system.md`.

---

## [2026-09-09] Iconos: librería primero, dibujo a mano solo para los huecos

- **Regla anterior:** ADR-0018 — *"Todos los iconos de tecnologías se dibujan a
  mano... ningún SVG de terceros se usa tal cual"*.
- **Regla nueva:** se usan los trazados oficiales de una librería cuando existan
  y encajen con el estilo; solo se dibujan a mano los que falten.
- **Motivo (palabras del usuario):** *"El elefante de postgres no tiene forma,
  si encuentras íconos que cumplan el estilo en una librería no dudes en
  usarlos, genera los tuyos solo para los que falten."*
- **Valoración del agente:** el usuario tiene razón y mi recomendación original
  era mala. Predije que las marcas orgánicas (elefante, gato, pingüino) se
  perderían a 24px y aun así propuse dibujarlas a mano; el resultado confirmó la
  predicción. Los trazados oficiales tienen la forma correcta por construcción.
- **Cobertura verificada:** `simple-icons` contiene las 25 del catálogo,
  incluidas Express y NestJS, que eran las dudosas.
- **Consecuencia:** el trabajo de la fase 3 se reduce drásticamente. También
  desaparece el problema de Express (ya no hace falta inventar una marca
  denominativa) y la reserva de legibilidad asociada.
- **Aprobada por:** usuario.
- **Archivos actualizados:** ADR-0018, `10-tech-catalog.md`.

---

## [2026-09-09] Los iconos de tecnología son siluetas sólidas, no lineart

- **Regla anterior:** requisito del **brief original** — *"los íconos deben ser
  monocromáticos con el color de acento y hechos con lineart"*; recogido en
  `02-design-system.md` §6 y ADR-0018 (`stroke-width: 1.5`, `fill: none`).
- **Regla nueva:** siluetas **sólidas** (`fill: currentColor`) con los trazados
  oficiales de Simple Icons. Se mantienen el carácter monocromático y el color
  de acento; se abandona el lineart.
- **Motivo (palabras del usuario):** *"usaremos los simple icon sólidos"*, tras
  comparar las tres opciones en `/styleguide`.
- **Valoración del agente:** es la decisión correcta. El lineart era coherente
  en las marcas geométricas y se desmoronaba en las orgánicas, y no existe
  ninguna librería que ofrezca logos de tecnologías en lineart de forma
  consistente. Entre «coherente pero irreconocible» y «reconocible y
  coherente», gana lo segundo. La identidad se sostiene igual: siguen siendo
  monocromáticos en rojo sangre, que es lo que aporta el carácter.
- **Alcance:** afecta SOLO a los iconos de tecnología. Los iconos de interfaz
  (flechas, cerrar, tema, enlaces externos) **siguen siendo lineart** con la
  especificación original: son otro lenguaje visual y ahí sí es consistente.
- **Consecuencia:** 24 de 25 iconos salen de la librería. **Playwright** es el
  único que no está en Simple Icons y se dibuja a mano, como silueta sólida
  para casar con el resto.
- **Aprobada por:** usuario.
- **Archivos actualizados:** ADR-0018, `02-design-system.md`,
  `10-tech-catalog.md`, `13-roadmap.md`.

---

## [2026-09-09] Presupuesto de JS del home elevado de 50 a 75 KB

- **Regla anterior:** `03-architecture.md` — *"JS enviado al cliente en el home:
  **< 50 KB** comprimido"*, y la misma cifra como criterio de aceptación en
  `09-testing.md`.
- **Regla nueva:** **< 75 KB gzip**.
- **Motivo (palabras del usuario):** *"Deja React y sube el presupuesto."*
- **Contexto medido en la fase 1:** el build de `/styleguide`, con una sola isla
  React (`ThemeToggle`), transfiere 60,5 KB gzip, de los cuales **57,0 KB son el
  runtime de React**. El presupuesto de 50 KB era por tanto incompatible con
  usar React para las islas, no un objetivo ajustable con optimización.
- **Alternativas descartadas por el usuario:** vanilla JS para los controles del
  header reservando React al formulario (~2 KB en el home), y Preact + compat
  (~5 KB).
- **Valoración del agente:** el coste es real y recae sobre el home, la página
  que más visitas recibe y donde se juega la primera impresión. A cambio, el
  proyecto mantiene React tal y como lo fijó el brief original y evita
  fragmentar el modelo de componentes en dos tecnologías. Es una compensación
  legítima; queda registrada para poder revisarla si Lighthouse baja de 95.
- **Consecuencia asumida:** margen restante para el resto de islas del header
  (`LanguageSwitcher`, `NavDropdown`, `MobileNav`) ≈ 14 KB gzip. Si se agota,
  vuelve a plantearse la decisión en lugar de subir el presupuesto otra vez.
- **Aprobada por:** usuario.
- **Archivos actualizados:** `03-architecture.md`, `09-testing.md`.

---

## [2026-09-09] El carrusel muestra las 25 tecnologías, no una selección

- **Regla anterior:** `10-tech-catalog.md`, regla 4 — *"Tamaño del carrusel: 14-16
  elementos"*, con el campo `inCarousel` seleccionando un subconjunto de 16 de las
  25 del catálogo.
- **Regla nueva:** el carrusel muestra **las 25 tecnologías del catálogo**.
  `inCarousel` queda a `true` para todas.
- **Motivo (palabras del usuario):** *"Mantén el carrusel completo, es meramente
  estético."*
- **Valoración del agente:** el argumento es válido. Mi recomendación de 14-16
  partía de tratar el carrusel como una lista que el visitante lee de principio a
  fin. Si su función es ser **textura visual** y no inventario, el número de
  elementos deja de importar: nadie cuenta los iconos de una banda que se desplaza.
- **Consecuencia asumida:** la fase 1 de iconos pasa de **16 a 25 dibujos**. Todos
  deben estar listos antes de que el home pueda publicarse, porque no hay
  subconjunto que muestre menos. El campo `inCarousel` se conserva en el modelo por
  si en el futuro se quiere volver a filtrar.
- **Aprobada por:** usuario.
- **Archivos actualizados:** `10-tech-catalog.md`, `05-pages/home.md`,
  `04-content-model.md`.

---

## [2026-09-09] Express entra en el carrusel con marca denominativa

- **Regla anterior:** `10-tech-catalog.md` — recomendación (b) de Q-L: dejar
  Express fuera del carrusel por carecer de logotipo icónico, manteniéndolo como
  etiqueta de texto.
- **Regla nueva:** Express **sí** entra en el carrusel, con el icono que el usuario
  aportó: círculo con las letras "ex" dentro.
- **Motivo:** el usuario proporcionó la referencia gráfica concreta (marca circular
  de Express), resolviendo la objeción de que no existía símbolo dibujable.
- **Consecuencia asumida:** ver la nota de legibilidad en `10-tech-catalog.md`.
- **Aprobada por:** usuario.
- **Archivos actualizados:** `10-tech-catalog.md`.
