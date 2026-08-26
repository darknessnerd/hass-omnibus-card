/**
 * HassOmnibusCard — HA web component lifecycle only.
 * Delegates all data and rendering to dedicated modules.
 * Single Responsibility: manage the HA interface contract.
 */

import { getAreaEntities }     from './discovery.js';
import { buildViewModel, render, refreshCameraImage } from './renderer.js';
import { getHistory }            from './history.js';

export class HassOmnibusCard extends HTMLElement {

  constructor() {
    super();
    // Creates isolated DOM that won't be affected by external styles
    this.attachShadow({ mode: 'open' });
    this._hass      = null;
    this._config    = null;
    this._stateHash = null;
    // Controls/Settings/Diagnostics tab state: an explicit section key, the
    // '__default__' sentinel (controls_collapsed: false — open whichever tab
    // buildViewModel finds first available), or null (no tab open). Resolved
    // to a concrete key/null in buildViewModel, since only it knows which
    // tabs currently have content.
    this._activeSection = null;
    this._cameraRefreshTimer = null;
  }

  /** Called by HA when the YAML config is parsed or changed. */
  setConfig(config) {
    if (!config?.area && !config?.entities?.length) {
      throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');
    }
    if (this._config?.debug) {
      console.debug('[hass-omnibus-card] set config', { config });
    }
    this._config    = { ...config };
    this._stateHash = null;   // force re-render with new config
    this._activeSection = config.controls_collapsed === false ? '__default__' : null;
    if (this._hass) this._update();
    this._startCameraRefreshTimer();
  }

  /** Dashboard views detach/reattach cards on tab switches — restart the timer each time, drop it on removal. */
  connectedCallback() { this._startCameraRefreshTimer(); }
  disconnectedCallback() { clearInterval(this._cameraRefreshTimer); }

  // On first mount connectedCallback() fires before setConfig() — this._config
  // is still null then, so the no-op guard below is load-bearing, not incidental.
  _startCameraRefreshTimer() {
    if (this._config?.debug) {
      console.debug('[hass-omnibus-card] start camera refresh timer', { interval: this._config?.camera_refresh_interval });
    }
    clearInterval(this._cameraRefreshTimer);
    const minutes = this._config?.camera_refresh_interval;
    if (!minutes || minutes <= 0) return;
    this._cameraRefreshTimer = setInterval(() => refreshCameraImage(this.shadowRoot), minutes * 60_000);
  }

  /** Tab click — exclusive; re-renders without touching the hash guard. */
  setActiveSection(section) {
    if (this._config?.debug) {
      console.debug('[hass-omnibus-card] set active section', { section });
    }
    this._activeSection = this._activeSection === section ? null : section;
    this._update();
  }

  /**
   * Called by HA on every state change (high frequency).
   * Hash guard ensures the DOM is only rebuilt when area state actually changes.
   */
  set hass(hass) {
    if (this._config?.debug) {
      console.debug('[hass-omnibus-card] set hass', { hass });
    }
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
    const vm = buildViewModel(this._hass, this._config, historyPoints, this._activeSection);
    // Collapse the '__default__' sentinel (and any now-stale explicit key
    // whose tab lost its content) down to the concrete key/null buildViewModel
    // resolved — so a later setActiveSection() toggle compares against what's
    // actually showing, and closes it on the first click rather than the second.
    if (!vm.error) this._activeSection = vm.activeSection ?? null;
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
