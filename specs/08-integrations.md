# 08 — Integraciones y entorno

**Estado:** APROBADA · 2026-09-16 · la consumen las fases 7 (Resend, firewall) y 8 (analytics)

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
- **Restricción verificada el 2026-09-16** en la documentación de Resend
  ([403 Error Using resend.dev Domain](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain)):
  *"You can only send testing emails to your own email address"*. Con otro
  destinatario, la API devuelve 403.
- Se llama a la API REST de Resend con `fetch` desde el endpoint, sin su SDK: una
  sola petición no justifica una dependencia.
- **Requisito operativo bloqueante:** la cuenta de Resend debe registrarse con
  `developer.daxho@gmail.com`. El dominio de pruebas solo envía a la dirección de
  registro de la cuenta; con cualquier otra, el envío falla.
- `Reply-To` = correo del visitante. `From` = nunca el del visitante.
- Autorespuesta al visitante: **fuera de alcance** hasta tener dominio propio.
- El endpoint no registra nunca el contenido del mensaje en los logs.

## Analytics

Vercel Web Analytics — **APROBADA**, ver ADR-0015. Se instala en la fase 8
(`13-roadmap.md`).

## Vercel

- Adapter `@astrojs/vercel`.
- Previews automáticas por PR.
- pnpm como gestor en la configuración del proyecto.
- Las variables de entorno se configuran en el panel de Vercel, por entorno
  (production / preview). Los secretos se leen **en tiempo de ejecución** con
  `astro:env/server`, nunca incrustados en el build.

### Regla del firewall — límite del formulario (Q38)

Se crea **a mano en el panel** (Firewall → Configure → New Rule). No está en el
repositorio, así que esta es su única definición:

| Campo | Valor |
|---|---|
| Nombre | `contact-form-rate-limit` |
| If | Request Path **equals** `/api/contact` **and** Method **equals** `POST` |
| Then | **Rate Limit** · Fixed Window |
| Time Window | **600 s** (10 min) |
| Request Limit | **3** |
| Key | **IP** |
| Action | **Default (429)** |

Plan Hobby: 1 regla de límite por proyecto y 1.000.000 de peticiones incluidas
([WAF Rate Limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)).
Los contadores son por región, que para este volumen es irrelevante.

## Fuentes

Fontsource, autoalojadas. Sin peticiones a dominios de terceros en runtime.

## Política de terceros

**El navegador no hace ninguna petición a un tercero en runtime**, con la única
excepción de Vercel Web Analytics (ADR-0015, aprobada). La llamada a Resend la hace
el servidor, nunca el navegador. Esto se verifica en el pipeline: cualquier
dominio externo en la pestaña de red es un fallo que hay que justificar.
