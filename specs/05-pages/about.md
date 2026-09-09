# Página: About (`/about`, `/es/about`)

**Estado:** BORRADOR · 2026-09-09
Añadida por decisión del usuario (Q30).

## Objetivo
Contar quién es Daxho con más profundidad que el home: trayectoria, capacidades y
una cara.

## Secciones, en orden

### 1. Encabezado
- `<h1>` de la página con efecto glitch (disparado, ver ADR-0014).
- Entradilla de una o dos frases.

### 2. Biografía + fotografía
- Texto largo (2-4 párrafos), ancho de lectura máximo 65ch.
- Fotografía de Daxho. Pendiente de la imagen real (Q33); mientras tanto,
  placeholder marcado.

### 3. Skills
- Agrupadas por categoría, usando el catálogo de tecnologías
  (`04-content-model.md`).
- Iconos lineart + etiqueta.
- **Sin nivel de dominio** (Q-D decidida): solo agrupación por categoría. Los
  niveles autoasignados no son verificables y un entrevistador técnico los lee con
  escepticismo. La prueba del nivel son los proyectos.

### 4. Experiencia
- Línea de tiempo vertical alimentada por la colección `experience`.
- Cada entrada: empresa, rol, rango de fechas, hitos, stack.
- Marcado semántico con `<ol>`: es una secuencia ordenada, no decoración.

### 5. CTA
- Enlace a `/resume` y a `/contact`.

## SEO
- `<title>`: "About — Daxho"
- JSON-LD `Person` ampliado (`alumniOf`, `knowsAbout`, `worksFor`).

## Criterios de aceptación
- [ ] La línea de tiempo es legible como lista por un lector de pantalla.
- [ ] La fotografía tiene `alt` descriptivo y dimensiones explícitas.
- [ ] Contenido completo en ambos idiomas.
