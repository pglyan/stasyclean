#!/usr/bin/env node
/**
 * Проверка мобильной вёрстки в настоящем браузере.
 *
 * Зачем отдельный скрипт. Мобильные дефекты не видно ни в типах, ни в
 * бюджетах, ни в разметке: всё, что ломается, ломается в вычисленной ширине.
 * Именно так в этом проекте и появились три незамеченные ошибки — шапка
 * требовала 392px при экране 320px, строка прайса с длинным текстом уезжала
 * за край на 27px, а закреплённая панель была на 15px выше собственного
 * резерва. Все три давали горизонтальный скролл всей страницы, а мобильный
 * браузер показывал сайт уменьшенным.
 *
 * Что проверяется на каждой странице и каждой ширине телефона:
 *   1. нет горизонтального скролла (scrollWidth ≤ clientWidth);
 *   2. цели нажатия не меньше 44×44px (Apple HIG, Material, WCAG 2.5.8);
 *   3. поля ввода не меньше 16px (иначе iOS Safari зумит страницу);
 *   4. fixed-элементы (панель действий, баннер cookie, кнопка демо-панели)
 *      не накладываются друг на друга;
 *   5. резерв под закреплённую панель не меньше её фактической высоты,
 *      а содержимое подвала не оказывается под панелью.
 *
 * Playwright НЕ входит в зависимости проекта: это единственная проверка,
 * которой нужен браузер (~150 МБ), и она не должна утяжелять `npm ci` и CI
 * по умолчанию. Запуск:
 *
 *   npm i -D playwright && npx playwright install chromium   # один раз
 *   npm run check:mobile                                     # после сборки
 *   npm run check:mobile:demo                                # демо-стенд
 *
 * Скрипт ищет Playwright в трёх местах: переменная окружения PLAYWRIGHT_DIR,
 * обычное разрешение модуля (пакет в проекте или глобально) и кэш `npx`.
 * Если браузера нет нигде — объясняет, что установить, а не падает стеком.
 *
 * Запуск: node scripts/check-mobile.mjs [каталог] [базовый путь]
 */

import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { extname, join, normalize, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const target = resolve(process.argv[2] ?? 'dist');
/** Базовый путь демо-стенда на GitHub Pages: /stasyclean/. */
const base = process.argv[3] ?? '/';

/** Ширины телефонов: 320 — узкий, 360 — самый частый Android, 390 — iPhone. */
const WIDTHS = [320, 360, 390];
const VIEWPORT_HEIGHT = 780;

/** Минимум для цели нажатия (px) и для кегля в поле ввода (px). */
const MIN_TARGET = 44;
const MIN_FIELD_FONT = 16;

/**
 * «Управляющие» элементы, к которым применяется минимум 44px.
 *
 * Список явный, а не «все ссылки»: строчные ссылки внутри текста (например
 * на политику приватности в согласии) по определению не могут быть 44px, и
 * WCAG 2.5.8 делает для них исключение.
 *
 * Чекбоксы и радиокнопки из списка исключены намеренно: их реальная цель —
 * не квадрат 18×18px, а <label>, внутри которого они лежат. Поэтому вместо
 * них проверяются сами label'ы: .check (доп. задачи в калькуляторе) и
 * .form__consent (согласие в форме заявки).
 */
const CONTROLS = [
  'a.btn',
  'button',
  '.chip',
  '.check',
  '.tabs__tab',
  '.lang__item',
  '.nav__link',
  '.footer__col a',
  '.service-card__name a',
  'a.brand',
  '.form__consent',
  '.burger',
  'summary',
  '[role="tab"]',
  'input:not([type="checkbox"]):not([type="radio"])',
  'select',
  'textarea',
].join(', ');

/** Поля ввода, к которым применяется правило 16px (чекбоксы — нет). */
const FIELDS = 'input:not([type="checkbox"]):not([type="radio"]), select, textarea';

/** MIME-типы ровно те, что встречаются в сборке. */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
};

/**
 * Разрешение Playwright (см. комментарий в начале файла).
 * @returns {Promise<import('playwright').BrowserType|null>}
 */
