export interface ColorTokens {
  brandH: number;
  brandS: string;
  brandL: string;
  brandInk: string;
  brandStrong?: string;
  bg: string;
  surface: string;
  surface2: string;
  ink: string;
  inkSoft: string;
  line: string;
  shadowColor?: string;
}

export interface ThemeColorSet {
  base: ColorTokens;
  alt: ColorTokens;
  palettes: Record<string, ColorTokens>;
}

function hslToHex(hue: number, saturation: string, lightness: string): string {
  const h = ((hue % 360) + 360) % 360;
  const s = parseFloat(saturation) / 100;
  const l = parseFloat(lightness) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const hex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${hex(f(0))}${hex(f(8))}${hex(f(4))}`;
}

/** Акцент набора в hex — то же значение, что раньше лежало в swatch[1]. */
export function brandHex(tokens: ColorTokens): string {
  return hslToHex(tokens.brandH, tokens.brandS, tokens.brandL);
}

/** Паспорт набора [фон, акцент, текст] для панели и theme-color. */
export function swatchOf(tokens: ColorTokens): [string, string, string] {
  return [tokens.bg, brandHex(tokens), tokens.ink];
}

/** Акцент темы для схемы: натуральная схема — base, вторая — alt. */
export function schemeBrand(colors: ThemeColorSet, kind: string, scheme: string): string {
  return brandHex(scheme === kind ? colors.base : colors.alt);
}

export const themeColors: Record<string, ThemeColorSet> = {
  fresh: {
    // brandL 29%, а не 34%: на 34% белый текст кнопки давал 3.76:1 (ниже AA).
    base: {
      brandH: 162, brandS: '72%', brandL: '29%', brandInk: '#ffffff',
      bg: '#ffffff', surface: '#f5faf7', surface2: '#e8f4ee',
      ink: '#0b2b22', inkSoft: '#4c6862', line: '#d9e8e0',
      shadowColor: '165 25% 18%',
    },
    alt: {
      brandH: 162, brandS: '60%', brandL: '48%', brandInk: '#06231c',
      bg: '#0c1512', surface: '#131e1a', surface2: '#1a2823',
      ink: '#e6f0eb', inkSoft: '#9db4ac', line: '#263630',
      shadowColor: '165 30% 3%',
    },
    palettes: {},
  },
  trust: {
    base: {
      brandH: 210, brandS: '78%', brandL: '36%', brandInk: '#ffffff',
      bg: '#ffffff', surface: '#f3f7fc', surface2: '#e6eff9',
      ink: '#0b2138', inkSoft: '#4a6076', line: '#d8e3ef',
      shadowColor: '214 35% 20%',
    },
    alt: {
      brandH: 210, brandS: '72%', brandL: '58%', brandInk: '#06121f',
      bg: '#0a1420', surface: '#111d2c', surface2: '#17273a',
      ink: '#e3ecf6', inkSoft: '#9aadc2', line: '#22344a',
      shadowColor: '214 40% 3%',
    },
    palettes: {},
  },
  citrus: {
    base: {
      brandH: 28, brandS: '88%', brandL: '36%', brandInk: '#ffffff',
      bg: '#ffffff', surface: '#fdf8f1', surface2: '#faeede',
      ink: '#1a1a1a', inkSoft: '#5c5750', line: '#ebe3d7',
      shadowColor: '28 25% 18%',
    },
    alt: {
      brandH: 28, brandS: '85%', brandL: '58%', brandInk: '#241403',
      bg: '#1a1713', surface: '#231e18', surface2: '#2c251d',
      ink: '#f2ede6', inkSoft: '#b3a897', line: '#3a3128',
      shadowColor: '28 30% 3%',
    },
    palettes: {},
  },
  sand: {
    base: {
      brandH: 18, brandS: '52%', brandL: '42%', brandInk: '#fffaf6',
      bg: '#faf6f1', surface: '#ffffff', surface2: '#f3ebe3',
      ink: '#2b2620', inkSoft: '#6d6156', line: '#e5dbd0',
      shadowColor: '24 22% 22%',
    },
    alt: {
      brandH: 18, brandS: '55%', brandL: '56%', brandInk: '#2a1608',
      bg: '#1a1512', surface: '#231d18', surface2: '#2b241e',
      ink: '#efe8e0', inkSoft: '#b0a396', line: '#3a3129',
      shadowColor: '24 25% 3%',
    },
    palettes: {},
  },
  nordic: {
    base: {
      brandH: 174, brandS: '62%', brandL: '52%', brandInk: '#06231f',
      bg: '#0e1216', surface: '#171e25', surface2: '#1f2831',
      ink: '#e9eff4', inkSoft: '#9db0be', line: '#2a3541',
      shadowColor: '210 45% 3%',
    },
    alt: {
      brandH: 174, brandS: '55%', brandL: '30%', brandInk: '#ffffff',
      bg: '#f4f7f9', surface: '#ffffff', surface2: '#e7eef3',
      ink: '#0e1a20', inkSoft: '#50636e', line: '#d5e0e7',
      shadowColor: '210 25% 22%',
    },
    palettes: {},
  },
  atelier: {
    base: {
      brandH: 12, brandS: '46%', brandL: '38%', brandInk: '#fffaf7',
      bg: '#f6f3ee', surface: '#ffffff', surface2: '#ece7df',
      ink: '#15120e', inkSoft: '#6d6459', line: '#ded7cd',
      shadowColor: '24 18% 20%',
    },
    alt: {
      brandH: 12, brandS: '55%', brandL: '58%', brandInk: '#1a0c06',
      bg: '#14120f', surface: '#1c1916', surface2: '#241f1a',
      ink: '#f0ebe3', inkSoft: '#b0a495', line: '#332c25',
      shadowColor: '24 18% 3%',
    },
    palettes: {},
  },
  mila: {
    base: {
      brandH: 345, brandS: '65%', brandL: '48%', brandInk: '#ffffff', brandStrong: '#aa324c',
      bg: '#fff9f5', surface: '#ffffff', surface2: '#ffeee9',
      ink: '#3f2f35', inkSoft: '#77686c', line: '#f2e0dc',
      shadowColor: '5 35% 45%',
    },
    alt: {
      brandH: 345, brandS: '62%', brandL: '58%', brandInk: '#1c060e', brandStrong: '#e0768c',
      bg: '#1a1316', surface: '#231a1e', surface2: '#2c2026',
      ink: '#f2e9ec', inkSoft: '#b6a3aa', line: '#3b2b32',
      shadowColor: '5 30% 4%',
    },
    palettes: {
      rose: {
        brandH: 345, brandS: '65%', brandL: '48%', brandInk: '#ffffff', brandStrong: '#aa324c',
        bg: '#fff9f5', surface: '#ffffff', surface2: '#ffeee9',
        ink: '#3f2f35', inkSoft: '#77686c', line: '#f2e0dc',
      },
      peach: {
        brandH: 24, brandS: '82%', brandL: '66%', brandInk: '#3a2b22', brandStrong: '#946343',
        bg: '#fffaf6', surface: '#ffffff', surface2: '#ffeed8',
        ink: '#3a2b22', inkSoft: '#766961', line: '#f6e0cd',
      },
      butter: {
        brandH: 42, brandS: '85%', brandL: '62%', brandInk: '#38311e', brandStrong: '#836c34',
        bg: '#fffcf3', surface: '#ffffff', surface2: '#fdf2d6',
        ink: '#38311e', inkSoft: '#726c5b', line: '#efe4c4',
      },
      lilac: {
        brandH: 268, brandS: '48%', brandL: '50%', brandInk: '#ffffff', brandStrong: '#6a3f9f',
        bg: '#fbf9ff', surface: '#ffffff', surface2: '#f0eafc',
        ink: '#322b3d', inkSoft: '#6c6676', line: '#e4daf6',
      },
    },
  },
  bubble: {
    base: {
      brandH: 203, brandS: '68%', brandL: '68%', brandInk: '#0d2b3a', brandStrong: '#1a5f89',
      bg: '#f4faff', surface: '#ffffff', surface2: '#e8f4fb',
      ink: '#0d2b3a', inkSoft: '#5a6f7c', line: '#cfe7f6',
      shadowColor: '203 40% 34%',
    },
    alt: {
      brandH: 203, brandS: '75%', brandL: '60%', brandInk: '#06131c', brandStrong: '#73baea',
      bg: '#0b1219', surface: '#111b24', surface2: '#16242f',
      ink: '#e4eef6', inkSoft: '#97aab9', line: '#22333f',
      shadowColor: '203 40% 3%',
    },
    palettes: {
      sky: {
        brandH: 203, brandS: '68%', brandL: '68%', brandInk: '#0d2b3a', brandStrong: '#1a5f89',
        bg: '#f4faff', surface: '#ffffff', surface2: '#e8f4fb',
        ink: '#0d2b3a', inkSoft: '#5a6f7c', line: '#cfe7f6',
      },
      mist: {
        brandH: 207, brandS: '42%', brandL: '72%', brandInk: '#14303d', brandStrong: '#2a5f7a',
        bg: '#f7fbfd', surface: '#ffffff', surface2: '#e9f1f7',
        ink: '#1f2f3a', inkSoft: '#606d76', line: '#d3e5f0',
      },
      milk: {
        brandH: 198, brandS: '38%', brandL: '80%', brandInk: '#1a2f3a', brandStrong: '#33647f',
        bg: '#fdfeff', surface: '#ffffff', surface2: '#eff6fa',
        ink: '#22313b', inkSoft: '#646f77', line: '#dbeaf2',
      },
      aqua: {
        brandH: 184, brandS: '50%', brandL: '62%', brandInk: '#0b2523', brandStrong: '#1d6360',
        bg: '#f3fbfa', surface: '#ffffff', surface2: '#e2f4f2',
        ink: '#0f2f2d', inkSoft: '#586f6d', line: '#cde9e6',
      },
    },
  },
  sorbet: {
    base: {
      brandH: 268, brandS: '70%', brandL: '72%', brandInk: '#322b3d', brandStrong: '#7e60a1',
      bg: '#fbf9ff', surface: '#ffffff', surface2: '#efe8fb',
      ink: '#322b3d', inkSoft: '#6b6575', line: '#e2d7f5',
      shadowColor: '268 28% 42%',
    },
    alt: {
      brandH: 268, brandS: '68%', brandL: '64%', brandInk: '#120a1d', brandStrong: '#af83e7',
      bg: '#100c16', surface: '#171221', surface2: '#1e1829',
      ink: '#ece6f4', inkSoft: '#a89fba', line: '#2b2438',
      shadowColor: '268 30% 4%',
    },
    palettes: {
      lilac: {
        brandH: 268, brandS: '70%', brandL: '72%', brandInk: '#322b3d', brandStrong: '#7e60a1',
        bg: '#fbf9ff', surface: '#ffffff', surface2: '#efe8fb',
        ink: '#322b3d', inkSoft: '#6b6575', line: '#e2d7f5',
      },
      peach: {
        brandH: 22, brandS: '85%', brandL: '70%', brandInk: '#3a2b22', brandStrong: '#926449',
        bg: '#fffaf6', surface: '#ffffff', surface2: '#ffeedd',
        ink: '#3a2b22', inkSoft: '#766961', line: '#f8e2cf',
      },
      sky: {
        brandH: 203, brandS: '70%', brandL: '72%', brandInk: '#14303d', brandStrong: '#47728b',
        bg: '#f5faff', surface: '#ffffff', surface2: '#e8f4fb',
        ink: '#14303d', inkSoft: '#5b707b', line: '#d3e8f7',
      },
      butter: {
        brandH: 45, brandS: '85%', brandL: '66%', brandInk: '#38311e', brandStrong: '#806d39',
        bg: '#fffdf4', surface: '#ffffff', surface2: '#fdf3d8',
        ink: '#38311e', inkSoft: '#736d5d', line: '#f0e6c6',
      },
    },
  },
  zine: {
    // brandStrong задан явно: микс от жёлтого акцента давал 2.25:1.
    base: {
      brandH: 48, brandS: '100%', brandL: '52%', brandInk: '#0f0f0c', brandStrong: '#7c6620',
      bg: '#f4f1ea', surface: '#ffffff', surface2: '#eae4d7',
      ink: '#0f0f0c', inkSoft: '#4b463c', line: '#0f0f0c',
      shadowColor: '45 30% 15%',
    },
    alt: {
      brandH: 48, brandS: '100%', brandL: '55%', brandInk: '#17170a', brandStrong: '#fcd964',
      bg: '#14140f', surface: '#1c1c15', surface2: '#24241b',
      ink: '#f2efe4', inkSoft: '#b3ae9d', line: '#f2efe4',
      shadowColor: '48 30% 3%',
    },
    palettes: {},
  },
};
