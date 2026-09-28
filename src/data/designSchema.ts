/**
 * Схема выбора оформления — то, что лежит в design.config.json.
 *
 * Модуль намеренно не читает сам файл: его импортируют с двух сторон —
 * сборка сайта (src/data/activeDesign.ts) и CLI (scripts/design.mjs),
 * который этот файл валидирует и записывает. Так правила проверки
 * существуют в одном экземпляре.
 *
 * Любое недопустимое значение — это ошибка сборки, а не тихий фолбэк:
 * заказчик выбирает облик сайта один раз, и «молча подставилось что-то
 * не то» здесь дороже, чем понятное сообщение.
 */

import type {
  ButtonKind,
  CardKind,
  ContainerKind,
  DensityKind,
  FontKind,
  HeroKind,
  SwitchKind,
} from '../themes/types';

export interface DesignSettings {
  /** Идентификатор темы — см. src/data/themes.ts */
  theme: string;
  /** Тон акцента (H). null — тон берётся из темы. */
  accentHue: number | null;
  /** Базовый радиус, px. null — радиус берётся из темы. */
  radius: number | null;
  density: DensityKind;
  /** Шрифт заголовков. null — шрифт по умолчанию для выбранной темы. */
  headingFont: FontKind | null;
  /** Шрифт текста. null — шрифт по умолчанию для выбранной темы. */
  bodyFont: FontKind | null;
  card: CardKind;
  button: ButtonKind;
  container: ContainerKind;
  hero: HeroKind;
  motion: SwitchKind;
  stickyCta: SwitchKind;
}

/** Значения «как в текущем дизайне сайта»: тема Свежесть без переопределений. */
export const designDefaults: DesignSettings = {
  theme: 'fresh',
  accentHue: null,
  radius: null,
  density: 'normal',
  headingFont: null,
  bodyFont: null,
  card: 'outline',
  button: 'solid',
  container: 'normal',
  hero: 'split',
  motion: 'on',
  stickyCta: 'on',
};

/** Допустимые значения перечислимых настроек. */
export const DESIGN_KINDS = {
  density: ['compact', 'normal', 'spacious'],
  card: ['flat', 'outline', 'shadow'],
  button: ['solid', 'soft', 'outline'],
  container: ['normal', 'wide'],
  hero: ['split', 'center', 'full'],
  motion: ['on', 'off'],
  stickyCta: ['on', 'off'],
} as const;

export const FONT_KINDS: readonly FontKind[] = ['manrope', 'lora', 'playfair', 'nunito', 'system'];

/** Все ключи конфига — нужны CLI для проверки опечаток в именах полей. */
export const DESIGN_KEYS = Object.keys(designDefaults) as (keyof DesignSettings)[];

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

function fail(field: string, value: unknown, allowed: string): never {
  throw new Error(
    `design.config.json: поле «${field}» = ${JSON.stringify(value)}. Допустимо: ${allowed}.`,
  );
}

function oneOf<T extends string>(field: string, value: unknown, allowed: readonly T[]): T {
  if (typeof value === 'string' && (allowed as readonly string[]).includes(value)) return value as T;
  fail(field, value, allowed.join(' | '));
}

function hueOrNull(field: string, value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 360) {
    return value;
  }
  fail(field, value, 'целое 0…360 или null');
}

function radiusOrNull(field: string, value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 64) {
    return value;
  }
  fail(field, value, 'число 0…64 (px) или null');
}

function fontOrNull(field: string, value: unknown): FontKind | null {
  if (value === null || value === undefined) return null;
  return oneOf(field, value, FONT_KINDS);
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
    theme: oneOf('theme', source.theme ?? designDefaults.theme, themeIds),
    accentHue: hueOrNull('accentHue', source.accentHue),
    radius: radiusOrNull('radius', source.radius),
    density: oneOf('density', source.density ?? designDefaults.density, DESIGN_KINDS.density),
    headingFont: fontOrNull('headingFont', source.headingFont),
    bodyFont: fontOrNull('bodyFont', source.bodyFont),
    card: oneOf('card', source.card ?? designDefaults.card, DESIGN_KINDS.card),
    button: oneOf('button', source.button ?? designDefaults.button, DESIGN_KINDS.button),
    container: oneOf('container', source.container ?? designDefaults.container, DESIGN_KINDS.container),
    hero: oneOf('hero', source.hero ?? designDefaults.hero, DESIGN_KINDS.hero),
    motion: oneOf('motion', source.motion ?? designDefaults.motion, DESIGN_KINDS.motion),
    stickyCta: oneOf('stickyCta', source.stickyCta ?? designDefaults.stickyCta, DESIGN_KINDS.stickyCta),
  };
}
