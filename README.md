# matthewkim-portfolio

Personal portfolio website showcasing Matthew Kim's projects, academics, and skills.

## Run Locally

This is a static site with no build step.

1. Open `index.html` directly in a browser, or
2. Serve the folder with any static server:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Project Structure

- `index.html`: page structure, modal shell, and section scaffolding
- `styles.css`: theme variables, layout system, motion, and responsive styles
- `script.js`: rendering + interactions (filters, modal, timeline, nav, parallax)
- `data/portfolio-data.js`: editable content source for skills, projects, and experience
- `assets/`: resume, logos, icons, and project media

## Content Editing

Most portfolio content is centralized in `data/portfolio-data.js`:

- Update `skills` to change toolkit categories and tooltips
- Update `projects` to change cards, filters, and case-study modal content
- Update `experience` to change the timeline and field notes

## Accessibility + Motion

- Keyboard focus styles are enabled throughout
- Modal uses focus trapping and Escape-to-close
- `prefers-reduced-motion` disables heavy motion/parallax effects
