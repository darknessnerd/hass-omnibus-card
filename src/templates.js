/**
 * Template functions — pure: (ViewModel) → HTML string. No DOM access, no
 * side effects. See viewModel.js for the data these read and dom.js for the
 * actual shadowRoot write + event binding that consumes renderCard()'s output.
 *
 * Adding a new section only requires: a new template fn + one line in renderCard().
 */

import { CARD_STYLES } from './styles.js';
import { sparklineSvg, computeScale, CORNER_CLEARANCE_PCT } from './sparkline.js';

function renderHeader({ areaName, cardIcon, hasLights, lightCount, offlineLights, occupied, hasOccupancySensors, problemCount,
                         showBatteryBadge, batteryValue, batteryIcon: batteryIconName, batteryEntity, batteryTitle,
                         updateCount, updateEntity, updateTitle, openingItems, tamperItems }) {
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
        ${renderOpeningsChip({ openingItems })}
        ${renderTamperChip({ tamperItems })}
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

// Small caption above a grouped, always-visible pill — gives each type a name
// and a color identity instead of identical grey capsules distinguishable
// only by a hover tooltip. Device tabs collapse instead via the exclusive tab
// strip in renderSectionGroup(); this stays always-visible.
function renderGroupSection(label, className, pillHtml) {
  if (!pillHtml) return '';
  return `<div class="group-section"><span class="group-label ${className}">${label}</span>${pillHtml}</div>`;
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

// Tamper sensors — own shield badge next to the openings badge: shares a
// device with the door/window contact sensor (see discovery.js) but is a
// distinct security signal, not the same on/off state, so it gets its own
// red-vs-green swatch rather than being folded into either.
function renderTamperChip({ tamperItems }) {
  if (!tamperItems.length) return '';
  return `
    <div class="chip group-chip tamper-chip">
      ${tamperItems.map(({ entityId, icon, isTampered, title }) => `
        <span class="group-seg tamper-seg${isTampered ? ' on' : ''}" data-entity="${entityId}" role="button" tabindex="0" aria-label="${title}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
        </span>`).join('')}
    </div>`;
}

// Door/window/garage contact sensors — rendered in the header next to the
// lights badge (see renderHeader) rather than the lower chip strip, so an
// open door reads at a glance next to the room's other always-visible status
// (lights/occupancy) instead of needing a scroll or a Diagnostics-tab click
// (see discovery.js's OPENING_DC bucket).
function renderOpeningsChip({ openingItems }) {
  if (!openingItems.length) return '';
  return `
    <div class="chip group-chip openings-chip">
      ${openingItems.map(({ entityId, icon, isOpen, title }) => `
        <span class="group-seg opening-seg${isOpen ? ' on' : ''}" data-entity="${entityId}" role="button" tabindex="0" aria-label="${title}" title="${title}">
          <ha-icon icon="${icon}"></ha-icon>
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

function renderChips({ chipItems, weatherItems }) {
  const chipsSection  = renderGroupSection('', '', renderChipItems({ chipItems }));
  const weatherSection = renderGroupSection('Weather', 'group-label-weather', renderWeatherChip({ weatherItems }));
  if (!chipItems.length && !weatherSection) return '';
  return `${chipsSection}
    ${weatherSection}
    `;
}

function renderCameraPreview({ hasCamera, cameraImage, cameraIcon, cameraEntity, cameraTitle, cameraState, cameraOffline, cameraPrivacy }) {
  if (!hasCamera) return '';
  const title = cameraPrivacy ? `${cameraTitle} (privacy mode)` : cameraOffline ? `${cameraTitle} (offline)` : cameraTitle;
  const showImage = cameraImage && !cameraPrivacy;
  return `
    <div class="camera-preview${cameraOffline ? ' offline' : ''}${cameraPrivacy ? ' privacy' : ''}" data-entity="${cameraEntity}"
         role="button" tabindex="0" aria-label="${title}" title="${title}">
      ${showImage
        ? `<img src="${cameraImage}" alt="${title}" loading="lazy" />`
        : `<div class="camera-placeholder"><ha-icon icon="${cameraPrivacy ? 'mdi:eye-off' : cameraIcon}"></ha-icon></div>`}
      ${cameraState === 'recording' && !cameraPrivacy ? `<span class="camera-rec-dot" title="Recording"></span>` : ''}
      ${showImage ? `
        <span class="camera-refresh-btn" role="button" tabindex="0" aria-label="Refresh snapshot" title="Refresh snapshot">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </span>` : ''}
    </div>`;
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

// Device controls — siren + one-shot buttons, "press to act" entities. See
// viewModel.js's controlItems for the classification rule (discovery.js
// classify()); renderSettingsChip below is the "configure" counterpart.
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

// One tab per physical device (see discovery.js groupTabsByDevice) instead of
// the old fixed Controls/Settings/Diagnostics-by-action-type split — an area
// with an unrelated camera + IR blaster + LED used to mash all three into one
// shared "Settings" pill with no indication of which entity belonged to which
// device. Within a device's tab, PTZ/controls/settings/diagnostics segments
// still render via the same per-role chip functions (unchanged segment
// classes/data-attributes, so dom.js's bindEvents needs no changes), just
// scoped to that device's own subset. All panels stay in the DOM (CSS hides
// the inactive ones via .section-tab-panel not carrying .active) rather than
// being conditionally rendered — segment click handlers and entity lookups
// keep working the instant a tab opens, with no extra render round-trip, and
// only ever one panel's worth of height is visible at a time so switching
// tabs never stacks on top of an already-open one. Clicking the active tab
// again clears activeSection back to none (see dom.js bindEvents).
// collapsible_controls: false opts out entirely into the old always-expanded
// stacked layout (no tabs, nothing ever hidden).
// Sub-caption per role within a device's tab — once ptz/controls/settings/
// diagnostics share one device tab instead of each owning its own labeled
// tab, the role boundary between them (e.g. "where do this device's settings
// end and its diagnostics begin") has no other cue: only .settings-chip
// carries a background tint, ptz/controls/diagnostics all render as the same
// neutral grey pill (diagnostics is neutral on purpose, see .group-label
// below — a text caption doesn't fight that, a forced color would).
const ROLE_LABELS = { ptz: 'PTZ', controls: 'Controls', settings: 'Settings', diagnostics: 'Diagnostics' };

function renderDeviceRoleSections({ ptz, controls, settings, diagnostics }) {
  return [
    { role: 'ptz',         pill: renderPtzChip({ ptzItems: ptz }) },
    { role: 'controls',    pill: renderControlsChip({ controlItems: controls }) },
    { role: 'settings',    pill: renderSettingsChip({ settingsItems: settings }) },
    { role: 'diagnostics', pill: renderDiagnosticsChip({ diagnosticsItems: diagnostics }) },
  ].filter(s => s.pill);
}

function renderRoleSections(roleSections) {
  return roleSections.map(({ role, pill }) => `
    <div class="device-role">
      <span class="device-role-label">${ROLE_LABELS[role]}</span>
      ${pill}
    </div>`).join('');
}

function renderSectionGroup({ deviceGroups, collapsibleControls, activeSection }) {
  const sections = deviceGroups
    .map(({ key, label, icon, ptz, controls, settings, diagnostics }) => ({ key, label, icon, roleSections: renderDeviceRoleSections({ ptz, controls, settings, diagnostics }) }))
    .filter(s => s.roleSections.length);
  if (!sections.length) return '';

  if (!collapsibleControls) {
    return sections.map(({ label, icon, roleSections }) => `
      <div class="group-section">
        <span class="group-label"><ha-icon icon="${icon}"></ha-icon>${label}</span>
        ${renderRoleSections(roleSections)}
      </div>`).join('');
  }

  return `
    <div class="section-tabs">
      <div class="section-tabs-bar" role="tablist">
        ${sections.map(({ key, label, icon }) => `
          <span class="section-tab${activeSection === key ? ' active' : ''}" data-section="${key}"
            role="tab" tabindex="0" aria-selected="${activeSection === key}" title="${label}">
            <ha-icon icon="${icon}"></ha-icon><span class="section-tab-label">${label}</span>
          </span>`).join('')}
      </div>
      ${sections.map(({ key, roleSections }) => `
        <div class="section-tab-panel${activeSection === key ? ' active' : ''}">${renderRoleSections(roleSections)}</div>`).join('')}
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

export function renderErrorCard(areaId) {
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

function renderChartOverlay({ historyMin, historyMax, historyUnit: u, historyHours, historyChart: hc, historyEmpty, historyTrend }) {
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

  const TREND_GLYPH = { up: '⬈', down: '⬊', flat: '➡' };
  const TREND_LABEL = { up: 'up', down: 'down', flat: 'no change' };
  const trendBadge = historyTrend
    ? `<span class="chart-stat stat-trend trend-${historyTrend}" title="Trending ${TREND_LABEL[historyTrend]} over ${historyHours}h">${TREND_GLYPH[historyTrend]}</span>`
    : '';

  return `
    <div class="chart-overlay">
      ${trendBadge}
      <span class="chart-stat stat-max">↑ ${historyMax.toFixed(1)}${u}</span>
      <span class="chart-stat stat-period" title="Tracking ${hc.entity_id} — may differ from the averaged value shown above">${historyHours}h</span>
      <span class="chart-stat stat-min">↓ ${historyMin.toFixed(1)}${u}</span>
      ${thresholdLabels.join('')}
    </div>`;
}

export function renderCard(vm) {
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
        ${renderSectionGroup(vm)}
        ${renderAlarmBar(vm)}
      </div>
    </ha-card>`;
}
