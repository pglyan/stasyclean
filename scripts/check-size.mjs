#!/usr/bin/env node
/**
 * Проверка бюджетов производительности.
 *
 * Скрипт читает собранный сайт и падает с ошибкой, если какая-то страница
 * или ресурс вышли за бюджет. Это защита от «потихоньку распухло»:
 * добавили блок, лишний шрифт или тяжёлую библиотеку — сборка сразу
 * об этом сообщит, а не через полгода на PageSpeed.
 *
 * Считаем в gzip: именно столько реально скачает браузер.
 *
 * Запуск: node scripts/check-size.mjs [каталог]   (по умолчанию dist)
 */

import { gzipSync } from 'node:zlib';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const target = process.argv[2] ?? 'dist';

/** Бюджеты в килобайтах gzip. */
const BUDGET = {
  /** Любая страница целиком (HTML + инлайновые скрипты). */
  page: 16,
  /** Главная длиннее остальных: на ней собраны все блоки. */
  homePage: 20,
  /** Общий CSS-файл. */
  css: 10,
  /** Инлайновый JS на страницу. */
  js: 6,
  /** Один файл шрифта (самый крупный субсет). */
  fontFile: 40,
  /** Одна OG-картинка — единственный растровый ресурс сайта. */
  ogImage: 80,
};

const kb = (bytes) => bytes / 1024;
const gz = (buffer) => gzipSync(buffer, { level: 9 }).length;

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, files);
    else files.push(path);
  }
  return files;
}

const files = await walk(target);
const problems = [];
const rows = [];

let totalBytes = 0;

for (const file of files) {
  const buffer = await readFile(file);
  totalBytes += buffer.length;
  const size = gz(buffer);

  if (file.endsWith('.html')) {
    /**
     * Главные страницы содержат все блоки, поэтому у них бюджет выше.
     * Язык по умолчанию живёт в корне, остальные — в подпапке, и раньше
     * проверка их не узнавала: en/index.html и ru/index.html (16,8 и 18,5 КБ)
     * судились по бюджету внутренней страницы и валили сборку в CI.
     */
    const isHome = /^([a-z]{2}\/)?(index|404)\.html$/.test(relative(target, file));
    const budget = isHome ? BUDGET.homePage : BUDGET.page;
    rows.push(['страница', file, size, budget]);
    if (kb(size) > budget) problems.push(`${file}: ${kb(size).toFixed(1)} КБ > ${budget} КБ`);
  }

  if (file.endsWith('.css')) {
    rows.push(['CSS', file, size, BUDGET.css]);
    if (kb(size) > BUDGET.css) problems.push(`${file}: ${kb(size).toFixed(1)} КБ > ${BUDGET.css} КБ`);
  }

  if (file.endsWith('.woff2')) {
    rows.push(['шрифт', file, size, BUDGET.fontFile]);
    if (kb(size) > BUDGET.fontFile) {
      problems.push(`${file}: ${kb(size).toFixed(1)} КБ > ${BUDGET.fontFile} КБ`);
    }
  }

  /**
   * PNG уже сжат внутри себя, и gzip ему почти ничего не добавляет,
   * поэтому у OG-картинок бюджет считаем по фактическому размеру файла.
   */
  if (file.includes('/og/') && file.endsWith('.png')) {
    const raw = buffer.length;
    rows.push(['OG', file, raw, BUDGET.ogImage]);
    if (kb(raw) > BUDGET.ogImage) {
      problems.push(`${file}: ${kb(raw).toFixed(1)} КБ > ${BUDGET.ogImage} КБ`);
    }
  }
}

rows.sort((a, b) => b[2] - a[2]);

console.log(`\nПроверка бюджетов: ${target}\n`);
console.log('  тип       размер   бюджет  файл');
console.log('  ' + '-'.repeat(72));
for (const [kind, file, size, budget] of rows.slice(0, 12)) {
  const over = kb(size) > budget ? ' ✗' : '';
  console.log(
    `  ${kind.padEnd(9)} ${kb(size).toFixed(1).padStart(6)} КБ ${String(budget).padStart(5)} КБ  ` +
      `${file.replace(`${target}/`, '')}${over}`,
  );
}

console.log(`\n  Всего в сборке: ${(totalBytes / 1024 / 1024).toFixed(2)} МБ`);

if (problems.length) {
  console.error(`\n✗ Превышено бюджетов: ${problems.length}`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log('\n✓ Все бюджеты соблюдены.\n');
