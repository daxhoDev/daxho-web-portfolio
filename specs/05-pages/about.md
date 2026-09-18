# Página: About (`/about`, `/es/about`)

**Estado:** APROBADA · 2026-09-16 · absorbe `/resume` el mismo día (ver `../DEVIATIONS.md`) · se construye en la fase 6; SEO en la fase 8
Añadida por decisión del usuario (Q30).

## Objetivo
Contar quién es Daxho con más profundidad que el home: trayectoria, capacidades y
una cara. **Es también la página del CV**: desde el 2026-09-16 no existe `/resume`,
porque mostraba lo mismo (decisión del usuario, `DEVIATIONS.md`).

## Secciones, en orden

### 1. Encabezado
- `<h1>` de la página con efecto de tecleo (disparado, ver ADR-0014).
- Entradilla de una o dos frases. Relleno hasta la fase 10 (Q32).
- **Botón de descarga del CV justo tras la entradilla**: es lo primero que se ve al
  entrar. Reglas en la sección "PDF del CV".

### 2. Biografía + fotografía
- Texto largo (2-4 párrafos), ancho de lectura máximo 65ch. Relleno hasta la fase
  10 (Q32).
- Fotografía de Daxho. Pendiente de la imagen real (Q33); mientras tanto,
  placeholder marcado.

### 3. Skills
- Agrupadas con los **seis grupos de `10-tech-catalog.md`**: Lenguajes, Frontend,
  Backend, Datos, Infraestructura y Herramientas. Las 25 tecnologías del
  catálogo, sin selección (`src/content/skills.ts`).
- Icono de tecnología (silueta sólida, ver `02-design-system.md` §6) + etiqueta.
- **Sin nivel de dominio** (Q-D decidida): solo agrupación por categoría. Los
  niveles autoasignados no son verificables y un entrevistador técnico los lee con
  escepticismo. La prueba del nivel son los proyectos.

### 4. Experiencia
- Línea de tiempo vertical alimentada por la colección `experience`.
- Cada entrada: empresa, rol, rango de fechas, hitos, stack.
- Marcado semántico con `<ol>`: es una secuencia ordenada, no decoración.
- **De más reciente a más antigua** (`startDate` descendente).
- Relleno marcado hasta la fase 10.

### 5. Formación
- `src/content/education.ts`. Relleno hasta la fase 10.

### 6. Idiomas
- `src/content/languages.ts`. Relleno hasta la fase 10.

### 7. CTA
- Enlace a `/contact`, con el texto de la navegación. (El enlace a `/resume`
  desapareció con la página.)

## PDF del CV

**Decidido (Q-G): archivo estático mantenido por el usuario**, en
`public/resume/`. No se genera desde el contenido: generarlo exige un pipeline de
maquetación que cuesta más de lo que aporta para un documento que cambia dos veces
al año, y el CV es el archivo que un reclutador abre con más atención.

- Un archivo por idioma: `daxho-resume-en.pdf`, `daxho-resume-es.pdf`. El botón
  enlaza al del idioma activo.
- Atributo `download` y texto que indique formato, idioma y peso.
- **El peso se lee del archivo al compilar, y si falta un PDF el build falla.**
- Hasta la fase 10 hay un PDF de relleno por idioma, marcado PLACEHOLDER.
  Cambiarlo es sustituir el archivo.

**Riesgo asumido:** al ser estático, el PDF puede desincronizarse de la página. Al
actualizar `experience`, formación o idiomas se revisa si el PDF necesita
actualizarse, y se anota aquí la fecha.

Última actualización del PDF: _(PDF de relleno, 2026-09-16; el real llega en la fase 10)_

## Impresión

Hoja `@media print`: sin header, sin footer, sin efectos, negro sobre blanco. Los
encabezados tecleados se fuerzan visibles (los que no entraron en pantalla siguen
en pausa e invisibles), y los pseudo-elementos (nodos de la línea de tiempo,
viñetas) se recolorean aparte porque `*` no los alcanza.

## SEO

La fase 6 entrega `<title>` y `hreflang`; el JSON-LD llega en la fase 8.

- `<title>`: "About — Daxho" · es: "Sobre mí — Daxho"
- `description` (aprobada el 2026-09-17):
  - en: "Software Engineer: experience, stack, education and languages. CV
    available to download."
  - es: "Software Engineer: experiencia, stack, formación e idiomas. CV
    disponible para descargar."
- JSON-LD `Person` ampliado (`alumniOf`, `knowsAbout`, `worksFor`).

## Criterios de aceptación
- [ ] La línea de tiempo es legible como lista por un lector de pantalla.
- [ ] La fotografía tiene `alt` descriptivo y dimensiones explícitas.
- [ ] El botón de descarga del CV es lo primero interactivo tras el `<h1>`.
- [ ] El enlace indica el idioma, el formato y el peso del archivo.
- [ ] La versión impresa es legible.
- [ ] Contenido completo en ambos idiomas.
