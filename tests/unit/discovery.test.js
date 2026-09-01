import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, groupTabsByDevice } from '../../src/discovery.js';

// Shape modeled on a real production debug log: an EZVIZ camera device
// ("esterno_cb8c_bh2113803") exposing Italian PTZ buttons, several switches,
// a number, two selects, a siren, and a pile of read-only diagnostic sensors —
// plus a separate Bresser 7-in-1 weather station in the same area but on no
// device at all. This is the exact real-world shape the controls-grouping
// restyle needs to hold up against: one device pushing 9 operable entities
// into a single Controls pill.
const CAM_DEVICE = 'dev_esterno_cam';

function item(entityId, state, deviceId = null, entityCategory = null) {
  return { entityId, state, deviceId, entityCategory };
}

const REAL_AREA_ENTITIES = [
  item('binary_sensor.esterno_cb8c_bh2113803_crittografia_2', { state: 'on' }, CAM_DEVICE),
  item('binary_sensor.esterno_cb8c_bh2113803_movimento_2', { state: 'off', attributes: { device_class: 'motion' } }, CAM_DEVICE),
  item('button.esterno_cb8c_bh2113803_ptz_su', { state: 'unknown' }, CAM_DEVICE),
  item('button.esterno_cb8c_bh2113803_ptz_giu', { state: 'unknown' }, CAM_DEVICE),
  item('button.esterno_cb8c_bh2113803_ptz_sinistra', { state: 'unknown' }, CAM_DEVICE),
  item('button.esterno_cb8c_bh2113803_ptz_destra', { state: 'unknown' }, CAM_DEVICE),
  item('camera.esterno_cb8c_bh2113803', { state: 'recording' }, CAM_DEVICE),
  item('image.esterno_cb8c_bh2113803_ultima_immagine_motion', { state: '2026-08-22T11:38:54' }, CAM_DEVICE),
  item('number.esterno_cb8c_bh2113803_sensibilita_di_rilevamento', { state: '70' }, CAM_DEVICE),
  item('select.esterno_cb8c_bh2113803_suono_di_avviso', { state: 'silent' }, CAM_DEVICE),
  item('select.esterno_cb8c_bh2113803_modalita_di_funzionamento_della_batteria', { state: 'high_performance' }, CAM_DEVICE),
  item('siren.esterno_cb8c_bh2113803_sirena', { state: 'off' }, CAM_DEVICE),
  item('switch.esterno_cb8c_bh2113803_audio_2', { state: 'on' }, CAM_DEVICE),
  item('switch.esterno_cb8c_bh2113803_luce_di_stato_2', { state: 'on' }, CAM_DEVICE),
  item('switch.esterno_cb8c_bh2113803_luce_infrarossa_2', { state: 'on' }, CAM_DEVICE),
  item('switch.esterno_cb8c_bh2113803_luce_a_intermittenza_sul_movimento_2', { state: 'off' }, CAM_DEVICE),
  item('switch.esterno_cb8c_bh2113803_segui_il_movimento_2', { state: 'off' }, CAM_DEVICE),
  item('sensor.esterno_cb8c_bh2113803_batteria', { state: '100', attributes: { device_class: 'battery' } }, CAM_DEVICE),
  item('sensor.esterno_cb8c_bh2113803_ip_locale_2', { state: '192.168.178.24' }, CAM_DEVICE),
  item('sensor.esterno_cb8c_bh2113803_stato_pir_2', { state: '0' }, CAM_DEVICE),
  // Bresser weather station — same area, no device link at all
  item('sensor.bresser_7in1_65351_temperature', { state: '30.5', attributes: { device_class: 'temperature' } }),
  item('sensor.bresser_7in1_65351_humidity', { state: '67.0', attributes: { device_class: 'humidity' } }),
  item('sensor.bresser_7in1_65351_wind_average', { state: '3.96', attributes: { device_class: 'wind_speed' } }),
  item('sensor.bresser_7in1_65351_wind_max', { state: '3.96', attributes: { device_class: 'wind_speed' } }),
  item('sensor.bresser_7in1_65351_wind_direction', { state: '162' }), // no device_class HA exposes for this reading
];

