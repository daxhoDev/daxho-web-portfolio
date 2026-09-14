/**
 * Selector de idioma — ADR-0008, ADR-0009.
 *
 * DOS REGLAS QUE NO SE PUEDEN ROMPER:
 *
 * 1. Navega a la **página equivalente**, nunca al home (consecuencia explícita
 *    de ADR-0008). El destino lo calcula Astro en el servidor y llega como
 *    prop: la isla no reimplementa `localizePath` en cliente.
 *
 * 2. Elegir a mano escribe `localStorage.lang`, lo que **desactiva para siempre**
 *    la detección automática (regla 2 de ADR-0009). Sin esto, un visitante con
 *    el navegador en español que elige inglés volvería a ser redirigido en la
 *    siguiente visita.
 */
interface Props {
  lang: string;
  label: string;
  options: { lang: string; path: string; name: string }[];
}

export default function LanguageSwitcher({ lang, label, options }: Props) {
  const choose = (next: string, path: string) => {
    if (next === lang) return;
    try {
      localStorage.setItem('lang', next);
    } catch {
      // Sin localStorage la navegación funciona igual; solo se pierde la
      // persistencia de la preferencia.
    }
    window.location.href = path;
  };

  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.lang}
          type="button"
          lang={option.lang}
          aria-current={option.lang === lang ? 'true' : undefined}
          data-lang={option.lang}
          className={[
            'h-11 rounded-sm px-2 font-mono text-xs uppercase transition-colors',
            option.lang === lang
              ? 'text-accent-text font-bold'
              : 'text-fg-muted hover:text-accent-text',
          ].join(' ')}
          onClick={() => choose(option.lang, option.path)}
        >
          {option.lang}
          <span className="sr-only"> — {option.name}</span>
        </button>
      ))}
    </div>
  );
}
