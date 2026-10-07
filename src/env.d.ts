/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Показывать ли баннер cookie: включается вместе с аналитикой. */
  readonly PUBLIC_ANALYTICS?: string;
}

/**
 * Алиас CSS-входа темы: на сборке указывает на файл темы сайта
 * (см. astro.config.mjs).
 */
declare module '@skin';
