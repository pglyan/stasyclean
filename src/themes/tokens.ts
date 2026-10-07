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
  /** Ошибка валидации: текст сообщения об ошибке в форме. */
  danger: string;
  /** Успешное действие: подтверждение отправки заявки. */
  success: string;
  shadowColor?: string;
}

export interface ThemeColorSet {
  /** Натуральная схема темы (её `kind`) — то, что видит посетитель по умолчанию. */
  base: ColorTokens;
  /** Вторая схема — включается атрибутом data-scheme на <html>. */
  alt: ColorTokens;
}

export const themeColors: Record<string, ThemeColorSet> = {
  nordic: {
    // Натуральная схема — светлая: сайт по умолчанию отдаёт её.
    base: {
      brandH: 162,
      brandS: '55%',
      brandL: '30%',
      brandInk: '#ffffff',
      bg: '#f4f7f9',
      surface: '#ffffff',
      surface2: '#e7eef3',
      ink: '#0e1a20',
      inkSoft: '#50636e',
      // Контурная линия: ≥3:1 к фону и подложке (WCAG 1.4.11) — границы
      // контейнеров должны быть видимы, а не подразумеваться (check:colors).
      line: '#788d9b',
      danger: '#c0392b',
      success: '#2e7d4f',
      shadowColor: '210 25% 22%',
    },
    alt: {
      brandH: 162,
      brandS: '62%',
      brandL: '52%',
      brandInk: '#06231f',
      bg: '#0e1216',
      surface: '#171e25',
      surface2: '#1f2831',
      ink: '#e9eff4',
      inkSoft: '#9db0be',
      // См. base.line: та же норма видимости контура на тёмной схеме.
      line: '#63707c',
      danger: '#e77a6a',
      success: '#7fd0a0',
      shadowColor: '210 45% 3%',
    },
  },
};
