/**
 * Pure functions for entity discovery and classification.
 * No side effects, no DOM, no HA runtime dependency.
 * Open for extension: add new buckets to classify() without touching the card.
 */

import { deviceLabel, uniqueLabels } from './utils.js';

/**
 * Returns all entities that belong to the given area.
 * Covers two assignment paths:
 *   1. Direct  — entity.area_id === areaId
 *   2. Via device — entity.device_id → device.area_id === areaId
 */
export function getAreaEntities(hass, areaId) {
  const { entities = {}, devices = {}, states = {} } = hass;

  return Object.keys(states).reduce((acc, entityId) => {
    const entry = entities[entityId];
    if (!entry || entry.hidden_by) return acc;

    const direct    = entry.area_id === areaId;
    const viaDevice = entry.device_id && devices[entry.device_id]?.area_id === areaId;

    if (direct || viaDevice) acc.push({ entityId, state: states[entityId], deviceId: entry.device_id ?? null });
    return acc;
  }, []);
}

/**
 * Applies entity filtering config to a discovered entity list.
 *
 * Whitelist mode — triggered when config.entities is set:
 *   Returns exactly those entity IDs from hass.states, in order. Area discovery is ignored.
 *
 * Normal mode (config.entities absent):
 *   - exclude_entities: entity IDs to drop from area discovery
 *   - add_entities:     entity IDs to force-add (even from outside the area)
 */
export function filterEntities(areaEntities, config, hass) {
  if (config.entities?.length) {
    return config.entities
      .map(entityId => {
        const state = hass.states?.[entityId];
        return state ? { entityId, state, deviceId: hass.entities?.[entityId]?.device_id ?? null } : null;
      })
      .filter(Boolean);
  }

  const exclude = new Set(config.exclude_entities ?? []);
  const add     = config.add_entities ?? [];

  const filtered = areaEntities.filter(e => !exclude.has(e.entityId));

  for (const entityId of add) {
    if (filtered.some(e => e.entityId === entityId)) continue;
    const state = hass.states?.[entityId];
    if (state) filtered.push({ entityId, state, deviceId: hass.entities?.[entityId]?.device_id ?? null });
  }

  return filtered;
}

// Domains that are always read-only across HA integrations — no meaningful service to
// call, more-info is just a display. Never swept into camera controls/settings.
// (`update` isn't listed — it's diverted to its own bucket earlier and never reaches `others`.)
const PASSIVE_DOMAINS = new Set(['sensor', 'binary_sensor', 'image']);

// device_class values a weather station reports beyond temperature/humidity — grouped
// into a single compact chip instead of cluttering the strip with one chip per reading.
const WEATHER_DC = new Set(['wind_speed', 'precipitation', 'illuminance', 'sound_pressure']);

// PTZ button suffixes (English + Italian, the two integrations seen in the wild).
// `entity_id` slugs from an integration's translation keys are stable/unlocalized,
// unlike `friendly_name` — safe to pattern-match on.
const PTZ_DIRECTION = { up: 'up', down: 'down', left: 'left', right: 'right', su: 'up', giu: 'down', sinistra: 'left', destra: 'right' };
const PTZ_RE = new RegExp(`ptz.*_(${Object.keys(PTZ_DIRECTION).join('|')})$`, 'i');

// Contact sensors (door/window/garage) — a device_class family, like WEATHER_DC,
// grouped into their own always-visible bucket instead of the generic chip
// strip. Kept out of `others` specifically so a contact sensor + its own
// battery entity (2 entities on one device) doesn't trip classify()'s
// device sweep below and get buried behind a Diagnostics tab.
const OPENING_DC = new Set(['door', 'window', 'opening', 'garage_door']);

// HA has no dedicated device_class for dew point — integrations expose it as
// device_class: temperature (same unit, °C), so it slips into the ambient
// temperature bucket and skews average() unless matched out by entity_id slug
// first (stable/unlocalized, like PTZ_RE above — unlike friendly_name/icon).
const DEW_POINT_RE = /_dew_point$/i;

// Camera privacy/suspend switches (English + Italian, same PTZ_RE reasoning) —
// when on, the camera integration stops updating entity_picture/stream, so the
// area card must hide the stale preview instead of showing a frozen image.
const PRIVACY_RE = /_(privacy|riservatezza|suspend|sospensione)$/i;

