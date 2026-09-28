/**
 * Типы окружения сборки.
 *
 * PUBLIC_DEMO — единственный переключатель режима демо-стенда.
 * Значение 'on' включает панель настроек и демонстрационные пометки;
 * в прод-сборке переменная не задана, поэтому панель вырезается.
 */
interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly SITE: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly PUBLIC_DEMO?: string
  readonly PUBLIC_ANALYTICS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Алиас CSS-входа темы: на сборке подменяется на файл выбранной темы
 * (прод) или на сводный all.css со всеми темами (демо) — см. astro.config.mjs.
 */
declare module '@skin'
