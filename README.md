# Leonida Trophy Guide — GTA VI Trophy Guide & Tracker

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Oxwazolsky/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Oxwazolsky/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline web app that guides and tracks all **55 PlayStation 5 trophies of Grand Theft Auto VI**: every trophy with its official name, description and grade, a guide in our own words that cites its sources, a roadmap to the platinum, missable trophies flagged, filters by kind, a spoiler setting that hides story trophies until they are earned, and a checklist whose progress is saved in the browser and can be exported and imported.

Built for the [gta6-trophy-guide-01 bounty on make.fun](https://make.fun/bounty/gta6-trophy-guide-01).

## Run it

The guide is plain static files under `app/` — no build step, no network needed:

```sh
node serve.ts          # serves app/ at http://localhost:8080
```

or open `app/index.html` through any static file server. Progress is stored in `localStorage`; use the export/import buttons in the app to move it between browsers.

## Hand it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/` — the guide itself: `index.html`, styles, scripts and `data/trophies.json` (the 55 trophies and their guides).
- `screenshots/` — renders of the guide, listed in `shots.json`.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.
- `serve.ts` — a tiny local static server for development.

## License

MIT — see `LICENSE`.
