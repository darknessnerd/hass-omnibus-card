/**
 * HassOmnibusCard — HA web component lifecycle only.
 * Delegates all data and rendering to dedicated modules.
 * Single Responsibility: manage the HA interface contract.
 */

import { getAreaEntities }     from './discovery.js';
import { buildViewModel, render } from './renderer.js';
import { getHistory }            from './history.js';

export class HassOmnibusCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass      = null;
    this._config    = null;
    this._stateHash = null;
  }

  /** Called by HA when the YAML config is parsed or changed. */
  setConfig(config) {
    if (!config?.area && !config?.entities?.length) {
      throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');
    }
    this._config    = { ...config };
    this._stateHash = null;   // force re-render with new config
    if (this._hass) this._update();
  }

  /**
   * Called by HA on every state change (high frequency).
   * Hash guard ensures the DOM is only rebuilt when area state actually changes.
   */
  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;

    const hash = this._buildHash();
    if (hash === this._stateHash) return;
    this._stateHash = hash;
    this._update();
  }

  getCardSize() { return 2; }

  static getStubConfig() { return { area: 'living_room', icon: 'mdi:sofa' }; }

  // ── Private ──────────────────────────────────────────────────────────────

  _buildHash() {
    if (!this._hass || !this._config) return '';
    const base = this._config.entities?.length
      ? this._config.entities.map(id => ({ entityId: id, state: this._hass.states?.[id] })).filter(e => e.state)
      : getAreaEntities(this._hass, this._config.area);
    return base
      .map(({ entityId, state }) =>
        `${entityId}=${state.state}|${state.attributes?.rgb_color ?? ''}|${state.attributes?.current_temperature ?? ''}`)
      .sort()
      .join(';');
  }

  _update() {
    let historyPoints = null;
    const hc = this._config?.history_chart;
    if (hc?.entity_id) {
      historyPoints = getHistory(this._hass, hc.entity_id, hc.hours ?? 24, () => this._update());
    }
    const vm = buildViewModel(this._hass, this._config, historyPoints);
    render(this.shadowRoot, this, vm);
  }
}
