#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { themePresets } from '../src/data/themes.ts';
import { themeColors } from '../src/themes/tokens.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'themes', 'generated');

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
  );
  if (tokens.shadowColor) lines.push(`  --shadow-color: ${tokens.shadowColor};`);
  return lines.join('\n');
}

await mkdir(outDir, { recursive: true });

for (const preset of themePresets) {
  const colors = themeColors[preset.id];
  if (!colors) throw new Error(`Нет токенов для темы «${preset.id}» (src/themes/tokens.ts).`);
  const altScheme = preset.kind === 'dark' ? 'light' : 'dark';
  let css = `[data-skin='${preset.id}'] {\n  color-scheme: ${preset.kind};\n${block(colors.base)}\n}\n`;
  for (const [pid, tokens] of Object.entries(colors.palettes)) {
    css += `\n[data-skin='${preset.id}'][data-palette='${pid}'] {\n${block(tokens)}\n}\n`;
  }
  css += `\n[data-skin='${preset.id}'][data-scheme='${altScheme}'] {\n  color-scheme: ${altScheme};\n${block(colors.alt)}\n}\n`;
  await writeFile(join(outDir, `${preset.id}.css`), css);
}

console.log(`Токены тем сгенерированы: ${themePresets.length} файлов в src/themes/generated/`);
