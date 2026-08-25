import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify } from '../../src/discovery.js';

// Shape modeled on a real production debug log: an EZVIZ camera device
// ("esterno_cb8c_bh2113803") exposing Italian PTZ buttons, several switches,
// a number, two selects, a siren, and a pile of read-only diagnostic sensors —
// plus a separate Bresser 7-in-1 weather station in the same area but on no
// device at all. This is the exact real-world shape the controls-grouping
// restyle needs to hold up against: one device pushing 9 operable entities
// into a single Controls pill.
const CAM_DEVICE = 'dev_esterno_cam';

function item(entityId, state, deviceId = null) {
  return { entityId, state, deviceId };
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
