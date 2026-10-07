/**
 * Реестр маршрутов — единственный источник правды для URL сайта.
 *
 * Слаги английские на всех локалях: локаль живёт только в префиксе
 * (/prices | /ru/prices | /en/prices), поэтому «машинерии переведённых
 * путей» нет — одна колонка на все языки.
 *
 * Как добавлять страницы и локали — docs/i18n.md.
 */

import { DEFAULT_LOCALE, LOCALES, type Locale } from './config';

export const ROUTES = {
  home: '',
  prices: 'prices',
  services: 'services',
  general: 'services/general-cleaning',
  regular: 'services/regular-cleaning',
  smart: 'services/smart-cleaning',
  reno: 'services/post-renovation-cleaning',
  about: 'about',
  reviews: 'reviews',
  faq: 'faq',
  contact: 'contact',
  privacy: 'privacy-policy',
  terms: 'terms-of-service',
} as const satisfies Record<string, string>;

export type PageKey = keyof typeof ROUTES;

/** Ключи страниц услуг — используются в навигации, футере и JSON-LD. */
export const SERVICE_KEYS = ['general', 'regular', 'smart', 'reno'] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

/** Type guard: страница услуги. */
export function isServiceKey(key: PageKey): key is ServiceKey {
  return (SERVICE_KEYS as readonly string[]).includes(key);
}

/** Пункты навигации (шапка и подвал) — один список для всех локалей. */
export const NAV_KEYS = ['prices', 'about', 'reviews', 'faq', 'contact'] as const;
export type NavKey = (typeof NAV_KEYS)[number];

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

/** Относительный путь внутри сайта, без ведущего слэша: 'ru/prices'. */
export function routePath(locale: Locale, key: PageKey): string {
  const slug = ROUTES[key];
  if (locale === DEFAULT_LOCALE) return slug;
  return slug ? `${locale}/${slug}` : locale;
}

/**
 * Готовый href с учётом base и завершающего слэша.
 * href('ru', 'prices') → '/ru/prices/'
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
