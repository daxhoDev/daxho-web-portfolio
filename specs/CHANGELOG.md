# CHANGELOG de las specs

Historial de cambios de la especificación. No confundir con el changelog del
producto.

## [2026-09-18] El CV deja de ser relleno

- **`public/resume/`:** los dos PDF son ya el CV real del usuario, uno por
  idioma y de una página. El contenido sale de su CV anterior, de sus
  repositorios y de Lighthouse; la maqueta, de la rampa clara del sitio.
- **`13-roadmap.md`:** la fase 10 anota el CV como hecho, qué se dejó fuera a
  propósito (ciudad y teléfono) y que **no se afirma una titulación que aún no
  existe**.
- El generador del PDF se queda **fuera del repositorio** mientras Q-G diga que
  el CV es un archivo estático mantenido por el usuario.
- **Segunda pasada el mismo día**, a petición del usuario: se presenta como
  **Software Engineer**, el copy pasa de tareas a resultados, el resumen deja de
  citar el número de proyectos, y entran arquitectura e ingeniería asistida por
  IA entre las competencias. Cada enlace lleva su icono de destino **en SVG**,
  no en texto, para no ensuciar lo que extrae un ATS.
- **Verificado con un extractor real** (`pdfjs-dist`), no a ojo: el
  `letter-spacing` de los encabezados hacía que el texto saliera como
  "E X P E R I E N C E" y el prompt de la marca se colaba dentro del nombre. Se
  quitó el primero y el segundo pasó a ser un SVG. Las cinco secciones se
  extraen ahora limpias en los dos idiomas.

## [2026-09-18] Segundo proyecto real: el portafolio de Keily Mar

- **Contenido:** `lorem-ipsum-two` pasa a `keilys-portfolio`, con textos en los
  dos idiomas sacados del repositorio y de sus decisiones de diseño, y tres
  capturas tomadas del sitio en producción: portada, galería con filtros por
  tono y el lightbox escrito a mano.
- **Tests E2E:** el caso de "solo `liveUrl`, sin `repoUrl`" ya no existe entre
  los proyectos reales, así que la prueba de "cada botón solo si existe su URL"
  pasa a cubrir los tres casos con los proyectos que hoy los representan.
- **`13-roadmap.md`:** avance de la fase 10 y la regla de que cada proyecto que
  se vuelve real obliga a revisar los E2E que lo citaban.

## [2026-09-17] Capturas reales de Destinos Únicos y Cloudinary en el catálogo

- **Capturas:** tomadas del sitio en producción con Playwright a 1600×900 y
  convertidas a JPEG con sharp (114, 69 y 59 KB). Portada, catálogo con sus
  filtros por ocasión y la ficha de un regalo con el botón que arranca el pedido
  por WhatsApp. **El área privada no se pudo capturar**: exige credenciales, así
  que el pie de la segunda imagen dice lo que de verdad se ve.
- **Cloudinary entra en el catálogo** (`DEVIATIONS.md`): 26 tecnologías, icono de
  Simple Icons, grupo de infraestructura, y añadida al `stack` del proyecto.
  Q34 —catálogo cerrado en 25— queda derogada y el catálogo pasa a estar abierto
  a añadidos del usuario.
- **El proyecto sigue en `draft: true`,** ahora por un motivo distinto: ya no le
  faltan ni textos ni imágenes, sino que la validación del conjunto exige 3
  destacados por idioma y los otros 5 proyectos siguen siendo relleno.

## [2026-09-17] Primer proyecto real y cierre de las fases 6, 7, 8 y 11

Las dos PRs (fases 8 y 11) quedan mergeadas en `development`, el usuario da por
buenas `/about` y `/contact`, confirma que la regla del firewall está puesta, y
pide rellenar el primer proyecto con su repositorio `destinos-unicos-landing-page`.

- **`13-roadmap.md`:** las fases 6, 7, 8 y 11 pasan a COMPLETADA; la 10 pasa a
  EN CURSO y anota qué se ha rellenado y qué falta.
- **Contenido:** `lorem-ipsum-one` pasa a `destinos-unicos` en las dos
  colecciones y en `src/assets/projects/`. Los textos de los dos idiomas salen
  de leer el repositorio del proyecto. **Sigue en `draft: true`**: faltan las
  capturas, que aporta el usuario.
- **Tests E2E:** los que citaban el slug o el título antiguos pasan al nuevo. La
  comprobación de "títulos propios en español" se mueve al segundo proyecto,
  porque "Destinos Únicos" es un nombre propio y no se traduce.
- **`OPEN-QUESTIONS.md`:** la regla del firewall queda cerrada como acción hecha.

## [2026-09-17] Fase 11 verificada a mano: los correos se leen bien

El usuario revisó los cuatro envíos reales en Gmail y los dio por buenos
(*"Los correos funcionando"*). Era la única comprobación que no se puede
automatizar, y con ella la fase queda cerrada.

- **`14-email.md`:** los cinco criterios de aceptación pasan a cumplidos, cada
  uno con su fuente: la revisión del usuario o el test que lo cubre.
- **`13-roadmap.md`:** la fase 11 pasa a COMPLETADA, pendiente solo del merge.

## [2026-09-17] Inventario de contenido de la fase 10

Al cerrar la fase 8, la única fase que queda por delante depende por completo de
material del usuario. `13-roadmap.md` gana el **inventario exacto** de lo que
hace falta —los 9 bloques, con los campos obligatorios de cada archivo, el
límite de 160 caracteres del `summary`, el 16:9 de las capturas y la regla de
los 3 destacados por idioma—, para que reunirlo no dependa de ir preguntando.

