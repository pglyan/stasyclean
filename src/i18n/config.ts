/**
 * Конфигурация локалей StasyClean.
 *
 * Порядок важен только для дефолтов; `sr` — язык по умолчанию и живёт в корне
 * домена (лучший локальный SEO-сигнал для Google.rs, так же сделано у всех
 * основных конкурентов: uborka.rs, cleanhouse.rs, shinecleaning.rs).
 */

export const LOCALES = ['sr', 'en', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'sr';

export interface LocaleMeta {
  /** Код локали для Astro i18n */
  code: Locale;
  /** Название языка на самом языке (для переключателя и a11y) */
  label: string;
  /** Короткая метка для компактного переключателя */
  short: string;
  /** Значение атрибута <html lang> */
  htmlLang: string;
  /** Значение og:locale */
  ogLocale: string;
  /** Локаль для Intl.NumberFormat / Intl.DateTimeFormat */
  intl: string;
  /** Префикс «от» для цен «от 5 500 RSD» */
  fromPrefix: string;
  /** Название валюты для вывода цены */
  currencyLabel: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  sr: {
    code: 'sr',
    label: 'Srpski',
    short: 'SR',
    htmlLang: 'sr-Latn-RS',
    ogLocale: 'sr_RS',
    intl: 'sr-Latn-RS',
    fromPrefix: 'od',
    currencyLabel: 'RSD',
  },
  en: {
    code: 'en',
    label: 'English',
    short: 'EN',
    htmlLang: 'en',
    ogLocale: 'en_US',
    intl: 'en-GB',
    fromPrefix: 'from',
    currencyLabel: 'RSD',
  },
  ru: {
    code: 'ru',
    label: 'Русский',
    short: 'RU',
    htmlLang: 'ru',
    ogLocale: 'ru_RU',
    intl: 'ru-RU',
    fromPrefix: 'от',
    currencyLabel: 'RSD',
  },
};

/**
 * Форматирует число по правилам локали.
 * sr → 4.000   |   ru → 4 000   |   en → 4,000
 *
 * Считается на этапе сборки в Node (полный ICU), поэтому в браузер
 * не уходит ни одного байта JS ради форматирования.
 */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_META[locale].intl, {
    maximumFractionDigits: 0,
  }).format(value);
}

/** «4.000 RSD» / «4 000 RSD» / «4,000 RSD» */
export function formatPrice(value: number, locale: Locale): string {
  const { currencyLabel } = LOCALE_META[locale];
  return `${formatNumber(value, locale)} ${currencyLabel}`;
}

/** «od 4.000 RSD» / «from 4,000 RSD» / «от 4 000 RSD» */
export function formatPriceFrom(value: number, locale: Locale): string {
  return `${LOCALE_META[locale].fromPrefix} ${formatPrice(value, locale)}`;
}

/** Диапазон цен «1.500 – 3.000 RSD» */
export function formatPriceRange(min: number, max: number, locale: Locale): string {
  const { currencyLabel } = LOCALE_META[locale];
  return `${formatNumber(min, locale)} – ${formatNumber(max, locale)} ${currencyLabel}`;
}

/** Дата в формате локали — для «обновлено 27.09.2026» */
export function formatDate(date: Date | string, locale: Locale): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(value);
}