test('real EZVIZ device: Italian PTZ buttons resolve to their compass direction', () => {
  const { ptz } = classify(REAL_AREA_ENTITIES);
  const byDirection = Object.fromEntries(ptz.map(p => [p.direction, p.entityId]));
  assert.equal(byDirection.up, 'button.esterno_cb8c_bh2113803_ptz_su');
  assert.equal(byDirection.down, 'button.esterno_cb8c_bh2113803_ptz_giu');
  assert.equal(byDirection.left, 'button.esterno_cb8c_bh2113803_ptz_sinistra');
  assert.equal(byDirection.right, 'button.esterno_cb8c_bh2113803_ptz_destra');
  assert.equal(ptz.length, 4);
});

test('real EZVIZ device: siren lands in controls ("press to act"), switches/number/selects land in settings ("configure")', () => {
  const { controls, settings } = classify(REAL_AREA_ENTITIES);
  assert.deepEqual(controls.map(c => c.entityId), ['siren.esterno_cb8c_bh2113803_sirena']);

  const settingsIds = settings.map(s => s.entityId);
  assert.equal(settings.length, 8);
  assert.ok(settingsIds.includes('switch.esterno_cb8c_bh2113803_audio_2'));
  assert.ok(settingsIds.includes('number.esterno_cb8c_bh2113803_sensibilita_di_rilevamento'));
  assert.ok(settingsIds.includes('select.esterno_cb8c_bh2113803_suono_di_avviso'));
  assert.ok(settingsIds.includes('select.esterno_cb8c_bh2113803_modalita_di_funzionamento_della_batteria'));
});

test('real EZVIZ device: read-only sensors/binary_sensors/image on the same device stay out of controls/settings, grouped as diagnostics', () => {
  const { controls, settings, others, diagnostics, motions, batteries } = classify(REAL_AREA_ENTITIES);
  const controlIds = controls.map(c => c.entityId).concat(settings.map(s => s.entityId));
  assert.ok(!controlIds.some(id => id.includes('crittografia')));
  assert.ok(!controlIds.some(id => id.includes('ip_locale')));
  assert.ok(!controlIds.some(id => id.includes('ultima_immagine_motion')));

  assert.equal(motions.length, 1); // the movimento binary_sensor, by device_class
  assert.equal(batteries.length, 1);
  // more than one passive device-linked reading → grouped into its own
  // diagnostics pill instead of padding out the generic chip strip
  const diagIds = diagnostics.map(d => d.entityId);
  assert.ok(diagIds.includes('sensor.esterno_cb8c_bh2113803_batteria'));
  assert.ok(diagIds.includes('binary_sensor.esterno_cb8c_bh2113803_crittografia_2'));
  assert.ok(diagIds.includes('image.esterno_cb8c_bh2113803_ultima_immagine_motion'));
  assert.ok(!others.some(o => o.entityId === 'binary_sensor.esterno_cb8c_bh2113803_crittografia_2'));
});

test('real Bresser weather station: recognized device_classes group as weather; wind_direction (no device_class) falls to others', () => {
  const { weathers, temperatures, humidities, others } = classify(REAL_AREA_ENTITIES);
  const weatherIds = weathers.map(w => w.entityId);
  assert.ok(weatherIds.includes('sensor.bresser_7in1_65351_wind_average'));
  assert.ok(weatherIds.includes('sensor.bresser_7in1_65351_wind_max'));
  assert.equal(temperatures.length, 1);
  assert.equal(humidities.length, 1);
  assert.ok(others.some(o => o.entityId === 'sensor.bresser_7in1_65351_wind_direction'));
});

