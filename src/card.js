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
    this._controlsCollapsed = null;   // always set by setConfig before first use
  }

  /** Called by HA when the YAML config is parsed or changed. */
  setConfig(config) {
    if (!config?.area && !config?.entities?.length) {
      throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');
    }
    this._config    = { ...config };
    this._stateHash = null;   // force re-render with new config
    this._controlsCollapsed = config.controls_collapsed !== false;
    if (this._hass) this._update();
  }

  /** Toggled by the controls-row collapse icon; re-renders without touching the hash guard. */
  toggleControlsCollapsed() {
    this._controlsCollapsed = !this._controlsCollapsed;
    this._update();
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

    let base;
    if (this._config.entities?.length) {
      base = this._config.entities
        .map(id => ({ entityId: id, state: this._hass.states?.[id] }))
        .filter(e => e.state);
    } else {
      base = getAreaEntities(this._hass, this._config.area);
      for (const id of this._config.add_entities ?? []) {
        if (!base.some(e => e.entityId === id)) {
          const state = this._hass.states?.[id];
          if (state) base.push({ entityId: id, state });
        }
      }
    }

    // include history entity so its state changes trigger re-renders and TTL refresh
    const hcId = this._config.history_chart?.entity_id;
    if (hcId && !base.some(e => e.entityId === hcId)) {
      const state = this._hass.states?.[hcId];
      if (state) base.push({ entityId: hcId, state });
    }

    return base
      .map(({ entityId, state }) =>
        `${entityId}=${state.state}|${state.attributes?.rgb_color ?? ''}|${state.attributes?.current_temperature ?? ''}|${state.attributes?.entity_picture ?? ''}`)
      .sort()
      .join(';');
  }

  _update() {
    let historyPoints = null;
    const hc = this._config?.history_chart;
    if (hc?.entity_id) {
      historyPoints = getHistory(this._hass, hc.entity_id, hc.hours ?? 24, () => this._update(), this);
    }
    const vm = buildViewModel(this._hass, this._config, historyPoints, this._controlsCollapsed);
    if (this._config?.debug) {
      console.debug('[hass-omnibus-card] update', {
        area:      this._config.area,
        hash:      this._stateHash,
        viewModel: vm,
      });
    }
    render(this.shadowRoot, this, vm);
  }
}
