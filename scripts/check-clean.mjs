#!/usr/bin/env node
/**
 * Проверка чистоты сборки: «в артефактах только то, что нужно».
 *
 * Зачем отдельный скрипт. Многотемность держится на одном обещании:
 * в прод-сборку попадает CSS и шрифты ТОЛЬКО выбранной темы, а демо-панели
 * там нет вовсе. Обещание легко нарушить незаметно — достаточно одного
 * статического импорта темы или строки в общем CSS, и заказчик получит
 * лишние килобайты либо (хуже) увидит на боевом сайте переключатель тем.
 *
 * Что проверяется (прод, каталог dist):
 *   1. разметка — на каждой странице <html data-skin="выбранная тема">;
 *   2. чужие темы — в HTML/CSS/JS нет ни одного значения data-skin другой
 *      темы. Одной проверки достаточно, потому что правила темы и атрибут
 *      на <html> используют одно и то же имя;
 *   3. CSS темы — селектор темы и её радиус действительно в бандле
 *      (страховка от «тема есть в данных, но CSS не подключился»);
 *   4. палитры — набор палитр в CSS совпадает с полем available.palettes
 *      выбранной темы, а data-palette в разметке берётся только оттуда.
 *      Палитры живут в файле темы, поэтому у чужой темы их быть не может;
 *   5. шрифты — набор woff2 в dist совпадает с семействами, которые тема
 *      разрешает в поле available;
 *   6. демо-следы — ни id панели, ни её хуков, ни ключа localStorage.
 *
 * Демо-сборка (каталог с «demo» в имени) проверяется зеркально: все темы
 * на месте, панель на месте. Так стенд нельзя «починить» так, чтобы
 * в нём не оказалось какой-то темы.
 *
 * Запуск: node scripts/check-clean.mjs [каталог]   (по умолчанию dist)
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveDesign } from '../src/data/designSchema.ts';
import { getThemePreset, themeIds, themePresets } from '../src/data/themes.ts';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2] ?? 'dist';
const demoBuild = /demo/i.test(target);

/**
 * Значение FontKind → префикс файлов субсетов в src/assets/fonts.
 * Имена файлов задаёт scripts/sync-fonts.mjs: <семейство>-<субсет>.woff2.
 */
const FONT_FILE = {
  manrope: 'manrope',
  lora: 'lora',
  playfair: 'playfair-display',
  nunito: 'nunito',
  comfortaa: 'comfortaa',
};

/** Маркеры демо-стенда: панель, её хуки и ключ localStorage. */
const DEMO_MARKERS = ['demo-panel', 'demo-ribbon', 'data-panel', 'panel__', 'stasyclean:demo'];

/** Расширения, содержимое которых имеет смысл просматривать. */
const TEXT_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.webmanifest', '.svg', '.txt', '.xml']);

/** Атрибут в разметке (data-skin="fresh") и селектор в CSS ([data-skin=fresh]). */
const SKIN_VALUE = /data-skin\s*(?:=|:)\s*["']?([\w-]+)/g;

/**
 * Атрибут и селектор палитры — по той же логике, что data-skin: у палитры
 * правила живут в CSS темы, а выбранное значение приходит из разметки.
 * `data-meta-palette`/`data-meta-palettes` панели под шаблон не попадают.
 */
const PALETTE_VALUE = /data-palette\s*(?:=|:)\s*["']?([\w-]+)/g;

const problems = [];
const rel = (file) => relative(target, file) || file;

async function readDesign() {
  const raw = JSON.parse(await readFile(join(repoRoot, 'design.config.json'), 'utf8'));
  return resolveDesign(raw, themeIds);
}

/**
 * Обход артефактов. Служебные каталоги сборки (с точкой в имени, например
 * dist/.prerender) пропускаем: их пишет инструмент, nginx их не отдаёт,
 * и «чужие темы» в них — это код сборщика, а не то, что скачает браузер.
 */
async function walk(dir, files = [], skipped = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.name.startsWith('.')) {
      skipped.push(path);
      continue;
    }
    if (entry.isDirectory()) await walk(path, files, skipped);
    else files.push(path);
  }
  return { files, skipped };
}

try {
  await stat(target);
} catch {
  console.error(`Каталог «${target}» не найден. Сначала соберите сайт: npm run build:prod.`);
  process.exit(1);
}

const design = await readDesign();
const activeTheme = getThemePreset(design.theme);

const { files, skipped } = await walk(target);

/** Тексты артефактов и имена файлов шрифтов — по ним и идут проверки. */
const texts = [];
const fontFamilies = new Map();