async function loadChromium() {
  const candidates = [];

  if (process.env.PLAYWRIGHT_DIR) candidates.push(join(process.env.PLAYWRIGHT_DIR, 'playwright'));
  candidates.push('playwright');

  // Кэш npx: сюда Playwright попадает, если его уже запускали через `npx`.
  const npxRoot = join(homedir(), '.npm', '_npx');
  for (const entry of await readdir(npxRoot).catch(() => [])) {
    candidates.push(join(npxRoot, entry, 'node_modules', 'playwright'));
  }

  for (const candidate of candidates) {
    try {
      const specifier = candidate.includes('/') ? pathToFileURL(join(candidate, 'index.js')).href : candidate;
      // Playwright — CommonJS-пакет: именованный экспорт `chromium` виден не
      // всем загрузчикам, поэтому смотрим и в именованные экспорты, и в default.
      const module = await import(specifier);
      const chromium = module.chromium ?? module.default?.chromium;
      if (chromium) return chromium;
    } catch {
      // Пробуем следующий путь: отсутствие пакета здесь — ожидаемая ситуация.
    }
  }

  return null;
}

/**
 * Раздача собранного сайта «как nginx»: каталог → index.html, с базовым
 * путём демо-стенда. Один в один с scripts/serve.mjs, но внутри процесса:
 * проверке не нужен отдельный сервер в другом окне.
 */
async function startServer() {
  const resolveFile = async (urlPath) => {
    let clean = normalize(decodeURIComponent(urlPath.split('?')[0]));
    if (base !== '/' && clean.startsWith(base)) clean = clean.slice(base.length) || '/';
    const direct = join(target, clean);
    if (!direct.startsWith(target)) return null;

    const candidates = clean.endsWith('/') ? [join(direct, 'index.html')] : [direct, join(direct, 'index.html')];
    for (const candidate of candidates) {
      const info = await stat(candidate).catch(() => null);
      if (info?.isFile()) return candidate;
    }
    return null;
  };

  const server = createServer(async (request, response) => {
    const file = await resolveFile(request.url ?? '/');
    if (!file) {
      response.writeHead(404, { 'Content-Type': MIME['.html'] });
      response.end('not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    response.end(await readFile(file));
  });

  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const { port } = server.address();

  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise((done) => server.close(done)),
  };
}

/** Все страницы сборки: путь каталога с index.html → адрес на сервере. */
async function collectPages(dir) {
  const found = [];

  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const path = join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(path);
        continue;
      }
      if (entry.name !== 'index.html') continue;

      const parent = relative(dir, current);
      found.push(parent ? `${parent}/` : '');
    }
  }

  await walk(dir);
  return found.sort();
}

/**
 * Всё, что проверяется в браузере. Функция выполняется НА СТРАНИЦЕ, поэтому
 * не должна ничего брать из замыкания — параметры приходят аргументом.
 */
