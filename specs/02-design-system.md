# 02 — Sistema de diseño

**Estado:** APROBADA · 2026-09-10 · Paleta y sistema de temas revisados y
aprobados por el usuario en `/styleguide` al cierre de la fase 1.
**Nota del usuario:** "TODO EL SISTEMA DE DISEÑO ESTÁ ABIERTO A CAMBIOS."
Este documento es un punto de partida razonado, no un cierre. Cualquier cambio que
apruebes se refleja aquí y se anota en `CHANGELOG.md`.

---

## 1. Identidad visual

Moderno y tecnológico. Escala de grises de negro a blanco, con un único acento:
rojo sangre. La tensión entre el gris frío y el rojo cálido es todo el sistema de
color; no se añaden más colores salvo los estados semánticos imprescindibles.

Referente mental: terminal, panel de instrumentos, informe forense. No: neón,
degradados multicolor, cristal esmerilado.

---

## 2. Color

### 2.1 Rampa de acento — Blood

Base elegida por el usuario: `#8A0303` (rojo sangre profundo, opción (a)).

| Token | Hex | Uso previsto |
|---|---|---|
| `blood-50`  | `#FFF0F0` | fondos de aviso muy tenues (tema claro) |
| `blood-100` | `#FFDCDC` | superficies de acento muy suaves |
| `blood-200` | `#FFBDBD` | bordes suaves en tema oscuro |
| `blood-300` | `#FF8F8F` | hover de texto de acento en tema oscuro |
| `blood-400` | `#F04747` | **texto/icono de acento en tema oscuro** |
| `blood-500` | `#D41F1F` | acento interactivo intermedio |
| `blood-600` | `#B31212` | hover de superficies de acento |
| `blood-700` | `#9C0808` | bordes fuertes |
| `blood-800` | `#8A0303` | **BASE. Texto/icono de acento en tema claro** |
| `blood-900` | `#6E0404` | superficies de acento en tema oscuro |
| `blood-950` | `#3A0202` | glow, sombras teñidas, fondos profundos |

### 2.2 Rampa neutra — Ink (grises fríos)

Neutros con un matiz azulado muy bajo en saturación. Un gris puro se lee como
"documento"; un gris frío se lee como "pantalla", y contrasta mejor con el rojo
cálido del acento.

| Token | Hex |
|---|---|
| `ink-0`   | `#FAFBFC` |
| `ink-50`  | `#F0F2F5` |
| `ink-100` | `#DFE3E8` |
| `ink-200` | `#BFC5CE` |
| `ink-300` | `#949BA6` |
| `ink-400` | `#6B7280` |
| `ink-500` | `#4A505B` |
| `ink-600` | `#333841` |
| `ink-700` | `#24282F` |
| `ink-800` | `#1A1D22` |
| `ink-850` | `#14171B` |
| `ink-900` | `#0E1013` |
| `ink-950` | `#08090B` |

### 2.3 Tokens semánticos

**Los componentes consumen SIEMPRE tokens semánticos, nunca valores de rampa
directamente.** Esta es la regla que hace posible tener dos temas sin duplicar
código, y es innegociable.

| Token semántico | Tema claro | Tema oscuro |
|---|---|---|
| `--bg-base` | `ink-0` | `ink-950` |
| `--bg-surface` | `#FFFFFF` | `ink-900` |
| `--bg-elevated` | `ink-50` | `ink-850` |
| `--bg-inset` | `ink-100` | `ink-800` |
| `--fg-primary` | `ink-900` | `ink-50` |
| `--fg-secondary` | `ink-600` | `ink-300` |
| `--fg-muted` | `ink-400` | `ink-400` |
| `--border-subtle` | `ink-100` | `ink-800` |
| `--border-default` | `ink-200` | `ink-700` |
| `--border-strong` | `ink-300` | `ink-600` |
| `--border-interactive` | `ink-400` | `ink-400` |
| `--accent-text` | `blood-800` | `blood-400` |
| `--accent-text-hover` | `blood-600` | `blood-300` |
| `--accent-surface` | `blood-800` | `blood-900` |
| `--accent-on-surface` | `#FFFFFF` | `ink-50` |
| `--accent-border` | `blood-800` | `blood-700` |
| `--accent-glow` | `blood-950` | `blood-950` |
| `--focus-ring` | `blood-600` | `blood-400` |

### 2.3.1 `--border-interactive` — por qué existe

Descubierto al implementar la fase 1: `--border-default` daba **1.68:1** en tema
claro y **1.35:1** en oscuro contra el fondo. WCAG 1.4.11 exige **3:1** a todo
borde que sea lo único que delimita un control (un botón, un input): sin él, el
control no se distingue del fondo.