// A router's own CPU-temp/humidity sensor is entity_category: 'diagnostic' in
// the real HA entity registry — a technical readout, not a room-ambient
// reading. Must not feed the area's env-row temperature/humidity average
// (see isAmbient in discovery.js classify()); real-world case: a FRITZ!Box
// repeater's CPU temp (76°C) was dragging an area's displayed temperature
// up to the router's own heat instead of the room's.
test('a diagnostic-category temperature sensor is excluded from the ambient temperatures bucket', () => {
  const entities = [
    item('sensor.router_cpu_temp', { state: '76', attributes: { device_class: 'temperature' } }, 'dev_router', 'diagnostic'),
  ];
  const { temperatures, others } = classify(entities);
  assert.equal(temperatures.length, 0);
  assert.ok(others.some(o => o.entityId === 'sensor.router_cpu_temp'));
});

test('the same device_class temperature sensor with no entity_category (a real room sensor) still lands in the ambient temperatures bucket', () => {
  const entities = [
    item('sensor.room_temp', { state: '21.5', attributes: { device_class: 'temperature' } }),
  ];
  const { temperatures } = classify(entities);
  assert.equal(temperatures.length, 1);
});

test('a diagnostic-category humidity sensor is excluded from the ambient humidities bucket', () => {
  const entities = [
    item('sensor.router_humidity', { state: '40', attributes: { device_class: 'humidity' } }, 'dev_router', 'diagnostic'),
  ];
  const { humidities, others } = classify(entities);
  assert.equal(humidities.length, 0);
  assert.ok(others.some(o => o.entityId === 'sensor.router_humidity'));
});

test('a router pushing two diagnostic sensors (CPU temp + uptime) sweeps into that device\'s Diagnostics tab, not the area env-row', () => {
  const entities = [
    item('sensor.router_cpu_temp', { state: '76', attributes: { device_class: 'temperature' } }, 'dev_router', 'diagnostic'),
    item('sensor.router_uptime', { state: '2026-08-08T13:38:30+00:00' }, 'dev_router', 'diagnostic'),
  ];
  const { temperatures, diagnostics } = classify(entities);
  assert.equal(temperatures.length, 0);
  const diagIds = diagnostics.map(d => d.entityId);
  assert.ok(diagIds.includes('sensor.router_cpu_temp'));
  assert.ok(diagIds.includes('sensor.router_uptime'));
});

// IR blaster device with no camera at all, pushing a pile of switches/selects/
// numbers plus a couple of read-only sensors into the area — the exact shape
// that used to flood the generic chip strip untouched, since the old sweep
// only ever looked at devices sharing a camera.
const IR_DEVICE = 'dev_ir_clima_cucina';
const IR_AREA_ENTITIES = [
  item('switch.ir_clima_cucina_switch1', { state: 'on' }, IR_DEVICE),
  item('switch.ir_clima_cucina_switch2', { state: 'off' }, IR_DEVICE),
  item('select.ir_clima_cucina_switch1_on', { state: 'registered' }, IR_DEVICE),
  item('number.ir_clima_cucina_temperature_calibration', { state: '0' }, IR_DEVICE),
  item('sensor.ir_clima_cucina_learned_ir_code', { state: 'JgBM...' }, IR_DEVICE),
  item('sensor.ir_clima_cucina_battery', { state: '75', attributes: { device_class: 'battery' } }, IR_DEVICE),
  // Zigbee2MQTT LED, a *separate* device with 2 entities of its own (its
  // firmware update entity is diverted to the Updates bucket before it ever
  // reaches `others`, so only these 2 count toward the sweep threshold) —
  // must sweep independently of the IR device, not get lumped in with it.
  item('switch.led_cucina', { state: 'off' }, 'dev_led_cucina'),
  item('select.led_cucina_power_on_behavior', { state: 'off' }, 'dev_led_cucina'),
  // Unrelated single switch on its own device — stays a plain chip, not worth its own pill
  item('switch.lone_switch', { state: 'off' }, 'dev_lone_switch'),
];

