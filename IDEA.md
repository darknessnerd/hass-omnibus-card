# Hass Omnibus Card — Home Assistant

## Purpose

`hass-omnibus-card` is a custom Home Assistant Lovelace card designed to provide a compact, intelligent summary of a Home Assistant Area/Room.

The card automatically discovers entities associated with an Area and presents the most relevant information in a compact room-level representation.

Primary use case:

> Represent the current status of a physical room in a single UI component, without manually configuring every entity.

The card is intended for dashboards where multiple rooms need to be represented consistently.

---

## Core Concepts

### Area-based discovery

The main input is a Home Assistant Area.

Example:

`type: custom:hass-omnibus-card`
`area: living_room`

The card automatically discovers relevant entities belonging to that Area.

It can determine and display:

* Area name
* entities
* sensors
* devices
* climate entities
* lights
* occupancy information
* environmental conditions
* alarm/problem states

The Area acts as the primary semantic boundary for the card.

---

## Room Summary

The card provides a high-level representation of the current room state.

It can summarize:

* room temperature
* room humidity
* connected devices
* entity states
* number of devices/entities
* active/problem entities
* occupancy
* environmental warnings
* active lights
* climate state

The goal is to allow the user to understand the room without opening individual entities.

---

## Automatic Entity Discovery

Entities do not necessarily need to be explicitly listed.

The card can discover entities from the configured Area and determine how they should be represented.

This makes the card suitable for dynamic Home Assistant installations where entities are added or removed over time.

An LLM should therefore interpret:

`area -> discover entities -> classify entities -> calculate room summary -> render UI`

rather than:

`manual entity list -> render UI`.

---

## Sensor Support

The card supports multiple sensors and can organize sensor information in different layouts.

Supported concepts include:

* temperature
* humidity
* environmental sensors
* sensors grouped by device class
* multiple sensors in the same room
* sensor averaging
* sensor-specific labels
* clickable sensors
* weather-station sensors (wind speed, precipitation, illuminance, sound pressure) — dedicated icons in the chip strip

Sensor layouts can include:

* default layout
* stacked layout
* bottom layout

Sensors can be opened to display their Home Assistant more-info dialog.

---

## Temperature and Climate

Temperature is treated as a first-class room attribute.

The card can:

* display temperature using the unit supplied by the Home Assistant device
* display climate entities
* visually style climate information
* change climate icon appearance
* apply configurable climate thresholds
* visually indicate heating/cooling/climate states

Climate thresholds can influence the visual representation of the room.

---

## Dynamic Thresholds

The card supports threshold-driven visual behavior.

Thresholds can be used to change:

* icon colors
* entity appearance
* room visual state
* warnings

Threshold conditions can be based on:

* numeric sensor values
* configurable operators
* another Home Assistant entity
* entity state

This allows rules such as:

`temperature > threshold -> warning style`

or:

`humidity > threshold -> different icon/state`

Threshold values can themselves be dynamically obtained from another entity.

### History chart Y axis thresholds

The sparkline supports pinned Y axis bounds via `y_min` and `y_max`:

* `y_min` — pins the scale floor (e.g. `0`); prevents the chart baseline from floating up to the data minimum, which makes small value changes appear as dramatic swings
* `y_max` — pins the scale ceiling

Data is never clipped: if actual values fall below `y_min` or above `y_max`, the scale expands to fit. The overlay min/max labels always show actual data values, not the scale bounds.

---

## State-Based Styling

Visual styling can depend on the exact state or attributes of an entity.

This is useful for entities such as:

* washing machines
* device trackers
* status sensors
* binary/status entities

The card can match:

* exact entity state
* entity attributes

and change the icon/visual representation accordingly.

---

## Occupancy Detection

The card supports room occupancy indicators.

Occupancy can be inferred from:

* motion sensors
* occupancy sensors

The room representation can visually indicate whether the room is occupied.

Conceptually:

`motion/occupancy entity -> occupancy state -> room visual indicator`

---

## Problem Detection

The card can identify entities considered problematic and expose a problem counter.

This provides a room-level health indicator.

Examples of potentially relevant problem states include:

* unavailable/problematic entities
* alarm states
* smoke detection
* gas detection
* water detection

The card can therefore answer:

> "Is something wrong in this room?"

without requiring the user to inspect every entity.

---

## Safety / Alarm Indicators

Special handling exists for:

* smoke
* gas
* water

Alarm states can generate visual indicators on the room card.

These states should be considered higher-priority room information than normal environmental data.

---

## Mold Detection

The card supports mold-related warnings using threshold-based logic.

A mold indicator can:

* evaluate environmental conditions
* use configurable thresholds
* display a warning indicator
* animate the warning state

