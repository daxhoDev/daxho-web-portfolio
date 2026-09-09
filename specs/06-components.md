# 06 — Inventario de componentes

**Estado:** BORRADOR · 2026-09-09

## Reglas generales

1. **Astro por defecto, React solo si hace falta estado o eventos.** Ver
   `03-architecture.md`.
2. Todo componente consume **tokens semánticos** de `02-design-system.md`. Está
   prohibido escribir un color literal en un componente.
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
| `SectionHeading` | astro | `<h2>` con glitch disparado |
| `Icon` | astro | envoltorio de SVG, aplica la especificación de `02-design-system.md` §6 |
| `Prose` | astro | estilos tipográficos para el cuerpo MDX |

## `layout/`

| Componente | Tipo | Notas |
|---|---|---|
| `Header` | astro | **ocultable al bajar** (Q28): se esconde al hacer scroll hacia abajo, reaparece al subir. Debe reaparecer siempre al llegar arriba y al recibir foco por teclado |
| `Brand` | astro | marca denominativa, enlaza al home del idioma activo (ver `12-brand.md`) |
| `Nav` | astro | Home · About · Projects · Resume · Contact — **tres modos**, ver abajo |
| `NavDropdown` | react `client:idle` | modo intermedio |
| `MobileNav` | react `client:idle` | sidebar; atrapa el foco mientras está abierto, cierra con `Esc`, devuelve el foco al botón |
| `Footer` | astro | enlaces a redes sociales (pendiente Q36) |
| `SkipLink` | astro | "Skip to content", primer elemento tabulable de la página |

## `sections/`

| Componente | Tipo | Notas |
|---|---|---|
| `Hero` | astro + isla | contiene `TypingHero` |
| `AboutTeaser` | astro | bloque about breve del home |
| `TechCarousel` | astro | **CSS puro, sin JS** |
| `FeaturedProjects` | astro | los 3 destacados |
| `CtaBand` | astro | banda de acento con CTA final |
| `Timeline` | astro | experiencia, marcada como `<ol>` |
| `SkillsGrid` | astro | skills agrupadas |

## `project/`

| Componente | Tipo | Notas |
|---|---|---|
| `ProjectCard` | astro | ver anatomía abajo |
| `StackRow` | astro | fila de iconos de tecnologías |
| `ProjectGallery` | astro | capturas del detalle |
| `ProjectNav` | astro | anterior / siguiente |

## `islands/` — React

| Componente | Directiva | Motivo |
|---|---|---|
| `ThemeToggle` | `client:load` | tres estados (claro/oscuro/sistema); lee el estado real del DOM al hidratarse, nunca asume un valor por defecto |
| `LanguageSwitcher` | `client:load` | escribe `localStorage.lang`; navega a la **página equivalente** usando `i18n/routes.ts`, nunca al home |
| `NavDropdown` | `client:idle` | modo intermedio del header |
| `MobileNav` | `client:idle` | sidebar |
| `ContactForm` | `client:visible` | |
| `TypingHero` | `client:load` | |

---

## Navegación — tres modos (Q-N decidida)

Decisión del usuario: en lugar de eliminar enlaces, la navegación **cambia de
forma** antes de llegar a comprimirse. Los 5 enlaces se conservan en los tres
modos.

| Modo | Ancho | Comportamiento |
|---|---|---|
| **Completo** | `≥ lg` (1024px) | los 5 enlaces en línea, junto a la marca y los dos selectores |
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
El home usa **exactamente esta misma card** (Q-B decidida). El componente expone
una prop `variant` para futuros usos, pero hoy solo existe la variante por
defecto. No se crea un segundo componente.
