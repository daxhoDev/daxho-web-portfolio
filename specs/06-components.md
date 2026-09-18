# 06 — Inventario de componentes

**Estado:** APROBADA · 2026-09-14 · prerrequisito de la fase 2, cumplido ·
alcance acotado el 2026-09-17

**Alcance:** los componentes del sitio, los de `src/components/`. Las plantillas
de correo de `src/emails/` **no** entran aquí: no llegan al navegador y las rige
`14-email.md`, que por fuerza permite colores literales —los clientes de correo
no soportan variables CSS— con un test que los compara con `tokens.css`.

## Reglas generales

1. **Astro por defecto, React solo si hace falta estado o eventos.** Ver
   `03-architecture.md`.
2. Todo componente consume **tokens semánticos** de `02-design-system.md`. Está
   prohibido escribir un color literal en un componente. (Única excepción, fuera
   de este inventario: las plantillas de correo, ver el alcance de arriba.)
3. Todo componente interactivo cubre: reposo, hover, foco, activo, deshabilitado.
4. Props tipadas. Sin `any`.
5. Ningún componente nuevo se crea sin estar en este inventario o sin aprobación
   previa del usuario.

---

## `ui/` — primitivos

| Componente | Tipo | Notas |
|---|---|---|
| `Button` | astro | variantes `primary`, `secondary`, `ghost`; tamaños `sm`, `md`; renderiza `<a>` o `<button>` según reciba `href` |
| `Chip` | astro | etiqueta de tecnología: icono + texto |
| `Card` | astro | contenedor con borde y superficie |
| `Container` | astro | ancho máximo y padding lateral |
| `SectionHeading` | astro | `<h2>` que se **teclea** al entrar en pantalla, una sola vez (ADR-0014) |
| `TypingText` | astro | **CSS puro, sin JS.** Efecto de tecleo. `trigger`: `load`, `boot` (hero: espera a la boot sequence si está en pantalla) o `viewport` (encabezados); `caret`: `persistent` (hero, es la marca), `transient` (encabezados) o `none` |
| `Icon` | astro | envoltorio de SVG, aplica la especificación de `02-design-system.md` §6 |
| `Prose` | astro | estilos tipográficos para el cuerpo MDX; todo con tokens semánticos, sin plugin de tipografía |

## `layout/`

| Componente | Tipo | Notas |
|---|---|---|
| `Header` | astro | **ocultable al bajar** (Q28): se esconde al hacer scroll hacia abajo, reaparece al subir. Debe reaparecer siempre al llegar arriba y al recibir foco por teclado |
| `Brand` | astro | marca denominativa, enlaza al home del idioma activo (ver `12-brand.md`) |
| `Nav` | astro | Home · About · Projects · Contact — **tres modos**, ver abajo. Eran 5 enlaces hasta que se eliminó `/resume` (2026-09-16) |
| `Footer` | astro | enlaces a redes sociales desde `src/content/social.ts`, **placeholder hasta la fase 10** (Q36 resuelta) · desde la fase 8, la línea de cookies de ADR-0015 |
| `SkipLink` | astro | "Skip to content", primer elemento tabulable de la página |
| `BootSequence` | astro | overlay de arranque de ADR-0019. **Sin isla**: se retira por animación CSS de duración fija, y el script inline solo gestiona el "saltar" y el `sessionStorage`. Si el JS falla, el overlay desaparece igual |

## `sections/`

| Componente | Tipo | Notas |
|---|---|---|
| `Hero` | astro | pantalla completa bajo el header; usa `TypingText` con `trigger="boot"` y cursor permanente, que arranca al terminar la boot sequence de ADR-0019 o de inmediato si no se muestra; enlace estático `scroll ↓` |
| `AboutTeaser` | astro | bloque about breve del home |
| `TechCarousel` | astro | **CSS puro, sin JS** |
| `FeaturedProjects` | astro | los 3 destacados |
| `CtaBand` | astro | banda de acento con CTA final |
| `Timeline` | astro | experiencia, marcada como `<ol>`, de más reciente a más antigua; la usa `/about` |
| `SkillsGrid` | astro | skills en los seis grupos de `10-tech-catalog.md`, sin nivel de dominio; la usa `/about` |

## `project/`

| Componente | Tipo | Notas |
|---|---|---|
| `ProjectCard` | astro | ver anatomía abajo. Props: `cover`/`coverAlt` (sin `cover` pinta el bloque PLACEHOLDER), `lang`, y `headingLevel` (`h2` en `/projects`, donde cuelga del `<h1>`; `h3` bajo una sección) |
| `StackRow` | astro | fila de iconos de tecnologías |
| `ProjectGallery` | astro | capturas del detalle, en línea y enlazadas a la imagen completa; sin lightbox (Q-E) |
| `ProjectNav` | astro | anterior / siguiente, **sin vuelta circular**: oculta el lado que no existe |

