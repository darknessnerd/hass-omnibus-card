import { ACTIVE_STATES, ICON_BY_DC, ICON_BY_DOMAIN } from './constants.js';

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

  if (dc && ICON_BY_DC[dc])       return resolve(ICON_BY_DC[dc]);
  if (ICON_BY_DOMAIN[domain])     return resolve(ICON_BY_DOMAIN[domain]);
  return 'mdi:help-circle-outline';
}