test('IR blaster with no camera: multiple switches/select/number swept into settings, multiple passive sensors into diagnostics', () => {
  const { settings, diagnostics, others, batteries } = classify(IR_AREA_ENTITIES);
  const settingsIds = settings.map(s => s.entityId);
  assert.ok(settingsIds.includes('switch.ir_clima_cucina_switch1'));
  assert.ok(settingsIds.includes('switch.ir_clima_cucina_switch2'));
  assert.ok(settingsIds.includes('select.ir_clima_cucina_switch1_on'));
  assert.ok(settingsIds.includes('number.ir_clima_cucina_temperature_calibration'));

  const diagIds = diagnostics.map(d => d.entityId);
  assert.ok(diagIds.includes('sensor.ir_clima_cucina_learned_ir_code'));
  assert.ok(diagIds.includes('sensor.ir_clima_cucina_battery'));
  assert.equal(batteries.length, 1);

  assert.ok(others.some(o => o.entityId === 'switch.lone_switch'));
});

test('IR blaster with no camera: a second, unrelated 2-entity device (LED) sweeps into settings independently', () => {
  const { settings } = classify(IR_AREA_ENTITIES);
  const settingsIds = settings.map(s => s.entityId);
  assert.ok(settingsIds.includes('switch.led_cucina'));
  assert.ok(settingsIds.includes('select.led_cucina_power_on_behavior'));
});

// ── groupTabsByDevice ────────────────────────────────────────────────────────
// Regroups the ptz/controls/settings/diagnostics pools by physical device
// instead of by action-type, so the tab strip reads "which device is this"
// rather than "what kind of action is this".

const HASS_NO_NAMES = { devices: {} };

// groupTabsByDevice dedupes segment labels per device tab (see
// dedupeBucketLabels in discovery.js), so it expects the already
// display-mapped shape viewModel.js's mapEntityItem produces — not classify()'s
// raw { entityId, state, deviceId } items. label/fullName content doesn't
// matter for these tests (none assert on rendered label text), just presence.
const withLabels = items => items.map(i => ({ ...i, label: i.entityId, fullName: i.entityId }));
const asDisplayPools = ({ ptz, controls, settings, diagnostics }) => ({
  ptz: withLabels(ptz), controls: withLabels(controls), settings: withLabels(settings), diagnostics: withLabels(diagnostics),
});

test('groupTabsByDevice: one device pushing every role (ptz/controls/settings/diagnostics) gets a single tab with nothing lost', () => {
  const { ptz, controls, settings, diagnostics } = classify(REAL_AREA_ENTITIES);
  const groups = groupTabsByDevice(HASS_NO_NAMES, asDisplayPools({ ptz, controls, settings, diagnostics }));
  assert.equal(groups.length, 1);
  const [group] = groups;
  assert.equal(group.key, CAM_DEVICE);
  assert.equal(group.ptz.length, ptz.length);
  assert.equal(group.controls.length, controls.length);
  assert.equal(group.settings.length, settings.length);
  assert.equal(group.diagnostics.length, diagnostics.length);
});

test('groupTabsByDevice: falls back to the common entity_id prefix as a label when the device registry has no name', () => {
  const { ptz, controls, settings, diagnostics } = classify(REAL_AREA_ENTITIES);
  const [group] = groupTabsByDevice(HASS_NO_NAMES, asDisplayPools({ ptz, controls, settings, diagnostics }));
  assert.equal(group.label, 'Esterno Cb8c Bh2113803');
});

test('groupTabsByDevice: device registry name wins over the fallback', () => {
  const { ptz, controls, settings, diagnostics } = classify(REAL_AREA_ENTITIES);
  const hass = { devices: { [CAM_DEVICE]: { name: 'Esterno Cam' } } };
  const [group] = groupTabsByDevice(hass, asDisplayPools({ ptz, controls, settings, diagnostics }));
  assert.equal(group.label, 'Esterno Cam');
});

