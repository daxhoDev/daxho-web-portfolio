# 04 — Modelo de contenido

**Estado:** APROBADA · 2026-09-14 · la consumen las fases 4 (projects) y 6
(experience, skills)

El contenido real llega en la fase 10 (Q32-Q36), que va antes de la auditoría de
la fase 9. Hasta entonces se usa contenido
de relleno **marcado explícitamente como tal**.

---

## Regla de contenido de relleno

Todo texto o imagen de relleno debe ser inequívocamente identificable:

- Textos: Lorem Ipsum, nunca frases plausibles que puedan confundirse con
  contenido real.
- Imágenes: placeholders con marca de agua visible o bloques de color con el
  texto "PLACEHOLDER".
- Cada archivo de contenido de relleno lleva `draft: true` en su frontmatter.

**Regla dura: ningún `draft: true` llega a producción.** Se garantiza en dos
capas (decisión del usuario, 2026-09-14, ver `DEVIATIONS.md`):

1. **Filtro en el despliegue de producción.** Los drafts se excluyen solo cuando
   `VERCEL_ENV=production`. En local y en las previews de Vercel **sí se ven**:
   son donde se revisan las fases 4 a 8, que trabajan con contenido de relleno.
   Filtrarlos en todo `astro build` dejaría cada preview con la galería vacía.
2. **Guarda en CI.** Un job hace fallar cualquier PR o push hacia `master` que
   contenga contenido en draft. El merge a `master` lo hace el usuario, y la
   guarda lo protege igual. Es lo que de verdad hace cumplir la regla; el filtro es la red
   de seguridad.

Las validaciones que cuentan elementos (p. ej. "exactamente 3 destacados") se
evalúan sobre las entradas **que se publican** en ese entorno.

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
- **Todo `slug` existe en ambos idiomas, o el build falla.** No hay escapatoria
  de "no traducido" (decisión del usuario, 2026-09-14, ver `DEVIATIONS.md`): sin
  versión en español, el selector de idioma llevaría a una 404 y rompería la
  regla de ADR-0008 de ir siempre a la página equivalente. Lo que el usuario no
  entregue traducido lo traduce el agente (Q15), marcado con
  `translatedByAgent: true`.
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
| `icon` | string \| null | slug de Simple Icons; `null` si el icono es propio (Playwright). Silueta sólida, ver `02-design-system.md` §6 |
| `category` | enum | `language` · `framework` · `tool` · `platform` |
| `inCarousel` | boolean | hoy `true` en las 25 (Q-K: el carrusel muestra todas); se conserva por si se vuelve a filtrar |

Lista concreta de tecnologías: ver `10-tech-catalog.md`.
Iconos: trazados oficiales de Simple Icons, dibujados a mano solo los que falten
(ADR-0018 y `DEVIATIONS.md`).

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

**Solo agrupación, sin nivel de dominio** (Q-D resuelta, ver
`05-pages/about.md`).

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
