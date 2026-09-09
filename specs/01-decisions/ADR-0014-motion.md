# ADR-0014 — Movimiento y efectos de ambiente

**Estado:** APROBADA · 2026-09-09

## Contexto
El usuario pidió glitch en **todos** los encabezados (Q24), typing en **todo** el
hero (Q25) y preguntó si se pueden tener **todos** los efectos de ambiente (Q27):
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

5. **Glitch en encabezados** — respetando la petición de tenerlo en todos, pero
   **disparado**, no en bucle: se ejecuta una vez al entrar en viewport y de nuevo
   al hacer hover o al recibir foco. Un `<h2>` vibrando permanentemente es
   ilegible, distrae de la lectura y arriesga CLS.
   El glitch no altera el espacio ocupado por el texto (solo `transform` y capas
   superpuestas, nunca cambios de layout): CLS = 0.

   **Mecanismo (actualizado):** librería **PowerGlitch**, no CSS puro. Ver
   `DEVIATIONS.md`. Configuración vinculante:
   - `playMode: 'manual'` — el disparo lo controlamos nosotros, nunca `always`.
   - `slice.hueRotate: false` — la rotación de tono produciría verdes y azules,
     ajenos a la paleta. Las capas se tiñen desde CSS con rojos de la rampa
     Blood.
   - Los clones que genera la librería se marcan `aria-hidden`.
   - Bajo `prefers-reduced-motion` **no se inicializa**.
   - La deformación de las letras (cizalla y estiramiento) la aporta CSS:
     PowerGlitch solo desplaza rebanadas.

6. **Typing en el hero** — sí, sobre el hero completo. Requisitos vinculantes:
   - El texto final debe estar en el HTML desde el primer momento (para SEO y para
     lectores de pantalla); la animación oculta y revela, no inyecta.
   - El contenedor debe reservar su altura final desde el inicio, para que el texto
     que sigue no salte (CLS = 0).
   - Duración total acotada: el visitante no debe esperar a que termine para
     entender de qué va el sitio.

## Regla transversal e innegociable
Bajo `prefers-reduced-motion: reduce`, **todo** lo anterior se desactiva: sin
glitch, sin typing (el texto aparece completo de inmediato), sin parallax, sin
cursor personalizado. El grain estático puede permanecer por no implicar
movimiento.