This allows the room summary to expose potential environmental risks.

---

## Lights

Lights are represented at room level.

The card supports:

* detecting active lights
* visual indication when lights are on
* multiple lights
* RGB light information
* RGB-driven card coloring

A room can therefore visually communicate:

`no lights -> normal state`

`one or more lights on -> illuminated room state`

RGB lights can additionally influence the card appearance.

---

## Camera Preview

The card supports a snapshot preview banner for areas containing a camera entity.

Conceptually:

`camera entity -> entity_picture attribute -> snapshot banner -> tap -> more-info / live view`

* The first `camera.*` entity discovered in the area is used; any additional cameras in the same area fall back to the entity chip strip.
* A pulsing indicator appears while the camera reports `recording`.
* The banner dims and its title notes "(offline)" while the camera reports `unavailable`.
* Disabled via `show_camera: false`.

---

## Controls / Settings / Diagnostics, regrouped by device

Entities that exist purely to operate something (PTZ buttons, siren, IR/status light, audio, sensitivity, alert-sound select — on a camera, an IR blaster, a dehumidifier, or any other multi-entity device) are grouped by *action type* first, then those groups are regrouped by *physical device* into one tab per device — separate from the passive entity chip strip.

Grouping rule:

* `siren` and `button` domain entities always join the "press to act" (Controls) pill, regardless of device.
* Any other otherwise-generic *operable* entity (switch, select, number, lock, cover, …) joins the "configure" (Settings) pill only when it shares a *device* with at least one other qualifying entity (any of controls/settings/diagnostics) — this avoids pulling unrelated switches (e.g. a nearby smart plug on its own single-entity device) into the group just because they're in the same area, while still covering any accessory domain beyond the original switch/select/number set. The threshold is on the device's *total* qualifying-entity count, not per action-type — a device with 5 settings entities and a single diagnostic reading still sweeps that lone reading in too.
* Read-only domains (`sensor`, `binary_sensor`, `image`) never join Controls/Settings, even when the device exposes them alongside operable entities (e.g. an IP-address sensor, a motion-snapshot `image` entity) — they're informational, not something to operate; they join the Diagnostics pill instead (or stay a plain chip if their device doesn't clear the threshold). `update.*` entities never join any of these — they're diverted to their own header-badge bucket before this grouping ever sees them.
* Every device that clears the threshold gets its own exclusive tab — Controls/Settings/Diagnostics/PTZ pills for that device render together inside it. A device that doesn't clear the threshold (≤1 qualifying entity, or no `device_id` at all) folds into a shared "Other" tab instead of getting a dedicated one. Tab order: the camera's device first (if any), then by descending entity count, "Other" last. Tab label resolves from the device registry's own name, falling back to the entities' common `entity_id` prefix.

Interaction differs by domain, not by which tab it lands in:

* `button` → pressed directly (`button.press`)
* `siren` → toggled directly (`siren.toggle`)
* everything else → opens the standard more-info dialog

### PTZ pad — one chip instead of four

A real multi-entity camera device can expose a dozen-plus operable entities (buttons, switches, a select, a number) — grouping them all as individual Controls chips is still cluttered. PTZ buttons are the clearest sub-case: four buttons that all do one job (pan/tilt), so they collapse further into a single directional-pad chip.

* `button` entities whose `entity_id` ends in a recognized PTZ direction suffix (`_ptz_up/down/left/right` — English, or `_ptz_su/giu/sinistra/destra` — Italian) are pulled out of the plain Controls chips into one pad chip containing an arrow segment per direction found (not necessarily all four).
* Each arrow segment is independently clickable and presses its own button entity — grouping is visual only, not a new aggregate action.
* Detection matches on `entity_id`, which is a stable, unlocalized integration slug — unlike `friendly_name`, which is user- and language-dependent.
* Non-PTZ buttons on the same device (e.g. a reboot button) are unaffected and still render as individual Controls chips.

---

## Weather Chip — one chip instead of one per reading

A weather station reports several readings (wind, rain, illuminance, noise…) that individually would be five-plus near-identical chips in the strip. They group into a single chip instead — one icon+value segment per reading, each independently clickable (opens more-info).

* Applies to `sensor` entities with `device_class: wind_speed / precipitation / illuminance / sound_pressure`.
* There's no standard HA device_class for UV index, so UV sensors stay ungrouped, individual chips.
* This is purely a *display* grouping — each segment is still its own entity underneath, clickable independently, no aggregation of values.
* Each segment's icon is color-tinted per device_class (`WEATHER_DC_COLOR` in `constants.js`) and a hairline divider separates segments, so the packed pill still reads as distinct readings rather than one blob.
* Wind gust/max readings share `device_class: wind_speed` with the running average — same icon and color otherwise — so `entityIcon()` swaps in a distinct icon (`mdi:weather-windy-variant`) when the entity_id ends in `_max`/`_gust`/`_peak` (see `WIND_GUST_ICON` in `constants.js`, matched in `utils.js`).

