# Как выложить сайт на хостинг

Сайт полностью статический. На сервере не нужны ни Node.js, ни PHP,
ни база данных — только nginx и файлы сборки.

## Что переносим

Из прод-сборки (`npm run build:prod`, каталог `dist/`) на сервер
копируется **всё содержимое** каталога:

```
dist/
├─ index.html                 главная (сербский, корень домена)
├─ _a/                        CSS и шрифты с хешем в имени
├─ cene/  usluge/  o-nama/    страницы сербской версии
├─ en/                        английская версия
├─ ru/                        русская версия
├─ 404.html
├─ robots.txt
└─ sitemap-index.xml + sitemap-0.xml
```

## Шаги

```bash
# 1. На локальной машине собрать прод-версию
npm ci
node scripts/sync-fonts.mjs
npm run build:prod
node scripts/check-i18n.mjs dist
node scripts/check-size.mjs dist

# 2. Скопировать содержимое dist/ на сервер
rsync -avz --delete dist/ user@server:/var/www/stasyclean/

# 3. Подключить конфиг nginx
sudo cp deploy/nginx.conf /etc/nginx/sites-available/stasyclean
sudo ln -sf /etc/nginx/sites-available/stasyclean /etc/nginx/sites-enabled/stasyclean
sudo nginx -t && sudo systemctl reload nginx
```

## Что уже учтено в `nginx.conf`

| Вопрос | Решение |
|---|---|
| Сжатие | gzip для HTML, CSS, JS, JSON, XML и SVG; блок brotli закомментирован |
| Кеш ассетов | `/_a/` — год, `immutable` (в имени файла хеш содержимого) |
| Кеш HTML | `no-cache, must-revalidate`: цены и контент меняются |
| Адреса | `try_files $uri $uri/index.html $uri/` — работают и `/cene`, и `/cene/` |
| 404 | `error_page 404 /404.html` со страницей на трёх языках |
| Безопасность | CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` |
| www и http | 301 на `https://stasyclean.com` |
| Старые адреса | 301 с кириллических URL прежней версии сайта на новые |

## Проверка после переноса

1. Все три языка: `/`, `/en/`, `/ru/`.
2. Страница услуги: `/ru/uslugi/generalnaya-uborka/`.
3. Старая ссылка: `/цены` должна отдать 301 на `/ru/ceny/`.
4. Несуществующий адрес: `/ru/такой-страницы-нет` → страница 404, код 404.
5. `https://stasyclean.com/robots.txt` — в нём указан адрес карты сайта.
6. Заголовки: `curl -I https://stasyclean.com/` → CSP и HSTS на месте.

## Первичная настройка, которую нужно сделать один раз

1. **DNS**: A-запись домена на IP сервера, `www` — CNAME на основной домен.
2. **TLS**: выпустить сертификат Let's Encrypt (`certbot`) и прописать пути
   в `nginx.conf` вместо `/etc/letsencrypt/live/stasyclean.com/`.
3. **Карта сайта**: добавить `sitemap-index.xml` в Google Search Console.
4. **Реквизиты**: заменить заглушки в `src/data/site.ts` (`legal.pib`, `legal.mb`,
   `legal.address`, `phone`, `email`) на настоящие и пересобрать сайт.
