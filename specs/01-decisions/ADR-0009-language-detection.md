# ADR-0009 — Detección y persistencia del idioma

**Estado:** APROBADA · 2026-09-09

## Decisión
Orden de precedencia, estricto:

1. **`localStorage.lang`** — si existe, manda siempre. Nada lo sobreescribe.
2. **Idioma del navegador** — solo si no hay valor en `localStorage`, y solo en la
   primera visita. Si el navegador prefiere español, se redirige a `/es/...`.
3. **Inglés** — por defecto en cualquier otro caso.

En cuanto se detecta (paso 2) o el usuario elige a mano, el valor se persiste en
`localStorage` y la detección automática **no vuelve a ejecutarse jamás**.

## Reglas de seguridad de la redirección

Sin ellas la redirección automática es una trampa. Son vinculantes:

1. Si `localStorage.lang` existe, **no hay redirección**. Aunque el idioma del
   navegador diga otra cosa.
2. Elegir el idioma manualmente escribe `localStorage.lang` y por tanto desactiva
   la detección para siempre.
3. La redirección solo puede ocurrir **una vez por sesión**; se marca con una
   bandera para eliminar cualquier riesgo de bucle.
4. Nunca se redirige a un usuario que ya está en una URL con prefijo explícito:
   entrar directo a `/es/projects` respeta esa intención.
5. Los rastreadores no deben ser redirigidos: la redirección ocurre en cliente y
   cada página declara sus `hreflang`, de modo que ambos idiomas siguen siendo
   indexables por separado.

## Implementación
Script `is:inline` en `<head>`, mismo mecanismo que el tema (ver ADR-0011), para
que la decisión ocurra antes de pintar y no se vea un fogonazo de contenido en el
idioma equivocado.

## Consecuencias
Es un comportamiento sutil y fácil de romper. Es obligatorio cubrirlo con tests
de Playwright, incluyendo el caso "usuario con navegador en español que eligió
inglés a mano" (ver `09-testing.md`).
