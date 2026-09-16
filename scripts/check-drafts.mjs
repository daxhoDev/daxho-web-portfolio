/**
 * Guarda de CI: ningún draft llega a `master` — 04-content-model.md y
 * DEVIATIONS.md (2026-09-14).
 *
 * Es la garantía real de la regla; el filtro del despliegue a producción es la
 * red de seguridad.
 *
 * NO basta con buscar `draft: true`: el esquema pone `draft` a `true` POR
 * DEFECTO, así que un archivo sin el campo también es un draft y un grep
 * ingenuo lo dejaría pasar.
 *
 * Uso: node scripts/check-drafts.mjs [directorio]
 */
/* global process, console */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * ¿Hay relleno en un archivo TS de contenido (education.ts, social.ts...)?
 *
 * Estos archivos no tienen frontmatter ni esquema con valor por defecto: cada
 * entrada de relleno lleva `draft: true` explícito (04-content-model.md), y
 * basta con que aparezca uno para bloquear.
 */
export function tsHasDrafts(source) {
  return /\bdraft:\s*true\b/.test(source);
}

/** ¿Es draft este archivo MDX? Ausente o `true` → sí. Solo `draft: false` publica. */
export function isDraft(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!match) return true; // sin frontmatter no hay forma de saberlo: se bloquea
  const line = /^draft:\s*(\S+)\s*(?:#.*)?$/m.exec(match[1]);
  return !line || line[1] !== 'false';
}

function listContent(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listContent(path);
    return /\.(mdx?|ts)$/.test(name) ? [path] : [];
  });
}

export function findDrafts(dir) {
  return listContent(dir).filter((file) => {
    const source = readFileSync(file, 'utf8');
    return file.endsWith('.ts') ? tsHasDrafts(source) : isDraft(source);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2] ?? 'src/content';
  const drafts = findDrafts(dir);
  if (drafts.length > 0) {
    console.error(
      `✖ ${drafts.length} archivo(s) de contenido en draft no pueden llegar a master (04-content-model.md):`,
    );
    for (const file of drafts) console.error(`  - ${relative(process.cwd(), file)}`);
    process.exit(1);
  }
  console.log('✔ Sin drafts en el contenido.');
}