// Note: switch.lone_switch never reaches groupTabsByDevice at all here — its
// single-device threshold is enforced one layer up, by classify() itself
// (see the "stays in others" assertion above); it lands in `others`/chipItems,
// not in any of the ptz/controls/settings/diagnostics pools passed in below.
test('groupTabsByDevice: IR blaster + LED each get their own tab, independently of each other', () => {
  const { ptz, controls, settings, diagnostics } = classify(IR_AREA_ENTITIES);
  const groups = groupTabsByDevice(HASS_NO_NAMES, asDisplayPools({ ptz, controls, settings, diagnostics }));
  const byKey = Object.fromEntries(groups.map(g => [g.key, g]));

  assert.ok(byKey[IR_DEVICE]);
  assert.equal(byKey[IR_DEVICE].settings.length, 4);    // 2 switches + 1 select + 1 number
  assert.equal(byKey[IR_DEVICE].diagnostics.length, 2); // battery + learned-code sensor

  assert.ok(byKey.dev_led_cucina);
  assert.equal(byKey.dev_led_cucina.settings.length, 2);

  assert.equal(byKey.__other__, undefined);
});

// Unlike settings/diagnostics, classify() routes siren/button unconditionally
// into `controls` with no device-entity-count threshold (a lone reboot button
// is still a valid control on its own) — so groupTabsByDevice has to apply its
// own "not worth a dedicated tab" threshold for a single-item device reached
// through the controls/ptz pools, same fold as it would via settings/diagnostics.
test('groupTabsByDevice: a lone control-pool item on a single-entity device folds into "Other"', () => {
  const items = {
    ptz: [],
    controls: [{ entityId: 'button.lone_button', deviceId: 'dev_lone_button', label: 'lone_button', fullName: 'lone_button' }],
    settings: [],
    diagnostics: [],
  };
  const groups = groupTabsByDevice(HASS_NO_NAMES, items);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].key, '__other__');
  assert.equal(groups[0].label, 'Other');
  assert.ok(groups[0].controls.some(c => c.entityId === 'button.lone_button'));
});

test('groupTabsByDevice: the camera\'s device tab always sorts first, regardless of entity count', () => {
  const items = {
    ptz: [],
    controls: [],
    settings: [
      { entityId: 'switch.big_device_a', deviceId: 'dev_big', label: 'a', fullName: 'a' },
      { entityId: 'switch.big_device_b', deviceId: 'dev_big', label: 'b', fullName: 'b' },
      { entityId: 'switch.big_device_c', deviceId: 'dev_big', label: 'c', fullName: 'c' },
      { entityId: 'switch.cam_device_a', deviceId: 'dev_cam', label: 'a', fullName: 'a' },
      { entityId: 'switch.cam_device_b', deviceId: 'dev_cam', label: 'b', fullName: 'b' },
    ],
    diagnostics: [],
  };
  const groups = groupTabsByDevice(HASS_NO_NAMES, items, 'dev_cam');
  assert.deepEqual(groups.map(g => g.key), ['dev_cam', 'dev_big']);
});