for (const file of files) {
  const name = file.slice(file.lastIndexOf('/') + 1);

  if (name.endsWith('.woff2')) {
    /**
     * Имя в dist: <семейство>-<субсет>.<хеш>.woff2 — хеш добавляет Vite.
     * Семейство восстанавливаем по префиксу, а не по строке целиком:
     * иначе в «чужие шрифты» попадал бы каждый файл из-за хеша в имени.
     */
    const family = name.split('.')[0].replace(/-(latin|latin-ext|cyrillic)$/, '');
    if (!fontFamilies.has(family)) fontFamilies.set(family, []);
    fontFamilies.get(family).push(rel(file));
    continue;
  }

  if (TEXT_EXT.has(extname(name))) texts.push({ path: file, content: await readFile(file, 'utf8') });
}

const pages = texts.filter(({ path }) => path.endsWith('.html'));
const css = texts.filter(({ path }) => path.endsWith('.css'));

const hasSkinSelector = (id) =>
  css.some(
    ({ content }) =>
      content.includes(`[data-skin=${id}]`) ||
      content.includes(`[data-skin='${id}']`) ||
      content.includes(`[data-skin="${id}"]`),
  );

const hasSkinAttribute = (id, content) =>
  [...content.matchAll(SKIN_VALUE)].some((match) => match[1] === id);

/** Куда попали значения data-skin: id темы → файлы. */
const skins = new Map();
for (const { path, content } of texts) {
  for (const match of content.matchAll(SKIN_VALUE)) {
    if (!skins.has(match[1])) skins.set(match[1], new Set());
    skins.get(match[1]).add(rel(path));
  }
}

/** Куда попали значения data-palette: id палитры → файлы. */
const palettes = new Map();
for (const { path, content } of texts) {
  for (const match of content.matchAll(PALETTE_VALUE)) {
    if (!palettes.has(match[1])) palettes.set(match[1], new Set());
    palettes.get(match[1]).add(rel(path));
  }
}

/** Палитры, правила которых есть в CSS-бандле (без разметки). */
const palettesInCss = new Set();
for (const { content } of css) {
  for (const match of content.matchAll(PALETTE_VALUE)) palettesInCss.add(match[1]);
}

const lines = [];
const check = (ok, good, bad) => {
  lines.push(`${ok ? '✓' : '✗'} ${ok ? good : bad}`);
  if (!ok) problems.push(bad);
};

/** Семейства шрифтов, которые сборка имеет право везти: available темы. */
const allowedFamilies = (theme) =>
  new Set(
    [...theme.available.heading, ...theme.available.body]
      .filter((kind) => kind !== 'system')
      .map((kind) => FONT_FILE[kind]),
  );

/** Сравнение набора шрифтов в dist с ожидаемым — общее для прод и демо. */
function checkFonts(expected, label) {
  const found = [...fontFamilies.keys()].sort();
  const want = [...expected].sort();
  const extra = found.filter((family) => !expected.has(family));
  const absent = want.filter((family) => !found.includes(family));

  check(
    extra.length === 0 && absent.length === 0,
    `шрифты: ровно ${label} — ${want.join(', ') || 'веб-шрифтов нет'}`,
    extra.length
      ? `шрифты: в сборке есть чужие семейства — ${extra.join(', ')}. ` +
        'Проверьте, что тема не импортирует чужие src/fonts/*.css.'
      : `шрифты: в сборке нет ${absent.join(', ')} — тема их разрешает в available, ` +
        'но файлы не доехали. Проверьте импорты в src/themes/entries/<тема>.ts.',
  );
}

