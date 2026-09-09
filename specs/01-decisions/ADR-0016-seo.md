# ADR-0016 — SEO

**Estado:** APROBADA · 2026-09-09

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
- **Imágenes OG dinámicas por proyecto**, generadas en build (Satori / `@vercel/og`
  o equivalente): título del proyecto, stack y la identidad visual del sitio.
  Página genérica para las rutas no-proyecto.
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
debe estar en 100, y la auditoría manual de `hreflang` y JSON-LD se ejecuta antes
de cada merge a `master`.