## [2026-09-17] Fase 8 — SEO y analytics

Implementación de la fase 8, sin cambios de decisión.

- **`13-roadmap.md`:** cierre real de la fase (131 unitarios, 131 E2E, 13 OG,
  sitemap de 20 URL, ~59,7 KB de JS en el home) y seis hallazgos: el `woff2` que
  Satori no lee, las URL sin barra final en el JSON-LD, la regla de que el
  contenido `draft` no entra en datos estructurados, el escapado de `<` para que
  un título no cierre el `<script>`, el `robots.txt` generado en el build y los
  `<h1>` que la barra de desarrollo de Astro añade en el shadow DOM.
- **ADR-0015:** la analítica **solo se monta en producción**; en desarrollo su
  script de depuración no mide nada y su espera desestabilizaba los tests.
- **`OPEN-QUESTIONS.md`:** el proyecto de Vercel queda cerrado como acción hecha.

## [2026-09-17] Decisiones de la fase 8 (SEO y analytics)

Cuatro decisiones del usuario antes de implementar, más una comprobación del
entorno.

- **ADR-0016:** las OG dinámicas se generan en el build con **Satori + sharp**,
  no con `@vercel/og` en ejecución, y se dibujan sobre la **base oscura**.
  Satori **no lee `woff2`** (verificado: `Unsupported OpenType signature wOF2`),
  así que los TTF de JetBrains Mono entran en `src/assets/fonts/` con su licencia
  OFL, para uso exclusivo del build.
- **ADR-0015:** la nota de "sin cookies" va en **una línea del footer**, con los
  textos exactos en los dos idiomas. Propagado a `06-components.md`.
- **`05-pages/projects.md` y `05-pages/contact.md`:** ganan sección de SEO con
  `title` y `description` aprobados. `projects` deja de usar su entradilla de
  Lorem Ipsum como `description`.
- **`05-pages/home.md` y `05-pages/about.md`:** `description` aprobada; la del
  home es **provisional** hasta la fase 10.
- **`05-pages/404.md`:** no lleva `description`, por `noindex`.
- **`OPEN-QUESTIONS.md`:** el proyecto de Vercel ya existe; la acción del usuario
  queda cerrada.

## [2026-09-17] Fase 11 — Plantillas de correo

Implementación de la fase 11. Un cambio de decisión y dos hallazgos que tocan a
las specs.

- **`14-email.md`:** el paquete es **`react-email`**, no `@react-email/components`
  —deprecado en npm en todas sus versiones—; `src/emails/render.ts` es la entrada
  del render, y el idioma de la página y `SITE_URL` llegan cerrados desde la ruta.
- **`14-email.md` y `13-roadmap.md`:** **sin previsualización local** (decisión
  del usuario, el mismo día): el `export` del CLI de React Email no escribe nada
  y un script propio obligaría a añadir un transformador de TSX, porque Node no
  interpreta JSX. La revisión se hace sobre envíos reales, que además ejercitan
  el camino de producción entero.
- **`13-roadmap.md`:** cierre real de la fase, con los cuatro envíos de prueba,
  el crecimiento de la función del endpoint y los hallazgos de React (el
  `<!-- -->` entre textos adyacentes y el `!important` de la variante oscura).
- **`06-components.md`:** acota su alcance a `src/components/`. Su regla 2
  prohíbe los colores literales en un componente, y `src/emails/` los usa por
  obligación; sin esta línea las dos specs se contradecían.

## [2026-09-17] Aprobada `14-email.md` y arranca la fase 11

El usuario pide empezar la fase 11 antes que la fase 8 y aprueba la spec tal
cual, cerrando las dos vías que quedaban abiertas dentro de ella.

- **`14-email.md` (APROBADA):** estilos **en línea** desde `src/emails/theme.ts`
  —se descarta el componente `Tailwind` de React Email, que duplicaría la
  configuración de colores y puede emitir selectores que algunos clientes
  descartan— y **sin previsualización local**: la revisión se hace sobre envíos
  reales a la bandeja de Daxho. La media query oscura va en un `<style>` del
  `<Head>`, porque `@media` no cabe en un atributo `style`.
- **ADR-0022:** anota que el servidor de previsualización que se cita como
  ventaja de React Email no se instala.
- **`13-roadmap.md`:** la fase 11 pasa a EN CURSO, con el prerrequisito cumplido.
- **`03-architecture.md`:** `src/emails/render.ts` es la entrada del render.
- **`OPEN-QUESTIONS.md`:** no queda ninguna spec en BORRADOR.
- Verificado antes de aprobar: los 12 colores de la spec coinciden exactamente
  con `src/styles/tokens.css`; `@react-email/components@1.0.12` declara peer
  `react ^19`, compatible con el `react@19.2.8` del proyecto; y el idioma del
  visitante ya viaja en el formulario (`input.lang` en `src/pages/api/contact.ts`),
  así que el punto 3 del contenido no obliga a tocar `05-pages/contact.md`.

## [2026-09-16] Q-Q resuelta: correos con base clara y variante oscura

Decisión del usuario: opción (a). No queda ninguna pregunta abierta.

- **`14-email.md`:** la sección de Q-Q pasa a ser la decisión, con los colores
  exactos de cada tema tomados de `tokens.css` y la aceptación de que los
  clientes que invierten colores (Gmail móvil) deciden el resultado sobre la base
  clara.
