# 10 — Catálogo de tecnologías

**Estado:** ABIERTO A AÑADIDOS · 2026-09-10, reabierto el 2026-09-17 ·
**26 entradas**, todas en el carrusel (Q-K). Q34 lo había cerrado en 25; el
usuario lo abrió para que entre Cloudinary (`DEVIATIONS.md`).
Iconos implementados en la fase 1.
Ver ADR-0018 para la especificación de los iconos.

Fuente **única** para: el carrusel del home, la fila de stack de cada
`ProjectCard`, el stack del detalle de proyecto y las skills de `/about`.

---

## Catálogo completo — 26 tecnologías

Columna "Icono": dificultad estimada que tuvo el icono cuando el plan era
dibujarlo a mano. Se conserva como registro histórico; hoy 25 de las 26 salen de
Simple Icons como siluetas sólidas (ADR-0018, `DEVIATIONS.md`).

### Lenguajes

| `key` | Label | Icono |
|---|---|---|
| `typescript` | TypeScript | fácil — cuadrado redondeado + "TS" |
| `javascript` | JavaScript | fácil — cuadrado + "JS" |
| `python` | Python | media — dos serpientes entrelazadas |
| `bash` | Bash / Shell | trivial — `>_` |

### Frontend

| `key` | Label | Icono |
|---|---|---|
| `react` | React | fácil — núcleo + tres órbitas |
| `nextjs` | Next.js | fácil — círculo + "N" |
| `astro` | Astro | fácil |
| `tailwindcss` | Tailwind CSS | fácil — doble onda |
| `vite` | Vite | fácil — rayo en rombo |

### Backend

| `key` | Label | Icono |
|---|---|---|
| `nodejs` | Node.js | fácil — hexágono |
| `express` | Express | media — círculo + "ex", ver nota |
| `nestjs` | NestJS | media — felino hexagonal |
| `django` | Django | fácil — bloque "dj" |

### Datos

| `key` | Label | Icono |
|---|---|---|
| `postgresql` | PostgreSQL | **difícil** — elefante |
| `mongodb` | MongoDB | fácil — hoja |
| `supabase` | Supabase | fácil — rayo |

### Infraestructura y control de versiones

| `key` | Label | Icono |
|---|---|---|
| `docker` | Docker | media — ballena + contenedores |
| `linux` | Linux | **difícil** — pingüino |
| `git` | Git | fácil — nodos y ramas |
| `github` | GitHub | media — gato |
| `vercel` | Vercel | trivial — triángulo |
| `cloudinary` | Cloudinary | desde Simple Icons (añadida el 2026-09-17) |

### Herramientas y calidad

| `key` | Label | Icono |
|---|---|---|
| `postman` | Postman | media — casco/planeta |
| `figma` | Figma | trivial — cuatro formas |
| `vitest` | Vitest | fácil — rayo |
| `playwright` | Playwright | media — máscaras |

---

## Origen de los iconos

**25 de 26 desde Simple Icons**, como siluetas sólidas (ver `DEVIATIONS.md`).
La columna «Icono» de las tablas de arriba describía la dificultad de dibujarlos
a mano y ha dejado de aplicar: los trazados oficiales tienen la forma correcta
por construcción.

Slugs de Simple Icons que NO coinciden con la clave del catálogo:

| `key` | slug de Simple Icons |
|---|---|
| `bash` | `gnubash` |
| `nextjs` | `nextdotjs` |
| `nodejs` | `nodedotjs` |

### El único dibujado a mano
**Playwright** no está en Simple Icons. Se dibuja como silueta sólida (máscara
de teatro, que es el motivo de su logotipo) para casar con los otros 24.

### Express — resuelto
La objeción original (Express no tiene símbolo, solo la palabra escrita) queda
sin efecto: Simple Icons incluye su marca oficial. También decae la reserva de
legibilidad del círculo con «ex».

## Contenido del carrusel — DECIDIDO

**El carrusel muestra las 26 tecnologías del catálogo.** `inCarousel = true` para
todas.

Decisión del usuario, registrada en `DEVIATIONS.md`: el carrusel es **textura
visual, no inventario**. Nadie lee de principio a fin una banda que se desplaza, así
que el número de elementos no condiciona su función.

El campo `inCarousel` se conserva en el modelo (`04-content-model.md`) por si en el
futuro se quiere volver a filtrar, pero hoy no filtra nada.

### Consecuencias
- La fase 1 de iconos pasó de 16 a **25 dibujos**. No había subconjunto menor con
  el que publicar el home.
- La vuelta completa del carrusel será larga. Es aceptable dado que su función es
  decorativa: el visitante percibe un flujo continuo de tecnología, no una lista.
- Con dos docenas largas de iconos, la **coherencia de peso visual es aún más
  crítica**: cuantos más elementos desfilan, más se nota uno que desentona.

## Plan de trabajo de los iconos — COMPLETADO

Resuelto entero dentro de la fase 1: 24 desde la librería y Playwright a mano.
La fase 3 del roadmap se queda sin contenido.

La hoja de calibración prevista (`vercel`, `react`, `postgresql` uno al lado del
otro para fijar el peso visual) se construyó en `/styleguide` y sirvió para elegir
entre lineart y silueta sólida. Ganó la silueta sólida.

---

## Reglas del catálogo

1. **Solo se lista lo que se puede defender en una entrevista.** El carrusel es una
   afirmación de competencia.
2. Toda `key` usada en el `stack` de un proyecto debe existir aquí, o el build
   falla.
3. `inCarousel` está a `true` en todas (ver `DEVIATIONS.md`).
   3bis. **Añadir una entrada es una decisión del usuario**, nunca del agente, y
   se documenta en `DEVIATIONS.md`: el catálogo es una afirmación de competencia
   (regla 1), no una lista de todo lo que aparece en un `package.json`.
4. ~~Tamaño del carrusel: 14-16 elementos.~~ Derogada por decisión del usuario.
5. Todo icono se consume vía `TechIcon.astro`. Importar un icono suelto en una
   página o sección es un error.
6. `html5` y `css3` quedan deliberadamente fuera: para un perfil de +2 años,
   listarlas junto a React y Next.js resta más de lo que suma.
