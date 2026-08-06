# Second Brain

A personal tracking app for Nikita, hosted on GitHub Pages with Firebase for
cross-device sync. No server, no build step, nothing to pay for at this scale.

**GitHub repo:** `voobrazhenie/secondbrain`.

## Scope: mid-rename, mid-expansion

The project started as a single daily todo tracker for a lean-gain fitness
plan, grew a second module (job search), and is now being renamed and
expanded from **"LifeInterface"** (fitness-specific) to **"Second Brain"**
(general personal-tracking scope, of which fitness/DailyPlan is one module
among others).

The GitHub repo itself has already been renamed to `secondbrain`, but a lot
of in-repo branding and a few file paths still say "LifeInterface" /
"lifeinterface" — this is expected mid-rename debt, not something to silently
"fix" as a side effect of unrelated work. Known spots still on the old name:

- `README.md` — title `# Life Interface`, and its "Live" link points at
  `https://voobrazhenie.github.io/LifeInterface/` (stale — the repo is
  `secondbrain` now, so the current Pages URL is
  `https://voobrazhenie.github.io/secondbrain/`).
- Root `index.html` — `<title>Life Interface</title>`, eyebrow text
  `LIFE INTERFACE`, and its inline script's localStorage key prefixes
  (`lifeinterface.fitness.v1.`, `lifeinterface.fitness.meta.`).
- `jobs/index.html` — `<title>Jobs — Life Interface</title>`.
- `.claude/agents/*.md` (all six project subagents) — describe the project as
  "LifeInterface" and point at the local dev path
  `C:\Nikita\ClaudeProjects\LifeInterface`.
- The registered Firebase web app is named "Life Interface" (from
  `firebase apps:create web "Life Interface"`).

This is actually the *second* rename in this repo's history: the fitness
tracker itself was earlier called "NOW → WANT", then renamed to **DailyPlan**
and moved from `fitness/` to `dailyplan/` (see "Known inconsistencies"
below for straggling references that move left behind).

## Repo map

```
/                    Hub/landing page (index.html) — links to each module,
                     shows a fitness progress widget (reads localStorage,
                     refines from Firestore if signed in).
/dailyplan/          DailyPlan — the fitness tracker. Single-file SPA
                     (index.html, ~1500 lines) driven by plan.json. Full
                     mechanics documented in README.md — read that before
                     changing anything here (day derivation, session
                     rotation, FALLBACK mirroring, etc.).
/fitness/            Redirect stub only (`fitness/` was DailyPlan's old
                     location). Keeps old bookmarks / home-screen installs
                     working. No firebase-config.js here anymore — see
                     "Known inconsistencies".
/jobs/               Private job-search tracker. Sign-in gated; ships no
                     job data in the repo — everything renders from
                     users/{uid}/jobs in Firestore. `noindex, nofollow`.
/reviews/            Dated markdown check-in notes (e.g. 2026-08-02.md) —
                     periodic fitness-plan adherence reviews.
/tools/              Node scripts (no npm deps): make-icons.mjs generates
                     the PWA icons; read-ticks.mjs reads Firestore via a
                     service-account key (fallback for when the Firebase
                     MCP server isn't available).
/.claude/agents/     Six project-scoped subagents (code-reviewer, plan,
                     explore, designer, fullstack-developer,
                     fitness-coach) — currently all scoped narrowly to
                     LifeInterface/DailyPlan. Likely need updating as the
                     "Second Brain" scope expands to more modules.

firebase.json, .firebaserc, firestore.rules — Firebase project config and
Security Rules.
```

There is no build system — plain static HTML/CSS/JS, no bundler, no
`package.json`. Deploy is just pushing to `main`; GitHub Pages serves the
repo directly (no `.github/workflows`, no `gh-pages` branch).

## Backend — Firebase

- **Project ID:** `claudecode-3bb06` (Spark/free tier — 50k reads, 20k
  writes per day, no credit card).
- **Firestore** database created; **Security Rules** deployed and
  owner-scoped: `users/{uid}/{document=**}` allows read/write only when
  `request.auth.uid == uid`. Everything else, including all unauthenticated
  access, is denied by default.
- **Auth:** Google Sign-in enabled. Authorized domain:
  `voobrazhenie.github.io`.
- **Web app** registered in Firebase; config lives in `dailyplan/firebase-config.js`
  and is public by design (the `apiKey` identifies the project, it isn't a
  credential — `firestore.rules` is what actually protects data). The one
  thing that *is* secret is the service-account key used by
  `tools/read-ticks.mjs` (gitignored, never committed).
- **Sync:** real-time Firestore listeners (`onSnapshot`), offline
  persistence enabled (`persistentLocalCache` + multi-tab manager), and
  **per-item writes** using `FieldPath` objects rather than dotted string
  paths (item ids like `c-microneedling` contain hyphens, which are illegal
  in dotted paths).
  - This per-item approach replaced whole-document `setDoc(..., {merge:true})`
    writes after a real bug: merging deep-merged the `ticks` map and
    resurrected keys that had just been unticked, so phone → PC updates
    didn't show up correctly. Day documents are now written with no merge
    on purpose — don't reintroduce `{ merge: true }` on a day doc.
- **iOS home-screen install:** `dailyplan/manifest.webmanifest` +
  `icon-192.png`/`icon-512.png` (currently living in `dailyplan/`), plus a
  fullscreen-redirect flow to make Google Sign-in work from the installed
  PWA context.

### Data model

Day documents at `users/{uid}/days/{YYYY-MM-DD}`, written with `setDoc` (no
merge) or per-item `updateDoc`/`FieldPath` writes:

```
{
  date, dayOfPlan, week,
  sessionId, sessionLabel, sessionDone,
  ticks: { itemId: true, ... },   // per-item tick state
  items,                           // denominator — item count for the day
  xpEarned, ticked,
  updatedAt
}
```

Item `id`s must stay unique and stable across `plan.json` — tick history and
one-off suppression are keyed on them.

## Known inconsistencies (found during review, not yet fixed)

- **`jobs/firebase-config.js` re-exports from `../fitness/firebase-config.js`,
  which no longer exists.** It moved to `dailyplan/firebase-config.js` when
  `fitness/` became `dailyplan/`, and the jobs module's import was never
  updated. As it stands this import will fail — worth confirming and fixing.
- **`.gitignore`'s PNG-allowlist exceptions** (`!fitness/icon-180.png` etc.)
  still point at the old `fitness/` path; the actual icons are tracked at
  `dailyplan/icon-*.png`. Not actively broken (those files are already
  tracked), but misleading if icons are ever regenerated under the old
  assumption.
- See "Scope: mid-rename, mid-expansion" above for the naming/branding
  strings still on "LifeInterface".

## Where to look for more detail

- `README.md` — the authoritative doc for DailyPlan mechanics: how a day is
  derived, the session rotation logic, editing `plan.json`, and the
  `FALLBACK` re-embed command (`plan.json` is mirrored inline into
  `dailyplan/index.html` for `file://` use — both must be updated together).
- `.claude/agents/*.md` — existing subagent scopes and the hard-won rules
  each one encodes (merge-write bug, `FieldPath` id rule, rotation-not-calendar,
  no full `render()` from a tick handler, etc.).
