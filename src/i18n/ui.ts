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
  // ADR-0015: analítica sin cookies, así que basta esta línea y no hay banner.
  'footer.cookies': 'This website does not use cookies',

  'boot.skip': 'Press any key to skip',

  '404.title': 'Page not found',
  '404.message': 'This path leads nowhere. The links below do.',
  '404.back': 'Back to home',

  'projects.title': 'Projects — Daxho',
  'projects.description':
    'Selected work: what each project solves, what it is built with and how it turned out.',
  // TODO(fase 10): entradilla real. Relleno marcado (04-content-model.md).
  'projects.intro':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',

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
  // TODO(fase 10): description definitiva con el contenido real. Esta es la
  // provisional aprobada el 2026-09-17 (05-pages/home.md).
  'home.description':
    'Software Engineer building full-stack web applications. Projects, background and a direct way to get in touch.',
  'home.headline': "welcome to daxho's corner, what should we build?",
  'home.subtitle': 'Software Engineer · full-stack web',
  'home.scroll': 'scroll',
  'home.about.text':
    'I build web applications end to end — architecture, interface, database and deployment — and I hand them over working. A gift shop that keeps its own catalogue without me, a photography portfolio that scores 100 on accessibility, an API documented from its own schemas.',
  // TODO(fase 10): fotografía real (Q33).
  'home.about.photoAlt': 'PLACEHOLDER — photo of Daxho',
  'home.about.more': 'Read more',
  'home.tech': 'Technologies',
  'home.projects.more': 'View more projects',
  'home.cta.heading': 'ready when you are',
  'home.cta.button': 'contact',

  'about.title': 'About — Daxho',
  'about.description':
    'Software Engineer: experience, stack, education and languages. CV available to download.',
  'about.intro':
    'Software Engineer in Holguín, Cuba. I work remotely and asynchronously, and I like projects where someone ends up depending on me a little less.',
  'about.bio.1':
    'I am a Software Engineer at Xlynx LLC, where each project lands on one engineer from end to end: the brief, the design, the frontend, whatever backend it needs, the deployment and what comes after. Five have gone out in the past year.',
  'about.bio.2':
    'Before that, and alongside it, came the freelance work — a gift shop, a delivery business — and with it the lesson that shapes how I build: a project is not finished when it looks right, but when the client can run it without calling me. That is why Destinos Únicos has a private area its owner uses herself, and why a photography portfolio ships with a hand-written lightbox instead of a library.',
  'about.bio.3':
    'I am finishing Computer Engineering at the University of Holguín, graduating in January 2027. I work with coding agents every day, on specs, reviews and test suites, and I measure what I claim: the numbers on this site are Lighthouse readings, not estimates.',
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

  'about.cv.download': 'Download PDF',
  // {lang} y {size} se sustituyen en la página.
  'about.cv.meta': '{lang} · {size}',
  'about.cv.lang': 'English',
  'about.education': 'Education',
  'about.languages': 'Languages',
  'about.inProgress': 'in progress',

  'contact.title': 'Contact — Daxho',
  'contact.description':
    'Tell me about your project: a short form and an answer straight to your inbox.',
  'contact.intro': 'ready when you are. Tell me about your project.',
  'contact.name': 'Name',
  'contact.email': 'Email',
  'contact.message': 'Message',
  'contact.submit': 'Send message',
  'contact.sending': 'Sending…',
  'contact.success': 'Message sent. I will get back to you soon.',
  'contact.error.generic': 'The message could not be sent. Please try again in a few minutes.',
  'contact.error.rateLimited': 'Too many messages in a short time. Please try again in 10 minutes.',
  'contact.error.fields': 'Please check the highlighted fields.',
  'contact.field.required': 'This field is required.',
  // {n} se sustituye por el límite.
  'contact.field.tooShort': 'Use at least {n} characters.',
  'contact.field.tooLong': 'Use at most {n} characters.',
  'contact.field.invalidEmail': 'Enter a valid email address.',
  'contact.honeypot': 'Leave this field empty',
  'contact.elsewhere': 'Also on',
  'contact.sent.title': 'Message sent — Daxho',
  'contact.sent.heading': 'message sent',
  'contact.sent.text': 'Thanks for writing. I will get back to you soon.',
  'contact.failed.title': 'Message not sent — Daxho',
  'contact.failed.heading': 'message not sent',
  'contact.failed.text': 'Something went wrong: check the fields or try again in a few minutes.',
  'contact.backToForm': 'Back to the form',
} as const;

/** Toda traducción debe cubrir exactamente las claves de `en`. */
export type TranslationKey = keyof typeof en;
type Translations = Record<TranslationKey, string>;

