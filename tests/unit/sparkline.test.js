import { test } from 'node:test';
import assert from 'node:assert/strict';
import { downsample } from '../../src/sparkline.js';

test('passthrough when already at or under maxPoints', () => {
  const pts = [5, 9, 1, 3];
  assert.deepEqual(downsample(pts, 4), [
    { value: 5, index: 0 }, { value: 9, index: 1 }, { value: 1, index: 2 }, { value: 3, index: 3 },
  ]);
});

test('keeps each bucket\'s min and max, in original order', () => {
  const pts = [5, 9, 1, 3, 8, 2]; // bucket0 = [5,9,1] (idx 0-2), bucket1 = [3,8,2] (idx 3-5)
  assert.deepEqual(downsample(pts, 4), [
    { value: 9, index: 1 }, { value: 1, index: 2 },
    { value: 8, index: 4 }, { value: 2, index: 5 },
  ]);
});

test('never overshoots maxPoints, even when maxPoints is odd', () => {
  const pts = Array.from({ length: 200 }, (_, i) => i);
  const reduced = downsample(pts, 41);
  assert.ok(reduced.length <= 41, `expected <= 41, got ${reduced.length}`);
});

test('a leading NaN in a bucket does not poison min/max selection', () => {
  // 6-point series, maxPoints=4 -> 2 buckets of 3: [NaN, 1, 9] and [2, 8, 3]
  const pts = [NaN, 1, 9, 2, 8, 3];
  const reduced = downsample(pts, 4);
  assert.ok(reduced.some(p => p.value === 9), 'true bucket max (9) must survive despite the leading NaN');
  assert.ok(reduced.some(p => p.value === 1), 'true bucket min (1) must survive despite the leading NaN');
});

test('a bucket that is entirely gaps keeps one representative point instead of vanishing', () => {
  const pts = [NaN, NaN, NaN, 5, 6, 7];
  const reduced = downsample(pts, 4);
  assert.equal(reduced.filter(p => p.index < 3).length, 1);
});

test('output indices stay monotonically increasing (x-position never runs backwards)', () => {
  const pts = Array.from({ length: 244 }, (_, i) => 15 + 10 * Math.sin(i / 12));
  const reduced = downsample(pts);
  for (let i = 1; i < reduced.length; i++) assert.ok(reduced[i].index > reduced[i - 1].index);
});
