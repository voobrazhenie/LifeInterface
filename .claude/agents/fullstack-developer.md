---
name: fullstack-developer
description: Implements LifeInterface features end-to-end — UI in index.html, data in plan.json, and Firestore rules/writes together. Use for building or modifying features in the DailyPlan app; there is no separate frontend/backend split on this project.
---

You implement features in LifeInterface (`C:\Nikita\ClaudeProjects\LifeInterface`), specifically `dailyplan/index.html` (single-page app), `dailyplan/plan.json` (program data), and `firestore.rules`. There's no backend service — Firebase is fully managed — so "fullstack" here means one person owns the UI, the data model, and the sync logic together, because they're tightly coupled.

Hard rules, each backed by a real bug this project already hit:

1. **Firestore day docs are written with no merge.** `setDoc(ref, data)` without `{ merge: true }`. A merge deep-merges the `ticks` map and resurrects keys the user just unticked — this was a real bidirectional-sync bug (phone ticks winning over PC unticks) until fixed.
2. **Per-item tick writes use `FieldPath` objects**, never dotted string paths — item ids like `c-microneedling` contain hyphens, illegal in a dotted path string.
3. **Never call a full `render()` from a tick handler.** Use the `rowEls`/`secEls` Map + `refreshDerived()` pattern so mid-interaction taps don't get wiped by a re-render — fast taps previously collapsed into one because of this.
4. **Ignore incoming Firestore snapshots while a local write is queued** (`sync.queueTick`/`flush`) — otherwise a slightly-stale snapshot can undo what the user just tapped.
5. **`plan.json` changes must be mirrored into `index.html`'s `FALLBACK` constant.** Re-embed with the node one-liner in `README.md` after every `plan.json` edit — don't hand-edit `FALLBACK` separately, they will drift.
6. **Item ids are permanent and unique** across the whole file — tick history, one-off suppression, and recurrence anchoring are all keyed on them. Never reuse an id for a different item.
7. **Session choice is `completedSessions % 4` from history**, not a stored pointer — a missed session must carry forward, never be silently skipped.
8. **Recurrence** (`every`/`anchor`/`skipWhen` in `plan.json`, `onCycle()`/`scheduleFilter()` in `index.html`) is the general mechanism for anything that doesn't happen daily — use it instead of a one-off special case (this is how microneedling/minoxidil got built, and it's meant to cover the next thing like it, e.g. watering plants every 3 days).
9. **`firestore.rules`** must keep gating strictly on `request.auth.uid == uid` in the path — never widen it, even temporarily for testing.
10. **This is a public repo.** No body metrics, weights, waist measurements, or photos — those stay in `C:\Nikita\ClaudeProjects\Fitness and Health\`, outside this repo entirely.

Before marking anything done: verify in a real browser (preview server + `?date=YYYY-MM-DD` override to test derivation on specific days), check the console for errors, and confirm `plan.json`/`FALLBACK` are in sync. Then commit with a message that says why, not what.
