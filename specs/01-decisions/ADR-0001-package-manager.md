# ADR-0001 — Gestor de paquetes: pnpm

**Estado:** APROBADA · 2026-09-09

## Decisión
Se usa `pnpm`. Se fija la versión mediante el campo `packageManager` de
`package.json` para que CI y local coincidan.

## Razones
- Instalaciones más rápidas y `node_modules` mucho más pequeño (store enlazado).
- `node_modules` estricto: una dependencia no declarada no se puede importar por
  accidente, lo que evita fallos que solo aparecen en producción.
- Soporte nativo en Vercel.

## Consecuencias
- Solo se commitea `pnpm-lock.yaml`. Cualquier `package-lock.json` o `bun.lockb`
  que aparezca es un error y se borra.
- CI y Vercel deben usar pnpm explícitamente.
