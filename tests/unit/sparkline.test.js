import { test } from 'node:test';
import assert from 'node:assert/strict';
import { downsample } from '../../src/sparkline.js';

const pt = (t, v) => ({ t, v });

test('passthrough when already at or under maxPoints', () => {
  const pts = [pt(0, 5), pt(1, 9), pt(2, 1), pt(3, 3)];
  assert.deepEqual(downsample(pts, 4), pts);
});

test('keeps each bucket\'s min and max, in original order', () => {
  const pts = [pt(0, 5), pt(1, 9), pt(2, 1), pt(3, 3), pt(4, 8), pt(5, 2)]; // bucket0 = idx 0-2, bucket1 = idx 3-5
  assert.deepEqual(downsample(pts, 4), [
    pt(1, 9), pt(2, 1),
    pt(4, 8), pt(5, 2),
  ]);
});

test('never overshoots maxPoints, even when maxPoints is odd', () => {
  const pts = Array.from({ length: 200 }, (_, i) => pt(i, i));
  const reduced = downsample(pts, 41);
  assert.ok(reduced.length <= 41, `expected <= 41, got ${reduced.length}`);
});

test('a leading NaN in a bucket does not poison min/max selection', () => {
  // 6-point series, maxPoints=4 -> 2 buckets of 3: [NaN, 1, 9] and [2, 8, 3]
  const pts = [pt(0, NaN), pt(1, 1), pt(2, 9), pt(3, 2), pt(4, 8), pt(5, 3)];
  const reduced = downsample(pts, 4);
  assert.ok(reduced.some(p => p.v === 9), 'true bucket max (9) must survive despite the leading NaN');
  assert.ok(reduced.some(p => p.v === 1), 'true bucket min (1) must survive despite the leading NaN');
});

test('a bucket that is entirely gaps keeps one representative point instead of vanishing', () => {
  const pts = [pt(0, NaN), pt(1, NaN), pt(2, NaN), pt(3, 5), pt(4, 6), pt(5, 7)];
  const reduced = downsample(pts, 4);
  assert.equal(reduced.filter(p => p.t < 3).length, 1);
});

test('output timestamps stay monotonically increasing (x-position never runs backwards)', () => {
  const pts = Array.from({ length: 244 }, (_, i) => pt(i, 15 + 10 * Math.sin(i / 12)));
  const reduced = downsample(pts);
  for (let i = 1; i < reduced.length; i++) assert.ok(reduced[i].t > reduced[i - 1].t);
});
