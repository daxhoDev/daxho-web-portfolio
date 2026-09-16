/**
 * Skills — 04-content-model.md, 05-pages/about.md.
 *
 * Los seis grupos de 10-tech-catalog.md, con las 25 tecnologías del catálogo.
 * **Sin nivel de dominio** (Q-D): la prueba del nivel son los proyectos.
 *
 * El título de cada grupo sale de los diccionarios (`skills.group.*`); aquí solo
 * vive la estructura. Toda clave debe existir en el catálogo: lo verifica un
 * test unitario.
 */
export interface SkillGroup {
  id: 'languages' | 'frontend' | 'backend' | 'data' | 'infrastructure' | 'tools';
  keys: readonly string[];
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  { id: 'languages', keys: ['typescript', 'javascript', 'python', 'bash'] },
  { id: 'frontend', keys: ['react', 'nextjs', 'astro', 'tailwindcss', 'vite'] },
  { id: 'backend', keys: ['nodejs', 'express', 'nestjs', 'django'] },
  { id: 'data', keys: ['postgresql', 'mongodb', 'supabase'] },
  { id: 'infrastructure', keys: ['docker', 'linux', 'git', 'github', 'vercel'] },
  { id: 'tools', keys: ['postman', 'figma', 'vitest', 'playwright'] },
];
