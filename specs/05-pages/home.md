# Página: Home (`/`, `/es`)

**Estado:** BORRADOR · 2026-09-09

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
- Prefijo de prompt `>` y cursor de bloque `▮` al final.
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
  estilizado que quiera.
- CTA primario → `/projects`. CTA secundario → `/contact`.
- Indicador de scroll.

### 2. About breve
- Texto corto de presentación + fotografía.
- Enlace "Read more" → `/about`.
- Layout: dos columnas en escritorio, apiladas en móvil (imagen primero).

### 3. Divisoria — Carrusel de tecnologías
- Carrusel **infinito**, desplazamiento continuo horizontal.
- Muestra **las 25 tecnologías** del catálogo (`10-tech-catalog.md`). Su función es
  decorativa: textura visual, no inventario legible. Ver `DEVIATIONS.md`.
- Iconos **monocromáticos, lineart**, en el color de acento.
- Implementación en **CSS puro** (duplicado del track + `animation`), sin
  JavaScript y sin isla.
- Se detiene con `prefers-reduced-motion` (queda estático y con scroll manual).
- Máscara de desvanecido en ambos extremos.
- Cada icono lleva su `aria-label`; el contenedor es una lista con
  `aria-label="Technologies"`. Los duplicados del track van `aria-hidden`.
- **Bloqueado** por la decisión de iconos (`OPEN-QUESTIONS.md` Q-A).

### 4. Proyectos destacados
- Exactamente **3** cards (`featured: true`, ordenadas por `featuredOrder`).
- **Mismo componente `ProjectCard` que `/projects`, idéntico** (Q-B decidida).
  El componente acepta una prop de variante por si más adelante hiciera falta
  diferenciarlos, pero el home usa la variante por defecto: con captura, nombre,
  fila de stack y los dos botones.
- Botón "View more projects" → `/projects`.

### 5. Banda CTA final
- Encabezado + CTA → `/contact`.
- Superficie de acento: es el único bloque con fondo rojo de la página, para que
  el ojo lo encuentre.

## SEO
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
