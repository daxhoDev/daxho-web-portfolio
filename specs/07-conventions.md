# 07 — Convenciones

**Estado:** APROBADA (base) · 2026-09-09

## Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `ProjectCard.astro` |
| Utilidades y hooks | camelCase | `localizePath.ts` |
| Archivos de contenido | kebab-case | `task-manager-app.mdx` |
| Rutas / slugs | kebab-case | `/projects/task-manager-app` |
| Custom properties CSS | kebab-case con prefijo semántico | `--bg-surface` |
| Constantes | SCREAMING_SNAKE_CASE | `MAX_MESSAGE_LENGTH` |
| Ramas | `tipo/descripcion-corta` | `feat/theme-toggle` |

**Todo identificador va en inglés.** La documentación de `specs/` va en español.

## CSS

- Tailwind primero. CSS propio solo para lo que Tailwind no cubre: animaciones
  complejas, typing, carrusel.
- El CSS propio vive junto a su componente o en `src/styles/`, nunca disperso.
- **Prohibido escribir un color literal en un componente.** Siempre token
  semántico.
- Orden de clases Tailwind gestionado por `prettier-plugin-tailwindcss`; no se
  ordena a mano.
- Mobile-first: los estilos base son móvil, los modificadores suben.
- `!important` requiere un comentario justificándolo.

## Accesibilidad — reglas duras

1. HTML semántico antes que ARIA. Un `<button>` es un `<button>`.
2. Un solo `<h1>` por página; sin saltos en la jerarquía de encabezados.
3. Toda imagen con `alt`; `alt=""` solo si es puramente decorativa.
4. Contraste mínimo AA (ver `02-design-system.md` §2.4).
5. Anillo de foco visible siempre. Prohibido eliminarlo sin sustituirlo.
6. Área táctil mínima 44×44px.
7. Todo lo operable con ratón debe serlo con teclado.
8. `prefers-reduced-motion` respetado sin excepciones.
9. `<html lang>` correcto en cada página.
10. El sitio debe ser legible y navegable con JavaScript desactivado, **sin
    excepciones**: desde el 2026-09-16 también el formulario de contacto funciona
    sin JS (`05-pages/contact.md`).

## TypeScript

- `strict` activo. Sin `any` implícito; un `any` explícito lleva comentario.
- Alias `@/*` para todo import fuera del directorio propio.
- Los tipos de contenido se derivan de los esquemas Zod, no se escriben a mano.

## Git

Ver ADR-0017. Resumen:
- `master` ← `development` ← ramas de trabajo.
- El merge a `master` lo hace el usuario; el agente trabaja siempre contra
  `development`.
- Conventional Commits, en inglés, en imperativo.
- CI en verde es condición para mergear.
- El agente no commitea ni hace push sin petición explícita del usuario.

## Comentarios

- Se comenta el **porqué**, no el **qué**.
- Todo truco no obvio (el script inline del tema, el `::after` de la card, la
  duplicación del track del carrusel) lleva un comentario que enlace a la spec
  correspondiente.
