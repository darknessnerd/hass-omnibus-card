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
import { friendlyLabel, entityIcon, batteryIcon, uniqueLabels } from './utils.js';
import { fireMoreInfo, navigate }     from './events.js';
import { sparklineSvg, computeScale, CORNER_CLEARANCE_PCT } from './sparkline.js';


// ── View model ─────────────────────────────────────────────────────────────

/**
 * Derives all display-relevant data from hass + config.
 * Returns { error } when the area is not found and no name override is set.
 * Pure: no DOM access, no side effects.
 */
export function buildViewModel(hass, config, historyPoints = null, collapsed = {}) {
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
      ? uniqueLabels(c.controls.map(({ entityId, state }) => ({
          entityId,
          domain:   entityId.split('.')[0],
          isActive: ACTIVE_STATES.has(state.state),
          icon:     entityIcon(entityId, state),
          label:    config.entity_labels?.[entityId] ?? friendlyLabel(entityId, state),
          fullName: state.attributes?.friendly_name ?? entityId,
          title:    `${state.attributes?.friendly_name ?? entityId} — ${state.state}`,
        })))
      : [],

    // switch/select/number/lock/cover, etc. sharing a device with the area's
    // camera — configuration toggles, distinct from the one-shot "press to
    // act" items (siren/buttons) that stay in controlItems. See discovery.js.
    settingsItems: config.show_entities !== false
      ? uniqueLabels(c.settings.map(({ entityId, state }) => ({
          entityId,
          domain:   entityId.split('.')[0],
          isActive: ACTIVE_STATES.has(state.state),
          icon:     entityIcon(entityId, state),
          label:    config.entity_labels?.[entityId] ?? friendlyLabel(entityId, state),
          fullName: state.attributes?.friendly_name ?? entityId,
          title:    `${state.attributes?.friendly_name ?? entityId} — ${state.state}`,
        })))
      : [],

    // Controls/Settings/Diagnostics all share the same collapsible_controls
    // toggle (whether a chevron shows at all) but track their own open/closed
    // state independently — collapsing Controls doesn't collapse Settings.
    collapsibleControls:  config.collapsible_controls !== false,
    controlsCollapsed:    config.collapsible_controls !== false && !!collapsed.controls,
    settingsCollapsed:    config.collapsible_controls !== false && !!collapsed.settings,
    diagnosticsCollapsed: config.collapsible_controls !== false && !!collapsed.diagnostics,

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

    // read-only sensors/binary_sensors/image sharing a device with the area's
    // camera (IP, PIR state, alarm codes, etc.) — grouped into their own pill
    // once there are enough of them (see discovery.js) instead of padding out
    // the generic chip strip with near-identical grey chips.
    diagnosticsItems: config.show_entities !== false
      ? uniqueLabels(c.diagnostics.map(({ entityId, state }) => ({
          entityId,
          icon:     entityIcon(entityId, state),
          label:    config.entity_labels?.[entityId] ?? friendlyLabel(entityId, state),
          fullName: state.attributes?.friendly_name ?? entityId,
          title:    `${state.attributes?.friendly_name ?? entityId} — ${state.state}`,
        })))
      : [],

    historyPoints: hc?.entity_id ? historyPoints : null,
    // slightly more present than the old 0.12 default — the sparkline is the
    // card's one distinctive visual element and was reading as background
    // noise rather than a signature
    historyColor:  hc?.color ?? 'rgba(3, 169, 244, 0.2)',
    historyChart:  hc,
    historyMin:    (hc?.entity_id && historyPoints?.length >= 2) ? Math.min(...historyPoints.map(p => p.v)) : null,
    historyMax:    (hc?.entity_id && historyPoints?.length >= 2) ? Math.max(...historyPoints.map(p => p.v)) : null,
    historyUnit:   hass.states?.[hc?.entity_id]?.attributes?.unit_of_measurement ?? '',
    historyHours:  hc?.hours ?? 24,
    // Fetch resolved (not still pending — Array.isArray excludes the null
    // "loading" state) but produced under 2 numeric readings — happens when
    // entity_id points at a non-numeric domain (binary_sensor, text) whose
    // states all fail parseFloat, or a brand-new entity with no history yet.
    // Distinct from a flat *numeric* series (still >=2 valid points, just
    // suppressed visually) — that case is intentional and stays silent.
    historyEmpty:  !!hc?.entity_id && Array.isArray(historyPoints) && historyPoints.length < 2,

    // pre-computed chip data keeps template functions free of utility imports
    chipItems: config.show_entities !== false
      ? uniqueLabels([...c.others, ...extraCameras].slice(0, config.max_entities ?? 12).map(({ entityId, state }) => ({
          entityId,
          isActive: ACTIVE_STATES.has(state.state),
          icon:     entityIcon(entityId, state),
          label:    config.entity_labels?.[entityId] ?? friendlyLabel(entityId, state),
          fullName: state.attributes?.friendly_name ?? entityId,
          title:    `${state.attributes?.friendly_name ?? entityId} — ${state.state}`,
        })))
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
               role="button" tabindex="0" aria-label="${lightTitle}" title="${lightTitle}">
            <ha-icon icon="mdi:lightbulb${lightsOff ? '-off' : ''}"></ha-icon>
            ${lightCount > 1 ? `<span>${lightCount}</span>` : ''}
          </div>` : ''}
        ${hasOccupancySensors ? `<div class="occupancy-dot ${occupied ? '' : 'idle'}" title="${occupied ? 'Occupied' : 'Not occupied'}"></div>` : ''}
        ${renderStatusCluster({ showBatteryBadge, batteryValue, batteryIcon: batteryIconName, batteryEntity, batteryTitle,
                                 problemCount, updateCount, updateEntity, updateTitle })}
      </div>
    </div>`;
}

