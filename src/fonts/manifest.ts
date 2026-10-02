import type { FontKind, FontUrls } from '../themes/types';
import { urls as comfortaa } from './comfortaa.urls';
import { urls as lora } from './lora.urls';
import { urls as manrope } from './manrope.urls';
import { urls as nunito } from './nunito.urls';
import { urls as playfair } from './playfair-display.urls';

export const fonts: Partial<Record<FontKind, FontUrls>> = {
  comfortaa,
  lora,
  manrope,
  nunito,
  playfair,
};
