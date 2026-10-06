import type { FontKind, FontUrls } from '../themes/types';
import { urls as lora } from './lora.urls';
import { urls as manrope } from './manrope.urls';

export const fonts: Partial<Record<FontKind, FontUrls>> = {
  lora,
  manrope,
};
