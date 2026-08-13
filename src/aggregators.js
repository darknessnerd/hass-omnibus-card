/**
 * Pure aggregation functions over entity lists.
 * No imports, no side effects — easy to unit-test in isolation.
 */

/** Numeric average of sensor states; returns null when no valid values. */
export function average(items) {
  const nums = items.map(i => parseFloat(i.state.state)).filter(n => !isNaN(n));
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** True if at least one entity in the list has state 'on'. */
export function anyOn(items) {
  return items.some(i => i.state.state === 'on');
}

/** Filters to lights that are currently on. */
export function activeLights(lights) {
  return lights.filter(l => l.state.state === 'on');
}

/** Returns a CSS rgb() string from the first on-light with an rgb_color attribute. */
export function rgbColor(onLights) {
  for (const l of onLights) {
    const rgb = l.state.attributes?.rgb_color;
    if (rgb) return `rgb(${rgb.join(',')})`;
  }
  return null;
}
