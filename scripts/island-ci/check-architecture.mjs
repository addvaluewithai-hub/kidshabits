#!/usr/bin/env node
/**
 * KidsHabits v2 production source guardrails.
 * Lightweight checks, not a replacement for TypeScript, ESLint, architecture
 * contract tests or human review. Skips cleanly when docs-only (no src/).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, relative, sep, dirname } from 'node:path';

const root = process.cwd();
const src = resolve(root, 'src');
const warningLineLimit = 220;
const escalationLineLimit = 350;
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const ignoredFolders = new Set([
  'node_modules', 'vendor', 'generated', 'dist', 'build', 'coverage',
  '__generated__', '__snapshots__',
]);
const reported = [];
let examined = 0;
let warnings = 0;
let errors = 0;

function log(kind, file, message) {
  const line = `${kind}: ${file}: ${message}`;
  reported.push(line);
  if (kind === 'ERROR') errors++;
  else warnings++;
}

function shouldInspect(path) {
  if (/\.(test|spec|d)\.(ts|tsx|js|jsx)$/.test(path)) return false;
  if (/\.generated\./.test(path)) return false;
  return true;
}

function walk(folder) {
  for (const item of readdirSync(folder, { withFileTypes: true })) {
    if (item.isDirectory()) {
      if (!ignoredFolders.has(item.name)) walk(resolve(folder, item.name));
    } else if (item.isFile()) {
      const path = resolve(folder, item.name);
      const ext = '.' + item.name.split('.').pop();
      if (extensions.has(ext) && shouldInspect(path)) checkFile(path);
    }
  }
}

function staticImports(code) {
  const sources = [];
  // Ordinary ES import/export declarations. Dynamic imports require review.
  const pattern = /\b(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  for (const match of code.matchAll(pattern)) {
    const statement = match[0];
    // Avoid accidentally spanning far into an unrelated statement.
    if (statement.split('\n').length <= 6) sources.push(match[1]);
  }
  return sources;
}

function isForbiddenPath(source, file) {
  const rel = relative(src, file).split(sep).join('/');
  if (!rel.startsWith('domain/') && !rel.startsWith('content/')) return false;
  if (/^(?:react|react-dom|phaser)(?:\/|$)/.test(source)) return true;
  if (/^(?:@\/?|~\/)?(?:app|world|media|infrastructure)(?:\/|$)/.test(source)) return true;
  if (source.startsWith('.')) {
    const absolute = resolve(dirname(file), source);
    const target = relative(src, absolute).split(sep).join('/');
    if (/^(?:app|world|media|infrastructure)(?:\/|$)/.test(target)) return true;
  }
  return false;
}

function checkFile(file) {
  examined++;
  const relativeFile = relative(root, file).split(sep).join('/');
  const code = readFileSync(file, 'utf8');
  const lines = code.replace(/\r\n?/g, '\n').split('\n').length;
  if (lines > escalationLineLimit) {
    log('WARN', relativeFile, `${lines} lines; review cohesion and responsibilities, not a LOC hard limit.`);
  } else if (lines >= warningLineLimit) {
    log('WARN', relativeFile, `${lines} lines; review against preferred 50–180 line range.`);
  }
  for (const source of staticImports(code)) {
    if (isForbiddenPath(source, file)) {
      log('ERROR', relativeFile, `domain/content must not depend on presentation or infrastructure: ${source}`);
    }
  }
}

if (existsSync(src)) walk(src);
else console.log('SKIP source architecture guard: no src/ yet (documentation-only branch). This is NOT an app pass.');
for (const line of reported) console.log(line);
console.log(`Architecture source scan: files=${examined}, warnings=${warnings}, errors=${errors}`);
if (errors) process.exitCode = 1;
