/**
 * Renders a history sparkline as an SVG string, meant to sit as an absolute
 * background layer behind a card (see the `bg-chart` class in `_wrap`).
 *
 * Coordinate system: data points are plotted left→right across a fixed
 * 300×60 viewBox. X is just the point's index scaled across the width; Y is
 * the value scaled into the height, INVERTED (SVG y=0 is the top, so high
 * values get a small y and low values get a large y). The path is closed
 * down to the bottom-left/right corners (`V${H} H0 Z`) so it can be filled
 * as an area, not just stroked as a line.
 *
 * Example — 5 points, no thresholds, one dot per point with a hover tooltip.
 * Two <svg> elements come back concatenated: the visible chart (.bg-chart,
 * under the card content) and an invisible hover layer (.chart-hit-layer,
 * painted ABOVE the card content — see the note above `hits` below for why):
 *   sparklineSvg([10, 12, 8, 14, 11], 'rgba(3,169,244,0.4)', null, '°C')
 *   → '<svg class="bg-chart" viewBox="0 0 300 60" ...>
 *        <path d="M0.0,26.7 L75.0,13.3 L150.0,60.0 L225.0,0.0 L300.0,20.0 V60 H0 Z" fill="rgba(3,169,244,0.4)"/>
 *        <circle cx="0.0" cy="26.7" r="1.5" fill="rgba(3,169,244,0.4)"/>...
 *      </svg>
 *      <svg class="chart-hit-layer" viewBox="0 0 300 60" ...>
 *        <circle cx="0.0" cy="26.7" r="4" fill="transparent"><title>10.0°C</title></circle>...
 *      </svg>'
 *   (value 8, the min, maps to y=60/bottom; value 14, the max, maps to y=0/top;
 *    hovering any dot in a real browser shows its value as a native tooltip)
 *
 * When hc.threshold_high / threshold_low are set, the same area fill is
 * split into colored zones by drawing colored rectangles and clipping them
 * to the sparkline's own fill path (`clip-path="url(#sg-cp)"`):
 *   - fill above the threshold_high Y line → color_high (e.g. red danger zone)
 *   - fill below the threshold_low Y line  → color_low  (e.g. blue cold zone)
 *   - fill in between                      → base color
 * A dashed guide line is drawn at each threshold, skipped when the threshold
 * sits exactly at or beyond the chart edge (nothing to show).
 * Thresholds outside the data range are clamped by `toY` to [0, H] and
 * simply produce a full- or zero-height rect — never an error.
 *
 * Example — thresholds split the fill into 3 colored bands:
 *   sparklineSvg([10, 20, 30], 'base', { threshold_high: 25, threshold_low: 15,
 *                                        color_high: 'red', color_low: 'blue' })
 *   → area above y(25) tinted red, area below y(15) tinted blue,
 *     the middle band stays 'base', plus a dashed line at each threshold.
 */

/**
 * Shared scale: computes the effective min/max/range for the Y axis from
 * the data's own min/max, widened (never narrowed) by hc.y_min / hc.y_max.
 * This lets a chart config pin an absolute floor/ceiling (e.g. y_min: 0 so
 * a flat-lining sensor still shows a line instead of a degenerate point).
 *
 * Example:
 *   computeScale({ y_min: 0 }, 18, 24)  → { min: 0,  max: 24, range: 24 }
 *   computeScale(null,        18, 24)  → { min: 18, max: 24, range: 6  }
 */
export function computeScale(hc, dataMin, dataMax) {
  const min = hc?.y_min != null ? Math.min(hc.y_min, dataMin) : dataMin;
  const max = hc?.y_max != null ? Math.max(hc.y_max, dataMax) : dataMax;
  return { min, max, range: max - min };
}

/**
 * Reduces a dense series to at most `maxPoints` while preserving every
 * bucket's min AND max — so a spike/dip (e.g. a threshold breach) can never
 * silently vanish the way plain stride-sampling or averaging would. Each
 * kept point carries its original index so callers can still place it at
 * its true (non-uniform) x position instead of an evenly-respaced one.
 *
 * Example:
 *   downsample([5, 9, 1, 3], 4)  → [{value:5,index:0},{value:9,index:1},{value:1,index:2},{value:3,index:3}] (already ≤ max, untouched)
 *   downsample([5,9,1,3,8,2], 4) → 2 buckets of 3 → min+max of each, in original order:
 *                                   [{value:9,index:1},{value:1,index:2},{value:8,index:4},{value:2,index:5}]
 */
