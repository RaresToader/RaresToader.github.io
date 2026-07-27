/**
 * Interaction checks that a static audit cannot make: the pulse effect behaves
 * under a mouse and under a finger, the card spotlight lights up, the theme
 * toggle cycles and persists, and the page still works with reduced motion and
 * with JavaScript disabled.
 *
 *   node scripts/audit-interactions.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4322';
const browser = await chromium.launch();
let failed = 0;

const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`);
  if (!pass) failed++;
};

/** Rings currently drawn, i.e. past the opacity floor. */
const liveRings = (p) =>
  p.evaluate(() =>
    [...document.querySelectorAll('.pu-ring')].filter(
      (c) => parseFloat(c.getAttribute('opacity') || '0') > 0.01,
    ).length,
  );

// --- Page chrome ----------------------------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  // Card spotlight.
  const card = p.locator('.prj').first();
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await p.waitForTimeout(120);
  const lit = await p.evaluate(() => {
    const el = document.querySelector('.prj');
    return { lit: el?.hasAttribute('data-lit'), mx: el?.style.getPropertyValue('--mx') };
  });
  check('card spotlight lights on hover', lit.lit === true);
  check('card spotlight tracks cursor', lit.mx !== '' && lit.mx !== undefined, `--mx: ${lit.mx}`);

  // Theme toggle: system → light → dark → system, persisted.
  const seq = [];
  for (let i = 0; i < 3; i++) {
    await p.click('[data-theme-toggle]');
    await p.waitForTimeout(60);
    seq.push(await p.evaluate(() => document.documentElement.dataset.theme ?? ''));
  }
  check('theme cycles system → light → dark → system', seq.join(',') === 'light,dark,');

  await p.click('[data-theme-toggle]');
  await p.waitForTimeout(60);
  await p.reload({ waitUntil: 'networkidle' });
  const persisted = await p.evaluate(() => document.documentElement.dataset.theme);
  check('theme choice survives a reload', persisted === 'light', `got ${persisted}`);

  await ctx.close();
}

// --- Pulse ships, and nothing else ----------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  const present = await p.evaluate(() => ({
    rings: document.querySelectorAll('.pu-ring').length,
    others: document.querySelectorAll('[data-tp], [data-tr], [data-ar]').length,
    fxAttr: document.documentElement.dataset.fx ?? null,
  }));
  check('pulse is the effect on the page', present.rings === 16, `${present.rings} rings`);
  check('the parked effects do not ship', present.others === 0, `${present.others} found`);
  check('no fx switch is exposed', present.fxAttr === null, `data-fx=${present.fxAttr}`);

  // The old query switch must be inert, not a back door that still works.
  const q = await ctx.newPage();
  await q.goto(`${BASE}/?fx=topology`, { waitUntil: 'networkidle' });
  const ignored = await q.evaluate(() => ({
    rings: document.querySelectorAll('.pu-ring').length,
    topology: document.querySelectorAll('[data-tp]').length,
  }));
  check(
    '?fx= is ignored and cannot resurrect another effect',
    ignored.rings === 16 && ignored.topology === 0,
    `rings=${ignored.rings} topology=${ignored.topology}`,
  );
  await q.close();

  await ctx.close();
}