const es: Translations = {
  'nav.home': 'Inicio',
  'nav.about': 'Sobre mí',
  'nav.projects': 'Proyectos',
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
  'footer.cookies': 'Este sitio web no utiliza cookies',

  'boot.skip': 'Pulsa cualquier tecla para saltar',

  '404.title': 'Página no encontrada',
  '404.message': 'Este camino no lleva a ninguna parte. Los enlaces de abajo sí.',
  '404.back': 'Volver al inicio',

  'projects.title': 'Proyectos — Daxho',
  'projects.description':
    'Trabajos seleccionados: qué resuelve cada proyecto, con qué está construido y en qué quedó.',
  // TODO(fase 10): entradilla real. Relleno marcado (04-content-model.md).
  'projects.intro':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',

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
  // TODO(fase 10): description definitiva con el contenido real.
  'home.description':
    'Software Engineer especializado en desarrollo web full-stack. Proyectos, trayectoria y una vía directa de contacto.',
  'home.headline': 'bienvenido a la guarida de daxho, ¿qué construimos?',
  'home.subtitle': 'Software Engineer · desarrollo web full-stack',
  'home.scroll': 'scroll',
  'home.about.text':
    'Construyo aplicaciones web de principio a fin —arquitectura, interfaz, base de datos y despliegue— y las entrego funcionando. Una tienda de regalos que mantiene su catálogo sin mí, un portafolio fotográfico con 100 en accesibilidad, una API documentada desde sus propios esquemas.',
  // TODO(fase 10): fotografía real (Q33).
  'home.about.photoAlt': 'PLACEHOLDER — foto de Daxho',
  'home.about.more': 'Leer más',
  'home.tech': 'Tecnologías',
  'home.projects.more': 'Ver más proyectos',
  'home.cta.heading': 'listo cuando tú lo estés',
  'home.cta.button': 'contacto',

  'about.title': 'Sobre mí — Daxho',
  'about.description':
    'Software Engineer: experiencia, stack, formación e idiomas. CV disponible para descargar.',
  'about.intro':
    'Software Engineer en Holguín, Cuba. Trabajo en remoto y en asíncrono, y me gustan los proyectos en los que alguien acaba dependiendo un poco menos de mí.',
  'about.bio.1':
    'Soy Software Engineer en Xlynx LLC, donde cada proyecto recae de principio a fin en un ingeniero: el encargo, el diseño, el frontend, el backend que haga falta, el despliegue y lo que viene después. En el último año han salido cinco.',
  'about.bio.2':
    'Antes, y en paralelo, llegaron los encargos freelance —una tienda de regalos, un negocio de reparto— y con ellos la lección que marca cómo construyo: un proyecto no está terminado cuando se ve bien, sino cuando el cliente puede usarlo sin llamarme. Por eso Destinos Únicos tiene un área privada que su dueña maneja sola, y por eso un portafolio fotográfico sale con un lightbox escrito a mano en vez de una librería.',
  'about.bio.3':
    'Estoy terminando Ingeniería Informática en la Universidad de Holguín, con la titulación prevista en enero de 2027. Trabajo a diario con agentes de programación, en especificaciones, revisiones y suites de test, y mido lo que afirmo: las cifras de este sitio son lecturas de Lighthouse, no estimaciones.',
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

  'about.cv.download': 'Descargar PDF',
  'about.cv.meta': '{lang} · {size}',
  'about.cv.lang': 'español',
  'about.education': 'Formación',
  'about.languages': 'Idiomas',
  'about.inProgress': 'en curso',

  'contact.title': 'Contacto — Daxho',
  'contact.description':
    'Cuéntame tu proyecto: un formulario breve y respuesta directa a tu correo.',
  'contact.intro': 'listo cuando tú lo estés. Cuéntame tu proyecto.',
  'contact.name': 'Nombre',
  'contact.email': 'Correo',
  'contact.message': 'Mensaje',
  'contact.submit': 'Enviar mensaje',
  'contact.sending': 'Enviando…',
  'contact.success': 'Mensaje enviado. Te responderé pronto.',
  'contact.error.generic': 'No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.',
  'contact.error.rateLimited':
    'Demasiados mensajes en poco tiempo. Inténtalo de nuevo en 10 minutos.',
  'contact.error.fields': 'Revisa los campos marcados.',
  'contact.field.required': 'Este campo es obligatorio.',
  'contact.field.tooShort': 'Usa al menos {n} caracteres.',
  'contact.field.tooLong': 'Usa como máximo {n} caracteres.',
  'contact.field.invalidEmail': 'Escribe un correo válido.',
  'contact.honeypot': 'Deja este campo vacío',
  'contact.elsewhere': 'También en',
  'contact.sent.title': 'Mensaje enviado — Daxho',
  'contact.sent.heading': 'mensaje enviado',
  'contact.sent.text': 'Gracias por escribir. Te responderé pronto.',
  'contact.failed.title': 'Mensaje no enviado — Daxho',
  'contact.failed.heading': 'mensaje no enviado',
  'contact.failed.text': 'Algo ha fallado: revisa los campos o inténtalo de nuevo en unos minutos.',
  'contact.backToForm': 'Volver al formulario',
};

export const UI: Record<Lang, Translations> = { en, es };
