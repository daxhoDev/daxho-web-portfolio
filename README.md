# daxho-web-portfolio

Portafolio web personal de **Dayron Alexis Díaz Rodríguez** (Daxho), Ingeniero de
Software.

## ⚠️ Lee esto antes de tocar nada

Este repositorio se rige por **[`AGENTS.md`](./AGENTS.md)** y por el directorio
**[`specs/`](./specs/)**, que es la fuente de verdad única. Si el código y la
spec discrepan, gana la spec.

Empieza por [`specs/README.md`](./specs/README.md).

## Stack

Astro · Tailwind CSS v4 · React (islas) · TypeScript strict · pnpm · Vercel

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Build de producción |
| `pnpm preview` | Sirve el build |
| `pnpm lint` | ESLint |
| `pnpm check` | Typecheck (`astro check`) |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm test:e2e` | Tests end-to-end (Playwright) |
| `pnpm verify` | Todo lo anterior, en orden |

## Estado

**Fase 1 de 10** — sistema de diseño. Ver
[`specs/13-roadmap.md`](./specs/13-roadmap.md).

La página `/styleguide` es el entregable de esta fase: muestra tokens,
tipografía, primitivos y efectos en ambos temas. No forma parte del sitio
público (`noindex`).
