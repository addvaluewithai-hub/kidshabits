#!/usr/bin/env node
/**
 * Island v2 planning/status validation — no external dependencies.
 * This job does NOT inspect screenshots or claim a game was tested.
 */
import assert from 'node:assert/strict';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = path => readFileSync(join(root, path), 'utf8');
const files = [
  'project/island-v2/README.md',
  'project/island-v2/PLAN_AR.md',
  'project/island-v2/PRODUCT_BLUEPRINT.md',
  'project/island-v2/NOVA_COMPANION.md',
  'project/island-v2/FIRST_10_DAYS.md',
  'project/island-v2/SESSION_PLAN_25.md',
  'project/island-v2/STATUS.md',
  'project/island-v2/CI_AND_VISUAL_QA.md',
  'project/island-v2/ROADMAP_AND_ACCEPTANCE.md',
  'scripts/island-ci/visual-smoke.mjs',
  '.github/workflows/island-production.yml',
];

for (const path of files) {
  assert.ok(existsSync(join(root, path)), 'Missing required Island v2 file: ' + path);
  assert.ok(read(path).length > 150, 'Required file seems empty: ' + path);
}

const plan = read('project/island-v2/SESSION_PLAN_25.md');
const status = read('project/island-v2/STATUS.md');

for (let i = 1; i <= 25; i++) {
  const n = String(i).padStart(2, '0');
  assert.ok(plan.includes('| **' + n + '** |'), 'Plan is missing explicit session ' + n);
}

const completeMatch = status.match(/\*\*Completed implementation sessions:\*\*\s*\*\*(\d+)\s*\/\s*25\*\*/);
const activeMatch = status.match(/\*\*Active session:\*\*\s*\*\*(\d{2})\s*\/\s*25/);
assert.ok(completeMatch, 'STATUS must state completed implementation sessions out of 25.');
assert.ok(activeMatch, 'STATUS must state active session out of 25.');
const completed = Number(completeMatch[1]);
const active = Number(activeMatch[1]);
assert.ok(completed >= 0 && completed <= 25, 'Invalid completed session count.');
assert.equal(active, Math.min(completed + 1, 25), 'Active session must be the next uncompleted one.');

const appPieces = ['package.json', 'index.html', 'src'];
const present = appPieces.filter(path => existsSync(join(root, path)));
assert.ok(present.length === 0 || present.length === appPieces.length,
  'Partial app scaffold found (' + present.join(', ') + '): need package.json + index.html + src together.');
const hasApp = present.length === appPieces.length;
if (hasApp) {
  const pkg = JSON.parse(read('package.json'));
  assert.ok(pkg.scripts && typeof pkg.scripts.build === 'string', 'Production app needs npm run build.');
}

const summary = [
  '## Island v2 baseline validation',
  '- 25 individual planned sessions: checked',
  '- STATUS active session: ' + String(active).padStart(2, '0') + ' / 25',
  '- Implementation sessions completed: ' + completed + ' / 25',
  '- Runnable app scaffold present: ' + (hasApp ? 'YES — visual CI must execute' : 'NO — visual CI will SKIP (NOT A PASS)'),
].join('\n');

console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, 'has_app=' + String(hasApp) + '\n');
