/**
 * Схема оформления (светлая / тёмная) — механизм САЙТА, а не демо-стенда.
 *
 * Зачем отдельный модуль. Схему переключают двое: кнопка в шапке (она есть
 * и в проде, и в демо) и быстрый переключатель демо-панели. Если бы каждая
 * сама писала в <html> и в localStorage, состояния кнопок разъехались бы
 * после первого же клика. Поэтому «как применить схему» — ровно одна
 * функция здесь, а все остальные только просят её об этом.
 *
 * applyScheme делает то, что обязано быть согласованным:
 *   • ставит data-scheme на <html> — по нему работает вся тёмная вариация
 *     темы (src/themes/<id>/scheme.css) и подписи обеих кнопок;
 *   • обновляет <meta name="theme-color"> — адресная строка телефона
 *     перекрашивается вместе со страницей, а не остаётся от прошлой схемы;
 *   • запоминает выбор в localStorage — ключ без слова demo, поэтому он
 *     работает и в прод-сборке (иначе check-clean счёл бы его демо-следом);
 *   • сообщает о смене событием SCHEME_EVENT — демо-панель слушает его и
 *     синхронизирует свои группы (свотчи тем, доступность палитры).
 *
 * Тот же ключ читает ранний inline-скрипт в Base.astro: он восстанавливает
 * схему до первой отрисовки, иначе у вернувшегося посетителя страница
 * успевала мигнуть светлой темой из design.config.json.
 *
 * Это НЕ путать с каталогом scripts/ в корне репозитория: там инструменты
 * сборки на Node, здесь — код, который уезжает в браузер.
 */

export type Scheme = 'light' | 'dark';

/** Ключ localStorage — единственное место, где живёт выбор посетителя. */
export const SCHEME_KEY = 'stasyclean:scheme';

/** Событие о смене схемы: даёт панели шанс синхронизироваться. */
export const SCHEME_EVENT = 'stasyclean:schemechange';

/** Отбор значения схемы: всё, что не light/dark, схемой не является. */
export function asScheme(value: unknown): Scheme | null {
  return value === 'light' || value === 'dark' ? value : null;
}

/** Схема, которая действует сейчас: атрибут на <html> — источник правды. */
export function currentScheme(): Scheme {
  return asScheme(document.documentElement.dataset.scheme) ?? 'light';
}

/**
 * Применяет схему. Возвращает её же — удобно в цепочках вызовов.
 */
export function applyScheme(scheme: Scheme): Scheme {
  document.documentElement.dataset.scheme = scheme;

  /**
   * Акцент для адресной строки поставляет кнопка шапки: у неё лежат оба
   * цвета (data-color-light / data-color-dark) из паспорта темы — те же
   * значения, что Base.astro положил в мету на сборке.
   *
   * В демо это не последнее слово: панель после смены схемы перекрашивает
   * мету сама (syncThemeColor), потому что выбранная там тема может быть
   * уже другой.
   */
  const switchButton = document.querySelector<HTMLElement>('[data-scheme-switch]');
  const accent = switchButton?.dataset[scheme === 'dark' ? 'colorDark' : 'colorLight'];
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta && accent) meta.content = accent;

  try {
    window.localStorage.setItem(SCHEME_KEY, scheme);
  } catch {
    /* приватный режим: выбор не запоминаем, но применяем */
  }

  document.dispatchEvent(new CustomEvent(SCHEME_EVENT, { detail: { scheme } }));

  return scheme;
}

/**
 * Подключает кнопку шапки.
 *
 * Состояние кнопки в JS не дублируется: иконку и подпись показывает CSS по
 * data-scheme на <html>, поэтому обработчику достаточно применить
 * противоположную схему. Без JS кнопка остаётся на месте и выглядит
 * правильно — просто не переключает.
 */
export function initScheme(): void {
  const switchButton = document.querySelector<HTMLButtonElement>('[data-scheme-switch]');
  if (!switchButton) return;

  switchButton.addEventListener('click', () => {
    applyScheme(currentScheme() === 'dark' ? 'light' : 'dark');
  });
}