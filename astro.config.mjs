import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * StasyClean — статический сайт клининговой компании (Белград).
 *
 * Два режима сборки из одного исходника:
 *   npm run build:demo  →  PUBLIC_DEMO=on      → site=https://pglyan.github.io, base=/stasyclean, панель тем ВКЛ
 *   npm run build:prod  →  PUBLIC_DEMO не задан → site=https://stasyclean.com, base=/, панель тем ВЫКЛ
 *
 * Флаг вынесен в переменную окружения, а не в `--mode`: так он одинаково
 * виден и в этом конфиге (process.env), и в компонентах, и в клиентском
 * скрипте (import.meta.env.PUBLIC_DEMO) без дополнительных настроек.
 *
 * Прод-сборка — обычный набор index.html + хешированные assets,
 * отдаётся nginx из корня домена и не требует Node на сервере.
 */

/**
 * Режим сборки задаётся переменной окружения PUBLIC_DEMO=on.
 *
 * Почему не через `--mode`: Astro принимает флаг `--mode`, но конфиг —
 * это обычный объект (функциональную форму defineConfig Astro не
 * поддерживает), поэтому значение `mode` до конфига не доходит, и базовый
 * путь с каталогом вывода выбрать по нему нельзя.
 *
 * Переменную окружения видит и этот конфиг (process.env), и компоненты
 * (import.meta.env.PUBLIC_DEMO), причём в компоненты она попадает ещё и
 * из файла .env.demo при `--mode demo`. Оба механизма включены намеренно:
 * так демо-сборку нельзя собрать «наполовину».
 */
const isDemo = process.env.PUBLIC_DEMO === 'on';

/**
 * Выбранный стиль для прод-сборки — design.config.json в корне.
 *
 * Читаем файл здесь, а не через импорт: конфиг обычный JSON, и его же
 * читает src/data/activeDesign.ts для разметки и scripts/design.mjs для CLI.
 * Отсюда берётся только id темы — он решает, какие CSS и шрифты попадут
 * в сборку.
 */
const designConfig = JSON.parse(
  readFileSync(new URL('./design.config.json', import.meta.url), 'utf8'),
);
const activeThemeId = designConfig.theme;

/**
 * Алиасы выбора темы.
 *
 * Задача: чтобы «много тем» было бесплатным для продакшена. В прод-сборке
 * алиас указывает на файлы ОДНОЙ темы, поэтому в бандл попадают только её
 * CSS и только её шрифты — остальные темы физически не существуют в dist.
 * В демо алиас ведёт на «сводные» входы со всеми темами: стенду нужно
 * переключать тему в браузере.
 *
 * Проверка, что в прод-артефактах нет чужих тем, — scripts/check-clean.mjs.
 */
const themeEntry = (path) => fileURLToPath(new URL(path, import.meta.url));

const themeAlias = isDemo
  ? {
      '@skin': themeEntry('./src/themes/all.css'),
      '@theme': themeEntry('./src/themes/entries/all.ts'),
    }
  : {
      '@skin': themeEntry(`./src/themes/${activeThemeId}/theme.css`),
      '@theme': themeEntry(`./src/themes/entries/${activeThemeId}.ts`),
    };

const PROD_ORIGIN = 'https://stasyclean.com';
const DEMO_ORIGIN = 'https://pglyan.github.io';
const DEMO_BASE = '/stasyclean';

/**
 * Субсеты шрифтов.
 * Браузер скачивает файл только когда на странице встречается символ
 * из его unicode-range, поэтому держим ровно три нужные группы:
 *   latin      — английский, цифры, служебные символы
 *   latin-ext  — сербская латиница с диакритикой: č ć ž š đ
 *   cyrillic   — русский
 * Сами файлы и правила @font-face — в src/assets/fonts и src/styles/fonts.css.
 */

export default defineConfig({
  /**
   * Режим сборки:
   *   npm run build:demo → site=pglyan.github.io, base=/stasyclean, панель ВКЛ
   *   npm run build:prod → site=stasyclean.com, base=/, панель ВЫКЛ
   */
  site: isDemo ? DEMO_ORIGIN : PROD_ORIGIN,
  base: isDemo ? DEMO_BASE : '/',
  output: 'static',
  outDir: isDemo ? './dist-demo' : './dist',
  trailingSlash: 'ignore',

  build: {
    format: 'directory',
    /**
     * `auto` инлайнит только очень маленькие стили (<4 КБ). Наш общий CSS
     * весит около 34 КБ минифицированного, поэтому он уходит отдельным
     * файлом с хешем в имени.
     *
     * Почему так лучше инлайна на этом сайте: страниц 39, и человек
     * обычно смотрит 2–4 из них. Внешний файл с годовым кешем скачивается
     * один раз, а инлайн заставлял бы платить ~34 КБ на каждой странице
     * и терять кеш. Проверка размеров — npm run check:size.
     */
    inlineStylesheets: 'auto',
    assets: '_a',
  },

  i18n: {
    locales: ['sr', 'en', 'ru'],
    defaultLocale: 'sr',
    // sr живёт в корне домена, en и ru — в подпапках.
    routing: { prefixDefaultLocale: false },
    /**
     * `fallback` намеренно НЕ настроен.
     *
     * При полном паритете локалей он не нужен, а его включение заставляет
     * Astro генерировать redirect-заглушку для каждой комбинации
     * «локаль × маршрут», которой нет. Поскольку слаги переведены
     * (/cene | /en/prices | /ru/ceny), таких комбинаций оказалось 78 из 117
     * страниц. Без fallback сборка содержит ровно нужные адреса.
     *
     * Если появится язык с неполным переводом, fallback включается одной
     * строкой — но тогда стоит взвесить и объём лишних заглушек.
     */
  },

  /**
   * Шрифты подключены вручную (src/styles/fonts.css), а не через Fonts API.
   *
   * Причина: Fonts API тянет файлы с fonts.googleapis.com прямо во время
   * сборки. В части CI и закрытых сетей этот запрос отваливается, и сборка
   * падает с CannotFetchFontFile — что мы и воспроизвели в этом окружении.
   * Свои @font-face + файлы в src/assets дают воспроизводимую сборку
   * без сетевых зависимостей и точный контроль над субсетами.
   * Обновление шрифтов: node scripts/sync-fonts.mjs
   */

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'sr',
        locales: { sr: 'sr-Latn-RS', en: 'en', ru: 'ru' },
      },
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],

    devToolbar: { enabled: false },

  /**
   * Алиасы выбора темы (см. комментарий выше): @skin — CSS темы,
   * @theme — её шрифты для предзагрузки. Оба подменяются на сборке,
   * поэтому в прод-артефакт попадает ровно одна тема.
   */
  vite: {
    resolve: { alias: themeAlias },
  },
});
