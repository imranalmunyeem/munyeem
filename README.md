# imranalmunyeem.github.io

Personal portfolio — CS PhD researcher with SWE/QA background.

Modern classy aesthetic: warm off-white palette, editorial serif accents, Inter + Instrument Serif typography, card-based sections, light/dark mode. Plain HTML + CSS + a tiny JS file. No build step.

---

## Deploy to GitHub Pages (~2 minutes)

### 1. Create the repo

On GitHub, create a new **public** repo named exactly `imranalmunyeem.github.io`. The `<username>.github.io` naming gives you a clean root URL with no path prefix.

### 2. Push the files

```bash
git clone https://github.com/imranalmunyeem/imranalmunyeem.github.io.git
cd imranalmunyeem.github.io

# Copy index.html, styles.css, script.js, and README.md into this folder.

git add .
git commit -m "Initial portfolio"
git branch -M main
git push -u origin main
```

### 3. Enable Pages

GitHub → **Settings → Pages** → **Source**: *Deploy from a branch* → **Branch**: `main` → `/ (root)` → Save.

Wait ~60 seconds. Live at **https://imranalmunyeem.github.io**.

---

## Before you publish — update these

Open `index.html` and search for the bracketed placeholders:

- `[research area — update me]` → your actual PhD research topic
- `[university]` / `[University — update me]` → your PhD institution
- `[your PhD topic]` → appears twice (about section + timeline)
- The `scholar` link (currently `href="#"`) → your Google Scholar profile URL
- Upload `cv.pdf` to the repo root
- Optional: replace the `IM` avatar initials with a real photo — see below

### Adding a real photo (recommended)

Replace the `<div class="avatar-circle">` block with:

```html
<div class="avatar-circle">
  <img src="profile.jpg" alt="Imran Al Munyeem" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
</div>
```

Then drop a `profile.jpg` (square, ~400×400) into the repo root.

---

## Local development

No build. Either open `index.html` directly, or:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

---

## Iterating with Claude Code

Run `claude` in the repo root. One focused change per session works best:

```
"Add a /publications.html page with the full publication list grouped by year,
 expandable BibTeX for each entry. Match the existing design system — same
 fonts, same palette, same card style."

"Split the Experience section into two: a 'Research' track (PhD + MSc + BSc)
 and an 'Engineering' track (the SWE/QA roles). Side-by-side on desktop,
 stacked on mobile."

"Add a 'Now' section between Hero and About — 3 short lines on what I'm
 reading, building, and thinking about. Keep it subtle, same aesthetic."

"The current project thumbnails use gradients. Swap the first three for
 real screenshots from /assets/projects/ — I'll drop the images in."

"Run Lighthouse on index.html and propose fixes for any metric below 95."
```

A `CLAUDE.md` in the repo root describing your research area, target audience (industry research labs), and design direction will keep Claude Code consistent across sessions.

---

## Design system (so you can extend it)

Everything is driven from CSS variables at the top of `styles.css`:

- **Palette**: warm cream (`--bg: #fbfaf6`) with a deep terracotta accent (`--accent: #9a3412`). Dark mode switches to a warm near-black with amber accent.
- **Fonts**: Inter for UI and body, Instrument Serif for italic accents (name, pull quotes, project glyphs).
- **Spacing**: `--radius-sm/md/lg/xl`, consistent padding rhythm.
- **Shadows**: three tiers, all warm-tinted.

To change the accent color, edit `--accent` and `--accent-soft` in both the `:root` block and the `@media (prefers-color-scheme: dark)` block. That one change propagates everywhere.

---

## Performance

No frameworks, no React, no bundler. Lighthouse target: 100 / 100 / 100 / 100.

Total page weight (before your content additions): ~25 KB of HTML + CSS + JS, plus Google Fonts (~40 KB).
