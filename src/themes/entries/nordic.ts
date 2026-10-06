import type { ThemeEntry } from '../types';
import { urls as manrope } from '../../fonts/manrope.urls';
import { urls as lora } from '../../fonts/lora.urls';

/**
 * Вход темы «Северная ночь»: ровно те семейства, которые она объявляет
 * в available (src/data/themes.ts). Остальные woff2 в сборку не попадут.
 * CSS темы подключается отдельным алиасом `@skin`.
 *
 * Типизация явная (не `satisfies`): тогда `fonts` остаётся
 * Partial<Record<FontKind, FontUrls>>, и Base.astro может безопасно
 * индексировать его любым значением FontKind.
 */
const entry: ThemeEntry = {
  id: 'nordic',
  fonts: { manrope, lora },
};

export default entry;
