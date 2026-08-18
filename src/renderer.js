/**
 * View layer — pure view-model builder + template functions + DOM render.
 *
 * buildViewModel()  — derives all display data from hass + config (no DOM)
 * render()          — writes innerHTML and binds events (one DOM write per update)
 *
 * Template functions are pure: (ViewModel) → HTML string.
 * Adding a new section only requires: a new template fn + one line in renderCard().
 */

import { CLIMATE_MAP, ACTIVE_STATES } from './constants.js';
import { CARD_STYLES }                from './styles.js';
import { getAreaEntities, classify, filterEntities } from './discovery.js';
import { average, anyOn, activeLights, rgbColor } from './aggregators.js';
import { friendlyLabel, entityIcon }  from './utils.js';
import { fireMoreInfo, navigate }     from './events.js';
import { sparklineSvg }              from './sparkline.js';


// ── View model ─────────────────────────────────────────────────────────────

/**
 * Derives all display-relevant data from hass + config.
 * Returns { error } when the area is not found and no name override is set.
 * Pure: no DOM access, no side effects.
 */
export function buildViewModel(hass, config, historyPoints = null) {
  const areaId = config.area;
  const area   = hass.areas?.[areaId];

  if (!area && !config.name && !config.entities?.length) return { error: areaId ?? '(no area)' };

  const raw      = config.entities?.length ? [] : getAreaEntities(hass, areaId);
  const entities = filterEntities(raw, config, hass);
  const c          = classify(entities);
  const onLights    = activeLights(c.lights);
  const lightColor  = rgbColor(onLights);
  const tempVal     = average(c.temperatures);
  const humVal      = average(c.humidities);
  const climate     = c.climate[0] ?? null;
  const [climIcon, climColor] = CLIMATE_MAP[climate?.state?.state] ?? [null, null];
  const moldThreshold = config.mold_threshold ?? 70;
  const navPath     = config.navigate_to || config.tap_action?.navigation_path || null;
  const hc          = config.history_chart ?? null;

  return {
    areaName:     config.name || area?.name || areaId || '',
    cardIcon:     config.icon || area?.icon || 'mdi:home',
    navPath,

    hasLights:     c.lights.length > 0,
    lightCount:    onLights.length,
    offlineLights: c.lights.filter(l => l.state.state === 'unavailable').length,
    lightColor,
    occupied:            anyOn(c.motions) || anyOn(c.occupancy),
    hasOccupancySensors: c.motions.length > 0 || c.occupancy.length > 0,
    problemCount: c.problems.length,

    tempVal,
    humVal,
    tempUnit:     c.temperatures[0]?.state.attributes?.unit_of_measurement ?? '°C',
    tempEntities: c.temperatures,
    humEntities:  c.humidities,

    climate,
    climIcon,
    climColor,

    smokeOn:  anyOn(c.smokes),
    gasOn:    anyOn(c.gases),
    waterOn:  anyOn(c.moistures),
    moldRisk: humVal !== null && humVal >= moldThreshold,

    historyPoints: hc?.entity_id ? historyPoints : null,
    historyColor:  hc?.color ?? 'rgba(3, 169, 244, 0.12)',
    historyChart:  hc,

    // pre-computed chip data keeps template functions free of utility imports
    chipItems: config.show_entities !== false
      ? c.others.slice(0, config.max_entities ?? 6).map(({ entityId, state }) => ({
          entityId,
          isActive: ACTIVE_STATES.has(state.state),
          icon:     entityIcon(entityId, state),
          label:    friendlyLabel(entityId, state),
          title:    `${state.attributes?.friendly_name ?? entityId} — ${state.state}`,
        }))
      : [],
  };
}


// ── Template functions (ViewModel → HTML string) ────────────────────────────

function renderHeader({ areaName, cardIcon, hasLights, lightCount, offlineLights, occupied, hasOccupancySensors, problemCount }) {
  const lightsOff     = lightCount === 0;
  const lightTitle    = lightsOff
    ? (offlineLights > 0 ? `${offlineLights} light${offlineLights !== 1 ? 's' : ''} offline` : 'Lights off')
    : `${lightCount} light${lightCount !== 1 ? 's' : ''} on${offlineLights > 0 ? ` · ${offlineLights} offline` : ''}`;

  return `
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${cardIcon}"></ha-icon>
        <span class="room-name">${areaName}</span>
      </div>
      <div class="header-right">
        ${hasLights ? `
          <div class="badge badge-lights ${lightsOff ? 'off' : ''} ${offlineLights > 0 ? 'has-offline' : ''}"
               title="${lightTitle}">
            <ha-icon icon="mdi:lightbulb${lightsOff ? '-off' : ''}"></ha-icon>
            ${lightCount > 1 ? `<span>${lightCount}</span>` : ''}
          </div>` : ''}
        ${hasOccupancySensors ? `<div class="occupancy-dot ${occupied ? '' : 'idle'}" title="${occupied ? 'Occupied' : 'Not occupied'}"></div>` : ''}
        ${problemCount > 0 ? `
          <div class="badge badge-problems"
               title="${problemCount} problem${problemCount !== 1 ? 's' : ''}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${problemCount > 1 ? `<span>${problemCount}</span>` : ''}
          </div>` : ''}
      </div>
    </div>`;
}

