/**
 * Redes sociales — fuente única para el footer y /resume (04-content-model.md).
 *
 * TODO(fase 10): URLs reales (Q36). Mientras tanto son placeholder con
 * `draft: true`, que la guarda de CI detecta y bloquea hacia `master`.
 */
export interface SocialLink {
  name: string;
  href: string;
  draft: boolean;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { name: 'GitHub', href: '#', draft: true },
  { name: 'LinkedIn', href: '#', draft: true },
];
