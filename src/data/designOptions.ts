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
  DecorKind,
  DensityKind,
  FontKind,
  HeroKind,
  OrderHintKind,
  PaletteKind,
  PhotoKind,
  PhotoShapeKind,
  SectionsKind,
  SurfaceKind,
  TextureKind,
} from '../themes/types';
import { paletteIds, paletteLabels } from './palettes';

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
    value: 'comfortaa',
    label: {
      sr: 'Comfortaa — mekano oblo',
      en: 'Comfortaa — soft rounded',
      ru: 'Comfortaa — мягко-округлый',
    },
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
  { value: 'hard', label: { sr: 'Gruba ivica', en: 'Hard edge', ru: 'Жёсткая рамка' } },
  { value: 'sticker', label: { sr: 'Nalepnica', en: 'Sticker', ru: 'Наклейка' } },
];

export const buttonOptions: PanelOption<ButtonKind>[] = [
  { value: 'solid', label: { sr: 'Puna boja', en: 'Solid', ru: 'Заливка' } },
  { value: 'soft', label: { sr: 'Meka podloga', en: 'Soft fill', ru: 'Мягкий фон' } },
  { value: 'outline', label: { sr: 'Kontura', en: 'Outline', ru: 'Контур' } },
  { value: 'link', label: { sr: 'Veza (caps, podvučeno)', en: 'Link (caps, underlined)', ru: 'Ссылка (капс, подчёркнуто)' } },
  { value: 'hard', label: { sr: 'Blok sa senkom', en: 'Block with shadow', ru: 'Блок с тенью' } },
];

export const sectionsOptions: PanelOption<SectionsKind>[] = [
  { value: 'plain', label: { sr: 'Ravnomerno', en: 'Even', ru: 'Ровно' } },
  { value: 'banded', label: { sr: 'Trake', en: 'Bands', ru: 'Полосы' } },
  { value: 'editorial', label: { sr: 'Numerisano (magazin)', en: 'Numbered (magazine)', ru: 'Нумерация (журнал)' } },
];

export const textureOptions: PanelOption<TextureKind>[] = [
  { value: 'none', label: { sr: 'Bez teksture', en: 'None', ru: 'Без текстуры' } },
  { value: 'grain', label: { sr: 'Zrno (štampa)', en: 'Grain (print)', ru: 'Зерно (печать)' } },
  { value: 'dots', label: { sr: 'Tačke', en: 'Dots', ru: 'Точки' } },
  { value: 'grid', label: { sr: 'Mreža', en: 'Grid', ru: 'Сетка' } },
  { value: 'waves', label: { sr: 'Talasi', en: 'Waves', ru: 'Волны' } },
  { value: 'stripes', label: { sr: 'Pruge', en: 'Stripes', ru: 'Полосы' } },
  { value: 'scallops', label: { sr: 'Školjke', en: 'Scallops', ru: 'Чешуйки' } },
  { value: 'checks', label: { sr: 'Karo', en: 'Checks', ru: 'Клетка' } },
];

export const surfaceOptions: PanelOption<SurfaceKind>[] = [
  { value: 'flat', label: { sr: 'Ravna podloga', en: 'Flat', ru: 'Ровный фон' } },
  { value: 'tint', label: { sr: 'Tonirana', en: 'Tinted', ru: 'Тонированный' } },
  { value: 'gradient', label: { sr: 'Gradijent', en: 'Gradient', ru: 'Градиент' } },
  { value: 'mesh', label: { sr: 'Mreža u boji', en: 'Mesh', ru: 'Цветная сетка' } },
];

export const decorOptions: PanelOption<DecorKind>[] = [
  { value: 'none', label: { sr: 'Bez dekora', en: 'None', ru: 'Без декора' } },
  { value: 'bubbles', label: { sr: 'Mehurići', en: 'Bubbles', ru: 'Пузырьки' } },
  { value: 'sparkles', label: { sr: 'Iskrice', en: 'Sparkles', ru: 'Искры' } },
  { value: 'confetti', label: { sr: 'Konfete', en: 'Confetti', ru: 'Конфетти' } },
  { value: 'ripples', label: { sr: 'Krugovi na vodi', en: 'Ripples', ru: 'Круги на воде' } },
];

export const photoOptions: PanelOption<PhotoKind>[] = [
  { value: 'plain', label: { sr: 'Obično', en: 'Plain', ru: 'Обычно' } },
  { value: 'duotone', label: { sr: 'Dvobojno', en: 'Duotone', ru: 'Двухцветно' } },
  { value: 'halftone', label: { sr: 'Raster', en: 'Halftone', ru: 'Растр' } },
];

export const photoShapeOptions: PanelOption<PhotoShapeKind>[] = [
  { value: 'rect', label: { sr: 'Pravougaonik', en: 'Rectangle', ru: 'Прямоугольник' } },
  { value: 'arch', label: { sr: 'Luk', en: 'Arch', ru: 'Арка' } },
  { value: 'round', label: { sr: 'Oblo', en: 'Rounded', ru: 'Скруглённая' } },
  { value: 'blob', label: { sr: 'Organski oblik', en: 'Blob', ru: 'Органичная' } },
];

/**
 * Палитры берём из общего реестра (src/data/palettes.ts): подписи одинаковы
 * для всех тем, а вот какие палитры доступны — решает тема, и панель
 * фильтрует список по её полю available.palettes.
 */
export const paletteOptions: PanelOption<PaletteKind>[] = paletteIds.map((id) => ({
  value: id,
  label: paletteLabels[id],
}));

export const containerOptions: PanelOption<ContainerKind>[] = [
  { value: 'normal', label: { sr: 'Normalna širina', en: 'Normal width', ru: 'Обычная ширина' } },
  { value: 'wide', label: { sr: 'Široko', en: 'Wide', ru: 'Широкая' } },
];

export const heroOptions: PanelOption<HeroKind>[] = [
  { value: 'split', label: { sr: 'Tekst levo, foto desno', en: 'Text left, photo right', ru: 'Текст слева, фото справа' } },
  { value: 'center', label: { sr: 'Po sredini', en: 'Centred', ru: 'По центру' } },
  { value: 'full', label: { sr: 'Foto preko cele širine', en: 'Full-width photo', ru: 'Фото на всю ширину' } },
];

/**
 * Подсказка «заявка с расчётом» на закреплённой кнопке телефона.
 *
 * Пять вариантов одного состояния: заказчик смотрит их на стенде и выбирает
 * один. Разница только в слое поверх смены подписи — так сравнение честное,
 * а не «разные кнопки».
 */
export const orderHintOptions: PanelOption<OrderHintKind>[] = [
  { value: 'text', label: { sr: '1 — samo tekst', en: '1 — text only', ru: '1 — только текст' } },
  { value: 'icon', label: { sr: '2 — tekst + ikona', en: '2 — text + icon', ru: '2 — текст + иконка' } },
  { value: 'glow', label: { sr: '3 — tekst + sjaj', en: '3 — text + glow', ru: '3 — текст + свечение' } },
  { value: 'badge', label: { sr: '4 — tekst + oznaka', en: '4 — text + badge', ru: '4 — текст + бейдж' } },
  { value: 'combo', label: { sr: '5 — tekst + ikona + sjaj', en: '5 — text + icon + glow', ru: '5 — текст + иконка + свечение' } },
];
