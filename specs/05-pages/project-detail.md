# Página: Detalle de proyecto (`/projects/[slug]`)

**Estado:** APROBADA · 2026-09-14 · se construye en la fase 4; SEO en la fase 8

## Generación
Ruta dinámica con `getStaticPaths()` sobre la colección `projects`, para ambos
idiomas. Todas las páginas se prerenderizan.

## Secciones, en orden
1. **Cabecera**: `<h1>` con el nombre, año, rol, estado. Botones "Open project" y
   "View repository" (cada uno solo si existe la URL).
2. **Captura principal**, a ancho completo del contenedor.
3. **Stack**: fila de tecnologías con icono + nombre.
4. **Descripción**: cuerpo MDX. Estructura recomendada — el problema, la solución,
   las decisiones técnicas, lo aprendido.
5. **Galería** de capturas con pie de foto.
6. **Navegación**: proyecto anterior / siguiente, y enlace de vuelta a
   `/projects`. Orden: campo `order`. **Sin vuelta circular**: el primer
   proyecto solo muestra "siguiente" y el último solo "anterior" (decisión del
   usuario, 2026-09-14). En una lista ordenada, que el "anterior" del primero
   fuera el sexto se leería como un error.

## Galería
**Decidido (Q-E): capturas en línea**, cada una envuelta en un `<a>` hacia la
imagen a tamaño completo. Sin lightbox.

Motivo: cero JavaScript, cero gestión de foco atrapado, funciona sin JS y no hay
modal que mantener. Un lightbox exigiría una isla React más y cumplir a mano el
foco, el cierre con `Esc`, el retorno del foco y la navegación por teclado.

## SEO

**Se construye en la fase 8**, como fija `13-roadmap.md`: necesita que todas las
páginas existan. La fase 4 entrega `<title>`, `description` y `hreflang`; la OG
dinámica y el JSON-LD quedan para la fase 8.

- `<title>`: "{título del proyecto} — Daxho"
- `description`: campo `summary`.
- **OG dinámica por proyecto** (ADR-0016), generada en build.
- JSON-LD `CreativeWork` + `BreadcrumbList`.
- `hreflang` entre las dos versiones idiomáticas del mismo `slug`.

## Criterios de aceptación
- [ ] Un `slug` inexistente devuelve la 404 del sitio, no un error de build.
- [ ] Todas las imágenes con `alt` procedente del contenido, nunca autogenerado.
- [ ] La OG dinámica se genera correctamente para los 6 proyectos. *(fase 8)*
- [ ] El primer proyecto no muestra "anterior" y el último no muestra
      "siguiente".
- [ ] Los encabezados del cuerpo MDX empiezan en `<h2>`; el `<h1>` es solo el
      título de la página.
