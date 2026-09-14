# OPEN-QUESTIONS.md

Decisiones pendientes. Por la Regla 2 de `../AGENTS.md`, **nada que dependa de una
pregunta abierta se implementa** hasta que el usuario la resuelva.

Última actualización: 2026-09-14 (aprobadas las specs de la fase 2)

Una pregunta aparece **en una sola sección**. Si está en "Resueltas", no puede
seguir en "Abiertas" ni en "Aplazado".

---

## Abiertas

### Q38 · Estrategia anti-spam del formulario
**Bloquea la fase 7** (`13-roadmap.md`).

El endpoint `POST /api/contact` queda expuesto en cuanto se publique. Sin ninguna
medida, recibe spam automatizado sobre `developer.daxho@gmail.com`.

- **(a)** Honeypot: campo oculto que un bot rellena y un humano no. Coste 0 KB,
  sin servicios de terceros, sin fricción para el visitante. Para el volumen de un
  portafolio personal, suele bastar.
- **(b)** Honeypot + límite de tasa por IP en el endpoint.
- **(c)** Captcha (Turnstile de Cloudflare o similar): añade un tercero, JS extra
  y fricción.

**Recomendación: (b).** El honeypot filtra los bots genéricos y el límite de tasa
acota el daño de uno dirigido. Un captcha es desproporcionado para el volumen
esperado y gasta presupuesto de JS en la única página donde ya hay una isla.

### Q41 · Persistencia de los mensajes
**Bloquea la fase 7** (`13-roadmap.md`).

¿Se guardan los mensajes en algún sitio además de enviarlos por correo?

- **(a)** No. El correo es el único registro. Cero infraestructura.
- **(b)** Sí, en una base de datos, para no depender del buzón.

**Recomendación: (a).** Una base de datos para un formulario de contacto de un
portafolio añade una pieza de infraestructura, un coste y una superficie de datos
personales que hay que justificar en un aviso de privacidad. Si un correo se
pierde, el visitante reescribe.

---

## Resueltas

| Ref | Resolución | Documentado en |
|---|---|---|
| Q-A | Iconos dibujados a mano, uno por archivo — **luego derogada** | ADR-0018, `DEVIATIONS.md` |
| Q-B | Card del home **idéntica** a la de `/projects` | `05-pages/home.md`, `06-components.md` |
| Q-C | **Sin filtros** en `/projects` | `05-pages/projects.md` |
| Q-D | Skills **solo agrupadas**, sin nivel de dominio | `05-pages/about.md` |
| Q-E | Galería **en línea** con enlace, sin lightbox | `05-pages/project-detail.md` |
| Q-F | Ruta `/styleguide` en vez de mockups en Figma | ADR-0021, `11-styleguide.md` |
| Q-G | PDF del CV **estático**, mantenido por el usuario | `05-pages/resume.md` |
| Q-I | Boot sequence acotada, primera visita de sesión | ADR-0019 |
| Q-J | Resend con dominio de pruebas → Gmail | ADR-0020 |
| Q-K | Carrusel con **las 25**, no una selección | `DEVIATIONS.md`, `10-tech-catalog.md` |
| Q-L | Express **entra**, con marca circular "ex" | `DEVIATIONS.md`, `10-tech-catalog.md` |
| Q-M | Marca `>daxho▮` — prompt + cursor de bloque | `12-brand.md` |
| Q-N | Navegación en 3 modos, se conservan los 5 enlaces | `06-components.md` |
| Q-O | Texto del brief intacto; "guarida" en español | `05-pages/home.md` |
| Q32 | Texto "about me" — Lorem Ipsum hasta la fase 10 | `13-roadmap.md` |
| Q33 | Fotografía — placeholder hasta la fase 10 | `13-roadmap.md` |
| Q34 | Catálogo cerrado en 25 tecnologías | `10-tech-catalog.md` |
| Q35 | Datos de los 6 proyectos — Lorem Ipsum hasta la fase 10 | `13-roadmap.md` |
| Q36 | Redes del footer — placeholder hasta la fase 10 | `13-roadmap.md` |
| Q37 | Formulario: nombre, correo, mensaje | `05-pages/contact.md` |
| Q39 | Autorespuesta **fuera de alcance** sin dominio propio | ADR-0020 |
| Q40 | Destinatario `developer.daxho@gmail.com` | `05-pages/contact.md` |
| — | Glitch con PowerGlitch — **derogada**, ver la fila siguiente | `DEVIATIONS.md` |
| — | El glitch se elimina; lo sustituye el typing en todos los encabezados | `DEVIATIONS.md`, ADR-0014 §5 |
| — | Iconos: Simple Icons sólidos | `DEVIATIONS.md`, ADR-0018 |
| — | Presupuesto de JS a 75 KB | `DEVIATIONS.md` |
| ADR-0006 | ESLint + Prettier | ADR-0006 |
| ADR-0010 | Rutas sin traducir | ADR-0010 |
| ADR-0014 | Movimiento y efectos | ADR-0014 |
| ADR-0015 | Vercel Web Analytics | ADR-0015 |

---

## Specs en BORRADOR pendientes de aprobar

No son preguntas abiertas, pero por la Regla 1 una spec en BORRADOR no es
vinculante. Se aprueban antes de la fase que las consume.

**Las dos de la fase 2 (`06-components.md` y `05-pages/404.md`) se aprobaron el
2026-09-14**, junto con la entrada de `BootSequence` en el inventario y el
traslado de `NavDropdown` y `MobileNav` a `islands/`. Quedan:

| Spec | La consume | Estado |
|---|---|---|
| `05-pages/home.md` | Fase 5 | BORRADOR |
| `04-content-model.md` | Fase 4 | BORRADOR |
| `05-pages/projects.md`, `project-detail.md` | Fase 4 | BORRADOR |
| `05-pages/about.md`, `resume.md` | Fase 6 | BORRADOR |
| `05-pages/contact.md` | Fase 7 | BORRADOR + Q38/Q41 |
| `08-integrations.md` | Fases 7 y 8 | BORRADOR |

---

## Acciones del usuario pendientes

No son decisiones de diseño, sino trabajo fuera del repositorio que bloquea fases:

1. **Crear el proyecto en Vercel** — recomendado al cerrar la fase 2 (fija
   `SITE_URL` y activa las previews por PR).
2. **Crear la cuenta de Resend con `developer.daxho@gmail.com`** — el dominio de
   pruebas solo envía a la dirección de registro (ADR-0020). Bloquea la fase 7.
3. **Filtro "nunca a spam" en Gmail** antes de la primera prueba de envío.
4. **Contenido real** (fase 10): textos, fotografía, datos y capturas de los 6
   proyectos, redes del footer, formación, idiomas y el PDF del CV por idioma.

**Consecuencia a tener presente:** el contenido de relleno afecta al diseño. Un
Lorem Ipsum de longitud arbitraria no revela si un título real de proyecto rompe
la card. Al sustituirlo por contenido real habrá que revisar el layout.
