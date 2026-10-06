/**
 * Типы окружения сборки.
 */
interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly SITE: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly PUBLIC_ANALYTICS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Алиас CSS-входа темы: на сборке указывает на файл темы сайта
 * (см. astro.config.mjs).
 */
declare module '@skin'
