# SECOND BRAIN — Behaviour Change System

**Status:** Product concept and MVP recommendation  
**Prepared for:** Nikita / SECOND BRAIN  
**Date:** 7 August 2026

## Executive recommendation

Build a **Main Focus** system inside Second Brain, not a general life-coach chat.

At any time it should support:

- **one active behaviour-change focus** — initially, stopping weed;
- a few existing maintenance behaviours in DailyPlan;
- one obvious action when the user is struggling;
- a very small daily check-in;
- one weekly review in which Claude identifies patterns and proposes one experiment.

The system should make the right action easier at the moment it matters. It should not depend on motivation, long conversations, perfect streaks, or remembering to open a separate coaching tool.

The first version should be a highly visible widget at the top of DailyPlan plus two flows: **Help now** and **Evening check-in**.

---

## 1. Product principle: one change at a time

DailyPlan is good for recurring execution: medication, food, training, recovery, and setup tasks. Behaviour change is different. A goal such as stopping weed needs attention across several weeks, an understanding of triggers, and support during difficult moments.

Second Brain should therefore separate:

1. **Daily operations** — the existing checklist.
2. **Main Focus** — one behaviour being deliberately changed.
3. **Maintenance** — behaviours that are already stable enough to require only a light reminder.

Do not run five active improvement projects at once. For an ADHD brain, each extra priority competes with the others and makes the system itself harder to maintain.

A focus cycle should have these states:

| State | Purpose |
|---|---|
| Setup | Define the behaviour, reason, start date, likely triggers, replacement actions, and support |
| Active | Daily visibility, urge support, and minimal tracking |
| Stabilising | Reduce prompts while checking that the behaviour survives normal life |
| Completed | Preserve a light maintenance reminder and choose the next focus |
| Paused | Stop deliberately without calling the cycle a failure |

