# 03 — Arquitectura

**Estado:** APROBADA (base) · 2026-09-09

## Stack

| Capa | Elección | ADR |
|---|---|---|
| Framework | Astro | — |
| Estilos | Tailwind CSS v4 | ADR-0002 |
| Interactividad | React (islas) | — |
| Lenguaje | TypeScript strict | ADR-0003 |
| Contenido | Content Collections + MDX | ADR-0005 |
| Paquetes | pnpm | ADR-0001 |
| Hosting | Vercel | ADR-0004 |
| Email | Resend | `08-integrations.md` |
| Tests | Vitest + Playwright | ADR-0007 |

## Modelo de renderizado

`output: 'static'`. Todas las páginas se prerenderizan en el build. Única
excepción: `src/pages/api/contact.ts` con `export const prerender = false`,
desplegado como función serverless (ADR-0004).

## Filosofía de islas

**Regla: por defecto, cero JavaScript.** Un componente solo se convierte en isla
React si necesita estado o eventos del navegador. Todo lo demás es `.astro` puro.

Islas previstas (y solo estas, salvo aprobación):

| Isla | Directiva | Motivo |
|---|---|---|
| `ThemeToggle` | `client:load` | debe responder de inmediato; está en el header |
| `LanguageSwitcher` | `client:load` | ídem |
| `MobileNav` | `client:idle` | no se usa hasta que se toca |
| `ContactForm` | `client:visible` | está al final de su página |
| `TypingHero` | `client:load` | es lo primero que se ve |

El carrusel de tecnologías y el grain se resuelven con **CSS puro**, sin isla y
sin JavaScript.

El **glitch** usa la librería PowerGlitch (~2,5 KB gzip) desde un `<script>`
normal, no una isla React. Ver `DEVIATIONS.md`.

## Estructura de carpetas

```
/
├── AGENTS.md
├── specs/
├── public/
│   ├── fonts/                (si no se usa el paquete de Fontsource)
│   ├── resume/               (PDF del CV)
│   └── favicon/
├── src/
│   ├── assets/               (imágenes procesadas por Astro)
│   │   ├── projects/
│   │   └── profile/
│   ├── components/
│   │   ├── ui/               (primitivos: Button, Card, Chip, Tag)
│   │   ├── layout/           (Header, Footer, Nav, Container)
│   │   ├── sections/         (Hero, TechCarousel, FeaturedProjects, CtaBand)
│   │   ├── project/          (ProjectCard, ProjectGallery, StackRow)
│   │   └── islands/          (componentes React)
│   ├── content/
│   │   ├── config.ts         (esquemas Zod)
│   │   ├── projects/
│   │   │   ├── en/
│   │   │   └── es/
│   │   └── experience/
│   ├── i18n/
│   │   ├── ui.ts             (diccionarios)
│   │   ├── utils.ts          (localizePath, getLangFromUrl, t)
│   │   └── routes.ts         (mapa de rutas equivalentes entre idiomas)
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ProjectLayout.astro
│   ├── lib/                  (utilidades puras — objetivo de Vitest)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── resume.astro
│   │   ├── contact.astro
│   │   ├── 404.astro
│   │   ├── es/               (espejo completo del árbol anterior)
│   │   ├── api/
│   │   │   └── contact.ts
│   │   └── og/               (generación de imágenes OG)
│   └── styles/
│       └── global.css        (@theme con los tokens de 02-design-system.md)
├── tests/
│   ├── unit/
│   └── e2e/
└── .github/workflows/
```

**Nota:** la duplicación del árbol bajo `src/pages/es/` es cómo Astro modela el
i18n de forma nativa. Para evitar duplicar lógica, cada página `es/` debe ser una
cáscara mínima que reutilice el mismo componente de página que su equivalente en
inglés, pasándole el locale. Duplicar markup entre `index.astro` y
`es/index.astro` es un error de implementación.

## Variables de entorno

Ver `08-integrations.md`. Ninguna clave secreta puede aparecer en código de
cliente. Las variables públicas usan el prefijo `PUBLIC_`.

## Rendimiento

Presupuesto vinculante (ver `09-testing.md`):
- JS enviado al cliente en el home: **< 75 KB** comprimido (gzip).
  Elevado desde 50 KB por decisión del usuario, ver `DEVIATIONS.md`. El runtime
  de React son ~57 KB gzip por sí solo, así que 50 KB era incompatible con
  mantener React para las islas del header.
- LCP < 2.0 s, CLS = 0, INP < 200 ms.
- Todas las imágenes por el componente `<Image>` de Astro, en AVIF/WebP, con
  dimensiones explícitas y `loading="lazy"` salvo la del primer viewport.
