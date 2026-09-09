# DEVIATIONS.md

Registro de reglas de `specs/` que el usuario ha decidido **explícitamente**
cambiar o romper. Obligatorio por la Regla 3 de `../AGENTS.md`.

---

## [2026-09-09] El glitch se implementa con PowerGlitch, no con CSS puro

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
