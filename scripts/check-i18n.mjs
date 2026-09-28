#!/usr/bin/env node
/**
 * Проверка целостности языковых версий.
 *
 * Три вида ошибок, которые ловим:
 *
 * 1. Незаполненный перевод в данных. Если у сущности пусто в одной локали,
 *    а в другой нет — это забытый перевод, а не осознанное решение.
 *    (Полностью пустые значения разрешены: так сделаны единицы измерения
 *    вроде «за 1 шт.», где для плоской цены подпись не нужна.)
 *
 * 2. Битые адреса. В сборке должно быть ровно 3 × 13 страниц, у каждой —
 *    lang, canonical, полный набор hreflang и ровно один h1.
 *
 * 3. Протёкший чужой язык. Самая неприятная ошибка мультиязычного сайта —
 *    когда на английской странице вдруг русский текст. Ловим по характерным
 *    словам, которые не могут появиться случайно.
 *
 * 4. Битые внутренние ссылки и адреса в метатегах. Проверяем, что каждый
 *    локальный href/src, canonical, hreflang и og:image разрешается
 *    в реальный файл сборки с учётом base. Именно эта проверка ловит
 *    классическую ошибку «/stasycleanru/» — потерю слэша при склейке
 *    base с путём (см. src/i18n/routes.ts).
 *
 * Запуск: node scripts/check-i18n.mjs [каталог сборки] [base]
 *   node scripts/check-i18n.mjs dist-demo /stasyclean/
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const target = process.argv[2] ?? 'dist';
const problems = [];

/* ---------- 1. Проверка исходных данных ---------- */

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, files);
    else if (entry.name.endsWith('.ts')) files.push(path);
  }
  return files;
}

const sourceFiles = [
  ...(await walk('src/data').catch(() => [])),
  ...(await walk('src/i18n/ui').catch(() => [])),
];

let partial = 0;

for (const file of sourceFiles) {
  const text = await readFile(file, 'utf8');

  // Ищем группы вида { sr: '...', en: '...', ru: '...' }
  const groups = text.match(/\{[^{}]*\bsr:\s*['"`][^'"`]*['"`][^{}]*\bru:\s*['"`][^'"`]*['"`][^{}]*\}/g) ?? [];

  for (const group of groups) {
    const value = (locale) => {
      const match = group.match(new RegExp(`\\b${locale}:\\s*['"\`]([^'"\`]*)['"\`]`));
      return match ? match[1].trim() : null;
    };

    const values = { sr: value('sr'), en: value('en'), ru: value('ru') };
    const filled = Object.values(values).filter((item) => item).length;

    if (filled > 0 && filled < 3) {
      partial += 1;
      const missing = Object.entries(values)
        .filter(([, item]) => !item)
        .map(([locale]) => locale);
      problems.push(`${file}: не заполнено (${missing.join(', ')}): ${group.slice(0, 70)}…`);
    }
  }
}

/* ---------- 2 и 3. Проверка собранных страниц ---------- */

const EXPECTED_PER_LOCALE = 13;
const LOCALES = ['sr', 'en', 'ru'];

async function findPages(dir, pages = []) {
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_a') continue;
      await findPages(path, pages);
    } else if (entry.name === 'index.html') {
      pages.push(path);
    }
  }
  return pages;
}

const pages = await findPages(target);

if (pages.length === 0) {
  problems.push(`${target}: не найдено ни одной страницы — сборка не выполнена?`);
} else {
  const counts = { sr: 0, en: 0, ru: 0 };

  /** Слова, однозначно принадлежащие одному языку. */
  const forbidden = {
    en: ['уборка', 'Генеральная', 'čišćenje', 'Generalno', 'мероприяти'],
    sr: ['уборка', 'Генеральная', 'cleaning service', 'Before and after'],
    ru: ['čišćenje', 'Generalno čišćenje', 'Before and after'],
  };

  for (const page of pages) {
    const html = await readFile(page, 'utf8');
    const short = page.replace(`${target}/`, '');

    // Язык страницы: sr живёт в корне, остальные — в подпапке
    const locale = LOCALES.find((code) => short.startsWith(`${code}/`)) ?? 'sr';
    counts[locale] += 1;

    const lang = html.match(/<html lang="([^"]+)"/)?.[1];
    if (!lang) problems.push(`${short}: нет атрибута lang`);

    if (!html.includes('rel="canonical"')) problems.push(`${short}: нет canonical`);
    if (!html.includes('hreflang="x-default"')) problems.push(`${short}: нет x-default`);

    for (const code of LOCALES) {
      const expected = code === 'sr' ? 'sr-Latn-RS' : code;
      if (!html.includes(`hreflang="${expected}"`)) {
        problems.push(`${short}: нет hreflang для ${expected}`);
      }
    }

    const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1Count !== 1) problems.push(`${short}: найдено h1 — ${h1Count}, ожидался один`);

    // Следы незаполненных данных в разметке
    if (/>\s*undefined\s*</.test(html)) problems.push(`${short}: в разметке выводится undefined`);
    if (html.includes('[object Object]')) problems.push(`${short}: в разметке [object Object]`);
    if (/>\s*NaN\s*</.test(html)) problems.push(`${short}: в разметке NaN`);

    // Протёкший чужой язык
    for (const word of forbidden[locale] ?? []) {
      if (html.includes(word)) {
        problems.push(`${short}: на странице ${locale} найдено «${word}» — вероятно, не переведено`);
      }
    }
  }

  console.log(
    `\nСтраниц в сборке: ${pages.length} ` +
      `(sr ${counts.sr}, en ${counts.en}, ru ${counts.ru} из ${EXPECTED_PER_LOCALE} на язык)`,
  );

  for (const locale of LOCALES) {
    if (counts[locale] !== EXPECTED_PER_LOCALE) {
      problems.push(
        `${locale}: страниц ${counts[locale]}, ожидалось ${EXPECTED_PER_LOCALE}`,
      );
    }
  }
}