Los tres bordes anteriores son estructurales o decorativos y no tienen ese
requisito. Por eso se separa un token propio para bordes con significado.

`ink-400` (`#6b7280`) es el único valor de la rampa que cumple 3:1 sobre **todas**
las superficies de **ambos** temas, así que es idéntico en los dos. Los botones,
inputs y controles del header lo usan obligatoriamente.

### 2.4 Regla de contraste (crítica)

`#8A0303` funciona sobre blanco (~10:1) pero **no alcanza AA sobre casi-negro**
(~2:1, muy por debajo del 4.5:1 exigido). Por eso `--accent-text` cambia de tono
según el tema. Ver ADR-0012.

La identidad "rojo sangre" se conserva: el tono profundo sigue siendo el
protagonista en superficies, bordes y glows, donde el requisito de contraste es
menor o no aplica. Solo el texto y los iconos funcionales se aclaran en oscuro.

**Obligatorio:** todos los ratios de esta tabla deben verificarse con una
herramienta real durante la implementación. Los valores citados aquí son
estimaciones de la fase de diseño y no sustituyen la comprobación.

Mínimos exigidos (WCAG 2.2 AA):
- Texto normal: 4.5:1
- Texto grande (≥24px, o ≥18.66px en negrita): 3:1
- Componentes de UI y bordes con significado: 3:1
- Anillo de foco: 3:1 contra el fondo adyacente

### 2.5 Colores de estado

Solo donde el formulario los necesita. Se mantienen sobrios para no competir con
el acento.

| Token | Claro | Oscuro |
|---|---|---|
| `--state-error` | `#B31212` | `#F04747` |
| `--state-success` | `#1F7A4D` | `#3FBF85` |

El error comparte tono con el acento a propósito: la marca ya es roja, y meter un
rojo distinto solo para errores ensuciaría la paleta.

---

## 3. Tipografía

Ver ADR-0013.

- **Display / encabezados / UI técnica:** JetBrains Mono
- **Cuerpo:** Inter
- Ambas self-hosted vía Fontsource, `woff2`, subconjunto `latin` + `latin-ext`.

### 3.1 Pesos permitidos
- JetBrains Mono: 400, 700
- Inter: 400, 500, 700

Cada peso adicional debe justificarse: son bytes en la ruta crítica.

### 3.2 Escala tipográfica

Escala modular ratio 1.25 (tercera mayor), base 16px, fluida con `clamp()`.

| Token | Móvil → Escritorio | Uso |
|---|---|---|
| `text-xs` | 12px | metadatos, etiquetas de stack |
| `text-sm` | 14px | texto secundario, pies |
| `text-base` | 16px | cuerpo |
| `text-lg` | 18px | entradilla |
| `text-xl` | 20 → 24px | h4 |
| `text-2xl` | 24 → 30px | h3 |
| `text-3xl` | 30 → 38px | h2 |
| `text-4xl` | 36 → 48px | h1 de página interior |
| `text-hero` | 40 → 76px | h1 del hero |

### 3.3 Reglas
- Interlineado: 1.6 en cuerpo, 1.15 en encabezados.
- Longitud de línea máxima: 70 caracteres (`max-w-[65ch]`).
- `letter-spacing` ligeramente negativo en display monoespaciado grande
  (`-0.02em`); nunca en cuerpo.
- Sin justificado. Alineación a la izquierda (a la derecha en su caso para RTL,
  no aplica hoy).
- Nada de texto en mayúsculas para bloques largos; permitido en etiquetas cortas
  con `letter-spacing` positivo.

---

## 4. Espaciado y layout

- Unidad base: **4px**. Toda medida es múltiplo de 4.
- Escala: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- Ancho de contenido: `1200px` máximo; `720px` para bloques de lectura larga.
- Padding lateral: 16px móvil, 24px tablet, 48px escritorio.
- Ritmo vertical entre secciones: 96px móvil, 160px escritorio.

### Breakpoints (los de Tailwind por defecto)
`sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`

Diseño **mobile-first**: los estilos base son los del móvil.

---

## 5. Bordes, radios y elevación

- Radios: `0` (elementos técnicos, chips de stack), `2px` (botones, inputs),
  `4px` (tarjetas), `9999px` (avatar, pills).
  El sistema tiende a lo anguloso: es parte de la estética tecnológica.