/**
 * Buckets a flat entity list into semantic groups by domain / device_class.
 * Each bucket is an array of { entityId, state } items (ptz items also carry `direction`).
 * The `others` bucket feeds the generic chip strip.
 */
export function classify(areaEntities) {
  const out = {
    lights: [], climate: [],
    temperatures: [], humidities: [], weathers: [],
    motions: [], occupancy: [], openings: [], tampers: [],
    smokes: [], gases: [], moistures: [],
    batteries: [], problems: [],
    cameras: [], cameraPrivacy: [], controls: [], settings: [], ptz: [], updates: [],
    others: [], diagnostics: [],
  };

  for (const item of areaEntities) {
    const { entityId, state } = item;
    const domain = entityId.split('.')[0];
    const dc     = state.attributes?.device_class ?? '';
    const val    = state.state;

    if      (domain === 'light')                                                            out.lights.push(item);
    else if (domain === 'climate')                                                          out.climate.push(item);
    else if (domain === 'camera')                                                           out.cameras.push(item);
    else if (domain === 'update'         && val !== 'unavailable')                          out.updates.push(item);
    else if (domain === 'sensor'        && dc === 'temperature' && DEW_POINT_RE.test(entityId)) out.weathers.push(item);
    else if (domain === 'sensor'        && dc === 'temperature')                            out.temperatures.push(item);
    else if (domain === 'sensor'        && dc === 'humidity')                               out.humidities.push(item);
    else if (domain === 'sensor'        && WEATHER_DC.has(dc))                              out.weathers.push(item);
    else if (domain === 'binary_sensor' && dc === 'motion')                                 out.motions.push(item);
    else if (domain === 'binary_sensor' && dc === 'occupancy')                              out.occupancy.push(item);
    // `val !== 'unavailable'` guards on both branches below: an offline
    // contact/tamper sensor must still fall through to the generic
    // `val === 'unavailable'` problems catch further down, not get silently
    // swallowed into a bucket that only ever renders "closed"/"normal".
    else if (domain === 'binary_sensor' && OPENING_DC.has(dc) && val !== 'unavailable')     out.openings.push(item);
    // Own bucket, same reasoning as openings: a tamper sensor shares its
    // device with the contact sensor + battery, so it needs to stay out of
    // `others` too — and it reads clearer as its own shield badge next to
    // the door/window state than folded into the generic problems alert.
    else if (domain === 'binary_sensor' && dc === 'tamper' && val !== 'unavailable')        out.tampers.push(item);
    else if (domain === 'binary_sensor' && dc === 'smoke')                                  out.smokes.push(item);
    else if (domain === 'binary_sensor' && dc === 'gas')                                    out.gases.push(item);
    else if (domain === 'binary_sensor' && dc === 'moisture')                               out.moistures.push(item);
    else if (domain === 'sensor'        && dc === 'battery' && val !== 'unavailable') { out.batteries.push(item); out.others.push(item); }
    else if (domain === 'switch'        && PRIVACY_RE.test(entityId))               { out.cameraPrivacy.push(item); out.others.push(item); }
    else if (val === 'unavailable' || (domain === 'binary_sensor' && ['problem', 'safety'].includes(dc) && val === 'on'))
                                                                                            out.problems.push(item);
    else if (domain === 'siren')                                                            out.controls.push(item);
    else if (domain === 'button') {
      const match = entityId.match(PTZ_RE);
      if (match) out.ptz.push({ ...item, direction: PTZ_DIRECTION[match[1].toLowerCase()] });
      else       out.controls.push(item);
    }
    else                                                                                    out.others.push(item);
  }

  // Any device pushing more than one entity into `others` gets swept into the
  // Controls/Settings/Diagnostics tabs instead of padding out the generic chip
  // strip — originally limited to devices sharing a camera, but a lone IR
  // blaster or Zigbee dimmer can just as easily push a dozen switches/selects/
  // numbers into an area with no camera at all. Split by "press to act" vs
  // "configure": siren/button already landed in `controls` unconditionally
  // above (they can never reach this sweep); everything else operable here is
  // a settings-style toggle, so it goes to `settings`. Read-only domains
  // (plain sensors, image snapshots) go to `diagnostics`.
  const othersByDevice = new Map();
  for (const item of out.others) {
    if (!item.deviceId) continue;
    if (!othersByDevice.has(item.deviceId)) othersByDevice.set(item.deviceId, []);
    othersByDevice.get(item.deviceId).push(item);
  }

  const stillOthers = [];
  for (const item of out.others) {
    const deviceItems = item.deviceId ? othersByDevice.get(item.deviceId) : null;
    if (!deviceItems || deviceItems.length < 2) { stillOthers.push(item); continue; }
    const domain = item.entityId.split('.')[0];
    if (PASSIVE_DOMAINS.has(domain)) out.diagnostics.push(item);
    else out.settings.push(item);
  }
  out.others = stillOthers;

  return out;
}

