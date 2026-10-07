import type { Localized } from '../types';
import type { ServiceKey } from '../../i18n/routes';

/** Группа пунктов чек-листа — зона квартиры. */
export interface ChecklistGroup {
  id: string;
  title: Localized;
  items: Localized<string[]>;
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
