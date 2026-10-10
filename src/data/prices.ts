import type { Localized } from './types';
import type { ServiceKey } from '../i18n/routes';

/**
 * Прайс по площади.
 *
 * Источник — публичная страница /цены текущего stasyclean.com.
 * Цены сохранены как есть: клиент может их изменить перед запуском.
 */

/** Границы диапазонов площади, м². Каждый тариф обязан дать ровно 6 цен. */
export const AREA_TIERS = [40, 60, 80, 100, 120, 150] as const;

/** Площадь, сверх которой цену считаем индивидуально. */
export const AREA_MAX = AREA_TIERS[AREA_TIERS.length - 1];

export const areaUnit: Localized = { sr: 'm²', en: 'm²', ru: 'м²' };
export const areaUpTo: Localized = { sr: 'do', en: 'up to', ru: 'до' };
export const areaOver: Localized = { sr: 'preko', en: 'over', ru: 'более' };

export interface PricePlan {
  id: string;
  serviceKey: ServiceKey;
  /** Название варианта внутри услуги: «Стандарт», «Премиум». */
  name: Localized;
  /** Цены по AREA_TIERS в том же порядке. */
  tiers: readonly [number, number, number, number, number, number];
  /** Отметка «чаще всего выбирают». */
  popular?: boolean;
  /**
   * Цена не подтверждена клиентом (нет в брифе). Такой тариф не попадает
   * в калькулятор: там он показывается как «цена по запросу».
   */
  pending?: boolean;
}

export const plans: PricePlan[] = [
  {
    id: 'regular-standard',
    serviceKey: 'regular',
    name: { sr: 'Standard', en: 'Standard', ru: 'Стандарт' },
    tiers: [4000, 4500, 5500, 7000, 9000, 11000],
    popular: true,
  },
  {
    id: 'regular-premium',
    serviceKey: 'regular',
    name: { sr: 'Premium', en: 'Premium', ru: 'Премиум' },
    // Цена не подтверждена клиентом (в брифе есть только Standard).
    tiers: [5500, 6500, 8500, 10500, 12500, 16000],
    pending: true,
  },
  {
    id: 'general-standard',
    serviceKey: 'general',
    name: { sr: 'Standard', en: 'Standard', ru: 'Стандарт' },
    tiers: [10000, 12500, 15000, 17500, 20000, 25000],
  },
  {
    id: 'general-premium',
    serviceKey: 'general',
    name: {
      sr: 'Premium. Sve uključeno',
      en: 'Premium. All inclusive',
      ru: 'Премиум. Всё включено',
    },
    tiers: [20000, 25000, 30000, 35000, 44000, 48000],
  },
  {
    id: 'reno-standard',
    serviceKey: 'reno',
    name: { sr: 'Posle renoviranja', en: 'Post-renovation', ru: 'После ремонта' },
    tiers: [20000, 25000, 32000, 38000, 45000, 55000],
  },
];

/** Почасовая ставка Smart čišćenja, RSD/час. */
export const hourlyRate = {
  serviceKey: 'smart' as ServiceKey,
  price: 2000,
  minimumHours: 3,
};

/** Минимальный заказ, RSD — часы × ставка. Единая константа для подписей «Минимальный заказ». */
export const MIN_ORDER = hourlyRate.price * hourlyRate.minimumHours;

export function plansForService(key: ServiceKey) {
  return plans.filter((plan) => plan.serviceKey === key);
}

/** Минимальная цена тарифа — используется в карточках «от N RSD». */
export function planPriceFrom(plan: PricePlan): number {
  return Math.min(...plan.tiers);
}
