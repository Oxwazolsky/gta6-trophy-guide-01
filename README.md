# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Oxwazolsky/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Oxwazolsky/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

Leonida Legend is an offline web app for working through all **55 PlayStation 5 trophies in Grand Theft Auto VI**. Every trophy is listed with its official name, description and grade, plus a guide written in my own words for that trophy. Each guide sits right next to its sources, the three missable trophies are flagged up front, and a six-stage roadmap orders the whole run toward the Platinum.

This entry was made for the [gta6-trophy-guide-01 bounty on make.fun](https://make.fun/bounty/gta6-trophy-guide-01).

## What you can do in the app

- Tick trophies off as you earn them — progress is saved in your browser (localStorage) and survives a reload.
- Export your progress as JSON and import it again on another browser or machine.
- Filter the checklist by kind (story, side strands, collectibles, activities, free roam, or missable only), by grade, by earned / not-yet-earned state, or by a plain text search.
- Turn on spoiler protection to mask unearned story trophies — name and description stay hidden until you have earned them.
- Follow the Roadmap to the Platinum: six stages from the story chapters through strands, collectibles and activities to money / partner play and the final 100% audit. Clicking a stage filters the checklist to that stage.
- Watch the header progress bar and per-grade counts update as you go.

## How to run it

The app itself is plain static files under `app/` — no build step and no network calls at runtime. Serve that folder locally:

```sh
node serve.ts          # serves app/ at http://localhost:8080
```

Any other static file server pointed at `app/` works too.

To package the entry the way the bounty expects, run the entry point at the repo root (Node 22, standard library only). It copies `app/` and `screenshots/` into the output directory and writes `dossier.json` there using the vendored make.fun frontend library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That `node main.ts` command is the hand-in step; opening the app is the step before it.

## How it was built

I built this as a small, dependency-free static app and rewrote it file by file for this submission:

- `app/index.html` — page structure: hero with progress, roadmap section, filter toolbar, checklist container and footer.
- `app/style.css` — the Vice-City-neon look: deep indigo night, a pink-to-orange sunset gradient in the hero, SVG palm silhouettes, system fonts only, and no external assets.
- `app/app.js` — the tracker wiring: loading the trophy data, holding filter / search / spoiler state, and re-rendering on every change.
- `app/render.js` — trophy cards, grade and missable badges, guide panels, the sources line shown beside each guide, and the header progress summary.
- `app/storage.js` — localStorage persistence for earned trophies and the spoiler setting, plus JSON export / import.
- `app/roadmap.js` — the six roadmap stages and their earned / missable counts.
- `app/data/trophies.json` — all 55 trophies. Names, descriptions and grades are exactly as published, with sources citing [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-ps5/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/grand-theft-auto-vi) beside each guide.
- `screenshots/` — four real renders of the running app, listed in `shots.json`.
- `vendor/makefun-frontend.ts` — the kit's dossier library, left byte-identical and untouched.
- `serve.ts` — a tiny local static server for development.

The three missable trophies flagged in the data are **Catch Me If You Can**, **Actions Speak Louder**, and **Bad Luck, I Guess**.

## License

MIT — see `LICENSE`.
