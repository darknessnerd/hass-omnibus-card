/**
 * View-model builder — derives all display data from hass + config.
 * Pure: no DOM access, no side effects. See templates.js for (ViewModel) → HTML
 * and dom.js for the actual shadowRoot write + event binding.
 */

import { CLIMATE_MAP, ACTIVE_STATES, PTZ_ICON } from './constants.js';
import { getAreaEntities, classify, filterEntities, groupTabsByDevice } from './discovery.js';
import { average, anyOn, activeLights, rgbColor, lowestBattery } from './aggregators.js';
import { friendlyLabel, entityIcon, batteryIcon, uniqueLabels, resolveThreshold } from './utils.js';

// history_chart.threshold_high/threshold_low may be a plain number or an
// entity_id (number/input_number/sensor) — see resolveThreshold. Returns the
// same `hc` reference untouched when both thresholds are already numbers (or
// absent), so sparkline.js's per-points render cache still hits on unrelated
// re-renders (see the note above sparklineSvg's _renderCache).
function resolveHistoryChartThresholds(hass, hc) {
  const high = resolveThreshold(hass, hc.threshold_high, null);
  const low  = resolveThreshold(hass, hc.threshold_low, null);
  if (high === hc.threshold_high && low === hc.threshold_low) return hc;
  return { ...hc, threshold_high: high, threshold_low: low };
}

// Shared shape for controlItems/settingsItems/diagnosticsItems — a device
// tab's segments (see discovery.js groupTabsByDevice), so all three carry the
// same fields regardless of whether their own template reads every one of
// them (renderDiagnosticsChip ignores domain/isActive, for instance).
// Label collisions across these are deduped downstream, once items are
// grouped by device — see dedupeBucketLabels in discovery.js.
function mapEntityItem(entityId, state, deviceId, config) {
  return {
    entityId,
    deviceId,
    domain:   entityId.split('.')[0],
    isActive: ACTIVE_STATES.has(state.state),
    icon:     entityIcon(entityId, state),
    label:    config.entity_labels?.[entityId] ?? friendlyLabel(entityId, state),
    fullName: state.attributes?.friendly_name ?? entityId,
    title:    `${state.attributes?.friendly_name ?? entityId} — ${state.state}`,
  };
}

// Shared shape for openingItems/tamperItems — a plain on/off badge with a
// custom active/inactive label (unlike mapEntityItem's raw state string).
// `activeKey` names the boolean field per caller (isOpen / isTampered) so
// each template can destructure the name that reads clearly at the call site.
function mapBinaryStatusItem(entityId, state, activeKey, activeLabel, inactiveLabel) {
  const isActive = ACTIVE_STATES.has(state.state);
  return {
    entityId,
    icon:  entityIcon(entityId, state),
    [activeKey]: isActive,
    title: `${state.attributes?.friendly_name ?? entityId} — ${isActive ? activeLabel : inactiveLabel}`,
  };
}

/**
 * Derives all display-relevant data from hass + config.
 * Returns { error } when the area is not found and no name override is set.
 * Pure: no DOM access, no side effects.
 */
export function buildViewModel(hass, config, historyPoints = null, activeSectionInput = null) {
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
  const moldThreshold = resolveThreshold(hass, config.mold_threshold, 70);
  const navPath     = config.navigate_to || config.tap_action?.navigation_path || null;
  // history_chart's own threshold_high/low may likewise be an entity_id
  // (see resolveThreshold) — resolved into a fresh object only when an
  // entity ref is actually present, so the static-config case keeps the
  // same object reference and sparkline.js's render cache still hits.
  const hcConfig    = config.history_chart ?? null;
  const hc          = hcConfig ? resolveHistoryChartThresholds(hass, hcConfig) : null;

  const batteryLowThreshold = resolveThreshold(hass, config.battery_low_threshold, 20);
  const lowBattery = lowestBattery(c.batteries);

  // Only the first camera gets the dedicated preview banner; any additional
  // cameras in the area still need to be reachable, so they fall back to chips.
  const camera       = c.cameras[0] ?? null;
  const extraCameras = c.cameras.slice(1);

  const pendingUpdates = c.updates.filter(u => u.state.state === 'on');

  const controlItems = config.show_entities !== false
    ? c.controls.map(({ entityId, state, deviceId }) => mapEntityItem(entityId, state, deviceId, config))
    : [];

  // switch/select/number/lock/cover, etc. sharing a device with another
  // operable/settings-style entity — configuration toggles, distinct from
  // the one-shot "press to act" items (siren/buttons) that stay in
  // controlItems. See discovery.js classify().
  const settingsItems = config.show_entities !== false
    ? c.settings.map(({ entityId, state, deviceId }) => mapEntityItem(entityId, state, deviceId, config))
    : [];

  // grouped into one pill instead of one chip per PTZ button
  const ptzItems = config.show_entities !== false
    ? c.ptz.map(({ entityId, state, direction, deviceId }) => ({
        entityId,
        deviceId,
        direction,
        icon:  PTZ_ICON[direction],
        title: state.attributes?.friendly_name ?? entityId,
      }))
    : [];

  // read-only sensors/binary_sensors/image sharing a device with another
  // operable/settings-style entity (IP, PIR state, alarm codes, etc.) —
  // grouped into their own pill once there are enough of them (see
  // discovery.js) instead of padding out the generic chip strip with
  // near-identical grey chips.
  const diagnosticsItems = config.show_entities !== false
    ? c.diagnostics.map(({ entityId, state, deviceId }) => mapEntityItem(entityId, state, deviceId, config))
    : [];

  // Each physical device gets its own tab (see discovery.js groupTabsByDevice)
  // instead of the old fixed Controls/Settings/Diagnostics-by-action-type
  // split — a room with an unrelated camera + IR blaster + LED used to mash
  // all three into one shared "Settings" pill with no indication of which
  // entity belonged to which device. Tabs share one exclusive strip (see
  // templates.js renderSectionGroup) gated by collapsible_controls.
  // activeSectionInput is either an explicit section key (deviceId, or
  // '__other__'), the '__default__' sentinel (controls_collapsed: false —
  // open whichever tab is first available), or null. An explicit key only
  // wins while its tab still has content (e.g. the open tab's last entity
  // got removed) — otherwise fall back to no tab open rather than render an
  // empty panel.
  const collapsibleControls = config.collapsible_controls !== false;
  const deviceGroups = groupTabsByDevice(
    hass,
    { ptz: ptzItems, controls: controlItems, settings: settingsItems, diagnostics: diagnosticsItems },
    camera?.deviceId ?? null,
  );
  const availableSections = deviceGroups.map(g => g.key);
  const activeSection = !collapsibleControls ? null
    : activeSectionInput === '__default__' ? (availableSections[0] ?? null)
    : availableSections.includes(activeSectionInput) ? activeSectionInput : null;

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

    deviceGroups,
    collapsibleControls,
    activeSection,

    // Contact sensors (door/window/garage) — own always-visible pill, kept
    // separate from chipItems so a device sweep (see discovery.js classify())
    // never buries an open door behind a Diagnostics tab click.
    openingItems: config.show_entities !== false
      ? c.openings.map(({ entityId, state }) => mapBinaryStatusItem(entityId, state, 'isOpen', 'Open', 'Closed'))
      : [],

    // Tamper sensors — own shield badge next to openings (see discovery.js),
    // distinct from the door/window open/closed state it shares a device with.
    tamperItems: config.show_entities !== false
      ? c.tampers.map(({ entityId, state }) => mapBinaryStatusItem(entityId, state, 'isTampered', 'Tamper detected', 'Normal'))
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
