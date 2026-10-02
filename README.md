# StasyClean — сайт клининговой компании

Статический сайт клининговой службы в Белграде: три языка (сербский,
английский, русский), демо-стенд для выбора стиля и прод-сборка для nginx.

- **Прод**: `https://stasyclean.com` — только выбранная тема, её палитры и шрифты
- **Демо-стенд**: GitHub Pages, с панелью переключения тем, палитр, схем и параметров

## Быстрый старт

```bash
npm ci
node scripts/sync-fonts.mjs   # woff2 из Fontsource в src/assets (в git не лежат)

npm run dev                   # разработка с демо-панелью
npm run build:demo            # демо-стенд → dist-demo/ (base=/stasyclean)
npm run build:prod            # прод-сборка → dist/     (base=/)
npm run check:colors          # контраст всех тем, палитр и схем
npm run check                 # типы (astro check)
```

Токены тем (`src/themes/generated/`) и OG-картинки (`public/og/`)
генерируются автоматически при `dev`/`build`, в git не лежат.

## Режимы сборки

| | `build:prod` | `build:demo` |
|---|---|---|
| Каталог | `dist/` | `dist-demo/` |
| Базовый путь | `/` | `/stasyclean/` |
| Панель настроек | нет | есть |
| `robots.txt` | индексация открыта | `Disallow: /` |

Режим задаёт `PUBLIC_DEMO=on`. Выбор темы — `design.config.json`
(`npm run design -- set theme=mila`). В прод попадает CSS и шрифты
только выбранной темы (алиас `@skin` в `astro.config.mjs`).

## Где что менять

| Что нужно | Файл |
|---|---|
| Телефон, email, Telegram, реквизиты, адрес | `src/data/site.ts` |
| Цены и тарифы | `src/data/prices.ts` |
| Услуги, чек-листы, FAQ, отзывы | `src/data/services/`, `src/data/checklists/`, `src/data/faq.ts`, `src/data/reviews.ts` |
| Выбор темы/палитры/схемы для прода | `design.config.json` (`npm run design`) |
| Цвета темы, палитр и схем | `src/themes/tokens.ts` |
| Характер темы (формы, декор, правила) | `src/themes/<id>/theme.css` |
| Реестр тем (имена, умолчания, шрифты) | `src/data/themes.ts` |
| Слова интерфейса, адреса страниц | `src/i18n/ui/`, `src/i18n/routes.ts` |

## Доки

- `docs/themes.md` — как устроены темы и как добавить новую
- `docs/demo.md` — демо-стенд, панель, публикация на GitHub Pages
- `docs/ops.md` — выкладка прода на nginx, разовые настройки
- `deploy/` — конфиг nginx

## Что требуется от клиента

1. Юридические реквизиты: наименование, адрес, PIB, матични број.
2. Телефон и email.
3. Фотографии объектов «до и после».
4. Настоящие отзывы (сейчас демонстрационные тексты).
5. Подтверждение районов выезда и списка услуг.
6. Проверка сербского и английского переводов носителем языка.
7. Утверждение юридических текстов юристом.
