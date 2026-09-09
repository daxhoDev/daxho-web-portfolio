# ADR-0020 — Servicio de envío del formulario de contacto

**Estado:** APROBADA · 2026-09-09
Sustituye el análisis previo de `OPEN-QUESTIONS.md` Q-H.

## Contexto
Objetivo del usuario, textual: *"solo quiero que el usuario me pueda escribir"*, y
recibirlo en su correo de Google, sin comprar dominio por ahora.

## Aclaración importante sobre el problema original

El bloqueo de Q-H estaba mal planteado por mi parte. El riesgo de spam de un
remitente no verificado afecta al **buzón del destinatario**, y aquí el
destinatario es **una sola persona conocida: el propio Daxho**. Eso cambia el
análisis por completo: puede añadir una regla en Gmail ("nunca enviar a spam" para
ese remitente) y el problema desaparece.

El escenario grave —enviar correo masivo a desconocidos desde un dominio sin
reputación— no es este.

## Opciones

### (a) Resend con remitente `onboarding@resend.dev` → Gmail de Daxho
Resend ofrece un dominio de pruebas que no requiere verificación. Por diseño, ese
remitente **solo puede enviar a la dirección con la que se registró la cuenta**,
que es exactamente el caso de uso: el formulario notifica a Daxho y a nadie más.

- ✅ Conserva la arquitectura ya especificada (ADR-0004): endpoint serverless.
- ✅ Coste 0, sin dominio.
- ✅ Migrar a dominio propio más adelante = cambiar una variable de entorno.
- ⚠️ Imposibilita la autorespuesta al visitante (Q39), porque no se puede escribir
  a terceros desde el dominio de pruebas.
- ⚠️ La restricción exacta debe **verificarse en la documentación vigente de
  Resend** antes de implementar. No se da por buena desde esta spec.

### (b) Nodemailer + SMTP de Gmail con App Password
Se envía a través de la propia cuenta de Google de Daxho.

- ✅ Sin terceros: el correo sale de su cuenta real, con su reputación.
- ✅ Coste 0. Permite autorespuesta.
- ⚠️ Requiere 2FA activo y generar una App Password, que es una credencial con
  acceso SMTP a la cuenta. Hay que tratarla como secreto de producción.
- ⚠️ Google ha ido restringiendo las App Passwords; conviene confirmar que siguen
  disponibles para la cuenta antes de apostar por esta vía.
- ⚠️ Límite de ~500 envíos/día. Irrelevante aquí.

### (c) Servicio de formularios (Web3Forms, Formspree)
El formulario hace POST al servicio y este reenvía a cualquier correo.

- ✅ Sin backend, sin claves en el servidor, funciona con sitio 100% estático.
- ⚠️ Un tercero recibe y almacena **todos** los mensajes.
- ⚠️ Los planes gratuitos limitan envíos y a veces añaden marca del servicio.
- ⚠️ Haría innecesario el endpoint serverless, cambiando ADR-0004.

### (d) Sin formulario, solo enlaces directos
- ✅ Coste 0, cero mantenimiento, cero superficie de ataque.
- ❌ Más fricción para quien quiere escribir. Un formulario convierte mejor que un
  `mailto:`.

## Decisión (aprobada)

**(a) Resend con el dominio de pruebas**, verificando primero la restricción de
destinatario. Es la única opción que no cambia nada de lo ya especificado, no
cuesta dinero, no añade un tercero que lea los mensajes y no exige manejar
credenciales de la cuenta personal de Google.

**(b) como alternativa** si la verificación de (a) resulta negativa.

Consecuencia a aceptar en ambos casos: **la autorespuesta al visitante (Q39) queda
fuera de alcance** mientras no haya dominio propio. Con (a) es imposible; con (b)
es posible pero enviar respuestas automáticas desde una cuenta personal de Gmail
perjudica su reputación.

## Regla de implementación vinculante (aplica a cualquier opción)

- `From:` = el remitente del servicio. **Nunca** el correo del visitante: poner
  ahí una dirección ajena es suplantación, y SPF/DKIM lo marcan como spam.
- `Reply-To:` = el correo del visitante. Así, responder desde Gmail funciona
  directamente. **Este es el detalle que hace útil el formulario.**
- El asunto identifica el origen: `[Portfolio] {asunto}`.
- El cuerpo incluye nombre, correo y mensaje en texto plano legible.
- El contenido del mensaje **nunca** se escribe en los logs.
