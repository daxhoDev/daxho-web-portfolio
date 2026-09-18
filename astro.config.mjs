// @ts-check
import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

import { sitemapFilter } from './src/lib/sitemap';

// ADR-0004: output estático. La única ruta con servidor será /api/contact
// (fase 7), marcada con `export const prerender = false`.
// ADR-0016: SITE_URL nunca se hardcodea; sale del entorno para que migrar a
// dominio propio sea un cambio de configuración.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'static',
  // ADR-0008: enrutado i18n nativo, sin librerías. El inglés vive en `/` y el
  // español bajo `/es`. `redirectToDefaultLocale: false` porque la detección de
  // idioma es de cliente (ADR-0009) y una redirección de servidor rompería la
  // regla 5: los rastreadores no deben ser redirigidos.
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  adapter: vercel(),
  // 08-integrations.md: los secretos se leen EN TIEMPO DE EJECUCIÓN con
  // `astro:env/server`, nunca incrustados en el build. La clave es opcional para
  // que el sitio compile sin ella (en local y en CI); sin clave, el endpoint
  // responde con error en vez de fingir un envío.
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'developer.daxho@gmail.com',
      }),
      CONTACT_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'onboarding@resend.dev',
      }),
    },
  },
  // ADR-0005: MDX para el cuerpo largo del detalle de proyecto.
  // ADR-0016: el sitemap incluye los dos idiomas y se anuncia en robots.txt.
  integrations: [
    react(),
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
      // La regla vive en src/lib/sitemap.ts, donde los tests pueden leerla.
      filter: sitemapFilter,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
