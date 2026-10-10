import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

/**
 * StasyClean — статический сайт клининговой компании (Белград).
 *
 * Одна цель сборки — прод для nginx:
 *   npm run build  →  site=https://stasyclean.com, base=/, dist/
 *
 * Площадка задаётся переменными окружения (нужно предпросмотру на
 * GitHub Pages, где проектный сайт живёт в подпапке):
 *   SITE_URL  — origin сайта; по умолчанию https://stasyclean.com
 *   BASE_PATH — базовый путь;  по умолчанию /
 * Пример сборки для Pages:
 *   SITE_URL=https://pglyan.github.io BASE_PATH=/stasyclean/ npm run build
 *
 * Прод-сборка — обычный набор index.html + хешированные assets,
 * отдаётся nginx из корня домена и не требует Node на сервере.
 */

/**
 * Алиас входа темы: в сборку попадает CSS ровно одной темы —
 * src/themes/nordic/theme.css.
 */
const themeEntry = (path) => fileURLToPath(new URL(path, import.meta.url));

const themeAlias = {
  '@skin': themeEntry('./src/themes/nordic/theme.css'),
};

const PROD_ORIGIN = 'https://stasyclean.com';

/** Origin площадки: прод по умолчанию, можно переопределить для предпросмотра. */
const siteUrl = process.env.SITE_URL || PROD_ORIGIN;
/**
 * Базовый путь: '/' у прода; GitHub Pages отдаёт проектный сайт
 * из подпапки (/stasyclean/), поэтому предпросмотр собирается с ним.
 * Astro нормализует значение сам (без завершающего слэша не останется).
 */
const basePath = process.env.BASE_PATH || '/';

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
  site: siteUrl,
  base: basePath,
  output: 'static',
  outDir: './dist',
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
    // Порядок важности локалей: sr, ru, en.
    locales: ['sr', 'ru', 'en'],
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
        locales: { sr: 'sr-Latn-RS', ru: 'ru', en: 'en' },
      },
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],

  devToolbar: { enabled: false },

  /**
   * Алиас входа темы (см. комментарий выше): @skin — CSS темы.
   */
  vite: {
    resolve: { alias: themeAlias },
  },
});
