# 04 — Modelo de contenido

**Estado:** BORRADOR · 2026-09-09
Los datos reales (sección F del cuestionario) están pendientes; hasta entonces se
usa contenido de relleno **marcado explícitamente como tal**.

---

## Regla de contenido de relleno

Todo texto o imagen de relleno debe ser inequívocamente identificable:

- Textos: Lorem Ipsum, nunca frases plausibles que puedan confundirse con
  contenido real.
- Imágenes: placeholders con marca de agua visible o bloques de color con el
  texto "PLACEHOLDER".
- Cada archivo de contenido de relleno lleva `draft: true` en su frontmatter.

**Regla dura: no se hace merge a `master` con `draft: true` en producción.** El
esquema debe filtrarlos del build de producción.

---

## Colección: `projects`

Un archivo MDX por proyecto e idioma: `src/content/projects/{lang}/{slug}.mdx`.
El `slug` es idéntico en ambos idiomas (es el identificador del proyecto, no se
traduce).

### Esquema (Zod)

| Campo | Tipo | Req. | Notas |
|---|---|---|---|
| `title` | string | sí | nombre del proyecto |
| `summary` | string (≤160) | sí | una frase; se usa en la card y en la meta description |
| `cover` | image | sí | captura principal, 16:9 |
| `coverAlt` | string | sí | alternativa textual obligatoria |
| `gallery` | array de `{ image, alt, caption? }` | no | capturas del detalle |
| `stack` | array de string | sí | claves de tecnología, validadas contra el catálogo |
| `liveUrl` | url | no | si falta, el botón "Open project" se oculta |
| `repoUrl` | url | no | |
| `featured` | boolean | sí | los `true` aparecen en el home |
| `featuredOrder` | number | no | obligatorio si `featured` es `true` |
| `order` | number | sí | orden en la galería |
| `year` | number | sí | |
| `role` | string | no | rol de Daxho en el proyecto |
| `status` | enum | sí | `live` · `archived` · `wip` |
| `draft` | boolean | sí | por defecto `true` |

El **cuerpo MDX** contiene la descripción larga del detalle.

### Validaciones exigidas en el build
- Debe haber **exactamente 3** proyectos con `featured: true`.
- Todo `slug` en inglés debe tener su equivalente en español (o declararse
  explícitamente como no traducido).
- Toda clave de `stack` debe existir en el catálogo de tecnologías.
- Total previsto: **6 proyectos**, los 3 destacados incluidos.

---

## Catálogo de tecnologías

`src/content/tech.ts`. Fuente única para el carrusel del home, la fila de stack de
cada card y la sección de skills.

| Campo | Tipo | Notas |
|---|---|---|
| `key` | string | identificador estable, ej. `react` |
| `label` | string | nombre visible, ej. `React` |
| `icon` | componente SVG | silueta sólida, ver `02-design-system.md` §6 |
| `category` | enum | `language` · `framework` · `tool` · `platform` |
| `inCarousel` | boolean | si aparece en el carrusel del home |

Lista concreta de tecnologías: ver `10-tech-catalog.md`.
Iconos: dibujados a mano, ver ADR-0018.

---

## Colección: `experience`

Para la página `/about` y la página `/resume`.

| Campo | Tipo | Req. |
|---|---|---|
| `company` | string | sí |
| `role` | string | sí |
| `startDate` | date | sí |
| `endDate` | date \| null | sí (`null` = actualidad) |
| `location` | string | no |
| `type` | enum: `full-time`·`contract`·`freelance` | sí |
| `highlights` | array de string | sí |
| `stack` | array de string | no |

Cuerpo: descripción opcional en MDX.

---

## Skills

`src/content/skills.ts`, agrupadas por categoría, referenciando claves del
catálogo de tecnologías.

Decisión pendiente: si se muestra nivel de dominio (barras/porcentajes) o solo
agrupación. Ver `OPEN-QUESTIONS.md` (Q-D).

---

## Traducción

Instrucción del usuario (Q15): entrega el contenido en español, en inglés o en
ambos; el agente se encarga de traducir lo que falte.

Reglas de traducción vinculantes:
1. La traducción **no** se inventa contenido: si el original no dice algo, la
   traducción tampoco.
2. Los nombres propios, nombres de producto y tecnologías no se traducen.
3. Toda traducción generada por el agente se marca `translatedByAgent: true` en el
   frontmatter, para que el usuario pueda revisarla.
4. El registro técnico se mantiene: el inglés del portafolio es profesional y
   directo, no coloquial.
