# ADR-0018 — Iconografía de tecnologías dibujada a mano

**Estado:** APROBADA · 2026-09-09 · **REVISADA tras la fase 1**
Resuelve `OPEN-QUESTIONS.md` Q-A.

## Contexto
El requisito pide iconos de tecnologías **monocromáticos en lineart**. No existe
ningún set público que cumpla eso de forma consistente: Simple Icons son siluetas
sólidas, Lucide/Tabler no incluyen logos de marcas, y Devicon-line tiene cobertura
parcial y grosores de trazo desiguales.

## Decisión original (SUPERSEDED)
~~Todos los iconos de tecnologías se dibujan a mano, uno por archivo.~~

Se intentó en la fase 1 y falló en el peor caso previsto: el elefante de
PostgreSQL resultó irreconocible a 24px, tal y como esta misma ADR advertía. La
predicción era correcta y la decisión que la acompañaba, equivocada.

## Decisión vigente (revisada 2026-09-09)

**Librería primero, dibujo a mano solo para los huecos, y siluetas sólidas.**

1. Los iconos de tecnología usan los **trazados oficiales de Simple Icons**,
   renderizados como **silueta sólida** (`fill: currentColor`).
2. Solo se dibuja a mano lo que la librería no tenga. Hoy: **Playwright**, y
   nada más de las 25.
3. Todo se consume a través de `src/components/icons/tech/TechIcon.astro`, que
   resuelve por clave del catálogo y **falla el build** si la tecnología no
   existe.
4. Los iconos de **interfaz** (no de marca) siguen siendo lineart con la
   especificación de abajo.

Ver `DEVIATIONS.md` para el razonamiento completo y para la renuncia al lineart
en las marcas.

## Especificación técnica del LINEART (iconos de interfaz)

```
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="1.5"
stroke-linecap="round"
stroke-linejoin="round"
```

Reglas adicionales:
- **`currentColor` siempre.** Es lo que permite que el mismo archivo funcione en
  ambos temas y adopte el color de acento sin duplicar assets.
- Sin `fill` de color, sin degradados, sin `<style>` embebido, sin `id` (los `id`
  colisionan cuando varios SVG conviven en la misma página).
- Área de dibujo útil: 20×20 dentro del `viewBox` de 24, dejando 2 de margen. Así
  todos los iconos se ven ópticamente del mismo tamaño al alinearse en el
  carrusel.
- Peso visual homogéneo: un icono con muchos trazos finos junto a uno de dos
  trazos gruesos rompe la fila. El criterio de aceptación es la coherencia del
  conjunto, no la fidelidad individual.
- Optimizados con SVGO antes de commitear.

## Organización

```
src/components/icons/tech/
├── react.astro
├── typescript.astro
├── astro.astro
└── ...
```

- Un archivo por icono, nombrado con la `key` del catálogo de tecnologías
  (`04-content-model.md`), en kebab-case.
- Cada icono se registra en el catálogo; un icono sin entrada en el catálogo, o
  una entrada sin icono, hace fallar el build.
- Componentes Astro (no `.svg` sueltos) para que el icono se inserte en línea en
  el HTML: sin petición de red adicional y con `currentColor` operativo.

## Accesibilidad
- Decorativo → `aria-hidden="true"`.
- Con significado → `role="img"` y `<title>` con el nombre de la tecnología.

## Nota sobre marcas
Redibujar un logo en lineart altera la marca original. Usar logos de tecnologías
para identificar el stack con el que se trabaja es uso nominativo habitual y
aceptado en portafolios, pero conviene saber que algunas marcas piden no modificar
su logotipo. Riesgo práctico: nulo en este contexto. Se deja anotado.

## Resultado
El catálogo de 25 quedó cubierto en la propia fase 1: 24 de Simple Icons y
Playwright dibujado a mano. La fase 3 del roadmap, prevista para dibujar 25
iconos, deja de tener contenido.
