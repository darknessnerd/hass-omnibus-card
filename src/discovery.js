/**
 * Pure functions for entity discovery and classification.
 * No side effects, no DOM, no HA runtime dependency.
 * Open for extension: add new buckets to classify() without touching the card.
 */

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
// call, more-info is just a display. Never swept into the camera Controls group.
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

/**
 * Buckets a flat entity list into semantic groups by domain / device_class.
 * Each bucket is an array of { entityId, state } items (ptz items also carry `direction`).
 * The `others` bucket feeds the generic chip strip.
 */
export function classify(areaEntities) {
  const out = {
    lights: [], climate: [],
    temperatures: [], humidities: [], weathers: [],
    motions: [], occupancy: [],
    smokes: [], gases: [], moistures: [],
    batteries: [], problems: [],
    cameras: [], controls: [], ptz: [], updates: [],
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
    else if (domain === 'sensor'        && dc === 'temperature')                            out.temperatures.push(item);
    else if (domain === 'sensor'        && dc === 'humidity')                               out.humidities.push(item);
    else if (domain === 'sensor'        && WEATHER_DC.has(dc))                              out.weathers.push(item);
    else if (domain === 'binary_sensor' && dc === 'motion')                                 out.motions.push(item);
    else if (domain === 'binary_sensor' && dc === 'occupancy')                              out.occupancy.push(item);
    else if (domain === 'binary_sensor' && dc === 'smoke')                                  out.smokes.push(item);
    else if (domain === 'binary_sensor' && dc === 'gas')                                    out.gases.push(item);
    else if (domain === 'binary_sensor' && dc === 'moisture')                               out.moistures.push(item);
    else if (domain === 'sensor'        && dc === 'battery' && val !== 'unavailable') { out.batteries.push(item); out.others.push(item); }
    else if (val === 'unavailable' || (domain === 'binary_sensor' && ['problem', 'tamper', 'safety'].includes(dc) && val === 'on'))
                                                                                            out.problems.push(item);
    else if (domain === 'siren')                                                            out.controls.push(item);
    else if (domain === 'button') {
      const match = entityId.match(PTZ_RE);
      if (match) out.ptz.push({ ...item, direction: PTZ_DIRECTION[match[1].toLowerCase()] });
      else       out.controls.push(item);
    }
    else                                                                                    out.others.push(item);
  }

  // Any otherwise-generic, *operable* entity (switch, select, number, lock, cover, ...)
  // that shares a device with a discovered camera is a camera control. Read-only domains
  // (plain sensors, image snapshots, update entities) stay chips — they're informational,
  // not controls, even when the same camera device exposes them.
  const cameraDeviceIds = new Set(out.cameras.map(c => c.deviceId).filter(Boolean));
  if (cameraDeviceIds.size) {
    const stillOthers = [];
    const passiveLinked = []; // read-only entities on the same camera device — candidates for the diagnostics group
    for (const item of out.others) {
      const domain = item.entityId.split('.')[0];
      const linked = item.deviceId && cameraDeviceIds.has(item.deviceId);
      if (linked && !PASSIVE_DOMAINS.has(domain)) out.controls.push(item);
      else if (linked && PASSIVE_DOMAINS.has(domain)) passiveLinked.push(item);
      else stillOthers.push(item);
    }
    // A single diagnostic sensor reads fine as a plain chip — only worth its
    // own labeled pill once there are enough of them to actually clutter the strip.
    if (passiveLinked.length > 1) out.diagnostics.push(...passiveLinked);
    else stillOthers.push(...passiveLinked);
    out.others = stillOthers;
  }

  return out;
}