// Label collisions only matter within the same rendered pill — once tabs are
// per-device, that's a device's own controls+settings+diagnostics segments
// (ptz segments carry no label, so they're excluded), not the whole area.
// Deduping per role *before* grouping (the old fixed Controls/Settings/
// Diagnostics-tab world) was too broad — two unrelated devices' items
// sharing a label got needlessly disambiguated even though they now render
// in separate tabs — and too narrow — a settings item and a diagnostics
// item on the *same* device, sharing a tab, never got compared against each
// other since each role was deduped in its own array. Running it once per
// device, across all three label-bearing roles combined, fixes both.
function dedupeBucketLabels(bucket) {
  const { controls, settings, diagnostics } = bucket;
  const combined = uniqueLabels([...controls, ...settings, ...diagnostics]);
  return {
    ptz: bucket.ptz,
    controls:    combined.slice(0, controls.length),
    settings:    combined.slice(controls.length, controls.length + settings.length),
    diagnostics: combined.slice(controls.length + settings.length),
  };
}

/**
 * Regroups the Controls/Settings/Diagnostics tab pools (ptz/controls/settings/
 * diagnostics — the display-mapped arrays from viewModel.js buildViewModel,
 * each item still carrying its original `deviceId`) by physical device, so
 * the tab strip reads "which device is this" instead of "what kind of action
 * is this". A device pushing only 1 item into these pools isn't worth its own
 * tab — it folds into a shared `__other__` group, same threshold philosophy as
 * classify()'s device-link sweep. Entities with no deviceId at all always land
 * in `__other__` too (can't attribute them to one physical device).
 *
 * Tab order: the device owning the area's camera (if any) first, then by
 * descending item count, `__other__` always last.
 *
 * Returns [{ key, label, ptz, controls, settings, diagnostics }], where each
 * of ptz/controls/settings/diagnostics is the device's own subset of that
 * pool — feed straight into the existing renderPtzChip/renderControlsChip/
 * renderSettingsChip/renderDiagnosticsChip template functions unchanged.
 */
export function groupTabsByDevice(hass, { ptz, controls, settings, diagnostics }, cameraDeviceId = null) {
  const pools = { ptz, controls, settings, diagnostics };
  const emptyBucket = () => ({ ptz: [], controls: [], settings: [], diagnostics: [] });
  const countOf = b => b.ptz.length + b.controls.length + b.settings.length + b.diagnostics.length;

  const byDevice = new Map();
  for (const [role, list] of Object.entries(pools)) {
    for (const item of list) {
      const deviceId = item.deviceId ?? null;
      if (!byDevice.has(deviceId)) byDevice.set(deviceId, emptyBucket());
      byDevice.get(deviceId)[role].push(item);
    }
  }

  const groups = [];
  let other  = emptyBucket();
  for (const [deviceId, bucket] of byDevice) {
    if (deviceId == null || countOf(bucket) < 2) {
      for (const role of ['ptz', 'controls', 'settings', 'diagnostics']) other[role].push(...bucket[role]);
    } else {
      const deduped  = dedupeBucketLabels(bucket);
      const allItems = [...deduped.ptz, ...deduped.controls, ...deduped.settings, ...deduped.diagnostics];
      groups.push({ key: deviceId, label: deviceLabel(hass, deviceId, allItems), ...deduped });
    }
  }
  other = dedupeBucketLabels(other);

  groups.sort((a, b) => {
    if (a.key === cameraDeviceId) return -1;
    if (b.key === cameraDeviceId) return 1;
    return countOf(b) - countOf(a);
  });

  if (countOf(other) > 0) groups.push({ key: '__other__', label: 'Other', ...other });

  return groups;
}
