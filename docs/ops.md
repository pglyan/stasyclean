# Прод и разовые настройки

## Выкладка на nginx

Сайт статический: на сервере нужен только nginx и содержимое `dist/`
(`index.html`, `_a/` — CSS/шрифты с хешем, страницы `cene/…`, `en/`, `ru/`,
`404.html`, `robots.txt`, `sitemap-*.xml`).

```bash
npm ci
node scripts/sync-fonts.mjs
npm run build
npm run check:colors

rsync -avz --delete dist/ user@server:/var/www/stasyclean/
sudo cp deploy/nginx.conf /etc/nginx/sites-available/stasyclean
sudo ln -sf /etc/nginx/sites-available/stasyclean /etc/nginx/sites-enabled/stasyclean
sudo nginx -t && sudo systemctl reload nginx
```

`deploy/nginx.conf` уже учитывает: gzip, годовой кеш `/_a/` (immutable),
`no-cache` для HTML, `try_files` для `/cene` и `/cene/`, `error_page 404`,
CSP/HSTS, 301 с www/http на `https://stasyclean.com`, 301 со старых
кириллических адресов.

Проверка после переноса: `/`, `/en/`, `/ru/`, `/ru/uslugi/generalnaya-uborka/`,
старая `/цены` → 301 на `/ru/ceny/`, несуществующий адрес → 404,
`robots.txt` с картой сайта, заголовки CSP/HSTS.

Первичная настройка один раз: DNS (A-запись, `www` — CNAME), TLS через
certbot (пути вместо `/etc/letsencrypt/live/stasyclean.com/`), добавить
`sitemap-index.xml` в Search Console, вписать настоящие реквизиты
в `src/data/site.ts` и пересобрать.

## Разовое для репозитория

Если push отклоняется с `GH007` (приватная почта в `user.email`), у
репозитория зафиксирован noreply-адрес:

```bash
git config user.email '189350212+pglyan@users.noreply.github.com'
```
