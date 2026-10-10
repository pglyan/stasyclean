import type { Localized } from './types';
import { extraServices, vacuumDelivery, windowServices, type PriceLine, type Zone } from './extras';
import type { ServiceKey } from '../i18n/routes';

/**
 * Реестр калькулятора: зоны, их порядок и объединённый список позиций.
 *
 * Позиции берутся из extras.ts — единый источник цен для прайс-страниц
 * и калькулятора. Здесь только то, что специфично калькулятору:
 * группировка по зонам и фильтрация по услуге.
 */

/** Порядок зон в калькуляторе. */
export const ZONE_ORDER: Zone[] = ['kitchen', 'bathroom', 'rooms', 'windows', 'other'];

export const zoneLabels: Record<Zone, Localized> = {
  kitchen: { sr: 'Kuhinja', en: 'Kitchen', ru: 'Кухня' },
  bathroom: { sr: 'Kupatilo', en: 'Bathroom', ru: 'Ванная' },
  rooms: { sr: 'Sobe', en: 'Rooms', ru: 'Комнаты' },
  windows: { sr: 'Prozori', en: 'Windows', ru: 'Окна' },
  other: { sr: 'Ostalo', en: 'Other', ru: 'Прочее' },
};

/**
 * Все позиции, доступные калькулятору: доп. услуги, доставка пылесоса и
 * мойка окон. В разметку попадают все сразу, а применимость к выбранной
 * услуге решает клиентский скрипт по data-services.
 */
export const calculatorAddOns: PriceLine[] = [...extraServices, vacuumDelivery, ...windowServices];

/** Позиции, сгруппированные по зонам (пустые зоны отбрасываются). */
export const zoneGroups: { zone: Zone; lines: PriceLine[] }[] = ZONE_ORDER.map((zone) => ({
  zone,
  lines: calculatorAddOns.filter((line) => line.zone === zone),
})).filter((group) => group.lines.length > 0);

/** Применима ли позиция к услуге. */
export function appliesToService(line: PriceLine, serviceKey: ServiceKey): boolean {
  return !line.services || line.services.includes(serviceKey);
}
