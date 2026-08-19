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

    if (direct || viaDevice) acc.push({ entityId, state: states[entityId] });
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
        return state ? { entityId, state } : null;
      })
      .filter(Boolean);
  }

  const exclude = new Set(config.exclude_entities ?? []);
  const add     = config.add_entities ?? [];

  const filtered = areaEntities.filter(e => !exclude.has(e.entityId));

  for (const entityId of add) {
    if (filtered.some(e => e.entityId === entityId)) continue;
    const state = hass.states?.[entityId];
    if (state) filtered.push({ entityId, state });
  }

  return filtered;
}

/**
 * Buckets a flat entity list into semantic groups by domain / device_class.
 * Each bucket is an array of { entityId, state } items.
 * The `others` bucket feeds the generic chip strip.
 */
export function classify(areaEntities) {
  const out = {
    lights: [], climate: [],
    temperatures: [], humidities: [],
    motions: [], occupancy: [],
    smokes: [], gases: [], moistures: [],
    batteries: [], problems: [], others: [],
  };

  for (const item of areaEntities) {
    const { entityId, state } = item;
    const domain = entityId.split('.')[0];
    const dc     = state.attributes?.device_class ?? '';
    const val    = state.state;

    if      (domain === 'light')                                                            out.lights.push(item);
    else if (domain === 'climate')                                                          out.climate.push(item);
    else if (domain === 'sensor'        && dc === 'temperature')                            out.temperatures.push(item);
    else if (domain === 'sensor'        && dc === 'humidity')                               out.humidities.push(item);
    else if (domain === 'binary_sensor' && dc === 'motion')                                 out.motions.push(item);
    else if (domain === 'binary_sensor' && dc === 'occupancy')                              out.occupancy.push(item);
    else if (domain === 'binary_sensor' && dc === 'smoke')                                  out.smokes.push(item);
    else if (domain === 'binary_sensor' && dc === 'gas')                                    out.gases.push(item);
    else if (domain === 'binary_sensor' && dc === 'moisture')                               out.moistures.push(item);
    else if (domain === 'sensor'        && dc === 'battery' && val !== 'unavailable') { out.batteries.push(item); out.others.push(item); }
    else if (val === 'unavailable' || (domain === 'binary_sensor' && ['problem', 'tamper', 'safety'].includes(dc) && val === 'on'))
                                                                                            out.problems.push(item);
    else                                                                                    out.others.push(item);
  }

  return out;
}
