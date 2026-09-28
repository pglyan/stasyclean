/**
 * Словарь оформления.
 *
 * Здесь описаны ВСЕ рычаги, которыми отличаются темы: плотность, форма
 * карточек, тип кнопок, ширина контейнера, раскладка первого экрана,
 * шрифтовые семейства. Само оформление живёт в двух местах:
 *
 *   src/styles/params.css        — как значение превращается в CSS
 *                                  (атрибут на <html> → набор переменных);
 *   src/themes/<id>/theme.css    — что тема добавляет своего: палитра,
 *                                  тени, декор, собственные правила.
 *
 * Такое разделение - главное условие задачи «много тем и маленький прод»:
 * параметры общие для всех тем и лежат в одном небольшом файле, а всё
 * специфичное для темы складывается в её собственный CSS, который в прод
 * попадает только если тема выбрана.
 */

import type { Locale } from '../i18n/config';
import type { Localized } from '../data/types';

/** Плотность блоков: масштабирует все внутренние отступы через --d. */
export type DensityKind = 'compact' | 'normal' | 'spacious';

/** Оформление карточек. */
export type CardKind = 'flat' | 'outline' | 'shadow';

/** Оформление кнопок. */
export type ButtonKind = 'solid' | 'soft' | 'outline';

/** Ширина контейнера. */
export type ContainerKind = 'normal' | 'wide';

/** Раскладка первого экрана. */
export type HeroKind = 'split' | 'center' | 'full';

/** Шрифтовые семейства. `system` — вариант без веб-шрифтов (ноль загрузки). */
export type FontKind = 'manrope' | 'lora' | 'playfair' | 'nunito' | 'system';

/** Светлая или тёмная тема (влияет на color-scheme и заготовки под фото). */
export type ThemeKind = 'light' | 'dark';

/** Булев переключатель в виде строки — так он живёт в атрибутах и URL. */
export type SwitchKind = 'on' | 'off';

/** Схема раскладки — рисуется в паспорте темы в демо-панели. */
export type LayoutSketch = 'split' | 'center' | 'poster' | 'banded' | 'grid' | 'zigzag';

/** Адреса субсетов одного семейства: локаль → URL готового ассета. */
export type FontUrls = Record<Locale, string>;

/**
 * Точка входа темы для сборки (src/themes/entries/<id>.ts).
 *
 * Именно этот файл выбирается алиасом `@theme`: в прод-сборке он один,
 * в демо — `entries/all.ts` со всеми темами. Поэтому перечень шрифтов
 * здесь — это ещё и бюджет: сколько файлов шрифтов уедет в `dist/_a`.
 */
export interface ThemeEntry {
  id: string;
  /** Только те семейства, которые нужны теме: остальные в прод не попадут. */
  fonts: Partial<Record<FontKind, FontUrls>>;
}

/** Значения параметров по умолчанию для темы. */
export interface ThemeDefaults {
  radius: number;
  density: DensityKind;
  headingFont: FontKind;
  bodyFont: FontKind;
  card: CardKind;
  button: ButtonKind;
  container: ContainerKind;
  hero: HeroKind;
}

/** Описание темы для панели и для сборки. */
export interface ThemePreset {
  id: string;
  /** Локализованное название — заказчик видит его в панели на своём языке. */
  name: Localized;
  /** Одно предложение о том, какое ощущение создаёт тема. */
  description: Localized;
  kind: ThemeKind;
  /** Свотч паспорта: фон, акцент, текст. */
  swatch: [string, string, string];
  /** Схема раскладки для мини-превью. */
  layout: LayoutSketch;
  defaults: ThemeDefaults;
  /**
   * Шрифты, которые тема допускает.
   *
   * Почему список, а не всё подряд: заказчик может поменять шрифт внутри
   * темы, но только на тот, который тема уже везёт с собой. Это держит
   * бюджет шрифтов предсказуемым: перечень из темы — это и есть тот
   * максимум woff2, который может попасть в прод-сборку.
   */
  available: {
    heading: FontKind[];
    body: FontKind[];
  };
}
