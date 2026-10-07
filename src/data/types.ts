import type { Locale } from '../i18n/config';
import type { ServiceKey } from '../i18n/routes';
import type { IconName } from '../components/ui/icons';

/**
 * Поле, которого ещё нет: значение придёт от клиента до запуска.
 * null — честный маркер «требуется», а не пустая строка-заглушка.
 */
export type Pending<T> = T | null;

/**
 * Обязательный набор значений для ВСЕХ локалей.
 *
 * Это главный механизм защиты от рассинхрона контента при ×3 переводах:
 * если у сущности не заполнена хотя бы одна локаль, TypeScript не даст
 * собрать проект. Внимание: тип ловит пропущенную локаль, но НЕ ловит
 * пустую строку — её отдельно проверяют ревью (в репозитории есть
 * намеренные пустые значения, например unitLabels.flat).
 */
export type Localized<T = string> = Record<Locale, T>;

/** Единица расчёта цены — от неё зависит формулировка в карточке тарифа. */
export type PriceUnit = 'area' | 'hour';

export interface Service {
  key: ServiceKey;
  /** Иконка карточки — имя из таблицы иконок. */
  icon: IconName;
  name: Localized;
  /** Короткий лид для карточки тарифа и навигации. */
  lead: Localized;
  /** Абзацы для страницы услуги. */
  description: Localized<string[]>;
  duration: Localized;
  priceUnit: PriceUnit;
  /** Минимальный заказ, RSD. null — не установлен. */
  minOrder: Pending<number>;
  /** Отличительные свойства — в карточку тарифа и на страницу услуги. */
  highlights: Localized<string[]>;
  /** Условия и ограничения — публичные формулировки с текущего сайта клиента. */
  notes: Localized<string[]>;
}