/* ---------- 4. Ссылки и адреса в метатегах ---------- */

/**
 * Собираем все HTML сборки, включая 404.html: он тоже содержит ссылки,
 * а в подсчёте «13 страниц на язык» не участвует.
 */
async function findHtmlFiles(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_a') continue;
      await findHtmlFiles(path, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(path);
    }
  }
  return files;
}

/**
 * base сборки определяем по адресу общего CSS-файла в index.html:
 * демо-стенд живёт в подпапке /stasyclean/, прод — в корне домена.
 * Вторым аргументом base можно задать явно.
 */
const indexHtml = await readFile(join(target, 'index.html'), 'utf8').catch(() => '');
const cssBase = indexHtml.match(/href="([^"]*)\/_a\/[^"]+\.css"/)?.[1];
const BASE_PATH = process.argv[3] ?? (cssBase === undefined ? '/' : `${cssBase}/`);
const ORIGIN = indexHtml.match(/rel="canonical" href="(https?:\/\/[^/"]+)/)?.[1] ?? '';

const htmlFiles = await findHtmlFiles(target);

/** Кеш прочитанных файлов: одна страница нужна из десятков ссылок. */
const htmlCache = new Map();

async function htmlOf(file) {
  if (!htmlCache.has(file)) {
    htmlCache.set(file, await readFile(file, 'utf8').catch(() => null));
  }
  return htmlCache.get(file);
}

/** Существует ли страница или файл для пути внутри сайта (уже без base). */
async function findFileFor(rel) {
  const clean = decodeURIComponent(rel).replace(/^\/+|\/+$/g, '');
  const candidates = clean ? [clean, `${clean}/index.html`, `${clean}.html`] : ['index.html'];

  for (const candidate of candidates) {
    const info = await stat(join(target, candidate)).catch(() => null);
    if (info?.isFile()) return candidate;
  }

  return null;
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Значение атрибута похоже на адрес, а не на текст описания или «width=device-width». */
function looksLikeUrl(value) {
  if (/\s/.test(value) || value === '') return false;
  if (/^(\/|https?:\/\/|\/\/|\.{1,2}\/)/.test(value)) return true;
  return /\.(html|png|jpe?g|svg|webp|avif|ico|xml|txt|json|webmanifest|woff2?)$/i.test(value);
}

let checkedLinks = 0;

for (const file of htmlFiles) {
  const html = await htmlOf(file);
  if (!html) continue;

  const short = file.replace(`${target}/`, '');
  /** Адрес самой страницы — база для разрешения относительных ссылок. */
  const pageUrl = `https://internal${BASE_PATH}${short}`;
  const seen = new Set();

  for (const [, raw] of html.matchAll(/(?:href|src|content)="([^"]+)"/g)) {
    if (seen.has(raw) || !looksLikeUrl(raw)) continue;
    seen.add(raw);
    // Якорь текущей страницы и не-http схемы проверять нечем
    if (/^(#|mailto:|tel:|data:|javascript:)/.test(raw)) continue;

    let parsed;
    try {
      parsed = new URL(raw, pageUrl);
    } catch {
      continue;
    }

    // Внешние адреса (Telegram, Instagram) не проверяем — только свои
    if (parsed.host !== 'internal' && parsed.origin !== ORIGIN) continue;
    checkedLinks += 1;

    if (!parsed.pathname.startsWith(BASE_PATH)) {
      problems.push(
        `${short}: «${raw}» вне base ${BASE_PATH} — вероятно, потерян слэш при склейке`,
      );
      continue;
    }

    const found = await findFileFor(parsed.pathname.slice(BASE_PATH.length));
    if (!found) {
      problems.push(`${short}: «${raw}» ведёт в никуда — в сборке нет такого файла`);
      continue;
    }

    // Якорь обязан существовать на целевой странице
    const fragment = parsed.hash.slice(1);
    if (!fragment) continue;

    const targetHtml = await htmlOf(join(target, found));
    const anchor = new RegExp(`id=["']?${escapeRegExp(fragment)}["'\\s>]`);
    if (targetHtml && !anchor.test(targetHtml)) {
      problems.push(`${short}: «${raw}» — на странице ${found} нет id="${fragment}"`);
    }
  }
}

console.log(
  `\nСсылок и адресов проверено: ${checkedLinks} (base ${BASE_PATH}, всего HTML-файлов ${htmlFiles.length})`,
);

/* ---------- Итог ---------- */

if (problems.length) {
  console.error(`\n✗ Найдено проблем: ${problems.length}\n`);
  for (const problem of problems) console.error(`  • ${problem}`);
  console.error('\nПроверено: переводы в данных, адреса, метатеги, чужой язык в разметке.\n');
  process.exit(1);
}

console.log('\n✓ Языковые версии целостны: переводы заполнены, ссылки и метатеги ведут на существующие файлы.\n');
