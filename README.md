# StasyClean — сайт клининговой компании

Статический сайт клининговой службы в Белграде: три языка (сербский,
английский, русский), единое оформление и сборка для nginx.

- **Сайт**: `https://stasyclean.com` — светлая и тёмная схема,
  оформление запечено в CSS (`src/styles/params.css`, `src/themes/nordic/`)

## Быстрый старт

```bash
npm ci
node scripts/sync-fonts.mjs   # woff2 из Fontsource в src/assets (в git не лежат)

npm run dev                   # разработка
npm run build                 # сборка → dist/
npm run preview               # локальный просмотр сборки
npm run lint                  # eslint + stylelint
npm run format                # prettier по всему проекту
npm run check                 # типы (astro check)
npm run check:colors          # контраст цветов обеих схем
npm run check:size            # бюджет веса CSS/JS (после build)
```

Токены тем (`src/themes/generated/`) и OG-картинки (`public/og/`)
генерируются автоматически при `dev`/`build`, в git не лежат.

## Предпросмотр на GitHub Pages

Push в `main` запускает `.github/workflows/deploy-pages.yml`: та же
прод-сборка, но с `SITE_URL=https://pglyan.github.io` и
`BASE_PATH=/stasyclean/`, публикуется на
**https://pglyan.github.io/stasyclean/**. Предпросмотр закрыт от индексации
(robots.txt), контент и оформление совпадают с продом.

## Где что менять

| Что нужно                                                                      | Файл                                                                                   |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Телефон, email, Telegram, реквизиты, адрес                                     | `src/data/site.ts`                                                                     |
| Цены и тарифы                                                                  | `src/data/prices.ts`                                                                   |
| Услуги, чек-листы, FAQ, отзывы                                                 | `src/data/services/`, `src/data/checklists/`, `src/data/faq.ts`, `src/data/reviews.ts` |
| Дополнительные услуги, шаги работы, УТП                                        | `src/data/extras.ts`, `src/data/steps.ts`                                              |
| Юридические тексты (три локали)                                                | `src/data/legal/`                                                                      |
| Состав страниц (какие блоки и где)                                             | `src/data/pages.ts`                                                                    |
| Цвета (светлая/тёмная схема)                                                   | `src/themes/tokens.ts`                                                                 |
| Запечённые параметры стиля (шрифты, плотность, карточки, кнопки, ритм секций…) | `src/styles/params.css`                                                                |
| Характер темы (радиус, собственные правила)                                    | `src/themes/nordic/theme.css`                                                          |
| Данные темы (имя, натуральная схема, шрифты)                                   | `src/data/themes.ts`                                                                   |
| Шрифты сайта                                                                   | `src/fonts/`, вход темы — `src/themes/entries/nordic.ts`                               |
| Слова интерфейса, адреса страниц                                               | `src/i18n/ui/`, `src/i18n/routes.ts`                                                   |

## Доки

- `docs/themes.md` — как устроены оформление, цвета и схемы
- `docs/i18n.md` — языки, адреса, добавление страницы или локали
- `docs/data.md` — модели контента (`site.ts`, `prices.ts`, `legal/`)
- `docs/ops.md` — выкладка прода на nginx, разовые настройки
- `deploy/` — конфиг nginx

## Что требуется от клиента

1. Юридические реквизиты: наименование, адрес, PIB, матични број.
2. Телефон и email.
3. Фотографии объектов «до и после».
4. Настоящие отзывы (сейчас тексты-заготовки).
5. Подтверждение районов выезда и списка услуг.
6. Проверка сербского и английского переводов носителем языка.
7. Утверждение юридических текстов юристом.
