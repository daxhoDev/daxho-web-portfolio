# 09 — Testing y criterios de "hecho"

**Estado:** APROBADA · 2026-09-09
Instrucción explícita del usuario (Q8): *"documenta que vas a testear cada nueva
feature y fix importante"*.

---

## Regla de proceso

1. **Toda funcionalidad nueva se entrega con sus tests en el mismo cambio.** Sin
   tests, la tarea no está terminada.
2. **Todo fix importante incorpora un test de regresión** que falle sin el arreglo
   y pase con él. Se escribe el test *antes* del arreglo, para confirmar que
   reproduce el fallo.
3. Ningún merge con la suite en rojo.
4. Si algo no se ha probado, se dice explícitamente al usuario. No se afirma que
   algo funciona sin haberlo verificado.

## Reparto

**Vitest** — lógica pura, sin navegador:
- utilidades de i18n: `localizePath`, `getLangFromUrl`, `t`, mapa de rutas
- lógica de resolución del tema (`system` → `light`/`dark`)
- validación de los esquemas Zod de contenido
- validación del formulario de contacto (esquema compartido)
- helpers de formato (fechas, orden de proyectos)

**Playwright** — comportamiento real en navegador:
- persistencia del tema entre recargas, en los tres estados
- **ausencia de flash de tema** al cargar (ADR-0011)
- detección de idioma en la primera visita
- **caso crítico:** navegador en español + `localStorage.lang = 'en'` → NO redirige
- ausencia de bucles de redirección
- el selector de idioma lleva a la página equivalente, no al home
- clic en la card fuera de los botones → detalle; clic en botón → su acción
- navegación completa por teclado del header y de las cards
- header ocultable: se esconde al bajar, reaparece al subir y al enfocar
- envío del formulario con la API simulada: éxito y error
- `prefers-reduced-motion` desactiva el movimiento

## Auditorías por cada release a `master`

| Auditoría | Umbral | Herramienta |
|---|---|---|
| Lighthouse Performance | ≥ 95 | CI |
| Lighthouse Accessibility | ≥ 95 | CI |
| Lighthouse Best Practices | ≥ 95 | CI |
| Lighthouse SEO | 100 | CI |
| CLS | 0 | Lighthouse |
| LCP | < 2.0 s | Lighthouse |
| JS del home | < 75 KB gzip | análisis del build |
| Contraste de color | AA en ambos temas | verificación manual |
| Navegación por teclado | completa | verificación manual |
| `hreflang` y JSON-LD | correctos | verificación manual |

Las verificaciones manuales se ejecutan antes de cada merge a `master` y su
resultado se anota en el PR.

## Definición de "hecho"

Una tarea está terminada cuando:

- [ ] Cumple la spec correspondiente en `specs/`.
- [ ] Tiene tests y la suite completa pasa.
- [ ] Lint y `astro check` pasan.
- [ ] Funciona en ambos idiomas.
- [ ] Funciona en ambos temas.
- [ ] Es navegable por teclado.
- [ ] Respeta `prefers-reduced-motion`.
- [ ] No introduce regresión en las métricas de Lighthouse.
- [ ] La spec se ha actualizado si el trabajo cambió alguna decisión.
