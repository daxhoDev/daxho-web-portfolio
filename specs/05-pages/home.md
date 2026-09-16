# Página: Home (`/`, `/es`)

**Estado:** APROBADA · 2026-09-16 · se construye en la fase 5; SEO en la fase 8

## Objetivo
En menos de 30 segundos: quién es Daxho, que sabe construir, y cómo contactarlo.

## Secciones, en orden

### 1. Hero
### Titular (Q-O decidida — opción "4 + 2")

Texto, **sin cambios respecto al brief original**:

- **EN:** `welcome to daxho's corner, what should we build?`
- **ES:** `bienvenido a la guarida de daxho, ¿qué construimos?`

Se eligió **guarida** sobre "rincón": conserva la connotación de *lair* que el
español neutro pierde, y encaja con el registro underground del sitio.

El registro underground lo aporta la **forma**, no el texto:
- Todo en minúsculas, en JetBrains Mono.
- Prefijo de prompt `>` y cursor de bloque `▮` al final. Es el **único cursor
  permanente del sitio**: el de los encabezados se apaga al terminar de teclear
  (ADR-0014 §5). Aquí se queda porque es la marca (`12-brand.md`).
- La frase se **teclea** (typing) al terminar la boot sequence de ADR-0019, de modo
  que las dos piezas encadenan: la pantalla de arranque termina y el hero responde.
  Es la única continuidad narrativa del sitio; no romperla.

Requisitos de ADR-0014, vinculantes: el texto final está completo en el HTML desde
el primer render, el contenedor reserva su altura final (CLS = 0), y bajo
`prefers-reduced-motion` aparece entero de inmediato sin teclear.

**Motivo de no oscurecer el texto:** el `<h1>` es lo que decide si un visitante
entiende dónde ha caído en 30 segundos (principio 1 de `00-vision.md`), y el primer
filtro de una candidatura no siempre es técnico. El estilo va en la tipografía y la
animación; el significado se mantiene intacto.

- **Subtítulo: debe contener explícitamente "Software Engineer".** Es donde el hero
  cumple el test de los 30 segundos, y es lo que permite que el `<h1>` sea todo lo
  estilizado que quiera. **Texto (decidido 2026-09-16):**
  - **EN:** `Software Engineer · full-stack web`
  - **ES:** `Software Engineer · desarrollo web full-stack`

  "Software Engineer" se mantiene en inglés en ambos idiomas: es un título
  profesional.
- CTA primario → `/projects`. CTA secundario → `/contact`. Sus textos son los de
  la navegación ("Projects"/"Proyectos", "Contact"/"Contacto"): no se inventa
  texto nuevo para decir lo mismo.
- **Altura:** el hero ocupa la pantalla completa bajo el header (decidido
  2026-09-16).
- **Indicador de scroll:** enlace real `scroll ↓` en monoespaciada que lleva a la
  sección "about". **Estático**, sin animación en bucle: en todo el sitio solo se
  mueven sin parar el carrusel y el cursor de la marca (ADR-0014).

#### Encadenado con la boot sequence
El tecleo del hero arranca cuando termina la boot sequence, o **de inmediato**
cuando no se muestra (segunda visita de la sesión, `prefers-reduced-motion`, sin
JavaScript) o cuando el visitante la salta. Nunca espera a una secuencia que no
está en pantalla.

### 2. About breve
- Texto corto de presentación + fotografía.
- Enlace "Read more" → `/about`.
- Layout: dos columnas en escritorio, apiladas en móvil (imagen primero).

### 3. Divisoria — Carrusel de tecnologías
- Carrusel **infinito**, desplazamiento continuo horizontal.
- Muestra **las 25 tecnologías** del catálogo (`10-tech-catalog.md`). Su función es
  decorativa: textura visual, no inventario legible. Ver `DEVIATIONS.md`.
- Iconos **monocromáticos** en el color de acento, como **siluetas sólidas**
  (Simple Icons). Ver `02-design-system.md` §6 y `DEVIATIONS.md`.
- Implementación en **CSS puro** (duplicado del track + `animation`), sin
  JavaScript y sin isla.
- Se detiene con `prefers-reduced-motion` (queda estático y con scroll manual).
- Máscara de desvanecido en ambos extremos.
- Cada icono lleva su `aria-label`; el contenedor es una lista con
  `aria-label` traducido ("Technologies" / "Tecnologías"). Los duplicados del
  track van `aria-hidden`.

### 4. Proyectos destacados
- Exactamente **3** cards (`featured: true`, ordenadas por `featuredOrder`).
- **Mismo componente `ProjectCard` que `/projects`, idéntico** (Q-B decidida):
  con captura, nombre, fila de stack y los dos botones.
- Botón "View more projects" → `/projects`.

### 5. Banda CTA final
- Encabezado + CTA → `/contact`. **Voz de terminal** (decidido 2026-09-16):
  - **EN:** encabezado `> ready when you are` · botón `contact`
  - **ES:** encabezado `> listo cuando tú lo estés` · botón `contacto`

  El `>` es decorativo (`aria-hidden`), como en la marca y el hero: el nombre
  accesible del encabezado es solo el texto.
- Superficie de acento: es el único bloque con fondo rojo de la página, para que
  el ojo lo encuentre.

## SEO

La fase 5 entrega `<title>` y `hreflang`. JSON-LD, OG y `description` llegan en la
fase 8 (y la `description`, con el contenido real).

- `<title>`: "Daxho — Software Engineer"
- `description`: pendiente de contenido real.
- JSON-LD `Person`.
- OG: imagen genérica del sitio.

## Criterios de aceptación
- [ ] Un solo `<h1>`.
- [ ] LCP < 2.0 s; el LCP es el texto del hero, no una imagen.
- [ ] CLS = 0 con el typing activo.
- [ ] El carrusel no provoca scroll horizontal en el `<body>`.
- [ ] Todo navegable y usable con teclado.
- [ ] Con `prefers-reduced-motion` no hay movimiento.
- [ ] Con JavaScript desactivado el contenido sigue siendo legible por completo.
