# OPEN-QUESTIONS.md

Decisiones pendientes. Por la Regla 2 de `../AGENTS.md`, **nada que dependa de una
pregunta abierta se implementa** hasta que el usuario la resuelva.

Última actualización: 2026-09-17 (`14-email.md` aprobada; no queda ninguna spec en BORRADOR)

Una pregunta aparece **en una sola sección**. Si está en "Resueltas", no puede
seguir en "Abiertas" ni en "Aplazado".

---

## Abiertas

Ninguna. Q-Q, la última, se resolvió el 2026-09-16.

## Resueltas

| Ref | Resolución | Documentado en |
|---|---|---|
| Q-Q | Correos con **base clara y variante oscura** por `prefers-color-scheme` (a) | `14-email.md` |
| Q38 | Anti-spam: **honeypot + límite de envíos por IP** (b). Cómo se implementa el límite en Vercel, sin memoria compartida entre ejecuciones, se decide al aprobar `contact.md` | `05-pages/contact.md` |
| Q41 | **Sin persistencia**: el correo es el único registro (a) | `05-pages/contact.md` |
| Q-A | Iconos dibujados a mano, uno por archivo — **luego derogada** | ADR-0018, `DEVIATIONS.md` |
| Q-B | Card del home **idéntica** a la de `/projects` | `05-pages/home.md`, `06-components.md` |
| Q-C | **Sin filtros** en `/projects` | `05-pages/projects.md` |
| Q-D | Skills **solo agrupadas**, sin nivel de dominio | `05-pages/about.md` |
| Q-E | Galería **en línea** con enlace, sin lightbox | `05-pages/project-detail.md` |
| Q-F | Ruta `/styleguide` en vez de mockups en Figma | ADR-0021, `11-styleguide.md` |
| Q-G | PDF del CV **estático**, mantenido por el usuario; se descarga desde `/about` | `05-pages/about.md` |
| Q-I | Boot sequence acotada, primera visita de sesión | ADR-0019 |
| Q-J | Resend con dominio de pruebas → Gmail | ADR-0020 |
| Q-K | Carrusel con **las 25**, no una selección | `DEVIATIONS.md`, `10-tech-catalog.md` |
| Q-L | Express **entra**, con marca circular "ex" | `DEVIATIONS.md`, `10-tech-catalog.md` |
| Q-M | Marca `>daxho▮` — prompt + cursor de bloque | `12-brand.md` |
| Q-N | Navegación en 3 modos, se conservan todos los enlaces (4 desde que se eliminó `/resume`) | `06-components.md`, `DEVIATIONS.md` |
| Q-O | Texto del brief intacto; "guarida" en español | `05-pages/home.md` |
| Q32 | Texto "about me" — Lorem Ipsum hasta la fase 10 | `13-roadmap.md` |
| Q33 | Fotografía — placeholder hasta la fase 10 | `13-roadmap.md` |
| Q34 | Catálogo cerrado en 25 tecnologías | `10-tech-catalog.md` |
| Q35 | Datos de los 6 proyectos — Lorem Ipsum hasta la fase 10 | `13-roadmap.md` |
| Q36 | Redes del footer — placeholder hasta la fase 10 | `13-roadmap.md` |
| Q37 | Formulario: nombre, correo, mensaje | `05-pages/contact.md` |
| Q39 | Autorespuesta **fuera de alcance** sin dominio propio | ADR-0020 |
| Q40 | Destinatario `developer.daxho@gmail.com` | `05-pages/contact.md` |
| Q-P | La fase 10 (contenido real) va antes de la 9; el plan termina en `development` y el merge a `master` lo hace el usuario | `13-roadmap.md`, ADR-0017, `DEVIATIONS.md` |
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
traslado de `NavDropdown` y `MobileNav` a `islands/`.

**Las tres de la fase 4 (`04-content-model.md`, `05-pages/projects.md` y
`05-pages/project-detail.md`) se aprobaron el mismo día**, con tres decisiones:
filtrado de drafts, ambos idiomas obligatorios y navegación sin vuelta.

**La de la fase 5 (`05-pages/home.md`) se aprobó el 2026-09-16, y las dos de la
fase 6 (`about.md`, `resume.md`) el mismo día, igual que las dos de la fase 7 (`contact.md`, `08-integrations.md`).** `resume.md` quedó SUPERSEDED esa misma tarde: la página se eliminó.

**La de la fase 11 (`14-email.md`) se aprobó el 2026-09-17**, con dos decisiones
que la spec dejaba abiertas: estilos **en línea** desde `theme.ts` en vez del
componente `Tailwind` de React Email, y **sin previsualización local** — la
revisión se hace sobre envíos reales.

**No queda ninguna spec en BORRADOR.**

---

## Acciones del usuario pendientes

No son decisiones de diseño, sino trabajo fuera del repositorio que bloquea fases:

1. ~~**Crear el proyecto en Vercel**~~ — **hecho**: confirmado el 2026-09-17, la
   preview de una PR desplegó en `daxhos-projects/daxho-web-portfolio`.
2. ~~**Crear la regla del firewall** del formulario en Vercel~~ — **hecha**:
   configurada por el usuario el 2026-09-17.
3. ~~**Crear la cuenta de Resend con `developer.daxho@gmail.com`**~~ — **hecha**:
   el 2026-09-17 llegaron cuatro envíos reales a esa dirección.
4. ~~**Filtro "nunca a spam" en Gmail**~~ — sin efecto práctico pendiente: los
   cuatro envíos de prueba se leyeron en la bandeja.
5. **Contenido real** (fase 10, que va antes de la 9): textos, fotografía, datos y capturas de los 6
   proyectos, redes del footer, formación, idiomas y el PDF del CV por idioma.

**Consecuencia a tener presente:** el contenido de relleno afecta al diseño. Un
Lorem Ipsum de longitud arbitraria no revela si un título real de proyecto rompe
la card. Al sustituirlo por contenido real habrá que revisar el layout.
