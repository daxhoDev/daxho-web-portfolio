# ADR-0008 — i18n: rutas prefijadas, inglés sin prefijo

**Estado:** APROBADA · 2026-09-09

## Contexto
Requisito original: "el idioma seleccionado se almacena en local storage". Un sitio
estático no puede servir dos idiomas desde la misma URL sin sacrificar SEO y sin
provocar parpadeo de contenido.

## Decisión
- Se usa el enrutado i18n **nativo de Astro** (`i18n` en `astro.config`), sin
  librerías externas.
- `defaultLocale: 'en'` con `prefixDefaultLocale: false` → el inglés vive en `/`,
  `/projects`, `/about`...
- El español vive bajo `/es/` → `/es`, `/es/projects`, `/es/about`...
- Los diccionarios de UI son objetos TypeScript tipados en `src/i18n/`.
- Cada página emite `<html lang>`, `<link rel="alternate" hreflang="...">` para
  ambos idiomas y `hreflang="x-default"` apuntando al inglés.

## Razones
- Cada idioma tiene su propia URL indexable: el español posiciona de verdad.
- El contenido se renderiza en el build, no se intercambia en cliente: sin
  parpadeo, sin JS necesario para leer la página.
- Astro lo soporta de forma nativa; una librería añadiría dependencia y ganancia
  nula para dos idiomas.

## Consecuencias
- Todo enlace interno debe construirse con un helper (`localizePath`) que
  antepone el prefijo cuando toca. Enlaces `href` escritos a mano son un bug.
- El selector de idioma debe llevar a la **página equivalente**, no al home.
