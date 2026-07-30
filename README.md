# Life Interface

Small static pages for things worth keeping honest. Hosted on GitHub Pages, with Firebase for cross-device state — no server to run, nothing to pay for at this scale.

Live: **https://voobrazhenie.github.io/LifeInterface/**

## How the fitness tracker works

`fitness/index.html` is a single self-contained page. Two moving parts around it:

- **`fitness/today.json`** — one day's checklist. Claude Code reads `Plan - NOW to WANT.md` (kept locally, outside this repo), writes a fresh `today.json`, and pushes. GitHub Pages redeploys within about a minute and the page picks it up on the next **Refresh for today**. The repo is the transport; no API and no credentials involved.
- **Firestore** — where ticks live once you sign in, so the phone and the PC agree. Signed out, the page still works and keeps ticks in `localStorage` only.

### The two directions

| | How |
|---|---|
| Claude Code → page | Rewrite `today.json`, commit, push |
| Page → Claude Code | Ticks land in Firestore; `tools/read-ticks.mjs` reads them directly |

The page also has a **Copy status for Claude Code** button and a paste-ready block when the published list falls behind the date. That path needs no Firebase at all, and is the fallback if sync is ever down.

## Data model

```
users/{uid}/days/{YYYY-MM-DD}  ->  { ticks: { itemId: true, … }, updatedAt }
```

One document per day. Item `id`s in `today.json` must be **unique and stable** — tick state is keyed on them, so reusing an id from a previous day carries that tick across.

Day documents are written with `setDoc` and no merge, on purpose: a merge would deep-merge the `ticks` map and resurrect keys you had just unticked. That means a day document holds *only* ticks — anything else (metrics, session logs) belongs in a sibling document.

## Security

`fitness/firebase-config.js` is **public by design** and committed. The `apiKey` is an identifier for which project to talk to, not a credential. What actually protects the data is `firestore.rules`, which allows reads and writes only where `request.auth.uid` matches the `{uid}` in the path. Everything else is denied, including all unauthenticated access.

The credential that *is* secret is the **service-account key** used by `tools/read-ticks.mjs`. It bypasses every rule. It lives at `tools/service-account.json`, is gitignored, and must never be pasted anywhere public.

Progress photos and body measurements stay out of this repo entirely — they live in `C:\Nikita\ClaudeProjects\Fitness and Health\`, and `.gitignore` blocks the usual filenames as a backstop.

## First-time Firebase setup

Almost all of this is CLI work, so it does not need doing by hand in the console. The one step that cannot be automated is logging in, because it needs a browser and your consent:

```bash
npx -y firebase-tools@latest login
```

After that, in this directory:

```bash
firebase projects:create                      # or reuse an existing project id
firebase deploy --only firestore:rules        # publishes firestore.rules
firebase deploy --only auth                   # Google sign-in + authorised domains
firebase apps:create web "Life Interface"
firebase apps:sdkconfig web                   # prints the config object
```

The config object from that last command goes into `fitness/firebase-config.js`, replacing `export const firebaseConfig = null`. Until it does, the page runs local-only and says so in its sync row.

`voobrazhenie.github.io` must be an authorised domain or sign-in fails with `auth/unauthorized-domain` — that comes from the `auth` deploy, and it is the most common thing to miss when doing this by hand.

Firestore rules live only in `firestore.rules`. Editing them in the console instead puts the live rules out of step with this file, and the next deploy overwrites the console edit without warning.

## Reading ticks

With the Firebase MCP server connected — `claude mcp add firebase -- npx -y firebase-tools@latest mcp` — Claude Code reads Firestore through the CLI's own logged-in credentials, and **no service-account key is needed at all**.

`tools/read-ticks.mjs` is the fallback for when MCP isn't available. It does need a service-account key, which bypasses every security rule, so prefer the MCP route:

```bash
node tools/read-ticks.mjs --uid <UID> --days 14
```

The uid appears in the page's copy-for-Claude-Code block once you're signed in, or under **Authentication → Users** in the console.

## Adding a day by hand

Edit `fitness/today.json`: set `date` to today (`YYYY-MM-DD`, local time) and give every item a unique stable `id`. The same JSON is also inlined in `index.html` as `FALLBACK`, so the page still renders when opened from a `file://` path where `fetch` is blocked — **both copies need updating**.
