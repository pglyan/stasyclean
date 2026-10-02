# Темы

Тема — целый стиль оформления: типографика, формы, ритм секций, фон,
декор. Палитра — набор цветов внутри темы, схема — светлая/тёмная вариация.

## Из чего состоит тема

| Часть | Файл | Что там |
|---|---|---|
| Цвета | `src/themes/tokens.ts` | base-набор, alt-схема, палитры — единственный источник цветов |
| Характер | `src/themes/<id>/theme.css` | только сигнатурные правила (формы, декор); цвета запрещены, только `color-mix()` от переменных |
| Реестр | `src/data/themes.ts` | имена, `kind`, умолчания параметров, доступные шрифты и палитры |
| Шрифты | `src/themes/entries/<id>.ts` | какие семейства везёт тема (они же попадают в прод) |

Добавление темы — 5 шагов:

1. Запись в `themeColors` (`tokens.ts`): `base`, `alt`, палитры.
2. `src/themes/<id>/theme.css` по образцу соседней (первая строка — `@import '../generated/<id>.css'`).
3. ПреSET в `src/data/themes.ts` (`defaults`, `available`).
4. `src/themes/entries/<id>.ts` (шрифты из `available`).
5. Строка в `src/themes/all.css`.

Свотчи для панели и `theme-color` выводятся из токенов (`swatchOf`,
`schemeBrand`), дублировать hex не нужно.

## Как это собирается

`scripts/gen-theme-tokens.mjs` генерирует `src/themes/generated/<id>.css`
(блоки `[data-skin]`, `[data-palette]`, `[data-scheme]`) — запускается
в `dev`/`build`, в git не лежит. `theme.css` подключает свой файл,
поэтому в прод попадает только выбранная тема (алиас `@skin`).

## Параметры оформления

Сквозные настройки (`design.config.json`) становятся атрибутами на `<html>`
(`data-card`, `data-density`, …), `src/styles/params.css` превращает их
в переменные. Значения по умолчанию — в `defaults` темы, `null` в конфиге
означает «как в теме».

Выбор для прода фиксируется так:

```bash
npm run design                     # текущий выбор
npm run design -- list             # список тем
npm run design -- set theme=mila palette=peach scheme=dark
npm run check:colors               # контраст всех наборов
```

## Правила

1. Палитра и схема меняют только цвета, не формы и шрифты.
2. В `theme.css` нет литеральных цветов — только `color-mix()` от переменных.
3. Пороги контраста: `ink/bg ≥ 8`, `ink-soft ≥ 4.5`, ссылки и текст на акценте `≥ 4.6`.
