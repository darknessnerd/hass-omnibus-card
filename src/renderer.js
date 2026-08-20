/**
 * View layer — pure view-model builder + template functions + DOM render.
 *
 * buildViewModel()  — derives all display data from hass + config (no DOM)
 * render()          — writes innerHTML and binds events (one DOM write per update)
 *
 * Template functions are pure: (ViewModel) → HTML string.
 * Adding a new section only requires: a new template fn + one line in renderCard().
 */

import { CLIMATE_MAP, ACTIVE_STATES, PTZ_ICON } from './constants.js';
import { CARD_STYLES }                from './styles.js';
import { getAreaEntities, classify, filterEntities } from './discovery.js';
import { average, anyOn, activeLights, rgbColor, lowestBattery } from './aggregators.js';
import { friendlyLabel, entityIcon, batteryIcon }  from './utils.js';
import { fireMoreInfo, navigate }     from './events.js';
import { sparklineSvg, computeScale } from './sparkline.js';


// ── View model ─────────────────────────────────────────────────────────────

/**
 * Derives all display-relevant data from hass + config.
 * Returns { error } when the area is not found and no name override is set.
 * Pure: no DOM access, no side effects.
 */
export function buildViewModel(hass, config, historyPoints = null, controlsCollapsed = false) {
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

  const batteryLowThreshold = config.battery_low_threshold ?? 20;
  const lowBattery = lowestBattery(c.batteries);

  // Only the first camera gets the dedicated preview banner; any additional
  // cameras in the area still need to be reachable, so they fall back to chips.
  const camera       = c.cameras[0] ?? null;
  const extraCameras = c.cameras.slice(1);

  const pendingUpdates = c.updates.filter(u => u.state.state === 'on');

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

    showBatteryBadge: lowBattery != null && lowBattery.value <= batteryLowThreshold,
    batteryValue:     lowBattery?.value ?? null,
    batteryIcon:      lowBattery ? batteryIcon(lowBattery.value) : null,
    batteryEntity:    lowBattery?.entityId ?? null,
    batteryTitle:     lowBattery
      ? `${c.batteries.length > 1 ? `Lowest of ${c.batteries.length} — ` : ''}${lowBattery.state.attributes?.friendly_name ?? lowBattery.entityId}: ${lowBattery.value}%`
      : '',

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

    updateCount:  pendingUpdates.length,
    updateEntity: pendingUpdates[0]?.entityId ?? null,
    updateTitle:  pendingUpdates.length
      ? `${pendingUpdates.length} update${pendingUpdates.length !== 1 ? 's' : ''} available: ${pendingUpdates.map(u => u.state.attributes?.friendly_name ?? u.entityId).join(', ')}`
      : '',

    hasCamera:    config.show_camera !== false && !!camera,
    cameraEntity: camera?.entityId ?? null,
    cameraImage:  camera?.state.attributes?.entity_picture ?? null,
    cameraIcon:   camera ? entityIcon(camera.entityId, camera.state) : null,
    cameraTitle:  camera?.state.attributes?.friendly_name ?? camera?.entityId ?? '',
    cameraState:  camera?.state.state ?? '',
    cameraOffline: camera?.state.state === 'unavailable',

    controlItems: config.show_entities !== false
      ? c.controls.map(({ entityId, state }) => ({
          entityId,
          domain:   entityId.split('.')[0],
          isActive: ACTIVE_STATES.has(state.state),
          icon:     entityIcon(entityId, state),
          label:    friendlyLabel(entityId, state),
          title:    `${state.attributes?.friendly_name ?? entityId} — ${state.state}`,
        }))
      : [],

    collapsibleControls: config.collapsible_controls !== false,
    controlsCollapsed:   config.collapsible_controls !== false && controlsCollapsed,

    // grouped into one pill instead of one chip per PTZ button / weather reading
    ptzItems: config.show_entities !== false
      ? c.ptz.map(({ entityId, state, direction }) => ({
          entityId,
          direction,
          icon:  PTZ_ICON[direction],
          title: state.attributes?.friendly_name ?? entityId,
        }))
      : [],
    weatherItems: config.show_entities !== false
      ? c.weathers.map(({ entityId, state }) => {
          const num  = parseFloat(state.state);
          const unit = state.attributes?.unit_of_measurement ?? '';
          const dc   = state.attributes?.device_class ?? '';
          return {
            entityId,
            dc,
            icon:  entityIcon(entityId, state),
            value: isNaN(num) ? state.state : num.toFixed(1),
            unit,
            title: `${state.attributes?.friendly_name ?? entityId} — ${state.state}${unit}`,
          };
        })
      : [],

    historyPoints: hc?.entity_id ? historyPoints : null,
    historyColor:  hc?.color ?? 'rgba(3, 169, 244, 0.12)',
    historyChart:  hc,
    historyMin:    (hc?.entity_id && historyPoints?.length >= 2) ? Math.min(...historyPoints) : null,
    historyMax:    (hc?.entity_id && historyPoints?.length >= 2) ? Math.max(...historyPoints) : null,
    historyUnit:   hass.states?.[hc?.entity_id]?.attributes?.unit_of_measurement ?? '',
    historyHours:  hc?.hours ?? 24,

    // pre-computed chip data keeps template functions free of utility imports
    chipItems: config.show_entities !== false
      ? [...c.others, ...extraCameras].slice(0, config.max_entities ?? 6).map(({ entityId, state }) => ({
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

function renderHeader({ areaName, cardIcon, hasLights, lightCount, offlineLights, occupied, hasOccupancySensors, problemCount,
                         showBatteryBadge, batteryValue, batteryIcon: batteryIconName, batteryEntity, batteryTitle,
                         updateCount, updateEntity, updateTitle }) {
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
        ${showBatteryBadge ? `
          <div class="badge badge-battery"
               data-entity="${batteryEntity}"
               title="${batteryTitle}">
            <ha-icon icon="${batteryIconName}"></ha-icon>
            <span>${batteryValue}%</span>
          </div>` : ''}
        ${problemCount > 0 ? `
          <div class="badge badge-problems"
               title="${problemCount} problem${problemCount !== 1 ? 's' : ''}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${problemCount > 1 ? `<span>${problemCount}</span>` : ''}
          </div>` : ''}
        ${updateCount > 0 ? `
          <div class="badge badge-update"
               data-entity="${updateEntity}"
               title="${updateTitle}">
            <ha-icon icon="mdi:package-up"></ha-icon>
            ${updateCount > 1 ? `<span>${updateCount}</span>` : ''}
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

function renderWeatherChip({ weatherItems }) {
  if (!weatherItems.length) return '';
  return `
    <div class="chip group-chip weather-chip" title="Weather">
      ${weatherItems.map(({ entityId, dc, icon, value, unit, title }) => `
        <span class="group-seg weather-seg" data-entity="${entityId}" data-dc="${dc}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
          <span class="group-seg-value">${value}${unit ? ' ' + unit : ''}</span>
        </span>`).join('')}
    </div>`;
}

function renderChips({ chipItems, weatherItems }) {
  if (!chipItems.length && !weatherItems.length) return '';
  return `
    <div class="entity-chips">
      ${renderWeatherChip({ weatherItems })}
      ${chipItems.map(({ entityId, isActive, icon, label, title }) => `
        <div class="chip${isActive ? ' on' : ''}" data-entity="${entityId}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
          <span class="chip-label">${label}</span>
        </div>`).join('')}
    </div>`;
}

function renderCameraPreview({ hasCamera, cameraImage, cameraIcon, cameraEntity, cameraTitle, cameraState, cameraOffline }) {
  if (!hasCamera) return '';
  const title = cameraOffline ? `${cameraTitle} (offline)` : cameraTitle;
  return `
    <div class="camera-preview${cameraOffline ? ' offline' : ''}" data-entity="${cameraEntity}" title="${title}">
      ${cameraImage
        ? `<img src="${cameraImage}" alt="${title}" loading="lazy" />`
        : `<div class="camera-placeholder"><ha-icon icon="${cameraIcon}"></ha-icon></div>`}
      ${cameraState === 'recording' ? `<span class="camera-rec-dot" title="Recording"></span>` : ''}
    </div>`;
}

function renderPtzChip({ ptzItems }) {
  if (!ptzItems.length) return '';
  return `
    <div class="chip group-chip control-chip ptz-chip" title="PTZ">
      ${ptzItems.map(({ entityId, direction, icon, title }) => `
        <span class="group-seg ptz-seg" data-entity="${entityId}" data-direction="${direction}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
        </span>`).join('')}
    </div>`;
}

function renderControls({ controlItems, ptzItems, collapsibleControls, controlsCollapsed }) {
  if (!controlItems.length && !ptzItems.length) return '';
  return `
    <div class="controls-row${controlsCollapsed ? ' collapsed' : ''}">
      <span class="controls-label${collapsibleControls ? ' clickable' : ''}"
        ${collapsibleControls ? `role="button" tabindex="0" title="${controlsCollapsed ? 'Expand' : 'Collapse'} controls"` : ''}
        >Controls${collapsibleControls
          ? `<ha-icon class="controls-toggle" icon="mdi:chevron-${controlsCollapsed ? 'down' : 'up'}"></ha-icon>`
          : ''}</span>
      <div class="controls-chips">
        ${renderPtzChip({ ptzItems })}
        ${controlItems.map(({ entityId, domain, isActive, icon, label, title }) => `
          <div class="chip control-chip${isActive ? ' on' : ''}" data-entity="${entityId}" data-domain="${domain}" title="${title}">
            <ha-icon icon="${icon}"></ha-icon>
            <span class="chip-label">${label}</span>
          </div>`).join('')}
      </div>
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

function renderChartOverlay({ historyMin, historyMax, historyUnit: u, historyHours, historyChart: hc }) {
  if (historyMin === null) return '';

  const thresholdLabels = [];
  if (hc?.threshold_high != null || hc?.threshold_low != null) {
    const { min: scaleMin, range } = computeScale(hc, historyMin, historyMax);
    const scaleRange = range || 1;
    const toYPct     = v => (1 - (v - scaleMin) / scaleRange) * 100;

    if (hc.threshold_high != null) {
      const yPct = toYPct(hc.threshold_high);
      if (yPct > 0 && yPct < 100)
        thresholdLabels.push(`<span class="chart-threshold" style="top:${yPct.toFixed(1)}%">${hc.threshold_high.toFixed(1)}${u}</span>`);
    }
    if (hc.threshold_low != null) {
      const yPct = toYPct(hc.threshold_low);
      if (yPct > 0 && yPct < 100)
        thresholdLabels.push(`<span class="chart-threshold" style="top:${yPct.toFixed(1)}%">${hc.threshold_low.toFixed(1)}${u}</span>`);
    }
  }

  return `
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${historyMax.toFixed(1)}${u}</span>
      <span class="chart-stat stat-period">${historyHours}h</span>
      <span class="chart-stat stat-min">↓ ${historyMin.toFixed(1)}${u}</span>
      ${thresholdLabels.join('')}
    </div>`;
}

function renderCard(vm) {
  const hasAlarm  = vm.smokeOn || vm.gasOn || vm.waterOn;
  const bgStyle   = vm.lightColor
    ? `background: linear-gradient(135deg, ${vm.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`
    : '';
  const cardClass = [vm.navPath ? 'clickable' : '', hasAlarm ? 'alarm-active' : ''].filter(Boolean).join(' ');
  return `
    <style>${CARD_STYLES}</style>
    <ha-card
      ${cardClass ? `class="${cardClass}"` : ''}
      style="${bgStyle}"
      ${vm.navPath ? `role="button" tabindex="0"` : ''}
      aria-label="${vm.areaName}"
    >
      ${vm.historyPoints ? sparklineSvg(vm.historyPoints, vm.historyColor, vm.historyChart) : ''}
      ${renderChartOverlay(vm)}
      <div class="card-content">
        ${renderCameraPreview(vm)}
        ${renderHeader(vm)}
        ${renderEnvRow(vm)}
        ${renderChips(vm)}
        ${renderControls(vm)}
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
  const focusedClass = shadowRoot.activeElement?.className;
  shadowRoot.innerHTML = vm.error ? renderErrorCard(vm.error) : renderCard(vm);
  if (!vm.error) bindEvents(shadowRoot, host, vm);
  // full innerHTML rewrite drops focus every render — restore it for keyboard users
  // toggling the controls-row label, otherwise a second Enter/Space press is lost
  if (focusedClass) shadowRoot.querySelector(`.${focusedClass.split(' ').join('.')}`)?.focus();
}

function bindEvents(shadowRoot, host, { navPath, chipItems }) {
  if (navPath) {
    shadowRoot.querySelector('ha-card').addEventListener('click', e => {
      if (!e.target.closest('.chip') && !e.target.closest('.env-chip')
          && !e.target.closest('.badge-lights') && !e.target.closest('.badge-battery')
          && !e.target.closest('.badge-update') && !e.target.closest('.camera-preview')
          && !e.target.closest('.controls-label.clickable')) navigate(navPath);
    });
  }

  const controlsLabel = shadowRoot.querySelector('.controls-label.clickable');
  if (controlsLabel) {
    controlsLabel.addEventListener('click', e => {
      e.stopPropagation();
      host.toggleControlsCollapsed();
    });
    controlsLabel.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      e.stopPropagation();
      host.toggleControlsCollapsed();
    });
  }

  shadowRoot.querySelectorAll('.ptz-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      if (host._hass?.callService) host._hass.callService('button', 'press', {}, { entity_id: el.dataset.entity });
      else fireMoreInfo(host, el.dataset.entity);
    });
  });

  shadowRoot.querySelectorAll('.weather-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });

  const updateBadge = shadowRoot.querySelector('.badge-update[data-entity]');
  if (updateBadge) updateBadge.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, updateBadge.dataset.entity); });

  const cameraPreview = shadowRoot.querySelector('.camera-preview[data-entity]');
  if (cameraPreview) cameraPreview.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, cameraPreview.dataset.entity); });

  shadowRoot.querySelectorAll('.control-chip[data-entity]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const entityId = el.dataset.entity;
      const domain    = el.dataset.domain;
      if (domain === 'button' && host._hass?.callService) {
        host._hass.callService('button', 'press', {}, { entity_id: entityId });
      } else if (domain === 'siren' && host._hass?.callService) {
        host._hass.callService('siren', 'toggle', {}, { entity_id: entityId });
      } else {
        fireMoreInfo(host, entityId);
      }
    });
  });

  const lightBadge = shadowRoot.querySelector('.badge-lights');
  if (lightBadge && host._config?.area && host._hass?.callService) {
    lightBadge.addEventListener('click', e => {
      e.stopPropagation();
      host._hass.callService('light', 'toggle', {}, { area_id: host._config.area });
    });
  }

  const batteryBadge = shadowRoot.querySelector('.badge-battery[data-entity]');
  if (batteryBadge) batteryBadge.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, batteryBadge.dataset.entity); });

  shadowRoot.querySelectorAll('.env-chip[data-entity]').forEach(el => {
    const eid = el.dataset.entity;
    if (eid) el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, eid); });
  });

  shadowRoot.querySelectorAll('.chip[data-entity]:not(.control-chip)').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });
}
