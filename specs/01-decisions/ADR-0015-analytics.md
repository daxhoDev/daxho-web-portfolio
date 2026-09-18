# ADR-0015 — Analytics: Vercel Web Analytics

**Estado:** APROBADA · 2026-09-09

## Contexto
El usuario no ha usado analytics antes. Es un script que registra visitas para
responder: ¿entra alguien?, ¿desde dónde?, ¿qué proyecto miran?, ¿móvil o
escritorio?, ¿de qué fuente vienen?

## Alternativas

| Opción | Coste | Cookies / banner RGPD | Esfuerzo |
|---|---|---|---|
| **Vercel Web Analytics** | gratis hasta ~2.500 eventos/mes | sin cookies → **sin banner** | una línea |
| Plausible / Umami SaaS | ~9 $/mes | sin cookies | medio |
| Umami self-hosted | servidor + BD | sin cookies | alto |
| Google Analytics 4 | gratis | **requiere banner** | medio |
| Ninguno | 0 | — | 0 |

## Decisión (aprobada)
**Vercel Web Analytics.** El despliegue ya es Vercel, se activa con una línea, no
obliga a banner de cookies (lo que ahorra un componente y una fricción de UX
completa) y da la única métrica que un portafolio necesita: si un reclutador entró
y qué proyecto abrió. Google Analytics 4 es desproporcionado y arrastra el banner.

## Consecuencias
- Dependencia `@vercel/analytics`.
- Verificar en Lighthouse que el script no penaliza la puntuación.
- **Solo se monta en producción** (decidido al implementar, el 2026-09-17): en
  desarrollo el paquete carga un script de depuración externo que no mide nada y
  cuya espera desestabilizaba los tests de tiempos.
- Documentar en el sitio que no se usan cookies (nota breve, no banner). **Va en
  el footer**, en una línea junto al copyright (decidido el 2026-09-17):
  - en: "This website does not use cookies"
  - es: "Este sitio web no utiliza cookies"