---

## Firmware Update Badge

`update.*` entities reporting an update available (`state: on`) surface as a header badge — the same visual pattern as the low-battery badge — instead of sitting as an easy-to-miss plain chip.

* Badge shows a count when more than one update is pending.
* Tap opens more-info for the (first) pending update.
* An `update` entity with `state: off` (no update pending) produces no badge and no chip — it's simply not shown, consistent with how the battery badge only appears below threshold.
* An `update` entity with `state: unavailable` counts toward the problem badge instead of disappearing entirely — it's diverted to its own bucket only when not unavailable, same guard the battery bucket uses.

---

## Multi-Light Background

The card can change the room background when any light belonging to the room is active.

Conceptually:

`any light ON -> room background active`

This avoids having to manually configure every light as a separate visual element.

---

## Entity Pictures

Entities can display their associated entity picture.

The card supports:

* automatic entity pictures
* optional picture overrides

This can be used to provide richer visual identification of entities.

---

## Entity Labels

Entity names can be displayed underneath entity icons.

This improves identification when several similar entities exist in the same room.

Labels can also be customized.

Custom labels may depend on:

* current entity state
* threshold conditions

Therefore an entity can expose different descriptive text depending on its current condition.

---

## Entity Badges

The card supports dynamic badges.

Badges can be overlaid on entities to provide additional contextual information.

Badges are intended for compact status indicators without consuming additional dashboard space.

---

## Entity Sliders

Entities can optionally be transformed into slider-style controls.

This allows the room card to move beyond read-only status and provide direct interaction with supported entities.

The conceptual model is:

`entity -> visual control -> user interaction -> Home Assistant entity update`

---

## Clickable Entities

Individual sensors/entities can be interactive.

For example:

`click sensor -> Home Assistant more-info dialog`

This allows the summary card to act as a navigation point into detailed entity information.

---

## Full Card Actions

The entire card can be made clickable.

This enables room-level navigation, particularly useful on mobile devices.

Example conceptual behavior:

`click room card -> navigate to room dashboard`

This makes the card suitable as a top-level "room selector".

---

## Room Navigation

The card supports navigation using room/entity configuration.

The Area can therefore function as both:

* data source
* navigation context

This allows a dashboard to represent the home as a collection of room cards.

---

## Custom Names

The displayed Area name can differ from the internal Area ID.

Example:

Internal:

`living_room`

Display:

`Soggiorno`

This separates Home Assistant identifiers from user-facing terminology.

---

## Custom Backgrounds

The card supports customization of backgrounds.

Backgrounds can be associated with:

* Area
* entity
* custom configuration

This allows different rooms to have distinct visual identities.

---

## Custom CSS / Styling

The card supports custom styles.

Styling can be used to customize:

* card appearance
* backgrounds
* borders
* icons
* layout
* visual states

The card can therefore be integrated into customized Home Assistant themes.

---

## Theme Support

The implementation is designed to work with different Home Assistant themes.

Known considerations include:

* standard Home Assistant styling
* iOS themes
* UI Minimalist
* Frosted Glass-style themes

Frosted Glass support can automatically apply transparent/blurred visual effects when the relevant theme is detected.

---

## Responsive Layout

The card respects its available container size.

This makes it appropriate for:

* desktop dashboards
* tablets
* wall panels
* mobile dashboards

The design specifically considers mobile interaction and larger touch targets.

---

## Configurable Features / Flags

Features can be selectively disabled.

The card therefore does not require every supported visual feature to be active.

Examples of configurable behavior include:

* entity styling
* card styling
* sensor presentation
* climate styling
* backgrounds
* labels
* other visual enhancements
* `debug: true` — per-card console.debug on every render (entity states + view-model snapshot; silent in production)

---

## Automatic Sensor Averaging

The card can calculate averaged sensor values based on Home Assistant device classes.

This is particularly useful when a room contains multiple sensors measuring the same environmental property.

Conceptually:

`multiple temperature sensors -> aggregate -> room temperature`

`multiple humidity sensors -> aggregate -> room humidity`

This provides a room-level environmental value rather than forcing the user to choose a single sensor manually.

---

## Performance

The implementation considers dashboards containing many room cards.

State-update events are scoped to the relevant card so that a state change in one room does not unnecessarily wake or update every other room card.

Conceptually:

