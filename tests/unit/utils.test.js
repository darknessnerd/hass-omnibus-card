import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uniqueLabels } from '../../src/utils.js';

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
