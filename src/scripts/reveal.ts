/**
 * Появление блоков при прокрутке (staggered reveal).
 *
 * Принцип безопасности: без скрипта контент виден всегда. Класс .reveal
 * ставит сам скрипт — и только на элементы ниже первого кадра, поэтому
 * CSS прячет ровно то, что гарантированно будет показано наблюдателем.
 * При prefers-reduced-motion скрипт не делает ничего.
 *
 * Цели выбирает разметка: атрибут data-reveal на элементе —
 * явное решение автора секции, а не догадка скрипта по классам.
 *
 * Каскад: соседи одного контейнеры появляются с шагом, но не дольше
 * 240 мс — хвост сетки не должен ждать дольше, чем её листают.
 */

/** Что появляется: элементы, разметка которых попросила об этом. */
const SELECTOR = '[data-reveal]';
const STAGGER_MS = 70;
const STAGGER_MAX_MS = 240;

let initialized = false;

export function initReveal(): void {
  if (initialized) return;
  initialized = true;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
  if (!targets.length) return;

  try {
    // Задержка каскада — позиция элемента внутри его родителя.
    const delays = new Map<HTMLElement, number>();
    const counters = new Map<HTMLElement, number>();
    for (const target of targets) {
      const parent = target.parentElement;
      const index = (parent && counters.get(parent)) || 0;
      delays.set(target, Math.min(index * STAGGER_MS, STAGGER_MAX_MS));
      if (parent) counters.set(parent, index + 1);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.style.animationDelay = `${delays.get(target) ?? 0}ms`;
          target.classList.add('is-revealed');
          observer.unobserve(target);
        }
      },
      // Нижняя граница с запасом: анимация стартует чуть до входа в кадр.
      { rootMargin: '0px 0px -8% 0px' },
    );

    for (const target of targets) {
      // В первом кадре при загрузке — показываем сразу: иначе верх страницы
      // успевает мигнуть скрытым до срабатывания наблюдателя.
      if (target.getBoundingClientRect().top < window.innerHeight) {
        target.classList.add('is-revealed');
      } else {
        target.classList.add('reveal');
        observer.observe(target);
      }
    }
  } catch {
    // Сбой между add('reveal') и показом оставил бы элементы невидимыми
    // навсегда — обещание «без JS всё видимо» держим при любой ошибке.
    for (const target of targets) target.classList.remove('reveal');
  }
}
