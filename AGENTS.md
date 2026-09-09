# AGENTS.md — Reglas operativas del proyecto

Este archivo es de obligado cumplimiento para cualquier agente de IA que trabaje en
este repositorio. No es una guía de estilo: son reglas duras.

---

## Regla 1 — `specs/` es la única fuente de verdad

ABSOLUTAMENTE TODO lo que se haga en este repositorio debe seguir lo escrito en el
directorio `specs/`.

- Antes de escribir código, leer la spec correspondiente.
- Si el código y la spec discrepan, **la spec gana**: se corrige el código.
- Si la spec no cubre el caso, **no se improvisa**: se aplica la Regla 2.
- Ninguna decisión técnica, de diseño, de contenido o de proceso vive solo en el
  código o en la conversación. Si no está en `specs/`, no existe.

## Regla 2 — Nunca tomar decisiones por cuenta propia

Cada vez que haya más de una opción posible:

1. Estudiar las alternativas reales.
2. Descartar las menos viables, explicando por qué.
3. Presentar al usuario la que se considera mejor, con el razonamiento.
4. **ESPERAR SU APROBACIÓN EXPLÍCITA.**

**NUNCA SE IMPLEMENTA SIN LA APROBACIÓN DEL USUARIO.**

Esto incluye, sin excepción: elección de librerías, nombres de rutas, estructura de
carpetas, valores de tokens de diseño, textos visibles, cambios de alcance,
refactors no solicitados y cualquier "mejora" no pedida.

Toda duda, por pequeña que parezca, se consulta con el usuario. Preguntar nunca es
un fallo; asumir sí lo es.

## Regla 3 — Toda desviación se documenta por partida doble

Si el usuario decide explícitamente cambiar o romper una regla ya escrita en
`specs/`:

1. Se actualiza el archivo de `specs/` que corresponda, para que la spec siga
   reflejando la verdad vigente.
2. Se añade una entrada en `specs/DEVIATIONS.md` con: fecha, regla anterior, regla
   nueva, motivo dado por el usuario y archivos afectados.
3. Se registra el cambio en `specs/CHANGELOG.md`.

Una desviación sin entrada en `DEVIATIONS.md` es un incumplimiento de este archivo.

---

## Reglas de trabajo derivadas

### Testing (ver `specs/09-testing.md`)
- Cada **nueva funcionalidad** se acompaña de sus tests en el mismo cambio.
- Cada **fix importante** incorpora un test de regresión que falle sin el arreglo.
- No se marca una tarea como terminada si sus tests no pasan.

### Idioma
- Conversación con el usuario y documentación de `specs/`: **español**.
- Código, identificadores, nombres de archivo, ramas y mensajes de commit: **inglés**.
- Contenido del sitio: inglés (por defecto) y español.

### Git (ver `specs/07-conventions.md`)
- `master` = producción. `development` = integración previa. Ramas de trabajo
  (`feat/*`, `fix/*`, ...) mergean a `development`; `development` mergea a `master`.
- Conventional Commits.
- No se commitea ni se hace push sin que el usuario lo pida.

### Honestidad de reporte
- Si algo no se ha probado, se dice.
- Si un test falla, se muestra la salida; no se maquilla.
- No se afirma que algo funciona sin haberlo verificado.

### Preguntas abiertas
Toda decisión pendiente se registra en `specs/OPEN-QUESTIONS.md`. No se implementa
nada que dependa de una pregunta abierta sin resolverla antes con el usuario.
