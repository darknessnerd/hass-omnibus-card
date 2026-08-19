/**
 * Returns an SVG string positioned as an absolute background layer.
 *
 * When hc.threshold_high / threshold_low are set, the area fill is split into
 * colored zones by clipping colored rectangles to the sparkline fill path:
 *   - fill above threshold_high Y → color_high
 *   - fill below threshold_low Y → color_low
 *   - fill in between            → base color
 * Thresholds outside the data range are clamped and produce zero-height rects.
 */

/** Shared scale: computes effective min/max/range from data bounds + hc y_min/y_max. */
export function computeScale(hc, dataMin, dataMax) {
  const min = hc?.y_min != null ? Math.min(hc.y_min, dataMin) : dataMin;
  const max = hc?.y_max != null ? Math.max(hc.y_max, dataMax) : dataMax;
  return { min, max, range: max - min };
}

export function sparklineSvg(points, color, hc = null) {
  if (!points?.length || points.length < 2) return '';

  const W = 300, H = 60;
  const dataMin = Math.min(...points);
  const dataMax = Math.max(...points);
  const { min, max, range } = computeScale(hc, dataMin, dataMax);

  // All points identical and no y bounds set → no meaningful shape to draw
  if (range === 0 && hc?.y_min == null && hc?.y_max == null) return '';

  const effectiveRange = range || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * W);
  const ys = points.map(v => H - ((v - min) / effectiveRange) * H);
  const d  = xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const path = `${d} V${H} H0 Z`;

  const hasThresholds = hc && (hc.threshold_high != null || hc.threshold_low != null);

  if (!hasThresholds) {
    return _wrap(W, H, `<path d="${path}" fill="${color}"/>`);
  }

  const base      = hc.color      ?? 'rgba(3, 169, 244, 0.12)';
  const colorHigh = hc.color_high ?? 'rgba(244, 67, 54, 0.25)';
  const colorLow  = hc.color_low  ?? 'rgba(33, 150, 243, 0.25)';

  // Map a data value to its Y pixel position (0 = top = high values)
  const toY = v => Math.max(0, Math.min(H, H - ((v - min) / effectiveRange) * H));

  const defs = `<defs><clipPath id="sg-cp"><path d="${path}"/></clipPath></defs>`;
  let body = `<path d="${path}" fill="${base}"/>`;

  if (hc.threshold_high != null) {
    const yH = toY(hc.threshold_high);
    if (yH > 0) {
      body += `<rect x="0" y="0" width="${W}" height="${yH.toFixed(1)}" fill="${colorHigh}" clip-path="url(#sg-cp)"/>`;
    }
    if (yH > 0 && yH < H) {
      body += `<line x1="0" y1="${yH.toFixed(1)}" x2="${W}" y2="${yH.toFixed(1)}" stroke="${colorHigh}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`;
    }
  }

  if (hc.threshold_low != null) {
    const yL = toY(hc.threshold_low);
    if (yL < H) {
      body += `<rect x="0" y="${yL.toFixed(1)}" width="${W}" height="${(H - yL).toFixed(1)}" fill="${colorLow}" clip-path="url(#sg-cp)"/>`;
    }
    if (yL > 0 && yL < H) {
      body += `<line x1="0" y1="${yL.toFixed(1)}" x2="${W}" y2="${yL.toFixed(1)}" stroke="${colorLow}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`;
    }
  }

  return _wrap(W, H, defs + body);
}

function _wrap(w, h, content) {
  return `<svg class="bg-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${content}</svg>`;
}