function inspectPage(config) {
  const problems = [];
  const viewportWidth = document.documentElement.clientWidth;

  const describe = (el) => {
    const classes =
      typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 24);
    return `${el.tagName.toLowerCase()}${classes ? `.${classes}` : ''}${text ? ` «${text}»` : ''}`;
  };

  /** Переполнение внутри своего скролл-контейнера — это не дефект страницы. */
  const insideScrollContainer = (el) => {
    for (let node = el.parentElement; node; node = node.parentElement) {
      if (getComputedStyle(node).overflowX !== 'visible') return true;
    }
    return false;
  };

  // 1. Горизонтальный скролл всей страницы
  const scrollWidth = document.documentElement.scrollWidth;
  if (scrollWidth > viewportWidth + 1) {
    let worst = null;
    for (const el of document.querySelectorAll('body *')) {
      const style = getComputedStyle(el);
      if (style.position === 'fixed' || style.display === 'none' || style.visibility === 'hidden') continue;

      const rect = el.getBoundingClientRect();
      if (!rect.width || rect.right <= viewportWidth + 1 || insideScrollContainer(el)) continue;
      if (!worst || rect.right > worst.right) worst = { right: rect.right, el: describe(el) };
    }

    problems.push(
      `горизонтальный скролл: страница шире экрана на ${scrollWidth - viewportWidth}px` +
        (worst ? ` — ${worst.el}` : ''),
    );
  }

  // 2. Цели нажатия
  for (const el of document.querySelectorAll(config.controls)) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;

    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    if (rect.height + 0.5 < config.minTarget) {
      problems.push(
        `цель нажатия ${Math.round(rect.width)}×${Math.round(rect.height)}px (нужно ${config.minTarget}px) — ${describe(el)}`,
      );
    }
  }

  // 3. Кегль в полях ввода: меньше 16px — iOS зумит страницу при фокусе
  for (const el of document.querySelectorAll(config.fields)) {
    const style = getComputedStyle(el);
    if (style.display === 'none') continue;

    const size = Number.parseFloat(style.fontSize);
    if (size < config.minFieldFont) {
      problems.push(`поле ввода ${size}px, нужно ≥${config.minFieldFont}px (иначе iOS зумит) — ${describe(el)}`);
    }
  }

  // 4. Наложение fixed-элементов: панель действий, cookie, кнопка демо-панели
  const fixed = [...document.querySelectorAll('body *')].filter((el) => {
    const style = getComputedStyle(el);
    return (
      style.position === 'fixed' &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      el.getBoundingClientRect().width > 0
    );
  });

  for (let i = 0; i < fixed.length; i += 1) {
    for (let j = i + 1; j < fixed.length; j += 1) {
      const a = fixed[i].getBoundingClientRect();
      const b = fixed[j].getBoundingClientRect();
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapX > 4 && overlapY > 4) {
        problems.push(
          `fixed-элементы накладываются (${Math.round(overlapX)}×${Math.round(overlapY)}px): ` +
            `${describe(fixed[i])} и ${describe(fixed[j])}`,
        );
      }
    }
  }

  // 5. Резерв под закреплённую панель не меньше самой панели
  const sticky = document.querySelector('.sticky-cta');
  if (sticky && getComputedStyle(sticky).display !== 'none') {
    const barHeight = sticky.getBoundingClientRect().height;
    const reserve = Number.parseFloat(getComputedStyle(document.body).paddingBlockEnd) || 0;
    if (reserve + 1 < barHeight) {
      problems.push(
        `резерв под панель действий ${Math.round(reserve)}px меньше её высоты ${Math.round(barHeight)}px`,
      );
    }
  }

  return problems;
}

/**
 * Отдельная проверка: не закрывает ли панель действий содержимое подвала.
 * Требует прокрутки в конец страницы, поэтому выполняется один раз на ширину.
 */
function inspectFooterCoverage() {
  return new Promise((done) => {
    // Прокрутка обязательно мгновенная: в base.css у html стоит
    // scroll-behavior: smooth, и на анимации проверка ловила бы подвал
    // в момент, когда он проезжает под панелью — ложное срабатывание.
    scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    setTimeout(() => {
      const sticky = document.querySelector('.sticky-cta');
      if (!sticky || getComputedStyle(sticky).display === 'none') return done([]);

      const bar = sticky.getBoundingClientRect();
      const covered = [...document.querySelectorAll('.site-footer a, .site-footer p')]
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          return rect.height > 0 && rect.bottom > bar.top + 1 && rect.top < bar.bottom;
        })
        .map((el) => el.textContent.trim().replace(/\s+/g, ' ').slice(0, 28));

      done(covered);
    }, 300);
  });
}

/**
 * Мобильное меню проверяется отдельно: оно открывается по клику.
 * Внутри смотрим только цели нажатия и то, что меню занимает экран целиком —
 * наложение fixed-слоёв здесь ожидаемо, меню перекрывает страницу намеренно.
 */
function inspectDrawer(config) {
  const drawer = document.querySelector('.drawer');
  if (!drawer || drawer.hidden) return ['меню не открылось — элемент .drawer скрыт или отсутствует'];

  const problems = [];
  const rect = drawer.getBoundingClientRect();

  if (rect.height + 1 < window.innerHeight) {
    problems.push(`меню занимает ${Math.round(rect.height)}px при высоте экрана ${window.innerHeight}px`);
  }

  for (const el of drawer.querySelectorAll('a, button')) {
    const target = el.getBoundingClientRect();
    if (!target.width || !target.height) continue;
    if (target.height + 0.5 < config.minTarget) {
      const classes = typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : '';
      problems.push(
        `цель нажатия в меню ${Math.round(target.width)}×${Math.round(target.height)}px — ` +
          `${el.tagName.toLowerCase()}${classes ? `.${classes}` : ''}`,
      );
    }
  }

  return problems;
}

