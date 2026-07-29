# Life Interface

Small static pages for things worth keeping honest. Hosted on GitHub Pages — no backend, no build step, no running costs.

## How the fitness tracker works

`fitness/index.html` is a single self-contained page. The only moving part is `fitness/today.json`, which holds one day's checklist.

The loop, in both directions:

- **Claude Code → page.** Claude Code reads `Plan - NOW to WANT.md` (kept locally, outside this repo), writes a fresh `fitness/today.json`, and pushes. GitHub Pages redeploys within about a minute, and the page picks it up on the next **Refresh for today**. The repo is the transport — no API, no server, no credentials in the page.
- **Page → Claude Code.** Ticks live in `localStorage`, so they never leave the browser. When the published list is older than today, the page shows a summary block and a copy button; pasting that into Claude Code is what asks for the next day. One paste, once a day.

`today.json` is also embedded in the page as a fallback, so opening `index.html` straight off disk still shows something sensible when `fetch` is blocked by the `file://` origin.

## Privacy

This repo is **public**. Progress photos and body measurements deliberately stay out of it — they live in `C:\Nikita\ClaudeProjects\Fitness and Health\`, and `.gitignore` blocks the usual filenames as a second line of defence. If you ever want metrics in here, make the repo private first.

## Adding a day by hand

Edit `fitness/today.json`: set `date` to today (`YYYY-MM-DD`, local), and give every item a unique stable `id` — the ids are what tick state is keyed on, so reusing an id from a previous day carries its tick across.
