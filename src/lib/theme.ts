/**
 * Lógica de tema — implementa ADR-0011.
 *
 * Este módulo es deliberadamente puro y sin dependencias del DOM salvo donde
 * se indica, para poder testearlo con Vitest sin navegador (ADR-0007).
 */

export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const;

/** Lo que el usuario elige. `system` sigue al sistema operativo. */
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

/**
 * Lo que acaba aplicándose al DOM. `system` NUNCA se escribe en el DOM:
 * siempre se resuelve antes a uno de estos dos (ADR-0011).
 */
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';
export const THEME_ATTRIBUTE = 'data-theme';
export const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === 'string' && (THEME_PREFERENCES as readonly string[]).includes(value)
  );
}

/**
 * Traduce la preferencia del usuario al tema real que se pinta.
 * `system` depende de lo que diga el sistema operativo en ese momento.
 */
export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return preference;
}

/**
 * Lee la preferencia guardada.
 *
 * Envuelto en try/catch a propósito: en modo privado, con las cookies
 * bloqueadas o en algunos contextos embebidos, el simple acceso a
 * localStorage LANZA. Un fallo aquí no puede tumbar la página.
 */
export function readStoredPreference(storage?: Storage | null): ThemePreference | null {
  try {
    const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!store) return null;
    const raw = store.getItem(THEME_STORAGE_KEY);
    return isThemePreference(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** Persiste la preferencia. Silencioso si el almacenamiento no está disponible. */
export function writeStoredPreference(
  preference: ThemePreference,
  storage?: Storage | null,
): void {
  try {
    const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!store) return;
    store.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* almacenamiento no disponible: la preferencia dura solo esta página */
  }
}

/** Ciclo del toggle de tres estados: light -> dark -> system -> light */
export function nextPreference(current: ThemePreference): ThemePreference {
  const index = THEME_PREFERENCES.indexOf(current);
  return THEME_PREFERENCES[(index + 1) % THEME_PREFERENCES.length] as ThemePreference;
}

/** Aplica el tema resuelto al elemento raíz. */
export function applyResolvedTheme(theme: ResolvedTheme, root?: HTMLElement): void {
  const element = root ?? document.documentElement;
  element.setAttribute(THEME_ATTRIBUTE, theme);
}
