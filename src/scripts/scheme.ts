/**
 * Схема оформления (светлая / тёмная).
 *
 * Зачем отдельный модуль. «Как применить схему» должно быть ровно одно:
 * если каждый пишет сам в <html> и в localStorage, состояния разъезжаются
 * после первого же клика. Поэтому вся логика здесь, а остальной код
 * только просит применить схему.
 *
 * applyScheme делает то, что обязано быть согласованным:
 *   • ставит data-scheme на <html> — по нему работает вся тёмная вариация
 *     темы (generated-файл) и подписи обеих кнопок;
 *   • обновляет <meta name="theme-color"> — адресная строка телефона
 *     перекрашивается вместе со страницей, а не остаётся от прошлой схемы;
 *   • запоминает выбор в localStorage.
 *
 * Тот же ключ читает ранний inline-скрипт в Base.astro: он восстанавливает
 * схему до первой отрисовки, иначе у вернувшегося посетителя страница
 * успевала бы мигнуть схемой не из сохранённой.
 *
 * Это НЕ путать с каталогом scripts/ в корне репозитория: там инструменты
 * сборки на Node, здесь — код, который уезжает в браузер.
 */

export type Scheme = 'light' | 'dark';

/**
 * Ключ localStorage — единственное место, где живёт выбор
 * посетителя. Константа объявлена в src/scripts/keys.ts:
 * ранний inline-скрипт в Base.astro читает тот же ключ,
 * но не умеет импортировать, поэтому получает его через
 * define:vars.
 */
export { SCHEME_KEY } from './keys';
import { SCHEME_KEY } from './keys';

import { accentHex } from '../themes/brand';

/** Отбор значения схемы: всё, что не light/dark, схемой не является. */
export function asScheme(value: unknown): Scheme | null {
  return value === 'light' || value === 'dark' ? value : null;
}

/** Схема, которая действует сейчас: атрибут на <html> — источник правды. */
export function currentScheme(): Scheme {
  return asScheme(document.documentElement.dataset.scheme) ?? 'light';
}

/**
 * Цвет адресной строки браузера подгоняется под действующую схему.
 *
 * Акцент считается из токенов — тот же расчёт, что Base.astro
 * делает на сборке для начальной меты.
 */
function syncThemeMeta(scheme: Scheme): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = accentHex(scheme);
}

/**
 * Применяет схему без запоминания: для автоматики, которая
 * не должна «запоминать» себя за посетителя.
 */
function applyTransientScheme(scheme: Scheme): Scheme {
  document.documentElement.dataset.scheme = scheme;
  syncThemeMeta(scheme);
  return scheme;
}

/**
 * Применяет схему и запоминает выбор посетителя.
 * Возвращает её же — удобно в цепочках вызовов.
 */
export function applyScheme(scheme: Scheme): Scheme {
  applyTransientScheme(scheme);

  try {
    window.localStorage.setItem(SCHEME_KEY, scheme);
  } catch {
    /* приватный режим: выбор не запоминаем, но применяем */
  }

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
  const switchButton = document.querySelector<HTMLElement>('[data-scheme-switch]');
  if (!switchButton) return;

  switchButton.addEventListener('click', () => {
    applyScheme(currentScheme() === 'dark' ? 'light' : 'dark');
  });

  // Ранний inline-скрипт (Base.astro) мог включить схему по системной
  // настройке, когда мета в <head> ещё не была разобрана, — синхронизируем.
  syncThemeMeta(currentScheme());

  /**
   * Смена системной схемы на лету — только пока посетитель не сделал
   * явный выбор: applyScheme пишет его в localStorage, и дальше его слово
   * окончательно. Саму схему здесь ставим напрямую, минуя applyScheme,
   * чтобы автоматика не «запоминала» себя за посетителя.
   */
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', (event) => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(SCHEME_KEY);
    } catch {
      /* приватный режим: сохранённого выбора нет */
    }
    if (asScheme(saved)) return;

    // Системная настройка меняется, пока посетитель не сделал
    // явный выбор: applyScheme писал бы его в localStorage,
    // и автоматика превратилась бы в одноразовую — поэтому
    // применяем схему без запоминания.
    applyTransientScheme(event.matches ? 'dark' : 'light');
  });
}
