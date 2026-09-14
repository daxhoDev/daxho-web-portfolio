# ADR-0014 — Movimiento y efectos de ambiente

**Estado:** APROBADA · 2026-09-09 · §5 sustituida el 2026-09-14 (el glitch se deroga y lo reemplaza el typing, ver `../DEVIATIONS.md`)

## Contexto
El usuario pidió efecto en **todos** los encabezados (Q24) —originalmente
glitch, derogado el 2026-09-14 en favor del typing—, typing en **todo** el hero
(Q25) y preguntó si se pueden tener **todos** los efectos de ambiente (Q27):
cursor personalizado, grain, ruido de fondo, partículas y línea de terminal.

Esto entra en tensión directa con dos reglas ya aprobadas: Lighthouse ≥95 y WCAG
2.2 AA (`09-testing.md`), y con el principio 1 de `00-vision.md` (la legibilidad
gana a la estética).

## Coste real de cada efecto

| Efecto | Coste | Problema |
|---|---|---|
| Grain / ruido estático | muy bajo | ninguno si es overlay CSS/SVG sin animar |
| Línea de terminal | muy bajo | ninguno; muy alineado con la marca |
| Cursor personalizado | medio | inservible en táctil, listener en cada `mousemove`, riesgo de accesibilidad |
| Partículas animadas | **alto** | canvas + `requestAnimationFrame` permanente: CPU y batería constantes; el peor infractor en móvil |

## Decisión (aprobada)

1. **Grain estático** — sí. Overlay CSS/SVG, sin animación, coste despreciable.
2. **Línea de terminal** — sí. Barata y coherente con la identidad.
3. **Cursor personalizado** — sí, pero solo bajo `@media (pointer: fine)`, y sin
   ocultar nunca el cursor nativo por completo (accesibilidad).
4. **Partículas animadas** — **descartar**. Sustituir por una retícula o scanlines
   estáticas con parallax muy sutil ligado al scroll: misma sensación, coste
   cercano a cero.

5. **Typing en los encabezados** — sustituye al glitch desde el 2026-09-14
   (`DEVIATIONS.md`). Se respeta la petición original de Q24 de que **todos** los
   encabezados lleven efecto; lo que cambia es cuál. Requisitos vinculantes:

   - **Disparado al entrar en viewport, una sola vez.** Un encabezado que se
     teclea al cargar la página termina de escribirse sin que nadie lo vea si
     está bajo el pliegue: el efecto se perdería en todas las páginas largas.
   - **No se repite con hover ni con foco.** Un encabezado que se reescribe al
     pasar el ratón se lee como un fallo de render, no como una intención de
     diseño. El foco se marca con el anillo de siempre, que es lo que pide WCAG.
   - **Cursor efímero.** El cursor `▮` acompaña al tecleo y se apaga con la
     última letra. El cursor permanente se reserva al hero, que es la marca
     (`12-brand.md`): uno por encabezado dejaría varios elementos parpadeando a
     la vez en la misma pantalla.
   - **CLS = 0.** Cada carácter ocupa su espacio desde el primer render aunque
     sea invisible; solo se anima `opacity`.
   - **Texto completo en el HTML** desde el primer render, con la versión
     partida en caracteres `aria-hidden` y el texto íntegro en un nodo `sr-only`.
     Sin eso un lector de pantalla podría deletrear la frase.

   **Mecanismo:** CSS puro para la animación (un `animation-delay` por carácter,
   cero JavaScript) más un `IntersectionObserver` de unos cientos de bytes para
   el disparo. El observador es **mejora progresiva**: marca `<html>` de forma
   síncrona antes del primer pintado para que el CSS pueda dejar el tecleo en
   pausa, y si no llega a ejecutarse el tecleo arranca con la carga y el texto se
   ve igual. **Nunca queda invisible por falta de JavaScript.**

   Bajo `prefers-reduced-motion` el observador **ni se instala**.

6. **Typing en el hero** — sí, sobre el hero completo. Es el mismo componente
   que el de los encabezados, con dos diferencias: arranca con la carga (está
   sobre el pliegue y encadena con la boot sequence de ADR-0019) y su cursor es
   permanente, porque ahí el cursor es la marca. Requisitos vinculantes:
   - El texto final debe estar en el HTML desde el primer momento (para SEO y para
     lectores de pantalla); la animación oculta y revela, no inyecta.
   - El contenedor debe reservar su altura final desde el inicio, para que el texto
     que sigue no salte (CLS = 0).
   - Duración total acotada: el visitante no debe esperar a que termine para
     entender de qué va el sitio.

## Regla transversal e innegociable
Bajo `prefers-reduced-motion: reduce`, **todo** lo anterior se desactiva: sin
typing (el texto aparece completo de inmediato y sin cursor en los encabezados),
sin parallax, sin cursor personalizado. El grain estático puede permanecer por no
implicar movimiento.
