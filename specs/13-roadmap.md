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

## Fase 2 — Esqueleto del sitio · **L** · ✅ COMPLETADA (PR #3)
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

## Fase 4 — Contenido y proyectos · **L** · ✅ COMPLETADA (PR #4)
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

## Fase 5 — Home · **M** · ✅ COMPLETADA (PR #5)
Rama: `feat/home`

**Prerrequisito cumplido (2026-09-16):** `05-pages/home.md` pasa a APROBADA, con
el texto del subtítulo y de la banda CTA, y la forma del hero y su indicador de
scroll.

Hero con boot sequence encadenada + typing · about breve · carrusel con los 25 ·
tres destacados (misma `ProjectCard`) · banda CTA.

Va **después** de la fase 4 porque depende de la colección de proyectos. (Los
iconos, que eran la fase 3, se resolvieron en la fase 1.)

**Entregable:** la portada completa. Es el momento de juzgar si el conjunto
funciona.

**Cierre real (2026-09-16), pendiente de tu revisión visual:** lint limpio ·
typecheck 0 errores · **82 tests unitarios** · **83 tests E2E** (69 + 14 del
home) · **63,2 KB gzip** de los 75 KB, sin JS nuevo: las cuatro secciones son
`.astro` · revisado en escritorio y móvil, en ambos temas e idiomas.

**Riesgo a medir en la fase 9 — LCP.** `home.md` pide LCP < 2,0 s con el texto
del hero como elemento LCP. En una primera visita el titular espera a la boot
sequence (820 ms) y después se teclea (~2,2 s para la frase inglesa), así que los
caracteres terminan de hacerse visibles hacia los 3 s. Cómo cuenta Chrome el LCP
de un texto revelado carácter a carácter no está verificado. Si la medición lo
confirma, las salidas razonables son que cuente el subtítulo, que es estático y
se pinta de inmediato, o acortar el tecleo. No se decide nada sin medir.

---

## Fase 6 — About · **M** · 🔍 EN REVISIÓN
Rama: `feat/about-resume`

**Prerrequisito cumplido (2026-09-16):** `05-pages/about.md` y `05-pages/resume.md`
pasan a APROBADA. Decisiones: PDF de relleno con peso leído del archivo en el
build; experiencia como colección MDX por idioma y formación e idiomas en
archivos TS.

**Cambio de alcance el mismo día:** se elimina `/resume`, que mostraba lo mismo
que `/about`. El botón de descarga del CV va en `/about` tras la entradilla, y
formación e idiomas pasan a `/about`. `resume.md` queda SUPERSEDED y la
navegación pasa a 4 enlaces (`DEVIATIONS.md`).

Colección `experience` · `/about` (bio, foto, botón del CV, skills agrupadas,
timeline, formación, idiomas) · hoja de estilos de impresión.

**Acción del usuario:** el PDF del CV, uno por idioma (Q-G). Hasta la fase 10 hay
uno de relleno: basta con sustituir el archivo.

**Cierre real (2026-09-16), pendiente de tu revisión visual:** lint limpio ·
typecheck 0 errores · **97 tests unitarios** · **95 tests E2E** · **63,2 KB gzip**
de los 75 KB, sin JS nuevo · 22 rutas (las 2 de `/resume` ya no existen).

Comprobado que el build **falla** si falta un PDF del CV o una entrada de
experiencia en español, y revisada la versión impresa generando el PDF con el
navegador: sin cromo, negro sobre blanco y con todos los encabezados visibles.

Hallazgo: **la hoja de impresión no puede fiarse del selector universal.** `*`
no alcanza a los pseudo-elementos, y los nodos de la línea de tiempo y las
viñetas salían en rojo en el papel. Corregido y cubierto por el test de
impresión.

---

## Fase 7 — Contacto · **M** · 🔍 EN REVISIÓN
Rama: `feat/contact`

**Prerrequisito cumplido (2026-09-16):** Q38 (honeypot + límite por IP con una
regla del firewall de Vercel) y Q41 (sin persistencia) resueltas;
`05-pages/contact.md` y `08-integrations.md` pasan a APROBADA. El formulario
funciona sin JavaScript y el correo no se publica.

`ContactForm` (nombre, correo, mensaje) · esquema Zod compartido cliente/servidor ·
endpoint `POST /api/contact` · integración con Resend · estados de la interfaz ·
enlaces directos como alternativa sin JS.

