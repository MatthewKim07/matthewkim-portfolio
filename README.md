<div align="center">

# 🗺️ Matthew Kim — Portfolio

**An interactive, atlas-style portfolio. Navigate portfolio sections by exploring a hand-illustrated map.**

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-matthewkim.ca-0d1117?style=for-the-badge&labelColor=0d1117&color=4f8ef7)](https://matthewkim.ca)
&nbsp;
[![MIT License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge&labelColor=0d1117)](./LICENSE)
&nbsp;
[![Static Site](https://img.shields.io/badge/Build-No_Build_Step-f59e0b?style=for-the-badge&labelColor=0d1117&logo=html5&logoColor=white)](./index.html)

</div>

---

## ✨ Features

| | Feature |
|---|---|
| 🌄 | Cinematic cloud intro with animated entrance |
| 🗺️ | Hand-illustrated, pannable & zoomable atlas map |
| 📌 | Map pins that zoom in and open portfolio sections |
| 🎞️ | Smooth intro → map → content transitions |
| ⌨️ | Full keyboard navigation (`Tab`, `Enter`, `Space`, `Esc`) |
| ♿ | `prefers-reduced-motion` support |
| 📬 | Contact form via Formspree (no backend required) |

---

## 🚀 Run Locally

Static site — no install, no build step.

```bash
python3 -m http.server 8080
```

Open **[http://localhost:8080](http://localhost:8080)**

---

## 🗂️ Project Structure

```
matthewkim-portfolio/
├── index.html              ← Intro, map scene, section markup
├── styles.css              ← Visual system, map art, motion
├── script.js               ← State machine, pan/zoom, pin nav
├── data/
│   ├── map-pins.js         ← Pin positions & camera targets  ← edit here for map
│   └── portfolio-data.js   ← Skills, projects, experience    ← edit here for content
└── assets/                 ← Icons, resume, media
```

**App state flow:** `INTRO` → `TRANSITIONING` → `MAP` ⇌ `CONTENT`

---

## ✏️ Editing Guide

### 📌 Map Pins — `data/map-pins.js`

Each pin entry controls a map hotspot:

| Field | Description |
|---|---|
| `id` | Target section: `about` `education` `skills` `projects` `experience` `contact` |
| `x`, `y` | Pin position in map coordinates (map is `1536 × 1024`) |
| `color` | Pin accent color |
| `zoomLevel` | Camera zoom level when opening that section |

### 📋 Portfolio Content — `data/portfolio-data.js`

| Key | What it controls |
|---|---|
| `skills` | Skill groups and items |
| `projects` | Project cards, stack, media, icons |
| `experience` | Timeline entries, logos, highlights |

---

## 📬 Contact Form Setup

Uses **[Formspree](https://formspree.io/)** — no backend needed.

1. Create a free form at [formspree.io](https://formspree.io/)
2. Copy the endpoint: `https://formspree.io/f/xxxxabcd`
3. Replace the placeholder in `script.js`:

```js
CONTACT_FORM_CONFIG.endpoint = "https://formspree.io/f/YOUR_FORM_ID"
```

> **Note:** Free plan = 50 submissions/month. A hidden `_gotcha` field handles basic spam filtering.

---

## ✅ Validation

After any JS edits:

```bash
node --check script.js
```

Manual browser checklist:
- [ ] Intro button triggers transition
- [ ] Intro → map transition is smooth
- [ ] Map pan / zoom works
- [ ] Pins open correct sections
- [ ] Back-to-map returns correctly

---

## 📄 License

Source code is licensed under the **[MIT License](./LICENSE)**.

Non-code assets are excluded — see **[ASSETS-LICENSE.md](./ASSETS-LICENSE.md)**.

Third-party names, logos, and marks are used only for portfolio identification and remain property of their respective owners.
