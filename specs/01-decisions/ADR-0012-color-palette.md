# ADR-0012 — Paleta: rojo sangre #8A0303 sobre grises fríos

**Estado:** APROBADA (con matiz técnico obligatorio) · 2026-09-09

## Decisión
- Acento: **rojo sangre profundo, base `#8A0303`** (opción (a) elegida por el
  usuario).
- Neutros: grises con una ligera temperatura fría (matiz azulado muy bajo en
  saturación), no neutros puros.

## Matiz técnico obligatorio

`#8A0303` **no puede ser el mismo valor en ambos temas**:

- Sobre blanco funciona muy bien: contraste alto, legible para texto.
- Sobre casi-negro **no alcanza AA** (queda en torno a 2:1, muy por debajo del
  4.5:1 exigido). Usarlo para texto o iconografía en tema oscuro sería un fallo de
  accesibilidad directo contra el objetivo fijado en Q42.

Por tanto el acento se define como una **rampa**, y los componentes consumen
**tokens semánticos**, nunca el valor crudo:

- `--color-accent-text` → tono oscuro de la rampa en tema claro, tono claro en
  tema oscuro.
- `--color-accent-surface`, `--color-accent-border`, `--color-accent-glow` →
  pueden conservar el sangre profundo, porque en usos decorativos y de superficie
  el requisito de contraste es menor o no aplica.

La identidad "rojo sangre" se mantiene: el tono profundo sigue siendo el
protagonista en fondos, bordes, glows y elementos gráficos. Solo el texto y los
iconos funcionales cambian de tono en oscuro.

Los valores concretos de la rampa están en `02-design-system.md`, y sus ratios de
contraste deben verificarse con una herramienta real durante la implementación,
no darse por buenos desde la spec.

## Razón de los grises fríos
Un neutro puro se lee como "documento". Un neutro con un punto de azul se lee como
"pantalla" y contrasta mejor con el rojo cálido del acento, reforzando la estética
tecnológica sin recurrir a más colores.