- **`13-roadmap.md`:** a la fase 11 solo le queda aprobar `14-email.md`.
- **`OPEN-QUESTIONS.md`:** Q-Q pasa a resueltas.

## [2026-09-16] Plantillas de correo: ADR-0022, `14-email.md` y fase 11

Petición del usuario: especificar el paso a correos HTML con React Email
siguiendo la estética del sitio, como etapa para más adelante.

- **ADR-0022 (APROBADA):** React Email frente a mantener texto plano, HTML a mano
  o MJML. Modifica la regla de formato de ADR-0020, efectiva en la fase 11 →
  `DEVIATIONS.md`.
- **`14-email.md` (BORRADOR):** una plantilla (el aviso a Daxho), su contenido,
  la traducción de la estética del sitio a lo que soportan los clientes de correo
  (colores en literales con test contra los tokens, fuentes del sistema, sin
  animación, píxeles), seguridad (escapado, sin `dangerouslySetInnerHTML`), envío
  de `html` + `text` con caída a texto plano si falla el render, y verificación
  manual en Gmail web y móvil.
- **`13-roadmap.md`:** nueva **fase 11**, sin fecha, que solo depende de la 7.
- **`OPEN-QUESTIONS.md`:** nueva **Q-Q** (tema claro u oscuro del correo), que
  bloquea la fase 11.
- Verificado antes de escribir la spec, en la documentación de React Email:
  `render()` es asíncrono y ofrece `plainText`; su componente `Tailwind` soporta
  v4, recomienda píxeles y no soporta selectores complejos ni `hover`. Gmail no
  carga fuentes web.
- Propagado a ADR-0020, `03-architecture.md`, `08-integrations.md`,
  `05-pages/contact.md` y los dos índices.

## [2026-09-16] Fase 7 — Contacto

Implementación de la fase 7, sin cambios de decisión.

- **`05-pages/contact.md`:** documenta la protección CSRF de Astro sobre el
  endpoint y la lectura de secretos con `astro:env/server`.
- **ADR-0019:** anota que el requisito 2 (sin JS no se muestra el overlay) estuvo
  incumplido desde la fase 2 por un `<style>` con una expresión que Astro no
  evalúa. Corregido con test de regresión.
- **`13-roadmap.md`:** cierre real de la fase, lo que queda sin verificar (envío
  real y regla del firewall, que dependen de tus cuentas) y el peso de JS de
  `/contact`.

## [2026-09-16] Aprobadas las specs de la fase 7

`05-pages/contact.md` y `08-integrations.md` pasan de BORRADOR a APROBADA.
Verificaciones previas y decisiones del usuario:

- **Resend verificado** en su documentación: el dominio de pruebas solo envía a la
  dirección de la cuenta (403 con otra). Era la condición de ADR-0020.
- **Límite por IP: regla del firewall de Vercel**, configurada en el panel
  (3 peticiones por IP cada 10 minutos). Disponible en Hobby. Su definición
  completa vive en `08-integrations.md`, porque no está en el repositorio.
- **El formulario funciona sin JavaScript**: `<form>` HTML real mejorado por la
  isla; sin JS, el endpoint redirige a `/contact/sent` o `/contact/error`. Con
  eso **se elimina el correo directo** como alternativa, que contradecía el
  anti-spam.
- **Frase de la página en voz de terminal:** `> ready when you are. Tell me about
  your project.`

`07-conventions.md` regla 10 pierde su excepción: el sitio entero, formulario
incluido, funciona sin JavaScript.

Desfases corregidos: `08-integrations.md` hablaba de la analítica "si se aprueba"
(ADR-0015 la aprobó); ADR-0020 pedía verificar Resend (hecho) y usaba un asunto
`[Portfolio] {asunto}` para un formulario sin campo de asunto.

## [2026-09-16] Q38 y Q41 resueltas

Decisiones del usuario. No queda ninguna pregunta abierta en `OPEN-QUESTIONS.md`.

- **Q38 — anti-spam: (b) honeypot + límite de envíos por IP.** `contact.md`
  describe el honeypot (campo fuera de pantalla, inaccesible por teclado y lector
  de pantalla, respuesta de éxito falsa al bot). Queda por concretar cómo se
  implementa el límite en Vercel, donde las ejecuciones no comparten memoria.
- **Q41 — persistencia: (a) no.** El correo es el único registro.
- Propagado a `05-pages/contact.md`, ADR-0004 (decía "anti-spam pendiente") y
  `13-roadmap.md`: la fase 7 deja de estar bloqueada por estas preguntas; le
  falta aprobar `contact.md` y `08-integrations.md`.

## [2026-09-16] Se elimina `/resume`: el CV se descarga desde `/about`

Decisión del usuario, registrada en `DEVIATIONS.md`: *"about y resume muestran lo
mismo"*. Antes de mergear la fase 6.

- `about.md` absorbe el botón de descarga (tras la entradilla), las reglas del PDF,
  formación, idiomas y la hoja de impresión. Perfil y contacto se eliminan.
- `resume.md` pasa a SUPERSEDED, con una tabla de adónde fue cada bloque.
- Navegación de 5 a 4 enlaces: `06-components.md`, Q-N en `OPEN-QUESTIONS.md`.
- Propagado a `05-pages/README.md`, `03-architecture.md`, `04-content-model.md` y
  `13-roadmap.md` (la fase 6 pasa a llamarse "About").

## [2026-09-16] Aprobadas las specs de la fase 6

`05-pages/about.md` y `05-pages/resume.md` pasan de BORRADOR a APROBADA.
Decisiones del usuario:

