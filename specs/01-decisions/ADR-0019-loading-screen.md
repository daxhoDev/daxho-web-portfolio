# ADR-0019 — Pantalla de carga / secuencia de arranque

**Estado:** APROBADA · 2026-09-09

## Pregunta 1 del usuario: ¿qué se ve mientras corre el script del tema?

**Nada. Literalmente no hay hueco visible.**

El script del tema (ADR-0011) es síncrono y está en `<head>`, antes de cualquier
contenido. La secuencia real es:

1. Llega el HTML.
2. El navegador parsea el `<head>`, encuentra el script, **detiene el parseo**.
3. Ejecuta el script: lee `localStorage`, escribe `data-theme` en `<html>`.
   Duración ~1 ms.
4. Sigue parseando y **pinta por primera vez, ya con el tema correcto**.

El primer píxel que ve el usuario ya sale bien. Hasta ese momento el navegador
sigue mostrando la página anterior (o el fondo del navegador), que es el
comportamiento normal de cualquier navegación. No hay pantalla en blanco atribuible
al script: 1 ms está muy por debajo del umbral de percepción humana (~13 ms).

Ese script **no espera a nada**: ni a las fuentes, ni a las imágenes, ni al JS.
Solo lee una cadena de `localStorage`.

---

## Pregunta 2 del usuario: ¿pantalla de carga hasta que TODO esté disponible?

### Análisis

Se puede hacer, pero "hasta que todo esté disponible" es justo la variante que no
conviene, y por una razón concreta: **este sitio no tiene un problema de carga que
resolver**.

Astro genera HTML estático. El home pinta contenido útil en unos 200-400 ms desde
CDN, con menos de 50 KB de JS (presupuesto de `03-architecture.md`). Un overlay
que espere al evento `load` (fuentes + imágenes + islas hidratadas) **esconde
durante 1-2 s contenido que ya estaba listo a los 300 ms**. Se paga el coste de la
lentitud sin tener la lentitud.

Las pantallas de carga vienen de una época en que la página realmente no era
utilizable hasta que todo llegaba. Aquí el orden es el inverso.

### Costes concretos de la variante (d), la que bloquea hasta el `load`

1. **Rendimiento percibido.** Se retrasa deliberadamente el momento en que el
   visitante puede leer o hacer clic. Es el único coste que de verdad importa.
2. **Métricas.** El FCP pasa a ser el overlay, no el contenido. El riesgo sobre el
   LCP depende de cómo se implemente el overlay, y habría que medirlo en vez de
   suponerlo — pero el objetivo Lighthouse ≥95 (`09-testing.md`) queda en riesgo
   real.
3. **Fallo catastrófico si el JS no carga.** Si el script que retira el overlay
   falla —red intermitente, bloqueador, error de JS— el visitante se queda ante
   una pantalla de carga eterna y **el sitio entero es inaccesible**. Un sitio
   estático que sin JS se lee perfectamente pasaría a no leerse en absoluto. Esto
   contradice la regla 10 de `07-conventions.md`.
4. **Accesibilidad.** Requiere gestionar el foco, `aria-busy`, y evitar que un
   lector de pantalla lea el contenido de detrás mientras el overlay está activo.
5. **Visitas repetidas.** Ver la misma animación en cada navegación pasa de
   "detalle bonito" a "molestia" muy rápido.

### Lo que sí encaja

Una **secuencia de arranque de terminal** es de las cosas más coherentes que puede
tener este sitio: encaja con el monoespaciado, con el tecleo y con la identidad de
consola. El problema nunca fue la idea, sino atarla al tiempo de carga.

La solución es desacoplarla: la secuencia dura **lo que decide el diseño**, no lo
que tarde la red.

## Opciones

- **(a)** Sin pantalla de carga. Coste 0.
- **(b)** Sin overlay; las secciones entran escalonadas al aparecer en viewport
  (fade). Coste ~0, ya está previsto en ADR-0014. El hero responde tecleando su
  frase: esa es la continuidad narrativa entre las dos piezas.
- **(c)** **Boot sequence acotada**: overlay estilo terminal con duración fija
  (~600-900 ms), que **no espera a ningún evento de carga**, se muestra **solo en
  la primera visita de la sesión** (`sessionStorage`), se puede saltar con clic o
  tecla, y se retira por CSS aunque el JS falle.
- **(d)** Overlay que espera al `load` completo. **Descartada** por los costes
  anteriores.

## Decisión (aprobada)

**(c) combinada con (b).**

Se obtiene el efecto de arranque que da personalidad, se paga menos de un segundo
y solo una vez por sesión, y no se sacrifica ni el rendimiento ni la robustez.

### Requisitos vinculantes

1. **El overlay se retira por animación CSS de duración fija**, no por un
   `addEventListener('load')`. Así, si el JS falla, el overlay desaparece igual y
   el sitio sigue siendo usable. El JS solo se encarga del "saltar" y de marcar
   `sessionStorage`.
2. `<noscript>` con una regla que oculte el overlay: sin JS, ni siquiera se
   muestra. **Incumplido desde la fase 2 hasta el 2026-09-16**: la regla se
   escribió como expresión de Astro dentro de `<style>`, que Astro no evalúa, y
   se servía como CSS inválido. Corregido en la fase 7 con test de regresión.
3. Solo primera visita de la **sesión**. Navegar entre páginas no lo repite.
4. Se salta con clic, `Esc` o cualquier tecla.
5. **No se muestra con `prefers-reduced-motion: reduce`.**
6. El contenido real está en el HTML desde el principio, debajo del overlay:
   los rastreadores y los lectores de pantalla nunca ven una página vacía.
7. `aria-hidden="true"` en el overlay y foco intacto en el contenido.
8. Duración máxima **900 ms**. Por encima de eso, un visitante con prisa se va.
9. Se mide el impacto en Lighthouse antes y después. Si baja de 95, se retira.