// Battery-low / problem / firmware-update alerts, grouped into one pill instead
// of up to three separate badges — same segmented-pill language as the weather
// and PTZ chips, so a room with several alerts doesn't stack three full badges.
function renderStatusCluster({ showBatteryBadge, batteryValue, batteryIcon: batteryIconName, batteryEntity, batteryTitle,
                                problemCount, updateCount, updateEntity, updateTitle }) {
  const segs = [];
  if (showBatteryBadge) segs.push(`
    <span class="group-seg status-seg-battery" data-entity="${batteryEntity}" role="button" tabindex="0" aria-label="${batteryTitle}" title="${batteryTitle}">
      <ha-icon icon="${batteryIconName}"></ha-icon><span>${batteryValue}%</span>
    </span>`);
  if (problemCount > 0) segs.push(`
    <span class="group-seg status-seg-problem" title="${problemCount} problem${problemCount !== 1 ? 's' : ''}">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>${problemCount > 1 ? `<span>${problemCount}</span>` : ''}
    </span>`);
  if (updateCount > 0) segs.push(`
    <span class="group-seg status-seg-update" data-entity="${updateEntity}" role="button" tabindex="0" aria-label="${updateTitle}" title="${updateTitle}">
      <ha-icon icon="mdi:package-up"></ha-icon>${updateCount > 1 ? `<span>${updateCount}</span>` : ''}
    </span>`);
  if (!segs.length) return '';
  return `<div class="chip group-chip status-cluster" title="Alerts">${segs.join('')}</div>`;
}

function renderEnvRow({ tempVal, humVal, tempUnit, tempEntities, humEntities, climate, climIcon, climColor }) {
  if (tempVal === null && humVal === null && !climIcon) return '';
  const tempTitle = tempEntities.length > 1 ? `Avg of ${tempEntities.length} sensors` : tempEntities[0]?.state.attributes?.friendly_name ?? '';
  const humTitle  = humEntities.length > 1  ? `Avg of ${humEntities.length} sensors`  : humEntities[0]?.state.attributes?.friendly_name ?? '';
  const climTitle = climate?.state.attributes?.friendly_name ?? climate?.entityId ?? '';
  return `
    <div class="env-row">
      ${tempVal !== null ? `
        <div class="env-chip temp"
             data-entity="${tempEntities[0]?.entityId ?? ''}"
             role="button" tabindex="0" aria-label="${tempTitle}" title="${tempTitle}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${tempVal.toFixed(1)}${tempUnit}</span>
        </div>` : ''}
      ${humVal !== null ? `
        <div class="env-chip hum"
             data-entity="${humEntities[0]?.entityId ?? ''}"
             role="button" tabindex="0" aria-label="${humTitle}" title="${humTitle}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${humVal.toFixed(0)}%</span>
        </div>` : ''}
      ${climIcon ? `
        <div class="env-chip climate"
             style="--climate-color: ${climColor}"
             data-entity="${climate.entityId}"
             role="button" tabindex="0" aria-label="${climTitle}" title="${climTitle}">
          <ha-icon icon="${climIcon}"></ha-icon>
          <span>${climate.state.attributes?.current_temperature != null
            ? `${climate.state.attributes.current_temperature}°`
            : climate.state.state}</span>
        </div>` : ''}
    </div>`;
}

