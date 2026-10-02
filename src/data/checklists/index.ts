import type { ServiceKey } from '../../i18n/routes';
import type { Checklist } from './types';

import { generalChecklist } from './general';
import { regularChecklist } from './regular';
import { renoChecklist } from './reno';

/**
 * Чек-листы по услугам.
 *
 * У Smart čišćenja чек-листа нет по определению услуги: клиент сам ставит
 * задачи, поэтому в интерфейсе вместо списка показывается блок с примерами
 * задач и объяснением принципа «одна цена за час».
 */
export const checklists: Partial<Record<ServiceKey, Checklist>> = {
  general: generalChecklist,
  regular: regularChecklist,
  reno: renoChecklist,
};

export function getChecklist(key: ServiceKey): Checklist | undefined {
  return checklists[key];
}

export type { Checklist, ChecklistGroup } from './types';
