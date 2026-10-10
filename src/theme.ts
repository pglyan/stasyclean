/**
 * Оформление сайта: одна тема с двумя схемами.
 *
 * Здесь собрано то, что нужно разметке и сборке: схема по умолчанию,
 * шрифтовые роли, цвета обеих схем, адреса субсетов и атрибуты <html>.
 *
 * Цвета — единственный источник: CSS из них печатает
 * scripts/gen-theme-tokens.mjs, а <meta theme-color>, manifest и OG
 * считают акцент через src/themes/brand.ts. Ничего из этого файла не
 * уезжает в клиентский JS: значения считаются на сборке.
 */

import type { ColorTokens } from './themes/tokens';
import { darkTokens, lightTokens } from './themes/tokens';
import type { FontKind, FontUrls } from './themes/types';
import { fonts } from './fonts/manifest';

/** Схема по умолчанию; посетитель может переключить её в шапке. */
export const defaultScheme = 'light' as const;
export type Scheme = 'light' | 'dark';

/** Роли шрифтов — для предзагрузки нужных субсетов. */
export const headingFont: FontKind = 'lora';
export const bodyFont: FontKind = 'manrope';

/** Цвета обеих схем — единственный источник. */
export const colors: Record<Scheme, ColorTokens> = {
  light: lightTokens,
  dark: darkTokens,
};

/** Адреса субсетов шрифтов темы (в сборку попадают только они). */
export const fontUrls: Partial<Record<FontKind, FontUrls>> = fonts;

/** Атрибуты на <html>. */
export const htmlAttributes: Record<string, string> = { 'data-scheme': defaultScheme };