// Small caption above a grouped pill (Weather/Diagnostics/Settings) — gives
// each type a name and a color identity instead of three identical grey
// capsules distinguishable only by a hover tooltip. Diagnostics/Settings are
// collapsible like Controls (pass sectionKey/collapsible/collapsed); Weather
// stays always-visible (no opts).
function renderGroupSection(label, className, pillHtml, { sectionKey, collapsible, collapsed } = {}) {
  if (!pillHtml) return '';
  if (!collapsible) {
    return `<div class="group-section"><span class="group-label ${className}">${label}</span>${pillHtml}</div>`;
  }
  return `
    <div class="group-section${collapsed ? ' collapsed' : ''}">
      <span class="group-label ${className} clickable" data-section="${sectionKey}"
        role="button" tabindex="0" title="${collapsed ? 'Expand' : 'Collapse'} ${label.toLowerCase()}">
        ${label}<ha-icon class="group-toggle" icon="mdi:chevron-${collapsed ? 'down' : 'up'}"></ha-icon>
      </span>
      <div class="group-pill">${pillHtml}</div>
    </div>`;
}

function renderWeatherChip({ weatherItems }) {
  if (!weatherItems.length) return '';
  return `
    <div class="chip group-chip weather-chip">
      ${weatherItems.map(({ entityId, dc, icon, value, unit, title }) => `
        <span class="group-seg weather-seg" data-entity="${entityId}" data-dc="${dc}" role="button" tabindex="0" aria-label="${title}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
          <span class="group-seg-value">${value}${unit ? ' ' + unit : ''}</span>
        </span>`).join('')}
    </div>`;
}

function renderChipItems({ chipItems }) {
    return `${chipItems.length ? `
      <div class="entity-chips">
        ${chipItems.map(({ entityId, isActive, icon, label, title }) => `
          <div class="chip${isActive ? ' on' : ''}" data-entity="${entityId}" role="button" tabindex="0" aria-label="${title}" title="${title}">
            <ha-icon icon="${icon}"></ha-icon>
            <span class="chip-label">${label}</span>
          </div>`).join('')}
      </div>` : ''}`;
}
// Camera diagnostics (IP, PIR state, alarm codes, etc.) — read-only, so segments
// carry no data-domain/on-state, just entity + label like the weather chip.
function renderDiagnosticsChip({ diagnosticsItems }) {
  if (!diagnosticsItems.length) return '';
  return `
    <div class="chip group-chip diagnostics-chip">
      ${diagnosticsItems.map(({ entityId, icon, label, title }) => `
        <span class="group-seg diagnostics-seg" data-entity="${entityId}" role="button" tabindex="0" aria-label="${title}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
          <span class="seg-label">${label}</span>
        </span>`).join('')}
    </div>`;
}

function renderChips({ chipItems, weatherItems, diagnosticsItems, collapsibleControls, diagnosticsCollapsed }) {
  const chipsSection = renderGroupSection('', '', renderChipItems({ chipItems }));
    const weatherSection     = renderGroupSection('Weather', 'group-label-weather', renderWeatherChip({ weatherItems }));
  const diagnosticsSection = renderGroupSection('Diagnostics', 'group-label-diagnostics', renderDiagnosticsChip({ diagnosticsItems }),
    { sectionKey: 'diagnostics', collapsible: collapsibleControls, collapsed: diagnosticsCollapsed });
  if (!chipItems.length && !weatherSection && !diagnosticsSection) return '';
  return `${chipsSection}
    ${weatherSection}
    ${diagnosticsSection}
    `;
}

