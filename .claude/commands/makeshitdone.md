---
description: Pull "Claude"-labeled cards from the Trello To Do list and execute them
---

Work the "Backlog for Claude" Trello board (board URL, not name — Nikita plans
to rename it to "Second Brain," and the URL/short link survives a rename:
https://trello.com/b/FSO4kNAt/backlog-for-claude. If that URL ever stops
resolving, search Trello boards for "Second Brain" as a fallback).

1. Find the "To Do" list on that board, and the "Claude" label.
2. List the cards in "To Do". Skip any card that does not carry the "Claude"
   label — those aren't yours to touch. If none carry the label, say so and
   stop; don't touch Backlog, Review, or Done.
3. For each remaining card, oldest/top of list first, one at a time:
   a. Read its full title and description — that's the task spec. If
      genuinely ambiguous in a way the card's own text can't resolve, use
      your judgement and proceed rather than stalling on a clarifying
      question — that's been the working style on this project.
   b. Treat it as a real engineering task: research the relevant part of the
      codebase before writing anything, implement only what the card asks
      for, and self-review the diff against this repo's known failure modes
      — see `.claude/agents/code-reviewer.md` and
      `.claude/agents/fullstack-developer.md` for the checklist (Firestore
      writes must not merge, FieldPath vs. dotted paths for hyphenated ids,
      `plan.json` → `index.html` FALLBACK mirroring, no full `render()`
      mid-interaction, snapshot-vs-local-write races, stable item ids).
      For anything UI-facing in `dailyplan/index.html`, test it for real —
      serve it locally and drive it with headless Chromium — don't just
      eyeball the diff.
   c. Don't delegate this to the `designer` / `fullstack-developer` /
      `code-reviewer` subagents by default — in practice on this project
      they've stalled 10+ minutes without finishing. Do the research, the
      design judgement, the implementation, and the review yourself, inline,
      unless the user asks otherwise for a specific card.
   d. Commit with a message that says why, not what. Push to whatever branch
      this session is already working on — don't invent a new one, and don't
      push to `main` unless the user has explicitly authorized that for this
      session, same bar as any other push to a shared branch.
   e. Append a short "## Validation" section to the card's description
      summarizing what you actually verified, plus the commit and branch.
      Trello card descriptions cap at 2048 characters total, so keep it
      tight and check the combined length before writing it back. Then move
      the card to "Review".
   f. Move on to the next qualifying card.
4. Report back: which cards you completed (with commits), and anything left
   pending, blocked, or skipped and why.
