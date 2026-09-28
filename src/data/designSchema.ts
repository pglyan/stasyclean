/**
 * Схема выбора оформления — то, что лежит в design.config.json.
 *
 * Модуль намеренно не читает сам файл: его импортируют с двух сторон —
 * сборка сайта (src/data/activeDesign.ts) и CLI (scripts/design.mjs),
 * который этот файл валидирует и записывает. Так правила проверки
 * существуют в одном экземпляре.
 *
 * Ключевая идея: `null` означает «как в теме». Конфиг нужен не для того,
 * чтобы переписать тему целиком, а чтобы зафиксировать выбор заказчика:
 * если он выбрал только тему, в файле остаётся одна значимая строка, и
 * работает весь авторский набор умолчаний темы (формы, карточки, ритм
 * секций). Значения из конфига — осознанные переопределения поверх темы.
 *
 * Недопустимое значение — ошибка сборки, а не тихий фолбэк: заказчик
 * выбирает облик сайта один раз, и «молча подставилось не то» здесь
 * дороже, чем понятное сообщение.
 */

import type {
  ButtonKind,
  CardKind,
  ContainerKind,
  DecorKind,
  DensityKind,
  FontKind,
  HeroKind,
  PaletteKind,
  PhotoKind,
  PhotoShapeKind,
  SectionsKind,
  SurfaceKind,
  SwitchKind,
  TextureKind,
} from '../themes/types';

export interface DesignSettings {
  /** Идентификатор темы — см. src/data/themes.ts */
  theme: string;
  /** Тон акцента (H). null — тон берётся из темы. */
  accentHue: number | null;
  /** Базовый радиус, px. null — радиус берётся из темы. */
  radius: number | null;
  density: DensityKind | null;
  /** Шрифт заголовков. null — шрифт по умолчанию для выбранной темы. */
  headingFont: FontKind | null;
  /** Шрифт текста. null — шрифт по умолчанию для выбранной темы. */
  bodyFont: FontKind | null;
  card: CardKind | null;
  button: ButtonKind | null;
  container: ContainerKind | null;
  hero: HeroKind | null;
  sections: SectionsKind | null;
  texture: TextureKind | null;
  surface: SurfaceKind | null;
  decor: DecorKind | null;
  photo: PhotoKind | null;
  photoShape: PhotoShapeKind | null;
  /** Палитра внутри темы. null — палитра по умолчанию для выбранной темы. */
  palette: PaletteKind | null;
  motion: SwitchKind;
  stickyCta: SwitchKind;
}

/**
 * Значения «по умолчанию»: выбрана тема fresh, всё остальное — как задумано
 * в теме. Так выглядит чистый старт: заказчик в первую очередь выбирает тему.
 */
export const designDefaults: DesignSettings = {
  theme: 'fresh',
  accentHue: null,
  radius: null,
  density: null,
  headingFont: null,
  bodyFont: null,
  card: null,
  button: null,
  container: null,
  hero: null,
  sections: null,
  texture: null,
  surface: null,
  decor: null,
  photo: null,
  photoShape: null,
  palette: null,
  motion: 'on',
  stickyCta: 'on',
};

/** Допустимые значения перечислимых настроек. */
export const DESIGN_KINDS = {
  density: ['compact', 'normal', 'spacious'],
  card: ['flat', 'outline', 'shadow', 'hard', 'sticker'],
  button: ['solid', 'soft', 'outline', 'link', 'hard'],
  container: ['normal', 'wide'],
  hero: ['split', 'center', 'full'],
  sections: ['plain', 'banded', 'editorial'],
  texture: ['none', 'grain', 'dots', 'grid', 'waves', 'stripes', 'scallops', 'checks'],
  surface: ['flat', 'tint', 'gradient', 'mesh'],
  decor: ['none', 'bubbles', 'sparkles', 'confetti', 'ripples'],
  photo: ['plain', 'duotone', 'halftone'],
  photoShape: ['rect', 'arch', 'round', 'blob'],
  motion: ['on', 'off'],
  stickyCta: ['on', 'off'],
} as const;

export const FONT_KINDS: readonly FontKind[] = [
  'manrope',
  'lora',
  'playfair',
  'nunito',
  'comfortaa',
  'system',
];

/**
 * Известные палитры. Полный список нужен, чтобы поймать опечатку в
 * design.config.json до сборки; допустима ли палитра конкретной теме —
 * проверяет assertThemePalettes, как и со шрифтами.
 */
export const PALETTE_KINDS: readonly PaletteKind[] = [
  'sky',
  'mist',
  'milk',
  'aqua',
  'rose',
  'peach',
  'butter',
  'lilac',
];

/** Все ключи конфига — нужны CLI для проверки опечаток в именах полей. */
export const DESIGN_KEYS = Object.keys(designDefaults) as (keyof DesignSettings)[];

function fail(field: string, value: unknown, allowed: string): never {
  throw new Error(
    `design.config.json: поле «${field}» = ${JSON.stringify(value)}. Допустимо: ${allowed}.`,
  );
}

/** Значение из списка; null/отсутствие — «взять из темы». */
function oneOf<T extends string>(field: string, value: unknown, allowed: readonly T[]): T | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && (allowed as readonly string[]).includes(value)) return value as T;
  fail(field, value, `null | ${allowed.join(' | ')}`);
}