**Acción del usuario:** crear la **regla del firewall** en Vercel
(`08-integrations.md`) y la cuenta de Resend **con
`developer.daxho@gmail.com`** — el dominio de pruebas solo envía a la dirección de
registro (ADR-0020). Y el filtro de "nunca a spam" en Gmail antes de la primera
prueba.

**Cierre real (2026-09-16), pendiente de tu revisión visual:** lint limpio ·
typecheck 0 errores · **112 tests unitarios** (97 + 15 de validación, honeypot,
correo y cliente de Resend) · **110 tests E2E** (95 + 15 de contacto y de la boot
sequence) · home **63,2 KB gzip** sin cambios.

**No verificado:** el envío real por Resend. Necesita tu cuenta y la clave; los
tests simulan la API o solo ejercitan casos que no envían correo (validación,
honeypot). Tampoco la regla del firewall, que se crea en el panel de Vercel.

Hallazgos de la implementación:

1. **La boot sequence se mostraba sin JavaScript desde la fase 2**, incumpliendo
   el requisito 2 de ADR-0019. El `<noscript>` escribía la regla como expresión
   de Astro dentro de `<style>`; Astro no la evalúa y servía CSS inválido.
   Destapado porque tapaba el botón de enviar en el test sin JS. Corregido, con
   test de regresión que falla sin el arreglo.
2. **Astro rechaza con 403 los POST de formulario sin `Origin` del sitio**
   (protección CSRF activa por defecto). Es correcto y se mantiene; los tests
   envían la cabecera como un navegador y uno comprueba el rechazo.
3. **`/contact` pesa 84,9 KB gzip de JS**, 22 KB de ellos del formulario, sobre
   todo por Zod completo en el cliente. El presupuesto de 75 KB rige solo para el
   home, así que no incumple la spec. Queda anotado por si se quiere reducir.

---

## Fase 8 — SEO y analytics · **M** · 🚧 EN CURSO
Rama: `feat/seo`

**Prerrequisito cumplido (2026-09-17):** se cierran las cuatro decisiones que
faltaban y se documentan donde corresponde.

1. **OG con Satori + sharp en build**, no `@vercel/og` en ejecución (ADR-0016).
   Satori no lee `woff2`, así que los TTF de JetBrains Mono entran en
   `src/assets/fonts/` con su licencia, solo para el build.
2. **Base oscura** para las OG (ADR-0016).
3. **Textos de `title` y `description`** de `/projects`, `/contact` y del home
   (provisional hasta la fase 10), aprobados y escritos en la spec de cada
   página. La 404 no lleva `description`: es `noindex`.
4. **La nota de cookies va en el footer**, en una línea (ADR-0015, `06-components.md`).

Metadatos por página · JSON-LD (`Person`, `CreativeWork`, `BreadcrumbList`) ·
`hreflang` verificado · sitemap y robots · **OG dinámicas por proyecto** generadas
en build · Vercel Web Analytics.

Va al final porque necesita que todas las páginas existan.

**Cierre real (2026-09-17), pendiente de tu revisión visual:** lint limpio ·
typecheck 0 errores · **131 tests unitarios** (112 + 19 de SEO, OG y sitemap) ·
**131 tests E2E** (110 + 21 de metadatos, JSON-LD, OG, robots, sitemap, la nota
de cookies y el `<h1>` del HTML servido) · build correcto, con **13 PNG de OG** generados (6 proyectos × 2
idiomas + la genérica) y un sitemap de **20 URL**, las públicas de los dos
idiomas y solo esas.

**JS del home: ~59,7 KB gzip** de los 75 KB. Son 58,4 KB de los cinco bundles de
islas más 1,3 KB del script en línea de la analítica; el `script.js` de Vercel no
cuenta porque lo sirve Vercel, no el build. (La cifra de 63,2 KB que anotaban las
fases anteriores se midió de otra forma: estas dos no son comparables.)

Hallazgos de la implementación:

1. **Satori no lee `woff2`.** Es el único formato que sirve el sitio, así que la
   fase incluye los TTF en `src/assets/fonts/` (ADR-0016). Verificado con el
   error exacto: `Unsupported OpenType signature wOF2`.
