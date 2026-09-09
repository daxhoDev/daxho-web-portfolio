# ADR-0017 — Git flow, commits y CI

**Estado:** APROBADA · 2026-09-09

## Ramas
- `master` — producción. Solo recibe merges desde `development`.
- `development` — integración. Capa previa a producción.
- Ramas de trabajo — nacen de `development` y mergean a `development`.

Nomenclatura de ramas de trabajo:
`feat/…`, `fix/…`, `docs/…`, `refactor/…`, `test/…`, `chore/…`
(ej. `feat/theme-toggle`, `fix/lang-redirect-loop`).

## Commits
Conventional Commits: `tipo(ámbito): descripción en imperativo, en inglés`.

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`.

Ejemplo: `feat(i18n): add language detection on first visit`

## Integración continua (GitHub Actions)
En cada push y cada PR hacia `development` y `master`:

1. `pnpm install --frozen-lockfile`
2. Lint
3. `astro check` (typecheck)
4. `pnpm build`
5. Tests unitarios (Vitest)
6. Tests E2E (Playwright)

Un merge con CI en rojo no se realiza.

## Regla operativa para el agente
El agente **no commitea ni hace push** salvo petición explícita del usuario.
