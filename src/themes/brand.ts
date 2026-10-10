/**
 * Фирменный акцент.
 *
 * Одна функция на весь сайт: Base.astro кладёт акцент в
 * <meta name="theme-color"> на сборке, manifest и OG берут его же,
 * а scheme.ts (клиент) перекрашивает адресную строку при смене схемы.
 * Все считают одно и то же значение из токенов (src/themes/tokens.ts).
 */

import type { ColorTokens } from './tokens.ts';
import { darkTokens, lightTokens } from './tokens.ts';

export type Scheme = 'light' | 'dark';

/**
 * HSL → компоненты sRGB [0..1]: базовая конвертация акцента,
 * общая для hex-рендера и проверки контраста.
 */
export function hslToRgb(
  hue: number,
  saturation: string,
  lightness: string,
): [number, number, number] {
  const h = ((hue % 360) + 360) % 360;
  const s = parseFloat(saturation) / 100;
  const l = parseFloat(lightness) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

/** Акцент набора в hex. */
export function brandHex(tokens: ColorTokens): string {
  const hex = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  const [r, g, b] = hslToRgb(tokens.brandH, tokens.brandS, tokens.brandL);
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/** Акцент действующей схемы. */
export function accentHex(scheme: Scheme): string {
  return brandHex(scheme === 'dark' ? darkTokens : lightTokens);
}
