/**
 * Пресеты тем и настройки демонстрационной панели.
 *
 * Панель существует ТОЛЬКО в демо-сборке (PUBLIC_DEMO=on) — в прод-сборке
 * компонент панели и её скрипт не рендерятся вовсе, поэтому мультиязычный
 * статический сайт не платит за стенд ни одним байтом.
 *
 * Как это работает: пресет задаёт атрибут `data-theme` на <html>, а конкретные
 * значения токенов лежат в src/styles/themes.css. Отдельные настройки
 * (акцент, радиус, шрифт заголовков и т. д.) пишутся в inline CSS-переменные
 * и поэтому могут комбинироваться с любым пресетом.
 */

export type DisplayKind = 'display' | 'serif' | 'system';

export interface ThemePreset {
  id: 'mint' | 'trust' | 'citrus' | 'sand' | 'nordic';
  /** Название пресета для заказчика. */
  name: string;
  /** Одно предложение: какое ощущение создаёт пресет. */
  description: string;
  /** Цвета для мини-превью в панели: фон, акцент, текст. */
  swatch: [string, string, string];
  dark: boolean;
  /** Шрифт заголовков по умолчанию для этого пресета. */
  display: DisplayKind;
  /** Базовый радиус по умолчанию, px. */
  radius: number;
}

export const themePresets: ThemePreset[] = [
  {
    id: 'mint',
    name: 'Свежая мята',
    description: 'Светлый, чистый, ассоциируется с эко-уборкой и свежестью.',
    swatch: ['#ffffff', '#12a87b', '#0b2b22'],
    dark: false,
    display: 'display',
    radius: 16,
  },
  {
    id: 'trust',
    name: 'Глубокий синий',
    description: 'Надёжность и сервис. Классика для сферы услуг, хорошо читается в рекламе.',
    swatch: ['#ffffff', '#1467b3', '#0b2138'],
    dark: false,
    display: 'display',
    radius: 12,
  },
  {
    id: 'citrus',
    name: 'Цитрусовая энергия',
    description: 'Яркий акцент и плотные заголовки. Заметно выделяется среди конкурентов.',
    swatch: ['#ffffff', '#f0871a', '#191919'],
    dark: false,
    display: 'display',
    radius: 8,
  },
  {
    id: 'sand',
    name: 'Тёплый песок',
    description: 'Спокойный премиальный тон: тёплый фон, терракота, засечный шрифт.',
    swatch: ['#faf6f1', '#b4633a', '#2b2620'],
    dark: false,
    display: 'serif',
    radius: 4,
  },
  {
    id: 'nordic',
    name: 'Северная ночь',
    description: 'Тёмная тема для современных проектов. Минимализм и аквамариновый акцент.',
    swatch: ['#0e1216', '#35c2b0', '#e8eef3'],
    dark: true,
    display: 'display',
    radius: 12,
  },
];

export function getThemePreset(id: string): ThemePreset {
  const found = themePresets.find((preset) => preset.id === id);
  if (!found) throw new Error(`Unknown theme preset: ${id}`);
  return found;
}

export interface PanelOption<T> {
  value: T;
  label: string;
}

/** Акцент: меняем только тон (H), насыщенность и светлоту держит тема. */
export const accentOptions: PanelOption<number>[] = [
  { value: 162, label: 'Мята' },
  { value: 210, label: 'Синий' },
  { value: 32, label: 'Оранжевый' },
  { value: 18, label: 'Терракота' },
  { value: 265, label: 'Фиолетовый' },
  { value: 340, label: 'Малина' },
  { value: 96, label: 'Олива' },
];

export const radiusOptions: PanelOption<number>[] = [
  { value: 0, label: '0 — строгие углы' },
  { value: 8, label: '8 — сдержанные' },
  { value: 16, label: '16 — мягкие' },
  { value: 24, label: '24 — округлые' },
];

export const displayOptions: PanelOption<DisplayKind>[] = [
  { value: 'display', label: 'Manrope — геометрия' },
  { value: 'serif', label: 'Lora — с засечками' },
  { value: 'system', label: 'Системный — без веб-шрифтов' },
];

export const densityOptions: PanelOption<string>[] = [
  { value: 'compact', label: 'Компактно' },
  { value: 'normal', label: 'Обычно' },
  { value: 'spacious', label: 'Просторно' },
];

export const cardOptions: PanelOption<string>[] = [
  { value: 'flat', label: 'Без рамок' },
  { value: 'outline', label: 'Тонкая рамка' },
  { value: 'shadow', label: 'Мягкая тень' },
];

export const buttonOptions: PanelOption<string>[] = [
  { value: 'solid', label: 'Заливка' },
  { value: 'soft', label: 'Мягкий фон' },
  { value: 'outline', label: 'Контур' },
];

export const containerOptions: PanelOption<string>[] = [
  { value: 'normal', label: 'Обычная ширина' },
  { value: 'wide', label: 'Широкая' },
];

export const heroOptions: PanelOption<string>[] = [
  { value: 'split', label: 'Текст слева, фото справа' },
  { value: 'center', label: 'По центру' },
  { value: 'full', label: 'Фото на всю ширину' },
];
