/**
 * Реестр маршрутов — единственный источник правды для URL сайта.
 *
 * Зачем: Astro умеет локализовать только *префикс* локали (i18n.locales[].path),
 * но не переводить слаги отдельных страниц. Поэтому переведённые слаги
 * (/cene | /en/prices | /ru/ceny) живут здесь, а страницы генерируются
 * динамическими маршрутами из этого реестра.
 *
 * Добавление локали = добавить колонку в ROUTES + запись в LOCALE_META.
 * Пропустить перевод слага физически невозможно: объект типизирован
 * как Record<Locale, string>, TypeScript не соберётся без всех трёх.
 */

import { DEFAULT_LOCALE, LOCALES, type Locale } from './config';

export const ROUTES = {
  home: { sr: '', en: '', ru: '' },
  prices: { sr: 'cene', en: 'prices', ru: 'ceny' },
  services: { sr: 'usluge', en: 'services', ru: 'uslugi' },
  general: {
    sr: 'usluge/generalno-ciscenje',
    en: 'services/general-cleaning',
    ru: 'uslugi/generalnaya-uborka',
  },
  regular: {
    sr: 'usluge/redovno-odrzavanje',
    en: 'services/regular-cleaning',
    ru: 'uslugi/podderzhivayushchaya-uborka',
  },
  smart: {
    sr: 'usluge/smart-ciscenje',
    en: 'services/smart-cleaning',
    ru: 'uslugi/smart-clining',
  },
  reno: {
    sr: 'usluge/ciscenje-posle-renoviranja',
    en: 'services/post-renovation-cleaning',
    ru: 'uslugi/posle-remonta',
  },
  about: { sr: 'o-nama', en: 'about', ru: 'o-nas' },
  reviews: { sr: 'utisci', en: 'reviews', ru: 'otzyvy' },
  faq: { sr: 'cesta-pitanja', en: 'faq', ru: 'faq' },
  contact: { sr: 'kontakt', en: 'contact', ru: 'kontakty' },
  privacy: {
    sr: 'politika-privatnosti',
    en: 'privacy-policy',
    ru: 'politika-konfidencialnosti',
  },
  terms: {
    sr: 'uslovi-koriscenja',
    en: 'terms-of-service',
    ru: 'usloviya-okazaniya-uslug',
  },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof ROUTES;

/** Ключи страниц услуг — используются в навигации, футере и JSON-LD. */
export const SERVICE_KEYS = ['general', 'regular', 'smart', 'reno'] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

/** Все ключи страниц в порядке следования — используется sitemap и проверками. */
export const PAGE_KEYS = Object.keys(ROUTES) as PageKey[];

/** Локали, живущие в подпапке (всё, кроме defaultLocale). */
export const NON_DEFAULT_LOCALES = LOCALES.filter(
  (locale) => locale !== DEFAULT_LOCALE,
) as Locale[];

/**
 * BASE_URL от Vite: '/' для сборки из корня домена.
 *
 * ВАЖНО: Astro нормализует base через prependForwardSlash(removeTrailingForwardSlash())
 * (core/config/schemas/relative.js), поэтому import.meta.env.BASE_URL
 * может прийти БЕЗ завершающего слэша. Склейка `${BASE}${path}`
 * дала бы '...ru/' вместо '.../ru/', то есть все внутренние
 * ссылки, canonical, hreflang и JSON-LD вели в никуда.
 * Нормализуем один раз здесь: это единственная точка, где base попадает в адреса.
 */
export const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/**
 * Путь к файлу из public/ с учётом base.
 * asset('favicon.svg') → '/favicon.svg'
 */
export function asset(path: string): string {
  return `${BASE}${path.replace(/^\//, '')}`;
}

/** Относительный путь внутри сайта, без ведущего слэша: 'ru/ceny'. */
export function routePath(locale: Locale, key: PageKey): string {
  const slug = ROUTES[key][locale];
  if (locale === DEFAULT_LOCALE) return slug;
  return slug ? `${locale}/${slug}` : locale;
}

/**
 * Готовый href с учётом base и завершающего слэша.
 * href('ru', 'prices') → '/ru/ceny/'
 */
export function href(locale: Locale, key: PageKey): string {
  const path = routePath(locale, key);
  return path ? `${BASE}${path}/` : BASE;
}

export interface LocaleSwitchLink {
  locale: Locale;
  href: string;
  isCurrent: boolean;
}

/**
 * Ссылки переключателя языка на ТУ ЖЕ страницу, а не на главную —
 * классическая ошибка в мультиязычных сайтах.
 */
export function localeSwitchLinks(current: Locale, key: PageKey): LocaleSwitchLink[] {
  return LOCALES.map((locale) => ({
    locale,
    href: href(locale, key),
    isCurrent: locale === current,
  }));
}

export interface GeneratedRoute {
  locale: Locale;
  key: PageKey;
  /** Значение для getStaticPaths: [] для главной, ['cene'], ['ru','ceny'] */
  segments: string[];
}

/** Полный список URL сайта — для генерации страниц и проверок целостности. */
export function generatedRoutes(locales: readonly Locale[]): GeneratedRoute[] {
  const routes: GeneratedRoute[] = [];
  for (const locale of locales) {
    for (const key of PAGE_KEYS) {
      routes.push({
        locale,
        key,
        segments: routePath(locale, key).split('/').filter(Boolean),
      });
    }
  }
  return routes;
}