export function downsample(points, maxPoints = 150) {
  if (points.length <= maxPoints) return points.map((value, index) => ({ value, index }));

  // floor (not ceil) so a 2-per-bucket output never exceeds maxPoints, even
  // when maxPoints is odd — undershooting by at most 1 beats overshooting.
  const bucketCount = Math.floor(maxPoints / 2);
  const bucketSize = points.length / bucketCount;
  const result = [];
  for (let b = 0; b < bucketCount; b++) {
    const start = Math.floor(b * bucketSize);
    const end = b === bucketCount - 1 ? points.length : Math.floor((b + 1) * bucketSize);
    if (start >= end) continue;

    // Seed from the first FINITE reading, not just `start` — an unavailable
    // (NaN) point at the front of the bucket would otherwise poison every
    // comparison below (`x < NaN` and `x > NaN` are always false), pinning
    // min/max at that NaN and silently dropping the bucket's real extremes.
    let minIdx = -1, maxIdx = -1;
    for (let i = start; i < end; i++) {
      if (!Number.isFinite(points[i])) continue;
      if (minIdx === -1 || points[i] < points[minIdx]) minIdx = i;
      if (maxIdx === -1 || points[i] > points[maxIdx]) maxIdx = i;
    }
    if (minIdx === -1) {
      // Whole bucket is gaps — keep one representative point rather than dropping the bucket silently.
      result.push({ value: points[start], index: start });
    } else if (minIdx === maxIdx) {
      result.push({ value: points[minIdx], index: minIdx });
    } else {
      const [first, second] = minIdx < maxIdx ? [minIdx, maxIdx] : [maxIdx, minIdx];
      result.push({ value: points[first], index: first }, { value: points[second], index: second });
    }
  }
  return result;
}

// Independent of downsample()'s own maxPoints (150) — that cap is about
// keeping SVG size/hit-target density sane, this one is about how many
// dots can overlap into a smooth band before they scallop into a ridge
// (see the `dot` comment below). Deliberately much lower than 150.
const DOT_MAX_POINTS = 40;

