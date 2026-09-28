#!/usr/bin/env node
/**
 * Минификация HTML после сборки Astro.
 *
 * Честная оценка пользы: Astro уже включает compressHTML, поэтому
 * на нашем проекте шаг экономит около 0,2% (≈2 КБ на весь сайт).
 * Он оставлен по двум причинам:
 *   1) минифицирует CSS внутри <style>, если Astro что-то инлайнит;
 *   2) служит страховкой на случай, когда в разметку добавят много
 *      пробелов, комментариев или мнемоник — тогда шаг отработает заметнее.
 *
 * Что НЕ делаем: не трогаем инлайновые <script type="module"> — их уже
 * минифицировал Vite, а повторная минификация ломает JSON-LD.
 *
 * Запуск: node scripts/minify-html.mjs <каталог сборки>
 */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { minify } from 'html-minifier-terser';

const target = process.argv[2];

if (!target) {
  console.error('Укажите каталог сборки: node scripts/minify-html.mjs dist');
  process.exit(1);
}

const options = {
  collapseWhitespace: true,
  // Оставляем одиночный пробел: иначе соседние инлайновые элементы слипаются
  conservativeCollapse: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: false,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: false,
  useShortDoctype: true,
  caseSensitive: true,
  keepClosingSlash: false,
  decodeEntities: true,
  sortAttributes: false,
  sortClassName: false,
};

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Внутренние каталоги Astro трогать не нужно
      if (entry.name === '_a') continue;
      await walk(path, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(path);
    }
  }
  return files;
}

const files = await walk(target);

let before = 0;
let after = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const minified = await minify(html, options);
  await writeFile(file, minified);

  before += Buffer.byteLength(html);
  after += Buffer.byteLength(minified);
}

const saved = before - after;
const percent = before ? ((saved / before) * 100).toFixed(1) : '0';

console.log(
  `HTML минифицирован: ${files.length} файлов, ` +
    `${(before / 1024).toFixed(0)} КБ → ${(after / 1024).toFixed(0)} КБ ` +
    `(экономия ${(saved / 1024).toFixed(0)} КБ, ${percent}%)`,
);

// Отдельно проверяем, что каталог действительно содержит сборку
const indexStat = await stat(join(target, 'index.html')).catch(() => null);
if (!indexStat) {
  console.warn('⚠ В каталоге нет index.html — проверьте путь сборки.');
}
