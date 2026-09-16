# Página: Contact (`/contact`, `/es/contact`)

**Estado:** APROBADA · 2026-09-16 · se construye en la fase 7

## Objetivo
Que alguien interesado pueda escribir a Daxho sin salir del sitio.

## Estructura
1. `<h1>` + una frase invitando a escribir, en **voz de terminal** (decidido
   2026-09-16), retomando el botón del home que trae hasta aquí:
   - **EN:** `> ready when you are. Tell me about your project.`
   - **ES:** `> listo cuando tú lo estés. Cuéntame tu proyecto.`

   El `>` es decorativo (`aria-hidden`), como en la marca y el home.
2. Formulario de contacto (isla React, `client:visible`), que **funciona también
   sin JavaScript** (ver "Sin JavaScript").
3. Enlaces alternativos: **redes sociales** (`src/content/social.ts`). **El correo
   no se publica** (decidido 2026-09-16): escrito en la página atrae el spam que
   Q38 intenta frenar.

## Sin JavaScript (decidido 2026-09-16)

El formulario es un `<form method="post" action="/api/contact">` real en el HTML
servido. **Mejora progresiva:**
- **Con JavaScript**, la isla intercepta el envío: valida en vivo, envía por
  `fetch` y muestra los estados sin recargar.
- **Sin JavaScript**, el navegador valida lo básico con atributos HTML
  (`required`, `minlength`, `maxlength`, `type="email"`), el navegador envía el
  formulario y el endpoint **redirige** a `/contact/sent` o `/contact/error` en el
  idioma de la página.

Así no hace falta ninguna vía alternativa que exponga el correo.

## Formulario — campos (Q37 decidida)

Tres campos, todos obligatorios:

| Campo | Tipo | Validación |
|---|---|---|
| `name` | texto | 2-80 caracteres, sin recortar acentos |
| `email` | email | formato válido, máximo 254 caracteres; es la dirección a la que se responde |
| `message` | textarea | 10-2000 caracteres |

Sin campo de asunto: el asunto del correo lo genera el sistema como
`[Portfolio] Mensaje de {name}`.

Motivo de dejarlo en tres campos: cada campo extra reduce la conversión, y en un
portafolio el objetivo es que escribir cueste lo mínimo. Nombre, correo y mensaje
es el mínimo funcional.

### Destinatario (Q40 decidida)
`developer.daxho@gmail.com`

**Requisito operativo:** por ADR-0020, el dominio de pruebas de Resend solo puede
enviar a la dirección con la que se registró la cuenta. La cuenta de Resend
**debe crearse con `developer.daxho@gmail.com`**, o el envío fallará.

Recomendación adicional: crear en Gmail un filtro de "nunca enviar a spam" para el
remitente de Resend, antes de la primera prueba real.

### Reglas vinculantes (independientes de lo pendiente)
- Validación **en cliente y en servidor**. La del cliente es comodidad; la del
  servidor es la que cuenta.
- Esquema Zod compartido entre ambos lados: una única definición.
- Estados de la interfaz: reposo, validando, enviando, éxito, error.
- Los errores se asocian al campo con `aria-describedby` y se anuncian en una
  región `aria-live`.
- El botón de envío se deshabilita mientras se envía, con texto que lo explique.
- Si JavaScript falla, el formulario sigue funcionando como HTML normal (ver "Sin
  JavaScript"). No se publica el correo como alternativa.
- Ningún mensaje de error del servidor filtra detalles internos.
- La clave de Resend jamás llega al cliente (ADR-0004).

## Endpoint `POST /api/contact`
- `export const prerender = false`.
- Valida con el esquema compartido.
- **Petición JSON** (la isla, con JavaScript): devuelve un JSON con forma estable
  `{ ok: boolean, error?: string, fields?: {...} }`.
- **Petición de formulario** (sin JavaScript): responde con una redirección 303 a
  `/contact/sent` o `/contact/error` (o sus equivalentes en `/es`).
- Honeypot relleno: responde **éxito** en ambos formatos, sin enviar nada.
- Asunto del correo: `[Portfolio] Mensaje de {name}`. `From` = remitente de Resend;
  `Reply-To` = correo del visitante (ADR-0020).
- Registra los fallos sin registrar el contenido del mensaje.

## Páginas de resultado

`/contact/sent` y `/contact/error`, en ambos idiomas. Solo las ve quien envía sin
JavaScript. Llevan `noindex`, no van al sitemap y ofrecen volver al formulario o
al inicio.

## Anti-spam (Q38 decidida: honeypot + límite por IP)

**Honeypot.** El formulario lleva un campo extra (`website`) fuera de la pantalla
por CSS, que una persona nunca ve y un bot genérico rellena al leer el HTML.
- `aria-hidden="true"`, `tabindex="-1"` y `autocomplete="off"`: ni un lector de
  pantalla lo anuncia, ni se llega a él con el tabulador, ni lo autocompleta el
  navegador. Sin esto, una persona real podría rellenarlo y perder su mensaje.
- Si llega relleno, el endpoint **responde éxito sin enviar nada**: un error le
  diría a quien programa el bot que hay una trampa.

**Límite de envíos por IP** (decidido 2026-09-16: **regla del firewall de
Vercel**). Acota el daño de un bot dirigido, que el honeypot no frena.
- Regla configurada **en el panel de Vercel**, no en el código: POST a
  `/api/contact`, ventana fija de **10 minutos**, máximo **3 peticiones por IP**,
  acción **429**. Detalle en `08-integrations.md`.
- Es fiable porque el contador lo lleva el firewall, no la función: las
  ejecuciones del endpoint no comparten memoria. Disponible en el plan Hobby
  (1 regla de límite por proyecto).
- **Límites asumidos:** la regla vive fuera del repositorio; en local no hay
  límite (se prueba simulando la respuesta 429); y quien envíe sin JavaScript y
  supere el límite ve la página 429 genérica de Vercel, no una del sitio.

## Persistencia (Q41 decidida: no)

Los mensajes **no se guardan**: el correo es el único registro. Sin base de datos,
sin coste y sin datos personales almacenados que justificar en un aviso de
privacidad. El endpoint tampoco registra el contenido del mensaje en los logs.

Cerradas: Q37 (tres campos), Q38 (honeypot + límite por IP), Q39 (autorespuesta
fuera de alcance sin dominio propio, ADR-0020), Q40 (`developer.daxho@gmail.com`),
Q41 (sin persistencia).

## Criterios de aceptación
- [ ] El formulario es enteramente usable con teclado.
- [ ] Cada campo tiene su `<label>` asociado; no se usa `placeholder` como
      etiqueta.
- [ ] Los errores se anuncian a lectores de pantalla.
- [ ] El envío correcto muestra confirmación clara y limpia el formulario.
- [ ] Cubierto por test E2E de Playwright con la API simulada.
