import type { Localized } from '../types';
import type { ServiceKey } from '../../i18n/routes';

/** Группа пунктов чек-листа — зона квартиры. */
export interface ChecklistGroup {
  id: string;
  title: Localized;
  /** Пункты, одинаковые для всех тарифов услуги. */
  items?: Localized<string[]>;
  /**
   * Пункты в разбивке по тарифам. Обе колонки обязаны иметь одинаковое
   * число пунктов (в одной локали и во всех локалях разом) — это проверяет
   * сборка, чтобы строки сравнения не разъехались.
   */
  itemsByPlan?: Localized<{ standard: string[]; premium: string[] }>;
  /** Оговорка к группе: что входит не полностью или считается отдельно. */
  note?: Localized;
  /** true → данные не подтверждены клиентом и помечаются как предварительные. */
  provisional?: boolean;
}

export interface Checklist {
  /** Услуга, к которой относится чек-лист. */
  serviceKey: ServiceKey;
  lead?: Localized;
  groups: ChecklistGroup[];
  note?: Localized;
}
