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

  @keyframes alarm-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);    }
    50%       { box-shadow: 0 0 0 6px rgba(244, 67, 54, 0.35); }
  }

  /* ── Layout ── */

  .bg-chart {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  .chart-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .chart-stat, .chart-threshold {
    position: absolute;
    font-weight: 600;
    color: var(--secondary-text-color, #888);
    opacity: 0.75;
    background: rgba(0,0,0,0.18);
    border-radius: 3px;
    padding: 1px 4px;
    backdrop-filter: blur(3px);
    line-height: 1;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .chart-stat { font-size: 8px; }

  .stat-max    { top: 5px;    right: 7px; }
  .stat-min    { bottom: 5px; right: 7px; }
  .stat-period { bottom: 5px; left:  7px; }

  .chart-threshold {
    left: 7px;
    font-size: 9px;
    transform: translateY(-50%);
  }

  .card-content {
    position: relative;
    z-index: 1;
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

  .badge-problems {
    background: rgba(244, 67, 54, 0.15);
    color: var(--error-color, #f44336);
  }

  .badge-battery {
    background: rgba(244, 67, 54, 0.15);
    color: var(--error-color, #f44336);
    cursor: pointer;
    transition: background 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .badge-battery:hover {
    background: rgba(244, 67, 54, 0.28);
  }

  .badge-update {
    background: rgba(3, 169, 244, 0.15);
    color: var(--primary-color, #03a9f4);
    cursor: pointer;
    transition: background 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .badge-update:hover {
    background: rgba(3, 169, 244, 0.28);
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

  .env-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.83rem;
    color: var(--secondary-text-color);
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
    max-width: 72px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Group chips (PTZ pad, weather readings) — one pill, many segments ── */

  .group-chip {
    padding: 2px 3px;
    gap: 0;
    cursor: default;
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

  .ptz-chip .group-seg { padding: 3px 5px; }

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

  /* ── Controls row ── */

  .controls-row {
    margin-top: 8px;
  }

  .controls-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
    opacity: 0.6;
    margin-bottom: 4px;
  }

  .controls-label.clickable {
    cursor: pointer;
  }

  .controls-label.clickable:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 2px;
  }

  .controls-toggle {
    --mdc-icon-size: 14px;
    opacity: 0.8;
  }

  .controls-label.clickable:hover .controls-toggle { opacity: 1; }

  .controls-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .controls-row.collapsed .controls-chips {
    display: none;
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