if (!demoBuild) {
  const missing = pages.filter(({ content }) => !hasSkinAttribute(activeTheme.id, content));
  check(
    missing.length === 0,
    `разметка: data-skin="${activeTheme.id}" на всех ${pages.length} страницах`,
    `разметка: нет data-skin="${activeTheme.id}" — ${missing
      .slice(0, 3)
      .map(({ path }) => rel(path))
      .join(', ')}`,
  );

  const foreign = [...skins.keys()].filter((id) => id !== activeTheme.id);
  check(
    foreign.length === 0,
    `чужие темы: ни одного значения data-skin кроме "${activeTheme.id}"`,
    `чужие темы: найдены ${foreign
      .map((id) => `"${id}" (${[...(skins.get(id) ?? [])].slice(0, 2).join(', ')})`)
      .join(', ')}. В прод должна попадать только тема «${activeTheme.id}»: проверьте ` +
      'алиас @skin в astro.config.mjs и статические импорты в src/themes/entries.',
  );

  check(
    hasSkinSelector(activeTheme.id),
    `CSS темы: селектор [data-skin=${activeTheme.id}] есть в бандле`,
    `CSS темы: селектора [data-skin=${activeTheme.id}] нет — CSS темы не подключился.`,
  );

  const radius = design.radius ?? activeTheme.defaults.radius;
  check(
    texts.some(({ content }) => content.includes(`--radius:${radius}px`)),
    `токены темы: --radius:${radius}px на месте`,
    `токены темы: в сборке нет --radius:${radius}px (radius = ${JSON.stringify(design.radius)} ` +
      'в design.config.json).',
  );

  checkFonts(allowedFamilies(activeTheme), `разрешено темой «${activeTheme.id}»`);

  /**
   * Палитры: в бандле должны быть ровно те, что объявила тема.
   * Это вторая половина обещания «палитра — часть темы»: если в CSS попадёт
   * палитра чужой темы, заказчик увидит цвета, которых не выбирал.
   */
  const declared = activeTheme.available.palettes.map((palette) => palette.id).sort();
  const found = [...palettesInCss].sort();
  const same =
    declared.length === found.length && declared.every((id, index) => id === found[index]);

  check(
    same,
    `палитры: ровно палитры темы — ${declared.join(', ') || 'их нет'}`,
    `палитры: в бандле ${found.join(', ') || 'ничего'}, а тема «${activeTheme.id}» объявляет ` +
      `${declared.join(', ') || 'ни одной'}. Проверьте импорт ./palettes.css в CSS темы ` +
      'и поле available.palettes в src/data/themes.ts.',
  );

  const foreignPalettes = [...palettes.keys()].filter((id) => !declared.includes(id));

  /**
   * В разметке стоит не значение конфига, а результат подстановки: если в
   * design.config.json palette = null, тема подставляет свою палитру по
   * умолчанию. Поэтому в сообщении — фактическая палитра, а не поле конфига.
   */
  const effective = design.palette ?? activeTheme.defaults.palette;
  check(
    foreignPalettes.length === 0,
    `разметка и CSS: палитра ${
      effective ? `«${effective}»${design.palette ? '' : ' (умолчание темы)'}` : 'не задана'
    } — из списка темы`,
    `палитры: найдены значения data-palette, которых тема не объявляет — ${foreignPalettes
      .map((id) => `«${id}» (${[...(palettes.get(id) ?? [])].slice(0, 2).join(', ')})`)
      .join(', ')}.`,
  );
} else {
  const panel = pages.filter(({ content }) => content.includes('demo-panel'));
  check(
    panel.length > 0,
    `панель: найдена на ${panel.length} страницах`,
    'панель: в демо-сборке нет разметки панели — стенд не сможет переключать темы.',
  );

  const withoutSkin = themeIds.filter((id) => !hasSkinSelector(id));
  check(
    withoutSkin.length === 0,
    `темы: все ${themeIds.length} тем есть в CSS (${themeIds.join(', ')})`,
    `темы: в демо-CSS нет ${withoutSkin.join(', ')} — добавьте тему в src/themes/all.css ` +
      'и src/themes/entries/all.ts.',
  );

  checkFonts(new Set(Object.values(FONT_FILE)), 'все семейства демо-стенда');

  /**
   * Палитры стенда: в демо должны быть все, иначе группа «Палитра» покажет
   * пустые ряды для тех тем, чьи файлы не доехали.
   */
  const allPalettes = [
    ...new Set(themePresets.flatMap((preset) => preset.available.palettes.map((item) => item.id))),
  ].sort();
  const missingPalettes = allPalettes.filter((id) => !palettesInCss.has(id));

  check(
    missingPalettes.length === 0,
    `палитры: все ${allPalettes.length} палитр стенда в CSS (${allPalettes.join(', ') || 'их нет'})`,
    `палитры: в демо-CSS нет ${missingPalettes.join(', ')} — проверьте импорт ./palettes.css ` +
      'в CSS соответствующей темы.',
  );
}

/** Демо-следы: в демо они обязательны, в проде недопустимы. */
const markerFiles = [];
for (const { path, content } of texts) {
  const hit = DEMO_MARKERS.find((marker) => content.includes(marker));
  if (hit) markerFiles.push(`${rel(path)} — «${hit}»`);
}

if (!demoBuild) {
  check(
    markerFiles.length === 0,
    `демо-следы: не найдено (${DEMO_MARKERS.join(', ')})`,
    `демо-следы в прод-сборке: ${markerFiles.slice(0, 3).join('; ')}. ` +
      'Панель и её стили должны подключаться только при PUBLIC_DEMO=on.',
  );
}

console.log(`\nПроверка чистоты: ${target}${demoBuild ? ' (демо-стенд)' : ''}\n`);
console.log(`  тема        ${activeTheme.id} — ${activeTheme.name.ru}`);
console.log(`  страниц     ${pages.length}`);
console.log(
  `  шрифтов     ${[...fontFamilies.values()].reduce((sum, list) => sum + list.length, 0)} файлов` +
    ` (${[...fontFamilies.keys()].sort().join(', ') || '—'})`,
);
if (skipped.length) {
  console.log(`  пропущено   ${skipped.map((path) => rel(path)).join(', ')} — служебные каталоги сборки`);
}
console.log('');
console.log(lines.map((line) => `  ${line}`).join('\n'));

if (problems.length) {
  console.error(`\n✗ Проблем: ${problems.length}\n`);
  process.exit(1);
}

console.log(
  demoBuild
    ? '\n✓ Демо-стенд собран целиком: все темы и панель на месте.\n'
    : `\n✓ Сборка чистая: в артефактах только тема «${activeTheme.id}».\n`,
);

