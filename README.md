# LapTap

A phone-first lap counter for swim, bike, and run. Built for outdoor use: large tap targets, high-contrast black and white, and counts that survive a refresh.

Live site: [laps.letsrace.cc](https://laps.letsrace.cc/)

## Use it

1. Open the site on your phone (or add it to the home screen).
2. Tap the gear to set up the event: disciplines, lap counts, and time precision.
3. On each discipline, tap **Start** to begin timing, then **Tap to complete a lap** as you finish each lap.
4. When every discipline is done, tap **Save screenshot** to share or download a recap.

Progress is stored on the phone in `localStorage`. Undo last tap and Reset are at the bottom.

## Install as an app

The site is a PWA and works offline after the first visit.

- **iPhone / iPad:** Safari → Share → Add to Home Screen
- **Android:** use the on-screen Install prompt, or the browser menu → Install app

## Run locally

Open `index.html` in a browser, or serve the folder with any static server so the service worker can register:

```bash
npx serve .
```

## Project layout

| File | Role |
| --- | --- |
| `index.html` | App UI, styles, and logic |
| `manifest.json` | PWA name, icons, standalone display |
| `sw.js` | Offline cache |
| `icons/` | Favicon, Apple touch icon, and install icons |
| `CNAME` | GitHub Pages host `laps.letsrace.cc` |

No build step and no framework. After changing the cached app shell, bump the cache name in `sw.js`.
