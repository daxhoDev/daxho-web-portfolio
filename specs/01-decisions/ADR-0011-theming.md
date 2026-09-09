# ADR-0011 — Tema: sistema en primera visita, tres estados, script inline

**Estado:** APROBADA · 2026-09-09

## Decisión
- Tres estados: `light`, `dark`, `system`.
- Valor inicial: `system` — se respeta `prefers-color-scheme` del usuario.
- Al cambiarlo manualmente se persiste en `localStorage.theme`; a partir de ahí
  esa elección manda.
- Elegir `system` explícitamente vuelve a seguir al sistema operativo, en vivo
  (se escucha el cambio de `matchMedia`).
- El tema se expresa como `data-theme="light|dark"` en `<html>`. `system` nunca se
  escribe en el DOM: se resuelve a uno de los dos valores reales.

## Prevención del flash (FOUC)

El HTML se genera en el build, cuando `localStorage` no existe. Sin precaución, el
navegador pinta con el tema por defecto y repinta al hidratar: fogonazo blanco de
100-300 ms, especialmente feo en un sitio de estética oscura.

Solución vinculante: script **síncrono** `is:inline` en `<head>`, antes de
cualquier contenido, que lee `localStorage` (o `matchMedia` si no hay valor) y fija
`data-theme` en `<html>`. El navegador detiene el parseo, lo ejecuta y solo
entonces continúa, así que el primer píxel ya sale con el tema correcto. Coste
~1 ms.

Requisitos:
- Debe ser `is:inline`; sin esa directiva Astro lo empaqueta y lo difiere,
  perdiendo justo la propiedad síncrona que se necesita.
- Debe mantenerse mínimo (~400 bytes) y sin dependencias.
- Se declara `color-scheme` en CSS para que scrollbars, controles nativos y
  autocompletado del navegador acompañen al tema.

## Consecuencias
- Es el único script que se permite bloquear el render.
- El toggle es una isla React; debe reflejar el estado real leído del DOM al
  hidratarse, no un valor por defecto.
- Cubierto por tests de Playwright, incluida la ausencia de flash.