// Label collisions only matter within the same rendered tab — dedupeBucketLabels
// runs per device, not across the whole area. dev_big and dev_cam each have
// their own "a"/"b" labels above; since they render in separate tabs, neither
// should get needlessly disambiguated just because the other device also has
// an "a" and a "b".
test('groupTabsByDevice: same label on two different devices does not trigger cross-device disambiguation', () => {
  const items = {
    ptz: [],
    controls: [],
    settings: [
      { entityId: 'switch.big_device_a', deviceId: 'dev_big', label: 'a', fullName: 'a' },
      { entityId: 'switch.big_device_b', deviceId: 'dev_big', label: 'b', fullName: 'b' },
      { entityId: 'switch.big_device_c', deviceId: 'dev_big', label: 'c', fullName: 'c' },
      { entityId: 'switch.cam_device_a', deviceId: 'dev_cam', label: 'a', fullName: 'a' },
      { entityId: 'switch.cam_device_b', deviceId: 'dev_cam', label: 'b', fullName: 'b' },
    ],
    diagnostics: [],
  };
  const groups = groupTabsByDevice(HASS_NO_NAMES, items, 'dev_cam');
  const byKey = Object.fromEntries(groups.map(g => [g.key, g]));
  assert.deepEqual(byKey.dev_big.settings.map(s => s.label), ['a', 'b', 'c']);
  assert.deepEqual(byKey.dev_cam.settings.map(s => s.label), ['a', 'b']);
});

// The inverse case: a settings item and a diagnostics item on the *same*
// device, both rendering inside that device's one tab, DO need to be
// compared against each other — the old per-role (not per-device) dedup
// missed this, since settings/diagnostics were deduped in separate arrays.
test('groupTabsByDevice: colliding labels across roles on the SAME device get disambiguated', () => {
  const items = {
    ptz: [],
    controls: [],
    settings: [{ entityId: 'switch.dev_x_power', deviceId: 'dev_x', label: 'Power', fullName: 'Dev X Power' }],
    diagnostics: [{ entityId: 'sensor.dev_x_power', deviceId: 'dev_x', label: 'Power', fullName: 'Dev X Sensor Power' }],
  };
  const groups = groupTabsByDevice(HASS_NO_NAMES, items);
  const [group] = groups;
  const labels = [...group.settings, ...group.diagnostics].map(i => i.label);
  assert.notDeepEqual(labels, ['Power', 'Power']);
  assert.equal(new Set(labels).size, 2);
});

// Third real production shape, no camera at all: a D017 dehumidifier device
// (2 switches + 2 selects + 1 number + a lone error sensor) and a *separate*
// ripostiglio_interno_ths climate-sensor device (2 calibration numbers + vpd +
// battery sensors) in the same area. The dehumidifier's error sensor is the
// only diagnostic-role item on its device, but the device as a whole clears
// the sweep threshold (6 others-eligible entities total) — proves the
// threshold is per-device, not per-role.
const D017_DEVICE = 'dev_d017_dehumidifier';
const THS_DEVICE  = 'dev_ths_ripostiglio';
const DEHUMIDIFIER_AREA_ENTITIES = [
  item('switch.d017_dehumidifier_5v_power', { state: 'on' }, D017_DEVICE),
  item('switch.d017_dehumidifier_5v_child_lock', { state: 'on' }, D017_DEVICE),
  item('select.d017_dehumidifier_5v_fan', { state: '2' }, D017_DEVICE),
  item('select.d017_dehumidifier_5v_mode', { state: 'dehumidifier,laundry,mute,wind' }, D017_DEVICE),
  item('number.d017_dehumidifier_5v_humidity_tartget', { state: '55' }, D017_DEVICE),
  item('sensor.d017_dehumidifier_5v_error', { state: '0' }, D017_DEVICE),
  item('number.ripostiglio_interno_ths_humidity_calibration', { state: '0' }, THS_DEVICE),
  item('number.ripostiglio_interno_ths_temperature_calibration', { state: '0' }, THS_DEVICE),
  item('sensor.ripostiglio_interno_ths_vpd', { state: '1.83' }, THS_DEVICE),
  item('sensor.ripostiglio_interno_ths_battery', { state: '100', attributes: { device_class: 'battery' } }, THS_DEVICE),
];

