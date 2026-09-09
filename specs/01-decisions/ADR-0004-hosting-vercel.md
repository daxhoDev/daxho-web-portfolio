# ADR-0004 — Hosting en Vercel; output static con endpoint SSR

**Estado:** APROBADA · 2026-09-09

## Contexto
El formulario de contacto debe enviar correo mediante Resend. La API key de Resend
**no puede** viajar al navegador, así que hace falta ejecución en servidor. Un sitio
100% estático no puede hacerlo.

## Decisión
- Hosting: **Vercel**, con `@astrojs/vercel`.
- `output: 'static'` como modo general: todas las páginas se prerenderizan en el
  build.
- Excepción única: el endpoint `POST /api/contact`, marcado con
  `export const prerender = false`, que se despliega como función serverless.

## Razones
- Todo el sitio conserva las ventajas de estático (velocidad, coste, cacheado en
  CDN) y solo el envío de correo paga el precio del servidor.
- Vercel: adapter oficial maduro, previews por PR, analytics integrado
  (ver ADR-0015), plan gratuito suficiente.

## Dominio
No hay dominio propio. Se usa la URL asignada por Vercel y se prevé que sea así
durante un tiempo largo. Implicación para SEO: la URL canónica debe leerse de una
variable de entorno (`SITE_URL`), **nunca** hardcodearse, para que el cambio a
dominio propio sea un cambio de configuración y no una búsqueda y reemplazo.

## Consecuencias
- Se requiere `RESEND_API_KEY` como variable de entorno en Vercel (ver
  `08-integrations.md`).
- El endpoint es la única superficie de ataque del sitio: necesita validación y
  anti-spam (pendiente, ver `OPEN-QUESTIONS.md`).
