import { ACTIVE_STATES, ICON_BY_DC, ICON_BY_DOMAIN, WIND_GUST_ICON } from './constants.js';

// Matches entity_id suffixes for gust/max wind readings — same device_class as the
// running average, so the icon variant has to come from the name, not device_class.
const WIND_GUST_RE = /_(max|gust|peak)$/i;

/**
 * Returns the last word of friendly_name as a compact chip label.
 * Falls back to the entity_id suffix when friendly_name is absent.
 */
export function friendlyLabel(entityId, state) {
  const full = state.attributes?.friendly_name ?? entityId.split('.')[1];
  return full.split(' ').pop();
}

/**
 * De-duplicates last-word chip labels within one rendered group (e.g. two
 * entities that both happen to end in "Allarme"). Each item needs `label`
 * (from friendlyLabel), `fullName` (the untruncated friendly_name/entity_id),
 * and `entityId`. Colliding items grow to the fewest trailing words of
 * fullName that make them unique from each other; if even the full name
 * collides (near-impossible), the entity_id suffix is a guaranteed-unique
 * last resort.
 *
 * Example:
 *   uniqueLabels([
 *     { entityId: 'sensor.a', label: 'Allarme', fullName: 'Cam Codice Del Tipo Di Ultimo Allarme' },
 *     { entityId: 'sensor.b', label: 'Allarme', fullName: 'Cam Nome Dell Ultimo Tipo Di Allarme' },
 *   ]) → labels become 'Di Ultimo Allarme' and 'Tipo Di Allarme' (or similar) — first trailing-word
 *   count where the two no longer match.
 */
export function uniqueLabels(items) {
  const labelCount = new Map();
  for (const item of items) labelCount.set(item.label, (labelCount.get(item.label) ?? 0) + 1);
  if (![...labelCount.values()].some(count => count > 1)) return items;

  const wordsOf = item => item.fullName.trim().split(/\s+/);

  return items.map(item => {
    if (labelCount.get(item.label) === 1) return item;
    const words = wordsOf(item);
    for (let n = 2; n <= words.length; n++) {
      const candidate = words.slice(-n).join(' ');
      const collides = items.some(other => other !== item && wordsOf(other).slice(-n).join(' ') === candidate);
      if (!collides) return { ...item, label: candidate };
    }
    return { ...item, label: item.entityId.split('.')[1] };
  });
}

/**
 * Resolves a display label for a device tab (see discovery.js groupTabsByDevice).
 * Prefers the device registry's own name (real HA always sets this — it's the
 * name shown in Settings → Devices & Services), user override taking priority
 * over the integration-assigned one. Falls back to the longest common leading
 * word-prefix across the device's own entity_ids (e.g. switch.ir_clima_cucina_switch1
 * + switch.ir_clima_cucina_switch2 → "Ir Clima Cucina") for mocks/tests with no
 * device name, and finally to a generic label if even that comes up empty.
 */
export function deviceLabel(hass, deviceId, items) {
  const device = hass.devices?.[deviceId];
  const registryName = device?.name_by_user ?? device?.name;
  if (registryName) return registryName;

  const slugs = items.map(({ entityId }) => entityId.split('.')[1].split('_'));
  let prefix = slugs[0] ?? [];
  for (const slug of slugs.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < slug.length && prefix[i] === slug[i]) i++;
    prefix = prefix.slice(0, i);
  }
  if (!prefix.length) return 'Device';
  return prefix.map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Resolves the best icon for an entity.
 * Priority: entity-defined icon → device_class map → domain map → fallback.
 */
export function entityIcon(entityId, state) {
  if (state.attributes?.icon) return state.attributes.icon;

  const domain   = entityId.split('.')[0];
  const dc       = state.attributes?.device_class ?? '';
  const isActive = ACTIVE_STATES.has(state.state);
  const resolve  = entry => typeof entry === 'string' ? entry : (isActive ? entry.on : entry.off);

  if (domain === 'sensor' && dc === 'battery') return batteryIcon(parseFloat(state.state));
  if (dc === 'wind_speed' && WIND_GUST_RE.test(entityId)) return WIND_GUST_ICON;
  if (dc && ICON_BY_DC[dc])       return resolve(ICON_BY_DC[dc]);
  if (ICON_BY_DOMAIN[domain])     return resolve(ICON_BY_DOMAIN[domain]);
  return 'mdi:help-circle-outline';
}

/**
 * Resolves a threshold config value that may be a plain number, or an
 * entity_id string (e.g. a number/input_number helper) whose current state
 * supplies the value. Falls back when the value is absent or the entity's
 * state isn't a finite number (unavailable/unknown/non-numeric domain).
 *
 * Example:
 *   resolveThreshold(hass, 70, 20)              → 70
 *   resolveThreshold(hass, 'number.mold_max', 20) → parseFloat(hass.states['number.mold_max'].state)
 *   resolveThreshold(hass, null, 20)            → 20
 */
export function resolveThreshold(hass, value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'number') return value;
  const num = parseFloat(hass.states?.[value]?.state);
  return Number.isFinite(num) ? num : fallback;
}

/**
 * Resolves an mdi battery glyph for a charge percentage, mirroring HA's own
 * `battery_icon` helper. Icon names come from the mdi set (see DEVELOPMENT.md
 * → Icon conventions): battery-unknown, battery-alert-variant-outline,
 * battery-10..90, battery.
 */
export function batteryIcon(level) {
  if (level == null || isNaN(level)) return 'mdi:battery-unknown';

  const clamped = Math.min(100, Math.max(0, level));
  if (clamped <= 5)   return 'mdi:battery-alert-variant-outline';
  if (clamped >= 100) return 'mdi:battery';
  return `mdi:battery-${Math.min(90, Math.max(10, Math.round(clamped / 10) * 10))}`;
}
