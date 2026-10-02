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

/**
 * Демо-стенд по устройству тяжелее прода: он везёт сразу ВСЕ темы и все
 * семейства шрифтов, потому что панель переключает их в браузере. Поэтому
 * у демо-CSS отдельный бюджет — он ловит не «страница потяжелела», а
 * «стенд собирается не так, как задумано». Прод-бюджеты строгие: их
 * проверяет `npm run check:size` (каталог dist).
 *
 * Ориентир по цене темы в демо: ~0,7 КБ gzip на тему, поэтому 20 КБ — это
 * десять тем сегодня плюс запас примерно на пять. Бюджет прод-CSS вырос
 * с 10 до 12 КБ вместе с общими механизмами (фон страницы, декор и петли
 * анимаций, форма фото-слота) и палитрами: они живут в общем слое и CSS
 * темы, поэтому платит за них каждая сборка — это осознанный обмен
 * «переиспользование против байтов», см. README.
 */
const isDemo = /demo/i.test(target);

/** Бюджеты в килобайтах gzip. */
const BUDGET = {
  /** Любая страница целиком (HTML + инлайновые скрипты). */
  page: 16,
  /** Главная длиннее остальных: на ней собраны все блоки. */
  homePage: 20,
  /**
   * Главная демо-стенда — отдельный бюджет.
   *
   * Полностью укомплектованная главная (все блоки) плюс разметка панели
   * настроек: десять тем с названиями на трёх языках, все варианты в группах,
   * мини-превью темы. Это самая тяжёлая страница проекта, и русская версия
   * стенда стояла вплотную к 20 КБ ещё до мобильных доработок (19,8 КБ).
   * Держать её в том же бюджете, что и прод, значит запретить любые
   * добавления в разметку: два атрибута на страницу — уже «превышение».
   *
   * С 21 до 22 КБ бюджет поднят вместе с переключателем схемы в шапке
   * (components/ui/SchemeSwitch.astro и src/scripts/scheme.ts). Это функция
   * САЙТА, а не стенда: тот же код и та же кнопка уезжают в прод, поэтому
   * стенд платит за них на каждой странице. Прод-бюджеты при этом не
   * смягчаются: их проверяет npm run check:size по каталогу dist (15,8 КБ
   * на той же странице против 20 КБ бюджета). На момент поднятия демо-главная
   * занимала 21,6 КБ, то есть запас — 0,4 КБ.
   */
  homePageDemo: 22,
  /** Общий CSS-файл. В демо он содержит все темы сразу. */
  css: isDemo ? 20 : 12,
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
    const budget = isHome ? (isDemo ? BUDGET.homePageDemo : BUDGET.homePage) : BUDGET.page;
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
