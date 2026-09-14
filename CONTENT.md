# Content checklist

Everything the site needs from Seth. Nothing here was invented — each item is a
real gap. Send answers back in any form (voice memo, bullets, a doc) and I'll
write them into the pages.

## 1. Identity — blocks the hero, footer, and every link preview

- [ ] School name and degree ("B.S. Computer Science, ___")
- [ ] Graduation month + year
- [ ] Location, and whether he's open to relocating / remote
- [ ] What he's targeting: backend? full-stack? new-grad SWE generally?
- [ ] Email to publish
- [ ] GitHub URL
- [ ] LinkedIn URL
- [ ] Domain to buy (see README) — needed for the OG tags
- [ ] Résumé PDF → `assets/files/seth-hartzler-resume.pdf`
- [ ] Headshot, optional → `assets/img/`

## 2. Dates — I guessed, please correct

I inferred these from the brief. **Both need confirming:**

| | What I have | Correct? |
|---|---|---|
| Solinftec | 2021 – 2023 | |
| Contango | 2023 – 2026 | |
| Graduation | 2026 or 2027? | |

The brief said Contango ran from his senior year of high school "up until his
senior year of college," which implies he graduates in 2027, not 2026. Worth
getting right — it's the first thing a recruiter checks.

## 3. Experience — two roles

For **each** of Contango and Solinftec:

- [ ] Exact job title
- [ ] Employment type (intern / part-time / full-time — and whether it changed)
- [ ] 2–3 sentences: what the company does, what he owned
- [ ] 2–3 bullets of shipped work — system, stack, outcome

## 4. The three projects

Names and slugs are in place; the write-ups are not. **Open question: are all three
Contango, or are some from Solinftec?** The pages currently say Contango.

| Project | Page |
|---|---|
| Project QQQ — AI-enabled VOIP transcription, sentiment, extraction | `projects/project-qqq.html` |
| Project Ghostbusters — "which farmer are you gonna call?" | `projects/project-ghostbusters.html` |
| Interactive Commodity Trading Positions Report | `projects/positions-report.html` |

For **each** of the three, the page has these sections waiting:

- [ ] One-sentence summary a non-expert understands
- [ ] Role, timeline, stack, team size
- [ ] **The problem** — what was broken before, who felt it
- [ ] **What I built** — the system, three key pieces
- [ ] **Decisions and tradeoffs** — 1–2 real forks in the road *(the highest-value section on the whole site)*
- [ ] **Hard parts** — what took three tries
- [ ] **Outcome** — what changed, still in production?
- [ ] **What I'd do differently**

## 5. The three video demos

**Done.** All three are transcoded, in place, and wired to their pages:

| Project | Source | Length | Shipped file |
|---|---|---|---|
| Project QQQ | `voip.mov` | 4:29 | `assets/files/project-qqq-demo.mp4` |
| Project Ghostbusters | `Selection Demo.mov` | 2:27 | `assets/files/project-ghostbusters-demo.mp4` |
| Interactive Positions Report | `Position Report.mov` | 1:47 | `assets/files/positions-report-demo.mp4` |

Two things still open on them:

- [ ] **A caption per video** — one line saying what the viewer is watching.
      Each page has the duration filled in and a TODO for the rest.
- [ ] **Contango sign-off on what's visible on screen** — customer names,
      account numbers, live pricing. Nobody has reviewed the frames yet.
- [ ] **`Selection Demo.mov` → Ghostbusters is my inference**, from the name and
      by elimination. Confirm it's the right pairing.
- [ ] **QQQ runs 4:29** — roughly twice the length that holds attention on a
      portfolio. Worth cutting to about two minutes if there's an obvious
      section to lose.

## 6. The intro (top of `index.html`)

Five beats. Placeholders to fill:

- [ ] Beat 1 — first language, and the first thing that actually worked
- [ ] Beat 2 — what he built first, who used it
- [ ] Beat 3 — Solinftec stack specifics; Contango system owned / project shaped
- [ ] **Beat 5 — Seth must sign off on this one personally.** It's real copy,
      not placeholder: two columns arguing where he hand-codes (machine control
      and field devices, money-correct paths, domain logic with no precedent)
      versus where he goes AI-driven (greenfield tools, breadth work,
      exploration). This is the beat an interviewer will push on hardest —
      *"tell me about a time you decided not to use AI."* He needs to recognise
      himself in it or rewrite it, with a real example behind each bullet.

Trimmed from nine beats to five: the two employer beats merged into one, the
"it matters more" beat folded into the two-modes beat, and the payoff/CTA beats
dropped because the real projects and contact block now sit directly below.

## 7. About page## 7. About page

Six headings to fill: how it started, Contango, school, how I work, outside of
work. Best approach — talk through each one out loud and transcribe it.

## 8. Clearance

- [ ] Someone at Contango has approved the project write-ups and the videos
- [ ] Same for the Solinftec description
- [ ] No proprietary architecture, customer names, or internal metrics anywhere
