#!/usr/bin/env node
/**
 * Выбор стиля сайта для сборки.
 *
 * Что делает: читает и проверяет design.config.json, умеет менять отдельные
 * настройки и целиком применять экспорт из демо-панели. Тот же файл читает
 * сборка: astro.config.mjs выбирает по нему CSS и шрифты одной темы,
 * а src/data/activeDesign.ts подставляет значения в разметку.
 *
 * Запуск:
 *   node scripts/design.mjs                       — показать текущий выбор
 *   node scripts/design.mjs list                  — список тем
 *   node scripts/design.mjs set theme=sand radius=4 accentHue=18
 *   node scripts/design.mjs apply settings.json   — применить экспорт панели
 *   node scripts/design.mjs apply -               — то же, но JSON из stdin
 *
 * Готовый рабочий процесс с заказчиком: он выбирает стиль на демо-стенде,
 * жмёт «Скопировать настройки», а результат применяется одной командой —
 * и в прод-сборке остаётся только выбранная тема.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getThemePreset, themeIds } from '../src/data/themes.ts';
import {
  DESIGN_KEYS,
  assertThemeFonts,
  assertThemePalettes,
  resolveDesign,
} from '../src/data/designSchema.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = join(root, 'design.config.json');

/** Поля-числа: остальное — строки. `null` означает «взять значение темы». */
const NUMERIC_FIELDS = new Set(['accentHue', 'radius']);

function coerce(field, value) {
  if (value === 'null' || value === '') return null;
  return NUMERIC_FIELDS.has(field) ? Number(value) : value;
}

function serialize(settings) {
  const ordered = {};
  for (const key of DESIGN_KEYS) ordered[key] = settings[key];
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

async function readConfig() {
  return JSON.parse(await readFile(configPath, 'utf8'));
}

/** Итог для человека: тема, шрифты и подсказка про вес сборки. */
function describe(settings) {
  const theme = getThemePreset(settings.theme);
  const headingFont = settings.headingFont ?? theme.defaults.headingFont;
  const bodyFont = settings.bodyFont ?? theme.defaults.bodyFont;
  assertThemeFonts(theme, settings, { headingFont, bodyFont });

  const palette = settings.palette ?? theme.defaults.palette;
  assertThemePalettes(theme, settings, palette);

  const scheme = settings.scheme ?? theme.kind;

  const families = [...new Set([headingFont, bodyFont].filter((kind) => kind !== 'system'))];

  console.log(`\ndesign.config.json — ${configPath}\n`);
  console.log(serialize(settings).trimEnd());
  console.log(`\n  Тема:            ${theme.id} (${theme.name.ru} / ${theme.name.en})`);
  console.log(
    `  Схема:           ${scheme} (${scheme === theme.kind ? 'натуральная схема темы' : 'вариация'})`,
  );
  console.log(`  Шрифт заголовков: ${headingFont}`);
  console.log(`  Шрифт текста:     ${bodyFont}`);
  console.log(
    `  Палитра:          ${
      palette
        ? `${palette} — из ${theme.available.palettes.join(' | ')}`
        : 'как в теме (у этой темы палитр нет)'
    }`,
  );
  console.log(
    families.length
      ? `  Файлы шрифтов:    ${families.join(', ')} — по 3 субсета, браузер скачает только нужный`
      : '  Файлы шрифтов:    нет — тема обходится системными гарнитурами',
  );
  console.log(
    '\n  В прод-сборку попадут CSS и шрифты только этой темы (см. алиас @skin в astro.config.mjs).',
  );
  console.log('  Проверка после сборки: npm run build:prod && npm run check:clean\n');
}

async function write(settings) {
  await writeFile(configPath, serialize(settings), 'utf8');
}

const [command = 'show', ...rest] = process.argv.slice(2);

try {
  if (command === 'list') {
    console.log('\nДоступные темы (src/data/themes.ts):\n');
    for (const id of themeIds) {
      const theme = getThemePreset(id);
      console.log(
        `  ${id.padEnd(9)} ${theme.kind === 'dark' ? 'тёмная ' : 'светлая'}  ` +
          `${theme.name.ru} / ${theme.name.en}`,
      );
    }
    console.log('\nCSS темы — src/themes/<id>/theme.css, шрифты — src/themes/entries/<id>.ts\n');
  } else if (command === 'set') {
    if (!rest.length) throw new Error('Укажите настройки: set theme=sand radius=4');

    const current = await readConfig();
    const next = { ...current };

    for (const pair of rest) {
      const [field, ...valueParts] = pair.split('=');
      const value = valueParts.join('=');
      if (!DESIGN_KEYS.includes(field)) {
        throw new Error(`Неизвестное поле «${field}». Допустимо: ${DESIGN_KEYS.join(', ')}`);
      }
      next[field] = coerce(field, value);
    }

    const settings = resolveDesign(next, themeIds);
    await write(settings);
    describe(settings);
  } else if (command === 'apply') {
    const source = rest[0];
    if (!source) throw new Error('Укажите файл с JSON или «-» для чтения из stdin.');

    const text = source === '-' ? await readFile(0, 'utf8') : await readFile(resolve(source), 'utf8');
    const settings = resolveDesign(JSON.parse(text), themeIds);

    await write(settings);
    describe(settings);
  } else if (command === 'show' || command === 'config') {
    describe(resolveDesign(await readConfig(), themeIds));
  } else {
    console.log('Неизвестная команда. Доступно: show, list, set, apply.');
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`\n✗ ${error.message}\n`);
  process.exitCode = 1;
}
