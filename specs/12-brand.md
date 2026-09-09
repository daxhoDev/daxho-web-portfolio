# 12 — Marca

**Estado:** APROBADA · 2026-09-09 · Resuelve Q-M (opción a).

## Marca denominativa

**"Daxho"** en JetBrains Mono, con un detalle de acento en rojo sangre.

Motivo: un portafolio personal se firma con el nombre. Un símbolo abstracto exige
un reconocimiento previo que todavía no existe, y añadiría un lenguaje visual
nuevo al sistema sin necesidad.

### Variantes a producir
- **Completa** (`size="lg"`) — `>daxho▮`. Header en escritorio.
- **Reducida** (`size="sm"`) — la misma marca a menor tamaño, para espacios
  ajustados.
- **Favicon** — pendiente de derivar en la fase 2.

### Detalle de acento — DECIDIDO (Q-M)

**Prompt + cursor de bloque:** `>daxho▮`

Elegido por el usuario tras compararlos en `/styleguide`. Combina los dos
candidatos más fuertes: el prompt ancla la marca como línea de consola y el
cursor la mantiene viva. Es además lo que encadena con la boot sequence
(ADR-0019) y con el prompt del hero, de modo que el sitio entero habla el mismo
idioma visual.

Reglas vinculantes:
- El parpadeo del cursor se detiene bajo `prefers-reduced-motion`.
- Prompt y cursor usan `--accent-text`, nunca un rojo literal.
- Ambos van `aria-hidden`: el nombre accesible del enlace es solo «daxho».
- El parpadeo es un corte seco entre invisible y opaco (`step-end`), sin estado
  intermedio.

### Uso
- La marca del header **enlaza al home** del idioma activo.
- Es un `<a>` con texto real, no una imagen: legible por buscadores y lectores de
  pantalla.
- En el home, donde ya hay un `<h1>`, la marca **no** es un encabezado.

## Favicon

Derivado de la marca reducida.

Archivos requeridos:
- `favicon.svg` — principal, moderno.
- `favicon.ico` 32×32 — compatibilidad.
- `apple-touch-icon.png` 180×180 — iOS.
- `icon-192.png`, `icon-512.png` + `site.webmanifest`.

### ¿Cambia con el tema?
**Sí, la variante SVG.** Un favicon con `prefers-color-scheme` embebido evita que
la marca desaparezca en la barra de pestañas del tema contrario. Los formatos
raster se generan en la versión que funcione sobre ambos fondos.

## Criterios de aceptación
- [ ] La marca es texto seleccionable, no imagen.
- [ ] Legible a 16px de altura.
- [ ] El favicon se distingue a 16×16 en pestaña clara y oscura.
- [ ] El detalle animado se detiene con `prefers-reduced-motion`.
