// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// ADR-0004: output estático. La única ruta con servidor será /api/contact
// (fase 7), marcada con `export const prerender = false`.
// ADR-0016: SITE_URL nunca se hardcodea; sale del entorno para que migrar a
// dominio propio sea un cambio de configuración.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'static',
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