// --- Pulse, mouse ---------------------------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  check('pulse draws nothing before any input', (await liveRings(p)) === 0);

  await p.mouse.move(300, 500);
  for (let i = 0; i < 20; i++) {
    await p.mouse.move(300 + i * 42, 500 - i * 9);
    await p.waitForTimeout(15);
  }
  const live = await p.evaluate(() => {
    const cs = [...document.querySelectorAll('.pu-ring')].filter(
      (c) => parseFloat(c.getAttribute('opacity') || '0') > 0.01,
    );
    return {
      on: document.querySelector('[data-pu]')?.dataset.on,
      alive: cs.length,
      centres: new Set(cs.map((c) => `${c.getAttribute('cx')},${c.getAttribute('cy')}`)).size,
      radii: cs.map((c) => Number(c.getAttribute('r'))),
      widths: cs.map((c) => Number(c.getAttribute('stroke-width'))),
    };
  });
  check('pulse blooms rings as the pointer travels', live.alive > 1, `${live.alive} alive`);
  // Density is what made this loud once, so it is worth asserting.
  check('a brisk sweep does not exhaust the pool', live.alive < 16, `${live.alive} of 16`);
  check(
    'each ring is anchored at its own point',
    live.centres === live.alive,
    `${live.centres} centres for ${live.alive} rings`,
  );
  check(
    'rings are at different stages of expansion',
    new Set(live.radii).size > 1,
    `radii ${live.radii.map((r) => Math.round(r)).join(', ')}`,
  );
  // Below about a pixel a stroke stops reading as a line at all, which is what
  // made this invisible on dark before the width was floored.
  check(
    'no ring thins below the legibility floor',
    Math.min(...live.widths) >= 1.2,
    `thinnest ${Math.min(...live.widths)}px`,
  );

  // Rings must grow. Tracked by identity: with the pointer stopped the largest
  // ring dies first, so comparing maximum radius can legitimately go down.
  const grew = await p.evaluate(async () => {
    const snap = () =>
      new Map(
        [...document.querySelectorAll('.pu-ring')]
          .map((c, i) => [i, c])
          .filter(([, c]) => parseFloat(c.getAttribute('opacity') || '0') > 0.05)
          .map(([i, c]) => [i, Number(c.getAttribute('r'))]),
      );
    const a = snap();
    await new Promise((r) => setTimeout(r, 120));
    const b = snap();
    let compared = 0;
    let grew = 0;
    for (const [i, r0] of a) {
      if (!b.has(i)) continue;
      compared++;
      if (b.get(i) > r0) grew++;
    }
    return { compared, grew };
  });
  check(
    'rings expand over time',
    grew.compared > 0 && grew.grew === grew.compared,
    `${grew.grew}/${grew.compared} tracked rings grew`,
  );

  await p.waitForTimeout(1100);
  const restOn = await p.evaluate(() => document.querySelector('[data-pu]')?.dataset.on);
  check('the loop stops once the pointer rests', restOn === 'false', `on=${restOn}`);
  check('nothing is left drawn once idle', (await liveRings(p)) === 0);

  const pe = await p.evaluate(
    () => getComputedStyle(document.querySelector('[data-pu]')).pointerEvents,
  );
  check('pulse never intercepts the pointer', pe === 'none');

  await ctx.close();
}

// --- Pulse, touch ---------------------------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    colorScheme: 'dark',
  });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  const shown = await p.evaluate(
    () => getComputedStyle(document.querySelector('[data-pu]')).display,
  );
  check('pulse is present on touch devices', shown !== 'none', `display: ${shown}`);

  // Two taps: the first only seeds the last-position, the second travels.
  await p.touchscreen.tap(200, 380);
  await p.touchscreen.tap(200, 560);
  await p.waitForTimeout(200);
  const tapped = await p.evaluate(() => ({
    on: document.querySelector('[data-pu]')?.dataset.on,
    alive: [...document.querySelectorAll('.pu-ring')].filter(
      (c) => parseFloat(c.getAttribute('opacity') || '0') > 0.01,
    ).length,
  }));
  check('a touch wakes pulse', tapped.on === 'true', `on=${tapped.on}`);
  check('a touch blooms a ring', tapped.alive > 0, `${tapped.alive} alive`);

  const pe = await p.evaluate(
    () => getComputedStyle(document.querySelector('[data-pu]')).pointerEvents,
  );
  check('the overlay never swallows touches', pe === 'none');

  await ctx.close();
}

// --- Reduced motion -------------------------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    colorScheme: 'dark',
  });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await p.mouse.move(500, 300);
  await p.mouse.move(700, 450);
  await p.waitForTimeout(200);
  const res = await p.evaluate(() => ({
    display: getComputedStyle(document.querySelector('[data-pu]')).display,
    on: document.querySelector('[data-pu]')?.dataset.on,
    revealed: [...document.querySelectorAll('[data-reveal]')].every(
      (el) => getComputedStyle(el).opacity === '1',
    ),
  }));
  check('pulse off under reduced motion', res.display === 'none' && res.on !== 'true');
  check('all content visible under reduced motion', res.revealed === true);
  await ctx.close();
}

// --- No JavaScript --------------------------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
    colorScheme: 'dark',
  });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'load' });
  const res = await p.evaluate(() => ({
    text: document.body.innerText.length,
    hidden: [...document.querySelectorAll('[data-reveal]')].filter(
      (el) => getComputedStyle(el).opacity !== '1',
    ).length,
  }));
  check('content renders with JS disabled', res.text > 4000, `${res.text} chars`);
  check('nothing stays hidden with JS disabled', res.hidden === 0, `${res.hidden} hidden`);
  await ctx.close();
}

await browser.close();
console.log(failed ? `\n${failed} check(s) failed.` : '\nAll interaction checks passed.');
process.exit(failed ? 1 : 0);
