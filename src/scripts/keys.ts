/**
 * Ключи localStorage — одна точка для всех, кто читает или пишет выбор
 * посетителя. Раньше литерал 'stasyclean:scheme' жил и в scheme.ts, и в
 * раннем inline-скрипте Base.astro: смена ключа в одном месте молча
 * разрывала восстановление схемы. Inline-скрипт не умеет импортировать,
 * поэтому Base передаёт константу через define:vars.
 */
export const SCHEME_KEY = 'stasyclean:scheme';
export const COOKIE_CONSENT_KEY = 'stasyclean:cookie-consent';