export function sparklineSvg(points, color, hc = null, unit = '') {
  if (!points?.length || points.length < 2) return '';

  const W = 300, H = 60;
  const dataMin = Math.min(...points);
  const dataMax = Math.max(...points);
  const { min, max, range } = computeScale(hc, dataMin, dataMax);

  // All points identical and no y bounds set → range is 0 → every point
  // would map to the same Y → a flat line with no shape worth drawing.
  if (range === 0 && hc?.y_min == null && hc?.y_max == null) return '';

  // range || 1 guards the flat-line-with-y_min case above from a division by 0.
  const effectiveRange = range || 1;
  // Reduce dense series (e.g. hundreds of points) before laying out geometry,
  // so both the visible dots and the hover hit-targets stay sparse together —
  // downsampling after would desync the two layers.
  const reduced = downsample(points);
  const originalLength = points.length;
  const xs = reduced.map(p => (p.index / (originalLength - 1)) * W);   // original position preserved, not re-indexed, so spacing stays proportional to real gaps
  const ys = reduced.map(p => H - ((p.value - min) / effectiveRange) * H); // H (bottom) → 0 (top), inverted for SVG
  const d  = xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const path = `${d} V${H} H0 Z`; // close the line down into a fillable area
  // Small visible, non-interactive dot per point — lives in the .bg-chart
  // layer (z-index 0, under .card-content), same as the fill/path. Only
  // worth drawing for sparse series where each vertex reads as a discrete
  // marker; past DOT_MAX_POINTS the circles no longer overlap into a smooth
  // band and instead scallop the line into a bumpy ridge, so skip them and
  // let the fill/stroke alone carry a dense curve's shape.
  const dense = reduced.length > DOT_MAX_POINTS;
  const dot = dense ? '' :
    xs.map((x, i) => `<circle cx="${x.toFixed(1)}" cy="${ys[i].toFixed(1)}" r="1.5" fill="${color}"/>`).join('');
  // .bg-chart sits BEHIND .card-content (z-index 0 vs 1), so a hover target
  // placed there never wins hit-testing — .card-content, though visually
  // transparent, still sits on top and swallows the pointer first. So the
  // <title> tooltip hit-targets live in a SEPARATE svg layer (.chart-hit-layer,
  // see styles.js) painted ABOVE .card-content; only the circles themselves
  // opt into pointer-events (via the `.chart-hit-layer circle` CSS rule —
  // the layer itself stays pointer-events:none, like .bg-chart, so it
  // doesn't block clicks elsewhere on the card).
  //
  // Radius is capped at half the average point spacing so hit targets don't
  // overlap their neighbors — an uncapped r=4 would make later-painted
  // circles swallow earlier ones' hit area, leaving most tooltips unreachable.
  const spacing = W / (xs.length - 1);
  const hitR = Math.min(4, spacing / 2).toFixed(1);
  const hitLayer = xs.map((x, i) => {
    if (!Number.isFinite(reduced[i].value)) return ''; // unavailable/unknown reading → no tooltip to show
    return `<circle cx="${x.toFixed(1)}" cy="${ys[i].toFixed(1)}" r="${hitR}" fill="transparent"><title>${reduced[i].value.toFixed(1)}${unit}</title></circle>`;
  }).join('');
  // `dense` (no permanent dot) is the only case that needs a hover-paint
  // affordance (see .chart-hit-layer.dense circle:hover in styles.js) — a
  // sparse series already has its own always-visible, series-colored dot,
  // so repainting it accent-blue on hover would look like a color glitch.
  const hits = `<svg class="chart-hit-layer${dense ? ' dense' : ''}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${hitLayer}</svg>`;

  const hasThresholds = hc && (hc.threshold_high != null || hc.threshold_low != null);

  if (!hasThresholds) {
    return _wrap(W, H, `<path d="${path}" fill="${color}"/>${dot}`) + hits;
  }

  const base      = hc.color      ?? 'rgba(3, 169, 244, 0.12)';
  const colorHigh = hc.color_high ?? 'rgba(244, 67, 54, 0.25)';
  const colorLow  = hc.color_low  ?? 'rgba(33, 150, 243, 0.25)';

  // Map a data value (in threshold units, not pixels) to its Y pixel
  // position, clamped to the chart so out-of-range thresholds degrade to
  // a full-height or zero-height rect instead of drawing off-canvas.
  const toY = v => Math.max(0, Math.min(H, H - ((v - min) / effectiveRange) * H));

  const defs = `<defs><clipPath id="sg-cp"><path d="${path}"/></clipPath></defs>`;
  let body = `<path d="${path}" fill="${base}"/>`; // base layer, then colored zones painted on top

  if (hc.threshold_high != null) {
    const yH = toY(hc.threshold_high);
    // rect from the top (y=0) down to the threshold line = the "above threshold_high" zone
    if (yH > 0) {
      body += `<rect x="0" y="0" width="${W}" height="${yH.toFixed(1)}" fill="${colorHigh}" clip-path="url(#sg-cp)"/>`;
    }
    // dashed guide line at the threshold; skipped if it's flush with the top/bottom edge
    if (yH > 0 && yH < H) {
      body += `<line x1="0" y1="${yH.toFixed(1)}" x2="${W}" y2="${yH.toFixed(1)}" stroke="${colorHigh}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`;
    }
  }

  if (hc.threshold_low != null) {
    const yL = toY(hc.threshold_low);
    // rect from the threshold line down to the bottom (y=H) = the "below threshold_low" zone
    if (yL < H) {
      body += `<rect x="0" y="${yL.toFixed(1)}" width="${W}" height="${(H - yL).toFixed(1)}" fill="${colorLow}" clip-path="url(#sg-cp)"/>`;
    }
    if (yL > 0 && yL < H) {
      body += `<line x1="0" y1="${yL.toFixed(1)}" x2="${W}" y2="${yL.toFixed(1)}" stroke="${colorLow}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`;
    }
  }

  return _wrap(W, H, defs + body + dot) + hits;
}

/** Wraps raw SVG body markup into the `bg-chart` element the card's CSS positions as a background layer. */
function _wrap(w, h, content) {
  return `<svg class="bg-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${content}</svg>`;
}