## `islands/` — React

**Todo componente React vive aquí y solo aquí**, incluidos los de navegación. La
tabla de `layout/` contiene únicamente `.astro`.

| Componente | Directiva | Motivo |
|---|---|---|
| `ThemeToggle` | `client:load` | tres estados (claro/oscuro/sistema); lee el estado real del DOM al hidratarse, nunca asume un valor por defecto. **En móvil (< md) solo muestra el icono**; el texto aparece desde `md`. Textos y nombre accesible traducidos: el header se los pasa como props ("Sistema", "Claro", "Oscuro" en español) |
| `LanguageSwitcher` | `client:load` | escribe `localStorage.lang`; navega a la **página equivalente**, nunca al home. El destino lo calcula Astro en el servidor con `i18n/utils.ts`; la isla no reimplementa el enrutado en cliente |
| `NavDropdown` | `client:idle` | modo intermedio del header |
| `MobileNav` | `client:idle` | sidebar. Disparador **solo con icono de hamburguesa** (nombre accesible en `aria-label`). Con el panel abierto: **backdrop con blur** detrás que cierra al tocarlo, **botón X arriba a la derecha** del panel, **el fondo no hace scroll**. Atrapa el foco, cierra con `Esc` y devuelve el foco al botón |
| `ContactForm` | `client:visible` | renderiza un `<form>` HTML real que funciona sin JavaScript; al hidratar intercepta el envío (validación en vivo, `fetch`, estados). Incluye el honeypot |

---

## Navegación — tres modos (Q-N decidida)

Decisión del usuario: en lugar de eliminar enlaces, la navegación **cambia de
forma** antes de llegar a comprimirse. Todos los enlaces (4 desde que se eliminó
`/resume`) se conservan en los tres modos.

| Modo | Ancho | Comportamiento |
|---|---|---|
| **Completo** | `≥ lg` (1024px) | los 4 enlaces en línea, junto a la marca y los dos selectores |
| **Dropdown** | `md` – `lg` | los enlaces colapsan en un desplegable; marca y selectores siguen visibles |
| **Sidebar** | `< md` (768px) | panel lateral a pantalla completa |

El punto exacto del primer salto se ajusta midiendo en el navegador: el criterio es
**cambiar antes de que aparezca compresión visible**, no al llegar a un número
concreto. Se valida en el incremento 1.

### Requisitos de accesibilidad (aplican a dropdown y sidebar)
- `aria-expanded` en el botón disparador, `aria-controls` apuntando al panel.
- Cierre con `Esc` y con clic fuera.
- El foco vuelve al botón disparador al cerrar.
- **Sidebar**: foco atrapado mientras está abierto, y resto de la página con
  `inert` o `aria-hidden`.
- **Sidebar**: el botón X vive **dentro** del panel, para quedar dentro de la
  trampa de foco, y es lo primero que recibe foco al abrir.
- **Sidebar**: el backdrop va dentro del header, en su mismo contexto de
  apilamiento. Fuera de él quedaría por encima del header entero, sidebar
  incluido, y el blur taparía el menú.
- **Dropdown**: no atrapa el foco, pero tabular fuera de él lo cierra.
- Ambos se desactivan y devuelven la navegación al DOM normal si el JS falla: los
  enlaces deben existir en el HTML, no inyectarse.

---

## Anatomía de `ProjectCard`

Requisito del usuario. Orden vertical:

1. **Captura** — ocupa el mayor espacio de la card. `aspect-ratio` fijo,
   dimensiones explícitas, `alt` del contenido.
2. **Nombre** del proyecto, en monoespaciada. Es el enlace principal.
3. **Fila de iconos** de tecnologías (`StackRow`).
4. **Dos botones**: "View details" (secundario) y "Open project" (primario,
   pestaña nueva, `rel="noopener noreferrer"`).

### Patrón de clic en toda la card

Requisito: hacer clic fuera de los botones equivale a "View details".

Implementación obligatoria — *enlace principal con área extendida*:

- El nombre del proyecto es un `<a>` real al detalle.
- Ese `<a>` lleva un `::after` posicionado en absoluto que cubre la card entera.
- La card es `position: relative`.
- Los botones llevan `position: relative` y `z-index` superior, para quedar por
  encima del área extendida.

Prohibido: `onClick` sobre un `<div>` o `<article>`. Rompería la navegación por
teclado, impediría abrir en pestaña nueva o copiar el enlace, y sería un
incumplimiento directo de WCAG AA.

Nota conocida del patrón: seleccionar texto dentro de la card se vuelve difícil.
Es aceptable, porque el texto de la card es corto y no está pensado para copiarse.

### Variantes
El home usa **exactamente esta misma card** (Q-B decidida). No se crea un segundo
componente, y **no hay prop `variant`**: se describía "para futuros usos", nunca
llegó a implementarse y nadie la necesita. Si un día hace falta, se añade
entonces.
