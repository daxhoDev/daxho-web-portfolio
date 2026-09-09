# specs/ — Especificación del proyecto

Fuente de verdad única de este repositorio. Ver `../AGENTS.md` para las reglas de
obligado cumplimiento.

## Índice

| Archivo | Contenido |
|---|---|
| `00-vision.md` | Objetivo, público, principios de producto |
| `01-decisions/` | ADRs: una decisión arquitectónica por archivo |
| `02-design-system.md` | Color, tipografía, espaciado, movimiento, tokens |
| `03-architecture.md` | Stack, estructura de carpetas, build, despliegue |
| `04-content-model.md` | Content Collections, esquemas, i18n de contenido |
| `05-pages/` | Una spec por página |
| `06-components.md` | Inventario y contrato de cada componente |
| `07-conventions.md` | Naming, commits, ramas, CSS, accesibilidad |
| `08-integrations.md` | Resend, analytics, variables de entorno |
| `09-testing.md` | Estrategia de tests y criterios de "hecho" |
| `10-tech-catalog.md` | Catálogo de tecnologías e iconos |
| `11-styleguide.md` | Ruta `/styleguide`: primer incremento de implementación |
| `12-brand.md` | Marca denominativa y favicon |
| `13-roadmap.md` | Plan de implementación por fases |
| `OPEN-QUESTIONS.md` | Decisiones pendientes de aprobación del usuario |
| `DEVIATIONS.md` | Reglas cambiadas por decisión explícita del usuario |
| `CHANGELOG.md` | Historial de cambios de estas specs |

## Estados de una decisión

Cada ADR y cada sección lleva un estado:

- **APROBADA** — decidida por el usuario. Vinculante.
- **PROPUESTA** — recomendación del agente, **no** implementable todavía.
- **PENDIENTE** — sin respuesta. Bloquea el trabajo que dependa de ella.
- **SUPERSEDED** — sustituida por otra decisión (enlazar cuál).

## Cómo usar este directorio

1. Antes de implementar, leer la spec de la página o componente afectado.
2. Comprobar en `OPEN-QUESTIONS.md` que nada de lo que se va a tocar está pendiente.
3. Si aparece una decisión no cubierta, parar y preguntar al usuario.
4. Tras un cambio aprobado, actualizar la spec + `CHANGELOG.md` (+ `DEVIATIONS.md`
   si se rompe una regla previa).
