/**
 * Responsive audit. Loads each page at a range of viewport widths and reports
 * horizontal overflow, the elements causing it, and any tap target below the
 * 44px accessibility floor. Screenshots land in .audit/ (gitignored).
 *
 *   node scripts/audit-responsive.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const OUT = new URL('../.audit/', import.meta.url).pathname;

const VIEWPORTS = [
  { name: '320-small', width: 320, height: 800 },
  { name: '375-iphone-se', width: 375, height: 812 },
  { name: '390-iphone15', width: 390, height: 844 },
  { name: '430-iphone-max', width: 430, height: 932 },
  { name: '600-phablet', width: 600, height: 900 },
  { name: '768-ipad', width: 768, height: 1024 },
  { name: '1024-ipad-ls', width: 1024, height: 768 },
  { name: '1280-laptop', width: 1280, height: 800 },
  { name: '1440-laptop-lg', width: 1440, height: 900 },
  { name: '1920-desktop', width: 1920, height: 1080 },
];

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'writing', path: '/writing' },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
let failures = 0;

for (const page of PAGES) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      colorScheme: 'dark',
    });
    const p = await ctx.newPage();
    await p.goto(`${BASE}${page.path}`, { waitUntil: 'networkidle' });
    // Let reveal animations settle so screenshots aren't half-faded.
    await p.evaluate(() =>
      document
        .querySelectorAll('[data-reveal]')
        .forEach((el) => el.classList.add('is-visible')),
    );
    await p.waitForTimeout(250);

    const report = await p.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = document.documentElement.clientWidth;
      const overflowing = [];
      if (docW > winW + 1) {
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return;
          if (r.right > winW + 1 || r.left < -1) {
            // Ignore elements that scroll inside their own container.
            let anc = el.parentElement;
            let contained = false;
            while (anc) {
              const ov = getComputedStyle(anc).overflowX;
              if (ov === 'auto' || ov === 'scroll' || ov === 'hidden') {
                contained = true;
                break;
              }
              anc = anc.parentElement;
            }
            if (!contained) {
              overflowing.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className || '').toString().slice(0, 60),
                left: Math.round(r.left),
                right: Math.round(r.right),
              });
            }
          }
        });
      }

      // Tap targets: interactive elements smaller than 44x44.
      const small = [];
      document.querySelectorAll('a, button').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.height < 44 || r.width < 24) {
          small.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || '').toString().slice(0, 40),
            text: (el.textContent || '').trim().slice(0, 28),
            w: Math.round(r.width),
            h: Math.round(r.height),
          });
        }
      });

      return { docW, winW, overflowing: overflowing.slice(0, 8), small: small.slice(0, 8) };
    });

    const overflow = report.docW - report.winW;
    const bad = overflow > 1;
    if (bad) failures++;
    const flag = bad ? `OVERFLOW +${overflow}px` : 'ok';
    console.log(`${page.name.padEnd(8)} ${String(vp.width).padStart(5)}px  ${flag}`);
    if (bad) {
      report.overflowing.forEach((o) =>
        console.log(`             ↳ <${o.tag} class="${o.cls}"> ${o.left}…${o.right}`),
      );
    }
    if (vp.width <= 430 && report.small.length) {
      report.small.forEach((s) =>
        console.log(`             ↳ tap target ${s.w}×${s.h} "${s.text}" .${s.cls}`),
      );
    }

    await p.screenshot({
      path: `${OUT}${page.name}-${vp.name}.png`,
      fullPage: vp.width <= 430 || vp.width === 1440,
    });
    await ctx.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} viewport(s) overflow.` : '\nNo horizontal overflow anywhere.');
