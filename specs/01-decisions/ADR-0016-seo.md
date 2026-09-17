# ADR-0016 — SEO

**Estado:** APROBADA · 2026-09-09 · herramienta de las OG cerrada el 2026-09-17

## Decisión
El SEO es un objetivo fuerte del proyecto, no un añadido.

- **URL canónica** desde la variable `SITE_URL`. Nunca hardcodeada: la migración a
  dominio propio debe ser un cambio de configuración (ver ADR-0004).
- **`hreflang`** en todas las páginas, para `en`, `es` y `x-default` → inglés.
- **Sitemap** generado con `@astrojs/sitemap`, incluyendo ambos idiomas.
- **`robots.txt`** apuntando al sitemap.
- **Metadatos por página**: `<title>` y `description` únicos, definidos en la spec
  de cada página, nunca autogenerados por plantilla genérica.
- **Open Graph / Twitter Card** en todas las páginas.
- **Imágenes OG dinámicas por proyecto**, generadas en build con **Satori +
  sharp** (decidido el 2026-09-17): Satori dibuja el SVG y sharp —que ya está en
  el proyecto para `<Image>`— lo convierte a PNG. Se descarta `@vercel/og`, que
  genera en tiempo de ejecución y añadiría una función al sitio estático.
  Contenido: título del proyecto, stack y la identidad visual del sitio. Imagen
  genérica para las rutas no-proyecto.
- **Las OG se dibujan sobre la base oscura** (`#08090b`), la piel de terminal del
  sitio: es lo que hace reconocible el acento rojo sobre el fondo claro de
  cualquier timeline (decidido el 2026-09-17).
- **Satori no lee `woff2`**, que es el único formato que sirve el sitio. Por eso
  `src/assets/fonts/` guarda `JetBrainsMono-Regular.ttf` y `-Bold.ttf` con su
  licencia OFL: se leen **solo en el build** y ningún visitante los descarga.
- **JSON-LD**: `Person` en el home y en `/about`; `CreativeWork` o
  `SoftwareApplication` en cada detalle de proyecto; `BreadcrumbList` donde aplique.
- **Semántica**: un solo `<h1>` por página, jerarquía de encabezados sin saltos,
  `<main>`, `<nav>`, `<footer>` correctos.
- **Imágenes**: componente `<Image>` de Astro, `alt` obligatorio y descriptivo,
  dimensiones explícitas.

## Nota sobre el dominio
Mientras se use la URL de Vercel, el posicionamiento estará limitado por la falta
de dominio propio y de historial. Esto no cambia ninguna de las reglas anteriores:
el trabajo hecho ahora se capitaliza el día que se migre el dominio.

## Verificación
El SEO forma parte de los criterios de aceptación: la categoría SEO de Lighthouse
debe estar en 100, y la auditoría manual de `hreflang` y JSON-LD se ejecuta en la
fase 9 (`09-testing.md`).
