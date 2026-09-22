import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

// Character engine foundation + Live turn-boundary hardening.
const COMMIT = 'ec54aa03cc16dab1b8cfd1e7a356083cec735c82';
const REPO = 'https://raw.githubusercontent.com/addvaluewithai-hub/pixilive';
const markerPath = '.pixilive-runtime-source';

const files = [
  // Browser assets used directly at runtime. Keep these in sync with the
  // pinned PixiLive commit; missing AudioWorklet assets otherwise fall
  // through to the SPA HTML on Cloudflare Pages and fail with a MIME error.
  ['public/audio-capture.worklet.js', 'public/audio-capture.worklet.js'],
  ['public/character-engine/geometry.js', 'public/character-engine/geometry.js'],
  ['public/character-engine/engine.js', 'public/character-engine/engine.js'],
  ['public/character-engine/flight.js', 'public/character-engine/flight.js'],
  ['public/character-engine/motion.js', 'public/character-engine/motion.js'],
  ['public/character-engine/master.svg', 'public/character-engine/master.svg'],

  // Character / Live runtime source.
  ['src/engine-app/audio/Microphone.ts', 'src/vendor/pixilive/audio/Microphone.ts'],
  ['src/engine-app/audio/PlaybackClock.ts', 'src/vendor/pixilive/audio/PlaybackClock.ts'],
  ['src/engine-app/audio/VisemeAnalyzer.ts', 'src/vendor/pixilive/audio/VisemeAnalyzer.ts'],
  ['src/engine-app/core/CueScheduler.ts', 'src/vendor/pixilive/core/CueScheduler.ts'],
  ['src/engine-app/core/PerformanceDirector.ts', 'src/vendor/pixilive/core/PerformanceDirector.ts'],
  ['src/engine-app/core/SessionController.ts', 'src/vendor/pixilive/core/SessionController.ts'],
  ['src/engine-app/core/SessionLog.ts', 'src/vendor/pixilive/core/SessionLog.ts'],
  ['src/engine-app/core/SvgCharacter.ts', 'src/vendor/pixilive/core/SvgCharacter.ts'],
  ['src/engine-app/core/flight.ts', 'src/vendor/pixilive/core/flight.ts'],
  ['src/engine-app/core/registry.ts', 'src/vendor/pixilive/core/registry.ts'],
  ['src/engine-app/core/types.ts', 'src/vendor/pixilive/core/types.ts'],
  ['src/engine-app/live/GeminiAdapter.ts', 'src/vendor/pixilive/live/GeminiAdapter.ts'],
  ['src/engine-app/live/performancePrompt.ts', 'src/vendor/pixilive/live/performancePrompt.ts'],
  ['src/engine-app/live/storyScript.ts', 'src/vendor/pixilive/live/storyScript.ts'],
];

async function fetchText(url, attempt = 1) {
  const response = await fetch(url, { headers: { 'user-agent': 'kidshabits-build' } });
  if (response.ok) return response.text();
  if (attempt < 3) {
    await new Promise(resolve => setTimeout(resolve, 500 * attempt));
    return fetchText(url, attempt + 1);
  }
  throw new Error(`Failed to sync PixiLive runtime: ${response.status} ${url}`);
}

let current = '';
if (existsSync(markerPath)) current = (await readFile(markerPath, 'utf8')).trim();
if (current !== COMMIT) {
  await rm('public/character-engine', { recursive: true, force: true });
  await rm('src/vendor/pixilive', { recursive: true, force: true });
}

for (const [remote, local] of files) {
  if (current === COMMIT && existsSync(local)) continue;
  const url = `${REPO}/${COMMIT}/${remote}`;
  const content = await fetchText(url);
  await mkdir(dirname(local), { recursive: true });
  await writeFile(local, content, 'utf8');
  console.log(`synced ${remote}`);
}

await writeFile(markerPath, `${COMMIT}\n`, 'utf8');
console.log(`PixiLive runtime pinned to ${COMMIT}`);
