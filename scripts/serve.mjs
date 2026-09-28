#!/usr/bin/env node
/**
 * Локальный просмотр прод-сборки.
 *
 * Нужен, чтобы показать заказчику «как на хостинге» ещё до заливки:
 * отдаёт dist/ так же, как это делал бы nginx — со слэшем в конце адреса,
 * с правильными MIME-типами и страницей 404.
 *
 * Запуск: node scripts/serve.mjs [каталог] [порт]
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const target = resolve(process.argv[2] ?? 'dist');
const port = Number(process.argv[3] ?? 8080);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
};

/** Отдаём каталог как index.html, как это делает nginx с index-директивой. */
async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const direct = join(target, clean);

  // Защита от выхода за пределы каталога сборки
  if (!direct.startsWith(target)) return null;

  const candidates = clean.endsWith('/')
    ? [join(direct, 'index.html')]
    : [direct, join(direct, 'index.html')];

  for (const candidate of candidates) {
    const info = await stat(candidate).catch(() => null);
    if (info?.isFile()) return candidate;
  }

  return null;
}

const server = createServer(async (request, response) => {
  const file = await resolveFile(request.url ?? '/');

  if (!file) {
    const fallback = join(target, '404.html');
    const body = await readFile(fallback).catch(() => 'Not found');
    response.writeHead(404, { 'Content-Type': MIME['.html'] });
    response.end(body);
    return;
  }

  const body = await readFile(file);
  response.writeHead(200, {
    'Content-Type': MIME[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': file.includes('/_a/') ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  response.end(body);
});

server.listen(port, () => {
  console.log(`Прод-сборка из ${target}`);
  console.log(`Откройте http://localhost:${port}/`);
  console.log('Остановить: Ctrl+C');
});
