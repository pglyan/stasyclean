/**
 * Реестр тем.
 *
 * Тема — это целый стиль оформления: свой графический язык, типографика,
 * ритм секций и декор. Здесь лежат только *данные* темы — идентификатор,
 * локализованное имя, натуральная схема и список шрифтов, которые она
 * допускает. Цвета — в src/themes/tokens.ts, оформление —
 * в src/themes/<id>/theme.css, значения параметров запечены в CSS
 * (src/styles/params.css).
 *
 * В проекте одна тема — nordic. Алиасы @skin/@theme в astro.config.mjs
 * указывают на неё, поэтому в сборку попадает только её CSS и только её шрифты.
 */

import type { ThemePreset } from '../themes/types';

export const themePresets: ThemePreset[] = [
  {
    id: 'nordic',
    name: { sr: 'Severna noć', en: 'Nordic night', ru: 'Северная ночь' },
    description: {
      sr: 'Svetla i tamna varijanta: minimalizam i akvamarin akcenat.',
      en: 'Light and dark variants: minimalism with an aquamarine accent.',
      ru: 'Светлая и тёмная вариация: минимализм и аквамариновый акцент.',
    },
    kind: 'light',
    available: {
      heading: ['lora', 'manrope', 'system'],
      body: ['manrope', 'lora', 'system'],
    },
  },
];

/** Идентификаторы тем — для проверок и подсказок в ошибках. */
export const themeIds: string[] = themePresets.map((preset) => preset.id);

export function getThemePreset(id: string): ThemePreset {
  const found = themePresets.find((preset) => preset.id === id);
  if (!found) {
    throw new Error(
      `Неизвестная тема «${id}». Доступные темы: ${themeIds.join(', ')} ` +
        '(список — src/data/themes.ts, CSS темы — src/themes/<id>/theme.css).',
    );
  }
  return found;
}
