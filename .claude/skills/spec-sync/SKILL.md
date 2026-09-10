---
name: spec-sync
description: Propagar un cambio de spec a todas sus referencias. Úsala SIEMPRE que edites cualquier archivo de specs/ (incluidos ADRs, DEVIATIONS.md y OPEN-QUESTIONS.md), que resuelvas una pregunta abierta, que apruebes una ADR o que cierres una fase del roadmap. Una spec editada sin propagar deja el repositorio desfasado y contradictorio.
---

# spec-sync — no dejar nada desfasado

`specs/` es la fuente de verdad (Regla 1 de `AGENTS.md`). Una spec no vive
aislada: otras specs la citan, dependen de su estado y repiten sus reglas. Editar
una sin tocar las demás no deja el repositorio "medio actualizado" — lo deja
**mintiendo**, que es peor que no haberlo documentado.

**Regla dura: editar una spec no está terminado hasta que todas sus referencias
digan lo mismo que ella.**

## Procedimiento

### 1. Antes de editar — inventariar quién la cita

```bash
# Por nombre de archivo
grep -rn "02-design-system" specs/ AGENTS.md README.md --include="*.md"
# Por ADR
grep -rn "ADR-0014" specs/ AGENTS.md README.md --include="*.md"
# Por la regla concreta que vas a cambiar, con sus sinónimos
grep -rni "lineart\|stroke-width\|dibujado a mano" specs/ --include="*.md"
```

El tercer grep es el que se olvida y el que más daño hace. Un archivo puede
**repetir** una regla sin nombrar nunca su origen: `05-pages/home.md` decía
"iconos lineart" sin citar `02-design-system.md`, y sobrevivió a dos rondas de
revisión.

### 2. Buscar por concepto, no solo por referencia

Antes de dar por cerrado el inventario, lista los términos que la regla vieja
usaba y grepea **cada uno**, incluidos los del brief original. Cambiar "lineart"
por "silueta sólida" obliga a buscar `lineart`, `stroke`, `fill="none"`,
`trazo`, `dibujar`, `1.5px`.

### 3. Editar la spec y propagar en el mismo cambio

Nunca en dos pasadas. Si se propaga "después", no se propaga.

### 4. Revisar los cuatro puntos de desfase habituales

| Punto | Qué comprobar |
|---|---|
| **Cabecera `**Estado:**`** | BORRADOR / PROPUESTA / PENDIENTE / APROBADA sigue siendo cierto tras el cambio, y la fecha se actualiza |
| **Adjetivos de estado en las citas** | `ver ADR-0014 (propuesta pendiente)` cuando la ADR ya está APROBADA. Grepea `grep -rn "PROPUESTA\|PENDIENTE\|sin aprobar\|pendiente de aprobación" specs/` |
| **`OPEN-QUESTIONS.md`** | Una pregunta resuelta se **mueve**, no se copia: si aparece a la vez en "Abiertas" y en "Resueltas", el archivo se contradice |
| **`13-roadmap.md`** | Una fase que desaparece, se completa o cambia de alcance afecta al camino crítico y a las fases que dependían de ella |

### 5. Cerrar por partida doble (Regla 3 de `AGENTS.md`)

Si el cambio **deroga una regla ya escrita** y lo decidió el usuario:

1. La spec afectada refleja la verdad vigente.
2. Entrada en `specs/DEVIATIONS.md`: fecha, regla anterior, regla nueva, motivo
   **en palabras del usuario**, consecuencias asumidas y archivos actualizados.
3. Entrada en `specs/CHANGELOG.md`.

El campo "archivos actualizados" de `DEVIATIONS.md` no es decorativo: es la lista
de propagación. Escribirlo obliga a haberla hecho.

### 6. Verificar

```bash
# ¿Queda alguna cita que llame "pendiente" a algo ya aprobado?
grep -rn "PROPUESTA\|PENDIENTE\|pendiente de aprobación\|sin aprobar" specs/ --include="*.md"
# ¿Alguna pregunta duplicada entre secciones de OPEN-QUESTIONS.md?
grep -n "^| Q\|^### Q" specs/OPEN-QUESTIONS.md | sort -t'Q' -k2 | uniq -d -f1
```

Cada resultado se justifica o se corrige. Ninguno se ignora.

## Antipatrones

- **"Lo actualizo luego."** No se actualiza luego.
- **Actualizar la spec y no `DEVIATIONS.md`.** Incumple `AGENTS.md` por sí solo.
- **Buscar solo el nombre del archivo.** Las reglas se repiten sin citar origen.
- **Copiar una pregunta a "Resueltas" sin borrarla de "Abiertas".** El archivo
  que sirve de puerta pasa a dar información falsa.
- **Dejar `**Estado:** BORRADOR` en una spec que el usuario ya aprobó de viva
  voz.** Si lo aprobó, la cabecera lo dice; si no, no se implementa.

## Reporte

Al terminar, di **qué archivos se propagaron y por qué**, no solo cuál se editó.
Si algún desfase se deja abierto a propósito, se nombra explícitamente.
