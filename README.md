
# hass-omnibus-card

A compact, intelligent Home Assistant Lovelace card that summarizes an entire room from a single `area:` ID — no manual entity lists required.

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](src/constants.js)
[![CI](https://github.com/yourusername/hass-omnibus-card/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/hass-omnibus-card/actions/workflows/ci.yml)

> **Development:** `npm install && npm run dev` — opens a live-reload test harness in the browser. No Home Assistant required. See [DEVELOPMENT.md](DEVELOPMENT.md).

---

## How it works

```
area: living_room
      │
      ▼
  Discover all entities assigned to the area (direct or via device)
      │
      ▼
  Classify by domain / device_class
      │
      ├─ lights ──────────► count of active lights, RGB tint
      ├─ climate ─────────► current state + temperature
      ├─ temperature ─────► averaged across all sensors
      ├─ humidity ────────► averaged + mold risk threshold
      ├─ motion/occupancy ► occupied indicator dot
      ├─ smoke/gas/water ─► pulsing alarm bar
      └─ everything else ─► entity chip strip
      │
      ▼
  Render compact card with live state
```

---

## Features

| Feature | Description |
|---|---|
| Area-based discovery | Finds all entities via the HA entity + device registry — no lists |
| Sensor averaging | Multiple temp/humidity sensors → single averaged value |
| Occupancy indicator | Motion or occupancy binary sensors → green pulse dot |
| Light indicator | Active light count badge; RGB light tints the card background |
| Climate state | Heat/cool/auto/dry/fan icons with live temperature |
| Safety alarms | Smoke, gas, water — pulsing alarm bar, high priority |
| Mold risk | Humidity above configurable threshold → warning badge |
| Problem counter | Unavailable entities + problem/tamper binary sensors |
| Entity chip strip | Interactive chips for remaining entities — tap opens more-info |
| Room navigation | Tap card → navigate to any dashboard path |
| Error handling | Clear error card when area ID is wrong or not found |
| Shadow DOM CSS | Styles fully isolated — won't break your theme |
| Performance | Hash diff guard: DOM only rebuilds when area state actually changes |

---

## Installation

### Via HACS (recommended)

1. Open HACS → **Frontend** → **Custom repositories**
2. Add the GitHub repo URL as type **Lovelace**
3. Install **Hass Omnibus Card**
4. Hard-refresh the browser (`Ctrl + Shift + R`)

### Manual

1. Download `dist/hass-omnibus-card.js`
2. Copy to `<config>/www/hass-omnibus-card.js`
3. Add the resource:

**Via UI:** Settings → Dashboards → top-right menu → Resources → Add  
`/local/hass-omnibus-card.js` — type: **JavaScript module**

**Or via YAML:**
```yaml
lovelace:
  resources:
    - url: /local/hass-omnibus-card.js
      type: module
```

4. Hard-refresh the browser

---

## Quick start

```yaml
type: custom:hass-omnibus-card
area: living_room
```

That's it. The card discovers every entity in the area automatically.

---

## Configuration reference

```yaml
type: custom:hass-omnibus-card

# ── Required ──────────────────────────────────────────────────────────
area: living_room          # Home Assistant area_id (not the display name)

# ── Display ───────────────────────────────────────────────────────────
name: Soggiorno            # Override the area display name
icon: mdi:sofa             # Override the card icon (default: area icon or mdi:home)

# ── Navigation ────────────────────────────────────────────────────────
navigate_to: /lovelace/1   # Tap the card body → navigate (SPA, no page reload)

# Alternatively, use the standard tap_action format:
tap_action:
  action: navigate
  navigation_path: /lovelace/1

# ── Entity chips ──────────────────────────────────────────────────────
show_entities: true        # Show the entity chip strip (default: true)
max_entities: 6            # Max chips to display (default: 6)

# ── Environmental thresholds ──────────────────────────────────────────
mold_threshold: 70         # Humidity % above which mold risk badge appears (default: 70)
```

---

## What entities appear where

| Domain / device_class | Where it appears |
|---|---|
| `light.*` | Light count badge (header), RGB background tint |
| `climate.*` | Env row — climate icon + current temperature |
| `sensor` + `device_class: temperature` | Env row — averaged temperature |
| `sensor` + `device_class: humidity` | Env row — averaged humidity + mold check |
| `binary_sensor` + `device_class: motion` | Occupancy dot |
| `binary_sensor` + `device_class: occupancy` | Occupancy dot |
| `binary_sensor` + `device_class: smoke` | Alarm bar |
| `binary_sensor` + `device_class: gas` | Alarm bar |
| `binary_sensor` + `device_class: moisture` | Alarm bar |
| `binary_sensor` + `device_class: problem/tamper/safety` (on) | Problem badge |
| Any entity with state `unavailable` | Problem badge |
| Everything else | Entity chip strip (capped at `max_entities`) |

---

## Examples

### Minimal — living room

```yaml
type: custom:hass-omnibus-card
area: living_room
```

### Custom name and icon + navigation

```yaml
type: custom:hass-omnibus-card
area: living_room
name: Soggiorno
icon: mdi:sofa
navigate_to: /lovelace/soggiorno
```

### Bedroom with strict mold threshold

```yaml
type: custom:hass-omnibus-card
area: bedroom
icon: mdi:bed
mold_threshold: 60
```

### Multiple rooms in a grid

```yaml
type: grid
columns: 2
square: false
cards:
  - type: custom:hass-omnibus-card
    area: living_room
    icon: mdi:sofa
    navigate_to: /lovelace/living

  - type: custom:hass-omnibus-card
    area: kitchen
    icon: mdi:chef-hat
    navigate_to: /lovelace/kitchen

  - type: custom:hass-omnibus-card
    area: bedroom
    icon: mdi:bed
    navigate_to: /lovelace/bedroom

  - type: custom:hass-omnibus-card
    area: bathroom
    icon: mdi:shower
    mold_threshold: 65
```

---

## Visual states

| State | Visual effect |
|---|---|
| Any light on | Warm light badge in header; RGB light tints card background |
| Room occupied | Green pulsing dot in header |
| Problems detected | Red alert badge with count |
| Alarm active (smoke/gas/water) | Card pulses red; alarm bar with badges appears |
| Mold risk | Green mold badge in alarm bar |
| Area not found | Dashed red error card with explanation |

---

## Development & contributing

```bash
npm install          # install dependencies (Vite + Playwright)
npm run dev          # start live-reload dev server → http://localhost:5173/dev.html
npm run build        # bundle src/ → dist/hass-omnibus-card.js
npm test             # run 28 E2E snapshot tests (Playwright + Chromium)
npm run test:update  # regenerate baselines after intentional visual changes
npm run test:ui      # Playwright visual UI for debugging test failures
```

Source is split into single-responsibility modules under `src/`. See [DEVELOPMENT.md](DEVELOPMENT.md) for architecture, module guide, and how to extend the card.

---

## Limitations

- Entity discovery requires entities to be assigned to an area in the HA entity or device registry. Entities with no area assignment (or assigned only via label) are not discovered.
- Entity chip strip shows a maximum of `max_entities` chips. Use `max_entities` to tune.
- Navigation uses `history.pushState` + `location-changed` event — standard HA SPA routing. Does not work if Kiosk mode intercepts navigation.
- No support for `tap_action: call-service` on individual chips (chips always open more-info).

---

## Compatibility

| Environment | Status |
|---|---|
| Home Assistant 2023.4+ | Supported (requires `hass.areas` in frontend) |
| HACS | Supported |
| Themes: default HA | Supported |
| Themes: iOS / UI Minimalist | Supported (uses CSS variables) |
| Themes: Frosted Glass | Supported (card background is transparent-compatible) |
| Mobile / tablet | Supported — touch targets sized for tap |
| Browsers | Any modern browser (ES6+, no polyfills needed) |

---

## License

MIT — see [LICENSE](LICENSE)
