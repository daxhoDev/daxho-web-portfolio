/**
 * Colecciones de contenido — ADR-0005, 04-content-model.md (APROBADA).
 *
 * En Astro 7 este archivo vive en `src/`, no en `src/content/config.ts`.
 *
 * El esquema es la primera barrera: Zod valida cada archivo en el build, así que
 * un proyecto sin captura, sin `alt` o con una tecnología que no existe hace
 * FALLAR el build en lugar de publicarse roto. Las reglas que afectan al
 * conjunto (3 destacados, ambos idiomas) no caben en un esquema por entrada y
 * viven en `src/lib/projects.ts`.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { TECH_CATALOG } from './content/tech';

const TECH_KEYS = new Set(TECH_CATALOG.map((tech) => tech.key));

const projects = defineCollection({
  // `src/content/projects/{lang}/{slug}.mdx` → id `{lang}/{slug}`.
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        // Se usa en la card y en la meta description: 160 es el límite útil.
        summary: z.string().min(1).max(160),
        cover: image(),
        // Obligatoria y nunca autogenerada (project-detail.md).
        coverAlt: z.string().min(1),
        gallery: z
          .array(
            z.object({
              image: image(),
              alt: z.string().min(1),
              caption: z.string().optional(),
            }),
          )
          .default([]),
        stack: z
          .array(z.string())
          .min(1)
          .refine((keys) => keys.every((key) => TECH_KEYS.has(key)), {
            message: 'Toda clave de stack debe existir en src/content/tech.ts.',
          }),
        liveUrl: z.url().optional(),
        repoUrl: z.url().optional(),
        featured: z.boolean(),
        featuredOrder: z.number().int().positive().optional(),
        order: z.number().int(),
        year: z.number().int().min(2000).max(2100),
        role: z.string().optional(),
        status: z.enum(['live', 'archived', 'wip']),
        // Por defecto `true`: olvidarse del campo nunca publica relleno.
        draft: z.boolean().default(true),
        // Traducción generada por el agente, pendiente de revisión (04, Q15).
        translatedByAgent: z.boolean().default(false),
      })
      .refine((data) => !data.featured || data.featuredOrder !== undefined, {
        message: 'featuredOrder es obligatorio cuando featured es true.',
        path: ['featuredOrder'],
      }),
});

export const collections = { projects };