function renderCameraPreview({ hasCamera, cameraImage, cameraIcon, cameraEntity, cameraTitle, cameraState, cameraOffline }) {
  if (!hasCamera) return '';
  const title = cameraOffline ? `${cameraTitle} (offline)` : cameraTitle;
  return `
    <div class="camera-preview${cameraOffline ? ' offline' : ''}" data-entity="${cameraEntity}"
         role="button" tabindex="0" aria-label="${title}" title="${title}">
      ${cameraImage
        ? `<img src="${cameraImage}" alt="${title}" loading="lazy" />`
        : `<div class="camera-placeholder"><ha-icon icon="${cameraIcon}"></ha-icon></div>`}
      ${cameraState === 'recording' ? `<span class="camera-rec-dot" title="Recording"></span>` : ''}
      ${cameraImage ? `
        <span class="camera-refresh-btn" role="button" tabindex="0" aria-label="Refresh snapshot" title="Refresh snapshot">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </span>` : ''}
    </div>`;
}

// entity_picture URLs are stable per state — the browser will happily serve
// a cached response for the exact same URL, so a refresh has to change the
// URL to force a real re-fetch. Doesn't call any HA service; camera_proxy
// ignores unknown query params and serves the current frame. Shared by the
// manual refresh button and the camera_refresh_interval auto-refresh timer.
export function refreshCameraImage(shadowRoot) {
  const img = shadowRoot.querySelector('.camera-preview img');
  if (!img) return;
  const url = new URL(img.getAttribute('src'), window.location.href);
  url.searchParams.set('_refresh', Date.now());
  img.src = url.pathname + url.search;
}

function renderPtzChip({ ptzItems }) {
  if (!ptzItems.length) return '';
  return `
    <div class="chip group-chip ptz-chip">
      ${ptzItems.map(({ entityId, direction, icon, title }) => `
        <span class="group-seg ptz-seg" data-entity="${entityId}" data-direction="${direction}" role="button" tabindex="0" aria-label="${title}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
        </span>`).join('')}
    </div>`;
}

// Device controls — siren + one-shot buttons, "press to act" entities that
// share a device with the area's camera. Configuration toggles (switch/
// select/number) are a separate bucket, see renderSettingsChip below.
function renderControlsChip({ controlItems }) {
  if (!controlItems.length) return '';
  return `
    <div class="chip group-chip controls-chip">
      ${controlItems.map(({ entityId, domain, isActive, icon, label, title }) => `
        <span class="group-seg control-seg${isActive ? ' on' : ''}" data-entity="${entityId}" data-domain="${domain}" role="button" tabindex="0" aria-label="${title}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
          <span class="seg-label">${label}</span>
        </span>`).join('')}
    </div>`;
}

// Settings — switch/select/number/lock/cover, etc: configuration toggles
// rather than one-shot actions. Split out from Controls so "press to act"
// (siren, PTZ, reboot buttons) doesn't get buried among "adjust this setting"
// (IR light, audio, detection sensitivity) — a real camera device can expose
// 8+ of the latter and none of the former.
function renderSettingsChip({ settingsItems }) {
  if (!settingsItems.length) return '';
  return `
    <div class="chip group-chip settings-chip">
      ${settingsItems.map(({ entityId, domain, isActive, icon, label, title }) => `
        <span class="group-seg settings-seg${isActive ? ' on' : ''}" data-entity="${entityId}" data-domain="${domain}" role="button" tabindex="0" aria-label="${title}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
          <span class="seg-label">${label}</span>
        </span>`).join('')}
    </div>`;
}

