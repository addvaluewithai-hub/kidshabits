#!/usr/bin/env node
/** Wait for the built Vite preview; do not treat 404/500 as ready. */
const url = process.env.ISLAND_PREVIEW_URL || 'http://127.0.0.1:4173/';
const attempts = 50;
let last = '';
for (let i = 0; i < attempts; i++) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (response.ok) {
      const html = await response.text();
      if (!/<html/i.test(html)) throw new Error('response is not HTML');
      console.log('Preview ready:', url);
      process.exit(0);
    }
    last = 'HTTP ' + response.status;
  } catch (error) {
    last = String(error.message ?? error);
  }
  await new Promise(resolve => setTimeout(resolve, 1000));
}
console.error('Built preview never became healthy:', url, last);
process.exit(1);
