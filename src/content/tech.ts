/**
 * Catálogo de tecnologías — implementa 10-tech-catalog.md.
 *
 * Fuente ÚNICA para el carrusel del home, la fila de stack de cada
 * ProjectCard, el stack del detalle de proyecto y las skills de /about.
 *
 * `icon` es el slug de Simple Icons. Las 25 salen de la librería salvo
 * Playwright, que no está y se dibuja a mano (ver DEVIATIONS.md).
 */

export type TechCategory = 'language' | 'framework' | 'tool' | 'platform';

export interface TechEntry {
  key: string;
  label: string;
  category: TechCategory;
  /** Slug de Simple Icons, o `null` si el icono es propio. */
  icon: string | null;
  /**
   * Por decisión del usuario (DEVIATIONS.md) el carrusel muestra las 25:
   * este campo se conserva por si en el futuro se quiere volver a filtrar.
   */
  inCarousel: boolean;
}

export const TECH_CATALOG: readonly TechEntry[] = [
  // Lenguajes
  { key: 'typescript', label: 'TypeScript', category: 'language', icon: 'typescript', inCarousel: true },
  { key: 'javascript', label: 'JavaScript', category: 'language', icon: 'javascript', inCarousel: true },
  { key: 'python', label: 'Python', category: 'language', icon: 'python', inCarousel: true },
  { key: 'bash', label: 'Bash', category: 'language', icon: 'gnubash', inCarousel: true },

  // Frontend
  { key: 'react', label: 'React', category: 'framework', icon: 'react', inCarousel: true },
  { key: 'nextjs', label: 'Next.js', category: 'framework', icon: 'nextdotjs', inCarousel: true },
  { key: 'astro', label: 'Astro', category: 'framework', icon: 'astro', inCarousel: true },
  { key: 'tailwindcss', label: 'Tailwind CSS', category: 'framework', icon: 'tailwindcss', inCarousel: true },
  { key: 'vite', label: 'Vite', category: 'tool', icon: 'vite', inCarousel: true },

  // Backend
  { key: 'nodejs', label: 'Node.js', category: 'platform', icon: 'nodedotjs', inCarousel: true },
  { key: 'express', label: 'Express', category: 'framework', icon: 'express', inCarousel: true },
  { key: 'nestjs', label: 'NestJS', category: 'framework', icon: 'nestjs', inCarousel: true },
  { key: 'django', label: 'Django', category: 'framework', icon: 'django', inCarousel: true },

  // Datos
  { key: 'postgresql', label: 'PostgreSQL', category: 'platform', icon: 'postgresql', inCarousel: true },
  { key: 'mongodb', label: 'MongoDB', category: 'platform', icon: 'mongodb', inCarousel: true },
  { key: 'supabase', label: 'Supabase', category: 'platform', icon: 'supabase', inCarousel: true },

  // Infraestructura
  { key: 'docker', label: 'Docker', category: 'tool', icon: 'docker', inCarousel: true },
  { key: 'linux', label: 'Linux', category: 'platform', icon: 'linux', inCarousel: true },
  { key: 'git', label: 'Git', category: 'tool', icon: 'git', inCarousel: true },
  { key: 'github', label: 'GitHub', category: 'platform', icon: 'github', inCarousel: true },
  { key: 'vercel', label: 'Vercel', category: 'platform', icon: 'vercel', inCarousel: true },

  // Herramientas y calidad
  { key: 'postman', label: 'Postman', category: 'tool', icon: 'postman', inCarousel: true },
  { key: 'figma', label: 'Figma', category: 'tool', icon: 'figma', inCarousel: true },
  { key: 'vitest', label: 'Vitest', category: 'tool', icon: 'vitest', inCarousel: true },
  // Único sin trazado oficial en Simple Icons: icono propio.
  { key: 'playwright', label: 'Playwright', category: 'tool', icon: null, inCarousel: true },
] as const;

export function getCarouselTech(): readonly TechEntry[] {
  return TECH_CATALOG.filter((entry) => entry.inCarousel);
}

export function getTechByKey(key: string): TechEntry | undefined {
  return TECH_CATALOG.find((entry) => entry.key === key);
}
