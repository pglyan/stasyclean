#!/usr/bin/env node
/**
 * Печатает CSS переменных темы из её цветовых токенов
 * (src/themes/tokens.ts → src/themes/generated/nordic.css).
 *
 * Единственный источник цвета — TS-токены, поэтому CSS и <meta theme-color>
 * не могут разойтись. Запускается в dev и в сборке (см. package.json).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { darkTokens, lightTokens } from '../src/themes/tokens.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = join(root, 'src', 'themes', 'generated', 'nordic.css');

/** @param {import('../src/themes/tokens.ts').ColorTokens} tokens */
function block(tokens) {
  const lines = [
    `  --brand-h: ${tokens.brandH};`,
    `  --brand-s: ${tokens.brandS};`,
    `  --brand-l: ${tokens.brandL};`,
    `  --brand-ink: ${tokens.brandInk};`,
  ];
  if (tokens.brandStrong) lines.push(`  --brand-strong: ${tokens.brandStrong};`);
  lines.push(
    `  --bg: ${tokens.bg};`,
    `  --surface: ${tokens.surface};`,
    `  --surface-2: ${tokens.surface2};`,
    `  --ink: ${tokens.ink};`,
    `  --ink-soft: ${tokens.inkSoft};`,
    `  --line: ${tokens.line};`,
    `  --danger: ${tokens.danger};`,
    `  --success: ${tokens.success};`,
  );
  if (tokens.shadowColor) lines.push(`  --shadow-color: ${tokens.shadowColor};`);
  return lines.join('\n');
}

const css =
  `:root {\n  color-scheme: light;\n${block(lightTokens)}\n}\n` +
  `\n[data-scheme='dark'] {\n  color-scheme: dark;\n${block(darkTokens)}\n}\n`;

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, css);
console.log('Токены темы сгенерированы: src/themes/generated/nordic.css');
