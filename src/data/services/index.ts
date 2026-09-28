import type { Service } from '../types';
import type { ServiceKey } from '../../i18n/routes';

import { general } from './general';
import { regular } from './regular';
import { smart } from './smart';
import { reno } from './reno';

/** Порядок задаёт последовательность карточек и страниц услуг. */
export const services: Service[] = [regular, general, smart, reno];

export function getService(key: ServiceKey): Service {
  const found = services.find((service) => service.key === key);
  if (!found) throw new Error(`Unknown service key: ${key}`);
  return found;
}

export { general, regular, smart, reno };
