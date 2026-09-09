# OPEN-QUESTIONS.md

Decisiones pendientes. Por la Regla 2 de `../AGENTS.md`, **nada que dependa de una
pregunta abierta se implementa** hasta que el usuario la resuelva.

Última actualización: 2026-09-09 (ronda 4)

---

## Abiertas

### ⛔ Bloquea el arranque

**Aprobación para empezar el incremento 1.** El alcance está cerrado en
`11-styleguide.md` y el usuario ha indicado *"no tires código aún"*. No se escribe
nada hasta su visto bueno explícito.

---

### Q-M · Marca, logotipo y favicon
**Nueva en la ronda 5. Hueco no detectado en las rondas anteriores.**

Nunca se ha definido qué aparece en la esquina superior izquierda del header ni
qué icono ve el usuario en la pestaña del navegador. Ambos son obligatorios: no hay
sitio sin favicon, y el header necesita un ancla de identidad.

- **(a)** Marca denominativa: "Daxho" en JetBrains Mono, con algún detalle de
  acento (un cursor `_` parpadeante, un punto rojo). Coste ~0, coherente con la
  identidad de terminal.
- **(b)** Monograma: una "D" o "dx" dentro de una forma geométrica.
- **(c)** Símbolo abstracto propio.

**Recomendación: (a)**, con el favicon derivado del mismo elemento. Un portafolio
personal se firma con el nombre; un símbolo abstracto exige reconocimiento previo
que aún no existe. Además encaja con el resto del sistema sin añadir un lenguaje
visual nuevo.

Pendiente en cualquier caso: favicon en sus variantes (ICO, PNG 180 para iOS, SVG),
y decidir si cambia entre tema claro y oscuro.

### Q-N · Densidad del header
**Nueva en la ronda 5.**

El header acumula: marca + 5 enlaces (Home, About, Projects, Resume, Contact) +
selector de tema + selector de idioma = **8 elementos**. En escritorio cabe; en
tablet queda apretado.

- **(a)** Los 5 enlaces visibles en escritorio, menú hamburguesa por debajo de
  `lg`.
- **(b)** Quitar "Home" de la navegación: la marca ya enlaza al home, que es la
  convención universal. Quedan 4 enlaces.

**Recomendación: (b) combinada con (a).** "Home" junto a un logotipo clicable es
redundante y gasta el recurso más escaso del header.

### Q-O · Traducción al español del titular del hero
El titular en inglés está fijado: *"Welcome to Daxho's corner, what should we
build?"*

Propuesta en `05-pages/home.md`: *"Bienvenido al rincón de Daxho, ¿qué
construimos?"*

Pendiente de aprobación o de una versión del usuario. Es el texto más visible del
sitio; no se traduce sin su visto bueno.

---

## Resueltas

| Ref | Resolución | Documentado en |
|---|---|---|
| Q-A | Iconos dibujados a mano, uno por archivo | ADR-0018 |
| Q-B | Card del home **idéntica** a la de `/projects` | `05-pages/home.md`, `06-components.md` |
| Q-C | **Sin filtros** en `/projects` | `05-pages/projects.md` |
| Q-D | Skills **solo agrupadas**, sin nivel de dominio | `05-pages/about.md` |
| Q-E | Galería **en línea** con enlace, sin lightbox | `05-pages/project-detail.md` |
| Q-F | Ruta `/styleguide` en vez de mockups en Figma | ADR-0021, `11-styleguide.md` |
| Q-G | PDF del CV **estático**, mantenido por el usuario | `05-pages/resume.md` |
| Q-I | Boot sequence acotada, primera visita de sesión | ADR-0019 |
| Q-J | Resend con dominio de pruebas → Gmail | ADR-0020 |
| Q34 | Catálogo cerrado en 25 tecnologías | `10-tech-catalog.md` |
| Q-M | Marca denominativa "Daxho" | `12-brand.md` |
| Q-N | Navegación en 3 modos, se conservan los 5 enlaces | `06-components.md` |
| Q-O | Texto del brief intacto; "guarida" en español | `05-pages/home.md` |
| Q37 | Formulario: nombre, correo, mensaje | `05-pages/contact.md` |
| Q40 | Destinatario `developer.daxho@gmail.com` | `05-pages/contact.md` |
| — | Glitch con PowerGlitch | `DEVIATIONS.md`, ADR-0014 |
| — | Iconos: Simple Icons sólidos | `DEVIATIONS.md`, ADR-0018 |
| Q-K | Carrusel con **las 25**, no una selección | `DEVIATIONS.md`, `10-tech-catalog.md` |
| Q-L | Express **entra**, con marca circular "ex" | `DEVIATIONS.md`, `10-tech-catalog.md` |
| ADR-0006 | ESLint + Prettier | ADR-0006 |
| ADR-0010 | Rutas sin traducir | ADR-0010 |
| ADR-0014 | Movimiento y efectos | ADR-0014 |
| ADR-0015 | Vercel Web Analytics | ADR-0015 |

---

## Aplazado por el usuario (contenido real)

Se implementa con Lorem Ipsum y placeholders marcados hasta que llegue el
contenido. **No bloquea el incremento 1** (`11-styleguide.md`).

- Q32 texto "about me"
- Q33 fotografía
- Q35 datos de los 6 proyectos
- Q36 redes sociales del footer
- Q37 campos definitivos del formulario
- Q38 estrategia anti-spam
- Q39 autorespuesta — **fuera de alcance** mientras no haya dominio propio
  (ADR-0020)
- Q40 correo destino
- Q41 persistencia de los mensajes

**Consecuencia a tener presente:** el contenido de relleno afecta al diseño. Un
Lorem Ipsum de longitud arbitraria no revela si un título real de proyecto rompe
la card. Al sustituirlo por contenido real habrá que revisar el layout.
