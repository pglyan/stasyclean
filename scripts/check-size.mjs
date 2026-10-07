/**
 * Бюджет веса статики: суммарный вес CSS и JS в dist/ после сборки.
 *
 * Запуск: npm run build && npm run check:size
 *
 * Лимиты — не догма, а сигнал: если сборка поправела, стоит посмотреть,
 * что именно приехало в бандл. Вес считается по минифицированным файлам
 * в dist/_a (хешированные assets), шрифты и картинки не учитываются.
 */
import { readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, extname } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ASSETS_DIR = join(ROOT, 'dist', '_a');

const LIMITS = { '.css': 40 * 1024, '.js': 20 * 1024 };

let names;
try {
  names = await readdir(ASSETS_DIR);
} catch {
  console.error(`✗ Нет каталога ${ASSETS_DIR} — сначала соберите сайт: npm run build`);
  process.exit(1);
}

let failed = false;

for (const [ext, limit] of Object.entries(LIMITS)) {
  const files = names.filter((name) => extname(name) === ext);
  let total = 0;
  for (const name of files) {
    total += (await stat(join(ASSETS_DIR, name))).size;
  }
  const kb = (total / 1024).toFixed(1);
  const limitKb = (limit / 1024).toFixed(0);
  if (total > limit) {
    console.error(`✗ ${ext}: ${kb} КБ (лимит ${limitKb} КБ) — превышение бюджета`);
    failed = true;
  } else if (files.length === 0) {
    console.log(`— ${ext}: файлов нет`);
  } else {
    console.log(`✓ ${ext}: ${kb} КБ из ${limitKb} КБ (${files.length} шт.)`);
  }
}

process.exit(failed ? 1 : 0);
