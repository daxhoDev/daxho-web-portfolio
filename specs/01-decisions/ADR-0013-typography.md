# ADR-0013 — Tipografía: JetBrains Mono + Inter, self-hosted

**Estado:** APROBADA · 2026-09-09

## Decisión
- **Encabezados y elementos de interfaz técnica:** JetBrains Mono.
- **Cuerpo de texto:** Inter.
- **Alojamiento:** self-hosted vía Fontsource. Sin Google Fonts CDN.

## Razones
- JetBrains Mono está diseñada para leerse en tamaños grandes de pantalla, con
  altura de x generosa; es la monoespaciada más legible del grupo evaluado, lo cual
  importa porque encima llevará el efecto glitch.
- Inter es la referencia para texto de interfaz: excelente legibilidad en tamaños
  pequeños y en ambos temas.
- Self-hosting: elimina una conexión a un tercero (mejor LCP, sin coste de
  handshake), evita enviar la IP del visitante a Google (privacidad y RGPD) y hace
  el sitio inmune a caídas del CDN externo.

## Reglas de implementación
- Solo se cargan los pesos que se usan. Cada peso adicional se justifica.
- Formato `woff2` exclusivamente.
- `font-display: swap` y `<link rel="preload">` para las fuentes del primer
  viewport.
- Subconjunto latino (latin + latin-ext, este último por los acentos del español).
- Toda fuente declara una pila de respaldo real, ajustada con `size-adjust` para
  minimizar el salto de layout al cargar.
