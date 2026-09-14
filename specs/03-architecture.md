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

El carrusel de tecnologías, el grain y el **typing** se resuelven con **CSS
puro**, sin isla y sin JavaScript.

La única excepción es el **disparo del typing al entrar en pantalla**, que usa un
`IntersectionObserver` de unos cientos de bytes en un `<script is:inline>`, no
una isla React. Es una **mejora progresiva**: sin JavaScript el tecleo arranca
con la carga de la página y el texto se ve igual, nunca invisible. Ver
`DEVIATIONS.md`.

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
│   │   ├── ui/               (primitivos: Button, Card, Chip, Container,
│   │   │                      SectionHeading, TypingText, Icon)
│   │   ├── layout/           (Header, Brand, Nav, Footer, SkipLink,
│   │   │                      BootSequence — solo .astro)
│   │   ├── sections/         (Hero, TechCarousel, FeaturedProjects, CtaBand)
│   │   ├── project/          (ProjectCard, ProjectGallery, StackRow)
│   │   └── islands/          (componentes React)
│   ├── content.config.ts     (esquemas Zod; en Astro 7 vive en src/, no en
│   │                          src/content/)
│   ├── content/
│   │   ├── tech.ts           (catálogo de tecnologías)
│   │   ├── projects/
│   │   │   ├── en/
│   │   │   └── es/
│   │   └── experience/
│   ├── i18n/
│   │   ├── ui.ts             (diccionarios)
│   │   └── utils.ts          (localizePath, getLangFromUrl, canonicalPath,
│   │                          alternatePath, alternates, useTranslations)
│   ├── views/                (cuerpo de cada página, compartido entre / y /es)
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

Esos componentes de página viven en **`src/views/`** (decisión del usuario,
2026-09-14): `views/ProjectsView.astro` sirve `/projects` y `/es/projects`. Las
rutas dinámicas delegan igual en su layout (`ProjectLayout`).

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