const chromium = await loadChromium();

if (!chromium) {
  console.error(`
✗ Playwright не найден.

  Это единственная проверка проекта, которой нужен настоящий браузер, и он
  намеренно не входит в зависимости: ~150 МБ и время в CI. Установите один раз —

    npm i -D playwright && npx playwright install chromium

  либо укажите путь к уже установленному пакету явно:

    PLAYWRIGHT_DIR=~/.npm/_npx/<хеш>/node_modules npm run check:mobile
`);
  process.exit(1);
}

const server = await startServer();
const browser = await chromium.launch();
const context = await browser.newContext({ hasTouch: true });
const page = await context.newPage();

const config = {
  controls: CONTROLS,
  fields: FIELDS,
  minTarget: MIN_TARGET,
  minFieldFont: MIN_FIELD_FONT,
};

const pages = await collectPages(target);
const failures = [];

console.log(`\nПроверка мобильной вёрстки: ${relative(process.cwd(), target) || target}`);
console.log(`  страниц ${pages.length} · ширины ${WIDTHS.join(', ')}px · базовый путь ${base}\n`);

for (const path of pages) {
  const url = `${server.origin}${base}${path}`;
  const marks = [];

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
    await page.goto(url, { waitUntil: 'load' });

    const problems = await page.evaluate(inspectPage, config);

    // Подвал проверяем на одной ширине: прокрутка в конец страницы дороже,
    // чем остальные проверки, а результат от ширины почти не зависит.
    if (width === 360) {
      const covered = await page.evaluate(inspectFooterCoverage);
      if (covered.length) problems.push(`подвал закрыт панелью действий: ${covered.join(' | ')}`);
    }

    // Мобильное меню открываем один раз: это самый нагруженный элемент
    // на телефоне, и проверить его без клика нельзя.
    if (path === '' && width === 360) {
      try {
        await page.click('[data-menu-open]');
        await page.waitForTimeout(400);
        problems.push(...(await page.evaluate(inspectDrawer, config)));
      } catch (error) {
        problems.push(`мобильное меню не открывается: ${error.message.split('\n')[0]}`);
      }
    }

    marks.push(problems.length ? `${width} ✗` : `${width} ✓`);
    for (const problem of problems) failures.push({ where: `/${path} @${width}px`, problem });
  }

  console.log(`  /${path.padEnd(30)} ${marks.join('  ')}`);
}

await context.close();
await browser.close();
await server.close();

if (failures.length) {
  /**
   * Проблемы группируются по типу: одна и та же ошибка повторяется на
   * десятках страниц, и плоский список из четырёхсот строк не читается.
   * Показываем тип, сколько раз он встретился и где именно — по одному
   * примеру на тип (их и достаточно, чтобы найти место в коде).
   */
  const kinds = new Map();

  for (const { where, problem } of failures) {
    const kind = problem.replace(/\d+(\.\d+)?/g, 'N').replace(/«[^»]*»/g, '«…»');
    const entry = kinds.get(kind) ?? { count: 0, first: where };
    entry.count += 1;
    kinds.set(kind, entry);
  }

  console.error(`\n✗ Проблем мобильной вёрстки: ${failures.length} (типов: ${kinds.size})\n`);

  for (const [kind, entry] of [...kinds].sort((a, b) => b[1].count - a[1].count)) {
    console.error(`  ×${String(entry.count).padStart(4)}  ${kind}`);
    console.error(`         например: ${entry.first}`);
  }

  console.error(
    '\nПроверялись: горизонтальный скролл · цели нажатия ≥44px · поля ввода ≥16px ·\n' +
      'наложение fixed-элементов · резерв и содержимое под панелью действий · меню телефона.\n',
  );
  process.exit(1);
}

console.log(
  `\n✓ ${pages.length} страниц × ${WIDTHS.length} ширины: горизонтального скролла нет,\n` +
    '  цели нажатия и кегль полей в норме, fixed-слои не пересекаются.\n',
);



