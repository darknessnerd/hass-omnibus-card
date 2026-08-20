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
