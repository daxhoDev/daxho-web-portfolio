/**
 * Utilidades de i18n — ADR-0008, ADR-0010.
 *
 * Funciones puras, sin dependencias del navegador: son objetivo de Vitest
 * (`09-testing.md`).
 *
 * POR QUÉ NO HAY `routes.ts`
 * --------------------------
 * `06-components.md` hablaba de un mapa de rutas equivalentes entre idiomas.
 * Ese mapa solo hace falta si los segmentos se traducen (`/es/proyectos`), y
 * ADR-0010 decidió NO traducirlos precisamente para evitar mantenerlo. Con
 * rutas en inglés en ambos idiomas, la página equivalente se obtiene quitando o
 * poniendo el prefijo: es `canonicalPath` + `localizePath`, no una tabla.
 */
import { DEFAULT_LANG, LANGUAGES, UI, type Lang, type TranslationKey } from './ui';

const LANG_CODES = Object.keys(LANGUAGES) as Lang[];

/** Prefijos que identifican un idioma en la URL. El defecto no lleva prefijo. */
const PREFIXED_LANGS = LANG_CODES.filter((lang) => lang !== DEFAULT_LANG);

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANG_CODES as string[]).includes(value);
}

/**
 * Idioma de una ruta. `/es` y `/es/...` son español; todo lo demás, inglés.
 *
 * Comprueba el SEGMENTO completo a propósito: `/espanol` no es español, y un
 * `startsWith('/es')` lo trataría como tal.
 */
export function getLangFromPath(pathname: string): Lang {
  const [, first] = pathname.split('/');
  return PREFIXED_LANGS.includes(first as Lang) ? (first as Lang) : DEFAULT_LANG;
}

export function getLangFromUrl(url: URL | string): Lang {
  return getLangFromPath(typeof url === 'string' ? new URL(url).pathname : url.pathname);
}

/**
 * Ruta sin prefijo de idioma: la forma canónica con la que se trabaja siempre.
 * `/es/projects` → `/projects` · `/es` → `/` · `/projects` → `/projects`
 */
export function canonicalPath(pathname: string): string {
  const lang = getLangFromPath(pathname);
  if (lang === DEFAULT_LANG) return normalize(pathname);
  return normalize(pathname.slice(`/${lang}`.length));
}

/**
 * Antepone el prefijo del idioma a una ruta canónica.
 * ADR-0008: `en` vive en `/` (sin prefijo), `es` bajo `/es`.
 *
 * **Todo enlace interno pasa por aquí.** Un `href` escrito a mano es un bug
 * (consecuencia explícita de ADR-0008).
 */
export function localizePath(pathname: string, lang: Lang): string {
  const path = normalize(canonicalPath(pathname));
  if (lang === DEFAULT_LANG) return path;
  return path === '/' ? `/${lang}` : `/${lang}${path}`;
}

/** La misma página en el otro idioma. Nunca el home: lo exige ADR-0008. */
export function alternatePath(pathname: string, lang: Lang): string {
  return localizePath(canonicalPath(pathname), lang);
}

/** Todas las variantes de idioma de una ruta, para los `hreflang`. */
export function alternates(pathname: string): { lang: Lang; path: string }[] {
  return LANG_CODES.map((lang) => ({ lang, path: alternatePath(pathname, lang) }));
}

/** Traductor del idioma dado. Las claves están tipadas: una errata no compila. */
export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return UI[lang][key];
  };
}

/**
 * Normaliza: siempre empieza por `/`, nunca acaba en `/` salvo la raíz.
 * Sin esto, `/es/` y `/es` producirían enlaces distintos a la misma página.
 */
function normalize(pathname: string): string {
  const withLeading = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (withLeading === '/') return '/';
  return withLeading.replace(/\/+$/, '') || '/';
}

export { LANG_CODES, DEFAULT_LANG, LANGUAGES };
export type { Lang, TranslationKey };
