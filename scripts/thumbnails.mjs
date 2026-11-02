// Takes a snapshot of each cam's live player and saves it to assets/cams/<slug>.jpg.
// Runs on GitHub Actions (see .github/workflows/deploy.yml). Cams are read from index.html.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const src = html.match(/const cams = (\[[\s\S]*?\n\]);/);
if (!src) throw new Error('cams array not found in index.html');
const cams = vm.runInNewContext(src[1]);
const slug = n => n.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
mkdirSync('assets/cams', { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  locale: 'en-US',
});
let ok = 0;
async function snap(url, out) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    // Dismiss common cookie / consent buttons
    for (const t of ['Accept', 'Accept all', 'I agree', 'Agree', 'OK', 'Got it']) {
      await page.getByRole('button', { name: t, exact: true }).first().click({ timeout: 1500 }).catch(() => {});
    }
    await page.waitForTimeout(8000); // let the player start
    // Pick the largest visible video / player iframe / canvas / big image
    const handle = await page.evaluateHandle(() => {
      const els = [...document.querySelectorAll('video, iframe, canvas, img')];
      let best = null, area = 0;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width < 320 || r.height < 180) continue;
        const ratio = r.width / r.height;
        if (ratio < 1.2 || ratio > 2.4) continue;
        const a = r.width * r.height;
        if (a > area) { area = a; best = el; }
      }
      return best;
    });
    const el = handle.asElement();
    if (!el) throw new Error('no player found');
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await el.screenshot({ path: out, type: 'jpeg', quality: 72, timeout: 15000 });
    return null;
  } catch (e) {
    return e.message.split('\n')[0];
  } finally {
    await page.close();
  }
}
// Try each of a cam's links (main stream first, then alternates) until one works
for (const cam of cams) {
  const out = `assets/cams/${slug(cam.name)}.jpg`;
  let err = 'no links';
  for (const [, url] of cam.links) {
    err = await snap(url, out);
    if (!err) break;
  }
  if (!err) { ok++; console.log('OK  ', cam.name, '->', out); }
  else console.log('SKIP', cam.name, '-', err);
}
await browser.close();
console.log(`${ok}/${cams.length} snapshots saved`);
