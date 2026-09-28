/**
 * Реестр тем.
 *
 * Тема — это не палитра, а целый стиль оформления: свой графический язык,
 * типографика, ритм секций и декор. Здесь лежат только *данные* темы —
 * то, что нужно панели для показа и сборке для подстановки значений:
 *
 *   name / description — локализованные подписи для заказчика;
 *   swatch / layout    — паспорт темы в демо-панели;
 *   defaults           — умолчания параметров (radius, шрифты, карточки…);
 *   available          — какие шрифты тема разрешает (и, значит, везёт).
 *
 * Само оформление — в src/themes/<id>/theme.css. В прод-сборку попадает
 * CSS только выбранной темы (см. алиас `@skin` в astro.config.mjs),
 * поэтому длинный список тем не стоит продакшену ни одного байта.
 */

import type { ThemePreset } from '../themes/types';

export const themePresets: ThemePreset[] = [
  {
    id: 'fresh',
    name: { sr: 'Sveža menta', en: 'Fresh mint', ru: 'Свежая мята' },
    description: {
      sr: 'Svetao i čist izgled: asocira na eko čišćenje i svežinu.',
      en: 'Light and clean: reads as eco cleaning and freshness.',
      ru: 'Светлый, чистый, ассоциируется с эко-уборкой и свежестью.',
    },
    kind: 'light',
    swatch: ['#ffffff', '#12a87b', '#0b2b22'],
    layout: 'split',
    defaults: {
      radius: 16,
      density: 'normal',
      headingFont: 'manrope',
      bodyFont: 'manrope',
      card: 'outline',
      button: 'solid',
      container: 'normal',
      hero: 'split',
    },
    available: {
      heading: ['manrope', 'lora', 'system'],
      body: ['manrope', 'lora', 'system'],
    },
  },
  {
    id: 'trust',
    name: { sr: 'Duboko plavo', en: 'Deep blue', ru: 'Глубокий синий' },
    description: {
      sr: 'Pouzdanost i servis. Klasika za usluge, dobro se čita u reklami.',
      en: 'Reliability and service. A classic for services, easy to read in ads.',
      ru: 'Надёжность и сервис. Классика для сферы услуг, хорошо читается в рекламе.',
    },
    kind: 'light',
    swatch: ['#ffffff', '#1467b3', '#0b2138'],
    layout: 'split',
    defaults: {
      radius: 12,
      density: 'normal',
      headingFont: 'manrope',
      bodyFont: 'manrope',
      card: 'outline',
      button: 'solid',
      container: 'normal',
      hero: 'split',
    },
    available: {
      heading: ['manrope', 'lora', 'system'],
      body: ['manrope', 'lora', 'system'],
    },
  },
  {
    id: 'citrus',
    name: { sr: 'Citrusna energija', en: 'Citrus energy', ru: 'Цитрусовая энергия' },
    description: {
      sr: 'Jak akcenat i gusti naslovi. Uočljivo se izdvaja od konkurencije.',
      en: 'A bright accent and tight headings. Stands out from competitors.',
      ru: 'Яркий акцент и плотные заголовки. Заметно выделяется среди конкурентов.',
    },
    kind: 'light',
    swatch: ['#ffffff', '#f0871a', '#191919'],
    layout: 'center',
    defaults: {
      radius: 8,
      density: 'compact',
      headingFont: 'manrope',
      bodyFont: 'manrope',
      card: 'outline',
      button: 'solid',
      container: 'normal',
      hero: 'center',
    },
    available: {
      heading: ['manrope', 'lora', 'system'],
      body: ['manrope', 'lora', 'system'],
    },
  },
  {
    id: 'sand',
    name: { sr: 'Topli pesak', en: 'Warm sand', ru: 'Тёплый песок' },
    description: {
      sr: 'Miran premium ton: topao fon, terakota, naslovi sa serifima.',
      en: 'A calm premium tone: warm background, terracotta, serif headings.',
      ru: 'Спокойный премиальный тон: тёплый фон, терракота, засечный шрифт.',
    },
    kind: 'light',
    swatch: ['#faf6f1', '#b4633a', '#2b2620'],
    layout: 'poster',
    defaults: {
      radius: 4,
      density: 'spacious',
      headingFont: 'lora',
      bodyFont: 'manrope',
      card: 'flat',
      button: 'outline',
      container: 'wide',
      hero: 'full',
    },
    available: {
      heading: ['lora', 'manrope', 'system'],
      body: ['manrope', 'lora', 'system'],
    },
  },
  {
    id: 'nordic',
    name: { sr: 'Severna noć', en: 'Nordic night', ru: 'Северная ночь' },
    description: {
      sr: 'Tamna tema za moderne projekte: minimalizam i akvamarin akcenat.',
      en: 'A dark theme for modern projects: minimalism with an aquamarine accent.',
      ru: 'Тёмная тема для современных проектов. Минимализм и аквамариновый акцент.',
    },
    kind: 'dark',
    swatch: ['#0e1216', '#35c2b0', '#e8eef3'],
    layout: 'banded',
    defaults: {
      radius: 12,
      density: 'normal',
      headingFont: 'manrope',
      bodyFont: 'manrope',
      card: 'outline',
      button: 'solid',
      container: 'normal',
      hero: 'split',
    },
    available: {
      heading: ['manrope', 'lora', 'system'],
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
