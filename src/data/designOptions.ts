/**
 * Список вариантов для демонстрационной панели.
 *
 * Подписи локализованы: стенд смотрит сербский заказчик, поэтому «0 — строгие
 * углы» на русском был бы такой же ошибкой, как непереведённый текст на сайте.
 * Форма записи та же, что у контента: `Localized`, и TypeScript не даст
 * забыть ни один язык.
 *
 * Здесь только данные: как вариант применяется, знает src/styles/params.css,
 * а как показывается — src/components/demo/*.
 */

import type { Localized } from './types';
import type {
  ButtonKind,
  CardKind,
  ContainerKind,
  DensityKind,
  FontKind,
  HeroKind,
} from '../themes/types';

export interface PanelOption<T> {
  value: T;
  label: Localized;
  /** Тон (H) для цветового кружка рядом с подписью. */
  hue?: number;
}

/** Акцент: меняем тон (H), насыщенность и светлоту держит тема. */
export const accentOptions: PanelOption<number>[] = [
  { value: 162, label: { sr: 'Menta', en: 'Mint', ru: 'Мята' } },
  { value: 210, label: { sr: 'Plavo', en: 'Blue', ru: 'Синий' } },
  { value: 32, label: { sr: 'Narandžasto', en: 'Orange', ru: 'Оранжевый' } },
  { value: 18, label: { sr: 'Terakota', en: 'Terracotta', ru: 'Терракота' } },
  { value: 265, label: { sr: 'Ljubičasto', en: 'Violet', ru: 'Фиолетовый' } },
  { value: 340, label: { sr: 'Malina', en: 'Raspberry', ru: 'Малина' } },
  { value: 96, label: { sr: 'Maslina', en: 'Olive', ru: 'Олива' } },
];

export const radiusOptions: PanelOption<number>[] = [
  { value: 0, label: { sr: '0 — strogi uglovi', en: '0 — sharp corners', ru: '0 — строгие углы' } },
  { value: 8, label: { sr: '8 — suzdržano', en: '8 — restrained', ru: '8 — сдержанные' } },
  { value: 16, label: { sr: '16 — meko', en: '16 — soft', ru: '16 — мягкие' } },
  { value: 24, label: { sr: '24 — oblo', en: '24 — rounded', ru: '24 — округлые' } },
];

export const fontOptions: PanelOption<FontKind>[] = [
  {
    value: 'manrope',
    label: { sr: 'Manrope — geometrijski', en: 'Manrope — geometric', ru: 'Manrope — геометрия' },
  },
  {
    value: 'lora',
    label: { sr: 'Lora — sa serifima', en: 'Lora — with serifs', ru: 'Lora — с засечками' },
  },
  {
    value: 'playfair',
    label: { sr: 'Playfair — modni serif', en: 'Playfair — fashion serif', ru: 'Playfair — модный сериф' },
  },
  {
    value: 'nunito',
    label: { sr: 'Nunito — oblo', en: 'Nunito — rounded', ru: 'Nunito — округлый' },
  },
  {
    value: 'system',
    label: {
      sr: 'Sistemski — bez webfontova',
      en: 'System — no web fonts',
      ru: 'Системный — без веб-шрифтов',
    },
  },
];

export const densityOptions: PanelOption<DensityKind>[] = [
  { value: 'compact', label: { sr: 'Zbijeno', en: 'Compact', ru: 'Компактно' } },
  { value: 'normal', label: { sr: 'Normalno', en: 'Normal', ru: 'Обычно' } },
  { value: 'spacious', label: { sr: 'Prostrano', en: 'Spacious', ru: 'Просторно' } },
];

export const cardOptions: PanelOption<CardKind>[] = [
  { value: 'flat', label: { sr: 'Bez okvira', en: 'No frames', ru: 'Без рамок' } },
  { value: 'outline', label: { sr: 'Tanka ivica', en: 'Thin outline', ru: 'Тонкая рамка' } },
  { value: 'shadow', label: { sr: 'Meka senka', en: 'Soft shadow', ru: 'Мягкая тень' } },
];

export const buttonOptions: PanelOption<ButtonKind>[] = [
  { value: 'solid', label: { sr: 'Puna boja', en: 'Solid', ru: 'Заливка' } },
  { value: 'soft', label: { sr: 'Meka podloga', en: 'Soft fill', ru: 'Мягкий фон' } },
  { value: 'outline', label: { sr: 'Kontura', en: 'Outline', ru: 'Контур' } },
];

export const containerOptions: PanelOption<ContainerKind>[] = [
  { value: 'normal', label: { sr: 'Normalna širina', en: 'Normal width', ru: 'Обычная ширина' } },
  { value: 'wide', label: { sr: 'Široko', en: 'Wide', ru: 'Широкая' } },
];

export const heroOptions: PanelOption<HeroKind>[] = [
  { value: 'split', label: { sr: 'Tekst levo, foto desno', en: 'Text left, photo right', ru: 'Текст слева, фото справа' } },
  { value: 'center', label: { sr: 'Po sredini', en: 'Centred', ru: 'По центру' } },
  { value: 'full', label: { sr: 'Foto preko cele širine', en: 'Full-width photo', ru: 'Фото на всю ширину' } },
];
