# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Oxwazolsky/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Oxwazolsky/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

Leonida Legend is a small offline web app I wrote for hunting all **55 PlayStation 5 trophies in Grand Theft Auto VI**. I listed every trophy with the official name, description and grade exactly as published, and then wrote a guide for each one in my own words — four to five sentences, practical, and honest about what the official description actually supports. Every guide carries its sources right underneath it, the three trophies that can be missed are flagged before they bite you, and a six-stage roadmap puts the whole list in a sensible play order on the way to the Platinum.

This is my entry for the [gta6-trophy-guide-01 bounty on make.fun](https://make.fun/bounty/gta6-trophy-guide-01).

## What the app does

- **Checklist with memory** — tick a trophy off and it stays ticked. Progress lives in your browser's localStorage, so a reload does not lose it.
- **Export / import** — download your progress as a JSON file and import that same file in another browser or on another machine. There is also a reset button for starting clean.
- **Filters that actually narrow things down** — filter by kind (story, side strands, collectibles, activities, free roam, or missable only), by grade (Platinum / Gold / Silver / Bronze), by earned or not-yet-earned state, or just type in the search box.
- **Spoiler protection** — switch it on and unearned story trophies are masked: their names and descriptions stay hidden until you have earned them.
- **Roadmap to the Platinum** — six stages, from the story chapters through strands, collectibles and activities to money and partner play and the final 100% audit. Clicking a stage card filters the checklist to that stage; clicking it again clears the filter.
- **Progress at a glance** — the hero shows an overall progress bar, a percentage, and per-grade counts that update as you tick trophies off.

The three missable trophies I flag in the data are **Catch Me If You Can**, **Actions Speak Louder**, and **Bad Luck, I Guess**.

## How to run it

The app itself needs no build and makes no network calls at runtime — it is plain static files under `app/`. Serve that folder locally to use it:

```sh
node serve.ts          # serves app/ at http://localhost:8080
```

Any static file server pointed at `app/` works just as well.

To package the entry the way the bounty expects, run the entry point at the repo root with Node (standard library only). It copies `app/` and `screenshots/` into the output directory and writes `dossier.json` there using the vendored make.fun frontend library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

So `node main.ts` is the hand-in step; opening and using the app is the step before it.

## How it was built

I built this in this session as a dependency-free static app and wrote each counted file myself:

- `app/index.html` — the page structure: hero with progress, the roadmap section, the filter toolbar, the checklist container, and the footer.
- `app/style.css` — the Vice City neon look: deep indigo night, a pink-to-orange sunset gradient across the hero, SVG palm silhouettes, system fonts only, and no external assets.
- `app/app.js` — the tracker wiring: loading the trophy data, holding the filter, search and spoiler state, and re-rendering whenever anything changes.
- `app/render.js` — trophy cards, grade and missable badges, the expandable guide panels, the sources line that sits beside each guide, and the header progress summary.
- `app/storage.js` — localStorage persistence for earned trophies and the spoiler setting, plus the JSON export and import.
- `app/roadmap.js` — the six roadmap stages, with their earned and missable counts.
- `app/data/trophies.json` — all 55 trophies. Names, descriptions and grades are exactly as in the official starter list, verified against the listings, with sources citing [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-ps5/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/grand-theft-auto-vi) beside each guide.
- `screenshots/` — four real renders of the running app at 1280×800, listed in `shots.json`.
- `vendor/makefun-frontend.ts` — the kit's dossier library, left byte-identical and untouched.
- `serve.ts` — a tiny local static server I use for development.

Screenshots were taken from the real running app in a headless browser, then checked by eye — the cover shot keeps the Platinum guide open so its Sources line is visible on the first screen.

## License

MIT — see `LICENSE`.
