import type { Localized } from './types';
import type { ServiceKey } from '../i18n/routes';

/**
 * Дополнительные услуги, опции и мойка окон.
 *
 * Источник — бриф клиента (docs/client-brief.md). Модель расширена под
 * калькулятор: у каждой позиции есть зона (для группировки), единица
 * расчёта и список тарифов, в которые она уже входит (чтобы Премиум
 * не тарифицировался дважды).
 */

export type Unit = 'item' | 'room' | 'm2' | '30min' | 'sash' | 'flat';

/** Зона квартиры — по ней позиции группируются в калькуляторе. */
export type Zone = 'kitchen' | 'bathroom' | 'rooms' | 'windows' | 'other';

export const unitLabels: Record<Unit, Localized> = {
  item: { sr: 'za 1 kom.', en: 'per item', ru: 'за 1 ед.' },
  room: { sr: 'za prostoriju', en: 'per room', ru: 'за комнату' },
  m2: { sr: 'za 1 m²', en: 'per m²', ru: 'за 1 м²' },
  '30min': { sr: 'za 30 min', en: 'per 30 min', ru: 'за 30 мин' },
  sash: { sr: 'za krilo', en: 'per sash', ru: 'за створку' },
  /** У фиксированной цены нет «за единицу» — подписи намеренно пустые. */
  flat: { sr: '', en: '', ru: '' },
};

export interface PriceLine {
  id: string;
  name: Localized;
  /** Точная цена, RSD. */
  price?: number;
  /** Нижняя граница, если цена договорная или зависит от загрязнения. */
  priceFrom?: number;
  /** Верхняя граница диапазона. */
  priceTo?: number;
  unit: Unit;
  /** Зона для группировки в калькуляторе. */
  zone: Zone;
  /**
   * Тарифы (planId), в которые позиция уже входит в цену. В калькуляторе
   * такая позиция помечается «включено» и не тарифицируется.
   */
  includedIn?: string[];
  /**
   * Услуги, к которым позиция применима. Не задано — применима ко всем
   * (включая Смарт, где она превращается в задачу без доплаты).
   */
  services?: ServiceKey[];
  /** Диапазон количества для счётчика (позиции с поштучным расчётом). */
  min?: number;
  max?: number;
  step?: number;
  /** Предзаполнить количество из выбранной площади квартиры. */
  prefill?: 'area';
}