Use criteria rather than a magical duration. Habit automaticity varies widely; one study observed a range of 18–254 days, and one missed opportunity did not materially derail formation. The product should never claim that a habit is “formed in 21 days.” [Lally et al., 2010](https://doi.org/10.1002/ejsp.674)

A reasonable default is a **four-week review horizon**, not a promise that the problem will be solved in four weeks.

---

## 2. The Main Focus widget

Place this above the ordinary DailyPlan groups. It should remain visually distinct from the task list.

### Default state

```text
MAIN FOCUS · WEEK 2
NO WEED

Why: clearer mornings, better sleep, more agency

TODAY
○ No cannabis today

[ I NEED HELP NOW ]        [ Evening check-in ]

Last 7 days: 5 aligned · 1 lapse · 1 unanswered
Next review: Sunday
```

### UX rules

- Show the goal in one short sentence.
- Show the user’s own reason, not generic motivational copy.
- Display only the next relevant action.
- Keep **Help now** permanently reachable with one tap.
- Do not make the current focus compete visually with twenty checklist rows.
- Do not show a giant broken streak after a lapse.
- Prefer **“5 of the last 7 days aligned”** over “streak lost.”
- Track how quickly the user returns after a lapse; recovery is a behaviour worth reinforcing.
- Allow the widget to collapse after the focus enters maintenance, but never let it disappear accidentally.

### Important change from the existing DailyPlan logic

The current “No weed today” item is an ordinary checkbox. That can be ticked in the morning before the outcome is known.

For the focus system:

- morning interaction = **commitment/intention**;
- evening interaction = **actual outcome**;
- the app must not treat intention as success.

---

## 3. The five parts of every focus cycle

### A. A precise outcome

Avoid vague goals such as “be healthier” or “smoke less.”

For the first cycle:

- **Outcome:** no cannabis today.
- **Review window:** the last seven days.
- **Cycle intention:** stop using cannabis, with lapses treated as information rather than permission to abandon the cycle.

The app should not prescribe whether someone needs abrupt cessation, tapering, or treatment. That decision may require professional input.

### B. Trigger map

The system should learn *when and why* the behaviour occurs. It needs only a few useful tags:

- time of day;
- location;
- alone / with people;
- emotional state;
- activity immediately before the urge;
- availability of cannabis;
- strength of urge, optionally 1–5.

Do not ask all of these every day. Ask for them only after an urge or use event, and make most fields optional.

Individualised assessment and coping support has performed better than generic cannabis CBT in a randomised trial, with self-efficacy being an important predictor of outcome. This supports learning Nikita’s actual pattern rather than sending generic advice. [Litt et al., 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC6980271/)

### C. If–then plan

The setup flow should create one or two plans in this form:

> **If** I feel the urge to smoke after ___, **then** I will ___ for ten minutes before deciding anything.

The replacement must be chosen by the user and be immediately available. Examples to offer, not impose:

- leave the room or take a short walk;
- drink something and eat if hungry;
- shower;
- start a prepared music, game, or exercise activity;
- message a chosen person;
- use a ten-minute delay timer.

Implementation intentions plus reminders can improve follow-through, but the reminder should repeat the user’s own plan rather than deliver a lecture. [Stawarz et al., 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5730820/)

### D. Friction and replacement

Willpower is a weak system boundary. During setup, ask for concrete environmental changes:

- remove cannabis and smoking equipment from immediate reach;
- decide how to respond to invitations or offers;
- prepare one evening replacement before the usual danger time;
- choose a person who may be contacted;
- decide what small reward is earned by following the process.

A reward should reinforce the desired process, not create shame:

- reward completing the Help now sequence;
- reward an honest check-in;
- reward returning the next day after a lapse;
- optionally reward an aligned week.

### E. Review and adaptation

The system should become more personal each week. It should not endlessly accumulate advice.

Claude’s weekly output should be limited to:

1. what happened;
2. the strongest observed trigger;
3. what helped;
4. one proposed experiment for the next week;
5. one question that needs Nikita’s answer.

Example:

> Five of seven days were cannabis-free. Both use events happened after 22:00 while alone and unplanned. Walking helped in two of three logged urges. Proposal: schedule a prepared out-of-home activity at 21:30 on Friday and Saturday. Approve?

Claude may **propose** changes. It should not silently alter the focus, reminders, rewards, or coping plan.

---

## 4. ADHD-friendly routines

### Morning: 20 seconds

Trigger: first opening of DailyPlan.

- Show the Main Focus.
- Ask for a single tap: **“I intend no weed today.”**
- Show today’s prepared if–then plan.
- Do not ask for journaling.

This is a commitment, not the outcome.

### Before the usual danger window: 10 seconds

Only after the system has enough data to know the likely danger time:

- one reminder;
- the user’s reason;
- the prepared alternative;
- direct link to Help now.

Avoid fixed reminders all day. In an ADHD intervention, SMS reminders produced only limited and inconsistent adherence improvements, which is a warning that reminders can become background noise. [Kenter et al., 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9149073/)

### During an urge: 1–10 minutes

The **I NEED HELP NOW** button opens a zero-navigation rescue screen:

1. “Delay the decision for 10 minutes.”
2. Start timer.
3. Choose one prepared action.
4. Optional: tag the trigger and urge strength.
5. At the end: “Urge passed / still present.”
6. If still present, offer the second prepared action or contact person.

The system must work even if nothing is typed.

### Evening: 30–60 seconds

Trigger: an event-based cue such as “after brushing teeth,” not only an arbitrary clock time.

Ask:

1. Cannabis today? **No / Yes / Prefer not to answer**
2. Strong urge today? **No / Yes**
3. What helped or what triggered it? Optional single tag.
4. One short reflection, optional.

Event-based and consistent cues can support repetition and reduce the need to monitor the clock consciously. [Habit-formation review](https://pmc.ncbi.nlm.nih.gov/articles/PMC12318445/)

### Weekly: 10 minutes on Sunday

- Read the seven daily outcomes and urge events.
- Show a compact pattern summary.
- Let Claude produce the five-part review.
- Ask Nikita to approve, edit, or reject one experiment.
- Set the next review date.

### End-of-cycle review

At four weeks, choose one:

- continue active focus;
- move to stabilising with fewer prompts;
- pause deliberately;
- complete and retain a maintenance check;
- seek additional human support.

Do not automatically replace weed with a new focus just because the calendar reached day 28.

---

## 5. What Claude’s role should be

Claude should be a **structured reflective coach**, not an authority and not a stream of encouragement.

### Claude should

- summarise actual data without moralising;
- identify patterns cautiously;
- distinguish observations from guesses;
- propose one small experiment;
- remember the user-approved plan;
- notice when the system is becoming too complicated;
- reinforce honesty and returning after a lapse;
- say when there is too little data to infer anything.

### Claude should not

- diagnose addiction, ADHD, depression, or another condition;
- manufacture a motivational speech every day;
- infer a psychological cause from one event;
- change goals automatically;
- punish lapses or reset all progress;
- treat missing data as failure;
- optimise engagement with the app instead of the user’s life;
- pretend to replace therapy, medical care, or addiction counselling.

A fully self-guided digital CBT intervention has shown meaningful benefits for adults with ADHD, so structured digital support can be useful; this does not mean that an AI coach is equivalent to that tested treatment. [Attexis RCT](https://pmc.ncbi.nlm.nih.gov/articles/PMC13079232/)

---

## 6. Notification policy

Notifications should be adaptive and scarce.

1. Maximum one planned focus reminder per day by default.
2. No notification if the user has already completed the relevant action.
3. Use the user’s language and if–then plan.
4. Allow snooze, reschedule, and quiet days.
5. After repeated dismissal, ask whether the reminder should change; do not increase frequency.
6. Never put sensitive details such as “weed” on the lock screen unless explicitly enabled.
7. Reduce reminders during stabilising.
8. Keep Help now available without a notification.

The app’s job is to make the focus visible at the right moment, not visible every moment.

---

## 7. Progress model

Show several forms of progress so one lapse cannot erase the whole story.

### Primary

- aligned days in the last 7 and 30 days;
- return time after a lapse;
- completed evening check-ins;
- Help now attempts and whether an urge passed;
- current cycle state.

### Optional diagnostic signals

- common trigger;
- common danger time;
- sleep quality;
- mood;
- money not spent.

Do not use XP as the primary measure of substance use. XP is appropriate for ordinary tasks, but it can trivialise the outcome or encourage dishonest ticking.

Do not rank days as “good” or “bad.” Store what happened.

---

## 8. Architecture that fits the current app

Keep sensitive behaviour data in the authenticated Firestore subtree, never in the public repository.

Suggested model:

```text
users/{uid}/focus/current
  -> activeCycleId

users/{uid}/focusCycles/{cycleId}
  -> title, target, reason, state, startDate, reviewDate,
     ifThenPlans[], replacementActions[], reminderPolicy

users/{uid}/focusCycles/{cycleId}/days/{YYYY-MM-DD}
  -> intention, outcome, strongestUrge, triggerTag,
     reflection, checkedAt

users/{uid}/focusCycles/{cycleId}/events/{eventId}
  -> type: urge | lapse | support,
     timestamp, triggerTag, urgeStrength,
     actionUsed, result
```

Design constraints:

- one active cycle at a time;
- writes scoped to the signed-in user under the existing ownership rules;
- local fallback for basic widget state, but Firestore is the cross-device truth;
- no Firebase UID or personal behaviour history committed to Git;
- export a bounded date range for Claude, not the entire life history;
- user-approved changes carry an audit timestamp;
- deleting a cycle should require confirmation and offer export first.

DailyPlan should derive only the focus actions relevant today. Focus outcome data should remain separate from ordinary tick data.

---

## 9. MVP: build only this first

### Phase 1 — useful without AI

1. Main Focus widget.
2. One active focus-cycle document.
3. Morning intention.
4. Evening outcome check-in.
5. Last-seven-days summary.
6. Help now screen with ten-minute timer and prepared actions.
7. Manual Sunday review screen.

### Phase 2 — Claude as coach

1. Generate a bounded seven-day data summary.
2. Ask Claude for the five-part weekly review.
3. Save the proposed experiment separately.
4. Require Nikita’s approval before applying it.
5. Store the approved experiment for the next review.

### Phase 3 — adaptive support

1. Trigger-pattern detection.
2. One context-aware reminder.
3. Stabilising state with fading prompts.
4. Reusable templates for bedtime, spending, exercise, or another focus.

Do not begin with conversational AI, complex gamification, prediction, push notifications, or multiple simultaneous goals. The first test is whether the widget and routines help in a real difficult evening.

---

## 10. First-cycle setup questions

The UI should ask Nikita these questions before implementation is considered complete:

1. What does “quit weed” mean for this cycle: complete abstinence starting now, a chosen quit date, or a plan agreed with a professional?
2. What are the three most common situations in which you smoke?
3. What immediate benefit does weed provide in each situation?
4. What replacement is realistic in under two minutes?
5. What time or event begins the usual danger window?
6. Who, if anyone, may be contacted?
7. Which wording may appear on the lock screen?
8. What would make an honest evening check-in feel safe rather than punitive?
9. What small weekly reward is meaningful and affordable?
10. What signs would mean that app support is not enough?

---

## 11. Safety boundary

Second Brain can support self-observation, planning, coping actions, and accountability. It should not present itself as treatment.

If stopping feels unmanageable, use is escalating, withdrawal or mood changes become distressing, or the process is affecting safety, work, or relationships, involve a doctor, therapist, or addiction counsellor. In Germany, [DigiSucht](https://www.suchtberatung.digital/) provides professional, anonymous, free digital counselling, including for cannabis; it is supported through Germany’s public addiction-help system. [Federal information](https://www.bundesdrogenbeauftragter.de/service/beratungsangebote/)

---

## Product decision

**Build the Main Focus widget and the weed cycle first.**

Do not start by building a universal life coach. Let the system earn complexity. If the first cycle reliably helps Nikita notice triggers, interrupt urges, report outcomes honestly, and return quickly after a lapse, the same structure can later support “in bed before midnight,” spending control, meditation, or another behaviour without redesigning the product.
