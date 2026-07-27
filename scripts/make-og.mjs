/**
 * Regenerates public/og.png — the social preview card.
 *
 * Run `npm run og` after changing your name, role, or location in
 * src/data/site.ts. It is a build-time script, not part of `astro build`,
 * because the card changes about once a year.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../public/og.png', import.meta.url));

// Swiss card: dark ground, one red rule, big asymmetric name, mono metadata.
// Text is drawn as SVG <text> with a system-safe family, so this script has no
// font dependency of its own.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0c0c0e"/>
  <rect x="80" y="72" width="1040" height="3" fill="#ff4d3d"/>

  <text x="80" y="120" font-family="Helvetica,Arial,sans-serif" font-size="19"
        font-weight="500" letter-spacing="2.6" fill="#90909a">ZURICH, SWITZERLAND</text>
  <text x="1120" y="120" text-anchor="end" font-family="Helvetica,Arial,sans-serif"
        font-size="19" font-weight="700" letter-spacing="2.6" fill="#ff4d3d">RT</text>

  <!-- Lines are further apart than the web hero's leading: the comma below the
       ș descends into the gap, and any tighter it reads as a stray apostrophe
       floating between the two words. -->
  <text x="76" y="312" font-family="Helvetica,Arial,sans-serif" font-size="168"
        font-weight="700" letter-spacing="-7" fill="#ededea">Rareș</text>
  <text x="196" y="486" font-family="Helvetica,Arial,sans-serif" font-size="168"
        font-weight="700" letter-spacing="-7" fill="#66666e">Toader</text>

  <rect x="80" y="532" width="1040" height="1" fill="#26262c"/>
  <text x="80" y="578" font-family="Helvetica,Arial,sans-serif" font-size="25"
        font-weight="500" fill="#ededea">Systems and network engineer</text>
  <text x="1120" y="578" text-anchor="end" font-family="Helvetica,Arial,sans-serif"
        font-size="20" letter-spacing="1.6" fill="#90909a">MSc, ETH Zurich</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(OUT, png);
console.log(`wrote public/og.png (${png.length} bytes)`);
