#!/usr/bin/env node
/**
 * Проверка контраста цветов тем.
 *
 * Читает src/themes/tokens.ts (единственный источник цветов) и считает
 * пары WCAG. Пороги: ink/bg ≥ 8, ink-soft ≥ 4.5, ссылка ≥ 4.6, текст на
 * акценте ≥ 4.6. Сгенерированный CSS сверять не с чем: он производится
 * из этих же токенов скриптом gen-theme-tokens.mjs.
 *
 * Запуск: node scripts/check-contrast.mjs
 */

import { themePresets } from '../src/data/themes.ts';
import { brandHex, themeColors } from '../src/themes/tokens.ts';

const LIMITS = {
  'инк/фон': 8,
  'мягкий/фон': 4.5,
  'мягкий/подложка': 4.5,
  'ссылка/фон': 4.6,
  'текст на акценте': 4.6,
};

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

function number(token) {
  return parseFloat(String(token).replace('%', '').trim());
}

function evaluate(label, t, report) {
  const brand = hslToRgb(number(t.brandH), number(t.brandS), number(t.brandL));
  const bg = parseHex(t.bg);
  const surface2 = parseHex(t.surface2);
  const ink = parseHex(t.ink);
  const inkSoft = parseHex(t.inkSoft);
  const brandInk = parseHex(t.brandInk);

  if (!bg || !surface2 || !ink || !inkSoft || !brandInk) {
    report.problems.push(`${label}: токены заданы не hex — проверка невозможна.`);
    return null;
  }

  const literal = t.brandStrong ? parseHex(t.brandStrong) : null;
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
          `(акцент ${brandHex(t)}, ink-soft ${t.inkSoft}, bg ${t.bg}).`,
      );
    }
  }

  return { label, ratios, brand: brandHex(t), derivedStrong: !literal, strong: toHex(strong) };
}

const report = { problems: [], rows: [], palettes: 0, schemes: 0 };

for (const theme of themePresets) {
  const colors = themeColors[theme.id];
  if (!colors) {
    report.problems.push(`Тема «${theme.id}»: нет токенов в src/themes/tokens.ts.`);
    continue;
  }

  const declared = [...theme.available.palettes].sort();
  const inTokens = Object.keys(colors.palettes).sort();
  const same = declared.length === inTokens.length && declared.every((id, i) => id === inTokens[i]);
  if (!same) {
    report.problems.push(
      `Тема «${theme.id}»: палитры в available (${declared.join(', ') || '—'}) ` +
        `не совпадают с tokens.ts (${inTokens.join(', ') || '—'}).`,
    );
  }

  const altScheme = theme.kind === 'dark' ? 'light' : 'dark';

  const base = evaluate(`тема ${theme.id}`, colors.base, report);
  if (base) report.rows.push(base);

  for (const pid of declared) {
    const tokens = colors.palettes[pid];
    if (!tokens) continue;
    report.palettes += 1;
    const scope = evaluate(`${theme.id} · ${pid}`, tokens, report);
    if (scope) report.rows.push(scope);
  }

  report.schemes += 1;
  const alt = evaluate(`${theme.id} · ${altScheme}`, colors.alt, report);
  if (alt) report.rows.push(alt);
}

const header = ['набор', ...Object.keys(LIMITS)];
const width = [18, ...Object.keys(LIMITS).map(() => 15)];

console.log(`\nПроверка контраста: ${themePresets.length} тем, ${report.palettes} палитр, ${report.schemes} схем\n`);
console.log('  ' + header.map((cell, index) => cell.padEnd(width[index])).join(''));
console.log('  ' + '-'.repeat(width.reduce((sum, value) => sum + value, 0)));

for (const row of report.rows) {
  const cells = Object.entries(row.ratios).map(([pair, value]) => {
    const mark = value < LIMITS[pair] ? ' ✗' : row.derivedStrong && pair === 'ссылка/фон' ? ' ~' : '';
    return `${value.toFixed(2)}${mark}`.padEnd(15);
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