function renderEnvRow({ tempVal, humVal, tempUnit, tempEntities, humEntities, climate, climIcon, climColor }) {
  if (tempVal === null && humVal === null && !climIcon) return '';
  return `
    <div class="env-row">
      ${tempVal !== null ? `
        <div class="env-chip temp"
             data-entity="${tempEntities[0]?.entityId ?? ''}"
             title="${tempEntities.length > 1
               ? `Avg of ${tempEntities.length} sensors`
               : tempEntities[0]?.state.attributes?.friendly_name ?? ''}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${tempVal.toFixed(1)}${tempUnit}</span>
        </div>` : ''}
      ${humVal !== null ? `
        <div class="env-chip hum"
             data-entity="${humEntities[0]?.entityId ?? ''}"
             title="${humEntities.length > 1
               ? `Avg of ${humEntities.length} sensors`
               : humEntities[0]?.state.attributes?.friendly_name ?? ''}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${humVal.toFixed(0)}%</span>
        </div>` : ''}
      ${climIcon ? `
        <div class="env-chip climate"
             style="--climate-color: ${climColor}"
             data-entity="${climate.entityId}"
             title="${climate.state.attributes?.friendly_name ?? climate.entityId}">
          <ha-icon icon="${climIcon}"></ha-icon>
          <span>${climate.state.attributes?.current_temperature != null
            ? `${climate.state.attributes.current_temperature}°`
            : climate.state.state}</span>
        </div>` : ''}
    </div>`;
}

function renderChips({ chipItems }) {
  if (!chipItems.length) return '';
  return `
    <div class="entity-chips">
      ${chipItems.map(({ entityId, isActive, icon, label, title }) => `
        <div class="chip ${isActive ? 'on' : ''}" data-entity="${entityId}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
          <span class="chip-label">${label}</span>
        </div>`).join('')}
    </div>`;
}

function renderAlarmBar({ smokeOn, gasOn, waterOn, moldRisk }) {
  if (!smokeOn && !gasOn && !waterOn && !moldRisk) return '';
  return `
    <div class="alarm-bar">
      ${smokeOn  ? `<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>` : ''}
      ${gasOn    ? `<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>` : ''}
      ${waterOn  ? `<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>` : ''}
      ${moldRisk ? `<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>` : ''}
    </div>`;
}

function renderErrorCard(areaId) {
  return `
    <style>${CARD_STYLES}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${areaId}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`;
}

function renderCard(vm) {
  const hasAlarm  = vm.smokeOn || vm.gasOn || vm.waterOn;
  const bgStyle   = vm.lightColor
    ? `background: linear-gradient(135deg, ${vm.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, #fff)) 60%);`
    : '';
  return `
    <style>${CARD_STYLES}</style>
    <ha-card
      class="${vm.navPath ? 'clickable' : ''} ${hasAlarm ? 'alarm-active' : ''}"
      style="${bgStyle}"
      ${vm.navPath ? `role="button" tabindex="0"` : ''}
      aria-label="${vm.areaName}"
    >
      ${vm.historyPoints ? sparklineSvg(vm.historyPoints, vm.historyColor, vm.historyChart) : ''}
      <div class="card-content">
        ${renderHeader(vm)}
        ${renderEnvRow(vm)}
        ${renderChips(vm)}
        ${renderAlarmBar(vm)}
      </div>
    </ha-card>`;
}


// ── DOM render ──────────────────────────────────────────────────────────────

/**
 * Writes the card HTML into shadowRoot and binds event listeners.
 * Called once per state change that passes the hash guard.
 *
 * @param {ShadowRoot} shadowRoot
 * @param {HTMLElement} host  - the custom element (for fireMoreInfo dispatch)
 * @param {object}      vm    - view model from buildViewModel()
 */
export function render(shadowRoot, host, vm) {
  shadowRoot.innerHTML = vm.error ? renderErrorCard(vm.error) : renderCard(vm);
  if (!vm.error) bindEvents(shadowRoot, host, vm);
}

function bindEvents(shadowRoot, host, { navPath, chipItems }) {
  if (navPath) {
    shadowRoot.querySelector('ha-card').addEventListener('click', e => {
      if (!e.target.closest('.chip') && !e.target.closest('.env-chip') && !e.target.closest('.badge-lights')) navigate(navPath);
    });
  }

  const lightBadge = shadowRoot.querySelector('.badge-lights');
  if (lightBadge && host._config?.area && host._hass?.callService) {
    lightBadge.addEventListener('click', e => {
      e.stopPropagation();
      host._hass.callService('light', 'toggle', { area_id: host._config.area });
    });
  }

  shadowRoot.querySelectorAll('.env-chip[data-entity]').forEach(el => {
    const eid = el.dataset.entity;
    if (eid) el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, eid); });
  });

  shadowRoot.querySelectorAll('.chip[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });
}
