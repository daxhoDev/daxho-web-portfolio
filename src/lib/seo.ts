/**
 * SEO: URLs absolutas y JSON-LD — ADR-0016, fase 8 (13-roadmap.md).
 *
 * Funciones puras, sin Astro ni entorno: objetivo de Vitest. Las páginas les
 * pasan la URL del sitio, que sale de `SITE_URL` y nunca se escribe a mano
 * (ADR-0004, ADR-0016).
 *
 * REGLA DURA: el contenido marcado `draft` NO entra en el JSON-LD. Un dato de
 * relleno en el HTML se ve y se corrige; en el JSON-LD se lo lleva un buscador y
 * lo publica como si fuera cierto.
 */
import type { Lang } from '@/i18n/utils';

export const SITE_NAME = 'Daxho';
export const PERSON_NAME = 'Daxho';
export const JOB_TITLE = 'Software Engineer';

/** Ancla estable del `Person`, para que todas las páginas hablen del mismo. */
export const PERSON_ID = '#person';

export interface JsonLdNode {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

/**
 * Une una ruta con la URL del sitio sin duplicar ni comerse barras, y **cierra
 * con barra** las rutas de página.
 *
 * Importa: la canónica que emite Astro lleva barra final, y el sitemap también.
 * Si el JSON-LD apuntara a la misma página sin ella, un buscador vería dos URL
 * distintas para una sola página. Los archivos (`.png`, `.txt`) se dejan tal
 * cual: ahí la barra sobra y rompería el enlace.
 */
export function absoluteUrl(siteUrl: string, path: string): string {
  const url = new URL(path, siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`);
  const last = url.pathname.split('/').pop() ?? '';
  const isFile = last.includes('.');

  if (!isFile && !url.pathname.endsWith('/') && !url.hash) {
    url.pathname = `${url.pathname}/`;
  }

  return url.toString();
}

export interface PersonOptions {
  siteUrl: string;
  lang: Lang;
  /** Perfiles públicos. Los placeholder de la fase 10 no llegan aquí. */
  sameAs?: readonly string[];
  /** Tecnologías del catálogo (10-tech-catalog.md). */
  knowsAbout?: readonly string[];
  /** Solo formación real: la de relleno se filtra antes de llamar. */
  alumniOf?: readonly string[];
  /** Solo experiencia real, por el mismo motivo. */
  worksFor?: readonly string[];
}

/**
 * `Person` del home y de `/about` (ADR-0016). El de `/about` es el mismo con
 * más campos: mismo `@id`, para que no parezcan dos personas distintas.
 */
export function personJsonLd({
  siteUrl,
  lang,
  sameAs,
  knowsAbout,
  alumniOf,
  worksFor,
}: PersonOptions): JsonLdNode {
  const node: JsonLdNode = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': absoluteUrl(siteUrl, PERSON_ID),
    name: PERSON_NAME,
    jobTitle: JOB_TITLE,
    url: absoluteUrl(siteUrl, lang === 'en' ? '/' : `/${lang}/`),
  };

  if (sameAs?.length) node.sameAs = [...sameAs];
  if (knowsAbout?.length) node.knowsAbout = [...knowsAbout];
  if (alumniOf?.length) {
    node.alumniOf = alumniOf.map((name) => ({ '@type': 'EducationalOrganization', name }));
  }
  if (worksFor?.length) {
    node.worksFor = worksFor.map((name) => ({ '@type': 'Organization', name }));
  }

  return node;
}

export interface ProjectJsonLdOptions {
  siteUrl: string;
  lang: Lang;
  /** Ruta del detalle, ya localizada. */
  path: string;
  title: string;
  summary: string;
  /** Ruta de la imagen OG del proyecto. */
  image: string;
  year: number;
  /** Etiquetas del stack, no las claves internas. */
  keywords: readonly string[];
  liveUrl?: string;
  repoUrl?: string;
}

/** `CreativeWork` de cada detalle de proyecto (ADR-0016). */
export function projectJsonLd({
  siteUrl,
  lang,
  path,
  title,
  summary,
  image,
  year,
  keywords,
  liveUrl,
  repoUrl,
}: ProjectJsonLdOptions): JsonLdNode {
  const sameAs = [liveUrl, repoUrl].filter((url): url is string => Boolean(url));

  const node: JsonLdNode = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: summary,
    url: absoluteUrl(siteUrl, path),
    image: absoluteUrl(siteUrl, image),
    inLanguage: lang,
    dateCreated: String(year),
    author: { '@id': absoluteUrl(siteUrl, PERSON_ID) },
  };

  if (keywords.length) node.keywords = [...keywords];
  if (sameAs.length) node.sameAs = sameAs;

  return node;
}

/**
 * JSON-LD listo para meter en un `<script>`. Los `<` se escapan a `\u003c`: sin
 * eso, un título que contuviera `</script>` cerraría la etiqueta y el resto del
 * JSON pasaría a ser HTML. El escape es válido dentro de JSON, así que ningún
 * consumidor lo nota.
 */
export function serializeJsonLd(node: JsonLdNode): string {
  return JSON.stringify(node).replace(/</g, '\\u003c');
}

export interface Crumb {
  name: string;
  /** Ruta del sitio, no URL absoluta: se absolutiza aquí. */
  path: string;
}

/** `BreadcrumbList` de las rutas con jerarquía (ADR-0016). */
export function breadcrumbJsonLd(siteUrl: string, crumbs: readonly Crumb[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(siteUrl, crumb.path),
    })),
  };
}
