/**
 * Реестр тем.
 *
 * Тема — это не палитра, а целый стиль оформления: свой графический язык,
 * типографика, ритм секций и декор. Здесь лежат только *данные* темы —
 * то, что нужно панели для показа и сборке для подстановки значений:
 *
 *   name / description — локализованные подписи для заказчика;
 *   defaults           — умолчания параметров (radius, шрифты, карточки…);
 *   available          — какие шрифты и палитры тема разрешает.
 * Цвета — в src/themes/tokens.ts (единственный источник, свотчи выводятся
 * оттуда же через swatchOf), оформление — в src/themes/<id>/theme.css.
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
      sections: 'plain',
      texture: 'none',
      surface: 'flat',
      decor: 'none',
      photo: 'plain',
      photoShape: null,
      palette: null,
    },
    available: {
      heading: ['manrope', 'lora', 'system'],
      body: ['manrope', 'lora', 'system'],
      palettes: [],
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
      sections: 'plain',
      texture: 'none',
      surface: 'flat',
      decor: 'none',
      photo: 'plain',
      photoShape: null,
      palette: null,
    },
    available: {
      heading: ['manrope', 'lora', 'system'],
      body: ['manrope', 'lora', 'system'],
      palettes: [],
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
      sections: 'plain',
      texture: 'none',
      surface: 'flat',
      decor: 'none',
      photo: 'plain',
      photoShape: null,
      palette: null,
    },
    available: {
      heading: ['manrope', 'lora', 'system'],
      body: ['manrope', 'lora', 'system'],
      palettes: [],
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
      sections: 'plain',
      texture: 'none',
      surface: 'flat',
      decor: 'none',
      photo: 'plain',
      photoShape: null,
      palette: null,
    },
    available: {
      heading: ['lora', 'manrope', 'system'],
      body: ['manrope', 'lora', 'system'],
      palettes: [],
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
      sections: 'plain',
      texture: 'none',
      surface: 'flat',
      decor: 'none',
      photo: 'plain',
      photoShape: null,
      palette: null,
    },
    available: {
      heading: ['manrope', 'lora', 'system'],
      body: ['manrope', 'lora', 'system'],
      palettes: [],
    },
  },
  {
    id: 'atelier',
    name: { sr: 'Atelje', en: 'Atelier', ru: 'Ателье' },
    description: {
      sr: 'Magazinski raspored: krupna serifna tipografija, tanke linije, numerisane sekcije, dvobojne fotografije.',
      en: 'A magazine spread: large serif type, hairlines, numbered sections, duotone photos.',
      ru: 'Журнальный разворот: крупная засечная типографика, линейки, нумерация секций, двухцветные фото.',
    },
    kind: 'light',
    layout: 'poster',
    defaults: {
      radius: 0,
      density: 'spacious',
      headingFont: 'playfair',
      bodyFont: 'manrope',
      card: 'flat',
      button: 'link',
      container: 'wide',
      hero: 'full',
      sections: 'editorial',
      texture: 'none',
      surface: 'flat',
      decor: 'none',
      photo: 'duotone',
      photoShape: null,
      palette: null,
    },
    available: {
      heading: ['playfair', 'system'],
      body: ['manrope', 'system'],
      palettes: [],
    },
  },
  {
    id: 'mila',
    name: { sr: 'Medeno', en: 'Sweet & soft', ru: 'Милота' },
    description: {
      sr: 'Topao i prijatan ton: obao font, meke forme, nalepnice i tačkasta tekstura.',
      en: 'Warm and friendly: rounded type, soft shapes, stickers and a dotted texture.',
      ru: 'Тёплая и дружелюбная подача: округлый шрифт, мягкие формы, наклейки, точечная текстура.',
    },
    kind: 'light',
    layout: 'split',
    defaults: {
      radius: 26,
      density: 'normal',
      headingFont: 'nunito',
      bodyFont: 'nunito',
      card: 'sticker',
      button: 'solid',
      container: 'normal',
      hero: 'split',
      sections: 'plain',
      texture: 'dots',
      surface: 'flat',
      decor: 'none',
      photo: 'plain',
      photoShape: 'blob',
      palette: 'rose',
    },
    available: {
      heading: ['nunito', 'manrope', 'system'],
      body: ['nunito', 'manrope', 'system'],
      palettes: ['rose', 'peach', 'butter', 'lilac'],
    },
  },
  {
    id: 'bubble',
    name: { sr: 'Plava svežina', en: 'Blue freshness', ru: 'Голубая свежесть' },
    description: {
      sr: 'Svetlo i sapunasto: oble geometrijske forme, mehurići i pastelno nebo.',
      en: 'Light and soapy: rounded geometric shapes, bubbles and a pastel sky.',
      ru: 'Светлая «мыльная» подача: округлая геометрия, пузырьки и пастельное небо.',
    },
    kind: 'light',
    layout: 'banded',
    defaults: {
      radius: 24,
      density: 'normal',
      headingFont: 'comfortaa',
      bodyFont: 'manrope',
      card: 'sticker',
      button: 'solid',
      container: 'normal',
      hero: 'split',
      sections: 'banded',
      texture: 'waves',
      surface: 'mesh',
      decor: 'bubbles',
      photo: 'plain',
      photoShape: 'blob',
      palette: 'sky',
    },
    available: {
      heading: ['comfortaa', 'manrope', 'system'],
      body: ['manrope', 'comfortaa', 'system'],
      palettes: ['sky', 'mist', 'milk', 'aqua'],
    },
  },
  {
    id: 'sorbet',
    name: { sr: 'Sorbet', en: 'Sorbet', ru: 'Сорбет' },
    description: {
      sr: 'Lila i breskva: mekani oblici, iskrice i „školjkasta“ tekstura.',
      en: 'Lilac and peach: soft shapes, sparkles and a scalloped texture.',
      ru: 'Лилово-персиковая мягкость: округлые формы, искры и «чешуйчатая» текстура.',
    },
    kind: 'light',
    layout: 'zigzag',
    defaults: {
      radius: 20,
      density: 'normal',
      headingFont: 'nunito',
      bodyFont: 'manrope',
      card: 'shadow',
      button: 'soft',
      container: 'normal',
      hero: 'split',
      sections: 'plain',
      texture: 'scallops',
      surface: 'gradient',
      decor: 'sparkles',
      photo: 'plain',
      photoShape: 'arch',
      palette: 'lilac',
    },
    available: {
      heading: ['nunito', 'manrope', 'system'],
      body: ['manrope', 'nunito', 'system'],
      palettes: ['lilac', 'peach', 'sky', 'butter'],
    },
  },
  {
    id: 'zine',
    name: { sr: 'Beton i papir', en: 'Concrete & paper', ru: 'Бетон и бумага' },
    description: {
      sr: 'Brutalizam i fanzin: grube ivice, pomerene senke, kaps i štamparska traka.',
      en: 'Brutalism and zines: hard edges, offset shadows, all-caps and a printed ticker.',
      ru: 'Брутализм и самиздат: жёсткие рамки, сдвинутые тени, капс и типографская лента.',
    },
    kind: 'light',
    layout: 'center',
    defaults: {
      radius: 0,
      density: 'normal',
      headingFont: 'manrope',
      bodyFont: 'manrope',
      card: 'hard',
      button: 'hard',
      container: 'wide',
      hero: 'center',
      sections: 'plain',
      texture: 'grain',
      surface: 'flat',
      decor: 'none',
      photo: 'halftone',
      photoShape: null,
      palette: null,
    },
    available: {
      heading: ['manrope', 'system'],
      body: ['manrope', 'system'],
      palettes: [],
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
