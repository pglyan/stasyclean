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
  /** Натуральная схема темы (её `kind`) — то, что видит посетитель по умолчанию. */
  base: ColorTokens;
  /** Вторая схема — включается атрибутом data-scheme на <html>. */
  alt: ColorTokens;
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

/** Акцент набора в hex. */
export function brandHex(tokens: ColorTokens): string {
  return hslToHex(tokens.brandH, tokens.brandS, tokens.brandL);
}

/**
 * Акцент темы для схемы: натуральная схема — base, вторая — alt.
 * Значение уезжает в <meta name="theme-color"> и обновляется при переключении.
 */
export function schemeBrand(colors: ThemeColorSet, kind: string, scheme: string): string {
  return brandHex(scheme === kind ? colors.base : colors.alt);
}

export const themeColors: Record<string, ThemeColorSet> = {
  nordic: {
    // Натуральная схема — светлая: сайт по умолчанию отдаёт её.
    base: {
      brandH: 162, brandS: '55%', brandL: '30%', brandInk: '#ffffff',
      bg: '#f4f7f9', surface: '#ffffff', surface2: '#e7eef3',
      ink: '#0e1a20', inkSoft: '#50636e', line: '#d5e0e7',
      shadowColor: '210 25% 22%',
    },
    alt: {
      brandH: 162, brandS: '62%', brandL: '52%', brandInk: '#06231f',
      bg: '#0e1216', surface: '#171e25', surface2: '#1f2831',
      ink: '#e9eff4', inkSoft: '#9db0be', line: '#2a3541',
      shadowColor: '210 45% 3%',
    },
  },
};

