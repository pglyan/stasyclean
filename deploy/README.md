# Выкладка на хостинг

Полная инструкция — `docs/ops.md` (шаги, проверка, первичная настройка).

Здесь лежит `nginx.conf` для `https://stasyclean.com`: gzip, кеш `/_a/`
на год, `try_files`, `error_page 404`, CSP/HSTS, 301 с www/http и со
старых кириллических адресов.
