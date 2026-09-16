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

  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'System',
  // {state} se sustituye por el estado activo.
  'theme.label': 'Theme: {state}. Click to change.',

  'footer.rights': 'All rights reserved.',
  'footer.builtWith': 'Built with Astro.',
  'footer.social': 'Social links',

  'boot.skip': 'Press any key to skip',

  '404.title': 'Page not found',
  '404.message': "This path leads nowhere. The links below do.",
  '404.back': 'Back to home',

  // TODO(fase 10): entradilla real. Relleno marcado (04-content-model.md).
  'projects.intro': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',

  'project.viewDetails': 'View details',
  'project.openProject': 'Open project',
  'project.viewRepo': 'View repository',
  'project.stack': 'Tech stack',
  'project.gallery': 'Gallery',
  'project.year': 'Year',
  'project.role': 'Role',
  'project.status': 'Status',
  'project.status.live': 'Live',
  'project.status.archived': 'Archived',
  'project.status.wip': 'In progress',
  'project.prev': 'Previous project',
  'project.next': 'Next project',
  'project.back': 'Back to projects',
  'project.nav': 'Project navigation',

  'home.title': 'Daxho — Software Engineer',
  'home.headline': "welcome to daxho's corner, what should we build?",
  'home.subtitle': 'Software Engineer · full-stack web',
  'home.scroll': 'scroll',
  // TODO(fase 10): texto real (Q32). Relleno marcado (04-content-model.md).
  'home.about.text':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  // TODO(fase 10): fotografía real (Q33).
  'home.about.photoAlt': 'PLACEHOLDER — photo of Daxho',
  'home.about.more': 'Read more',
  'home.tech': 'Technologies',
  'home.projects.more': 'View more projects',
  'home.cta.heading': 'ready when you are',
  'home.cta.button': 'contact',

  // TODO(fase 10): textos reales (Q32). Relleno marcado (04-content-model.md).
  'about.title': 'About — Daxho',
  'about.intro': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  'about.bio.1':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'about.bio.2':
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'about.bio.3':
    'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.',
  'about.skills': 'Skills',
  'about.experience': 'Experience',

  'skills.group.languages': 'Languages',
  'skills.group.frontend': 'Frontend',
  'skills.group.backend': 'Backend',
  'skills.group.data': 'Data',
  'skills.group.infrastructure': 'Infrastructure',
  'skills.group.tools': 'Tools and quality',

  'experience.present': 'Present',
  'experience.type.full-time': 'Full-time',
  'experience.type.contract': 'Contract',
  'experience.type.freelance': 'Freelance',
  'experience.highlights': 'Highlights',

  'resume.title': 'Resume — Daxho',
  // {lang} y {size} se sustituyen en la página.
  'resume.download': 'Download PDF',
  'resume.downloadMeta': '{lang} · {size}',
  'resume.fileLang': 'English',
  'resume.contact': 'Contact',
  'resume.contactForm': 'Contact form',
  'resume.profile': 'Profile',
  // TODO(fase 10): perfil real.
  'resume.profile.text':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'resume.education': 'Education',
  'resume.languages': 'Languages',
  'resume.inProgress': 'in progress',
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

  'theme.light': 'Claro',
  'theme.dark': 'Oscuro',
  'theme.system': 'Sistema',
  'theme.label': 'Tema: {state}. Pulsa para cambiar.',

  'footer.rights': 'Todos los derechos reservados.',
  'footer.builtWith': 'Hecho con Astro.',
  'footer.social': 'Redes sociales',

  'boot.skip': 'Pulsa cualquier tecla para saltar',

  '404.title': 'Página no encontrada',
  '404.message': 'Este camino no lleva a ninguna parte. Los enlaces de abajo sí.',
  '404.back': 'Volver al inicio',

  // TODO(fase 10): entradilla real. Relleno marcado (04-content-model.md).
  'projects.intro': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',

  'project.viewDetails': 'Ver detalles',
  'project.openProject': 'Abrir proyecto',
  'project.viewRepo': 'Ver repositorio',
  'project.stack': 'Tecnologías',
  'project.gallery': 'Galería',
  'project.year': 'Año',
  'project.role': 'Rol',
  'project.status': 'Estado',
  'project.status.live': 'En producción',
  'project.status.archived': 'Archivado',
  'project.status.wip': 'En desarrollo',
  'project.prev': 'Proyecto anterior',
  'project.next': 'Proyecto siguiente',
  'project.back': 'Volver a proyectos',
  'project.nav': 'Navegación entre proyectos',

  'home.title': 'Daxho — Software Engineer',
  'home.headline': 'bienvenido a la guarida de daxho, ¿qué construimos?',
  'home.subtitle': 'Software Engineer · desarrollo web full-stack',
  'home.scroll': 'scroll',
  // TODO(fase 10): texto real (Q32). Relleno marcado (04-content-model.md).
  'home.about.text':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  // TODO(fase 10): fotografía real (Q33).
  'home.about.photoAlt': 'PLACEHOLDER — foto de Daxho',
  'home.about.more': 'Leer más',
  'home.tech': 'Tecnologías',
  'home.projects.more': 'Ver más proyectos',
  'home.cta.heading': 'listo cuando tú lo estés',
  'home.cta.button': 'contacto',

  // TODO(fase 10): textos reales (Q32). Relleno marcado (04-content-model.md).
  'about.title': 'Sobre mí — Daxho',
  'about.intro': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  'about.bio.1':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'about.bio.2':
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'about.bio.3':
    'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.',
  'about.skills': 'Habilidades',
  'about.experience': 'Experiencia',

  'skills.group.languages': 'Lenguajes',
  'skills.group.frontend': 'Frontend',
  'skills.group.backend': 'Backend',
  'skills.group.data': 'Datos',
  'skills.group.infrastructure': 'Infraestructura',
  'skills.group.tools': 'Herramientas y calidad',

  'experience.present': 'actualidad',
  'experience.type.full-time': 'Jornada completa',
  'experience.type.contract': 'Contrato',
  'experience.type.freelance': 'Freelance',
  'experience.highlights': 'Logros',

  'resume.title': 'Currículum — Daxho',
  'resume.download': 'Descargar PDF',
  'resume.downloadMeta': '{lang} · {size}',
  'resume.fileLang': 'español',
  'resume.contact': 'Contacto',
  'resume.contactForm': 'Formulario de contacto',
  'resume.profile': 'Perfil profesional',
  // TODO(fase 10): perfil real.
  'resume.profile.text':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'resume.education': 'Formación',
  'resume.languages': 'Idiomas',
  'resume.inProgress': 'en curso',
};

export const UI: Record<Lang, Translations> = { en, es };
