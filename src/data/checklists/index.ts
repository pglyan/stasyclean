import type { ServiceKey } from '../../i18n/routes';
import { LOCALE_META, type Locale } from '../../i18n/config';
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

/**
 * Длины локализованных массивов должны совпадать во всех локалях:
 * иначе в одном переводе пунктов больше, чем в другом, и списки
 * рассинхронятся молча — тип Record<Locale, T[]> такой разницы не ловит.
 */
for (const [key, checklist] of Object.entries(checklists)) {
  for (const group of checklist.groups) {
    const counts = (Object.keys(LOCALE_META) as Locale[]).map(
      (locale) => group.items[locale].length,
    );
    if (new Set(counts).size > 1) {
      throw new Error(
        `Чек-лист «${key}», группа «${group.id}»: разное число пунктов в локалях (${counts.join('/')}).`,
      );
    }
  }
}

export function getChecklist(key: ServiceKey): Checklist | undefined {
  return checklists[key];
}

export type { Checklist, ChecklistGroup } from './types';
