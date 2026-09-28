#!/usr/bin/env node
/**
 * Синхронизация шрифтов.
 *
 * Копирует вариативные WOFF2 из пакетов Fontsource в public/fonts,
 * оставляя в репозитории только те три субсета, которые реально нужны:
 *   latin      — английский, цифры, служебные символы
 *   latin-ext  — сербская латиница с диакритикой: č ć ž š đ
 *   cyrillic   — русский
 *
 * Почему именно Manrope и Lora, а не Inter:
 * у Inter субсет latin-ext весит 83 КБ, а latin — 47 КБ. Для сербской
 * локали это 130 КБ только на основной шрифт. У Manrope те же субсеты
 * весят 14.8 и 24.3 КБ, то есть страница укладывается в 40–55 КБ
 * (размеры субсетов видны в самих файлах пакетов Fontsource и проверяются
 * бюджетом `npm run check:size`).
 *
 * Зачем свои @font-face, а не Fonts API Astro:
 *   1) сборка не зависит от доступности fonts.googleapis.com —
 *      в закрытых сетях и части CI провайдер отваливается;
 *   2) в репозиторий попадают ровно нужные файлы, а не все субсеты;
 *   3) unicode-range виден глазами и не меняется молча при обновлении
 *      версии провайдера.
 *
 * Почему пять семейств: Manrope — основное, Lora и Playfair Display —
 * редакционные засечные варианты для разных тем, Nunito — округлый шрифт
 * тёплой «Милоты», Comfortaa — геометрический округлый для «Голубой
 * свежести». Все пять покрывают кириллицу и расширенную латиницу (č ć ž š đ),
 * поэтому любой из них можно поставить на все три языка.
 *
 * У Comfortaa есть ограничение самой гарнитуры: верхний вес — 700. Тема,
 * которая ставит её на заголовки, не может сделать их тяжелее, поэтому
 * «жирность заголовков» вынесена в токен (см. --font-heading-weight
 * в src/styles/params.css), а не зашита в CSS темы.
 *
 * В прод-сборку попадают файлы только той темы, что выбрана в
 * design.config.json: тема объявляет свои семейства в src/data/themes.ts
 * (поле available), а конкретные импорты — в src/themes/entries/<id>.ts.
 *
 * Запуск:  node scripts/sync-fonts.mjs
 * Требует установленных
 * @fontsource-variable/{comfortaa,manrope,lora,playfair-display,nunito}.
 */

import { copyFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
/**
 * Файлы кладём в src/assets, а не в public: так Vite обрабатывает их как
 * ассеты — подставляет base (нужно для демо-сборки в подпапке /stasyclean/)
 * и добавляет к имени хеш содержимого для вечного кеша.
 */
const target = join(root, 'src', 'assets', 'fonts');

const FAMILIES = ['manrope', 'lora', 'playfair-display', 'nunito', 'comfortaa'];
const SUBSETS = ['latin', 'latin-ext', 'cyrillic'];

await mkdir(target, { recursive: true });

let total = 0;

for (const family of FAMILIES) {
  for (const subset of SUBSETS) {
    const name = `${family}-${subset}-wght-normal.woff2`;
    const from = join(root, 'node_modules', '@fontsource-variable', family, 'files', name);
    const to = join(target, `${family}-${subset}.woff2`);
    try {
      await copyFile(from, to);
    } catch (error) {
      console.error(`✗ Не найден ${from}`);
      console.error('  Установите зависимости: npm install @fontsource-variable/' + family);
      throw error;
    }

    const { size } = await stat(to);
    total += size;
    console.log(`✓ ${family}-${subset}.woff2 — ${(size / 1024).toFixed(1)} КБ`);
  }
}

console.log(
  `\nИтого: ${FAMILIES.length * SUBSETS.length} файлов, ${(total / 1024).toFixed(1)} КБ на диске.`,
);
console.log('Браузер скачает только те субсеты, чьи символы есть на странице.');