function renderControls({ controlItems, settingsItems, ptzItems, collapsibleControls, controlsCollapsed, settingsCollapsed }) {
  if (!controlItems.length && !settingsItems.length && !ptzItems.length) return '';
  const controlsPill = renderPtzChip({ ptzItems }) + renderControlsChip({ controlItems });
  return `
    ${controlsPill ? `
      <div class="controls-row${controlsCollapsed ? ' collapsed' : ''}">
        <span class="controls-label${collapsibleControls ? ' clickable' : ''}"
          data-section="controls"
          ${collapsibleControls ? `role="button" tabindex="0" title="${controlsCollapsed ? 'Expand' : 'Collapse'} controls"` : ''}
          >Controls${collapsibleControls
            ? `<ha-icon class="controls-toggle" icon="mdi:chevron-${controlsCollapsed ? 'down' : 'up'}"></ha-icon>`
            : ''}</span>
        <div class="controls-chips">${controlsPill}</div>
      </div>` : ''}
    ${renderGroupSection('Settings', 'group-label-settings', renderSettingsChip({ settingsItems }),
      { sectionKey: 'settings', collapsible: collapsibleControls, collapsed: settingsCollapsed })}`;
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

function renderChartOverlay({ historyMin, historyMax, historyUnit: u, historyHours, historyChart: hc, historyEmpty }) {
  if (historyMin === null) {
    // Fetch resolved with no usable numeric readings — say so instead of
    // leaving the whole chart area silently blank (e.g. entity_id pointed
    // at a binary_sensor, or the entity has no history yet).
    if (historyEmpty) return `<div class="chart-overlay"><span class="chart-stat chart-empty">No numeric history</span></div>`;
    return '';
  }

  const thresholdLabels = [];
  if (hc?.threshold_high != null || hc?.threshold_low != null) {
    const { min: scaleMin, range } = computeScale(hc, historyMin, historyMax);
    const scaleRange = range || 1;
    const toYPct     = v => (1 - (v - scaleMin) / scaleRange) * 100;
    // Same clearance sparkline.js applies to the dashed guide line itself —
    // keeps the label paired with its line instead of drifting apart near an edge.
    const clampAwayFromCorners = pct => Math.min(100 - CORNER_CLEARANCE_PCT, Math.max(CORNER_CLEARANCE_PCT, pct));

    if (hc.threshold_high != null) {
      const rawPct = toYPct(hc.threshold_high);
      if (rawPct > 0 && rawPct < 100)
        thresholdLabels.push(`<span class="chart-threshold" style="top:${clampAwayFromCorners(rawPct).toFixed(1)}%">${hc.threshold_high.toFixed(1)}${u}</span>`);
    }
    if (hc.threshold_low != null) {
      const rawPct = toYPct(hc.threshold_low);
      if (rawPct > 0 && rawPct < 100)
        thresholdLabels.push(`<span class="chart-threshold" style="top:${clampAwayFromCorners(rawPct).toFixed(1)}%">${hc.threshold_low.toFixed(1)}${u}</span>`);
    }
  }

  return `
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${historyMax.toFixed(1)}${u}</span>
      <span class="chart-stat stat-period" title="Tracking ${hc.entity_id} — may differ from the averaged value shown above">${historyHours}h</span>
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
      ${vm.historyPoints ? sparklineSvg(vm.historyPoints, vm.historyColor, vm.historyChart, vm.historyUnit) : ''}
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
  if (focusedClass) shadowRoot.querySelector(`.${focusedClass.trim().split(/\s+/).join('.')}`)?.focus();
}

function bindEvents(shadowRoot, host, { navPath, chipItems }) {
  if (navPath) {
    shadowRoot.querySelector('ha-card').addEventListener('click', e => {
      if (!e.target.closest('.chip') && !e.target.closest('.env-chip')
          && !e.target.closest('.badge-lights') && !e.target.closest('.status-seg-battery')
          && !e.target.closest('.status-seg-update') && !e.target.closest('.camera-preview')
          && !e.target.closest('.controls-label.clickable') && !e.target.closest('.group-label.clickable')) navigate(navPath);
    });
  }

  // Every interactive element carries role="button" + tabindex="0" in its
  // template; this one delegated listener turns Enter/Space into a click for
  // all of them instead of a bespoke keydown handler per element type.
  shadowRoot.querySelectorAll('[role="button"][tabindex]').forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      e.stopPropagation();
      el.click();
    });
  });

  // Controls/Settings/Diagnostics section headers — each toggles its own
  // independent collapsed state on the host (collapsing Controls doesn't
  // collapse Settings, and vice versa).
  shadowRoot.querySelectorAll('.controls-label.clickable[data-section], .group-label.clickable[data-section]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      host.toggleSectionCollapsed(el.dataset.section);
    });
  });

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

  shadowRoot.querySelectorAll('.diagnostics-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });

  const updateBadge = shadowRoot.querySelector('.status-seg-update[data-entity]');
  if (updateBadge) updateBadge.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, updateBadge.dataset.entity); });

  const cameraPreview = shadowRoot.querySelector('.camera-preview[data-entity]');
  if (cameraPreview) cameraPreview.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, cameraPreview.dataset.entity); });

  const cameraRefreshBtn = shadowRoot.querySelector('.camera-refresh-btn');
  if (cameraRefreshBtn) {
    cameraRefreshBtn.addEventListener('click', e => {
      e.stopPropagation();
      refreshCameraImage(shadowRoot);
    });
  }

  shadowRoot.querySelectorAll('.control-seg[data-entity]').forEach(el => {
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

  shadowRoot.querySelectorAll('.settings-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });

  const lightBadge = shadowRoot.querySelector('.badge-lights');
  if (lightBadge && host._config?.area && host._hass?.callService) {
    lightBadge.addEventListener('click', e => {
      e.stopPropagation();
      host._hass.callService('light', 'toggle', {}, { area_id: host._config.area });
    });
  }

  const batteryBadge = shadowRoot.querySelector('.status-seg-battery[data-entity]');
  if (batteryBadge) batteryBadge.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, batteryBadge.dataset.entity); });

  shadowRoot.querySelectorAll('.env-chip[data-entity]').forEach(el => {
    const eid = el.dataset.entity;
    if (eid) el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, eid); });
  });

  shadowRoot.querySelectorAll('.chip[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });

  bindChartTooltip(shadowRoot);
}

// Native SVG <title> tooltips only fire on desktop hover — dead on touch,
// which is most real Home Assistant dashboard usage. pointerenter/pointerleave
// cover both: a mouse hover fires enter-on-arrival/leave-on-departure, and a
// touch tap fires enter-on-contact/leave-on-lift, so one pair of listeners
// drives the value pill (and, for dense series, a round marker dot) for both.
//
// The marker is a plain HTML element, not an SVG circle — a circle drawn
// inside .bg-chart/.chart-hit-layer (stretched via preserveAspectRatio="none")
// renders as an ellipse whenever the card's real aspect ratio strays from the
// chart's native 300:60, which on a tall/narrow card shows up as an ugly thin
// vertical needle instead of a dot. Positioned by percentage from the
// circle's own viewBox coordinates (0-300 / 0-60), which map 1:1 to percent
// since the chart layers always stretch to fill the card exactly.
function bindChartTooltip(shadowRoot) {
  const circles = shadowRoot.querySelectorAll('.chart-hit-layer circle[data-v]');
  if (!circles.length) return;

  const card = shadowRoot.querySelector('ha-card');
  let tooltipEl = null, dotEl = null;

  const positionAt = (el, circle) => {
    el.style.left = `${(parseFloat(circle.getAttribute('cx')) / 300) * 100}%`;
    el.style.top  = `${(parseFloat(circle.getAttribute('cy')) / 60) * 100}%`;
  };

  circles.forEach(circle => {
    // Sparse series already carry their own always-visible, series-colored
    // dot (see sparklineSvg's `dot`) — showing the accent marker on top of
    // it too would read as an unrelated color glitch, so the marker is
    // dense-only; the value pill still shows for both.
    const dense = circle.closest('.chart-hit-layer')?.classList.contains('dense');

    circle.addEventListener('pointerenter', e => {
      e.stopPropagation();
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'chart-tooltip';
        card.appendChild(tooltipEl);
      }
      tooltipEl.textContent = circle.dataset.v;
      positionAt(tooltipEl, circle);
      tooltipEl.style.display = 'block';

      if (dense) {
        if (!dotEl) {
          dotEl = document.createElement('div');
          dotEl.className = 'chart-hover-dot';
          card.appendChild(dotEl);
        }
        positionAt(dotEl, circle);
        dotEl.style.display = 'block';
      }
    });

    circle.addEventListener('pointerleave', e => {
      e.stopPropagation();
      if (tooltipEl) tooltipEl.style.display = 'none';
      if (dotEl) dotEl.style.display = 'none';
    });
  });
}
