import type { Locale } from '../i18n/config';
import type { ServiceKey } from '../i18n/routes';

/**
 * Обязательный набор значений для ВСЕХ локалей.
 *
 * Это главный механизм защиты от рассинхрона контента при ×3 переводах:
 * если у сущности не заполнена хотя бы одна локаль, TypeScript не даст
 * собрать проект. Пустую строку ловит TypeScript (Localized требует все три языка).
 */
export type Localized<T = string> = Record<Locale, T>;

/** Единица расчёта цены — от неё зависит формулировка в карточке тарифа. */
export type PriceUnit = 'area' | 'hour';

export interface Service {
  key: ServiceKey;
  /** Идентификатор иконки в спрайте — см. src/components/ui/Icon.astro */
  icon: string;
  name: Localized;
  /** Короткий лид для карточки тарифа и навигации. */
  lead: Localized;
  /** Абзацы для страницы услуги. */
  description: Localized<string[]>;
  duration: Localized;
  priceUnit: PriceUnit;
  /** Минимальный заказ, RSD. null — не установлен. */
  minOrder: number | null;
  /** Отличительные свойства — в карточку тарифа и на страницу услуги. */
  highlights: Localized<string[]>;
  /** Условия и ограничения — публичные формулировки с текущего сайта клиента. */
  notes: Localized<string[]>;
}