/** То же, но без «null»: для переключателей, у которых всегда есть значение. */
function requiredOneOf<T extends string>(
  field: string,
  value: unknown,
  fallback: T,
  allowed: readonly T[],
): T {
  if (value === null || value === undefined) return fallback;
  return oneOf(field, value, allowed) as T;
}

function hueOrNull(field: string, value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 360) {
    return value;
  }
  fail(field, value, 'null или целое 0…360');
}

function radiusOrNull(field: string, value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 64) {
    return value;
  }
  fail(field, value, 'null или число 0…64 (px)');
}

function fontOrNull(field: string, value: unknown): FontKind | null {
  return oneOf(field, value, FONT_KINDS);
}

function paletteOrNull(field: string, value: unknown): PaletteKind | null {
  return oneOf(field, value, PALETTE_KINDS);
}

/**
 * Приводит произвольный объект (файл конфига или экспорт из демо-панели)
 * к проверенному набору настроек. Неизвестные поля игнорируются осознанно:
 * так экспорт старой версии панели не ломает сборку.
 */
export function resolveDesign(input: unknown, themeIds: readonly string[]): DesignSettings {
  if (typeof input !== 'object' || input === null) {
    throw new Error('design.config.json: ожидался объект с настройками.');
  }

  const source = input as Record<string, unknown>;

  return {
    theme: (oneOf('theme', source.theme ?? designDefaults.theme, themeIds) ??
      designDefaults.theme) as string,
    accentHue: hueOrNull('accentHue', source.accentHue),
    radius: radiusOrNull('radius', source.radius),
    density: oneOf('density', source.density, DESIGN_KINDS.density),
    headingFont: fontOrNull('headingFont', source.headingFont),
    bodyFont: fontOrNull('bodyFont', source.bodyFont),
    card: oneOf('card', source.card, DESIGN_KINDS.card),
    button: oneOf('button', source.button, DESIGN_KINDS.button),
    container: oneOf('container', source.container, DESIGN_KINDS.container),
    hero: oneOf('hero', source.hero, DESIGN_KINDS.hero),
    sections: oneOf('sections', source.sections, DESIGN_KINDS.sections),
    texture: oneOf('texture', source.texture, DESIGN_KINDS.texture),
    surface: oneOf('surface', source.surface, DESIGN_KINDS.surface),
    decor: oneOf('decor', source.decor, DESIGN_KINDS.decor),
    photo: oneOf('photo', source.photo, DESIGN_KINDS.photo),
    photoShape: oneOf('photoShape', source.photoShape, DESIGN_KINDS.photoShape),
    palette: paletteOrNull('palette', source.palette),
    motion: requiredOneOf('motion', source.motion, designDefaults.motion, DESIGN_KINDS.motion),
    stickyCta: requiredOneOf(
      'stickyCta',
      source.stickyCta,
      designDefaults.stickyCta,
      DESIGN_KINDS.stickyCta,
    ),
  };
}

/**
 * Проверяет, что выбранные шрифты тема действительно поставляет.
 *
 * Почему это важнее, чем кажется: в прод-сборку попадают файлы шрифтов
 * только выбранной темы. Если разрешить выбрать шрифт «на стороне», сборка
 * молча отдаст fallback-гарнитуру, и заказчик увидит не то, что выбирал.
 */
export function assertThemeFonts(
  theme: { id: string; available: { heading: FontKind[]; body: FontKind[] } },
  settings: DesignSettings,
  resolved: { headingFont: FontKind; bodyFont: FontKind },
): void {
  if (!theme.available.heading.includes(resolved.headingFont)) {
    throw new Error(
      `Тема «${theme.id}» не поставляет шрифт заголовков «${resolved.headingFont}» ` +
        `(из поля headingFont = ${JSON.stringify(settings.headingFont)}). ` +
        `Доступно: ${theme.available.heading.join(' | ')}.`,
    );
  }
  if (!theme.available.body.includes(resolved.bodyFont)) {
    throw new Error(
      `Тема «${theme.id}» не поставляет шрифт текста «${resolved.bodyFont}» ` +
        `(из поля bodyFont = ${JSON.stringify(settings.bodyFont)}). ` +
        `Доступно: ${theme.available.body.join(' | ')}.`,
    );
  }
}

/**
 * Проверяет, что выбранная палитра действительно есть у темы.
 *
 * Устройство то же, что у шрифтов, и по той же причине: CSS палитры лежит
 * в файле темы (src/themes/<id>/palettes.css) и в прод-сборку попадает
 * только он. Разрешить «палитру на стороне» — значит показать заказчику
 * один цвет в панели, а в сборке оставить другой.
 */
export function assertThemePalettes(
  theme: { id: string; available: { palettes: { id: string }[] } },
  settings: DesignSettings,
  resolved: string | null,
): void {
  if (resolved === null) return;

  const ids = theme.available.palettes.map((palette) => palette.id);
  if (!ids.includes(resolved)) {
    throw new Error(
      `Тема «${theme.id}» не имеет палитры «${resolved}» ` +
        `(из поля palette = ${JSON.stringify(settings.palette)}). ` +
        (ids.length
          ? `Доступно: ${ids.join(' | ')}.`
          : 'У темы вообще нет палитр — оставьте поле palette = null.'),
    );
  }
}

