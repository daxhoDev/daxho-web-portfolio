# 08 — Integraciones y entorno

**Estado:** BORRADOR · 2026-09-09

## Variables de entorno

| Variable | Ámbito | Requerida | Descripción |
|---|---|---|---|
| `SITE_URL` | build | sí | URL canónica. Mientras no haya dominio propio, la de Vercel. Nunca hardcodear (ADR-0004, ADR-0016) |
| `RESEND_API_KEY` | servidor | sí (contacto) | clave de Resend. **Jamás llega al cliente** |
| `CONTACT_TO_EMAIL` | servidor | sí (contacto) | destinatario: `developer.daxho@gmail.com` |
| `CONTACT_FROM_EMAIL` | servidor | sí (contacto) | remitente. Hoy `onboarding@resend.dev` (ADR-0020); cambiará al haber dominio propio |

Reglas:
- Solo las variables con prefijo `PUBLIC_` pueden aparecer en código de cliente.
- Se mantiene un `.env.example` actualizado, sin valores reales.
- `.env` está en `.gitignore`. Una clave commiteada se considera comprometida y se
  rota, no se borra del historial y se olvida.

---

## Resend


- Estrategia aprobada en **ADR-0020**: remitente `onboarding@resend.dev`,
  destinatario `developer.daxho@gmail.com`.
- **Requisito operativo bloqueante:** la cuenta de Resend debe registrarse con
  `developer.daxho@gmail.com`. El dominio de pruebas solo envía a la dirección de
  registro de la cuenta; con cualquier otra, el envío falla.
- `Reply-To` = correo del visitante. `From` = nunca el del visitante.
- Autorespuesta al visitante: **fuera de alcance** hasta tener dominio propio.
- El endpoint no registra nunca el contenido del mensaje en los logs.

## Analytics

Vercel Web Analytics — **PROPUESTA**, ver ADR-0015. Sin aprobar, no se instala.

## Vercel

- Adapter `@astrojs/vercel`.
- Previews automáticas por PR.
- pnpm como gestor en la configuración del proyecto.
- Las variables de entorno se configuran en el panel de Vercel, por entorno
  (production / preview).

## Fuentes

Fontsource, autoalojadas. Sin peticiones a dominios de terceros en runtime.

## Política de terceros

**El sitio no hace ninguna petición a un tercero en runtime**, con la única
excepción de la analítica si se aprueba. Esto se verifica en el pipeline: cualquier
dominio externo en la pestaña de red es un fallo que hay que justificar.
