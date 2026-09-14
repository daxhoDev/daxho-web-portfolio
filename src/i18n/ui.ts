/**
 * Diccionarios de interfaz — ADR-0008.
 *
 * Objetos TypeScript tipados, sin librería de i18n: para dos idiomas una
 * dependencia externa no aporta nada y añade peso.
 *
 * `en` es la fuente de verdad de las claves. `Translations` se deriva de él, de
 * modo que a `es` le falte una clave es un ERROR DE COMPILACIÓN, no un texto que
 * aparece en inglés en producción sin que nadie se entere.
 */

export const LANGUAGES = {
  en: 'English',
  es: 'Español',
} as const;

export type Lang = keyof typeof LANGUAGES;

export const DEFAULT_LANG: Lang = 'en';

const en = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.projects': 'Projects',
  'nav.resume': 'Resume',
  'nav.contact': 'Contact',

  'nav.menu.open': 'Open menu',
  'nav.menu.close': 'Close menu',
  'nav.menu.label': 'Main navigation',

  'a11y.skipToContent': 'Skip to content',
  'a11y.language': 'Language',

  'footer.rights': 'All rights reserved.',
  'footer.builtWith': 'Built with Astro.',
  'footer.social': 'Social links',

  'boot.skip': 'Press any key to skip',

  '404.title': 'Page not found',
  '404.message': "This path leads nowhere. The links below do.",
  '404.back': 'Back to home',
} as const;

/** Toda traducción debe cubrir exactamente las claves de `en`. */
export type TranslationKey = keyof typeof en;
type Translations = Record<TranslationKey, string>;

const es: Translations = {
  'nav.home': 'Inicio',
  'nav.about': 'Sobre mí',
  'nav.projects': 'Proyectos',
  'nav.resume': 'Currículum',
  'nav.contact': 'Contacto',

  'nav.menu.open': 'Abrir menú',
  'nav.menu.close': 'Cerrar menú',
  'nav.menu.label': 'Navegación principal',

  'a11y.skipToContent': 'Saltar al contenido',
  'a11y.language': 'Idioma',

  'footer.rights': 'Todos los derechos reservados.',
  'footer.builtWith': 'Hecho con Astro.',
  'footer.social': 'Redes sociales',

  'boot.skip': 'Pulsa cualquier tecla para saltar',

  '404.title': 'Página no encontrada',
  '404.message': 'Este camino no lleva a ninguna parte. Los enlaces de abajo sí.',
  '404.back': 'Volver al inicio',
};

export const UI: Record<Lang, Translations> = { en, es };