`entity state change -> identify affected room/card -> update only relevant card`

This is important for large dashboards with many Areas.

---

## Architecture

Technology characteristics:

* Home Assistant custom Lovelace card
* Vanilla JavaScript (ES modules, no framework)
* Native custom elements (HTMLElement + Shadow DOM) — no LitElement
* Vite build — bundles `src/` → `dist/hass-omnibus-card.js`
* Playwright E2E tests with screenshot baselines
* HACS-compatible
* MIT licensed
* Browser-side rendering
* Home Assistant entity/state model
* Area-based entity discovery

Module responsibilities (`src/`):

```
index.js        — registers custom element, emits HACS init log
card.js         — HA lifecycle (setConfig / set hass), hash-diff guard, _update()
viewModel.js    — buildViewModel() — hass/config → plain view-model object (pure)
templates.js    — renderCard() + template functions — (ViewModel) → HTML string (pure)
dom.js          — render(), refreshCameraImage(), bindEvents() — the only DOM writes
discovery.js    — getAreaEntities(), classify(), filterEntities(), groupTabsByDevice()
aggregators.js  — average(), anyOn(), activeLights(), rgbColor() (pure)
sparkline.js    — sparklineSvg() — SVG string generator, y_min/y_max/thresholds
history.js      — callWS history fetch, TTL cache, async callback
events.js       — fireMoreInfo(), navigate()
utils.js        — friendlyLabel(), entityIcon(), deviceLabel()
constants.js    — CARD_TAG, CARD_VERSION, ACTIVE_STATES, icon maps, CLIMATE_MAP
styles.js       — CARD_STYLES CSS string
```

The repository contains:

* `src/` — implementation (modular ES6)
* `tests/` — Playwright E2E tests + snapshot baselines + test fixture
* `dist/` — bundled output (committed for HACS)
* `scripts/` — version sync helper
* configuration/build files

---

# Functional Model for an LLM

An LLM should understand the card as a semantic room summarization engine.

Input:

`Home Assistant Area`

Processing:

1. Identify Area.
2. Discover entities belonging to the Area.
3. Classify entities by domain/device class.
4. Identify environmental sensors.
5. Identify climate entities.
6. Identify lights.
7. Identify occupancy sensors.
8. Identify safety/alarm entities.
9. Detect problematic entities.
10. Evaluate thresholds.
11. Determine room-level visual state.
12. Render relevant entities and summary information.
13. Enable navigation/interactions where configured.

Output:

`compact interactive representation of the current room state`

---

# Supported Semantic Categories

An LLM should classify Home Assistant entities into categories such as:

* climate
* temperature
* humidity
* light
* RGB light
* motion
* occupancy
* smoke
* gas
* water leak
* environmental sensor
* device status
* washing machine/status
* device tracker
* generic sensor
* alarm/problem
* interactive entity

---

# Room State Priority

When generating a room summary, information should be prioritized approximately as follows:

1. Safety alarms
2. Critical/problem entities
3. Occupancy
4. Climate/environmental warnings
5. Climate state
6. Active lights
7. Important device states
8. Normal environmental measurements
9. Secondary entities

The purpose is to make abnormal conditions immediately visible while keeping normal room information compact.

---

# Key Product Characteristics

The most important characteristics of `hass-omnibus-card` are:

* Area-centric
* Automatic entity discovery
* Room-level semantic aggregation
* Climate-aware
* Sensor-aware
* Threshold-aware
* Occupancy-aware
* Problem detection
* Safety indicators
* Dynamic visual states
* Interactive entities
* Room navigation
* Custom labels
* Custom styling
* Theme integration
* Responsive/mobile-friendly
* Performance-aware

---

# What This Card Is NOT

It is not primarily intended to be:

* a complete replacement for Home Assistant's entire dashboard
* a detailed entity control panel
* a historical analytics interface
* a database/query engine
* an AI system

Its main purpose is:

> Convert the large amount of entity/state information belonging to a Home Assistant Area into a compact, human-readable and interactive room summary.

---

# LLM Interpretation

When an LLM sees a Home Assistant Area and its entities, the conceptual behavior implemented by this card can be represented as:

`AREA`
→ `ENTITY DISCOVERY`
→ `ENTITY CLASSIFICATION`
→ `SENSOR AGGREGATION`
→ `STATE ANALYSIS`
→ `THRESHOLD EVALUATION`
→ `PROBLEM DETECTION`
→ `ROOM STATUS`
→ `VISUAL REPRESENTATION`

Therefore, the repository is particularly relevant as a reference architecture for an LLM-generated Home Assistant dashboard that needs to automatically transform raw entity metadata and states into meaningful room-level UI.
