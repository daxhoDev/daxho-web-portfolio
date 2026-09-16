import { describe, expect, it } from 'vitest';

import {
  alternatePath,
  alternates,
  canonicalPath,
  getLangFromPath,
  getLangFromUrl,
  isLang,
  localizePath,
  useTranslations,
} from '@/i18n/utils';
import { UI } from '@/i18n/ui';

/**
 * ADR-0008 (rutas prefijadas, inglés sin prefijo) y ADR-0010 (rutas sin
 * traducir). Son funciones puras y el i18n entero se apoya en ellas: un fallo
 * aquí se manifiesta como enlaces rotos en todo el sitio.
 */

describe('getLangFromPath', () => {
  it('trata la raíz y las rutas sin prefijo como inglés', () => {
    expect(getLangFromPath('/')).toBe('en');
    expect(getLangFromPath('/projects')).toBe('en');
    expect(getLangFromPath('/projects/task-manager')).toBe('en');
  });

  it('detecta el prefijo /es', () => {
    expect(getLangFromPath('/es')).toBe('es');
    expect(getLangFromPath('/es/projects')).toBe('es');
  });

  it('compara el SEGMENTO completo, no el prefijo de cadena', () => {
    // Un startsWith('/es') ingenuo daría 'es' aquí, y serviría la página
    // equivocada en cuanto exista una ruta que empiece por "es".
    expect(getLangFromPath('/espanol')).toBe('en');
    expect(getLangFromPath('/essays/first')).toBe('en');
  });

  it('acepta una URL completa', () => {
    expect(getLangFromUrl(new URL('https://daxho.dev/es/about'))).toBe('es');
    expect(getLangFromUrl('https://daxho.dev/about')).toBe('en');
  });
});

describe('canonicalPath', () => {
  it('quita el prefijo de idioma', () => {
    expect(canonicalPath('/es/projects')).toBe('/projects');
    expect(canonicalPath('/es')).toBe('/');
    expect(canonicalPath('/es/')).toBe('/');
  });

  it('deja intactas las rutas en inglés', () => {
    expect(canonicalPath('/projects')).toBe('/projects');
    expect(canonicalPath('/')).toBe('/');
  });

  it('normaliza la barra final', () => {
    expect(canonicalPath('/projects/')).toBe('/projects');
    expect(canonicalPath('/es/projects/')).toBe('/projects');
  });
});

describe('localizePath', () => {
  it('deja el inglés sin prefijo (ADR-0008: prefixDefaultLocale false)', () => {
    expect(localizePath('/', 'en')).toBe('/');
    expect(localizePath('/about', 'en')).toBe('/about');
  });

  it('prefija el español', () => {
    expect(localizePath('/', 'es')).toBe('/es');
    expect(localizePath('/about', 'es')).toBe('/es/about');
  });

  it('es idempotente: no duplica un prefijo ya presente', () => {
    // Sin esto, pasar una ruta ya localizada produciría /es/es/about.
    expect(localizePath('/es/about', 'es')).toBe('/es/about');
    expect(localizePath('/es/about', 'en')).toBe('/about');
  });

  it('mantiene las rutas en inglés en ambos idiomas (ADR-0010)', () => {
    expect(localizePath('/projects/task-manager', 'es')).toBe('/es/projects/task-manager');
  });
});

describe('alternatePath', () => {
  it('lleva a la página EQUIVALENTE, nunca al home (ADR-0008)', () => {
    expect(alternatePath('/es/projects/task-manager', 'en')).toBe('/projects/task-manager');
    expect(alternatePath('/projects/task-manager', 'es')).toBe('/es/projects/task-manager');
  });

  it('el home de un idioma es el home del otro', () => {
    expect(alternatePath('/es', 'en')).toBe('/');
    expect(alternatePath('/', 'es')).toBe('/es');
  });
});

describe('alternates', () => {
  it('devuelve las dos variantes para los hreflang', () => {
    expect(alternates('/es/about')).toEqual([
      { lang: 'en', path: '/about' },
      { lang: 'es', path: '/es/about' },
    ]);
  });
});

describe('useTranslations', () => {
  it('traduce en cada idioma', () => {
    expect(useTranslations('en')('nav.projects')).toBe('Projects');
    expect(useTranslations('es')('nav.projects')).toBe('Proyectos');
  });
});

describe('integridad de los diccionarios', () => {
  it('el español cubre exactamente las claves del inglés', () => {
    // El tipo ya lo garantiza en compilación; esto lo protege también en
    // ejecución, por si alguien fuerza un cast.
    expect(Object.keys(UI.es).sort()).toEqual(Object.keys(UI.en).sort());
  });

  it('ninguna traducción está vacía', () => {
    for (const [lang, dict] of Object.entries(UI)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), `${lang}.${key} está vacía`).not.toBe('');
      }
    }
  });
});

describe('isLang', () => {
  it('acepta solo los idiomas soportados', () => {
    expect(isLang('en')).toBe(true);
    expect(isLang('es')).toBe(true);
    expect(isLang('fr')).toBe(false);
    expect(isLang(null)).toBe(false);
  });
});
