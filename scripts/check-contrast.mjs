#!/usr/bin/env node
/**
 * Проверка контраста палитр.
 *
 * Зачем отдельный скрипт. Палитра — это несколько цветов, которые видит
 * посетитель: фон, подложки, основной и приглушённый текст, акцент и текст на
 * акценте. Ошибка в одном числе не видна на макете, но делает текст
 * нечитаемым на телефоне в солнечный день. Поэтому цвета проверяются машиной
 * на каждой сборке — и у темы, и у каждой её палитры.
 *
 * Что проверяется (пороги — WCAG AA с запасом):
 *   ink/bg              ≥ 8     основной текст на фоне
 *   ink-soft/bg         ≥ 4.5   приглушённый текст на фоне
 *   ink-soft/surface-2  ≥ 4.5   приглушённый текст на цветной подложке
 *   brand-strong/bg     ≥ 4.6   ссылки и иконки
 *   brand-ink/brand     ≥ 4.6   текст на брендовой заливке (кнопки, полосы)
 *
 * Дополнительно проверяется то, что ломается незаметно:
 *   • свотч темы и каждой палитры сверяется с реальным --brand. До этой
 *     проверки у пяти тем из восьми паспорт расходился с CSS: в панели была
 *     одна плашка, а на сайте (и в <meta name="theme-color">) — другой цвет;
 *   • вторая схема каждой темы (блок [data-scheme] в scheme.css) проверяется
 *     так же, как палитра: контраст и сверка свотча swatchAlt;
 *   • набор палитр в файле темы сверяется с полем available.palettes;
 *   • литеральные цвета (#hex, rgb()) допустимы только внутри блоков токенов.
 *     Всё остальное оформление обязано считаться из переменных через
 *     color-mix(), иначе палитра перестаёт перекрашивать тему целиком.
 *
 * Границы честные: производные значения (color-mix, hsl от токенов) скрипт
 * посчитать не может — он читает литеральные hex и тройку --brand-h/-s/-l.
 * Единственное исключение — --brand-strong: если тема не задала его явно,
 * скрипт считает тот же микс, что описан в tokens.css (78% акцента + чернила),
 * и помечает значение в отчёте как производное. Остальные производные токены
 * (--brand-soft, --brand-ring, --accent-2) в проверку не входят — это написано
 * и в отчёте, чтобы зелёный итог не создавал ложной уверенности.
 *
 * Запуск: node scripts/check-contrast.mjs
 */

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { themePresets } from '../src/data/themes.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Пороги контраста: имя пары → минимум. */
const LIMITS = {
  'инк/фон': 8,
  'мягкий/фон': 4.5,
  'мягкий/подложка': 4.5,
  'ссылка/фон': 4.6,
  'текст на акценте': 4.6,
};

/** ------ Цвет: перевод, контраст, микс в oklab (как в CSS color-mix) ------ */

const HEX_RE = /^#([0-9a-f]{6})$/i;

