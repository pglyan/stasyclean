/**
 * Классы корня блока-секции.
 *
 * Один helper вместо шаблона `section ${surface ? 'section--surface' : ''}`
 * в каждом блоке: если корень секции когда-нибудь поменяется
 * (добавится модификатор ритма, класс reveal-контейнера),
 * это правится в одной точке.
 */

export function sectionClass(surface?: boolean): string {
  return surface ? 'section section--surface' : 'section';
}
