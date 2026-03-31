# matthewkim-portfolio

Personal portfolio website for Matthew Kim.

## Run Locally

This is a static site with no build step.

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Structure

- `index.html`: intro scene, interactive map scene, and portfolio section markup
- `styles.css`: visual system, map/intro art styles, section UI styles, and motion
- `script.js`: rendering logic, state machine (`intro`/`map`/`content`), map pan/zoom, pin navigation
- `data/portfolio-data.js`: portfolio content source (skills/projects/experience)
- `data/map-pins.js`: editable pin coordinates and camera focus settings
- `assets/`: project/experience/education icons, resume, media

## Edit Map Pins

Update `data/map-pins.js`:

- `id`: section target id (`about`, `education`, `skills`, `projects`, `experience`, `contact`)
- `x`, `y`: pin position in map coordinates
- `color`: pin accent color
- `zoomLevel`: camera zoom value used before opening the section

Map dimensions are in `EXPEDITION_MAP_META` and currently set to `1536 x 1024`.

## Edit Portfolio Content

Update `data/portfolio-data.js`:

- `skills`: skills groups and items
- `projects`: project cards/details, stack, media, icon references
- `experience`: timeline entries, logos, and highlights

## Accessibility + Motion

- Keyboard support for map pins (`Tab`, `Enter`, `Space`)
- Escape closes project detail view
- `prefers-reduced-motion` disables heavy ambient motion/parallax
