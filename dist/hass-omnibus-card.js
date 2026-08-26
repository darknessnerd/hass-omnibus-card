(function(){"use strict";const ee="hass-omnibus-card",fe="1.23.0",H=new Set(["on","open","playing","home","unlocked"]),be={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},te={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high"},me="mdi:weather-windy-variant",ae={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"},ye={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"};function ie(t,e){const{entities:a={},devices:r={},states:i={}}=t;return Object.keys(i).reduce((n,l)=>{var h;const o=a[l];if(!o||o.hidden_by)return n;const s=o.area_id===e,u=o.device_id&&((h=r[o.device_id])==null?void 0:h.area_id)===e;return(s||u)&&n.push({entityId:l,state:i[l],deviceId:o.device_id??null}),n},[])}function ve(t,e,a){var l,o,s,u;if((l=e.entities)!=null&&l.length)return e.entities.map(h=>{var p,f,v;const c=(p=a.states)==null?void 0:p[h];return c?{entityId:h,state:c,deviceId:((v=(f=a.entities)==null?void 0:f[h])==null?void 0:v.device_id)??null}:null}).filter(Boolean);const r=new Set(e.exclude_entities??[]),i=e.add_entities??[],n=t.filter(h=>!r.has(h.entityId));for(const h of i){if(n.some(p=>p.entityId===h))continue;const c=(o=a.states)==null?void 0:o[h];c&&n.push({entityId:h,state:c,deviceId:((u=(s=a.entities)==null?void 0:s[h])==null?void 0:u.device_id)??null})}return n}const re=new Set(["sensor","binary_sensor","image"]),xe=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),ne={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},$e=new RegExp(`ptz.*_(${Object.keys(ne).join("|")})$`,"i");function we(t){var r;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],settings:[],ptz:[],updates:[],others:[],diagnostics:[]};for(const i of t){const{entityId:n,state:l}=i,o=n.split(".")[0],s=((r=l.attributes)==null?void 0:r.device_class)??"",u=l.state;if(o==="light")e.lights.push(i);else if(o==="climate")e.climate.push(i);else if(o==="camera")e.cameras.push(i);else if(o==="update"&&u!=="unavailable")e.updates.push(i);else if(o==="sensor"&&s==="temperature")e.temperatures.push(i);else if(o==="sensor"&&s==="humidity")e.humidities.push(i);else if(o==="sensor"&&xe.has(s))e.weathers.push(i);else if(o==="binary_sensor"&&s==="motion")e.motions.push(i);else if(o==="binary_sensor"&&s==="occupancy")e.occupancy.push(i);else if(o==="binary_sensor"&&s==="smoke")e.smokes.push(i);else if(o==="binary_sensor"&&s==="gas")e.gases.push(i);else if(o==="binary_sensor"&&s==="moisture")e.moistures.push(i);else if(o==="sensor"&&s==="battery"&&u!=="unavailable")e.batteries.push(i),e.others.push(i);else if(u==="unavailable"||o==="binary_sensor"&&["problem","tamper","safety"].includes(s)&&u==="on")e.problems.push(i);else if(o==="siren")e.controls.push(i);else if(o==="button"){const h=n.match($e);h?e.ptz.push({...i,direction:ne[h[1].toLowerCase()]}):e.controls.push(i)}else e.others.push(i)}const a=new Set(e.cameras.map(i=>i.deviceId).filter(Boolean));if(a.size){const i=[],n=[];for(const l of e.others){const o=l.entityId.split(".")[0],s=l.deviceId&&a.has(l.deviceId);s&&!re.has(o)?e.settings.push(l):s&&re.has(o)?n.push(l):i.push(l)}n.length>1?e.diagnostics.push(...n):i.push(...n),e.others=i}return e}const oe=`
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

  /* Invisible hover hit-targets for sparkline dots — must sit ABOVE
     .card-content (z-index 1), otherwise it swallows the hover before it
     reaches the (visually lower, z-index 0) sparkline dots underneath. */
  .chart-hit-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
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

  /* Tap-to-show value pill for touch devices (bindChartTooltip in renderer.js)
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
     renderer.js), so it stays round regardless of how the chart is stretched. */
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

  /* ── Group sections (Weather / Diagnostics / Settings) ──
     A small visible caption + a color identity per pill type, so the card
     stops reading as one repeated grey-capsule component wearing three
     different tooltips. Controls keeps its own pre-existing label/toggle;
     Diagnostics stays neutral on purpose — it's the "least important,
     read-only" bucket, and staying quiet is itself part of the hierarchy. */
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

  /* Diagnostics/Settings collapse independently of each other and of Controls —
     same clickable-caption + chevron language as .controls-label. */
  .group-label.clickable {
    cursor: pointer;
  }

  .group-toggle {
    --mdc-icon-size: 13px;
    opacity: 0.8;
  }

  .group-label.clickable:hover .group-toggle {
    opacity: 1;
  }

  .group-section.collapsed .group-pill {
    display: none;
  }

  .group-label-weather     { color: var(--primary-color, #03a9f4); }
  .group-label-diagnostics { color: var(--secondary-text-color, #888); }
  .group-label-settings    { color: #546e7a; }

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
`;function se(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,r)=>a+r,0)/e.length:null}function N(t){return t.some(e=>e.state.state==="on")}function _e(t){return t.filter(e=>e.state.state==="on")}function ke(t){let e=null;for(const a of t){const r=parseFloat(a.state.state);isNaN(r)||(!e||r<e.value)&&(e={value:r,entityId:a.entityId,state:a.state})}return e}function Se(t){var e;for(const a of t){const r=(e=a.state.attributes)==null?void 0:e.rgb_color;if(r)return`rgb(${r.join(",")})`}return null}const Ce=/_(max|gust|peak)$/i;function B(t,e){var r;return(((r=e.attributes)==null?void 0:r.friendly_name)??t.split(".")[1]).split(" ").pop()}function W(t){const e=new Map;for(const r of t)e.set(r.label,(e.get(r.label)??0)+1);if(![...e.values()].some(r=>r>1))return t;const a=r=>r.fullName.trim().split(/\s+/);return t.map(r=>{if(e.get(r.label)===1)return r;const i=a(r);for(let n=2;n<=i.length;n++){const l=i.slice(-n).join(" ");if(!t.some(s=>s!==r&&a(s).slice(-n).join(" ")===l))return{...r,label:l}}return{...r,label:r.entityId.split(".")[1]}})}function L(t,e){var l,o;if((l=e.attributes)!=null&&l.icon)return e.attributes.icon;const a=t.split(".")[0],r=((o=e.attributes)==null?void 0:o.device_class)??"",i=H.has(e.state),n=s=>typeof s=="string"?s:i?s.on:s.off;return a==="sensor"&&r==="battery"?le(parseFloat(e.state)):r==="wind_speed"&&Ce.test(t)?me:r&&te[r]?n(te[r]):ae[a]?n(ae[a]):"mdi:help-circle-outline"}function le(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function C(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function Ee(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function ce(t,e,a){const r=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,i=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:r,max:i,range:i-r}}function Ae(t,e=150){if(t.length<=e)return t.slice();const a=Math.floor(e/2),r=t.length/a,i=[];for(let n=0;n<a;n++){const l=Math.floor(n*r),o=n===a-1?t.length:Math.floor((n+1)*r);if(l>=o)continue;let s=-1,u=-1;for(let h=l;h<o;h++)Number.isFinite(t[h].v)&&((s===-1||t[h].v<t[s].v)&&(s=h),(u===-1||t[h].v>t[u].v)&&(u=h));if(s===-1)i.push(t[l]);else if(s===u)i.push(t[s]);else{const[h,c]=s<u?[s,u]:[u,s];i.push(t[h],t[c])}}return i}const ze=40,J=14,U=new WeakMap;function Me(t,e,a=null,r=""){if(!(t!=null&&t.length)||t.length<2)return"";const i=U.get(t);if(i&&i.color===e&&i.hc===a&&i.unit===r)return i.result;const n=300,l=60,o=t.map(b=>b.v),s=Math.min(...o),u=Math.max(...o),{min:h,range:c}=ce(a,s,u);if(c===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return U.set(t,{color:e,hc:a,unit:r,result:""}),"";const p=c||1,f=Ae(t),v=t[0].t,_=t[t.length-1].t-v||1,S=f.map(b=>(b.t-v)/_*n),m=f.map(b=>l-(b.v-h)/p*l),x=`${S.map((b,d)=>`${d?"L":"M"}${b.toFixed(1)},${m[d].toFixed(1)}`).join(" ")} V${l} H0 Z`,y=f.length>ze,V=y?"":S.map((b,d)=>`<circle cx="${b.toFixed(1)}" cy="${m[d].toFixed(1)}" r="1.5" fill="${e}"/>`).join(""),A=n/(S.length-1),Z=Math.min(4,A/2).toFixed(1),K=S.map((b,d)=>{if(!Number.isFinite(f[d].v))return"";const g=`${f[d].v.toFixed(1)}${r}`;return`<circle cx="${b.toFixed(1)}" cy="${m[d].toFixed(1)}" r="${Z}" fill="transparent" data-v="${g}"/>`}).join(""),O=`<svg class="chart-hit-layer${y?" dense":""}" viewBox="0 0 ${n} ${l}" preserveAspectRatio="none" aria-hidden="true">${K}</svg>`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null))){const b=de(n,l,`<path d="${x}" fill="${e}"/>${V}`)+O;return U.set(t,{color:e,hc:a,unit:r,result:b}),b}const X=a.color??"rgba(3, 169, 244, 0.12)",F=a.color_high??"rgba(244, 67, 54, 0.25)",j=a.color_low??"rgba(33, 150, 243, 0.25)",P=b=>Math.max(0,Math.min(l,l-(b-h)/p*l)),D=l*(J/100),I=b=>Math.min(l-D,Math.max(D,b)),R=`<defs><clipPath id="sg-cp"><path d="${x}"/></clipPath></defs>`;let z=`<path d="${x}" fill="${X}"/>`;if(a.threshold_high!=null){const b=P(a.threshold_high);if(b>0&&(z+=`<rect x="0" y="0" width="${n}" height="${b.toFixed(1)}" fill="${F}" clip-path="url(#sg-cp)"/>`),b>0&&b<l){const d=I(b).toFixed(1);z+=`<line x1="0" y1="${d}" x2="${n}" y2="${d}" stroke="${F}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}if(a.threshold_low!=null){const b=P(a.threshold_low);if(b<l&&(z+=`<rect x="0" y="${b.toFixed(1)}" width="${n}" height="${(l-b).toFixed(1)}" fill="${j}" clip-path="url(#sg-cp)"/>`),b>0&&b<l){const d=I(b).toFixed(1);z+=`<line x1="0" y1="${d}" x2="${n}" y2="${d}" stroke="${j}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}const q=de(n,l,R+z+V)+O;return U.set(t,{color:e,hc:a,unit:r,result:q}),q}function de(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function Le(t,e,a=null,r={}){var Z,K,O,Q,X,F,j,P,D,I,R,z,q,b;const i=e.area,n=(Z=t.areas)==null?void 0:Z[i];if(!n&&!e.name&&!((K=e.entities)!=null&&K.length))return{error:i??"(no area)"};const l=(O=e.entities)!=null&&O.length?[]:ie(t,i),o=ve(l,e,t),s=we(o),u=_e(s.lights),h=Se(u),c=se(s.temperatures),p=se(s.humidities),f=s.climate[0]??null,[v,E]=be[(Q=f==null?void 0:f.state)==null?void 0:Q.state]??[null,null],_=e.mold_threshold??70,S=e.navigate_to||((X=e.tap_action)==null?void 0:X.navigation_path)||null,m=e.history_chart??null,pe=e.battery_low_threshold??20,x=ke(s.batteries),y=s.cameras[0]??null,V=s.cameras.slice(1),A=s.updates.filter(d=>d.state.state==="on");return{areaName:e.name||(n==null?void 0:n.name)||i||"",cardIcon:e.icon||(n==null?void 0:n.icon)||"mdi:home",navPath:S,hasLights:s.lights.length>0,lightCount:u.length,offlineLights:s.lights.filter(d=>d.state.state==="unavailable").length,lightColor:h,occupied:N(s.motions)||N(s.occupancy),hasOccupancySensors:s.motions.length>0||s.occupancy.length>0,problemCount:s.problems.length,showBatteryBadge:x!=null&&x.value<=pe,batteryValue:(x==null?void 0:x.value)??null,batteryIcon:x?le(x.value):null,batteryEntity:(x==null?void 0:x.entityId)??null,batteryTitle:x?`${s.batteries.length>1?`Lowest of ${s.batteries.length} — `:""}${((F=x.state.attributes)==null?void 0:F.friendly_name)??x.entityId}: ${x.value}%`:"",tempVal:c,humVal:p,tempUnit:((P=(j=s.temperatures[0])==null?void 0:j.state.attributes)==null?void 0:P.unit_of_measurement)??"°C",tempEntities:s.temperatures,humEntities:s.humidities,climate:f,climIcon:v,climColor:E,smokeOn:N(s.smokes),gasOn:N(s.gases),waterOn:N(s.moistures),moldRisk:p!==null&&p>=_,updateCount:A.length,updateEntity:((D=A[0])==null?void 0:D.entityId)??null,updateTitle:A.length?`${A.length} update${A.length!==1?"s":""} available: ${A.map(d=>{var g;return((g=d.state.attributes)==null?void 0:g.friendly_name)??d.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!y,cameraEntity:(y==null?void 0:y.entityId)??null,cameraImage:((I=y==null?void 0:y.state.attributes)==null?void 0:I.entity_picture)??null,cameraIcon:y?L(y.entityId,y.state):null,cameraTitle:((R=y==null?void 0:y.state.attributes)==null?void 0:R.friendly_name)??(y==null?void 0:y.entityId)??"",cameraState:(y==null?void 0:y.state.state)??"",cameraOffline:(y==null?void 0:y.state.state)==="unavailable",controlItems:e.show_entities!==!1?W(s.controls.map(({entityId:d,state:g})=>{var $,w,k;return{entityId:d,domain:d.split(".")[0],isActive:H.has(g.state),icon:L(d,g),label:(($=e.entity_labels)==null?void 0:$[d])??B(d,g),fullName:((w=g.attributes)==null?void 0:w.friendly_name)??d,title:`${((k=g.attributes)==null?void 0:k.friendly_name)??d} — ${g.state}`}})):[],settingsItems:e.show_entities!==!1?W(s.settings.map(({entityId:d,state:g})=>{var $,w,k;return{entityId:d,domain:d.split(".")[0],isActive:H.has(g.state),icon:L(d,g),label:(($=e.entity_labels)==null?void 0:$[d])??B(d,g),fullName:((w=g.attributes)==null?void 0:w.friendly_name)??d,title:`${((k=g.attributes)==null?void 0:k.friendly_name)??d} — ${g.state}`}})):[],collapsibleControls:e.collapsible_controls!==!1,controlsCollapsed:e.collapsible_controls!==!1&&!!r.controls,settingsCollapsed:e.collapsible_controls!==!1&&!!r.settings,diagnosticsCollapsed:e.collapsible_controls!==!1&&!!r.diagnostics,ptzItems:e.show_entities!==!1?s.ptz.map(({entityId:d,state:g,direction:$})=>{var w;return{entityId:d,direction:$,icon:ye[$],title:((w=g.attributes)==null?void 0:w.friendly_name)??d}}):[],weatherItems:e.show_entities!==!1?s.weathers.map(({entityId:d,state:g})=>{var he,ue,ge;const $=parseFloat(g.state),w=((he=g.attributes)==null?void 0:he.unit_of_measurement)??"",k=((ue=g.attributes)==null?void 0:ue.device_class)??"";return{entityId:d,dc:k,icon:L(d,g),value:isNaN($)?g.state:$.toFixed(1),unit:w,title:`${((ge=g.attributes)==null?void 0:ge.friendly_name)??d} — ${g.state}${w}`}}):[],diagnosticsItems:e.show_entities!==!1?W(s.diagnostics.map(({entityId:d,state:g})=>{var $,w,k;return{entityId:d,icon:L(d,g),label:(($=e.entity_labels)==null?void 0:$[d])??B(d,g),fullName:((w=g.attributes)==null?void 0:w.friendly_name)??d,title:`${((k=g.attributes)==null?void 0:k.friendly_name)??d} — ${g.state}`}})):[],historyPoints:m!=null&&m.entity_id?a:null,historyColor:(m==null?void 0:m.color)??"rgba(3, 169, 244, 0.2)",historyChart:m,historyMin:m!=null&&m.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a.map(d=>d.v)):null,historyMax:m!=null&&m.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a.map(d=>d.v)):null,historyUnit:((b=(q=(z=t.states)==null?void 0:z[m==null?void 0:m.entity_id])==null?void 0:q.attributes)==null?void 0:b.unit_of_measurement)??"",historyHours:(m==null?void 0:m.hours)??24,historyEmpty:!!(m!=null&&m.entity_id)&&Array.isArray(a)&&a.length<2,chipItems:e.show_entities!==!1?W([...s.others,...V].slice(0,e.max_entities??12).map(({entityId:d,state:g})=>{var $,w,k;return{entityId:d,isActive:H.has(g.state),icon:L(d,g),label:(($=e.entity_labels)==null?void 0:$[d])??B(d,g),fullName:((w=g.attributes)==null?void 0:w.friendly_name)??d,title:`${((k=g.attributes)==null?void 0:k.friendly_name)??d} — ${g.state}`}})):[]}}function Te({areaName:t,cardIcon:e,hasLights:a,lightCount:r,offlineLights:i,occupied:n,hasOccupancySensors:l,problemCount:o,showBatteryBadge:s,batteryValue:u,batteryIcon:h,batteryEntity:c,batteryTitle:p,updateCount:f,updateEntity:v,updateTitle:E}){const _=r===0,S=_?i>0?`${i} light${i!==1?"s":""} offline`:"Lights off":`${r} light${r!==1?"s":""} on${i>0?` · ${i} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${_?"off":""} ${i>0?"has-offline":""}"
               role="button" tabindex="0" aria-label="${S}" title="${S}">
            <ha-icon icon="mdi:lightbulb${_?"-off":""}"></ha-icon>
            ${r>1?`<span>${r}</span>`:""}
          </div>`:""}
        ${l?`<div class="occupancy-dot ${n?"":"idle"}" title="${n?"Occupied":"Not occupied"}"></div>`:""}
        ${Ne({showBatteryBadge:s,batteryValue:u,batteryIcon:h,batteryEntity:c,batteryTitle:p,problemCount:o,updateCount:f,updateEntity:v,updateTitle:E})}
      </div>
    </div>`}function Ne({showBatteryBadge:t,batteryValue:e,batteryIcon:a,batteryEntity:r,batteryTitle:i,problemCount:n,updateCount:l,updateEntity:o,updateTitle:s}){const u=[];return t&&u.push(`
    <span class="group-seg status-seg-battery" data-entity="${r}" role="button" tabindex="0" aria-label="${i}" title="${i}">
      <ha-icon icon="${a}"></ha-icon><span>${e}%</span>
    </span>`),n>0&&u.push(`
    <span class="group-seg status-seg-problem" title="${n} problem${n!==1?"s":""}">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>${n>1?`<span>${n}</span>`:""}
    </span>`),l>0&&u.push(`
    <span class="group-seg status-seg-update" data-entity="${o}" role="button" tabindex="0" aria-label="${s}" title="${s}">
      <ha-icon icon="mdi:package-up"></ha-icon>${l>1?`<span>${l}</span>`:""}
    </span>`),u.length?`<div class="chip group-chip status-cluster" title="Alerts">${u.join("")}</div>`:""}function Oe({tempVal:t,humVal:e,tempUnit:a,tempEntities:r,humEntities:i,climate:n,climIcon:l,climColor:o}){var c,p,f,v,E,_,S,m;if(t===null&&e===null&&!l)return"";const s=r.length>1?`Avg of ${r.length} sensors`:((p=(c=r[0])==null?void 0:c.state.attributes)==null?void 0:p.friendly_name)??"",u=i.length>1?`Avg of ${i.length} sensors`:((v=(f=i[0])==null?void 0:f.state.attributes)==null?void 0:v.friendly_name)??"",h=((E=n==null?void 0:n.state.attributes)==null?void 0:E.friendly_name)??(n==null?void 0:n.entityId)??"";return`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((_=r[0])==null?void 0:_.entityId)??""}"
             role="button" tabindex="0" aria-label="${s}" title="${s}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((S=i[0])==null?void 0:S.entityId)??""}"
             role="button" tabindex="0" aria-label="${u}" title="${u}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${l?`
        <div class="env-chip climate"
             style="--climate-color: ${o}"
             data-entity="${n.entityId}"
             role="button" tabindex="0" aria-label="${h}" title="${h}">
          <ha-icon icon="${l}"></ha-icon>
          <span>${((m=n.state.attributes)==null?void 0:m.current_temperature)!=null?`${n.state.attributes.current_temperature}°`:n.state.state}</span>
        </div>`:""}
    </div>`}function G(t,e,a,{sectionKey:r,collapsible:i,collapsed:n}={}){return a?i?`
    <div class="group-section${n?" collapsed":""}">
      <span class="group-label ${e} clickable" data-section="${r}"
        role="button" tabindex="0" title="${n?"Expand":"Collapse"} ${t.toLowerCase()}">
        ${t}<ha-icon class="group-toggle" icon="mdi:chevron-${n?"down":"up"}"></ha-icon>
      </span>
      <div class="group-pill">${a}</div>
    </div>`:`<div class="group-section"><span class="group-label ${e}">${t}</span>${a}</div>`:""}function Fe({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip">
      ${t.map(({entityId:e,dc:a,icon:r,value:i,unit:n,title:l})=>`
        <span class="group-seg weather-seg" data-entity="${e}" data-dc="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="group-seg-value">${i}${n?" "+n:""}</span>
        </span>`).join("")}
    </div>`:""}function je({chipItems:t}){return`${t.length?`
      <div class="entity-chips">
        ${t.map(({entityId:e,isActive:a,icon:r,label:i,title:n})=>`
          <div class="chip${a?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${n}" title="${n}">
            <ha-icon icon="${r}"></ha-icon>
            <span class="chip-label">${i}</span>
          </div>`).join("")}
      </div>`:""}`}function Pe({diagnosticsItems:t}){return t.length?`
    <div class="chip group-chip diagnostics-chip">
      ${t.map(({entityId:e,icon:a,label:r,title:i})=>`
        <span class="group-seg diagnostics-seg" data-entity="${e}" role="button" tabindex="0" aria-label="${i}" title="${i}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="seg-label">${r}</span>
        </span>`).join("")}
    </div>`:""}function De({chipItems:t,weatherItems:e,diagnosticsItems:a,collapsibleControls:r,diagnosticsCollapsed:i}){const n=G("","",je({chipItems:t})),l=G("Weather","group-label-weather",Fe({weatherItems:e})),o=G("Diagnostics","group-label-diagnostics",Pe({diagnosticsItems:a}),{sectionKey:"diagnostics",collapsible:r,collapsed:i});return!t.length&&!l&&!o?"":`${n}
    ${l}
    ${o}
    `}function Ie({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:r,cameraTitle:i,cameraState:n,cameraOffline:l}){if(!t)return"";const o=l?`${i} (offline)`:i;return`
    <div class="camera-preview${l?" offline":""}" data-entity="${r}"
         role="button" tabindex="0" aria-label="${o}" title="${o}">
      ${e?`<img src="${e}" alt="${o}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${n==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
      ${e?`
        <span class="camera-refresh-btn" role="button" tabindex="0" aria-label="Refresh snapshot" title="Refresh snapshot">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </span>`:""}
    </div>`}function qe({ptzItems:t}){return t.length?`
    <div class="chip group-chip ptz-chip">
      ${t.map(({entityId:e,direction:a,icon:r,title:i})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" role="button" tabindex="0" aria-label="${i}" title="${i}">
          <ha-icon icon="${r}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function He({controlItems:t}){return t.length?`
    <div class="chip group-chip controls-chip">
      ${t.map(({entityId:e,domain:a,isActive:r,icon:i,label:n,title:l})=>`
        <span class="group-seg control-seg${r?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}function Be({settingsItems:t}){return t.length?`
    <div class="chip group-chip settings-chip">
      ${t.map(({entityId:e,domain:a,isActive:r,icon:i,label:n,title:l})=>`
        <span class="group-seg settings-seg${r?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}function We({controlItems:t,settingsItems:e,ptzItems:a,collapsibleControls:r,controlsCollapsed:i,settingsCollapsed:n}){if(!t.length&&!e.length&&!a.length)return"";const l=qe({ptzItems:a})+He({controlItems:t});return`
    ${l?`
      <div class="controls-row${i?" collapsed":""}">
        <span class="controls-label${r?" clickable":""}"
          data-section="controls"
          ${r?`role="button" tabindex="0" title="${i?"Expand":"Collapse"} controls"`:""}
          >Controls${r?`<ha-icon class="controls-toggle" icon="mdi:chevron-${i?"down":"up"}"></ha-icon>`:""}</span>
        <div class="controls-chips">${l}</div>
      </div>`:""}
    ${G("Settings","group-label-settings",Be({settingsItems:e}),{sectionKey:"settings",collapsible:r,collapsed:n})}`}function Ue({smokeOn:t,gasOn:e,waterOn:a,moldRisk:r}){return!t&&!e&&!a&&!r?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${r?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function Ge(t){return`
    <style>${oe}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function Ye({historyMin:t,historyMax:e,historyUnit:a,historyHours:r,historyChart:i,historyEmpty:n}){if(t===null)return n?'<div class="chart-overlay"><span class="chart-stat chart-empty">No numeric history</span></div>':"";const l=[];if((i==null?void 0:i.threshold_high)!=null||(i==null?void 0:i.threshold_low)!=null){const{min:o,range:s}=ce(i,t,e),u=s||1,h=p=>(1-(p-o)/u)*100,c=p=>Math.min(100-J,Math.max(J,p));if(i.threshold_high!=null){const p=h(i.threshold_high);p>0&&p<100&&l.push(`<span class="chart-threshold" style="top:${c(p).toFixed(1)}%">${i.threshold_high.toFixed(1)}${a}</span>`)}if(i.threshold_low!=null){const p=h(i.threshold_low);p>0&&p<100&&l.push(`<span class="chart-threshold" style="top:${c(p).toFixed(1)}%">${i.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period" title="Tracking ${i.entity_id} — may differ from the averaged value shown above">${r}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${l.join("")}
    </div>`}function Ve(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",r=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${oe}</style>
    <ha-card
      ${r?`class="${r}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?Me(t.historyPoints,t.historyColor,t.historyChart,t.historyUnit):""}
      ${Ye(t)}
      <div class="card-content">
        ${Ie(t)}
        ${Te(t)}
        ${Oe(t)}
        ${De(t)}
        ${We(t)}
        ${Ue(t)}
      </div>
    </ha-card>`}function Ze(t,e,a){var i,n;const r=(i=t.activeElement)==null?void 0:i.className;t.innerHTML=a.error?Ge(a.error):Ve(a),a.error||Ke(t,e,a),r&&((n=t.querySelector(`.${r.split(" ").join(".")}`))==null||n.focus())}function Ke(t,e,{navPath:a,chipItems:r}){var u,h;a&&t.querySelector("ha-card").addEventListener("click",c=>{!c.target.closest(".chip")&&!c.target.closest(".env-chip")&&!c.target.closest(".badge-lights")&&!c.target.closest(".status-seg-battery")&&!c.target.closest(".status-seg-update")&&!c.target.closest(".camera-preview")&&!c.target.closest(".controls-label.clickable")&&!c.target.closest(".group-label.clickable")&&Ee(a)}),t.querySelectorAll('[role="button"][tabindex]').forEach(c=>{c.addEventListener("keydown",p=>{p.key!=="Enter"&&p.key!==" "||(p.preventDefault(),p.stopPropagation(),c.click())})}),t.querySelectorAll(".controls-label.clickable[data-section], .group-label.clickable[data-section]").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation(),e.toggleSectionCollapsed(c.dataset.section)})}),t.querySelectorAll(".ptz-seg[data-entity]").forEach(c=>{c.addEventListener("click",p=>{var f;p.stopPropagation(),(f=e._hass)!=null&&f.callService?e._hass.callService("button","press",{},{entity_id:c.dataset.entity}):C(e,c.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation(),C(e,c.dataset.entity)})}),t.querySelectorAll(".diagnostics-seg[data-entity]").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation(),C(e,c.dataset.entity)})});const i=t.querySelector(".status-seg-update[data-entity]");i&&i.addEventListener("click",c=>{c.stopPropagation(),C(e,i.dataset.entity)});const n=t.querySelector(".camera-preview[data-entity]");n&&n.addEventListener("click",c=>{c.stopPropagation(),C(e,n.dataset.entity)});const l=t.querySelector(".camera-refresh-btn");l&&l.addEventListener("click",c=>{c.stopPropagation();const p=t.querySelector(".camera-preview img");if(!p)return;const f=new URL(p.getAttribute("src"),window.location.href);f.searchParams.set("_refresh",Date.now()),p.src=f.pathname+f.search}),t.querySelectorAll(".control-seg[data-entity]").forEach(c=>{c.addEventListener("click",p=>{var E,_;p.stopPropagation();const f=c.dataset.entity,v=c.dataset.domain;v==="button"&&((E=e._hass)!=null&&E.callService)?e._hass.callService("button","press",{},{entity_id:f}):v==="siren"&&((_=e._hass)!=null&&_.callService)?e._hass.callService("siren","toggle",{},{entity_id:f}):C(e,f)})}),t.querySelectorAll(".settings-seg[data-entity]").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation(),C(e,c.dataset.entity)})});const o=t.querySelector(".badge-lights");o&&((u=e._config)!=null&&u.area)&&((h=e._hass)!=null&&h.callService)&&o.addEventListener("click",c=>{c.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const s=t.querySelector(".status-seg-battery[data-entity]");s&&s.addEventListener("click",c=>{c.stopPropagation(),C(e,s.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(c=>{const p=c.dataset.entity;p&&c.addEventListener("click",f=>{f.stopPropagation(),C(e,p)})}),t.querySelectorAll(".chip[data-entity]").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation(),C(e,c.dataset.entity)})}),Xe(t)}function Xe(t){const e=t.querySelectorAll(".chart-hit-layer circle[data-v]");if(!e.length)return;const a=t.querySelector("ha-card");let r=null,i=null;const n=(l,o)=>{l.style.left=`${parseFloat(o.getAttribute("cx"))/300*100}%`,l.style.top=`${parseFloat(o.getAttribute("cy"))/60*100}%`};e.forEach(l=>{var s;const o=(s=l.closest(".chart-hit-layer"))==null?void 0:s.classList.contains("dense");l.addEventListener("pointerenter",u=>{u.stopPropagation(),r||(r=document.createElement("div"),r.className="chart-tooltip",a.appendChild(r)),r.textContent=l.dataset.v,n(r,l),r.style.display="block",o&&(i||(i=document.createElement("div"),i.className="chart-hover-dot",a.appendChild(i)),n(i,l),i.style.display="block")}),l.addEventListener("pointerleave",u=>{u.stopPropagation(),r&&(r.style.display="none"),i&&(i.style.display="none")})})}const M=new Map,Y=new Set,T=new Map,Re=2;function Je(t){for(const e of M.keys()){const a=Number(e.slice(e.lastIndexOf(":")+1));t-a>Re&&M.delete(e)}}function Qe(t,e,a,r,i){var u;const n=(u=i==null?void 0:i._config)==null?void 0:u.debug,l=Math.floor(Date.now()/3e5),o=`${e}:${a}:${l}`;if(Je(l),M.has(o))return n&&console.debug("[hass-omnibus-card] history cache hit",{key:o,points:M.get(o).length}),M.get(o);if(Y.has(o))return n&&console.debug("[hass-omnibus-card] history fetch pending, queuing callback",{key:o}),T.get(o).set(i,r),null;if(!(t!=null&&t.callWS))return n&&console.debug("[hass-omnibus-card] history skipped — no callWS",{entityId:e}),null;n&&console.debug("[hass-omnibus-card] history fetch start",{key:o,entityId:e,hours:a}),Y.add(o),T.set(o,new Map([[i,r]]));const s=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:s,minimal_response:!0,no_attributes:!0}).then(h=>{const c=Array.isArray(h==null?void 0:h[e])?h[e]:[],p=c.map(v=>({t:(v.lu??v.last_updated??0)*1e3,v:parseFloat(v.s??v.state)})).filter(v=>!isNaN(v.v));n&&console.debug("[hass-omnibus-card] history fetch done",{key:o,rawCount:c.length,pointCount:p.length}),M.set(o,p),Y.delete(o);const f=T.get(o);T.delete(o),f==null||f.forEach(v=>v(p))}).catch(h=>{n&&console.debug("[hass-omnibus-card] history fetch error",{key:o,error:h}),M.set(o,[]),Y.delete(o);const c=T.get(o);T.delete(o),c==null||c.forEach(p=>p([]))}),null}class et extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._collapsed=null}setConfig(e){var r;if(!(e!=null&&e.area)&&!((r=e==null?void 0:e.entities)!=null&&r.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null;const a=e.controls_collapsed!==!1;this._collapsed={controls:a,settings:a,diagnostics:a},this._hass&&this._update()}toggleSectionCollapsed(e){this._collapsed[e]=!this._collapsed[e],this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var r,i,n,l;if(!this._hass||!this._config)return"";let e;if((r=this._config.entities)!=null&&r.length)e=this._config.entities.map(o=>{var s;return{entityId:o,state:(s=this._hass.states)==null?void 0:s[o]}}).filter(o=>o.state);else{e=ie(this._hass,this._config.area);for(const o of this._config.add_entities??[])if(!e.some(s=>s.entityId===o)){const s=(i=this._hass.states)==null?void 0:i[o];s&&e.push({entityId:o,state:s})}}const a=(n=this._config.history_chart)==null?void 0:n.entity_id;if(a&&!e.some(o=>o.entityId===a)){const o=(l=this._hass.states)==null?void 0:l[a];o&&e.push({entityId:a,state:o})}return e.map(({entityId:o,state:s})=>{var u,h,c;return`${o}=${s.state}|${((u=s.attributes)==null?void 0:u.rgb_color)??""}|${((h=s.attributes)==null?void 0:h.current_temperature)??""}|${((c=s.attributes)==null?void 0:c.entity_picture)??""}`}).sort().join(";")}_update(){var i,n;let e=null;const a=(i=this._config)==null?void 0:i.history_chart;a!=null&&a.entity_id&&(e=Qe(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const r=Le(this._hass,this._config,e,this._collapsed);(n=this._config)!=null&&n.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:r}),Ze(this.shadowRoot,this,r)}}window.customCards=window.customCards||[],window.customCards.push({type:ee,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${fe} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(ee,et)})();
