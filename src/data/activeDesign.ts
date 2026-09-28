/**
 * Выбранный стиль сайта на момент сборки.
 *
 * Единственный источник правды — design.config.json в корне репозитория.
 * Его читают:
 *   • этот модуль — чтобы отрендерить <html data-…> в прод-сборке
 *     и подставить выбранные значения в демо-стенд как стартовые;
 *   • astro.config.mjs — чтобы выбрать алиас `@skin`/`@theme`
 *     (только CSS выбранной темы попадает в прод-сборку);
 *   • scripts/design.mjs — CLI, который меняет конфиг и показывает,
 *     что именно уедет в сборку.
 *
 * Ничего из этого файла не попадает в клиентский JS: значения считаются
 * на сборке, в разметку уходят только готовые атрибуты.
 */

import raw from '../../design.config.json';
import {
  assertThemeFonts,
  assertThemePalettes,
  designDefaults,
  resolveDesign,
  type DesignSettings,
} from './designSchema';
import { getThemePreset, themePresets } from './themes';
import type { FontKind, PaletteKind, ThemePreset } from '../themes/types';

/** Идентификаторы всех тем — нужны валидации конфига. */
export const themeIds = themePresets.map((preset) => preset.id);

/** Проверенный выбор из design.config.json. */
export const activeDesign: DesignSettings = resolveDesign(raw, themeIds);

/** Тема выбранного дизайна. */
export const activeTheme: ThemePreset = getThemePreset(activeDesign.theme);

export interface BuildDesign {
  settings: DesignSettings;
  theme: ThemePreset;
  headingFont: FontKind;
  bodyFont: FontKind;
  /** Палитра темы после подстановки умолчания. null — у темы их нет. */
  palette: PaletteKind | null;
  /**
   * Значения параметров после подстановки умолчаний темы.
   * id темы не входит: его читает CSS, а не скрипты.
   */
  values: {
    density: string;
    card: string;
    button: string;
    container: string;
    hero: string;
    sections: string;
    texture: string;
    surface: string;
    decor: string;
    photo: string;
    photoShape: string | null;
  };
  /** Атрибуты на <html>: значения темы, перекрытые выбором из конфига. */
  attributes: Record<string, string>;
  /** Инлайновые переменные: акцент и радиус, если их переопределили. */
  style: string;
}

/**
 * Итоговые значения для разметки: настройки конфига поверх умолчаний темы.
 *
 * Тема отвечает за то, «как выглядит» (CSS), а её умолчания параметров
 * живут здесь — в данных. Так у параметра ровно один механизм применения
 * (атрибут на <html>), и не бывает ситуации, когда CSS темы и переключатель
 * из панели спорят за одну и ту же переменную.
 */
export function resolveForBuild(design: DesignSettings = activeDesign): BuildDesign {
  const theme = getThemePreset(design.theme);

  const headingFont = design.headingFont ?? theme.defaults.headingFont;
  const bodyFont = design.bodyFont ?? theme.defaults.bodyFont;
  const palette = design.palette ?? theme.defaults.palette;

  assertThemeFonts(theme, design, { headingFont, bodyFont });
  assertThemePalettes(theme, design, palette);

  const values = {
    density: design.density ?? theme.defaults.density,
    card: design.card ?? theme.defaults.card,
    button: design.button ?? theme.defaults.button,
    container: design.container ?? theme.defaults.container,
    hero: design.hero ?? theme.defaults.hero,
    sections: design.sections ?? theme.defaults.sections,
    texture: design.texture ?? theme.defaults.texture,
    surface: design.surface ?? theme.defaults.surface,
    decor: design.decor ?? theme.defaults.decor,
    photo: design.photo ?? theme.defaults.photo,
    photoShape: design.photoShape ?? theme.defaults.photoShape,
  };

  const attributes: Record<string, string> = {
    'data-skin': theme.id,
    'data-font': headingFont,
    'data-body-font': bodyFont,
    'data-density': values.density,
    'data-card': values.card,
    'data-button': values.button,
    'data-container': values.container,
    'data-hero': values.hero,
    'data-sections': values.sections,
    'data-texture': values.texture,
    'data-surface': values.surface,
    'data-decor': values.decor,
    'data-photo': values.photo,
    'data-motion': design.motion,
    'data-sticky': design.stickyCta,
  };

  /** Форма фото-слота: null у темы — значит «базовое скругление», без атрибута. */
  if (values.photoShape) attributes['data-photo-shape'] = values.photoShape;

  /**
   * Палитры есть не у каждой темы, и «палитра по умолчанию» темы — это не
   * отдельный цвет, а тот, что уже описан в её токенах. Поэтому атрибут
   * ставим только когда палитра выбрана осознанно: без него тема выглядит
   * ровно так, как её написал автор.
   */
  if (palette) attributes['data-palette'] = palette;

  const style = [
    design.accentHue !== null ? `--brand-h:${design.accentHue}` : '',
    design.radius !== null ? `--radius:${design.radius}px` : '',
  ]
    .filter(Boolean)
    .join(';');

  return { settings: design, theme, headingFont, bodyFont, palette, values, attributes, style };
}

/** Посчитано один раз на сборку. */
export const designForBuild: BuildDesign = resolveForBuild();

export { designDefaults };
