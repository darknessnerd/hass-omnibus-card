/**
 * Returns an SVG string positioned as an absolute background layer.
 * Points must be numeric; fewer than 2 returns empty string.
 */
export function sparklineSvg(points, color) {
  if (!points?.length || points.length < 2) return '';

  const W = 300, H = 60;
  const min   = Math.min(...points);
  const max   = Math.max(...points);
  const range = max - min || 1;
  const xs    = points.map((_, i) => (i / (points.length - 1)) * W);
  const ys    = points.map(v => H - ((v - min) / range) * H);
  const d     = xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');

  return `<svg class="bg-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">`
    + `<path d="${d} V${H} H0 Z" fill="${color}"/>`
    + `</svg>`;
}
