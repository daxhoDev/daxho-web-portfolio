# 11 — Ruta `/styleguide`

**Estado:** APROBADA · 2026-09-09 · Ver ADR-0021.

Primer incremento de implementación del proyecto. **Es código real**, no una fase
previa al código: construye el sistema de diseño sobre el que se montarán después
todas las páginas.

## Propósito

Que el usuario pueda **ver y aprobar el sistema de diseño en el navegador**, en
ambos temas y con las animaciones funcionando, antes de que se construya ninguna
página. Lo que un mockup no puede mostrar —typing, carrusel, cambio de
tema, responsive real— aquí se ve tal cual será.

Beneficio secundario: se convierte en el objetivo natural de los tests visuales de
Playwright y en documentación viva del sistema.

## Alcance del incremento

### Incluye
1. Proyecto Astro inicializado: pnpm, TypeScript strict, alias `@/*`, Tailwind v4,
   ESLint + Prettier, adapter de Vercel.
2. Fuentes autoalojadas (JetBrains Mono, Inter) vía Fontsource.
3. Tokens de `02-design-system.md` declarados en `@theme`: rampas Blood e Ink,
   tokens semánticos de ambos temas.
4. Script inline del tema (ADR-0011) y `ThemeToggle` de tres estados.
5. Primitivos de `06-components.md` §`ui/`: `Button`, `Chip`, `Card`,
   `SectionHeading`, `Icon`, `Container`.
6. Efectos de ADR-0014: typing disparado por viewport en los encabezados, typing
   del hero disparado por carga, grain estático.
7. Carrusel de tecnologías en CSS puro, con la hoja de calibración de iconos
   (3 iconos: `vercel`, `react`, `postgresql`).
8. `ProjectCard` con datos de relleno, incluido el patrón de enlace con área
   extendida.
9. La página `/styleguide` que lo muestra todo.

### NO incluye
Páginas del sitio, i18n, colecciones de contenido, endpoint de correo, imágenes
OG, sitemap, los 25 iconos completos, analytics.

## Contenido de la página

1. **Color** — ambas rampas, tokens semánticos, y el ratio de contraste real medido
   de cada combinación de texto sobre fondo. Es el punto crítico: aquí se valida
   que el acento funciona en los dos temas (ADR-0012).
2. **Tipografía** — escala completa con ambas familias, en ambos temas.
3. **Espaciado y radios** — muestra de la escala.
4. **Primitivos** — cada componente en todos sus estados: reposo, hover, foco,
   activo, deshabilitado.
5. **Movimiento** — typing, grain y carrusel, con un botón que simule
   `prefers-reduced-motion` para comprobar la desactivación.
6. **ProjectCard** — con datos de relleno.

## Reglas

- Ruta **excluida del sitemap** y con `noindex`.
- **Excluida del build de producción** o protegida; no forma parte del sitio
  público.
- Consume exclusivamente tokens semánticos: si un color literal aparece aquí, el
  sistema está mal montado.
- Se mantiene viva: todo primitivo nuevo se añade a esta página.

## Criterios de aceptación

- [ ] Todos los ratios de contraste mostrados cumplen AA en **ambos** temas.
- [ ] El cambio de tema no produce flash.
- [ ] El simulador de `prefers-reduced-motion` desactiva todo el movimiento.
- [ ] Los tres iconos de calibración tienen peso visual homogéneo.
- [ ] Cero colores literales en el código de los componentes.
- [ ] Navegable por teclado, con anillo de foco visible en todo interactivo.