test('D017 dehumidifier + THS sensor, no camera: operable entities swept into settings, passive into diagnostics, per device', () => {
  const { settings, diagnostics } = classify(DEHUMIDIFIER_AREA_ENTITIES);
  const settingsIds    = settings.map(s => s.entityId);
  const diagnosticsIds = diagnostics.map(d => d.entityId);

  for (const id of [
    'switch.d017_dehumidifier_5v_power', 'switch.d017_dehumidifier_5v_child_lock',
    'select.d017_dehumidifier_5v_fan', 'select.d017_dehumidifier_5v_mode',
    'number.d017_dehumidifier_5v_humidity_tartget',
    'number.ripostiglio_interno_ths_humidity_calibration', 'number.ripostiglio_interno_ths_temperature_calibration',
  ]) assert.ok(settingsIds.includes(id), id);

  // the D017 device's lone diagnostic reading still sweeps — the >1 threshold
  // is on the device's total others-eligible count (6), not the diagnostics
  // role count (1) in isolation
  for (const id of ['sensor.d017_dehumidifier_5v_error', 'sensor.ripostiglio_interno_ths_vpd', 'sensor.ripostiglio_interno_ths_battery'])
    assert.ok(diagnosticsIds.includes(id), id);
});

test('groupTabsByDevice: D017 dehumidifier and THS sensor get independent tabs, each labeled from the device registry', () => {
  const { ptz, controls, settings, diagnostics } = classify(DEHUMIDIFIER_AREA_ENTITIES);
  const hass = {
    devices: {
      [D017_DEVICE]: { name: 'D017-Dehumidifier-5V' },
      [THS_DEVICE]: { name: 'ripostiglio_interno_ths' },
    },
  };
  const groups = groupTabsByDevice(hass, asDisplayPools({ ptz, controls, settings, diagnostics }));
  const byKey = Object.fromEntries(groups.map(g => [g.key, g]));

  assert.equal(byKey[D017_DEVICE].label, 'D017-Dehumidifier-5V');
  assert.equal(byKey[D017_DEVICE].settings.length, 5);
  assert.equal(byKey[D017_DEVICE].diagnostics.length, 1);

  assert.equal(byKey[THS_DEVICE].label, 'ripostiglio_interno_ths');
  assert.equal(byKey[THS_DEVICE].settings.length, 2);
  assert.equal(byKey[THS_DEVICE].diagnostics.length, 2);
});

// SONOFF SNZB-04P contact sensor (door_ground_floor) — exposes a device_class
// "opening" binary_sensor plus its own battery %, voltage and tamper readings
// on one device. Real risk this guards against: 3 entities pushed into
// `others` (battery + voltage + linkquality, all not otherwise bucketed)
// trips classify()'s device sweep and buries the open/closed state behind a
// Diagnostics tab — the whole point of giving contact sensors their own
// `openings` bucket.
const DOOR_DEVICE = 'dev_door_ground_floor';
const DOOR_SENSOR_ENTITIES = [
  item('binary_sensor.door_ground_floor_contact', { state: 'off', attributes: { device_class: 'opening' } }, DOOR_DEVICE),
  item('binary_sensor.door_ground_floor_tamper', { state: 'off', attributes: { device_class: 'tamper' } }, DOOR_DEVICE),
  item('sensor.door_ground_floor_battery', { state: '100', attributes: { device_class: 'battery' } }, DOOR_DEVICE),
  item('sensor.door_ground_floor_voltage', { state: '3100', attributes: { device_class: 'voltage' } }, DOOR_DEVICE),
  item('sensor.door_ground_floor_linkquality', { state: '132' }, DOOR_DEVICE),
];

test('SNZB-04P contact sensor: device_class "opening" lands in openings, not others/diagnostics', () => {
  const { openings, others, diagnostics } = classify(DOOR_SENSOR_ENTITIES);
  assert.deepEqual(openings.map(o => o.entityId), ['binary_sensor.door_ground_floor_contact']);
  assert.ok(!others.some(o => o.entityId.includes('_contact')));
  assert.ok(!diagnostics.some(d => d.entityId.includes('_contact')));
});

