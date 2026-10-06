/**
 * Данные оформления сайта для разметки.
 *
 * Значения параметров (плотность, карточки, текстуры, акцент, радиус…)
 * запечены в CSS — в src/styles/params.css и в теме, поэтому здесь остаётся
 * ровно то, что нужно <html>: тема, шрифты и два атрибута —
 *   data-skin   — область селекторов токенов темы;
 *   data-scheme — переключатель светлой/тёмной темы (src/scripts/scheme.ts).
 *
 * Ничего из этого файла не попадает в клиентский JS: значения считаются
 * на сборке, в разметку уходят только готовые атрибуты.
 */

import { getThemePreset } from './themes';
import type { FontKind, ThemeKind, ThemePreset } from '../themes/types';

export interface BuildDesign {
  /** Пресет темы сайта — её CSS и шрифты (алиасы @skin/@theme). */
  theme: ThemePreset;
  /** Шрифт заголовков — для предзагрузки нужного субсета. */
  headingFont: FontKind;
  /** Шрифт текста. */
  bodyFont: FontKind;
  /** Схема по умолчанию; посетитель может переключить её в шапке. */
  scheme: ThemeKind;
  /** Атрибуты на <html>. */
  attributes: Record<string, string>;
}

/** Посчитано один раз на сборку. */
export const designForBuild: BuildDesign = {
  theme: getThemePreset('nordic'),
  headingFont: 'lora',
  bodyFont: 'manrope',
  scheme: 'light',
  attributes: {
    'data-skin': 'nordic',
    'data-scheme': 'light',
  },
};
