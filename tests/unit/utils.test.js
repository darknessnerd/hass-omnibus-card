import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uniqueLabels, entityLabel, formatNumber, deviceLabel } from '../../src/utils.js';

test('uniqueLabels: passthrough when no labels collide', () => {
  const items = [
    { entityId: 'sensor.a', label: 'Foo', fullName: 'Cam A Foo' },
    { entityId: 'sensor.b', label: 'Bar', fullName: 'Cam B Bar' },
  ];
  assert.deepEqual(uniqueLabels(items), items);
});

test('uniqueLabels: real collision — two entities both ending in "Allarme" grow to the fewest unique trailing words', () => {
  const items = [
    { entityId: 'sensor.codice', label: 'Allarme', fullName: 'Cam Cucina Codice Del Tipo Di Ultimo Allarme' },
    { entityId: 'sensor.nome',   label: 'Allarme', fullName: 'Cam Cucina Nome Dell Ultimo Tipo Di Allarme' },
  ];
  const result = uniqueLabels(items);
  const labels = result.map(r => r.label);
  assert.notEqual(labels[0], labels[1]);
  // both now carry more context than a lone "Allarme"
  assert.ok(labels[0].endsWith('Allarme'));
  assert.ok(labels[1].endsWith('Allarme'));
});

test('uniqueLabels: three-way collision all resolve to distinct labels', () => {
  const items = [
    { entityId: 'switch.a', label: 'Movimento', fullName: 'Cam A Tracciamento Del Movimento' },
    { entityId: 'binary_sensor.b', label: 'Movimento', fullName: 'Cam B Rileva Movimento' },
    { entityId: 'switch.c', label: 'Movimento', fullName: 'Cam C Segui Il Movimento' },
  ];
  const labels = uniqueLabels(items).map(r => r.label);
  assert.equal(new Set(labels).size, 3);
});

test('uniqueLabels: falls back to the entity_id suffix if even the full name collides', () => {
  const items = [
    { entityId: 'sensor.a', label: 'X', fullName: 'X' },
    { entityId: 'sensor.b', label: 'X', fullName: 'X' },
  ];
  const labels = uniqueLabels(items).map(r => r.label);
  assert.deepEqual(labels, ['a', 'b']);
});

test('uniqueLabels: does not mutate items that are not part of any collision', () => {
  const untouched = { entityId: 'sensor.c', label: 'Unique', fullName: 'Totally Unique' };
  const items = [
    { entityId: 'sensor.a', label: 'Allarme', fullName: 'Cam A Tipo Di Allarme' },
    { entityId: 'sensor.b', label: 'Allarme', fullName: 'Cam B Nome Di Allarme' },
    untouched,
  ];
  const result = uniqueLabels(items);
  assert.equal(result.find(r => r.entityId === 'sensor.c').label, 'Unique');
});

test('formatNumber: drops ".0", rounds ≥ 100, abbreviates ≥ 10 000', () => {
  assert.equal(formatNumber(4), '4');
  assert.equal(formatNumber(2.5), '2.5');
  assert.equal(formatNumber(57.13), '57.1');
  assert.equal(formatNumber(-20.9), '-20.9');
  assert.equal(formatNumber(123.6), '124');
  assert.equal(formatNumber(15741), '15.7k');
  assert.equal(formatNumber(20000), '20k');
});

test('entityLabel: strips the device registry name from friendly_name', () => {
  const hass  = { devices: { cam: { name: 'Cam Esterno' } } };
  const state = { attributes: { friendly_name: 'Cam Esterno motion detection' } };
  assert.equal(entityLabel(hass, 'switch.x', state, 'cam'), 'Motion detection');
});

test('entityLabel: falls back to the area name prefix, then to the last word', () => {
  const hass = { devices: {} };
  assert.equal(entityLabel(hass, 'switch.x', { attributes: { friendly_name: 'Living Room Floor Lamp' } }, null, 'Living Room'), 'Floor Lamp');
  assert.equal(entityLabel(hass, 'switch.x', { attributes: { friendly_name: 'Some Smart Plug' } }, null, 'Kitchen'), 'Plug');
});

test('entityLabel: a friendly_name equal to the device name is not stripped to nothing', () => {
  const hass  = { devices: { plug: { name: 'Coffee Plug' } } };
  const state = { attributes: { friendly_name: 'Coffee Plug' } };
  assert.equal(entityLabel(hass, 'switch.x', state, 'plug'), 'Plug');
});

test('deviceLabel: strips the area name (slug or spaced) off the registry name', () => {
  const hass = { devices: { ths: { name: 'ripostiglio_interno_ths' }, d017: { name: 'D017-Dehumidifier-5V' } } };
  assert.equal(deviceLabel(hass, 'ths', [], 'Ripostiglio Interno'), 'Ths');
  assert.equal(deviceLabel(hass, 'd017', [], 'Ripostiglio Interno'), 'D017-Dehumidifier-5V');
});
