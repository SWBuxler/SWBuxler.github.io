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
