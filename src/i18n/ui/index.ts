import type { Locale } from '../config';
import { formatPrice } from '../config';
import { sr } from './sr';
import { en } from './en';
import { ru } from './ru';

export type { UIStrings } from './ru';

const dictionaries = { sr, en, ru } as const;

/**
 * Строки интерфейса для локали.
 * Вызов на этапе сборки — в клиентский JS словари не попадают вообще,
 * поэтому три языка не стоят странице ни одного килобайта в рантайме.
 */
export function useUI(locale: Locale) {
  return dictionaries[locale];
}

/** «od 4.000 RSD» / «from 4,000 RSD» / «от 4 000 RSD» — префикс из словаря. */
export function formatPriceFrom(value: number, locale: Locale): string {
  return `${useUI(locale).price.from} ${formatPrice(value, locale)}`;
}

export { sr, en, ru };
