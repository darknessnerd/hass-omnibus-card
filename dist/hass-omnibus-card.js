(function(){"use strict";const ee="hass-omnibus-card",be="1.23.0",H=new Set(["on","open","playing","home","unlocked"]),me={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},te={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high"},ye="mdi:weather-windy-variant",ae={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"},ve={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"};function re(t,e){const{entities:a={},devices:i={},states:r={}}=t;return Object.keys(r).reduce((n,l)=>{var h;const s=a[l];if(!s||s.hidden_by)return n;const o=s.area_id===e,u=s.device_id&&((h=i[s.device_id])==null?void 0:h.area_id)===e;return(o||u)&&n.push({entityId:l,state:r[l],deviceId:s.device_id??null}),n},[])}function xe(t,e,a){var l,s,o,u;if((l=e.entities)!=null&&l.length)return e.entities.map(h=>{var p,b,v;const c=(p=a.states)==null?void 0:p[h];return c?{entityId:h,state:c,deviceId:((v=(b=a.entities)==null?void 0:b[h])==null?void 0:v.device_id)??null}:null}).filter(Boolean);const i=new Set(e.exclude_entities??[]),r=e.add_entities??[],n=t.filter(h=>!i.has(h.entityId));for(const h of r){if(n.some(p=>p.entityId===h))continue;const c=(s=a.states)==null?void 0:s[h];c&&n.push({entityId:h,state:c,deviceId:((u=(o=a.entities)==null?void 0:o[h])==null?void 0:u.device_id)??null})}return n}const ie=new Set(["sensor","binary_sensor","image"]),$e=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),ne={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},_e=new RegExp(`ptz.*_(${Object.keys(ne).join("|")})$`,"i");function we(t){var i;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],settings:[],ptz:[],updates:[],others:[],diagnostics:[]};for(const r of t){const{entityId:n,state:l}=r,s=n.split(".")[0],o=((i=l.attributes)==null?void 0:i.device_class)??"",u=l.state;if(s==="light")e.lights.push(r);else if(s==="climate")e.climate.push(r);else if(s==="camera")e.cameras.push(r);else if(s==="update"&&u!=="unavailable")e.updates.push(r);else if(s==="sensor"&&o==="temperature")e.temperatures.push(r);else if(s==="sensor"&&o==="humidity")e.humidities.push(r);else if(s==="sensor"&&$e.has(o))e.weathers.push(r);else if(s==="binary_sensor"&&o==="motion")e.motions.push(r);else if(s==="binary_sensor"&&o==="occupancy")e.occupancy.push(r);else if(s==="binary_sensor"&&o==="smoke")e.smokes.push(r);else if(s==="binary_sensor"&&o==="gas")e.gases.push(r);else if(s==="binary_sensor"&&o==="moisture")e.moistures.push(r);else if(s==="sensor"&&o==="battery"&&u!=="unavailable")e.batteries.push(r),e.others.push(r);else if(u==="unavailable"||s==="binary_sensor"&&["problem","tamper","safety"].includes(o)&&u==="on")e.problems.push(r);else if(s==="siren")e.controls.push(r);else if(s==="button"){const h=n.match(_e);h?e.ptz.push({...r,direction:ne[h[1].toLowerCase()]}):e.controls.push(r)}else e.others.push(r)}const a=new Set(e.cameras.map(r=>r.deviceId).filter(Boolean));if(a.size){const r=[],n=[];for(const l of e.others){const s=l.entityId.split(".")[0],o=l.deviceId&&a.has(l.deviceId);o&&!ie.has(s)?e.settings.push(l):o&&ie.has(s)?n.push(l):r.push(l)}n.length>1?e.diagnostics.push(...n):r.push(...n),e.others=r}return e}const se=`
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
`;function oe(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,i)=>a+i,0)/e.length:null}function N(t){return t.some(e=>e.state.state==="on")}function ke(t){return t.filter(e=>e.state.state==="on")}function Se(t){let e=null;for(const a of t){const i=parseFloat(a.state.state);isNaN(i)||(!e||i<e.value)&&(e={value:i,entityId:a.entityId,state:a.state})}return e}function Ce(t){var e;for(const a of t){const i=(e=a.state.attributes)==null?void 0:e.rgb_color;if(i)return`rgb(${i.join(",")})`}return null}const Ee=/_(max|gust|peak)$/i;function B(t,e){var i;return(((i=e.attributes)==null?void 0:i.friendly_name)??t.split(".")[1]).split(" ").pop()}function W(t){const e=new Map;for(const i of t)e.set(i.label,(e.get(i.label)??0)+1);if(![...e.values()].some(i=>i>1))return t;const a=i=>i.fullName.trim().split(/\s+/);return t.map(i=>{if(e.get(i.label)===1)return i;const r=a(i);for(let n=2;n<=r.length;n++){const l=r.slice(-n).join(" ");if(!t.some(o=>o!==i&&a(o).slice(-n).join(" ")===l))return{...i,label:l}}return{...i,label:i.entityId.split(".")[1]}})}function M(t,e){var l,s;if((l=e.attributes)!=null&&l.icon)return e.attributes.icon;const a=t.split(".")[0],i=((s=e.attributes)==null?void 0:s.device_class)??"",r=H.has(e.state),n=o=>typeof o=="string"?o:r?o.on:o.off;return a==="sensor"&&i==="battery"?le(parseFloat(e.state)):i==="wind_speed"&&Ee.test(t)?ye:i&&te[i]?n(te[i]):ae[a]?n(ae[a]):"mdi:help-circle-outline"}function le(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function C(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function Ae(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function ce(t,e,a){const i=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,r=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:i,max:r,range:r-i}}function Te(t,e=150){if(t.length<=e)return t.slice();const a=Math.floor(e/2),i=t.length/a,r=[];for(let n=0;n<a;n++){const l=Math.floor(n*i),s=n===a-1?t.length:Math.floor((n+1)*i);if(l>=s)continue;let o=-1,u=-1;for(let h=l;h<s;h++)Number.isFinite(t[h].v)&&((o===-1||t[h].v<t[o].v)&&(o=h),(u===-1||t[h].v>t[u].v)&&(u=h));if(o===-1)r.push(t[l]);else if(o===u)r.push(t[o]);else{const[h,c]=o<u?[o,u]:[u,o];r.push(t[h],t[c])}}return r}const ze=40,J=14,R=new WeakMap;function Me(t,e,a=null,i=""){if(!(t!=null&&t.length)||t.length<2)return"";const r=R.get(t);if(r&&r.color===e&&r.hc===a&&r.unit===i)return r.result;const n=300,l=60,s=t.map(f=>f.v),o=Math.min(...s),u=Math.max(...s),{min:h,range:c}=ce(a,o,u);if(c===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return R.set(t,{color:e,hc:a,unit:i,result:""}),"";const p=c||1,b=Te(t),v=t[0].t,w=t[t.length-1].t-v||1,S=b.map(f=>(f.t-v)/w*n),m=b.map(f=>l-(f.v-h)/p*l),x=`${S.map((f,d)=>`${d?"L":"M"}${f.toFixed(1)},${m[d].toFixed(1)}`).join(" ")} V${l} H0 Z`,y=b.length>ze,Y=y?"":S.map((f,d)=>`<circle cx="${f.toFixed(1)}" cy="${m[d].toFixed(1)}" r="1.5" fill="${e}"/>`).join(""),A=n/(S.length-1),V=Math.min(4,A/2).toFixed(1),Z=S.map((f,d)=>{if(!Number.isFinite(b[d].v))return"";const g=`${b[d].v.toFixed(1)}${i}`;return`<circle cx="${f.toFixed(1)}" cy="${m[d].toFixed(1)}" r="${V}" fill="transparent" data-v="${g}"/>`}).join(""),O=`<svg class="chart-hit-layer${y?" dense":""}" viewBox="0 0 ${n} ${l}" preserveAspectRatio="none" aria-hidden="true">${Z}</svg>`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null))){const f=de(n,l,`<path d="${x}" fill="${e}"/>${Y}`)+O;return R.set(t,{color:e,hc:a,unit:i,result:f}),f}const K=a.color??"rgba(3, 169, 244, 0.12)",F=a.color_high??"rgba(244, 67, 54, 0.25)",j=a.color_low??"rgba(33, 150, 243, 0.25)",I=f=>Math.max(0,Math.min(l,l-(f-h)/p*l)),P=l*(J/100),D=f=>Math.min(l-P,Math.max(P,f)),X=`<defs><clipPath id="sg-cp"><path d="${x}"/></clipPath></defs>`;let T=`<path d="${x}" fill="${K}"/>`;if(a.threshold_high!=null){const f=I(a.threshold_high);if(f>0&&(T+=`<rect x="0" y="0" width="${n}" height="${f.toFixed(1)}" fill="${F}" clip-path="url(#sg-cp)"/>`),f>0&&f<l){const d=D(f).toFixed(1);T+=`<line x1="0" y1="${d}" x2="${n}" y2="${d}" stroke="${F}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}if(a.threshold_low!=null){const f=I(a.threshold_low);if(f<l&&(T+=`<rect x="0" y="${f.toFixed(1)}" width="${n}" height="${(l-f).toFixed(1)}" fill="${j}" clip-path="url(#sg-cp)"/>`),f>0&&f<l){const d=D(f).toFixed(1);T+=`<line x1="0" y1="${d}" x2="${n}" y2="${d}" stroke="${j}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}const q=de(n,l,X+T+Y)+O;return R.set(t,{color:e,hc:a,unit:i,result:q}),q}function de(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function Le(t,e,a=null,i={}){var V,Z,O,Q,K,F,j,I,P,D,X,T,q,f;const r=e.area,n=(V=t.areas)==null?void 0:V[r];if(!n&&!e.name&&!((Z=e.entities)!=null&&Z.length))return{error:r??"(no area)"};const l=(O=e.entities)!=null&&O.length?[]:re(t,r),s=xe(l,e,t),o=we(s),u=ke(o.lights),h=Ce(u),c=oe(o.temperatures),p=oe(o.humidities),b=o.climate[0]??null,[v,E]=me[(Q=b==null?void 0:b.state)==null?void 0:Q.state]??[null,null],w=e.mold_threshold??70,S=e.navigate_to||((K=e.tap_action)==null?void 0:K.navigation_path)||null,m=e.history_chart??null,he=e.battery_low_threshold??20,x=Se(o.batteries),y=o.cameras[0]??null,Y=o.cameras.slice(1),A=o.updates.filter(d=>d.state.state==="on");return{areaName:e.name||(n==null?void 0:n.name)||r||"",cardIcon:e.icon||(n==null?void 0:n.icon)||"mdi:home",navPath:S,hasLights:o.lights.length>0,lightCount:u.length,offlineLights:o.lights.filter(d=>d.state.state==="unavailable").length,lightColor:h,occupied:N(o.motions)||N(o.occupancy),hasOccupancySensors:o.motions.length>0||o.occupancy.length>0,problemCount:o.problems.length,showBatteryBadge:x!=null&&x.value<=he,batteryValue:(x==null?void 0:x.value)??null,batteryIcon:x?le(x.value):null,batteryEntity:(x==null?void 0:x.entityId)??null,batteryTitle:x?`${o.batteries.length>1?`Lowest of ${o.batteries.length} — `:""}${((F=x.state.attributes)==null?void 0:F.friendly_name)??x.entityId}: ${x.value}%`:"",tempVal:c,humVal:p,tempUnit:((I=(j=o.temperatures[0])==null?void 0:j.state.attributes)==null?void 0:I.unit_of_measurement)??"°C",tempEntities:o.temperatures,humEntities:o.humidities,climate:b,climIcon:v,climColor:E,smokeOn:N(o.smokes),gasOn:N(o.gases),waterOn:N(o.moistures),moldRisk:p!==null&&p>=w,updateCount:A.length,updateEntity:((P=A[0])==null?void 0:P.entityId)??null,updateTitle:A.length?`${A.length} update${A.length!==1?"s":""} available: ${A.map(d=>{var g;return((g=d.state.attributes)==null?void 0:g.friendly_name)??d.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!y,cameraEntity:(y==null?void 0:y.entityId)??null,cameraImage:((D=y==null?void 0:y.state.attributes)==null?void 0:D.entity_picture)??null,cameraIcon:y?M(y.entityId,y.state):null,cameraTitle:((X=y==null?void 0:y.state.attributes)==null?void 0:X.friendly_name)??(y==null?void 0:y.entityId)??"",cameraState:(y==null?void 0:y.state.state)??"",cameraOffline:(y==null?void 0:y.state.state)==="unavailable",controlItems:e.show_entities!==!1?W(o.controls.map(({entityId:d,state:g})=>{var $,_,k;return{entityId:d,domain:d.split(".")[0],isActive:H.has(g.state),icon:M(d,g),label:(($=e.entity_labels)==null?void 0:$[d])??B(d,g),fullName:((_=g.attributes)==null?void 0:_.friendly_name)??d,title:`${((k=g.attributes)==null?void 0:k.friendly_name)??d} — ${g.state}`}})):[],settingsItems:e.show_entities!==!1?W(o.settings.map(({entityId:d,state:g})=>{var $,_,k;return{entityId:d,domain:d.split(".")[0],isActive:H.has(g.state),icon:M(d,g),label:(($=e.entity_labels)==null?void 0:$[d])??B(d,g),fullName:((_=g.attributes)==null?void 0:_.friendly_name)??d,title:`${((k=g.attributes)==null?void 0:k.friendly_name)??d} — ${g.state}`}})):[],collapsibleControls:e.collapsible_controls!==!1,controlsCollapsed:e.collapsible_controls!==!1&&!!i.controls,settingsCollapsed:e.collapsible_controls!==!1&&!!i.settings,diagnosticsCollapsed:e.collapsible_controls!==!1&&!!i.diagnostics,ptzItems:e.show_entities!==!1?o.ptz.map(({entityId:d,state:g,direction:$})=>{var _;return{entityId:d,direction:$,icon:ve[$],title:((_=g.attributes)==null?void 0:_.friendly_name)??d}}):[],weatherItems:e.show_entities!==!1?o.weathers.map(({entityId:d,state:g})=>{var ue,ge,fe;const $=parseFloat(g.state),_=((ue=g.attributes)==null?void 0:ue.unit_of_measurement)??"",k=((ge=g.attributes)==null?void 0:ge.device_class)??"";return{entityId:d,dc:k,icon:M(d,g),value:isNaN($)?g.state:$.toFixed(1),unit:_,title:`${((fe=g.attributes)==null?void 0:fe.friendly_name)??d} — ${g.state}${_}`}}):[],diagnosticsItems:e.show_entities!==!1?W(o.diagnostics.map(({entityId:d,state:g})=>{var $,_,k;return{entityId:d,icon:M(d,g),label:(($=e.entity_labels)==null?void 0:$[d])??B(d,g),fullName:((_=g.attributes)==null?void 0:_.friendly_name)??d,title:`${((k=g.attributes)==null?void 0:k.friendly_name)??d} — ${g.state}`}})):[],historyPoints:m!=null&&m.entity_id?a:null,historyColor:(m==null?void 0:m.color)??"rgba(3, 169, 244, 0.2)",historyChart:m,historyMin:m!=null&&m.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a.map(d=>d.v)):null,historyMax:m!=null&&m.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a.map(d=>d.v)):null,historyUnit:((f=(q=(T=t.states)==null?void 0:T[m==null?void 0:m.entity_id])==null?void 0:q.attributes)==null?void 0:f.unit_of_measurement)??"",historyHours:(m==null?void 0:m.hours)??24,historyEmpty:!!(m!=null&&m.entity_id)&&Array.isArray(a)&&a.length<2,chipItems:e.show_entities!==!1?W([...o.others,...Y].slice(0,e.max_entities??12).map(({entityId:d,state:g})=>{var $,_,k;return{entityId:d,isActive:H.has(g.state),icon:M(d,g),label:(($=e.entity_labels)==null?void 0:$[d])??B(d,g),fullName:((_=g.attributes)==null?void 0:_.friendly_name)??d,title:`${((k=g.attributes)==null?void 0:k.friendly_name)??d} — ${g.state}`}})):[]}}function Ne({areaName:t,cardIcon:e,hasLights:a,lightCount:i,offlineLights:r,occupied:n,hasOccupancySensors:l,problemCount:s,showBatteryBadge:o,batteryValue:u,batteryIcon:h,batteryEntity:c,batteryTitle:p,updateCount:b,updateEntity:v,updateTitle:E}){const w=i===0,S=w?r>0?`${r} light${r!==1?"s":""} offline`:"Lights off":`${i} light${i!==1?"s":""} on${r>0?` · ${r} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${w?"off":""} ${r>0?"has-offline":""}"
               role="button" tabindex="0" aria-label="${S}" title="${S}">
            <ha-icon icon="mdi:lightbulb${w?"-off":""}"></ha-icon>
            ${i>1?`<span>${i}</span>`:""}
          </div>`:""}
        ${l?`<div class="occupancy-dot ${n?"":"idle"}" title="${n?"Occupied":"Not occupied"}"></div>`:""}
        ${Oe({showBatteryBadge:o,batteryValue:u,batteryIcon:h,batteryEntity:c,batteryTitle:p,problemCount:s,updateCount:b,updateEntity:v,updateTitle:E})}
      </div>
    </div>`}function Oe({showBatteryBadge:t,batteryValue:e,batteryIcon:a,batteryEntity:i,batteryTitle:r,problemCount:n,updateCount:l,updateEntity:s,updateTitle:o}){const u=[];return t&&u.push(`
    <span class="group-seg status-seg-battery" data-entity="${i}" role="button" tabindex="0" aria-label="${r}" title="${r}">
      <ha-icon icon="${a}"></ha-icon><span>${e}%</span>
    </span>`),n>0&&u.push(`
    <span class="group-seg status-seg-problem" title="${n} problem${n!==1?"s":""}">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>${n>1?`<span>${n}</span>`:""}
    </span>`),l>0&&u.push(`
    <span class="group-seg status-seg-update" data-entity="${s}" role="button" tabindex="0" aria-label="${o}" title="${o}">
      <ha-icon icon="mdi:package-up"></ha-icon>${l>1?`<span>${l}</span>`:""}
    </span>`),u.length?`<div class="chip group-chip status-cluster" title="Alerts">${u.join("")}</div>`:""}function Fe({tempVal:t,humVal:e,tempUnit:a,tempEntities:i,humEntities:r,climate:n,climIcon:l,climColor:s}){var c,p,b,v,E,w,S,m;if(t===null&&e===null&&!l)return"";const o=i.length>1?`Avg of ${i.length} sensors`:((p=(c=i[0])==null?void 0:c.state.attributes)==null?void 0:p.friendly_name)??"",u=r.length>1?`Avg of ${r.length} sensors`:((v=(b=r[0])==null?void 0:b.state.attributes)==null?void 0:v.friendly_name)??"",h=((E=n==null?void 0:n.state.attributes)==null?void 0:E.friendly_name)??(n==null?void 0:n.entityId)??"";return`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((w=i[0])==null?void 0:w.entityId)??""}"
             role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((S=r[0])==null?void 0:S.entityId)??""}"
             role="button" tabindex="0" aria-label="${u}" title="${u}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${l?`
        <div class="env-chip climate"
             style="--climate-color: ${s}"
             data-entity="${n.entityId}"
             role="button" tabindex="0" aria-label="${h}" title="${h}">
          <ha-icon icon="${l}"></ha-icon>
          <span>${((m=n.state.attributes)==null?void 0:m.current_temperature)!=null?`${n.state.attributes.current_temperature}°`:n.state.state}</span>
        </div>`:""}
    </div>`}function U(t,e,a,{sectionKey:i,collapsible:r,collapsed:n}={}){return a?r?`
    <div class="group-section${n?" collapsed":""}">
      <span class="group-label ${e} clickable" data-section="${i}"
        role="button" tabindex="0" title="${n?"Expand":"Collapse"} ${t.toLowerCase()}">
        ${t}<ha-icon class="group-toggle" icon="mdi:chevron-${n?"down":"up"}"></ha-icon>
      </span>
      <div class="group-pill">${a}</div>
    </div>`:`<div class="group-section"><span class="group-label ${e}">${t}</span>${a}</div>`:""}function je({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip">
      ${t.map(({entityId:e,dc:a,icon:i,value:r,unit:n,title:l})=>`
        <span class="group-seg weather-seg" data-entity="${e}" data-dc="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="group-seg-value">${r}${n?" "+n:""}</span>
        </span>`).join("")}
    </div>`:""}function Ie({chipItems:t}){return`${t.length?`
      <div class="entity-chips">
        ${t.map(({entityId:e,isActive:a,icon:i,label:r,title:n})=>`
          <div class="chip${a?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${n}" title="${n}">
            <ha-icon icon="${i}"></ha-icon>
            <span class="chip-label">${r}</span>
          </div>`).join("")}
      </div>`:""}`}function Pe({diagnosticsItems:t}){return t.length?`
    <div class="chip group-chip diagnostics-chip">
      ${t.map(({entityId:e,icon:a,label:i,title:r})=>`
        <span class="group-seg diagnostics-seg" data-entity="${e}" role="button" tabindex="0" aria-label="${r}" title="${r}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="seg-label">${i}</span>
        </span>`).join("")}
    </div>`:""}function De({chipItems:t,weatherItems:e,diagnosticsItems:a,collapsibleControls:i,diagnosticsCollapsed:r}){const n=U("","",Ie({chipItems:t})),l=U("Weather","group-label-weather",je({weatherItems:e})),s=U("Diagnostics","group-label-diagnostics",Pe({diagnosticsItems:a}),{sectionKey:"diagnostics",collapsible:i,collapsed:r});return!t.length&&!l&&!s?"":`${n}
    ${l}
    ${s}
    `}function qe({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:i,cameraTitle:r,cameraState:n,cameraOffline:l}){if(!t)return"";const s=l?`${r} (offline)`:r;return`
    <div class="camera-preview${l?" offline":""}" data-entity="${i}"
         role="button" tabindex="0" aria-label="${s}" title="${s}">
      ${e?`<img src="${e}" alt="${s}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${n==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
      ${e?`
        <span class="camera-refresh-btn" role="button" tabindex="0" aria-label="Refresh snapshot" title="Refresh snapshot">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </span>`:""}
    </div>`}function pe(t){const e=t.querySelector(".camera-preview img");if(!e)return;const a=new URL(e.getAttribute("src"),window.location.href);a.searchParams.set("_refresh",Date.now()),e.src=a.pathname+a.search}function He({ptzItems:t}){return t.length?`
    <div class="chip group-chip ptz-chip">
      ${t.map(({entityId:e,direction:a,icon:i,title:r})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" role="button" tabindex="0" aria-label="${r}" title="${r}">
          <ha-icon icon="${i}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function Be({controlItems:t}){return t.length?`
    <div class="chip group-chip controls-chip">
      ${t.map(({entityId:e,domain:a,isActive:i,icon:r,label:n,title:l})=>`
        <span class="group-seg control-seg${i?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}function We({settingsItems:t}){return t.length?`
    <div class="chip group-chip settings-chip">
      ${t.map(({entityId:e,domain:a,isActive:i,icon:r,label:n,title:l})=>`
        <span class="group-seg settings-seg${i?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}function Re({controlItems:t,settingsItems:e,ptzItems:a,collapsibleControls:i,controlsCollapsed:r,settingsCollapsed:n}){if(!t.length&&!e.length&&!a.length)return"";const l=He({ptzItems:a})+Be({controlItems:t});return`
    ${l?`
      <div class="controls-row${r?" collapsed":""}">
        <span class="controls-label${i?" clickable":""}"
          data-section="controls"
          ${i?`role="button" tabindex="0" title="${r?"Expand":"Collapse"} controls"`:""}
          >Controls${i?`<ha-icon class="controls-toggle" icon="mdi:chevron-${r?"down":"up"}"></ha-icon>`:""}</span>
        <div class="controls-chips">${l}</div>
      </div>`:""}
    ${U("Settings","group-label-settings",We({settingsItems:e}),{sectionKey:"settings",collapsible:i,collapsed:n})}`}function Ue({smokeOn:t,gasOn:e,waterOn:a,moldRisk:i}){return!t&&!e&&!a&&!i?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${i?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function Ge(t){return`
    <style>${se}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function Ye({historyMin:t,historyMax:e,historyUnit:a,historyHours:i,historyChart:r,historyEmpty:n}){if(t===null)return n?'<div class="chart-overlay"><span class="chart-stat chart-empty">No numeric history</span></div>':"";const l=[];if((r==null?void 0:r.threshold_high)!=null||(r==null?void 0:r.threshold_low)!=null){const{min:s,range:o}=ce(r,t,e),u=o||1,h=p=>(1-(p-s)/u)*100,c=p=>Math.min(100-J,Math.max(J,p));if(r.threshold_high!=null){const p=h(r.threshold_high);p>0&&p<100&&l.push(`<span class="chart-threshold" style="top:${c(p).toFixed(1)}%">${r.threshold_high.toFixed(1)}${a}</span>`)}if(r.threshold_low!=null){const p=h(r.threshold_low);p>0&&p<100&&l.push(`<span class="chart-threshold" style="top:${c(p).toFixed(1)}%">${r.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period" title="Tracking ${r.entity_id} — may differ from the averaged value shown above">${i}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${l.join("")}
    </div>`}function Ve(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",i=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${se}</style>
    <ha-card
      ${i?`class="${i}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?Me(t.historyPoints,t.historyColor,t.historyChart,t.historyUnit):""}
      ${Ye(t)}
      <div class="card-content">
        ${qe(t)}
        ${Ne(t)}
        ${Fe(t)}
        ${De(t)}
        ${Re(t)}
        ${Ue(t)}
      </div>
    </ha-card>`}function Ze(t,e,a){var r,n;const i=(r=t.activeElement)==null?void 0:r.className;t.innerHTML=a.error?Ge(a.error):Ve(a),a.error||Ke(t,e,a),i&&((n=t.querySelector(`.${i.trim().split(/\s+/).join(".")}`))==null||n.focus())}function Ke(t,e,{navPath:a,chipItems:i}){var u,h;a&&t.querySelector("ha-card").addEventListener("click",c=>{!c.target.closest(".chip")&&!c.target.closest(".env-chip")&&!c.target.closest(".badge-lights")&&!c.target.closest(".status-seg-battery")&&!c.target.closest(".status-seg-update")&&!c.target.closest(".camera-preview")&&!c.target.closest(".controls-label.clickable")&&!c.target.closest(".group-label.clickable")&&Ae(a)}),t.querySelectorAll('[role="button"][tabindex]').forEach(c=>{c.addEventListener("keydown",p=>{p.key!=="Enter"&&p.key!==" "||(p.preventDefault(),p.stopPropagation(),c.click())})}),t.querySelectorAll(".controls-label.clickable[data-section], .group-label.clickable[data-section]").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation(),e.toggleSectionCollapsed(c.dataset.section)})}),t.querySelectorAll(".ptz-seg[data-entity]").forEach(c=>{c.addEventListener("click",p=>{var b;p.stopPropagation(),(b=e._hass)!=null&&b.callService?e._hass.callService("button","press",{},{entity_id:c.dataset.entity}):C(e,c.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation(),C(e,c.dataset.entity)})}),t.querySelectorAll(".diagnostics-seg[data-entity]").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation(),C(e,c.dataset.entity)})});const r=t.querySelector(".status-seg-update[data-entity]");r&&r.addEventListener("click",c=>{c.stopPropagation(),C(e,r.dataset.entity)});const n=t.querySelector(".camera-preview[data-entity]");n&&n.addEventListener("click",c=>{c.stopPropagation(),C(e,n.dataset.entity)});const l=t.querySelector(".camera-refresh-btn");l&&l.addEventListener("click",c=>{c.stopPropagation(),pe(t)}),t.querySelectorAll(".control-seg[data-entity]").forEach(c=>{c.addEventListener("click",p=>{var E,w;p.stopPropagation();const b=c.dataset.entity,v=c.dataset.domain;v==="button"&&((E=e._hass)!=null&&E.callService)?e._hass.callService("button","press",{},{entity_id:b}):v==="siren"&&((w=e._hass)!=null&&w.callService)?e._hass.callService("siren","toggle",{},{entity_id:b}):C(e,b)})}),t.querySelectorAll(".settings-seg[data-entity]").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation(),C(e,c.dataset.entity)})});const s=t.querySelector(".badge-lights");s&&((u=e._config)!=null&&u.area)&&((h=e._hass)!=null&&h.callService)&&s.addEventListener("click",c=>{c.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const o=t.querySelector(".status-seg-battery[data-entity]");o&&o.addEventListener("click",c=>{c.stopPropagation(),C(e,o.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(c=>{const p=c.dataset.entity;p&&c.addEventListener("click",b=>{b.stopPropagation(),C(e,p)})}),t.querySelectorAll(".chip[data-entity]").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation(),C(e,c.dataset.entity)})}),Xe(t)}function Xe(t){const e=t.querySelectorAll(".chart-hit-layer circle[data-v]");if(!e.length)return;const a=t.querySelector("ha-card");let i=null,r=null;const n=(l,s)=>{l.style.left=`${parseFloat(s.getAttribute("cx"))/300*100}%`,l.style.top=`${parseFloat(s.getAttribute("cy"))/60*100}%`};e.forEach(l=>{var o;const s=(o=l.closest(".chart-hit-layer"))==null?void 0:o.classList.contains("dense");l.addEventListener("pointerenter",u=>{u.stopPropagation(),i||(i=document.createElement("div"),i.className="chart-tooltip",a.appendChild(i)),i.textContent=l.dataset.v,n(i,l),i.style.display="block",s&&(r||(r=document.createElement("div"),r.className="chart-hover-dot",a.appendChild(r)),n(r,l),r.style.display="block")}),l.addEventListener("pointerleave",u=>{u.stopPropagation(),i&&(i.style.display="none"),r&&(r.style.display="none")})})}const z=new Map,G=new Set,L=new Map,Je=2;function Qe(t){for(const e of z.keys()){const a=Number(e.slice(e.lastIndexOf(":")+1));t-a>Je&&z.delete(e)}}function et(t,e,a,i,r){var u;const n=(u=r==null?void 0:r._config)==null?void 0:u.debug,l=Math.floor(Date.now()/3e5),s=`${e}:${a}:${l}`;if(Qe(l),z.has(s))return n&&console.debug("[hass-omnibus-card] history cache hit",{key:s,points:z.get(s).length}),z.get(s);if(G.has(s))return n&&console.debug("[hass-omnibus-card] history fetch pending, queuing callback",{key:s}),L.get(s).set(r,i),null;if(!(t!=null&&t.callWS))return n&&console.debug("[hass-omnibus-card] history skipped — no callWS",{entityId:e}),null;n&&console.debug("[hass-omnibus-card] history fetch start",{key:s,entityId:e,hours:a}),G.add(s),L.set(s,new Map([[r,i]]));const o=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:o,minimal_response:!0,no_attributes:!0}).then(h=>{const c=Array.isArray(h==null?void 0:h[e])?h[e]:[],p=c.map(v=>({t:(v.lu??v.last_updated??0)*1e3,v:parseFloat(v.s??v.state)})).filter(v=>!isNaN(v.v));n&&console.debug("[hass-omnibus-card] history fetch done",{key:s,rawCount:c.length,pointCount:p.length}),z.set(s,p),G.delete(s);const b=L.get(s);L.delete(s),b==null||b.forEach(v=>v(p))}).catch(h=>{n&&console.debug("[hass-omnibus-card] history fetch error",{key:s,error:h}),z.set(s,[]),G.delete(s);const c=L.get(s);L.delete(s),c==null||c.forEach(p=>p([]))}),null}class tt extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._collapsed=null,this._cameraRefreshTimer=null}setConfig(e){var i;if(!(e!=null&&e.area)&&!((i=e==null?void 0:e.entities)!=null&&i.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null;const a=e.controls_collapsed!==!1;this._collapsed={controls:a,settings:a,diagnostics:a},this._hass&&this._update(),this._startCameraRefreshTimer()}connectedCallback(){this._startCameraRefreshTimer()}disconnectedCallback(){clearInterval(this._cameraRefreshTimer)}_startCameraRefreshTimer(){var a;clearInterval(this._cameraRefreshTimer);const e=(a=this._config)==null?void 0:a.camera_refresh_interval;!e||e<=0||(this._cameraRefreshTimer=setInterval(()=>pe(this.shadowRoot),e*6e4))}toggleSectionCollapsed(e){this._collapsed[e]=!this._collapsed[e],this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var i,r,n,l;if(!this._hass||!this._config)return"";let e;if((i=this._config.entities)!=null&&i.length)e=this._config.entities.map(s=>{var o;return{entityId:s,state:(o=this._hass.states)==null?void 0:o[s]}}).filter(s=>s.state);else{e=re(this._hass,this._config.area);for(const s of this._config.add_entities??[])if(!e.some(o=>o.entityId===s)){const o=(r=this._hass.states)==null?void 0:r[s];o&&e.push({entityId:s,state:o})}}const a=(n=this._config.history_chart)==null?void 0:n.entity_id;if(a&&!e.some(s=>s.entityId===a)){const s=(l=this._hass.states)==null?void 0:l[a];s&&e.push({entityId:a,state:s})}return e.map(({entityId:s,state:o})=>{var u,h,c;return`${s}=${o.state}|${((u=o.attributes)==null?void 0:u.rgb_color)??""}|${((h=o.attributes)==null?void 0:h.current_temperature)??""}|${((c=o.attributes)==null?void 0:c.entity_picture)??""}`}).sort().join(";")}_update(){var r,n;let e=null;const a=(r=this._config)==null?void 0:r.history_chart;a!=null&&a.entity_id&&(e=et(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const i=Le(this._hass,this._config,e,this._collapsed);(n=this._config)!=null&&n.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:i}),Ze(this.shadowRoot,this,i)}}window.customCards=window.customCards||[],window.customCards.push({type:ee,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${be} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(ee,tt)})();
