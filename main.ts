// Leonida Legend — entry point for the gta6-trophy-guide-01 bounty.
// Authored for this submission: the guide itself lives in app/ as plain
// static files (HTML, CSS, ES modules and data/trophies.json) with no build
// step and no runtime network use. This file only does the hand-in: it copies
// app/ and screenshots/ into the output directory and writes dossier.json
// there with the vendored make.fun library in vendor/makefun-frontend.ts,
// which must stay byte-identical so the dossier matches the scorer's copy.
// Locally, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the app itself with `node serve.ts`, then open http://localhost:8080.

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

// Caps passed to the dossier builder mirror the scorer's own limits: at most
// 4 screenshots and 256 KiB each, plus the app file-count and byte limits.
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
