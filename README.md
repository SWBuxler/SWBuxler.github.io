# Seth Hartzler — portfolio

Static HTML. No build step, no dependencies, no npm. Open `index.html` in a
browser and it works.

## Files

```
index.html              One page: 5-beat intro, then hero, experience,
                        projects, contact. The intro is skippable.
about.html              The story
projects/
  _template.html        Copy this to add another project
  project-qqq.html             VOIP transcription / sentiment / extraction
  project-ghostbusters.html    "Which farmer are you gonna call?"
  positions-report.html        Interactive positions report
assets/
  css/site.css          All styling. Colors are tokens at the top.
  css/story.css         Intro-only styles, layered on site.css
  js/site.js            Footer year. That's it.
  js/terminal.js        Window chrome, status/command bar, palette (all pages)
  js/story.js           Intro: word reveals, the log-stream background
  img/                  Posters, OG images, headshot
  files/                Résumé PDF, demo MP4s
CONTENT.md              Everything still needed from Seth
```

## Editing

- **Colors** — the `:root` block at the top of `site.css`. Change the accent
  (`--accent`) in two places (light and dark) and the whole site follows.
- **Adding a project** — copy `projects/_template.html`, replace the
  `__PLACEHOLDER__` tokens, and add a card to the list in `index.html`.
- **Header/nav** — duplicated in each file (that's the cost of no build step).
  Six files to update; keep them in sync.

## The intro

`index.html` opens with a five-beat scroll narrative and then flows straight
into the site — one page, one scroll, no navigation. A **skip intro** button
in the top-right jumps to `#site`, and it fades out once you're past the story.

The handoff is deliberate: over the last half-viewport the glyph stream and
vignette fade to nothing while the sticky header slides down, so the intro
dissolves rather than ending.

The story uses the same centered 68ch column as the rest of the page, so
scrolling out of it doesn't shift the text sideways.

Colour carries the narrative, using only the two colours the Terminal system
already has: phosphor green while the work is hand-built, drained to grey at
the AI question, amber once the leverage arrives. Beat 5 is the one screen
where both appear at once.

To drop the intro: delete the `.st-story` block and `.st-handoff` from
`index.html`, plus `story.css` and `story.js`.

## Videos

Each project page expects `assets/files/<slug>-demo.mp4` and
`assets/img/<slug>-poster.jpg`. `preload="none"` means nothing downloads until
the visitor presses play, so the page stays fast.

The raw screen recordings live in `videos/` and are **git-ignored** — they are
3456x2016 and run to roughly 800 MB together. Only the compressed MP4s ship.
Re-encode with:

```
ffmpeg -i "videos/NAME.mov" -vf "scale=1920:-2,fps=30" \
  -c:v libx264 -crf 28 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 96k -movflags +faststart assets/files/<slug>-demo.mp4
```

`-movflags +faststart` moves the index to the front of the file so playback can
begin before the whole thing has downloaded.

To use YouTube or Loom instead, replace the `<video>` element with the `<iframe>`
shown in the comment directly above it.

Compress with ffmpeg before committing:

```
ffmpeg -i raw.mov -vcodec libx264 -crf 26 -preset slow -vf scale=1920:-2 -acodec aac -b:a 128k project-qqq-demo.mp4
```

Grab a poster frame:

```
ffmpeg -i project-qqq-demo.mp4 -ss 00:00:03 -vframes 1 -q:v 3 project-qqq-poster.jpg
```

## Deploying

Any static host. Cheapest good options:

- **Cloudflare Pages** — drag the folder in, free, fast, custom domain included
- **Netlify** — same, drag-and-drop
- **GitHub Pages** — free, and the repo doubles as a work sample

Buy a domain (`sethhartzler.com`, ~$12/yr at Cloudflare or Namecheap), point it
at the host, then update the `og:url` and `og:image` tags in every page.

## Before launch

- [ ] Every `TODO` is gone — `grep -rn "TODO" .` should return nothing
- [ ] `og:url` / `og:image` point at the real domain
- [ ] Résumé PDF is in place and the link works
- [ ] All four videos play, on desktop and phone
- [ ] Tested at 375px wide
- [ ] Tested in light and dark mode
- [ ] Someone other than Seth has proofread it

## Terminal features

`terminal.js` injects three things on every page rather than duplicating markup
into six HTML files. All of it is progressive enhancement — with JS off the site
is exactly what it was.

- **Window chrome** — fixed title bar showing `seth@hartzler — ~/path`.
- **Bottom bar** — one line doing two jobs, the way vim's does. Status by
  default (file, current section, scroll %). Press `:` or `/`, or click it, and
  it becomes a command prompt with ghost autocomplete, Tab cycling, and history
  persisted in `localStorage`. `Esc` returns it to status.
- **Command palette** — `⌘K` / `Ctrl+K`. Subsequence fuzzy match over every
  page, project and section. Arrows to move, Enter to open.

Commands: `help` `ls` `cd projects|about|home` `open <project>` `cat resume`
`whoami` `contact` `clear`. Every one of them has an equivalent link elsewhere
on the page — the prompt is an accelerator, never the only route to anything.

To add a command or palette entry, edit the `CMDS` and `TARGETS` tables at the
top of `terminal.js`.

### Background

The intro's background is a `tail -f` log stream, not matrix rain. Rate and the
number of parallel columns are driven by scroll position: one slow stream while
the work is hand-built, a stalled cursor with a blinking caret at the AI
question, then three streams at once once the leverage arrives.
