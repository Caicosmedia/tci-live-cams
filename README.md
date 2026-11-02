# TCI Live Cams

A Caicos Media directory of live beach cams across Turks & Caicos, with current weather, wind, sea conditions and sunrise/sunset times.

- Single static page: `index.html` (no build step)
- Branding follows the Caicos Media Refresh Branding Guideline (Red Hat Display, Caribbean Deep Blue / Light Blue / Aquamarine / White Sand)
- Conditions: [Open-Meteo](https://open-meteo.com/) forecast and marine APIs (free, no key)
- Map: Leaflet + OpenStreetMap
- "Add your cam" form opens a prefilled email to hello@caicosmediagroup.com

## Adding a cam

Add an entry to the `cams` array near the bottom of `index.html` with `name`, `island`, `area`, `lat`, `lng`, `desc`, and `links`. New islands get a filter chip automatically.

## Publishing

Settings → Pages → Deploy from branch → `main` / root. The site will be at https://caicosmedia.github.io/tci-live-cams/