2. **El JSON-LD apuntaba a URL sin barra final**, mientras la canónica y el
   sitemap sí la llevan. Para un buscador eran dos páginas distintas.
   `absoluteUrl` normaliza, y respeta los archivos (`.png`, `.txt`), donde la
   barra rompería el enlace.
3. **El contenido `draft` no entra en el JSON-LD.** Un `sameAs` a `#` o una
   universidad de relleno se publicarían como ciertos. Es regla escrita en
   `seo.ts` y cubierta por un test.
4. **Un título con `</script>` cerraría la etiqueta** y volcaría el resto del
   JSON como HTML. `serializeJsonLd` escapa los `<` a `\u003c`, que sigue siendo
   JSON válido. Con test que falla sin el arreglo.
5. **`robots.txt` se genera en el build**, no vive en `public/`: la línea
   `Sitemap:` necesita la URL absoluta, que sale de `SITE_URL`. Y no lleva
   ningún `Disallow`: una página con `noindex` hay que dejarla rastrear para que
   esa etiqueta se lea.
6. **La barra de herramientas de desarrollo de Astro monta sus propios `<h1>`**
   ("Audit", "Settings") dentro de un shadow DOM que los selectores de
   Playwright atraviesan. Los tests de "un solo `<h1>`" de las fases anteriores
   empezaron a ver cuatro sin que la página cambiara. Ahora cuentan dentro de
   `main`, y el `<h1>` del **documento servido** —que es lo que lee un
   rastreador, y no tiene toolbar— lo comprueba `seo.spec.ts` sobre el HTML.
7. **La analítica se monta solo en producción.** En desarrollo el paquete carga
   un `script.debug.js` de un dominio externo que no mide nada, y esa espera
   retrasaba la página lo justo para que la boot sequence terminara antes de que
   el test de tiempos la comprobara. Que el build de producción sí la lleve está
   cubierto por un test sobre el HTML generado.

**Pendiente de la fase 10:** la `description` del home es provisional, y las
redes del footer siguen en placeholder, así que el `Person` aún no publica
`sameAs`. **Pendiente de la fase 9:** medir con Lighthouse, incluido el efecto
del script de analítica.

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

## Fase 11 — Plantillas de correo · **S** · 🕓 PARA MÁS ADELANTE
Rama: `feat/email-templates`

Añadida el 2026-09-16 a petición del usuario, **sin fecha**: se empieza cuando lo
pida. Solo depende de la fase 7, así que puede ir en cualquier momento a partir de
ahí, antes o después de las fases 8, 10 y 9.

**Prerrequisito:** aprobar `14-email.md`. Q-Q ya está resuelta (2026-09-16): base
clara con variante oscura.

Aviso del formulario con React Email siguiendo la estética del sitio (ADR-0022) ·
`EmailLayout` + `ContactNotification` · colores en literales con test contra los
tokens · envío de `html` y `text` · si la plantilla falla, se envía el texto plano.

**Entregable:** un aviso real recibido en Gmail web y en la app móvil, legible en
claro y en oscuro.

**Acción del usuario:** leer ese envío de prueba en los dos clientes y en los dos
modos, que es la verificación que no se puede automatizar.

---

## Regla transversal

Cada fase incluye **sus tests** (`09-testing.md`) y no se da por cerrada sin
cumplir la definición de "hecho". Sin tests, la fase no está terminada.

## Camino crítico

```
F1 ──> F2 ──┬─> F4 ──> F5 ──┐
            ├─> F6 ─────────┼─> F8 ──> F10 ──> F9
            └─> F7 ─────────┘
                    │
                    └─> F11 (sin fecha, cuando el usuario lo pida)
```

F4, F6 y F7 son independientes entre sí una vez cerrada F2: si en algún momento
se quiere reordenar por disponibilidad de contenido, se puede.
(F3 eliminada: resuelta dentro de F1.)
F10 va antes que F9: la auditoría se hace sobre el contenido real (Q-P).
El plan termina en `development`; `master` lo gestiona el usuario.
F11 cuelga solo de F7 y no bloquea ni depende de las demás.

## Lo que puede desbloquearse en paralelo desde ya

Acciones del usuario que no dependen de ninguna fase y que conviene ir haciendo:

1. Crear el proyecto en Vercel.
2. Crear la cuenta de Resend con `developer.daxho@gmail.com`.
3. Reunir el contenido real: textos, foto, datos y capturas de los proyectos,
   redes, PDF del CV.
