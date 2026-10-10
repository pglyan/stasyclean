#!/usr/bin/env node
/**
 * OG-картинки для соцсетей: public/og/{sr,en,ru}.png, ровно 1200×630.
 *
 * Почему скрипт, а не готовые файлы: тексты берутся из тех же данных, что
 * и сайт (src/data/site.ts), поэтому картинки не разъезжаются с контентом.
 *
 * Почему SVG + sharp, а не браузер: в sharp встроены rsvg, pango и fontconfig,
 * а шрифт DejaVu Sans покрывает и сербскую диакритику (č ć ž š đ), и кириллицу.
 * Рендер воспроизводим и не требует ни браузера, ни сети — та же причина, по
 * которой шрифты сайта лежат в репозитории, а не тянутся с fonts.googleapis.com.
 *
 * Файлы считаются генерируемыми и не коммитятся (см. .gitignore):
 * шаг выполняется в dev и в обеих сборках, см. package.json.
 *
 * Запуск: node scripts/make-og.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

/**
 * Данные сайта импортируем как есть: Node 22.18+ исполняет TypeScript без
 * сборки (type stripping), поэтому оффер и бренд на картинке и на сайте —
 * физически одни и те же строки.
 */
import { site, siteText } from '../src/data/site.ts';
import { LOCALE_META } from '../src/i18n/config.ts';
import { brandHex } from '../src/themes/brand.ts';
import { darkTokens } from '../src/themes/tokens.ts';

const WIDTH = 1200;
const HEIGHT = 630;

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og');

const FONT = 'DejaVu Sans, Verdana, sans-serif';

/**
 * Палитра OG-картинки — из токенов темы (src/themes/tokens.ts), а не
 * захардкоженные hex: раньше зелёный на карточке (#12a87b) разошёлся
 * с фирменным цветом сайта (#22765d). Карточка тёмная, поэтому берём
 * набор тёмной схемы (alt) — её акцент рассчитан на тёмный фон.
 */
const palette = darkTokens;
const INK = palette.bg;
const BRAND = brandHex(palette);
const TEXT = palette.ink;
const MUTED = palette.inkSoft;

/** Экранирование для XML: в текстах есть «&», кавычки и длинные тире.
 * @param {string} value
 * @returns {string}
 */
const xml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Разбивка по словам по приблизительной ширине строки.
 * Точной метрики до рендера нет, поэтому коэффициент взят с запасом:
 * текст гарантированно не вылезет за поля 80 px, даже с кириллицей.
 *
 * @param {string} text
 * @param {number} maxWidth
 * @param {number} fontSize
 * @param {number} [ratio]
 * @returns {string[]}
 */
function wrap(text, maxWidth, fontSize, ratio = 0.62) {
  const lines = [];
  let line = '';

  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && candidate.length * fontSize * ratio > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines;
}

/** Знак-«sparkle» из public/favicon.svg — тот же бренд-элемент, что в шапке.
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @returns {string}
 */
