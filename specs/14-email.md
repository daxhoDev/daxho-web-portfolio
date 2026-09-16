# 14 — Plantillas de correo

**Estado:** BORRADOR · 2026-09-16 · Q-Q resuelta; se aprueba antes de la fase 11

Implementa ADR-0022. Hasta la fase 11, el aviso sigue en texto plano (ADR-0020).

---

## Alcance

**Una plantilla:** el aviso que recibe Daxho cuando alguien usa el formulario
(`05-pages/contact.md`). **El único destinatario es Daxho**: la autorespuesta al
visitante sigue fuera de alcance sin dominio propio (Q39, ADR-0020).

Fuera de alcance: autorespuesta, correos de marketing y cualquier envío a
terceros.

## Estructura

```
src/emails/
├── components/
│   └── EmailLayout.tsx          (marco común: cabecera con la marca, pie)
├── ContactNotification.tsx      (el aviso del formulario)
└── theme.ts                     (colores y pilas de fuentes, en literales)
```

`src/emails/` queda fuera de `src/components/`: no son componentes del sitio y
nunca llegan al navegador.

## Contenido de `ContactNotification`

En orden:

1. **Cabecera:** la marca `>daxho▮` en texto (no imagen), con prompt y cursor en
   el color de acento. El cursor es un bloque **estático**: en correo no hay
   animación.
2. **Título:** `> nuevo mensaje`, en monoespaciada.
3. **Datos:** nombre y correo del visitante, este último como enlace `mailto:`.
   Idioma de la página desde la que escribió (EN/ES).
4. **Mensaje:** en un bloque de superficie hundida, **conservando los saltos de
   línea** tal como los escribió el visitante.
5. **Botón "Responder"**, que abre un correo al visitante. Responder desde Gmail
   ya funciona por `Reply-To`; el botón es un atajo visible.
6. **Pie:** "Enviado desde el formulario de contacto de {SITE_URL}", en texto
   atenuado.

Idioma del correo: **español**, el de Daxho. El asunto no cambia:
`[Portfolio] Mensaje de {name}`.

## Estética: traducción del sitio al correo

Los clientes de correo no soportan lo mismo que un navegador. La regla es
**conservar la identidad** (monoespaciada, rojo sangre, prompt y cursor, grises
fríos) y **renunciar a lo que no llega**:

| En el sitio | En el correo | Motivo |
|---|---|---|
| Variables CSS de `tokens.css` | Hex literales en `src/emails/theme.ts`, con un test que los compara con los tokens | Gmail no soporta variables CSS; el test evita que se desincronicen |
| JetBrains Mono e Inter autoalojadas | Pilas de fuentes del sistema: `ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace` y `-apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` | Gmail no carga fuentes web; se usan las mismas alternativas que ya declaran los tokens |
| Grain, typing, parpadeo | Nada | Sin animación ni fondos por imagen en correo |
| `rem` | `px` (`pixelBasedPreset` de React Email) | Algunos clientes no soportan `rem` |
| Tema claro y oscuro | **Base clara + variante oscura por `prefers-color-scheme`** (Q-Q) | Ver abajo |

**Estilos:** componente `Tailwind` de React Email con la configuración de colores
de `theme.ts`, o estilos en línea. Sin utilidades que dependan de selectores
complejos (`space-*`) ni de `hover`, que los clientes no soportan.

### Tema: base clara con variante oscura (Q-Q decidida, 2026-09-16)

- **Base clara**, la que ve cualquier cliente: fondo `#fafbfc`, superficie
  `#ffffff`, bloque del mensaje `#dfe3e8`, texto `#0e1013`, texto secundario
  `#333841`, acento `#8a0303`, botón `#8a0303` con texto `#ffffff`.
- **Variante oscura** por `@media (prefers-color-scheme: dark)`, en los clientes
  que la respetan: fondo `#08090b`, superficie `#0e1013`, bloque del mensaje
  `#1a1d22`, texto `#f0f2f5`, texto secundario `#949ba6`, acento `#f04747`,
  botón `#6e0404` con texto `#f0f2f5`.
- Son exactamente los pares de `tokens.css`, ya verificados en AA para ambos
  temas (`02-design-system.md` §2.4), y el test de `theme.ts` lo garantiza.
- **Los clientes que invierten colores** (Gmail en iOS y Android) aplican su
  algoritmo sobre la base clara, que es lo que esperan. Se acepta que ahí el
  resultado lo decide el cliente; se revisa en la verificación manual.
- La media query no se puede poner en línea: React Email la deja en un `<style>`
  del documento (limitación documentada de su componente `Tailwind`).

## Seguridad

- **Todo el texto del visitante se escapa.** React lo hace por defecto; está
  **prohibido** `dangerouslySetInnerHTML` en `src/emails/`.
- El enlace `mailto:` usa el correo ya validado por el esquema del formulario.
- El HTML renderizado **nunca** se escribe en los logs, igual que el texto.

## Envío

- `render()` de React Email (asíncrono) genera el HTML; se envían `html` **y**
  `text` en la misma petición a la API REST de Resend (`08-integrations.md`).
- El texto plano actual (`buildEmail` en `src/lib/contact.ts`) se conserva como
  `text`.
- Si el render fallara, **se envía solo el texto plano**: un fallo de plantilla
  nunca impide que el aviso llegue.

## Pruebas y verificación

- **Unitarios (Vitest):** el HTML contiene nombre, correo y mensaje; un mensaje
  con `<script>` o `<b>` aparece escapado; los saltos de línea se conservan; si
  `render` lanza, se envía el texto plano; los colores de `theme.ts` coinciden con
  `tokens.css`.
- **Previsualización:** servidor de React Email en local, en claro y oscuro.
- **Manual, obligatoria antes de cerrar la fase:** un envío real leído en Gmail
  web y en la app de Gmail del móvil, con el modo oscuro activado y desactivado.
  Es el único cliente del único destinatario.

## Criterios de aceptación
- [ ] El aviso se lee correctamente en Gmail web y en la app móvil, en claro y
      oscuro.
- [ ] La marca, el acento y la monoespaciada identifican el sitio.
- [ ] El texto del visitante nunca se interpreta como HTML.
- [ ] Un fallo al renderizar no impide recibir el aviso.
- [ ] El presupuesto de JS del sitio no cambia (dependencia solo de servidor).
