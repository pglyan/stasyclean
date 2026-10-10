#!/usr/bin/env node
/**
 * Проверка контраста цветов тем.
 *
 * Читает src/themes/tokens.ts (единственный источник цветов) и считает
 * пары WCAG. Сгенерированный CSS сверять не с чем: он производится
 * из этих же токенов скриптом gen-theme-tokens.mjs.
 *
 * Запуск: node scripts/check-contrast.mjs
 */

import { readFileSync } from 'node:fs';
import { brandHex, hslToRgb } from '../src/themes/brand.ts';
import { darkTokens, lightTokens } from '../src/themes/tokens.ts';

/** Пороги пар. Ключи — производные CSS-токены, они же идут в отчёте. */
const LIMITS = {
  'ink/bg': 8,
  'ink/surface': 8,
  'ink-soft/bg': 4.5,
  'ink-soft/surface2': 4.5,
  // Ссылки и кнопки — короткий выразительный текст, держим планку 4.6.
  'link/bg': 4.6,
  'btn-ink/btn-bg': 4.6,
  'btn-ink/btn-bg-hover': 4.6,
  'strong/soft': 4.6,
  'on-accent': 4.6,
  // Ошибки и подтверждения живут на карточке формы (фон --surface).
  'danger/surface': 4.5,
  'success/surface': 4.5,
  // Не только текст: границы контейнеров должны быть видимы (WCAG 1.4.11).
  'line/bg': 3,
  'line/surface': 3,
  'card-line/surface': 3,
};

/**
 * Доля чернил в контуре карточки — читаем прямо из tokens.css
 * (--card-line: color-mix(in oklab, var(--ink) NN%, var(--surface))),
 * чтобы проверка не разъезжалась с реальным значением.
 */
const tokensCss = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const cardLineMatch =
  /--card-line:\s*color-mix\(in oklab,\s*var\(--ink\)\s+(\d+)%,\s*var\(--surface\)\)/.exec(
    tokensCss,
  );
if (!cardLineMatch) {
  console.error(
    '✗ Не удалось прочитать --card-line из src/styles/tokens.css — ' +
      'обновите check-contrast.mjs под новый формат значения.',
  );
  process.exit(1);
}
const cardInkShare = Number(cardLineMatch[1]) / 100;

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
    .map((channel) =>
      Math.round(clamp(channel) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
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

function mixOklab(a, b, weightA) {
  const labA = srgbToOklab(a);
  const labB = srgbToOklab(b);
  return oklabToSrgb(labA.map((value, index) => value * weightA + labB[index] * (1 - weightA)));
}

function evaluate(label, t, report) {
  const brand = hslToRgb(t.brandH, t.brandS, t.brandL);
  const bg = parseHex(t.bg);
  const surface = parseHex(t.surface);
  const surface2 = parseHex(t.surface2);
  const ink = parseHex(t.ink);
  const inkSoft = parseHex(t.inkSoft);
  const line = parseHex(t.line);
  const brandInk = parseHex(t.brandInk);
  const danger = parseHex(t.danger);
  const success = parseHex(t.success);

  if (
    !bg ||
    !surface ||
    !surface2 ||
    !ink ||
    !inkSoft ||
    !line ||
    !brandInk ||
    !danger ||
    !success
  ) {
    report.problems.push(`${label}: токены заданы не hex — проверка невозможна.`);
    return null;
  }

  const literal = t.brandStrong ? parseHex(t.brandStrong) : null;
  const strong = literal ?? mixOklab(brand, ink, 0.78);
  const cardLine = mixOklab(ink, surface, cardInkShare);
  // Кнопки мягкие (tokens.css): подложка и её ховер — производные от
  // акцента (12% и 22%), текст кнопки — тот же strong, что и ссылки.
  const brandSoft = mixOklab(brand, surface, 0.12);
  const btnBgHover = mixOklab(brand, surface, 0.22);

  const ratios = {
    'ink/bg': contrast(ink, bg),
    'ink/surface': contrast(ink, surface),
    'ink-soft/bg': contrast(inkSoft, bg),
    'ink-soft/surface2': contrast(inkSoft, surface2),
    'link/bg': contrast(strong, bg),
    'btn-ink/btn-bg': contrast(strong, brandSoft),
    'btn-ink/btn-bg-hover': contrast(strong, btnBgHover),
    'strong/soft': contrast(strong, brandSoft),
    'on-accent': contrast(brandInk, brand),
    // Ошибки и подтверждения живут на карточке формы (фон --surface).
    'danger/surface': contrast(danger, surface),
    'success/surface': contrast(success, surface),
    // Границы контейнеров (WCAG 1.4.11): контурные линии и рамка карточки.
    'line/bg': contrast(line, bg),
    'line/surface': contrast(line, surface),
    'card-line/surface': contrast(cardLine, surface),
  };

  for (const [pair, value] of Object.entries(ratios)) {
    if (value < LIMITS[pair]) {
      report.problems.push(
        `${label}: контраст «${pair}» = ${value.toFixed(2)} < ${LIMITS[pair]} ` +
          `(акцент ${brandHex(t)}, ink-soft ${t.inkSoft}, bg ${t.bg}).`,
      );
    }
  }

  return { label, ratios, brand: brandHex(t), derivedStrong: !literal, strong: toHex(strong) };
}

const report = { problems: [], rows: [], schemes: 0 };

const base = evaluate('nordic', lightTokens, report);
if (base) report.rows.push(base);

report.schemes += 1;
const alt = evaluate('nordic · dark', darkTokens, report);
if (alt) report.rows.push(alt);

const header = ['набор', ...Object.keys(LIMITS)];
const width = [18, ...Object.keys(LIMITS).map(() => 18)];

console.log(`\nПроверка контраста: 1 тема, ${report.schemes} схемы\n`);
console.log('  ' + header.map((cell, index) => cell.padEnd(width[index])).join(''));
console.log('  ' + '-'.repeat(width.reduce((sum, value) => sum + value, 0)));

for (const row of report.rows) {
  const cells = Object.entries(row.ratios).map(([pair, value]) => {
    const mark = value < LIMITS[pair] ? ' ✗' : row.derivedStrong && pair === 'link/bg' ? ' ~' : '';
    return `${value.toFixed(2)}${mark}`.padEnd(18);
  });
  console.log('  ' + row.label.padEnd(18) + cells.join(''));
}

console.log('\n  ~ — цвет ссылок производный (78% акцента + чернила).');

if (report.problems.length) {
  console.error(`\n✗ Проблем: ${report.problems.length}\n`);
  for (const problem of report.problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log('\n✓ Все наборы проходят пороги контраста.\n');
