# TCI Live Cams

A Caicos Media directory of live beach cams across Turks & Caicos, with current weather, wind, sea conditions and sunrise/sunset times.

- Single static page: `index.html` (no build step)
- Branding follows the Caicos Media Refresh Branding Guideline (Red Hat Display, Caribbean Deep Blue / Light Blue / Aquamarine / White Sand)
- Conditions: [Open-Meteo](https://open-meteo.com/) forecast and marine APIs (free, no key)
- Map: Leaflet + OpenStreetMap
- "Add your cam" form opens a prefilled email to hello@caicosmedia.tc

## Adding a cam

Add an entry to the `cams` array near the bottom of `index.html` with `name`, `island`, `area`, `lat`, `lng`, `desc`, and `links`. New islands get a filter chip automatically.

## Publishing

Settings → Pages → Deploy from branch → `main` / root. Custom domain: comms.caicosmedia.tc (see `CNAME`). DNS needs a CNAME record `comms` pointing to `caicosmedia.github.io`.

## Brand assets

Put the real logo file in `assets/`:
- `assets/logo-horizontal.png`: LOGOTYPE HORIZONTAL.png from the Caicos Media Brand Drive folder (shown white on the dark header)

If the file is missing, the page falls back to a vector version of the logo mark.

## Cam thumbnails

Add `img:"assets/cams/<name>.jpg"` to any cam entry to show a photo instead of the illustrated placeholder.

## Automatic cam snapshots

`.github/workflows/deploy.yml` deploys the site to GitHub Pages on every push and every 3 hours. Before each deploy, `scripts/thumbnails.mjs` opens each cam's first link in a headless browser, screenshots the live player, and saves it as `assets/cams/<slug>.jpg`. Cams it can't capture keep the illustrated placeholder. Requires Settings → Pages → Source: **GitHub Actions**.