function mark(x, y, size) {
  const scale = size / 64;
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <rect width="64" height="64" rx="14" fill="${BRAND}"/>
    <path d="M32 12l4.6 11.4L48 28l-11.4 4.6L32 44l-4.6-11.4L16 28l11.4-4.6z" fill="#ffffff"/>
    <circle cx="45" cy="45" r="4.5" fill="#ffffff" opacity="0.85"/>
  </g>`;
}

/**
 * Подбирает кегль заголовка так, чтобы он занял не больше двух строк.
 * Русский оффер длиннее сербского: на 66 px он расползался на три строки
 * и поджимал таглайн к подписи, поэтому кегль уменьшается до первого
 * размера, при котором текст укладывается в две строки.
 *
 * @param {string} text
 * @param {number} maxWidth
 * @returns {{ fontSize: number, lines: string[] }}
 */
function fitHeadline(text, maxWidth) {
  for (const fontSize of [66, 60, 56, 52, 48]) {
    const lines = wrap(text, maxWidth, fontSize, 0.63);
    if (lines.length <= 2) return { fontSize, lines };
  }

  const fontSize = 44;
  return { fontSize, lines: wrap(text, maxWidth, fontSize, 0.63) };
}

/** Разметка OG-картинки для одной локали.
 * @param {keyof typeof LOCALE_META} locale
 * @returns {string}
 */
function svg(locale) {
  const fitted = fitHeadline(siteText.heroTitle[locale], 1040);
  const headlineLines = fitted.lines;
  const taglineLines = wrap(siteText.tagline[locale], 1040, 31, 0.56);

  const headlineTop = 250;
  const headlineStep = Math.round(fitted.fontSize * 1.24);
  const ruleY = headlineTop + (headlineLines.length - 1) * headlineStep + 44;
  const taglineTop = ruleY + 66;
  const taglineStep = 46;

  const chipLabel = LOCALE_META[locale].label;
  const chipWidth = Math.round(chipLabel.length * 22 * 0.62) + 44;
  const chipX = WIDTH - 80 - chipWidth;

  const handle = `@${site.telegram}`;
  const handleWidth = Math.round(handle.length * 26 * 0.62);

  const headline = headlineLines
    .map(
      (line, index) =>
        `<text x="80" y="${headlineTop + index * headlineStep}" font-family="${FONT}"` +
        ` font-size="${fitted.fontSize}" font-weight="bold" fill="${TEXT}">${xml(line)}</text>`,
    )
    .join('\n  ');

  const tagline = taglineLines
    .map(
      (line, index) =>
        `<text x="80" y="${taglineTop + index * taglineStep}" font-family="${FONT}"` +
        ` font-size="31" fill="${MUTED}">${xml(line)}</text>`,
    )
    .join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="100%" cy="0%" r="85%">
      <stop offset="0%" stop-color="${BRAND}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${BRAND}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${INK}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  ${mark(80, 84, 56)}
  <text x="152" y="124" font-family="${FONT}" font-size="40" font-weight="bold" fill="${TEXT}">${xml(site.brand)}</text>

  <rect x="${chipX}" y="96" width="${chipWidth}" height="44" rx="22" fill="none" stroke="${BRAND}" stroke-width="2"/>
  <text x="${chipX + chipWidth / 2}" y="126" font-family="${FONT}" font-size="22" fill="${BRAND}" text-anchor="middle">${xml(chipLabel)}</text>

  ${headline}

  <rect x="80" y="${ruleY}" width="96" height="8" rx="4" fill="${BRAND}"/>

  ${tagline}

  <text x="80" y="566" font-family="${FONT}" font-size="26" fill="${BRAND}">${xml(handle)}</text>
  <text x="${104 + handleWidth}" y="566" font-family="${FONT}" font-size="26" fill="${MUTED}">·</text>
  <text x="${134 + handleWidth}" y="566" font-family="${FONT}" font-size="26" fill="${MUTED}">${xml(site.domain)}</text>
</svg>`;
}

await mkdir(OUT_DIR, { recursive: true });

for (const locale of Object.keys(LOCALE_META)) {
  /**
   * density: 72 — рендер «пиксель в пиксель» относительно viewBox,
   * поэтому файл всегда получается ровно 1200×630 (проверяем ниже).
   *
   * Палитра 256 цветов + дизеринг: полноцветный PNG с плавным градиентом
   * весил 83 КБ, палитровый — вдвое меньше при том же виде в ленте соцсети.
   * Именно поэтому у OG-картинок бюджет 80 КБ.
   */
  const buffer = await sharp(Buffer.from(svg(locale)), { density: 72 })
    .png({ compressionLevel: 9, palette: true, colours: 256, dither: 1 })
    .toBuffer();

  const meta = await sharp(buffer).metadata();

  if (meta.width !== WIDTH || meta.height !== HEIGHT) {
    throw new Error(
      `OG ${locale}: получилось ${meta.width}×${meta.height}, ожидалось ${WIDTH}×${HEIGHT}`,
    );
  }

  await writeFile(join(OUT_DIR, `${locale}.png`), buffer);
  console.log(
    `OG ${locale}.png — ${(buffer.length / 1024).toFixed(0)} КБ, ${meta.width}×${meta.height}`,
  );
}

console.log(`\nOG-картинки обновлены: public/og/\n`);
