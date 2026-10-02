# Демо-стенд

Стенд: **https://pglyan.github.io/stasyclean/**. Заказчик переключает тему,
палитру, схему и параметры прямо в браузере; выбор сохраняется в localStorage.
`?panel=0` открывает чистый вид без панели.

## Как устроено

- Сборка: `npm run build:demo` (`PUBLIC_DEMO=on`, `base=/stasyclean`, `dist-demo/`).
- Панель (`src/components/demo/DemoPanel.astro`) рендерится только в демо:
  `Base.astro` импортирует её под константным условием, в прод она не попадает.
- В демо подключаются все темы (`src/themes/all.css`), в прод — только выбранная.
- Схема переключается тремя способами: кнопка в шапке (есть и в проде),
  плавающая кнопка стенда, группа «Схема» в панели. Применяет схему одна
  функция `applyScheme` (`src/scripts/scheme.ts`), панель слушает `SCHEME_EVENT`.
- В тёмной схеме палитры скрыты: цвета даёт вариация схемы, не палитра.

## От стенда к проду

1. Заказчик жмёт «Скопировать настройки» в панели.
2. `npm run design -- apply settings.json` — применить к `design.config.json`.
3. `npm run build:prod` — в прод уедет только выбранное.

## Публикация

Push в `main` запускает `.github/workflows/deploy-demo.yml`:
`npm ci` → `sync-fonts` → `build:demo` → `check:colors` → Pages
(артефакт `dist-demo`; Jekyll отключён публикацией артефактом, каталог
`_a/` и `404.html` работают штатно). Вручную — кнопка Run workflow.

Разовая настройка: источник Pages — «GitHub Actions», демо закрыто от
индексации (`Disallow: /`).
