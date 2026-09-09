# Página: Contact (`/contact`, `/es/contact`)

**Estado:** BORRADOR — campos y destinatario decididos; anti-spam pendiente
2026-09-09

## Objetivo
Que alguien interesado pueda escribir a Daxho sin salir del sitio.

## Estructura
1. `<h1>` + una frase invitando a escribir.
2. Formulario de contacto (isla React, `client:visible`).
3. Enlaces alternativos: correo directo y redes sociales.

## Formulario — campos (Q37 decidida)

Tres campos, todos obligatorios:

| Campo | Tipo | Validación |
|---|---|---|
| `name` | texto | 2-80 caracteres, sin recortar acentos |
| `email` | email | formato válido; es la dirección a la que se responde |
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
- Si JavaScript falla, debe haber una vía de contacto visible (correo directo).
- Ningún mensaje de error del servidor filtra detalles internos.
- La clave de Resend jamás llega al cliente (ADR-0004).

## Endpoint `POST /api/contact`
- `export const prerender = false`.
- Valida con el esquema compartido.
- Devuelve un JSON con forma estable: `{ ok: boolean, error?: string }`.
- Registra los fallos sin registrar el contenido del mensaje.

## Pendiente antes de implementar
- **Q38** estrategia anti-spam
- **Q41** persistencia de los mensajes (¿solo correo, o además guardar copia?)

Cerradas: Q37 (tres campos), Q39 (autorespuesta fuera de alcance sin dominio
propio, ADR-0020), Q40 (`developer.daxho@gmail.com`).

## Criterios de aceptación
- [ ] El formulario es enteramente usable con teclado.
- [ ] Cada campo tiene su `<label>` asociado; no se usa `placeholder` como
      etiqueta.
- [ ] Los errores se anuncian a lectores de pantalla.
- [ ] El envío correcto muestra confirmación clara y limpia el formulario.
- [ ] Cubierto por test E2E de Playwright con la API simulada.
