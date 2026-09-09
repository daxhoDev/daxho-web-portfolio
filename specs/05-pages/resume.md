# Página: Resume (`/resume`, `/es/resume`)

**Estado:** BORRADOR · 2026-09-09
Añadida por decisión del usuario (Q28).

## Objetivo
Currículum consultable en web, con descarga en PDF.

## Estructura
1. **Cabecera**: `<h1>` "Resume" + **botón de descarga del PDF al inicio**
   (requisito explícito del usuario).
2. **Datos de contacto** (los públicos que decida el usuario).
3. **Perfil profesional**: párrafo breve.
4. **Experiencia**: de la colección `experience`, misma fuente que `/about`. No se
   duplica el dato.
5. **Skills**: del catálogo de tecnologías.
6. **Formación**: pendiente de contenido.
7. **Idiomas**: pendiente de contenido.

## PDF
**Decidido (Q-G): archivo estático mantenido por el usuario**, en
`public/resume/`. No se genera desde el contenido.

Motivo: generarlo automáticamente exige un pipeline de maquetación que cuesta más
de lo que aporta para un documento que cambia dos veces al año, y el CV es
precisamente el archivo que un reclutador abre con más atención. Mantenerlo a mano
da control milimétrico sobre la maqueta.

Reglas:
- Un archivo por idioma: `daxho-resume-en.pdf`, `daxho-resume-es.pdf`.
- El botón enlaza al del idioma activo.
- Atributo `download` y texto que indique formato y peso.

## Impresión
Hoja de estilos `@media print` que permita imprimir la versión web de forma
decente: sin header, sin footer, sin efectos, colores a negro sobre blanco.

## Riesgo asumido
Al ser estático, el PDF **puede desincronizarse** del contenido web de
`/resume`. Mitigación: al actualizar la colección `experience` se revisa si el PDF
necesita actualizarse, y se anota la fecha de última actualización del archivo en
esta spec.

Última actualización del PDF: _(sin archivo todavía)_

## Criterios de aceptación
- [ ] El botón de descarga es lo primero tras el `<h1>`.
- [ ] El enlace indica el idioma y el formato del archivo.
- [ ] La experiencia sale de la misma colección que `/about`, sin duplicar datos.
- [ ] La versión impresa es legible.
