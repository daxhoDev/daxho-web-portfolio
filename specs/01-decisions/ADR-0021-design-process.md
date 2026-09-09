# ADR-0021 — Proceso de diseño: ¿mockups antes de implementar?

**Estado:** APROBADA · 2026-09-09
Corresponde a `OPEN-QUESTIONS.md` Q-F.

## Contexto
Pregunta del usuario: qué tan viable es hacer mockups en Figma antes de codear.
Hay un servidor MCP de Figma disponible en la sesión.

## Viabilidad técnica
Alta. El MCP de Figma permite crear archivos y generar diseños a partir de
intención o de código existente, además de leer diseños ya hechos para
convertirlos en código.

**Pero la viabilidad técnica no es el criterio decisivo.** La pregunta real es si
aporta más de lo que cuesta en este proyecto concreto.

## Análisis

Lo que un mockup de Figma sí resuelve bien: composición, jerarquía visual,
espaciado, densidad y una vista rápida de varias alternativas de layout antes de
comprometerse.

Lo que **no** puede mostrar, y que es precisamente lo que define a este sitio:
- el glitch en los encabezados,
- el typing del hero,
- el desplazamiento del carrusel infinito,
- el header que se oculta al bajar,
- el comportamiento responsive real,
- el cambio entre tema claro y oscuro.

Es decir: Figma capturaría el esqueleto y dejaría fuera el carácter. Y como el
sistema de diseño ya está definido en tokens (`02-design-system.md`), buena parte
del trabajo que normalmente se hace en Figma ya está hecho, solo que en forma de
tabla en vez de lienzo.

Coste añadido: mantener sincronizados dos artefactos. En cuanto el código se
aparte del mockup —y siempre se aparta— aparece la pregunta de cuál manda, que es
justo el tipo de ambigüedad que `AGENTS.md` existe para evitar.

## Opciones

- **(a)** Directo a código, iterando en el navegador.
- **(b)** Mockups completos en Figma antes de implementar.
- **(c)** **Ruta `/styleguide` dentro del propio proyecto**: una página real,
  excluida del sitemap y de producción, que muestre la paleta en ambos temas, la
  escala tipográfica, los botones en todos sus estados, la card de proyecto, y los
  efectos de movimiento en vivo.

## Decisión (aprobada)

**(c).**

### Corrección importante (planteada por el usuario)
El usuario señaló, con razón, que el styleguide **es implementar**: es código real
que se queda en el repositorio. La comparación original con Figma era engañosa,
porque comparaba un artefacto no-código con uno de código.

La distinción correcta no es el medio, sino el **alcance y el orden**:
`/styleguide` construye el sistema de diseño (tokens y primitivos) sin construir
ninguna página. Es aproximadamente el primer 15% del trabajo, y es aquel del que
depende todo lo demás.

Queda registrado que `/styleguide` es el **primer incremento de implementación**
del proyecto, no una fase previa. Su alcance está acotado en `11-styleguide.md` y
fue aprobado explícitamente por el usuario.

Da lo mismo que un mockup —ver el sistema completo antes de montar las páginas—
pero en el navegador, con el código real, en ambos temas y con las animaciones
funcionando. No hay divergencia posible entre diseño y código porque son la misma
cosa.

Además tiene dos beneficios que un Figma no da:
1. Se convierte en el objetivo natural de los tests visuales de Playwright.
2. Sirve de documentación viva para el resto del proyecto.

Coste: una tarde, y no se tira. Un mockup de Figma se abandona en cuanto empieza
la implementación.

## Alternativa intermedia
Si el usuario prefiere ver algo antes de que exista código, se puede hacer **un
solo artboard** en Figma: el home en escritorio. Sirve para validar composición y
jerarquía sin construir un sistema de diseño paralelo. A partir de ahí, (c).
