/**
 * Реестр палитр: идентификаторы и подписи.
 *
 * Палитра — это набор цветов одного настроения внутри темы: «Небо»,
 * «Туман», «Молоко», «Роза». Здесь только то, что не зависит от темы: id и
 * локализованное название. Цвета живут в CSS темы
 * (src/themes/<id>/palettes.css), а паспортные свотчи для панели — в поле
 * `available.palettes` этой темы.
 *
 * Почему цвета не здесь: одна и та же палитра в разных темах выглядит
 * по-своему («небо» у «Голубой свежести» холодное, у «Милоты» набор вообще
 * тёплый), и общий файл с цветами означал бы либо запрет на это, либо
 * перенос оформления в данные — то есть отказ от главного правила проекта:
 * данные отвечают за подписи, тема — за внешний вид.
 */

import type { Localized } from './types';
import type { PaletteKind } from '../themes/types';

export const paletteLabels: Record<PaletteKind, Localized> = {
  sky: { sr: 'Nebo', en: 'Sky', ru: 'Небо' },
  mist: { sr: 'Sumaglica', en: 'Mist', ru: 'Туман' },
  milk: { sr: 'Mleko', en: 'Milk', ru: 'Молоко' },
  aqua: { sr: 'Aqua', en: 'Aqua', ru: 'Аква' },
  rose: { sr: 'Ruža', en: 'Rose', ru: 'Роза' },
  peach: { sr: 'Breskva', en: 'Peach', ru: 'Персик' },
  butter: { sr: 'Puter', en: 'Butter', ru: 'Сливочный' },
  lilac: { sr: 'Jorgovan', en: 'Lilac', ru: 'Сирень' },
};

/** Все известные палитры в порядке показа в панели: сначала холодные. */
export const paletteIds = Object.keys(paletteLabels) as PaletteKind[];
