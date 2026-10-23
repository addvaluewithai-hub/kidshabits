#!/usr/bin/env node
/**
 * Actual built-app Playwright interaction smoke and visual evidence.
 * Strict by design: missing production test hooks fail the job.
 * No mock HTML page or pre-baked screenshots are accepted.
 *
 * App contract described in project/island-v2/CI_AND_VISUAL_QA.md.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const output = join(process.cwd(), 'artifacts', 'island');
const baseUrl = process.env.ISLAND_PREVIEW_URL || 'http://127.0.0.1:4173';
await mkdir(output, { recursive: true });
const viewports = [
  { id: 'phone-390x844', width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 },
  { id: 'desktop-1280x800', width: 1280, height: 800, isMobile: false, deviceScaleFactor: 1 },
];
const evidence = { generatedAt: new Date().toISOString(), url: baseUrl, checks: [], screenshots: [], result: 'RUNNING' };
let browser;
let failed = false;

async function mustBeVisible(page, id) {
  const locator = page.locator('[data-testid="' + id + '"]');
  if (await locator.count() !== 1) {
    throw new Error('Expected exactly one [data-testid="' + id + '"], got ' + await locator.count());
  }
  await locator.waitFor({ state: 'visible', timeout: 12000 });
  if (!await locator.isVisible()) throw new Error('Not visible: ' + id);
  return locator;
}
async function verifyChanged(page, name) {
  const marker = await mustBeVisible(page, name + '-change');
  const state = (await marker.getAttribute('data-state') || '').trim();
  const text = (await marker.innerText() || '').trim();
  if (!state && !text) throw new Error(name + '-change has no actual state/text signal.');
  const nova = await mustBeVisible(page, 'nova-actor');
  const focus = await nova.getAttribute('data-focus');
  if (focus !== name) throw new Error('Nova did not react to ' + name + '; data-focus=' + focus);
}
async function shot(page, filename) {
  await page.screenshot({ path: join(output, filename), fullPage: true, animations: 'disabled' });
  evidence.screenshots.push(filename);
}

try {
  browser = await chromium.launch({ headless: true, ...(process.env.CI ? { channel: 'chrome' } : {}) });
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.isMobile,
      deviceScaleFactor: viewport.deviceScaleFactor,
      reducedMotion: 'reduce',
      locale: 'ar-EG',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const pageErrors = [];
    const consoleErrors = [];
    page.on('pageerror', err => pageErrors.push(String(err.stack || err)));
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('requestfailed', request => consoleErrors.push('request failed: ' + request.url() + ' ' + request.failure()?.errorText));
    const run = { viewport: viewport.id, stage: 'starting', ok: false };
    evidence.checks.push(run);

    try {
      const response = await page.goto(baseUrl + '/?ci=1', { waitUntil: 'domcontentloaded', timeout: 35000 });
      if (!response || !response.ok()) throw new Error('App did not respond OK.');
      await page.waitForTimeout(1000);
      run.stage = 'loaded';
      await shot(page, viewport.id + '-initial.png');

      await mustBeVisible(page, 'island-world');
      const nova = await mustBeVisible(page, 'nova-actor');
      const cottage = await mustBeVisible(page, 'cottage-hotspot');
      await mustBeVisible(page, 'garden-hotspot');
      const startingFocus = await nova.getAttribute('data-focus');
      if (startingFocus !== 'idle') throw new Error('Initial Nova focus should be idle: ' + startingFocus);

      run.stage = 'cottage interaction';
      await cottage.click();
      await verifyChanged(page, 'cottage');
      await shot(page, viewport.id + '-cottage.png');

      run.stage = 'garden interaction';
      await (await mustBeVisible(page, 'garden-hotspot')).click();
      await verifyChanged(page, 'garden');
      await shot(page, viewport.id + '-garden.png');

      // Production reload must reconstruct durable presentation from saved semantic state.
      await page.reload({ waitUntil: 'domcontentloaded' });
      await mustBeVisible(page, 'island-world');
      await mustBeVisible(page, 'cottage-change');
      await mustBeVisible(page, 'garden-change');
      await mustBeVisible(page, 'nova-actor');
      const greeting = await (await mustBeVisible(page, 'nova-dialogue')).innerText();
      if (!greeting.includes('جزيرتك') || greeting.includes('أخيرًا وصلنا')) {
        throw new Error('Nova did not recognize the persisted island on return: ' + greeting);
      }
      await shot(page, viewport.id + '-after-reload.png');

      if (pageErrors.length > 0) throw new Error('Uncaught browser errors: ' + pageErrors.join(' | '));
      run.stage = 'completed';
      run.ok = true;
      console.log('PASS visual interactions:', viewport.id);
    } catch (error) {
      failed = true;
      run.error = String(error.stack || error);
      run.pageErrors = pageErrors;
      run.consoleErrors = consoleErrors;
      try { run.bodyExcerpt = (await page.locator('body').innerHTML()).slice(0, 1200); } catch { /* navigation failed */ }
      console.error('FAIL visual interactions:', viewport.id, run.stage, run.error,
        'BROWSER ERRORS:', JSON.stringify({ pageErrors, consoleErrors, body: run.bodyExcerpt }));
      try { await shot(page, viewport.id + '-failure.png'); } catch { /* preview may have crashed */ }
    } finally {
      await context.close();
    }
  }
} catch (error) {
  failed = true;
  evidence.setupError = String(error.stack || error);
  console.error('Failed before screenshot flow:', evidence.setupError);
} finally {
  evidence.result = failed ? 'FAIL' : 'PASS';
  await writeFile(join(output, 'ci-result.json'), JSON.stringify(evidence, null, 2));
  if (browser) await browser.close();
}
if (failed) process.exitCode = 1;
