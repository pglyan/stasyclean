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
import { assertThemeFonts, designDefaults, resolveDesign, type DesignSettings } from './designSchema';
import { getThemePreset, themePresets } from './themes';
import type { FontKind, ThemePreset } from '../themes/types';

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

  assertThemeFonts(theme, design, { headingFont, bodyFont });

  const attributes: Record<string, string> = {
    'data-skin': theme.id,
    'data-font': headingFont,
    'data-body-font': bodyFont,
    'data-density': design.density ?? theme.defaults.density,
    'data-card': design.card ?? theme.defaults.card,
    'data-button': design.button ?? theme.defaults.button,
    'data-container': design.container ?? theme.defaults.container,
    'data-hero': design.hero ?? theme.defaults.hero,
    'data-motion': design.motion,
    'data-sticky': design.stickyCta,
  };

  const style = [
    design.accentHue !== null ? `--brand-h:${design.accentHue}` : '',
    design.radius !== null ? `--radius:${design.radius}px` : '',
  ]
    .filter(Boolean)
    .join(';');

  return { settings: design, theme, headingFont, bodyFont, attributes, style };
}

/** Посчитано один раз на сборку. */
export const designForBuild: BuildDesign = resolveForBuild();

export { designDefaults };