test('SNZB-04P contact sensor: tamper (dc=tamper) lands in its own tampers bucket, on or off, never in problems', () => {
  const idle = classify(DOOR_SENSOR_ENTITIES);
  assert.deepEqual(idle.tampers.map(t => t.entityId), ['binary_sensor.door_ground_floor_tamper']);
  assert.equal(idle.problems.length, 0);

  const tampered = DOOR_SENSOR_ENTITIES.map(e =>
    e.entityId.endsWith('_tamper') ? { ...e, state: { ...e.state, state: 'on' } } : e);
  const active = classify(tampered);
  assert.deepEqual(active.tampers.map(t => t.entityId), ['binary_sensor.door_ground_floor_tamper']);
  assert.equal(active.problems.length, 0);
});

test('SNZB-04P contact sensor: an unavailable contact/tamper sensor still surfaces as a problem, not silently "closed"/"normal"', () => {
  const offline = DOOR_SENSOR_ENTITIES.map(e =>
    (e.entityId.endsWith('_contact') || e.entityId.endsWith('_tamper'))
      ? { ...e, state: { ...e.state, state: 'unavailable' } }
      : e);
  const { openings, tampers, problems } = classify(offline);
  assert.ok(!openings.some(o => o.entityId.includes('_contact')));
  assert.ok(!tampers.some(t => t.entityId.includes('_tamper')));
  const problemIds = problems.map(p => p.entityId);
  assert.ok(problemIds.includes('binary_sensor.door_ground_floor_contact'));
  assert.ok(problemIds.includes('binary_sensor.door_ground_floor_tamper'));
});

test('SNZB-04P contact sensor: battery/voltage/linkquality still group as diagnostics (openings bucket does not swallow them)', () => {
  const { diagnostics } = classify(DOOR_SENSOR_ENTITIES);
  const diagIds = diagnostics.map(d => d.entityId);
  assert.ok(diagIds.includes('sensor.door_ground_floor_battery'));
  assert.ok(diagIds.includes('sensor.door_ground_floor_voltage'));
  assert.ok(diagIds.includes('sensor.door_ground_floor_linkquality'));
});

// EZVIZ-style camera device with an Italian "riservatezza" (privacy) switch —
// real-world shape: switch.cam_soggiorno_riservatezza on the same device as
// the camera entity. viewModel.js joins cameraPrivacy back to the camera by
// deviceId, so classify() must surface it in its own bucket while still
// letting it participate in the normal others/settings sweep like any other
// switch on the device.
const PRIVACY_CAM_DEVICE = 'dev_cam_privacy_test';
const PRIVACY_CAM_ENTITIES = [
  item('camera.cam_privacy_test', { state: 'idle' }, PRIVACY_CAM_DEVICE),
  item('switch.cam_privacy_test_riservatezza', { state: 'on' }, PRIVACY_CAM_DEVICE),
  item('switch.cam_privacy_test_audio', { state: 'on' }, PRIVACY_CAM_DEVICE),
];

test('classify: a privacy/riservatezza switch lands in cameraPrivacy, and still sweeps into settings like any other switch', () => {
  const { cameraPrivacy, settings } = classify(PRIVACY_CAM_ENTITIES);
  assert.deepEqual(cameraPrivacy.map(p => p.entityId), ['switch.cam_privacy_test_riservatezza']);
  assert.ok(settings.some(s => s.entityId === 'switch.cam_privacy_test_riservatezza'));
});

test('classify: "door"/"window"/"garage_door" device_classes also land in openings (dc family, not just "opening")', () => {
  const mixed = [
    item('binary_sensor.front_door', { state: 'on', attributes: { device_class: 'door' } }, 'devA'),
    item('binary_sensor.kitchen_window', { state: 'off', attributes: { device_class: 'window' } }, 'devB'),
    item('binary_sensor.garage', { state: 'off', attributes: { device_class: 'garage_door' } }, 'devC'),
  ];
  const { openings } = classify(mixed);
  assert.equal(openings.length, 3);
});