/** Дополнительные услуги — доступны к любой уборке, обсуждаются отдельно. */
export const extraServices: PriceLine[] = [
  {
    id: 'fridge',
    name: {
      sr: 'Pranje frižidera iznutra, bez zamrzivača',
      en: 'Fridge cleaned inside, without the freezer',
      ru: 'Мойка холодильника внутри, без морозильной камеры',
    },
    price: 1500,
    unit: 'flat',
    zone: 'kitchen',
    includedIn: ['general-premium'],
  },
  {
    id: 'fridge-freezer',
    name: {
      sr: 'Pranje frižidera iznutra, sa zamrzivačem',
      en: 'Fridge cleaned inside, including the freezer',
      ru: 'Мойка холодильника внутри, с морозильной камерой',
    },
    price: 2500,
    unit: 'flat',
    zone: 'kitchen',
    includedIn: ['general-premium'],
  },
  {
    id: 'microwave',
    name: {
      sr: 'Pranje mikrotalasne peći iznutra',
      en: 'Microwave cleaned inside',
      ru: 'Мойка микроволновки внутри',
    },
    price: 500,
    unit: 'flat',
    zone: 'kitchen',
    includedIn: ['general-premium'],
  },
  {
    id: 'oven',
    name: {
      sr: 'Pranje rerne iznutra',
      en: 'Oven cleaned inside',
      ru: 'Мойка духовки внутри',
    },
    priceFrom: 1500,
    priceTo: 3000,
    unit: 'flat',
    zone: 'kitchen',
    includedIn: ['general-premium'],
  },
  {
    id: 'hood',
    name: {
      sr: 'Čišćenje masnih filtera aspiratora',
      en: 'Grease filters of the extractor hood',
      ru: 'Очистка жироулавливающих фильтров вытяжки',
    },
    priceFrom: 500,
    priceTo: 1000,
    unit: 'flat',
    zone: 'kitchen',
  },
  {
    id: 'dishwasher',
    name: {
      sr: 'Unutrašnje čišćenje mašine za sudove',
      en: 'Dishwasher cleaned inside',
      ru: 'Внутренняя чистка посудомоечной машины',
    },
    price: 1000,
    unit: 'flat',
    zone: 'kitchen',
    includedIn: ['general-premium'],
  },
  {
    id: 'washing-machine',
    name: {
      sr: 'Čišćenje veš mašine (fioka i ciklus sa tabletom)',
      en: 'Washing machine cleaned (drawer and tablet cycle)',
      ru: 'Очистка стиральной машины (лоток и цикл со спец. таблеткой)',
    },
    price: 1000,
    unit: 'flat',
    zone: 'kitchen',
    includedIn: ['general-premium'],
  },
  {
    id: 'balcony',
    name: {
      sr: 'Čišćenje lođe, balkona i terase',
      en: 'Loggia, balcony and terrace cleaning',
      ru: 'Уборка лоджий, балконов и террас',
    },
    priceFrom: 1200,
    unit: 'flat',
    zone: 'other',
  },
  {
    id: 'walls',
    name: {
      sr: 'Uklanjanje prašine sa zidova i plafona',
      en: 'Dust removal from walls and ceilings',
      ru: 'Обеспыливание стен и потолков',
    },
    price: 20,
    unit: 'm2',
    zone: 'rooms',
    min: 1,
    max: 500,
    step: 1,
    prefill: 'area',
    // В генеральной Премиум обеспыливание заявлено «да» — см. docs/client-brief.md.
    includedIn: ['general-premium'],
  },
  {
    id: 'cabinets-empty',
    name: {
      sr: 'Čišćenje unutrašnjosti ormara i fioka (prazni)',
      en: 'Inside of wardrobes and drawers cleaned (empty)',
      ru: 'Уборка внутри шкафов, комодов и ящиков (пустых)',
    },
    price: 200,
    unit: 'item',
    zone: 'rooms',
    min: 1,
    max: 30,
    step: 1,
    includedIn: ['general-premium'],
  },
  {
    id: 'cabinets-filled',
    name: {
      sr: 'Čišćenje unutrašnjosti ormara i fioka (puni)',
      en: 'Inside of wardrobes and drawers cleaned (full)',
      ru: 'Уборка внутри шкафов, комодов и ящиков (заполненных)',
    },
    price: 400,
    unit: 'item',
    zone: 'rooms',
    min: 1,
    max: 30,
    step: 1,
  },
  {
    id: 'chandelier',
    name: {
      sr: 'Pranje lustera',
      en: 'Chandelier washing',
      ru: 'Мойка люстр',
    },
    priceFrom: 1000,
    unit: 'item',
    zone: 'rooms',
    min: 1,
    max: 10,
    step: 1,
  },
  {
    id: 'bathroom-tiles',
    name: {
      sr: 'Pranje zidnih pločica u kupatilu',
      en: 'Bathroom wall tiles washing',
      ru: 'Мойка настенной плитки в ванной комнате',
    },
    price: 1500,
    unit: 'room',
    zone: 'bathroom',
    min: 1,
    max: 5,
    step: 1,
    includedIn: ['general-premium'],
  },
  {
    id: 'ironing',
    name: {
      sr: 'Peglanje veša',
      en: 'Ironing',
      ru: 'Глажка белья',
    },
    price: 800,
    unit: '30min',
    zone: 'other',
    min: 1,
    max: 20,
    step: 1,
  },
];

/**
 * Доставка пылесоса и инвентаря. По брифу — только для поддерживающей
 * уборки: там оборудование предоставляет клиент.
 */
export const vacuumDelivery: PriceLine = {
  id: 'vacuum-delivery',
  name: {
    sr: 'Dostava usisivača i inventara',
    en: 'Delivery of the vacuum cleaner and supplies',
    ru: 'Доставка пылесоса и инвентаря',
  },
  price: 1000,
  unit: 'flat',
  zone: 'other',
  services: ['regular'],
};

/** Мойка окон — считается по окнам и створкам, обсуждается отдельно. */
export const windowServices: PriceLine[] = [
  {
    id: 'window-one',
    name: { sr: 'Jednokrilni prozor', en: 'Single-sash window', ru: 'Одностворчатое окно' },
    price: 500,
    unit: 'sash',
    zone: 'windows',
    min: 1,
    max: 20,
    step: 1,
    includedIn: ['general-premium'],
  },
  {
    id: 'window-two',
    name: { sr: 'Dvokrilni prozor', en: 'Two-sash window', ru: 'Двухстворчатое окно' },
    price: 1000,
    unit: 'flat',
    zone: 'windows',
    min: 1,
    max: 20,
    step: 1,
    includedIn: ['general-premium'],
  },
  {
    id: 'window-three',
    name: { sr: 'Trokrilni prozor', en: 'Three-sash window', ru: 'Трёхстворчатое окно' },
    price: 1500,
    unit: 'flat',
    zone: 'windows',
    min: 1,
    max: 20,
    step: 1,
    includedIn: ['general-premium'],
  },
  {
    id: 'window-door',
    name: { sr: 'Balkonska vrata', en: 'Balcony door', ru: 'Балконная дверь' },
    price: 800,
    unit: 'flat',
    zone: 'windows',
    includedIn: ['general-premium'],
  },
  {
    id: 'window-block',
    name: { sr: 'Balkonski blok', en: 'Balcony window block', ru: 'Балконный блок' },
    price: 1500,
    unit: 'flat',
    zone: 'windows',
    includedIn: ['general-premium'],
  },
];
