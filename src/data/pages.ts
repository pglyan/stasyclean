import type { PageKey } from '../i18n/routes';

/**
 * Состав страниц.
 *
 * Каждая страница — это упорядоченный список блоков. Такой реестр даёт
 * две вещи:
 *   1) блоки переиспользуются, а не копируются между страницами;
 *   2) порядок блоков меняется одной строкой, без правки разметки.
 *
 * Главная намеренно собирает ВСЕ блоки — это витрина стенда, по которой
 * заказчик оценивает стиль. Внутренние страницы повторяют только то,
 * что нужно для их задачи.
 */

export type BlockId =
  | 'hero'
  | 'pageHero'
  | 'usp'
  | 'services'
  | 'priceTable'
  | 'calculator'
  | 'checklist'
  | 'extras'
  | 'windows'
  | 'steps'
  | 'beforeAfter'
  | 'reviews'
  | 'areas'
  | 'faq'
  | 'bookingForm'
  | 'ctaBand'
  | 'serviceDetail'
  | 'legal';

export const pageBlocks: Record<PageKey, BlockId[]> = {
  home: [
    'hero',
    'usp',
    'services',
    'priceTable',
    'calculator',
    'checklist',
    'extras',
    'windows',
    'steps',
    'beforeAfter',
    'reviews',
    'areas',
    'faq',
    'bookingForm',
    'ctaBand',
  ],
  prices: ['pageHero', 'priceTable', 'calculator', 'extras', 'windows', 'faq', 'ctaBand'],
  services: ['pageHero', 'services', 'usp', 'steps', 'calculator', 'ctaBand'],
  general: ['pageHero', 'serviceDetail', 'extras', 'faq', 'ctaBand'],
  regular: ['pageHero', 'serviceDetail', 'extras', 'faq', 'ctaBand'],
  smart: ['pageHero', 'serviceDetail', 'extras', 'faq', 'ctaBand'],
  reno: ['pageHero', 'serviceDetail', 'extras', 'faq', 'ctaBand'],
  about: ['pageHero', 'usp', 'beforeAfter', 'steps', 'areas', 'ctaBand'],
  reviews: ['pageHero', 'reviews', 'beforeAfter', 'usp', 'ctaBand'],
  faq: ['pageHero', 'faq', 'ctaBand'],
  contact: ['pageHero', 'bookingForm', 'areas', 'faq'],
  privacy: ['pageHero', 'legal'],
  terms: ['pageHero', 'legal'],
};
