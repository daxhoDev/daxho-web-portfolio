# Página: Resume (`/resume`, `/es/resume`)

**Estado:** APROBADA · 2026-09-16 · se construye en la fase 6
Añadida por decisión del usuario (Q28).

## Objetivo
Currículum consultable en web, con descarga en PDF.

## Estructura
1. **Cabecera**: `<h1>` "Resume" + **botón de descarga del PDF al inicio**
   (requisito explícito del usuario).
2. **Datos de contacto** (decidido 2026-09-16): **GitHub, LinkedIn y un enlace al
   formulario de `/contact`**. Los perfiles salen de la misma fuente que el footer
   (`src/content/social.ts`) y son placeholder hasta la fase 10 (Q36). **El correo
   no se publica**: escrito en la página atrae spam, y el formulario existe
   justamente para no exponerlo.
3. **Perfil profesional**: párrafo breve. Relleno hasta la fase 10.
4. **Experiencia**: de la colección `experience`, misma fuente que `/about`. No se
   duplica el dato.
5. **Skills**: del catálogo de tecnologías.
6. **Formación**: `src/content/education.ts`. Relleno hasta la fase 10.
7. **Idiomas**: `src/content/languages.ts`. Relleno hasta la fase 10.

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
- Atributo `download` y texto que indique formato, idioma y peso.
- **El peso se lee del archivo real al compilar, y si falta un PDF el build
  falla** (decidido 2026-09-16). Nunca se publica un enlace roto ni un peso
  escrito a mano que se desincronice.
- **Hasta que el usuario aporte los suyos (fase 10), hay un PDF de relleno por
  idioma**, de una página y marcado PLACEHOLDER. Cambiarlo es sustituir el
  archivo.

## Impresión
Hoja de estilos `@media print` que permita imprimir la versión web de forma
decente: sin header, sin footer, sin efectos, colores a negro sobre blanco.

**Los encabezados tecleados se fuerzan visibles al imprimir.** Los que no han
entrado en pantalla siguen en pausa con los caracteres invisibles, y saldrían en
blanco en el papel.

## Riesgo asumido
Al ser estático, el PDF **puede desincronizarse** del contenido web de
`/resume`. Mitigación: al actualizar la colección `experience` se revisa si el PDF
necesita actualizarse, y se anota la fecha de última actualización del archivo en
esta spec.

Última actualización del PDF: _(PDF de relleno, 2026-09-16; el real llega en la fase 10)_

## Criterios de aceptación
- [ ] El botón de descarga es lo primero tras el `<h1>`.
- [ ] El enlace indica el idioma y el formato del archivo.
- [ ] La experiencia sale de la misma colección que `/about`, sin duplicar datos.
- [ ] La versión impresa es legible.
