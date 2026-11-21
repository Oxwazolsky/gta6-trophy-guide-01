// Leonida Legend — hand-in entry point for gta6-trophy-guide-01.
// Written by me for this recorded session. The guide itself is just static
// files under app/ (HTML, CSS, ES modules and data/trophies.json), with no
// build step and no runtime network use. This file does only the packaging:
// it copies app/ and screenshots/ into the output directory and writes
// dossier.json there with the vendored library in vendor/makefun-frontend.ts,
// which I must not modify — it has to stay byte-identical.
// Local run:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// To use the app itself: node serve.ts, then http://localhost:8080

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// These caps mirror the scorer's limits: at most 4 screenshots at 256 KiB
// each, plus the app file-count and total-byte limits.
console.log('Leonida Legend: copying the GTA VI trophy guide (55 trophies) and its screenshots to the output.');
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
