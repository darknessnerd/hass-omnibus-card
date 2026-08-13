/**
 * HA event helpers — encapsulates the custom event protocol so the rest
 * of the codebase doesn't need to know the HA event names or shapes.
 */

/** Opens the HA more-info dialog for the given entity_id. */
export function fireMoreInfo(element, entityId) {
  element.dispatchEvent(new CustomEvent('hass-more-info', {
    bubbles:  true,
    composed: true,   // must cross the Shadow DOM boundary
    detail:   { entityId },
  }));
}

/** SPA-style navigation compatible with the HA frontend router. */
export function navigate(path) {
  history.pushState(null, '', path);
  window.dispatchEvent(new CustomEvent('location-changed', {
    bubbles:  true,
    composed: true,
    detail:   { replace: false },
  }));
}
