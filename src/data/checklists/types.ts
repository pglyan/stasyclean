import type { Localized } from '../types';

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
  serviceKey: string;
  lead?: Localized;
  groups: ChecklistGroup[];
  note?: Localized;
}
