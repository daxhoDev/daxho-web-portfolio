# 13 — Plan de implementación por fases

**Estado:** APROBADA · 2026-09-10 · orden final y alcance de `master` revisados el 2026-09-14 (Q-P).

Cada fase es una rama `feat/*` que mergea a `development` (ADR-0017), y termina en
**algo que el usuario puede ver y aprobar**. Ninguna fase empieza sin que la
anterior esté aprobada.

**Este plan termina en `development`.** El merge a `master` queda fuera: lo hace
el usuario cuando lo considere conveniente (decisión del 2026-09-14, Q-P).

**Orden de las fases finales:** la fase 10 (contenido real) va **antes** de la 9
(auditoría). Se conserva la numeración para no romper las muchas referencias a
"la fase 10" en las specs y en el código.

Tamaños relativos: **S** pequeña · **M** media · **L** grande.

---

## ~~Fase 1 — Fundación y sistema de diseño~~ · **L** · ✅ COMPLETADA
Rama: `feat/design-system` → mergeada a `development` (PR #1, `7a48f63`) ·
Alcance detallado en `11-styleguide.md`

Proyecto Astro (pnpm, TS strict, alias, Tailwind v4, ESLint + Prettier, adapter de
Vercel) · fuentes autoalojadas · tokens de `02-design-system.md` en `@theme` ·
script inline del tema y `ThemeToggle` de 3 estados · primitivos `ui/` · typing y
grain · carrusel en CSS puro · `ProjectCard` con datos de relleno · la página
`/styleguide`.

**Incluye la hoja de calibración de iconos** (`vercel`, `react`, `postgresql`) y
la elección del detalle de acento de la marca (`12-brand.md`).

**Entregable revisable:** `/styleguide` en local, en ambos temas, con las
animaciones vivas y los ratios de contraste medidos en pantalla.

**Riesgo (resuelto):** era la fase donde se validaba que el rojo sangre funciona
en tema oscuro (ADR-0012). Funciona: la paleta quedó aprobada en `/styleguide`
con la rampa doble.

**Cierre real:** lint limpio · typecheck 0 errores · 39 tests unitarios ·
23 tests E2E · 62,6 KB gzip de los 75 KB de presupuesto. Dos hallazgos
propagados a las specs: el token `--border-interactive` (contraste de bordes) y
la subida del presupuesto de JS a 75 KB (`DEVIATIONS.md`).

**Cambio posterior (2026-09-14):** el glitch que se construyó en esta fase quedó
**derogado** y sustituido por el typing, que pasa a ser el único efecto de texto
del sitio (`DEVIATIONS.md`, rama `feat/typing-effect`). Al retirar PowerGlitch el
presupuesto de JS bajó de 62,6 KB a **59,2 KB** de los 75 KB, y los tests E2E
pasaron de 23 a 26.

**Siguiente:** Fase 2.

---

## Fase 2 — Esqueleto del sitio · **L** · 🔍 EN REVISIÓN (PR #3)
Rama: `feat/site-skeleton`

**Prerrequisito cumplido (2026-09-14):** `06-components.md` y `05-pages/404.md`
pasan a APROBADA. Al aprobarlas se cerraron tres huecos: `BootSequence` no
figuraba en el inventario pese a que ADR-0019 está aprobada y la regla 5 prohíbe
crear un componente que no esté listado; `NavDropdown` y `MobileNav` aparecían
duplicados en `layout/` y en `islands/`; y `Footer` seguía citando Q36 como
pendiente cuando estaba resuelta.

`BaseLayout` · marca y favicon (`12-brand.md`) · header ocultable con los **tres
modos** de navegación · footer · **i18n completo** (rutas `/` y `/es`, diccionarios,
`localizePath`, `hreflang`, `LanguageSwitcher`) · detección de idioma de ADR-0009 ·
boot sequence de ADR-0019 · página 404 · `SkipLink`.

**El i18n va aquí, no después.** Retrofitear i18n sobre páginas ya construidas es
de las refactorizaciones más caras y propensas a error que existen.

**Entregable:** el sitio navegable en dos idiomas con páginas vacías.

**Cierre real (2026-09-14), pendiente de tu revisión visual:** lint limpio ·
typecheck 0 errores · **57 tests unitarios** (39 + 18 de i18n) · **46 tests E2E**
(26 + 20 de i18n, header, navegación y boot sequence) · **62,1 KB gzip** de los
75 KB · 12 rutas generadas, 6 por idioma.

Dos hallazgos de la implementación, propagados a las specs:

1. **`i18n/routes.ts` no llega a existir.** Era un mapa de rutas equivalentes
   entre idiomas, y solo hace falta si los segmentos se traducen — que es
   justamente lo que ADR-0010 decidió NO hacer, y por este motivo exacto. Con
   rutas en inglés en ambos idiomas la equivalencia es quitar o poner el
   prefijo. Vive en `i18n/utils.ts`.
2. **Dos islas no pueden ser dueñas del mismo atributo.** `NavDropdown` y
   `MobileNav` escribían ambas `data-open` sobre `#site-nav`; con `client:idle`
   no hay garantía de orden de hidratación, y la que llegaba segunda pisaba a la
   primera. Se resolvió no escribiendo al montar: el estado inicial lo fija el
   HTML servido y cada isla solo toca el atributo tras una acción real.

**Acción del usuario:** crear el proyecto en Vercel. Recomiendo desplegar al
cerrar esta fase: fija `SITE_URL`, activa las previews por PR y permite revisar
desde el móvil en vez de en mi pantalla.

**Pendiente en esta fase:** los enlaces de redes del footer son placeholder
hasta la fase 10 (Q36), y las páginas están vacías a propósito — las rellenan
las fases 4 a 7.

---

## ~~Fase 3 — Los 25 iconos~~ · **COMPLETADA EN LA FASE 1**

Al pasar a los trazados oficiales de Simple Icons (`DEVIATIONS.md`), el trabajo
que justificaba una fase entera se redujo a instalar la librería y dibujar un
único icono (Playwright). Se resolvió dentro de la fase 1, junto con el catálogo
de 25 en código.

**Efecto en el plan:** el camino crítico se acorta una fase. La fase 5 (Home)
deja de depender de esta.

---

## Fase 4 — Contenido y proyectos · **L** · 🔍 EN REVISIÓN (PR #4)
Rama: `feat/projects`

**Prerrequisito cumplido (2026-09-14):** `04-content-model.md`,
`05-pages/projects.md` y `05-pages/project-detail.md` pasan a APROBADA. La OG
dinámica y el JSON-LD del detalle quedan en la fase 8, como ya fijaba este plan.

Content Collections con esquemas Zod (`04-content-model.md`) · 6 proyectos con
Lorem Ipsum y capturas placeholder marcadas · `/projects` · `/projects/[slug]` con
galería en línea · `ProjectNav`.

**Entregable:** galería y detalle navegables en ambos idiomas.

**Cierre real (2026-09-14), pendiente de tu revisión visual:** lint limpio ·
typecheck 0 errores · **81 tests unitarios** (57 + 24 de proyectos y de la guarda
de drafts) · **67 tests E2E** (52 + 15 de galería y detalle) · **63,2 KB gzip** de
los 75 KB · 24 rutas generadas.

Comprobado que el build **falla** con contenido roto: un proyecto sin su versión
en español, una clave de stack que no está en el catálogo, y un despliegue a
producción con todo en draft.

Hallazgos de la implementación, propagados a las specs:

1. **La validación de "exactamente 3 destacados" se saltaba un idioma vacío.**
   Un despliegue a producción con todo en draft habría publicado una galería
   vacía en vez de romper el build. Corregido, con test de regresión que falla
   sin el arreglo.
2. **La guarda de CI no puede ser un `grep draft: true`.** El esquema pone
   `draft` a `true` por defecto, así que un archivo sin el campo también es
   draft. `scripts/check-drafts.mjs` trata el campo ausente como draft.
3. **Hace falta `sharp`.** Es el servicio de imágenes que usa `<Image>` para
   generar AVIF/WebP, como exige este documento. Ya estaba autorizado en
   `pnpm-workspace.yaml` desde la fase 1.

**Nota:** el layout se valida aquí con contenido falso. Al llegar el contenido
real habrá que revisarlo — un Lorem Ipsum no revela si un título largo rompe la
card.

---

## Fase 5 — Home · **M**
Rama: `feat/home`

Hero con boot sequence encadenada + typing · about breve · carrusel con los 25 ·
tres destacados (misma `ProjectCard`) · banda CTA.

Va **después** de las fases 3 y 4 porque depende de los iconos y de la colección
de proyectos.

**Entregable:** la portada completa. Es el momento de juzgar si el conjunto
funciona.

---

## Fase 6 — About y Resume · **M**
Rama: `feat/about-resume`

Colección `experience` · `/about` (bio, foto, skills agrupadas, timeline) ·
`/resume` con el botón de descarga del PDF arriba · hoja de estilos de impresión.

**Acción del usuario:** el PDF del CV, uno por idioma (Q-G).

---

## Fase 7 — Contacto · **M**
Rama: `feat/contact` · ⚠️ **Bloqueada por Q38 y Q41**

`ContactForm` (nombre, correo, mensaje) · esquema Zod compartido cliente/servidor ·
endpoint `POST /api/contact` · integración con Resend · estados de la interfaz ·
enlaces directos como alternativa sin JS.

**Acción del usuario:** crear la cuenta de Resend **con
`developer.daxho@gmail.com`** — el dominio de pruebas solo envía a la dirección de
registro (ADR-0020). Y el filtro de "nunca a spam" en Gmail antes de la primera
prueba.

---

## Fase 8 — SEO y analytics · **M**
Rama: `feat/seo`

Metadatos por página · JSON-LD (`Person`, `CreativeWork`, `BreadcrumbList`) ·
`hreflang` verificado · sitemap y robots · **OG dinámicas por proyecto** generadas
en build · Vercel Web Analytics.

Va al final porque necesita que todas las páginas existan.

---

## Fase 10 — Contenido real · **M** · va ANTES de la fase 9
Rama: `feat/real-content`

Sustitución de todos los placeholders. **Revisión de layout obligatoria**: es
cuando aparecen los desbordes que el Lorem Ipsum ocultaba.

**Acción del usuario:** textos, fotografía, datos y capturas de los 6 proyectos,
redes del footer, formación e idiomas.

Al terminar, **no puede quedar ningún `draft: true`**: la guarda de CI
(`scripts/check-drafts.mjs`) sigue protegiendo cualquier PR hacia `master`, lo
haga quien lo haga.

---

## Fase 9 — Auditoría · **M** · va DESPUÉS de la fase 10
Rama: `feat/audit`

Auditorías completas de `09-testing.md`: Lighthouse en las 4 categorías, contraste
AA en ambos temas, navegación por teclado, `prefers-reduced-motion`, sin JS,
presupuesto de JS del home, verificación de `hreflang` y JSON-LD.

Se ejecuta **sobre el contenido real**: medir Lighthouse, LCP o CLS con capturas
de relleno no dice nada del sitio de verdad, porque una imagen placeholder no pesa
lo que pesa una captura real.

Cierra en `development`, como todas las fases. **Sin merge a `master`**: lo decide
y lo hace el usuario (Q-P).

---

## Regla transversal

Cada fase incluye **sus tests** (`09-testing.md`) y no se da por cerrada sin
cumplir la definición de "hecho". Sin tests, la fase no está terminada.

## Camino crítico

```
F1 ──> F2 ──┬─> F4 ──> F5 ──┐
            ├─> F6 ─────────┼─> F8 ──> F10 ──> F9
            └─> F7 ─────────┘
```

F4, F6 y F7 son independientes entre sí una vez cerrada F2: si en algún momento
se quiere reordenar por disponibilidad de contenido, se puede.
(F3 eliminada: resuelta dentro de F1.)
F10 va antes que F9: la auditoría se hace sobre el contenido real (Q-P).
El plan termina en `development`; `master` lo gestiona el usuario.

## Lo que puede desbloquearse en paralelo desde ya

Acciones del usuario que no dependen de ninguna fase y que conviene ir haciendo:

1. Crear el proyecto en Vercel.
2. Crear la cuenta de Resend con `developer.daxho@gmail.com`.
3. Decidir Q38 (anti-spam) y Q41 (persistencia).
4. Reunir el contenido real: textos, foto, datos y capturas de los proyectos,
   redes, PDF del CV.