- **PDF del CV:** uno de relleno por idioma hasta la fase 10. El texto del botón
  muestra formato, idioma y peso leído del archivo al compilar; si falta un PDF,
  el build falla.
- **Contacto en `/resume`:** GitHub, LinkedIn y enlace al formulario. **Sin
  correo** publicado.
- **Datos:** experiencia como colección MDX por idioma (misma regla de ambos
  idiomas que `projects`); formación, idiomas y redes como archivos TS tipados.

Consecuencias propagadas:
- `04-content-model.md`: estructura por idioma y campos `draft` y
  `translatedByAgent` en `experience`; nueva sección para formación, idiomas y
  redes; los grupos de skills son los de `10-tech-catalog.md`.
- `src/content/social.ts` pasa a ser la fuente única de las redes, que hasta
  ahora vivían escritas dentro del footer.
- La guarda de drafts de CI se extiende a los archivos TS de contenido: de lo
  contrario el relleno de formación, idiomas y redes podría llegar a `master`
  sin que nada lo detectara.
- `resume.md`: la hoja de impresión fuerza visibles los encabezados tecleados.
- `13-roadmap.md`: fase 5 completada (PR #5), fase 6 en curso.

## [2026-09-16] Fase 5 — Home

Implementación de la fase 5. Sin cambios de decisión; se documenta:

- **`13-roadmap.md`:** cierre real de la fase y un **riesgo de LCP** a medir en la
  fase 9. En la primera visita el titular espera a la boot sequence y después se
  teclea, y no está verificado cómo cuenta Chrome el LCP de un texto revelado
  carácter a carácter.
- **Nota de accesibilidad conocida:** en español, la lista del carrusel y las
  filas de stack de las cards comparten el nombre accesible "Tecnologías". Son
  listas distintas en secciones con encabezados distintos, así que no se ha
  cambiado; queda anotado por si la auditoría de la fase 9 lo señala.

## [2026-09-16] Aprobada la spec de la fase 5

`05-pages/home.md` pasa de BORRADOR a APROBADA. Decisiones del usuario:

- **Hero** a pantalla completa bajo el header, con un enlace estático `scroll ↓`.
- **Subtítulo:** `Software Engineer · full-stack web` /
  `Software Engineer · desarrollo web full-stack`.
- **Banda CTA** en voz de terminal: `> ready when you are` + `contact` /
  `> listo cuando tú lo estés` + `contacto`.

Añadido por el agente, sin decisión nueva: el tecleo del hero arranca **de
inmediato** cuando la boot sequence no se muestra o se salta, en vez de esperar
siempre su duración. Es lo que ya pedía ADR-0019 al encadenar las dos piezas.

Desfases corregidos:
- `home.md` daba el carrusel por bloqueado por Q-A, resuelta desde la fase 1.
- `home.md` y `06-components.md` describían una prop `variant` de `ProjectCard`
  "para futuros usos" que nunca se implementó. Se elimina la mención.
- `13-roadmap.md` decía que la fase 5 depende de la fase 3, eliminada. Fases 2 y 4
  marcadas como completadas (PR #3 y #4).
- JSON-LD, OG y `description` del home quedan explícitamente en la fase 8.

## [2026-09-14] Q-P resuelta: contenido real antes de la auditoría, sin `master`

Decisión del usuario, registrada en `DEVIATIONS.md`: *"Adelantamos la fase de
contenido real, el merge a master queda fuera del plan, todo a development, de
master me encargo yo"*.

- **`13-roadmap.md`:** la fase 10 pasa a ir antes de la 9, sin renumerar (hay
  muchas referencias a "la fase 10" en specs y código). La fase 9 se queda en
  auditoría, sin merge a `master`, y se ejecuta sobre el contenido real.
  Actualizado el camino crítico.
- **`AGENTS.md`, ADR-0017, `07-conventions.md`:** el agente no abre PRs ni mergea
  hacia `master`.
- **`09-testing.md`, ADR-0016:** las auditorías pasan de "antes de cada merge a
  `master`" a "en la fase 9, contra `development`".
- **`OPEN-QUESTIONS.md`:** Q-P sale de abiertas y entra en resueltas.
- **`04-content-model.md`:** las fases con relleno son la 4 a la 8; la guarda de
  CI sobre `master` se mantiene para los merges del usuario.

## [2026-09-14] Fase 4 — contenido y proyectos

Implementación de la fase 4. Correcciones a las specs salidas de construirla:

- **`03-architecture.md`:** añade `sharp` (lo exige `<Image>` para AVIF/WebP),
  `content/queries.ts`, `lib/projects.ts` y `scripts/check-drafts.mjs` al árbol.
- **`06-components.md`:** documenta las props de `ProjectCard` (`cover`, `lang`,
  `headingLevel`) y el comportamiento de `ProjectNav` y `ProjectGallery`.
- **`13-roadmap.md`:** cierre real de la fase, con tres hallazgos. El más serio:
  la validación de "exactamente 3 destacados" se saltaba un idioma sin
  proyectos, y un despliegue a producción con todo en draft habría publicado
  una galería vacía. Corregido con test de regresión.

## [2026-09-14] Aprobadas las specs de la fase 4

`04-content-model.md`, `05-pages/projects.md` y `05-pages/project-detail.md` pasan
de BORRADOR a APROBADA. Tres decisiones del usuario:

- **Drafts:** se filtran solo en el despliegue a producción (`VERCEL_ENV`), con
  una guarda de CI sobre los PR a `master`. Deroga la regla anterior →
  `DEVIATIONS.md`.
- **Traducción:** todo proyecto existe en ambos idiomas o el build falla; fuera
  la escapatoria de "no traducido". Deroga la regla anterior → `DEVIATIONS.md`.
- **`ProjectNav`:** sin vuelta circular; el primero y el último ocultan el lado
  que no existe.

Desfases corregidos en la misma pasada:
- `04-content-model.md` seguía diciendo que los iconos se dibujan a mano (derogado
  en favor de Simple Icons) y describía `icon` como "componente SVG", cuando en
  `tech.ts` es el slug de la librería.
- `04-content-model.md` daba Q-D por pendiente; está resuelta desde el 2026-09-09.
- `03-architecture.md` situaba los esquemas en `src/content/config.ts`; en Astro
  7 viven en `src/content.config.ts`.
- `project-detail.md` exigía la OG dinámica y el JSON-LD, que el roadmap asigna a
  la fase 8. Quedan marcados como tales.

**Nuevo conflicto registrado: Q-P.** La fase 9 mergea a `master` antes de que la
10 traiga el contenido real, y la regla de drafts impide ese merge. Bloquea la
fase 9, no la 4.
## [2026-09-14] Toggle de tema traducido

Petición del usuario: *"El botón de tema en español debe decir sistema"*. Era un
hueco del i18n de la fase 2: `ThemeToggle` venía de la fase 1 con los textos en
inglés escritos en el componente.

- Los tres estados y el nombre accesible salen de los diccionarios y el header se
  los pasa como props. En español: "Sistema", "Claro", "Oscuro" y "Tema: … Pulsa
  para cambiar.". La isla no importa los diccionarios, para no cargar todas las
  traducciones en el JS del cliente.
- La styleguide, que no forma parte del sitio, conserva los textos por defecto en
  inglés.

## [2026-09-14] Páginas `es/` como cáscaras mínimas: `src/views/`

Corrección de un incumplimiento de la fase 2, detectado por el agente al preparar
la fase 4. `03-architecture.md` exige que cada página de `es/` sea una cáscara que
reutilice el componente de página de su equivalente en inglés, y declara error de
implementación duplicar el marcado. Las 10 páginas del esqueleto eran copias
completas.

- Los componentes de página viven en **`src/views/`** (decisión del usuario).
- Las páginas vacías comparten `views/PlaceholderView.astro`; cada una la
  abandona cuando su fase la construye.

## [2026-09-14] Sidebar móvil y toggle de tema en móvil

Peticiones del usuario tras revisar la fase 2:

- *"El botón de abrir el sidebar no debe tener texto, sino un ícono de
  hamburger"* — el nombre accesible pasa a `aria-label`.
- *"El contenido detrás debería tener blur y al tocarlo cerrarse, además de un
  botón X en la esquina para cerrarlo"*, *"el botón de cerrar el sidebar va
  arriba a la derecha"*.
- *"Asegúrate de que con el sidebar abierto no se scrollee el fondo"* — con
  compensación del ancho de la barra de scroll para que el contenido no salte.
- *"Theme toggle en mobile solo mostrará el ícono, no texto"*.

- *"Al cerrar el sidebar no se ve la transición"* — dos causas. El panel pasaba a
  `visibility: hidden` en el mismo instante en que empezaba a salir, y el
  backdrop se desmontaba de golpe. Ahora `visibility` cambia con un retardo igual
  al deslizamiento (220 ms), y backdrop y botón X quedan siempre montados y se
  funden por CSS. Con test de regresión que falla sin el arreglo.

No derogan ninguna regla escrita: `06-components.md` no especificaba la forma del
disparador ni el backdrop. Se añaden como detalle a las filas de `MobileNav` y
`ThemeToggle` y a los requisitos de accesibilidad del sidebar, sin entrada en
`DEVIATIONS.md`.

## [2026-09-14] Fase 2 — esqueleto del sitio

Implementación de la fase 2. Dos correcciones a las specs salidas de construirla:

- **`i18n/routes.ts` no existe y no va a existir.** `03-architecture.md` y
  `06-components.md` lo describían como el mapa de rutas equivalentes entre
  idiomas que usaría `LanguageSwitcher`. Ese mapa solo es necesario si los
  segmentos se traducen (`/es/proyectos`), y ADR-0010 decidió mantenerlos en
  inglés **precisamente para no tener que mantenerlo**. Con rutas sin traducir,
  la página equivalente se obtiene quitando o poniendo el prefijo: es
  `canonicalPath` + `localizePath` en `i18n/utils.ts`. Era un resto del borrador
  anterior a ADR-0010.
- **`LanguageSwitcher` no reimplementa el enrutado en cliente.** El destino de
  cada idioma se calcula en el servidor y llega como prop.

Se documenta además en `13-roadmap.md` el hallazgo de implementación que más
tiempo costó: `NavDropdown` y `MobileNav` escribían las dos `data-open` sobre el
mismo `#site-nav`, y con `client:idle` el orden de hidratación no está
garantizado, de modo que la isla que hidrataba después pisaba el estado de la
otra. El sidebar se abría y se cerraba solo. La regla que queda: **ninguna isla
escribe su estado inicial al montar** sobre DOM que no le pertenece.

## [2026-09-14] Aprobadas las specs de la fase 2

Desbloqueo del prerrequisito de la fase 2. `06-components.md` y `05-pages/404.md`
pasan de BORRADOR a APROBADA. Al auditarlas contra lo que la fase necesita
aparecieron tres huecos, resueltos con el usuario antes de aprobar:

- **`BootSequence` no estaba en el inventario.** ADR-0019 está APROBADA y la fase
  2 debe construir el overlay de arranque, pero la regla 5 de `06-components.md`
  prohíbe crear un componente que no figure en la lista. Entra en `layout/` como
  `.astro` **sin isla**, que es lo que ya exigía el requisito 1 de ADR-0019: el
  overlay se retira por animación CSS de duración fija y el JS solo gestiona el
  "saltar" y el `sessionStorage`. Una isla React ataría la retirada a que React
  hidrate, que es el fallo catastrófico que la propia ADR descarta.
- **`NavDropdown` y `MobileNav` estaban listados dos veces**, en `layout/` y en
  `islands/`. Se quedan solo en `islands/`, y se añade la regla explícita de que
  todo componente React vive ahí y solo ahí, para que no se vuelva a duplicar.
- **`Footer` citaba Q36 como pendiente** cuando está resuelta desde el 2026-09-09
  (placeholder hasta la fase 10). Por la Regla 2 ese adjetivo detendría a un
  agente sin motivo.

También se corrige la estructura de carpetas de `03-architecture.md`, que iba por
detrás del código aprobado en la fase 1: situaba `Container` en `layout/` y
mencionaba un `Tag` que nunca existió (es `Chip`).

## [2026-09-14] El typing sustituye al glitch

Decisión del usuario: *"eliminaremos el efecto de glitch, lo sustituiremos por el
de typing"*. Registrada en `DEVIATIONS.md` por partida doble.

- **ADR-0014 §5 reescrita.** "Glitch en encabezados" pasa a "Typing en los
  encabezados": disparado al entrar en viewport, una sola vez, sin repetición con
  hover ni foco, con cursor efímero. Actualizados también el contexto de la ADR y
  la regla transversal de `prefers-reduced-motion`, que citaban el glitch.
- **Propagación por concepto, no solo por nombre de archivo.** El glitch estaba
  citado en 12 specs que no siempre nombraban ADR-0014: `00-vision.md`
  (principios), `02-design-system.md` (reglas duras de movimiento),
  `03-architecture.md` (islas y CSS puro), `06-components.md` (`SectionHeading`),
  `07-conventions.md` (cuándo se escribe CSS propio), `11-styleguide.md` (las
  tres veces), `13-roadmap.md` (alcance de la fase 1), `05-pages/404.md`,
  `05-pages/about.md`, ADR-0013, ADR-0019 y ADR-0021.
- **Contradicción anterior corregida:** `03-architecture.md` y `06-components.md`
  listaban `TypingHero` como isla React `client:load`, cuando el typing se
  implementó en la fase 1 en CSS puro, sin isla. Se elimina la fila de ambas
  tablas y se documenta `TypingText` como primitivo `ui/` con sus props
  (`trigger`, `caret`).
- **`OPEN-QUESTIONS.md`:** la resolución "Glitch con PowerGlitch" se marca
  derogada y se añade la nueva, sin duplicar la pregunta entre secciones.
- **Efecto medido:** fuera la dependencia `powerglitch`; el presupuesto de JS baja
  de 62,6 KB a 59,2 KB gzip de los 75 KB. Los tests E2E pasan de 23 a 26.

## [2026-09-10] Consistencia de specs tras la fase 1

Auditoría de referencias cruzadas al mergear `feat/design-system` a `development`
(PR #1, `7a48f63`). Se corrigen los desfases acumulados en las rondas 5-7 y en la
implementación de la fase 1:

- **`OPEN-QUESTIONS.md` reescrito.** Se contradecía a sí mismo: Q-M, Q-N y Q-O
  aparecían a la vez en "Abiertas" y en "Resueltas"; Q37 y Q40 en "Resueltas" y
  en "Aplazado"; seguía vivo el bloqueo `⛔ no tires código aún` de antes de la
  fase 1; y **Q38 y Q41, los dos únicos bloqueos reales, no figuraban como
  abiertas**. Ahora cada pregunta vive en una sola sección, con recomendación
  razonada para las dos abiertas. Añadida una tabla de specs en BORRADOR con la
  fase que consume cada una.
- **Tres citas llamaban "pendiente" a ADRs ya aprobadas**, lo que por la Regla 2
  detendría a un agente sin motivo: `02-design-system.md` §7 (ADR-0014),
  `05-pages/README.md` (ADR-0010) y `08-integrations.md` (ADR-0015).
- **La desviación de iconografía no se había propagado.** El cambio de lineart a
  siluetas sólidas estaba en `DEVIATIONS.md` y ADR-0018, pero seguían diciendo
  "lineart" `05-pages/home.md` (carrusel), `05-pages/about.md` (skills),
  `04-content-model.md` (campo `icon`) y `10-tech-catalog.md` (columna "Icono").
  Reescrita la §6 de `02-design-system.md`, que abría declarando lineart como
  regla general y repetía dos veces la línea de Lucide.
- **Estados de cabecera actualizados:** `13-roadmap.md` PROPUESTA → APROBADA
  (se ejecutó la fase 1 contra un plan formalmente no aprobado),
  `02-design-system.md` BORRADOR v0 → APROBADA (paleta y temas aprobados en
  `/styleguide`), `10-tech-catalog.md` deja de decir "selección del carrusel
  PENDIENTE" (la cerró Q-K).
- **Fase 1 marcada como completada** en el roadmap, con su cierre real medido, y
  fase 2 marcada como siguiente con el prerrequisito de aprobar
  `06-components.md`.
- **Nueva skill `.claude/skills/spec-sync/`**: obliga a inventariar y propagar
  todas las referencias a una spec al editarla. Nace de esta auditoría — el
  desfase de iconografía sobrevivió porque se buscó por nombre de archivo y no
  por concepto.

## [2026-09-09] Especificación inicial

- Creado `AGENTS.md` con las tres reglas duras (specs como fuente de verdad, nunca
  decidir sin aprobación, documentar desviaciones por partida doble).
- Creada la estructura de `specs/`.
- Añadido `09-testing.md`, no previsto en la estructura propuesta inicialmente, por
  el énfasis del usuario en Q8 ("documenta que vas a testear cada nueva feature y
  fix importante").
- Registradas las decisiones de la primera ronda de preguntas (Q1-Q44) como ADRs
  0001-0017.
- Abiertas 9 preguntas en `OPEN-QUESTIONS.md`.

## [2026-09-09] Ronda 2 de decisiones

- Aprobadas ADR-0006 (ESLint + Prettier), ADR-0010 (rutas sin traducir), ADR-0014
  (movimiento y efectos) y ADR-0015 (Vercel Web Analytics).
- Resuelta Q-A: los iconos de tecnologías se dibujan a mano, uno por archivo →
  **ADR-0018**. Actualizada la §6 de `02-design-system.md`.
- Q34 (lista de tecnologías) pasa de "aplazado" a **bloqueante**, como consecuencia
  de ADR-0018: sin la lista no se puede dimensionar el trabajo de iconos.
- Nueva **ADR-0019** (pantalla de carga): análisis de qué se ve durante el script
  del tema y del coste de un overlay de carga. Pendiente de decisión.
- Nueva **ADR-0020** (envío de correo): reemplaza el análisis de Q-H, que estaba
  mal planteado — el riesgo de spam afecta al buzón del destinatario, y el
  destinatario aquí es el propio usuario. Pendiente de decisión.
- Nueva **ADR-0021** (proceso de diseño): viabilidad de mockups en Figma frente a
  una ruta `/styleguide` en el propio proyecto. Pendiente de decisión.
- Q-H retirada y sustituida por Q-J en `OPEN-QUESTIONS.md`.

## [2026-09-09] Ronda 3

- Aprobadas ADR-0019 (boot sequence acotada, primera visita de sesión, retirada
  por CSS), ADR-0020 (Resend con dominio de pruebas → Gmail, con Nodemailer+SMTP
  como alternativa) y ADR-0021 (ruta `/styleguide` en lugar de mockups en Figma).
- Nuevo `10-tech-catalog.md` con las 10 tecnologías confirmadas por el usuario y
  una ampliación propuesta en tres grupos.
- `04-content-model.md` actualizado para apuntar al nuevo catálogo.
- Q34 deja de ser bloqueante para el grueso del trabajo: hay lista base con la que
  empezar.

## [2026-09-09] Ronda 3 — decisiones menores

- **Q-B** resuelta: el home usa la misma `ProjectCard` que `/projects`, con prop
  `variant` reservada para el futuro. → `05-pages/home.md`, `06-components.md`.
- **Q-C** resuelta: sin filtros en `/projects`. → `05-pages/projects.md`.
- **Q-D** resuelta: skills solo agrupadas por categoría, sin nivel de dominio.
  → `05-pages/about.md`.
- **Q-E** resuelta: galería del detalle en línea con enlace a imagen completa, sin
  lightbox. → `05-pages/project-detail.md`.
- **Q-G** sigue abierta (PDF del CV estático o generado).

## [2026-09-09] Ronda 4

- Catálogo de tecnologías cerrado en **25 entradas** (`10-tech-catalog.md`).
  Selección del carrusel pendiente.
- Detectado que Express **no tiene logotipo icónico**: su marca es la palabra
  escrita. Se recomienda dejarlo fuera del carrusel y mantenerlo como etiqueta de
  texto.
- **Q-G** resuelta: PDF del CV estático, mantenido por el usuario.
  → `05-pages/resume.md`, con nota de riesgo de desincronización.
- **ADR-0021 corregida** a petición del usuario: se reconoce explícitamente que
  `/styleguide` **es implementación**, no una fase previa. La comparación original
  con Figma estaba mal planteada.
- Nuevo `11-styleguide.md`: alcance acotado del primer incremento de
  implementación, aprobado por el usuario.

## [2026-09-09] Ronda 5

- **Q-K** resuelta: el carrusel muestra **las 25** tecnologías, no una selección de
  16. Es una derogación de una regla previa → primera entrada en `DEVIATIONS.md`.
  Consecuencia: la fase 1 de iconos pasa de 16 a 25 dibujos.
- **Q-L** resuelta: Express entra en el carrusel con la marca circular "ex"
  aportada por el usuario. Segunda entrada en `DEVIATIONS.md`. Anotada la reserva
  de legibilidad a 24px, a validar en la hoja de calibración.
- Ambas decisiones propagadas a `10-tech-catalog.md` y `05-pages/home.md`.
- Detectados dos huecos no vistos en rondas anteriores: **Q-M** (marca, logotipo y
  favicon: nunca definidos) y **Q-N** (densidad del header: 8 elementos). Añadida
  también **Q-O** (traducción del titular del hero).

## [2026-09-09] Ronda 6

- **Q-M** resuelta: marca denominativa "Daxho" en JetBrains Mono → nuevo
  `12-brand.md`, con las variantes de favicon y tres candidatos de detalle de
  acento a elegir en la hoja de calibración.
- **Q-N** resuelta de forma distinta a la recomendada: en lugar de eliminar
  "Home", la navegación cambia de forma en tres modos (completo / dropdown /
  sidebar). Los 5 enlaces se conservan. → `06-components.md`.
- **Q37** resuelta: tres campos (nombre, correo, mensaje). Sin asunto.
- **Q40** resuelta: destinatario `developer.daxho@gmail.com`. Anotado el requisito
  operativo de registrar la cuenta de Resend con esa misma dirección.
- `05-pages/contact.md` deja de estar bloqueada; quedan Q38 (anti-spam) y Q41
  (persistencia).

## [2026-09-09] Ronda 7

- **Q-O** resuelta: se conserva el texto original del brief; el registro underground
  lo aporta la forma (minúsculas, monoespaciada, prompt `>`, cursor `▮`, typing
  encadenado con la boot sequence). En español se elige **"guarida"** sobre
  "rincón". Sin desviación del brief, por tanto sin entrada en `DEVIATIONS.md`.
  Fijado que el subtítulo debe contener "Software Engineer".
  → `05-pages/home.md`.
- Nuevo `13-roadmap.md`: plan de implementación en 10 fases con camino crítico,
  entregable revisable por fase y acciones del usuario. Pendiente de aprobación.

## [2026-09-09] Fase 1 — implementación

- Implementado el incremento 1 (`11-styleguide.md`) en la rama
  `feat/design-system`. Lint, typecheck y 39 tests unitarios en verde.
- **Hallazgo de contraste:** `border-default` daba 1.68:1 (claro) y 1.35:1
  (oscuro) contra el fondo, incumpliendo el 3:1 que WCAG 1.4.11 exige a los
  bordes que delimitan un control. Añadido el token `--border-interactive`
  (ink-400), que cumple sobre todas las superficies de ambos temas. Protegido
  por test. → `02-design-system.md`.
- **Hallazgo de presupuesto:** React son 57 KB gzip solo por su runtime.
  Presupuesto elevado a 75 KB por decisión del usuario → `DEVIATIONS.md`.
- Añadida `src/lib/contrast.ts`: calcula los ratios WCAG reales en el build, de
  modo que `/styleguide` muestra valores medidos y no estimaciones.
- Añadida `src/lib/palette.ts` como espejo de `tokens.css`, con un test que
  impide que ambos se desincronicen.

## [2026-09-09] Fase 1 — revisión visual del usuario

Cinco correcciones sobre lo implementado, más dos cambios de mecanismo:

- **Glitch:** rehecho con **PowerGlitch** por petición del usuario (antes CSS
  puro). Más agresivo, capas teñidas en varios rojos de la rampa Blood en lugar
  de gris, y deformación de las letras aportada por CSS. Sigue siendo disparado
  y sigue sin inicializarse bajo `prefers-reduced-motion`. → `DEVIATIONS.md`.
- **Iconos:** se abandona el dibujo a mano y el lineart. 24 de 25 desde Simple
  Icons como siluetas sólidas; Playwright es el único propio. Dos entradas en
  `DEVIATIONS.md` (estrategia y estilo). **La fase 3 del roadmap desaparece.**
- **Carrusel:** los iconos se apelotonaban en el centro porque cada grupo era
  más estrecho que el contenedor; ahora la lista se repite hasta llenar. La
  velocidad pasa a definirse **por icono** (3 s) en lugar de como duración
  total, para que se perciba igual con 3 tecnologías que con 25.
- **Grain:** opacidad subida de 0.035 a 0.11 (claro) y de 0.05 a 0.16 (oscuro).
- **Caret:** tenía tres estados de color porque se solapaban dos animaciones
  cuyos valores se componían. Ahora es una sola animación con `step-end`: corte
  seco entre invisible y opaco.
- **Cursor:** Tailwind v4 dejó de dar `cursor: pointer` a `<button>` en su
  preflight. Restituido en la capa base, con `not-allowed` para deshabilitados.
- **ProjectCard** pasa a ser `<article>`: es contenido autónomo y además lo hace
  localizable por rol en los tests.
- Catálogo de las 25 tecnologías escrito en código, con `TechIcon.astro` como
  único punto de entrada; falla el build si una clave no existe.

**Verificación:** lint limpio · typecheck 0 errores · 39 tests unitarios ·
**23 tests E2E en verde** · JS 62,6 KB gzip de los 75 KB de presupuesto.

## [2026-09-09] Cierre de la fase 1

- **Q-M resuelta:** marca `>daxho▮` — prompt más cursor de bloque. Combina los
  dos candidatos más fuertes y encadena con la boot sequence y con el prompt del
  hero. → `12-brand.md`. Eliminadas las variantes descartadas del componente.
- **Paleta y sistema de temas aprobados por el usuario** tras revisarlos en
  `/styleguide`. El rojo sangre queda fijado con la rampa doble de ADR-0012.
- **Grain rehecho.** No se veía en tema claro por dos motivos: `feTurbulence`
  genera ruido de color con alfa variable que sobre fondo claro queda lavado, y
  la opacidad era demasiado baja. Ahora el ruido pasa por `feColorMatrix` a
  escala de grises y la capa se sitúa **detrás del contenido** (`z-index: -1`)
  en lugar de encima, lo que permite subir la intensidad sin tocar ningún ratio
  de contraste. Intensidad por tema mediante `--grain-opacity`: 0.42 en claro,
  0.16 en oscuro. → `02-design-system.md` §8.1.
