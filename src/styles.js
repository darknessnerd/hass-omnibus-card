export const CARD_STYLES = `
  :host {
    display: block;
  }

  ha-card {
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.2s ease, transform 0.15s ease;
  }

  ha-card.clickable {
    cursor: pointer;
  }

  ha-card.clickable:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
  }

  ha-card.clickable:active {
    transform: translateY(0);
  }

  ha-card.alarm-active {
    animation: alarm-pulse 2s ease-in-out infinite;
  }

  /* Every interactive element in this card carries role="button" + tabindex —
     one rule gives all of them a visible keyboard-focus ring instead of
     relying on the browser's (often invisible-on-dark-themes) default. */
  [role="button"]:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
    border-radius: 2px;
  }

  @keyframes alarm-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);    }
    50%       { box-shadow: 0 0 0 6px rgba(244, 67, 54, 0.35); }
  }

  /* ── Layout ── */

  /* max-height caps these three to roughly a card's height with no device
     tab open (camera preview + header + env row + chips + tab bar) — an open
     tab's own content isn't part of what the chart is meant to back. Without
     this, growing a tab (see .section-tab-panel — no scroll cap, by design)
     stretches the chart/hit-layer proportionally with it: since top+bottom
     stay pinned (inset: 0) but the container's actual height grows, every
     percentage-positioned hit-target circle drifts further down in real
     pixels, eventually landing on top of unrelated controls below the chart
     (confirmed: it could intercept clicks on a second device tab once a
     first tab's content had pushed the card tall enough). max-height clamps
     the box at that ceiling instead, anchored to the top via inset: 0's own
     top: 0 — content taller than the cap just grows past the chart's
     bottom edge rather than dragging the chart (and its hit-targets) down
     with it. */
  .bg-chart {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-height: none;
    z-index: 0;
    pointer-events: none;
  }

  .chart-overlay {
    position: absolute;
    inset: 0;
    max-height: 22rem;
    pointer-events: none;
    z-index: 0;
  }

  /* Invisible hover hit-targets for sparkline dots — sit BELOW .card-content
     (z-index 2), on purpose: real controls (a device tab, a chip) always win
     a click/hover over an invisible dot that happens to share their screen
     position, rather than the dot silently swallowing it. This used to be
     inverted (hit-layer above card-content, so a dot's hover would register
     even where content visually covered it) — confirmed broken by a real
     case: a dense series' hit-target circle landed exactly on a second
     device tab and ate every click meant for it. The cost is dot-hover only
     works where the chart is visually exposed (gaps between chips/tabs), not
     "through" solid content — a worse hover nicety is a fair trade for
     controls that are reliably clickable everywhere. */
  .chart-hit-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-height: 22rem;
    z-index: 1;
    pointer-events: none;
  }

  /* The layer itself stays pointer-events:none (so it doesn't block clicks
     elsewhere on the card) — only the per-point hit-target dots opt back in. */
  .chart-hit-layer circle {
    pointer-events: auto;
  }

  /* Background is a fixed dark pill on purpose — text color must be fixed
     too (not a theme variable like --secondary-text-color) so contrast holds
     regardless of whether the active HA theme is light or dark; a theme's
     mid-gray secondary-text-color reads fine on its own light background but
     can fail contrast against this always-dark chip. */
  .chart-stat, .chart-threshold, .chart-tooltip {
    position: absolute;
    font-weight: 600;
    color: #fff;
    opacity: 0.95;
    background: rgba(0,0,0,0.5);
    border-radius: 3px;
    padding: 1px 4px;
    backdrop-filter: blur(3px);
    line-height: 1;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .chart-stat { font-size: 8px; }

  .chart-empty {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .stat-max    { top: 5px;    right: 7px; }
  .stat-min    { bottom: 5px; right: 7px; }
  .stat-period { bottom: 5px; left:  7px; }

  .chart-threshold {
    left: 7px;
    font-size: 9px;
    transform: translateY(-50%);
  }

  /* Tap-to-show value pill for touch devices (bindChartTooltip in dom.js)
     — native SVG <title> tooltips never fire on touch, so this is the only
     feedback a tap on a hit-target circle gets. Positioned via left/top %
     set inline from the tapped circle's own viewBox coordinates. */
  .chart-tooltip {
    display: none;
    font-size: 10px;
    z-index: 3;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }

  /* Dense series (.dense, see DOT_MAX_POINTS in sparkline.js) render with no
     permanent per-point dot — avoids scalloping a downsampled curve — so
     hovering the (otherwise invisible) hit-target is the only cue a point
     is there. This used to be painted by giving the hit-target SVG circle
     itself a fill on :hover, but that circle lives inside .bg-chart's
     stretched (preserveAspectRatio="none") viewBox — on a card whose real
     aspect ratio is far from the chart's native 300:60, the circle renders
     as a tall/wide ellipse, not a dot. This is a plain HTML marker instead,
     sized in real pixels and positioned by percentage (bindChartTooltip in
     dom.js), so it stays round regardless of how the chart is stretched. */
  .chart-hover-dot {
    display: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--room-accent-color, var(--primary-color, #03a9f4));
    z-index: 3;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }

  .card-content {
    position: relative;
    z-index: 2;
    padding: 14px 16px 12px;
  }

  /* ── Header ── */

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }

  .room-icon {
    --mdc-icon-size: 22px;
    color: var(--room-accent-color, var(--primary-color, #03a9f4));
    flex-shrink: 0;
  }

  .room-name {
    font-size: 1rem;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  /* ── Header badges ── */

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 7px;
    border-radius: 12px;
    font-size: 0.73rem;
    font-weight: 600;
    line-height: 1.6;
  }

  .badge ha-icon {
    --mdc-icon-size: 13px;
  }

  .badge-lights {
    background: rgba(255, 152, 0, 0.15);
    color: #ff9800;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .badge-lights:hover {
    background: rgba(255, 152, 0, 0.28);
  }

  .badge-lights.off {
    background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
    color: var(--disabled-text-color, #5e5e5e);
  }

  .badge-lights.off:hover {
    background: rgba(255, 152, 0, 0.15);
    color: #ff9800;
  }

  .badge-lights.has-offline::after {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--warning-color, #ff9800);
    margin-left: 3px;
    flex-shrink: 0;
  }

  /* Occupancy dot — always visible when sensors exist */
  .occupancy-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--success-color, #4caf50);
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.7);
    animation: occ-blink 3s ease-in-out infinite;
    flex-shrink: 0;
  }

  .occupancy-dot.idle {
    background: var(--disabled-text-color, #5e5e5e);
    box-shadow: none;
    animation: none;
    opacity: 0.5;
  }

  @keyframes occ-blink {
    0%, 100% { opacity: 1;    }
    50%       { opacity: 0.4; }
  }

  /* ── Environmental row (temp / humidity / climate) ── */

  .env-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }

  /* Temp/humidity/climate are the card's headline stat — sized and weighted
     up from the 0.72-0.83rem band everything else (chip labels, seg labels)
     sits in, so they read as the number that matters, not another chip. */
  .env-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--primary-text-color);
    padding: 3px 8px;
    border-radius: 14px;
    cursor: pointer;
    transition: background 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .env-chip:hover {
    background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
  }

  .env-chip ha-icon  { --mdc-icon-size: 15px; }
  .env-chip.temp ha-icon    { color: #f57c00; }
  .env-chip.hum  ha-icon    { color: #0288d1; }
  .env-chip.climate ha-icon { color: var(--climate-color, var(--primary-color)); }

  /* ── Entity chips ── */

  .entity-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 9px;
    border-radius: 16px;
    font-size: 0.74rem;
    background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
    color: var(--secondary-text-color);
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    border: 1px solid transparent;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .chip:hover {
    background: var(--primary-color, #03a9f4);
    color: white;
  }

  .chip.on {
    background: rgba(3, 169, 244, 0.1);
    color: var(--primary-color, #03a9f4);
    border-color: rgba(3, 169, 244, 0.25);
  }

  .chip ha-icon { --mdc-icon-size: 14px; }

  .chip-label {
    max-width: 4.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Group chips (PTZ pad, weather readings) — one pill, many segments ── */

  .group-chip {
    padding: 2px 3px;
    gap: 0;
    cursor: default;
    /* A device can expose more segments than fit on one line (e.g. a real
       camera device with 9 operable entities) — wrap onto a second row
       inside the pill instead of clipping at the card edge. */
    flex-wrap: wrap;
  }

  .group-chip:hover {
    background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
    color: var(--secondary-text-color);
  }

  .group-seg {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 6px;
    min-height: 24px;
    box-sizing: border-box;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .group-seg:hover {
    background: var(--primary-color, #03a9f4);
    color: white;
  }

  .group-seg ha-icon { --mdc-icon-size: 13px; }

  .group-seg-value { font-size: 0.72rem; }

  /* Active/on state for toggleable segments (controls) — same language as .chip.on,
     just without the border since segments already sit inside one shared pill. */
  .group-seg.on {
    color: var(--primary-color, #03a9f4);
  }

  .ptz-chip .group-seg { padding: 3px 5px; }

  /* Any grouped pill (weather, PTZ, controls): hairline divider between segments
     so a packed pill reads as distinct readings, not one blob. */
  .group-seg:not(:last-child) {
    border-right: 1px solid var(--divider-color, rgba(128, 128, 128, 0.25));
  }

  .seg-label {
    font-size: 0.72rem;
    max-width: 3.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Group sections (Weather, and Controls/Settings/Diagnostics when
     collapsible_controls: false) ── A small visible caption + a color
     identity per pill type, so the card stops reading as one repeated
     grey-capsule component wearing three different tooltips. Diagnostics
     stays neutral on purpose — it's the "least important, read-only" bucket,
     and staying quiet is itself part of the hierarchy. Always-visible; the
     collapsible variant of Controls/Settings/Diagnostics lives in the
     .section-tabs rules below instead. */
  .group-section {
    margin-bottom: 8px;
  }

  .group-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.66rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.7;
    margin-bottom: 4px;
  }

  .group-label-weather { color: var(--primary-color, #03a9f4); }

  /* Sub-caption for a role's pill (PTZ/Controls/Settings/Diagnostics) inside
     one device's tab/stacked group. Once a device bundles multiple role
     pills together, the tab/group label alone ("Cam Cucina") no longer says
     where its settings end and its diagnostics begin — this restores that
     boundary as a text caption rather than a forced color, so diagnostics
     can stay visually neutral (see .group-section above) while still being
     distinguishable from ptz/controls above/below it. Smaller and dimmer
     than .group-label — it's one level deeper, captioning a pill within a
     device, not the device itself. */
  .device-role { margin-bottom: 6px; }
  .device-role:last-child { margin-bottom: 0; }

  .device-role-label {
    display: block;
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.5;
    margin-bottom: 2px;
  }

  .weather-chip  { background: rgba(3, 169, 244, 0.08); }
  .settings-chip { background: rgba(84, 110, 122, 0.14); }

  .weather-seg[data-dc="wind_speed"] ha-icon     { color: #546e7a; }
  .weather-seg[data-dc="precipitation"] ha-icon  { color: #0288d1; }
  .weather-seg[data-dc="illuminance"] ha-icon    { color: #f9a825; }
  .weather-seg[data-dc="sound_pressure"] ha-icon { color: #8e24aa; }

  .group-seg:hover ha-icon { color: white; }

  /* ── Status cluster (battery / problem / update alerts, grouped) ──
     One pill instead of up to three separate badges — each segment keeps
     its own semantic color so battery (critical, red) and problem
     (attention, amber) stay visually distinct rather than reading as the
     same alert twice. Rules placed after the generic .group-seg:hover so
     they win the cascade at equal specificity. */
  .status-seg-battery { color: var(--error-color, #f44336); }
  .status-seg-battery:hover { background: rgba(244, 67, 54, 0.28); color: var(--error-color, #f44336); }
  .status-seg-battery:hover ha-icon { color: var(--error-color, #f44336); }

  .status-seg-problem { color: var(--warning-color, #ff9800); cursor: default; }
  .status-seg-problem:hover { background: transparent; color: var(--warning-color, #ff9800); }
  .status-seg-problem:hover ha-icon { color: var(--warning-color, #ff9800); }

  .status-seg-update { color: var(--primary-color, #03a9f4); }
  .status-seg-update:hover { background: rgba(3, 169, 244, 0.28); color: var(--primary-color, #03a9f4); }
  .status-seg-update:hover ha-icon { color: var(--primary-color, #03a9f4); }

  /* ── Camera preview ── */

  .camera-preview {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
    aspect-ratio: 16 / 9;
    background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
    cursor: pointer;
  }

  .camera-preview.offline {
    opacity: 0.55;
  }

  .camera-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .camera-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--secondary-text-color);
  }

  .camera-placeholder ha-icon { --mdc-icon-size: 32px; }

  .camera-rec-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f44336;
    box-shadow: 0 0 6px rgba(244, 67, 54, 0.8);
    animation: occ-blink 1.5s ease-in-out infinite;
  }

  .camera-refresh-btn {
    position: absolute;
    top: 8px;
    left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    cursor: pointer;
    transition: background 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .camera-refresh-btn:hover {
    background: rgba(0, 0, 0, 0.65);
  }

  .camera-refresh-btn ha-icon { --mdc-icon-size: 14px; }

  /* ── Section tabs (one per device, collapsible_controls default) ── One
     exclusive tab strip instead of one accordion per device: only the
     active tab's pill is ever visible, so switching tabs can never stack
     height on top of an already-open one — at most one panel's worth of
     card-height change. No internal scroll/max-height on purpose: a nested
     scroll region inside a card that's already inside a scrolling dashboard
     is a scroll trap on touch (a swipe meant for the page scrolls the tiny
     box instead), and a hard-clipped edge with no fade/affordance reads as
     "that's everything" rather than "there's more below" — a busy device
     (a real IR blaster can expose 25+ segments) just makes the card taller
     instead of hiding content either way. */
  .section-tabs {
    margin-top: 8px;
  }

  .section-tabs-bar {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 4px;
  }

  /* Device names run longer and more varied than the old fixed "Controls" /
     "Settings" / "Diagnostics" labels, and the tab count is no longer capped
     at 3 — wrap onto a second row (bar above) and ellipsis any single label
     that's still too long for one tab, rather than overflowing the card. */
  .section-tab {
    display: inline-block;
    max-width: 6.5rem;
    padding: 3px 9px;
    border-radius: 12px;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
    opacity: 0.6;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .section-tab:hover { opacity: 0.85; }

  .section-tab.active {
    background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
    opacity: 1;
  }

  .section-tab-panel {
    display: none;
  }

  .section-tab-panel.active {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* ── Alarm bar ── */

  .alarm-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 10px;
    padding-top: 9px;
    border-top: 1px solid rgba(244, 67, 54, 0.25);
  }

  .alarm-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.77rem;
    font-weight: 600;
    animation: alarm-pulse 1.5s ease-in-out infinite;
  }

  .alarm-badge ha-icon { --mdc-icon-size: 14px; }

  .alarm-smoke { background: rgba(244, 67, 54, 0.15); color: #f44336; }
  .alarm-gas   { background: rgba(255, 152, 0, 0.15); color: #ff9800; }
  .alarm-water { background: rgba(33, 150, 243, 0.15); color: #2196f3; }
  .alarm-mold  { background: rgba(76, 175, 80, 0.15);  color: #4caf50; }

  /* ── Error state ── */

  .error-card {
    border: 1px dashed var(--error-color, #f44336) !important;
  }

  .error-content {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    color: var(--error-color, #f44336);
    font-size: 0.85rem;
  }

  .error-content ha-icon {
    --mdc-icon-size: 20px;
    flex-shrink: 0;
  }
`;