function parseHex(value) {
  const match = HEX_RE.exec(String(value).trim());
  if (!match) return null;
  const int = parseInt(match[1], 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

function clamp(value) {
  return Math.min(1, Math.max(0, value));
}

function srgbToLinear(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel) {
  const c = clamp(channel);
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

/** Относительная яркость по WCAG: вход — sRGB 0…1. */
function luminance(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

function toHex(rgb) {
  return `#${rgb
    .map((channel) => Math.round(clamp(channel) * 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

function srgbToOklab(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToSrgb(lab) {
  const l = (lab[0] + 0.3963377774 * lab[1] + 0.2158037573 * lab[2]) ** 3;
  const m = (lab[0] - 0.1055613458 * lab[1] - 0.0638541728 * lab[2]) ** 3;
  const s = (lab[0] - 0.0894841775 * lab[1] - 1.291485548 * lab[2]) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(linearToSrgb);
}

/** color-mix(in oklab, a weightA%, b) — то же, что делает CSS. */
function mixOklab(a, b, weightA) {
  const labA = srgbToOklab(a);
  const labB = srgbToOklab(b);
  return oklabToSrgb(labA.map((value, index) => value * weightA + labB[index] * (1 - weightA)));
}

function hslToRgb(hue, saturation, lightness) {
  const h = ((hue % 360) + 360) % 360;
  const s = saturation / 100;
  const l = lightness / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

/** Значение CSS-токена из блока: '34%' → 34. */
function number(token) {
  return parseFloat(String(token).replace('%', '').trim());
}

/** ------ Разбор CSS темы ------ */

const BLOCK_RE = /([^{}]+)\{([^{}]*)\}/g;

/** Экранирует селектор для использования в регулярном выражении. */
function escapeSelector(selector) {
  return selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Токены блока с точным селектором (`[data-skin='mila']`,
 * `[data-skin='bubble'][data-palette='sky']`).
 *
 * Почему по точному селектору, а не «все блоки подряд»: перед блоками лежат
 * комментарии и @import, и любой разбор «от скобки до скобки» ловит их текст
 * в селектор. Точный поиск заодно не путает блок темы с блоками её правил
 * (`[data-skin='mila'] .photo { … }`).
 */
function tokensOf(css, selector) {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const pattern = new RegExp(`${escapeSelector(selector)}\\s*\\{([^{}]*)\\}`);
  const match = pattern.exec(source);
  if (!match) return null;

  const tokens = {};
  for (const declaration of match[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[declaration[1]] = declaration[2].trim();
  }
  return Object.keys(tokens).length ? tokens : null;
}

/** Идентификаторы палитр, для которых в файле есть блок токенов. */
function paletteIdsIn(css) {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...source.matchAll(/\[data-palette='([\w-]+)'\]/g)].map((match) => match[1]);
}

/**
 * Убирает комментарии и тела блоков с переменными, оставляя всё остальное.
 * Именно к остатку применяется правило «литеральные цвета — только в токенах».
 */
function outsideTokens(css) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return withoutComments.replace(new RegExp(BLOCK_RE), (whole, selector, body) => {
    return /--[\w-]+\s*:/.test(body) ? `${selector}{}` : whole;
  });
}

/** ------ Проверка одного набора цветов (тема или палитра) ------ */

const REQUIRED = ['brand-h', 'brand-s', 'brand-l', 'brand-ink', 'bg', 'surface-2', 'ink', 'ink-soft'];

/** Считает пары контраста для набора токенов и отмечает проблемные. */
function evaluate(label, tokens, report) {
  const missing = REQUIRED.filter((token) => tokens[token] === undefined);
  if (missing.length) {
    report.problems.push(`${label}: нет токенов ${missing.map((token) => `--${token}`).join(', ')}.`);
    return null;
  }

  const brand = hslToRgb(number(tokens['brand-h']), number(tokens['brand-s']), number(tokens['brand-l']));
  const bg = parseHex(tokens.bg);
  const surface2 = parseHex(tokens['surface-2']);
  const ink = parseHex(tokens.ink);
  const inkSoft = parseHex(tokens['ink-soft']);
  const brandInk = parseHex(tokens['brand-ink']);

  if (!bg || !surface2 || !ink || !inkSoft || !brandInk) {
    report.problems.push(`${label}: цветовые токены заданы не литеральными hex — проверка невозможна.`);
    return null;
  }

  /**
   * Цвет ссылок: если тема задала его явно — берём как есть; если нет,
   * считаем тот же микс, что описан в tokens.css (78% акцента + чернила),
   * и помечаем в отчёте как производное.
   */
  const declared = tokens['brand-strong'];
  const literal = declared ? parseHex(declared) : null;
  const strong = literal ?? mixOklab(brand, ink, 0.78);

  const ratios = {
    'инк/фон': contrast(ink, bg),
    'мягкий/фон': contrast(inkSoft, bg),
    'мягкий/подложка': contrast(inkSoft, surface2),
    'ссылка/фон': contrast(strong, bg),
    'текст на акценте': contrast(brandInk, brand),
  };

  for (const [pair, value] of Object.entries(ratios)) {
    if (value < LIMITS[pair]) {
      report.problems.push(
        `${label}: контраст «${pair}» = ${value.toFixed(2)} < ${LIMITS[pair]} ` +
          `(ink ${toHex(ink)}, ink-soft ${toHex(inkSoft)}, bg ${toHex(bg)}, подложка ${toHex(surface2)}, ` +
          `акцент ${toHex(brand)}, текст на акценте ${toHex(brandInk)}).`,
      );
    }
  }

  return {
    label,
    ratios,
    brand: toHex(brand),
    derivedStrong: !literal,
    strong: toHex(strong),
  };
}

/** Сверка паспортного свотча темы/палитры с реальным акцентом из CSS. */
function checkSwatch(label, swatch, brandHex, report) {
  if (swatch[1].toLowerCase() !== brandHex.toLowerCase()) {
    report.problems.push(
      `${label}: свотч паспорта ${swatch[1]} не совпадает с акцентом ${brandHex}. ` +
        'Паспорт показывается в демо-панели и уходит в <meta name="theme-color">: ' +
        'обновите swatch в src/data/themes.ts.',
    );
    return false;
  }
  return true;
}

/** Ищет литеральные цвета вне блоков токенов (комментарии уже убраны). */
function findLiterals(css) {
  const found = [];
  const hex = /\B#[0-9a-f]{3,8}\b/gi;
  const rgb = /\brgba?\(/gi;
  for (const pattern of [hex, rgb]) {
    const match = pattern.exec(outsideTokens(css));
    if (match) found.push(match[0]);
  }
  return found;
}

/** ------ Прогон по темам ------ */

const report = { problems: [], rows: [], palettes: 0, schemes: 0 };

for (const theme of themePresets) {
  const themeFile = join(root, 'src', 'themes', theme.id, 'theme.css');
  const palettesFile = join(root, 'src', 'themes', theme.id, 'palettes.css');

  if (!existsSync(themeFile)) {
    report.problems.push(`Тема «${theme.id}»: нет файла src/themes/${theme.id}/theme.css.`);
    continue;
  }

  const themeCss = await readFile(themeFile, 'utf8');
  const baseTokens = tokensOf(themeCss, `[data-skin='${theme.id}']`);
  if (!baseTokens) {
    report.problems.push(`Тема «${theme.id}»: нет блока токенов [data-skin='${theme.id}'].`);
    continue;
  }

  for (const literal of findLiterals(themeCss)) {
    report.problems.push(
      `Тема «${theme.id}»: литеральный цвет ${literal} вне блока токенов ` +
        '(theme.css). Цвета должны считаться из переменных через color-mix(): ' +
        'иначе палитра не перекрасит это место.',
    );
  }

  const base = evaluate(`тема ${theme.id}`, baseTokens, report);
  if (base) {
    checkSwatch(`тема ${theme.id}`, theme.swatch, base.brand, report);
    report.rows.push(base);
  }

  /** Палитры: набор в CSS обязан совпадать с available.palettes. */
  const paletteIds = theme.available.palettes.map((palette) => palette.id);
  const hasFile = existsSync(palettesFile);
  const palettesCss = hasFile ? await readFile(palettesFile, 'utf8') : '';

  if (!hasFile && paletteIds.length) {
    report.problems.push(
      `Тема «${theme.id}»: объявлено палитр ${paletteIds.length} (${paletteIds.join(', ')}), ` +
        `но нет файла src/themes/${theme.id}/palettes.css.`,
    );
  }
  if (hasFile && !paletteIds.length) {
    report.problems.push(
      `Тема «${theme.id}»: есть palettes.css, но available.palettes пуст — ` +
        'панель не покажет ни одной палитры.',
    );
  }

  /** Палитры, объявленные в CSS, но забытые в данных (и наоборот). */
  const inCss = paletteIdsIn(palettesCss);
  for (const id of inCss.filter((id) => !paletteIds.includes(id))) {
    report.problems.push(
      `Тема «${theme.id}»: палитра «${id}» описана в palettes.css, но её нет в available.palettes.`,
    );
  }
  for (const literal of findLiterals(palettesCss)) {
    report.problems.push(
      `Тема «${theme.id}»: литеральный цвет ${literal} вне блока токенов (palettes.css).`,
    );
  }

  for (const palette of theme.available.palettes) {
    const tokens = tokensOf(palettesCss, `[data-skin='${theme.id}'][data-palette='${palette.id}']`);
    if (!tokens) {
      report.problems.push(
        `Тема «${theme.id}»: палитра «${palette.id}» объявлена в available.palettes, ` +
          `но блока [data-skin='${theme.id}'][data-palette='${palette.id}'] в palettes.css нет.`,
      );
      continue;
    }

    report.palettes += 1;
    const scope = evaluate(`${theme.id} · ${palette.id}`, { ...baseTokens, ...tokens }, report);
    if (scope) {
      checkSwatch(`палитра ${theme.id} · ${palette.id}`, palette.swatch, scope.brand, report);
      report.rows.push(scope);
    }
  }

  /**
   * Схема: у каждой темы есть вариация второй схемы — блок
   * [data-skin='<id>'][data-scheme='<противоположная>'] в scheme.css.
   * У светлых тем это тёмная вариация, у nordic — светлая. Проверяем её так
   * же, как палитру: пороги контраста и свотч паспорта (swatchAlt).
   */
  const schemeFile = join(root, 'src', 'themes', theme.id, 'scheme.css');
  if (!existsSync(schemeFile)) {
    report.problems.push(
      `Тема «${theme.id}»: нет файла src/themes/${theme.id}/scheme.css — ` +
        'у темы нет вариации второй схемы, переключатель схемы не сработает.',
    );
  } else {
    const schemeCss = await readFile(schemeFile, 'utf8');
    const altScheme = theme.kind === 'dark' ? 'light' : 'dark';
    const tokens = tokensOf(schemeCss, `[data-skin='${theme.id}'][data-scheme='${altScheme}']`);

    if (!tokens) {
      report.problems.push(
        `Тема «${theme.id}»: нет блока [data-skin='${theme.id}'][data-scheme='${altScheme}'] ` +
          'в scheme.css.',
      );
    } else {
      report.schemes += 1;
      const scope = evaluate(`${theme.id} · ${altScheme}`, { ...baseTokens, ...tokens }, report);
      if (scope) {
        checkSwatch(`схема ${theme.id} · ${altScheme}`, theme.swatchAlt, scope.brand, report);
        report.rows.push(scope);
      }
    }

    for (const literal of findLiterals(schemeCss)) {
      report.problems.push(
        `Тема «${theme.id}»: литеральный цвет ${literal} вне блока токенов (scheme.css).`,
      );
    }
  }
}

/** ------ Отчёт ------ */

const header = ['набор', ...Object.keys(LIMITS)];
const width = [18, ...Object.keys(LIMITS).map(() => 15)];

console.log(`\nПроверка контраста: ${themePresets.length} тем, ${report.palettes} палитр, ${report.schemes} схем\n`);
console.log(
  '  ' + header.map((cell, index) => cell.padEnd(width[index])).join(''),
);
console.log('  ' + '-'.repeat(width.reduce((sum, value) => sum + value, 0)));

for (const row of report.rows) {
  const cells = Object.entries(row.ratios).map(([pair, value]) => {
    const mark = value < LIMITS[pair] ? ' ✗' : row.derivedStrong && pair === 'ссылка/фон' ? ' ~' : '';
    return `${value.toFixed(2)}${mark}`.padEnd(15);
  });
  console.log('  ' + row.label.padEnd(18) + cells.join(''));
}

const derived = report.rows.filter((row) => row.derivedStrong).length;
console.log(
  `\n  ~ — цвет ссылок производный (78% акцента + чернила), как в tokens.css: ${derived} наборов.` +
    '\n  Производные токены (--brand-soft, --brand-ring, --accent-2) и color-mix() вне этих пар' +
    '\n  этой проверкой не покрыты: считается только то, что задано литерально.' +
    '\n  Пороги: ink/bg ≥ 8 · ink-soft к фону и подложке ≥ 4.5 · ссылка к фону ≥ 4.6 ·' +
    '\n  текст на акценте ≥ 4.6.',
);

if (report.problems.length) {
  console.error(`\n✗ Проблем: ${report.problems.length}\n`);
  for (const problem of report.problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log('\n✓ Все палитры проходят пороги контраста, свотчи совпадают с CSS.\n');
