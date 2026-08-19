
# hass-omnibus-card

A compact, intelligent Home Assistant Lovelace card that summarizes an entire room from a single `area:` ID — no manual entity lists required.

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.13.0-green.svg)](src/constants.js)
[![CI](https://github.com/darknessnerd/hass-omnibus-card/actions/workflows/ci.yml/badge.svg)](https://github.com/darknessnerd/hass-omnibus-card/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://darknessnerd.github.io/hass-omnibus-card/dev.html)

> **Development:** `npm install && npm run dev` — opens a live-reload test harness in the browser. No Home Assistant required. See [DEVELOPMENT.md](DEVELOPMENT.md).

---

## How it works

```
area: living_room          entities: [light.x, sensor.y]
      │                               │
      ▼                               ▼
  Discover all entities         Use explicit list
  assigned to the area          (whitelist mode — area ignored)
      │                               │
      ▼                               │
  Apply filters                       │
  (exclude_entities / add_entities)   │
      │                               │
      └───────────────┬───────────────┘
                      ▼
  Classify by domain / device_class
      │
      ├─ lights ──────────► count of active lights, RGB tint
      ├─ climate ─────────► current state + temperature
      ├─ temperature ─────► averaged across all sensors
      ├─ humidity ────────► averaged + mold risk threshold
      ├─ motion/occupancy ► occupied indicator dot
      ├─ smoke/gas/water ─► pulsing alarm bar
      ├─ battery ─────────► chip strip + low-battery badge (badge only when ≤ threshold)
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
| Occupancy indicator | Always-visible dot — green + pulsing when occupied, grey when idle |
| Light indicator | Always-visible badge — colored when on, grey when off; tap to toggle; offline dot when any light unavailable |
| Climate state | Heat/cool/auto/dry/fan icons with live temperature |
| Safety alarms | Smoke, gas, water — pulsing alarm bar, high priority |
| Battery badge | Battery sensors always show as chips; a low-battery badge (lowest charge + level-based icon) additionally appears when any drops to/below `battery_low_threshold` |
| Mold risk | Humidity above configurable threshold → warning badge |
| Problem counter | Unavailable entities + problem/tamper binary sensors |
| Entity chip strip | Interactive chips for remaining entities — tap opens more-info |
| Room navigation | Tap card → navigate to any dashboard path |
| Error handling | Clear error card when area ID is wrong or not found |
| Shadow DOM CSS | Styles fully isolated — won't break your theme |
| Entity filtering | Whitelist mode (`entities`), additive pinning (`add_entities`), exclusion (`exclude_entities`) |
| Performance | Hash diff guard: DOM only rebuilds when area state actually changes |
| History chart | Background sparkline with min/max/period labels; fill zones colored by threshold (clipPath, not gradient) |
| History Y axis | `y_min` / `y_max` pin the sparkline scale floor/ceiling — data never clips, scale expands to fit |
| Debug logging | `debug: true` emits console.debug on every render with entity states and view-model snapshot |

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

# ── Entity filtering ──────────────────────────────────────────────────
entities:                  # Explicit whitelist — skips area discovery entirely (optional)
  - light.ceiling
  - sensor.temperature     # only these entities appear; area: is still used for name/icon

exclude_entities:          # Entity IDs to remove from area discovery (optional)
  - light.ceiling_old
  - sensor.broken_sensor
add_entities:              # Entity IDs to force-add on top of area discovery (optional)
  - sensor.outside_temp    # may be from a different area or unassigned

# ── Entity chips ──────────────────────────────────────────────────────
show_entities: true        # Show the entity chip strip (default: true)
max_entities: 6            # Max chips to display (default: 6)

# ── Environmental thresholds ──────────────────────────────────────────
mold_threshold: 70            # Humidity % above which mold risk badge appears (default: 70)
battery_low_threshold: 20     # Charge % at/below which the battery badge appears (default: 20)

# ── History chart ─────────────────────────────────────────────────────
history_chart:
  entity_id: sensor.temperature   # required — entity to plot
  hours: 24                       # lookback window in hours (default: 24)
  color: 'rgba(255,200,100,0.15)' # baseline fill color (default: semi-transparent primary-color)
  threshold_high: 25              # above this → color_high (optional)
  color_high: 'rgba(244,67,54,0.18)'   # default: red tint
  threshold_low: 18               # below this → color_low (optional)
  color_low: 'rgba(33,150,243,0.18)'   # default: blue tint
  y_min: 0                        # pin Y axis floor — prevents baseline from floating up to data min (optional)
  y_max: 40                       # pin Y axis ceiling (optional)

# ── Debug ──────────────────────────────────────────────────────────────
debug: false                   # true → console.debug on every render with entity states + view-model
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
| `sensor` + `device_class: battery` | Entity chip strip (always) + battery badge (header) when ≤ `battery_low_threshold` |
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

### Entity filtering — whitelist, exclude, or pin external entities

**Whitelist** — show only specific entities, skip area discovery:
```yaml
type: custom:hass-omnibus-card
area: living_room            # still used for name and icon
entities:
  - light.ceiling
  - sensor.temperature
  - climate.hvac
```

**Exclude + pin** — area discovery minus noisy entities, plus cross-area additions:
```yaml
type: custom:hass-omnibus-card
area: living_room
exclude_entities:
  - sensor.humidity_old      # broken sensor — drop from discovery
  - light.hidden_lamp        # redundant light — hide from card
add_entities:
  - sensor.outside_temp      # entity from a different area, pinned here
```

`add_entities` accepts any entity ID known to Home Assistant.

### History chart — temperature sparkline as ambient background

```yaml
type: custom:hass-omnibus-card
area: living_room
history_chart:
  entity_id: sensor.temperature
  hours: 24
```

Temperature thresholds — chart turns red when hot, blue when cold:

```yaml
type: custom:hass-omnibus-card
area: living_room
history_chart:
  entity_id: sensor.temperature
  threshold_high: 26
  threshold_low: 18
```

Pinned Y axis — sparkline always starts at 0, never floats up to the data minimum:

```yaml
type: custom:hass-omnibus-card
area: living_room
history_chart:
  entity_id: sensor.temperature
  y_min: 0
```

Custom baseline color:

```yaml
type: custom:hass-omnibus-card
area: living_room
history_chart:
  entity_id: sensor.temperature
  color: 'rgba(255,152,0,0.18)'
```

### Debug logging

```yaml
type: custom:hass-omnibus-card
area: living_room
debug: true
```

Opens browser DevTools → Console to see `[hass-omnibus-card] update { area, hash, viewModel }` on every render. `viewModel` includes `tempVal`, `humVal`, full entity lists — useful for diagnosing sensor value errors. Silent in production (`debug` absent or `false`).

The sparkline overlays three small labels on the card: `↑ max` (top-right), `↓ min` (bottom-right), and time window (bottom-left). When `threshold_high` or `threshold_low` are set, the threshold value (e.g. `22.0°C`) is also printed directly on the dashed marker line, left-aligned and centered on the line. Threshold zones use SVG `clipPath` — only the portion of the fill that actually exceeds/dips below a threshold is colored, so zone coloring tracks the real data.

When all history points are identical (e.g. a brand-new sensor with only one reading) and no `y_min`/`y_max` is set, the sparkline is hidden — there is no meaningful shape to draw. Set `y_min: 0` to force the chart to render with the value positioned relative to zero.

The chart is fetched once via `hass.callWS` and cached for 5 minutes. First render shows no chart; the SVG appears after the async response resolves — typically imperceptible on a normal page load. When `add_entities` or `history_chart.entity_id` entities are used, their state changes also trigger re-renders and TTL refresh.

**Note:** Requires Home Assistant 2022.6+ (history WebSocket API). No effect on installs that block the `history/history_during_period` WebSocket call.

---

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
| Any light on | Amber badge in header; RGB light tints card background; tap to toggle |
| All lights off | Grey badge in header; tap to turn on |
| Light(s) unavailable | Orange dot on the light badge |
| Room occupied | Green pulsing dot in header |
| Room not occupied | Grey dim dot in header (dot always visible when motion/occupancy sensors exist) |
| Problems detected | Red alert badge with count |
| Alarm active (smoke/gas/water) | Card pulses red; alarm bar with badges appears |
| Mold risk | Green mold badge in alarm bar |
| History value above `threshold_high` | Fill area above threshold line turns `color_high` (red by default); dashed marker line with threshold value label drawn |
| History value below `threshold_low` | Fill area below threshold line turns `color_low` (blue by default); dashed marker line with threshold value label drawn |
| `y_min` / `y_max` set | Sparkline Y axis anchored to fixed floor/ceiling; data never clips, scale expands if data exceeds bounds |
| Area not found | Dashed red error card with explanation |

---

## Development & contributing

```bash
npm install             # install dependencies (Vite + Playwright)
npm run dev             # start live-reload dev server → http://localhost:5173/dev.html
npm run build           # bundle src/ → dist/hass-omnibus-card.js
npm run test:docker     # run 39 E2E tests in Docker (Playwright + Chromium, matches CI)
npm run test:update-ci  # regenerate baselines in Docker after intentional visual changes
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

## Official Documentation & References

This card is built using the official Home Assistant custom card API. For more details on the technical standards and lifecycle used by custom cards, see the [Home Assistant Developer Documentation](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/).

---

## License

MIT — see [LICENSE](LICENSE)
