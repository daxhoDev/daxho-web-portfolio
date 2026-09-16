# ADR-0022 — Plantillas de correo con React Email

**Estado:** APROBADA · 2026-09-16 · se implementa en la fase 11
Modifica la regla de formato de ADR-0020 (ver `../DEVIATIONS.md`).

## Contexto
ADR-0020 fijó que el aviso del formulario llega en **texto plano**. Con el envío
ya funcionando en producción, el usuario pidió *"crea la especificación y una
etapa de implementación para más adelante, los emails seguirán la estética y
diseño de la web"*, tras preguntar por React Email.

## Opciones consideradas

- **(a) Mantener texto plano.** Cero dependencias, máxima compatibilidad. No
  cumple el objetivo: sin marca ni estética.
- **(b) HTML escrito a mano en una cadena.** Sin dependencias, pero las tablas
  anidadas y los estilos en línea que exigen los clientes de correo son frágiles
  de mantener a mano, y escapar el texto del visitante recae en quien escribe la
  plantilla.
- **(c) MJML.** Lenguaje propio de plantillas, maduro. Añade un segundo lenguaje
  de marcado al proyecto, fuera del ecosistema React y TypeScript que ya usan las
  islas.
- **(d) React Email.** Componentes React tipados que se renderizan a HTML
  compatible con clientes de correo. Encaja con el stack (React ya está), escapa
  el contenido por defecto y trae un servidor de previsualización.

## Decisión (aprobada)

**(d) React Email**, porque es la herramienta por la que preguntó el usuario y
encaja con lo que ya existe. El diseño sigue la estética del sitio, adaptada a
lo que soportan los clientes de correo (`14-email.md`).

## Consecuencias
- Nueva dependencia, **solo de servidor**: el visitante no descarga nada y el
  presupuesto de JS del sitio no cambia. Aumenta el tamaño de la función del
  endpoint.
- Se envían **a la vez HTML y texto plano**: el texto plano se conserva como
  alternativa para clientes sin HTML.
- **Hasta la fase 11 rige el texto plano de ADR-0020**, que es lo desplegado.
- La estética del sitio **no se traslada tal cual**: Gmail no carga fuentes web
  ni variables CSS, y algunas apps invierten los colores en modo oscuro. La spec
  define la traducción.
- Cuando haya dominio propio y se active la autorespuesta al visitante (Q39),
  reutilizará el mismo sistema.