- Grosor de borde: 1px por defecto; 2px para foco y estados activos.
- **Elevación por borde y fondo, no por sombra difusa.** En tema oscuro las
  sombras no se ven; el sistema usa cambio de superficie (`--bg-surface` →
  `--bg-elevated`) y borde. Se permite un glow rojo muy tenue en elementos de
  acento destacados.

---

## 6. Iconografía

El sistema usa **dos lenguajes de icono deliberadamente distintos**. No es una
inconsistencia: ver `DEVIATIONS.md` y ADR-0018.

- Iconos de **interfaz** (flechas, cerrar, enlace externo, tema): **lineart
  monocromático**, trazo uniforme. Base: Lucide.
  Especificación técnica: `viewBox="0 0 24 24"`, `fill="none"`,
  `stroke="currentColor"`, `stroke-width="1.5"`, `stroke-linecap="round"`,
  `stroke-linejoin="round"`.
- `currentColor` es obligatorio en ambos lenguajes: permite que el mismo SVG
  funcione en los dos temas y adopte el acento sin duplicar archivos.
- Iconos de **tecnología**: **siluetas sólidas** (`fill: currentColor`,
  `stroke: none`) con los trazados oficiales de Simple Icons. Es una excepción
  deliberada al lineart, ver `DEVIATIONS.md` y ADR-0018. Se consumen siempre a
  través de `TechIcon.astro`, nunca importando iconos sueltos.
- Todo icono decorativo lleva `aria-hidden="true"`. Todo icono con significado
  lleva su alternativa textual.

---

## 7. Movimiento

Ver ADR-0014 (APROBADA).

### Duraciones
| Token | Valor | Uso |
|---|---|---|
| `duration-instant` | 100ms | feedback inmediato (pulsación) |
| `duration-fast` | 180ms | hover, foco |
| `duration-base` | 280ms | transiciones de estado |
| `duration-slow` | 480ms | entradas de sección |

### Curvas
- `ease-out` para entradas (`cubic-bezier(0.16, 1, 0.3, 1)`).
- `ease-in-out` para cambios de estado.
- Sin rebotes ni elásticos: no encajan con el tono del sitio.

### Reglas duras
1. **`prefers-reduced-motion: reduce` desactiva todo el movimiento no esencial.**
   Sin typing (el texto aparece completo de inmediato), sin parallax, sin cursor
   personalizado.
2. **CLS = 0.** Ninguna animación puede alterar el layout. El typing reserva su
   altura final desde el primer render: cada carácter ocupa su espacio desde el
   principio, aunque todavía sea invisible.
3. Solo se animan `transform` y `opacity`. Cualquier otra propiedad requiere
   justificación por escrito.
4. El texto animado debe existir completo en el HTML: la animación revela, no
   inyecta. Requisito de SEO y de lectores de pantalla.

---

## 8. Foco y estados

- **Anillo de foco visible y obligatorio** en todo elemento interactivo:
  `outline: 2px solid var(--focus-ring); outline-offset: 2px`.
  Está terminantemente prohibido eliminarlo sin sustituirlo por algo con al menos
  la misma visibilidad.
- Área táctil mínima: 44×44px.
- Estados a cubrir en todo interactivo: reposo, hover, foco, activo,
  deshabilitado, cargando (donde aplique).
- Se usa `:focus-visible` para no mostrar el anillo en clics de ratón, pero sí
  siempre en navegación por teclado.

---

## 8.1 Grain

Textura estática de ruido, sin animar.

**Va detrás del contenido (`z-index: -1`), nunca encima.** Una capa a pantalla
completa sobre el texto reduce su contraste, y el contraste es una regla dura
verificada con números (§2.4). Poniéndola detrás, la intensidad se puede subir
sin alterar ni un ratio. Para que funcione, el color de fondo vive en `<html>` y
`<body>` es transparente con su propio contexto de apilamiento.

El ruido se pasa a escala de grises con `feColorMatrix`: `feTurbulence` genera
por defecto ruido de color con alfa variable que sobre fondo claro queda lavado.

### Intensidad por tema

| Tema | `--grain-opacity` |
|---|---|
| Claro | `0.42` |
| Oscuro | `0.16` |

El mismo ruido **no se percibe igual** en los dos temas: sobre fondo casi negro
los píxeles claros destacan con mucho más contraste que los oscuros sobre fondo
casi blanco. Por eso el tema oscuro necesita bastante menos opacidad para el
mismo efecto. Se ajusta con una sola variable por tema.

## 9. Cuadrícula de referencia (por definir con mockups)

Pendiente de decidir si se trabaja con mockups en Figma antes de implementar. Ver
`OPEN-QUESTIONS.md` (Q-F).
