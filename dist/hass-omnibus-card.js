(function(){"use strict";const te="hass-omnibus-card",we="1.24.0",H=new Set(["on","open","playing","home","unlocked"]),ke={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},ae={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high"},Se="mdi:weather-windy-variant",ie={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"},Ce={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"};function re(t,e){const{entities:a={},devices:r={},states:i={}}=t;return Object.keys(i).reduce((n,l)=>{var p;const s=a[l];if(!s||s.hidden_by)return n;const o=s.area_id===e,u=s.device_id&&((p=r[s.device_id])==null?void 0:p.area_id)===e;return(o||u)&&n.push({entityId:l,state:i[l],deviceId:s.device_id??null}),n},[])}function Ee(t,e,a){var l,s,o,u;if((l=e.entities)!=null&&l.length)return e.entities.map(p=>{var d,b,v;const c=(d=a.states)==null?void 0:d[p];return c?{entityId:p,state:c,deviceId:((v=(b=a.entities)==null?void 0:b[p])==null?void 0:v.device_id)??null}:null}).filter(Boolean);const r=new Set(e.exclude_entities??[]),i=e.add_entities??[],n=t.filter(p=>!r.has(p.entityId));for(const p of i){if(n.some(d=>d.entityId===p))continue;const c=(s=a.states)==null?void 0:s[p];c&&n.push({entityId:p,state:c,deviceId:((u=(o=a.entities)==null?void 0:o[p])==null?void 0:u.device_id)??null})}return n}const ne=new Set(["sensor","binary_sensor","image"]),Ae=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),se={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},Te=new RegExp(`ptz.*_(${Object.keys(se).join("|")})$`,"i");function ze(t){var r;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],settings:[],ptz:[],updates:[],others:[],diagnostics:[]};for(const i of t){const{entityId:n,state:l}=i,s=n.split(".")[0],o=((r=l.attributes)==null?void 0:r.device_class)??"",u=l.state;if(s==="light")e.lights.push(i);else if(s==="climate")e.climate.push(i);else if(s==="camera")e.cameras.push(i);else if(s==="update"&&u!=="unavailable")e.updates.push(i);else if(s==="sensor"&&o==="temperature")e.temperatures.push(i);else if(s==="sensor"&&o==="humidity")e.humidities.push(i);else if(s==="sensor"&&Ae.has(o))e.weathers.push(i);else if(s==="binary_sensor"&&o==="motion")e.motions.push(i);else if(s==="binary_sensor"&&o==="occupancy")e.occupancy.push(i);else if(s==="binary_sensor"&&o==="smoke")e.smokes.push(i);else if(s==="binary_sensor"&&o==="gas")e.gases.push(i);else if(s==="binary_sensor"&&o==="moisture")e.moistures.push(i);else if(s==="sensor"&&o==="battery"&&u!=="unavailable")e.batteries.push(i),e.others.push(i);else if(u==="unavailable"||s==="binary_sensor"&&["problem","tamper","safety"].includes(o)&&u==="on")e.problems.push(i);else if(s==="siren")e.controls.push(i);else if(s==="button"){const p=n.match(Te);p?e.ptz.push({...i,direction:se[p[1].toLowerCase()]}):e.controls.push(i)}else e.others.push(i)}const a=new Set(e.cameras.map(i=>i.deviceId).filter(Boolean));if(a.size){const i=[],n=[];for(const l of e.others){const s=l.entityId.split(".")[0],o=l.deviceId&&a.has(l.deviceId);o&&!ne.has(s)?e.settings.push(l):o&&ne.has(s)?n.push(l):i.push(l)}n.length>1?e.diagnostics.push(...n):i.push(...n),e.others=i}return e}const oe=`
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

  /* ── Section tabs (Controls / Settings / Diagnostics, collapsible_controls
     default) ── One exclusive tab strip instead of three independent
     chevron accordions: only the active tab's pill is ever in the DOM, so
     switching tabs can never stack height on top of an already-open one —
     at most one panel's worth of card-height change, capped by max-height so
     a long pill scrolls internally instead of pushing sibling cards around
     in a dashboard grid. */
  .section-tabs {
    margin-top: 8px;
  }

  .section-tabs-bar {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: 4px;
  }

  .section-tab {
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
  }

  .section-tab:hover { opacity: 0.85; }

  .section-tab.active {
    background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
    opacity: 1;
  }

  .section-tab-panel {
    display: none;
    max-height: 6.5rem;
    overflow-y: auto;
  }

  .section-tab-panel.active {
    display: flex;
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
`;function le(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,r)=>a+r,0)/e.length:null}function O(t){return t.some(e=>e.state.state==="on")}function Me(t){return t.filter(e=>e.state.state==="on")}function Ne(t){let e=null;for(const a of t){const r=parseFloat(a.state.state);isNaN(r)||(!e||r<e.value)&&(e={value:r,entityId:a.entityId,state:a.state})}return e}function Le(t){var e;for(const a of t){const r=(e=a.state.attributes)==null?void 0:e.rgb_color;if(r)return`rgb(${r.join(",")})`}return null}const Oe=/_(max|gust|peak)$/i;function B(t,e){var r;return(((r=e.attributes)==null?void 0:r.friendly_name)??t.split(".")[1]).split(" ").pop()}function W(t){const e=new Map;for(const r of t)e.set(r.label,(e.get(r.label)??0)+1);if(![...e.values()].some(r=>r>1))return t;const a=r=>r.fullName.trim().split(/\s+/);return t.map(r=>{if(e.get(r.label)===1)return r;const i=a(r);for(let n=2;n<=i.length;n++){const l=i.slice(-n).join(" ");if(!t.some(o=>o!==r&&a(o).slice(-n).join(" ")===l))return{...r,label:l}}return{...r,label:r.entityId.split(".")[1]}})}function N(t,e){var l,s;if((l=e.attributes)!=null&&l.icon)return e.attributes.icon;const a=t.split(".")[0],r=((s=e.attributes)==null?void 0:s.device_class)??"",i=H.has(e.state),n=o=>typeof o=="string"?o:i?o.on:o.off;return a==="sensor"&&r==="battery"?ce(parseFloat(e.state)):r==="wind_speed"&&Oe.test(t)?Se:r&&ae[r]?n(ae[r]):ie[a]?n(ie[a]):"mdi:help-circle-outline"}function ce(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function E(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function je(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function de(t,e,a){const r=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,i=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:r,max:i,range:i-r}}function Fe(t,e=150){if(t.length<=e)return t.slice();const a=Math.floor(e/2),r=t.length/a,i=[];for(let n=0;n<a;n++){const l=Math.floor(n*r),s=n===a-1?t.length:Math.floor((n+1)*r);if(l>=s)continue;let o=-1,u=-1;for(let p=l;p<s;p++)Number.isFinite(t[p].v)&&((o===-1||t[p].v<t[o].v)&&(o=p),(u===-1||t[p].v>t[u].v)&&(u=p));if(o===-1)i.push(t[l]);else if(o===u)i.push(t[o]);else{const[p,c]=o<u?[o,u]:[u,o];i.push(t[p],t[c])}}return i}const Ie=40,Q=14,G=new WeakMap;function De(t,e,a=null,r=""){if(!(t!=null&&t.length)||t.length<2)return"";const i=G.get(t);if(i&&i.color===e&&i.hc===a&&i.unit===r)return i.result;const n=300,l=60,s=t.map(f=>f.v),o=Math.min(...s),u=Math.max(...s),{min:p,range:c}=de(a,o,u);if(c===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return G.set(t,{color:e,hc:a,unit:r,result:""}),"";const d=c||1,b=Fe(t),v=t[0].t,k=t[t.length-1].t-v||1,C=b.map(f=>(f.t-v)/k*n),m=b.map(f=>l-(f.v-p)/d*l),x=`${C.map((f,_)=>`${_?"L":"M"}${f.toFixed(1)},${m[_].toFixed(1)}`).join(" ")} V${l} H0 Z`,y=b.length>Ie,U=y?"":C.map((f,_)=>`<circle cx="${f.toFixed(1)}" cy="${m[_].toFixed(1)}" r="1.5" fill="${e}"/>`).join(""),T=n/(C.length-1),Y=Math.min(4,T/2).toFixed(1),V=C.map((f,_)=>{if(!Number.isFinite(b[_].v))return"";const J=`${b[_].v.toFixed(1)}${r}`;return`<circle cx="${f.toFixed(1)}" cy="${m[_].toFixed(1)}" r="${Y}" fill="transparent" data-v="${J}"/>`}).join(""),j=`<svg class="chart-hit-layer${y?" dense":""}" viewBox="0 0 ${n} ${l}" preserveAspectRatio="none" aria-hidden="true">${V}</svg>`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null))){const f=pe(n,l,`<path d="${x}" fill="${e}"/>${U}`)+j;return G.set(t,{color:e,hc:a,unit:r,result:f}),f}const Z=a.color??"rgba(3, 169, 244, 0.12)",F=a.color_high??"rgba(244, 67, 54, 0.25)",X=a.color_low??"rgba(33, 150, 243, 0.25)",I=f=>Math.max(0,Math.min(l,l-(f-p)/d*l)),D=l*(Q/100),P=f=>Math.min(l-D,Math.max(D,f)),K=`<defs><clipPath id="sg-cp"><path d="${x}"/></clipPath></defs>`;let z=`<path d="${x}" fill="${Z}"/>`;if(a.threshold_high!=null){const f=I(a.threshold_high);if(f>0&&(z+=`<rect x="0" y="0" width="${n}" height="${f.toFixed(1)}" fill="${F}" clip-path="url(#sg-cp)"/>`),f>0&&f<l){const _=P(f).toFixed(1);z+=`<line x1="0" y1="${_}" x2="${n}" y2="${_}" stroke="${F}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}if(a.threshold_low!=null){const f=I(a.threshold_low);if(f<l&&(z+=`<rect x="0" y="${f.toFixed(1)}" width="${n}" height="${(l-f).toFixed(1)}" fill="${X}" clip-path="url(#sg-cp)"/>`),f>0&&f<l){const _=P(f).toFixed(1);z+=`<line x1="0" y1="${_}" x2="${n}" y2="${_}" stroke="${X}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}const q=pe(n,l,K+z+U)+j;return G.set(t,{color:e,hc:a,unit:r,result:q}),q}function pe(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function Pe(t,e,a=null,r=null){var I,D,P,K,z,q,f,_,J,fe,be,me,ye,ve;const i=e.area,n=(I=t.areas)==null?void 0:I[i];if(!n&&!e.name&&!((D=e.entities)!=null&&D.length))return{error:i??"(no area)"};const l=(P=e.entities)!=null&&P.length?[]:re(t,i),s=Ee(l,e,t),o=ze(s),u=Me(o.lights),p=Le(u),c=le(o.temperatures),d=le(o.humidities),b=o.climate[0]??null,[v,A]=ke[(K=b==null?void 0:b.state)==null?void 0:K.state]??[null,null],k=e.mold_threshold??70,C=e.navigate_to||((z=e.tap_action)==null?void 0:z.navigation_path)||null,m=e.history_chart??null,ge=e.battery_low_threshold??20,x=Ne(o.batteries),y=o.cameras[0]??null,U=o.cameras.slice(1),T=o.updates.filter(h=>h.state.state==="on"),Y=e.show_entities!==!1?W(o.controls.map(({entityId:h,state:g})=>{var $,w,S;return{entityId:h,domain:h.split(".")[0],isActive:H.has(g.state),icon:N(h,g),label:(($=e.entity_labels)==null?void 0:$[h])??B(h,g),fullName:((w=g.attributes)==null?void 0:w.friendly_name)??h,title:`${((S=g.attributes)==null?void 0:S.friendly_name)??h} — ${g.state}`}})):[],V=e.show_entities!==!1?W(o.settings.map(({entityId:h,state:g})=>{var $,w,S;return{entityId:h,domain:h.split(".")[0],isActive:H.has(g.state),icon:N(h,g),label:(($=e.entity_labels)==null?void 0:$[h])??B(h,g),fullName:((w=g.attributes)==null?void 0:w.friendly_name)??h,title:`${((S=g.attributes)==null?void 0:S.friendly_name)??h} — ${g.state}`}})):[],j=e.show_entities!==!1?o.ptz.map(({entityId:h,state:g,direction:$})=>{var w;return{entityId:h,direction:$,icon:Ce[$],title:((w=g.attributes)==null?void 0:w.friendly_name)??h}}):[],ee=e.show_entities!==!1?W(o.diagnostics.map(({entityId:h,state:g})=>{var $,w,S;return{entityId:h,icon:N(h,g),label:(($=e.entity_labels)==null?void 0:$[h])??B(h,g),fullName:((w=g.attributes)==null?void 0:w.friendly_name)??h,title:`${((S=g.attributes)==null?void 0:S.friendly_name)??h} — ${g.state}`}})):[],Z=e.collapsible_controls!==!1,F=[{key:"controls",hasContent:j.length>0||Y.length>0},{key:"settings",hasContent:V.length>0},{key:"diagnostics",hasContent:ee.length>0}].filter(h=>h.hasContent).map(h=>h.key),X=Z?r==="__default__"?F[0]??null:F.includes(r)?r:null:null;return{areaName:e.name||(n==null?void 0:n.name)||i||"",cardIcon:e.icon||(n==null?void 0:n.icon)||"mdi:home",navPath:C,hasLights:o.lights.length>0,lightCount:u.length,offlineLights:o.lights.filter(h=>h.state.state==="unavailable").length,lightColor:p,occupied:O(o.motions)||O(o.occupancy),hasOccupancySensors:o.motions.length>0||o.occupancy.length>0,problemCount:o.problems.length,showBatteryBadge:x!=null&&x.value<=ge,batteryValue:(x==null?void 0:x.value)??null,batteryIcon:x?ce(x.value):null,batteryEntity:(x==null?void 0:x.entityId)??null,batteryTitle:x?`${o.batteries.length>1?`Lowest of ${o.batteries.length} — `:""}${((q=x.state.attributes)==null?void 0:q.friendly_name)??x.entityId}: ${x.value}%`:"",tempVal:c,humVal:d,tempUnit:((_=(f=o.temperatures[0])==null?void 0:f.state.attributes)==null?void 0:_.unit_of_measurement)??"°C",tempEntities:o.temperatures,humEntities:o.humidities,climate:b,climIcon:v,climColor:A,smokeOn:O(o.smokes),gasOn:O(o.gases),waterOn:O(o.moistures),moldRisk:d!==null&&d>=k,updateCount:T.length,updateEntity:((J=T[0])==null?void 0:J.entityId)??null,updateTitle:T.length?`${T.length} update${T.length!==1?"s":""} available: ${T.map(h=>{var g;return((g=h.state.attributes)==null?void 0:g.friendly_name)??h.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!y,cameraEntity:(y==null?void 0:y.entityId)??null,cameraImage:((fe=y==null?void 0:y.state.attributes)==null?void 0:fe.entity_picture)??null,cameraIcon:y?N(y.entityId,y.state):null,cameraTitle:((be=y==null?void 0:y.state.attributes)==null?void 0:be.friendly_name)??(y==null?void 0:y.entityId)??"",cameraState:(y==null?void 0:y.state.state)??"",cameraOffline:(y==null?void 0:y.state.state)==="unavailable",controlItems:Y,settingsItems:V,collapsibleControls:Z,activeSection:X,ptzItems:j,diagnosticsItems:ee,weatherItems:e.show_entities!==!1?o.weathers.map(({entityId:h,state:g})=>{var xe,_e,$e;const $=parseFloat(g.state),w=((xe=g.attributes)==null?void 0:xe.unit_of_measurement)??"",S=((_e=g.attributes)==null?void 0:_e.device_class)??"";return{entityId:h,dc:S,icon:N(h,g),value:isNaN($)?g.state:$.toFixed(1),unit:w,title:`${(($e=g.attributes)==null?void 0:$e.friendly_name)??h} — ${g.state}${w}`}}):[],historyPoints:m!=null&&m.entity_id?a:null,historyColor:(m==null?void 0:m.color)??"rgba(3, 169, 244, 0.2)",historyChart:m,historyMin:m!=null&&m.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a.map(h=>h.v)):null,historyMax:m!=null&&m.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a.map(h=>h.v)):null,historyUnit:((ve=(ye=(me=t.states)==null?void 0:me[m==null?void 0:m.entity_id])==null?void 0:ye.attributes)==null?void 0:ve.unit_of_measurement)??"",historyHours:(m==null?void 0:m.hours)??24,historyEmpty:!!(m!=null&&m.entity_id)&&Array.isArray(a)&&a.length<2,chipItems:e.show_entities!==!1?W([...o.others,...U].slice(0,e.max_entities??12).map(({entityId:h,state:g})=>{var $,w,S;return{entityId:h,isActive:H.has(g.state),icon:N(h,g),label:(($=e.entity_labels)==null?void 0:$[h])??B(h,g),fullName:((w=g.attributes)==null?void 0:w.friendly_name)??h,title:`${((S=g.attributes)==null?void 0:S.friendly_name)??h} — ${g.state}`}})):[]}}function qe({areaName:t,cardIcon:e,hasLights:a,lightCount:r,offlineLights:i,occupied:n,hasOccupancySensors:l,problemCount:s,showBatteryBadge:o,batteryValue:u,batteryIcon:p,batteryEntity:c,batteryTitle:d,updateCount:b,updateEntity:v,updateTitle:A}){const k=r===0,C=k?i>0?`${i} light${i!==1?"s":""} offline`:"Lights off":`${r} light${r!==1?"s":""} on${i>0?` · ${i} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${k?"off":""} ${i>0?"has-offline":""}"
               role="button" tabindex="0" aria-label="${C}" title="${C}">
            <ha-icon icon="mdi:lightbulb${k?"-off":""}"></ha-icon>
            ${r>1?`<span>${r}</span>`:""}
          </div>`:""}
        ${l?`<div class="occupancy-dot ${n?"":"idle"}" title="${n?"Occupied":"Not occupied"}"></div>`:""}
        ${He({showBatteryBadge:o,batteryValue:u,batteryIcon:p,batteryEntity:c,batteryTitle:d,problemCount:s,updateCount:b,updateEntity:v,updateTitle:A})}
      </div>
    </div>`}function He({showBatteryBadge:t,batteryValue:e,batteryIcon:a,batteryEntity:r,batteryTitle:i,problemCount:n,updateCount:l,updateEntity:s,updateTitle:o}){const u=[];return t&&u.push(`
    <span class="group-seg status-seg-battery" data-entity="${r}" role="button" tabindex="0" aria-label="${i}" title="${i}">
      <ha-icon icon="${a}"></ha-icon><span>${e}%</span>
    </span>`),n>0&&u.push(`
    <span class="group-seg status-seg-problem" title="${n} problem${n!==1?"s":""}">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>${n>1?`<span>${n}</span>`:""}
    </span>`),l>0&&u.push(`
    <span class="group-seg status-seg-update" data-entity="${s}" role="button" tabindex="0" aria-label="${o}" title="${o}">
      <ha-icon icon="mdi:package-up"></ha-icon>${l>1?`<span>${l}</span>`:""}
    </span>`),u.length?`<div class="chip group-chip status-cluster" title="Alerts">${u.join("")}</div>`:""}function Be({tempVal:t,humVal:e,tempUnit:a,tempEntities:r,humEntities:i,climate:n,climIcon:l,climColor:s}){var c,d,b,v,A,k,C,m;if(t===null&&e===null&&!l)return"";const o=r.length>1?`Avg of ${r.length} sensors`:((d=(c=r[0])==null?void 0:c.state.attributes)==null?void 0:d.friendly_name)??"",u=i.length>1?`Avg of ${i.length} sensors`:((v=(b=i[0])==null?void 0:b.state.attributes)==null?void 0:v.friendly_name)??"",p=((A=n==null?void 0:n.state.attributes)==null?void 0:A.friendly_name)??(n==null?void 0:n.entityId)??"";return`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((k=r[0])==null?void 0:k.entityId)??""}"
             role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((C=i[0])==null?void 0:C.entityId)??""}"
             role="button" tabindex="0" aria-label="${u}" title="${u}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${l?`
        <div class="env-chip climate"
             style="--climate-color: ${s}"
             data-entity="${n.entityId}"
             role="button" tabindex="0" aria-label="${p}" title="${p}">
          <ha-icon icon="${l}"></ha-icon>
          <span>${((m=n.state.attributes)==null?void 0:m.current_temperature)!=null?`${n.state.attributes.current_temperature}°`:n.state.state}</span>
        </div>`:""}
    </div>`}function he(t,e,a){return a?`<div class="group-section"><span class="group-label ${e}">${t}</span>${a}</div>`:""}function We({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip">
      ${t.map(({entityId:e,dc:a,icon:r,value:i,unit:n,title:l})=>`
        <span class="group-seg weather-seg" data-entity="${e}" data-dc="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="group-seg-value">${i}${n?" "+n:""}</span>
        </span>`).join("")}
    </div>`:""}function Ge({chipItems:t}){return`${t.length?`
      <div class="entity-chips">
        ${t.map(({entityId:e,isActive:a,icon:r,label:i,title:n})=>`
          <div class="chip${a?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${n}" title="${n}">
            <ha-icon icon="${r}"></ha-icon>
            <span class="chip-label">${i}</span>
          </div>`).join("")}
      </div>`:""}`}function Re({diagnosticsItems:t}){return t.length?`
    <div class="chip group-chip diagnostics-chip">
      ${t.map(({entityId:e,icon:a,label:r,title:i})=>`
        <span class="group-seg diagnostics-seg" data-entity="${e}" role="button" tabindex="0" aria-label="${i}" title="${i}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="seg-label">${r}</span>
        </span>`).join("")}
    </div>`:""}function Ue({chipItems:t,weatherItems:e}){const a=he("","",Ge({chipItems:t})),r=he("Weather","group-label-weather",We({weatherItems:e}));return!t.length&&!r?"":`${a}
    ${r}
    `}function Ye({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:r,cameraTitle:i,cameraState:n,cameraOffline:l}){if(!t)return"";const s=l?`${i} (offline)`:i;return`
    <div class="camera-preview${l?" offline":""}" data-entity="${r}"
         role="button" tabindex="0" aria-label="${s}" title="${s}">
      ${e?`<img src="${e}" alt="${s}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${n==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
      ${e?`
        <span class="camera-refresh-btn" role="button" tabindex="0" aria-label="Refresh snapshot" title="Refresh snapshot">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </span>`:""}
    </div>`}function ue(t){const e=t.querySelector(".camera-preview img");if(!e)return;const a=new URL(e.getAttribute("src"),window.location.href);a.searchParams.set("_refresh",Date.now()),e.src=a.pathname+a.search}function Ve({ptzItems:t}){return t.length?`
    <div class="chip group-chip ptz-chip">
      ${t.map(({entityId:e,direction:a,icon:r,title:i})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" role="button" tabindex="0" aria-label="${i}" title="${i}">
          <ha-icon icon="${r}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function Ze({controlItems:t}){return t.length?`
    <div class="chip group-chip controls-chip">
      ${t.map(({entityId:e,domain:a,isActive:r,icon:i,label:n,title:l})=>`
        <span class="group-seg control-seg${r?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}function Xe({settingsItems:t}){return t.length?`
    <div class="chip group-chip settings-chip">
      ${t.map(({entityId:e,domain:a,isActive:r,icon:i,label:n,title:l})=>`
        <span class="group-seg settings-seg${r?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}function Ke({controlItems:t,settingsItems:e,ptzItems:a,diagnosticsItems:r,collapsibleControls:i,activeSection:n}){const l=[{key:"controls",label:"Controls",pill:Ve({ptzItems:a})+Ze({controlItems:t})},{key:"settings",label:"Settings",pill:Xe({settingsItems:e})},{key:"diagnostics",label:"Diagnostics",pill:Re({diagnosticsItems:r})}].filter(s=>s.pill);return l.length?i?`
    <div class="section-tabs">
      <div class="section-tabs-bar" role="tablist">
        ${l.map(({key:s,label:o})=>`
          <span class="section-tab${n===s?" active":""}" data-section="${s}"
            role="tab" tabindex="0" aria-selected="${n===s}">${o}</span>`).join("")}
      </div>
      ${l.map(({key:s,pill:o})=>`
        <div class="section-tab-panel${n===s?" active":""}">${o}</div>`).join("")}
    </div>`:l.map(({key:s,label:o,pill:u})=>`
      <div class="group-section">
        <span class="group-label group-label-${s}">${o}</span>
        <div class="group-pill">${u}</div>
      </div>`).join(""):""}function Je({smokeOn:t,gasOn:e,waterOn:a,moldRisk:r}){return!t&&!e&&!a&&!r?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${r?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function Qe(t){return`
    <style>${oe}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function et({historyMin:t,historyMax:e,historyUnit:a,historyHours:r,historyChart:i,historyEmpty:n}){if(t===null)return n?'<div class="chart-overlay"><span class="chart-stat chart-empty">No numeric history</span></div>':"";const l=[];if((i==null?void 0:i.threshold_high)!=null||(i==null?void 0:i.threshold_low)!=null){const{min:s,range:o}=de(i,t,e),u=o||1,p=d=>(1-(d-s)/u)*100,c=d=>Math.min(100-Q,Math.max(Q,d));if(i.threshold_high!=null){const d=p(i.threshold_high);d>0&&d<100&&l.push(`<span class="chart-threshold" style="top:${c(d).toFixed(1)}%">${i.threshold_high.toFixed(1)}${a}</span>`)}if(i.threshold_low!=null){const d=p(i.threshold_low);d>0&&d<100&&l.push(`<span class="chart-threshold" style="top:${c(d).toFixed(1)}%">${i.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period" title="Tracking ${i.entity_id} — may differ from the averaged value shown above">${r}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${l.join("")}
    </div>`}function tt(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",r=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${oe}</style>
    <ha-card
      ${r?`class="${r}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?De(t.historyPoints,t.historyColor,t.historyChart,t.historyUnit):""}
      ${et(t)}
      <div class="card-content">
        ${Ye(t)}
        ${qe(t)}
        ${Be(t)}
        ${Ue(t)}
        ${Ke(t)}
        ${Je(t)}
      </div>
    </ha-card>`}function at(t,e,a){var i,n;const r=(i=t.activeElement)==null?void 0:i.className;t.innerHTML=a.error?Qe(a.error):tt(a),a.error||it(t,e,a),r&&((n=t.querySelector(`.${r.trim().split(/\s+/).join(".")}`))==null||n.focus())}function it(t,e,{navPath:a,chipItems:r}){var u,p;a&&t.querySelector("ha-card").addEventListener("click",c=>{!c.target.closest(".chip")&&!c.target.closest(".env-chip")&&!c.target.closest(".badge-lights")&&!c.target.closest(".status-seg-battery")&&!c.target.closest(".status-seg-update")&&!c.target.closest(".camera-preview")&&!c.target.closest(".section-tab")&&je(a)}),t.querySelectorAll('[role="button"][tabindex], [role="tab"][tabindex]').forEach(c=>{c.addEventListener("keydown",d=>{d.key!=="Enter"&&d.key!==" "||(d.preventDefault(),d.stopPropagation(),c.click())})}),t.querySelectorAll(".section-tab[data-section]").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),e.setActiveSection(c.dataset.section)})}),t.querySelectorAll(".ptz-seg[data-entity]").forEach(c=>{c.addEventListener("click",d=>{var b;d.stopPropagation(),(b=e._hass)!=null&&b.callService?e._hass.callService("button","press",{},{entity_id:c.dataset.entity}):E(e,c.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),E(e,c.dataset.entity)})}),t.querySelectorAll(".diagnostics-seg[data-entity]").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),E(e,c.dataset.entity)})});const i=t.querySelector(".status-seg-update[data-entity]");i&&i.addEventListener("click",c=>{c.stopPropagation(),E(e,i.dataset.entity)});const n=t.querySelector(".camera-preview[data-entity]");n&&n.addEventListener("click",c=>{c.stopPropagation(),E(e,n.dataset.entity)});const l=t.querySelector(".camera-refresh-btn");l&&l.addEventListener("click",c=>{c.stopPropagation(),ue(t)}),t.querySelectorAll(".control-seg[data-entity]").forEach(c=>{c.addEventListener("click",d=>{var A,k;d.stopPropagation();const b=c.dataset.entity,v=c.dataset.domain;v==="button"&&((A=e._hass)!=null&&A.callService)?e._hass.callService("button","press",{},{entity_id:b}):v==="siren"&&((k=e._hass)!=null&&k.callService)?e._hass.callService("siren","toggle",{},{entity_id:b}):E(e,b)})}),t.querySelectorAll(".settings-seg[data-entity]").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),E(e,c.dataset.entity)})});const s=t.querySelector(".badge-lights");s&&((u=e._config)!=null&&u.area)&&((p=e._hass)!=null&&p.callService)&&s.addEventListener("click",c=>{c.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const o=t.querySelector(".status-seg-battery[data-entity]");o&&o.addEventListener("click",c=>{c.stopPropagation(),E(e,o.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(c=>{const d=c.dataset.entity;d&&c.addEventListener("click",b=>{b.stopPropagation(),E(e,d)})}),t.querySelectorAll(".chip[data-entity]").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),E(e,c.dataset.entity)})}),rt(t)}function rt(t){const e=t.querySelectorAll(".chart-hit-layer circle[data-v]");if(!e.length)return;const a=t.querySelector("ha-card");let r=null,i=null;const n=(l,s)=>{l.style.left=`${parseFloat(s.getAttribute("cx"))/300*100}%`,l.style.top=`${parseFloat(s.getAttribute("cy"))/60*100}%`};e.forEach(l=>{var o;const s=(o=l.closest(".chart-hit-layer"))==null?void 0:o.classList.contains("dense");l.addEventListener("pointerenter",u=>{u.stopPropagation(),r||(r=document.createElement("div"),r.className="chart-tooltip",a.appendChild(r)),r.textContent=l.dataset.v,n(r,l),r.style.display="block",s&&(i||(i=document.createElement("div"),i.className="chart-hover-dot",a.appendChild(i)),n(i,l),i.style.display="block")}),l.addEventListener("pointerleave",u=>{u.stopPropagation(),r&&(r.style.display="none"),i&&(i.style.display="none")})})}const M=new Map,R=new Set,L=new Map,nt=2;function st(t){for(const e of M.keys()){const a=Number(e.slice(e.lastIndexOf(":")+1));t-a>nt&&M.delete(e)}}function ot(t,e,a,r,i){var u;const n=(u=i==null?void 0:i._config)==null?void 0:u.debug,l=Math.floor(Date.now()/3e5),s=`${e}:${a}:${l}`;if(st(l),M.has(s))return n&&console.debug("[hass-omnibus-card] history cache hit",{key:s,points:M.get(s).length}),M.get(s);if(R.has(s))return n&&console.debug("[hass-omnibus-card] history fetch pending, queuing callback",{key:s}),L.get(s).set(i,r),null;if(!(t!=null&&t.callWS))return n&&console.debug("[hass-omnibus-card] history skipped — no callWS",{entityId:e}),null;n&&console.debug("[hass-omnibus-card] history fetch start",{key:s,entityId:e,hours:a}),R.add(s),L.set(s,new Map([[i,r]]));const o=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:o,minimal_response:!0,no_attributes:!0}).then(p=>{const c=Array.isArray(p==null?void 0:p[e])?p[e]:[],d=c.map(v=>({t:(v.lu??v.last_updated??0)*1e3,v:parseFloat(v.s??v.state)})).filter(v=>!isNaN(v.v));n&&console.debug("[hass-omnibus-card] history fetch done",{key:s,rawCount:c.length,pointCount:d.length}),M.set(s,d),R.delete(s);const b=L.get(s);L.delete(s),b==null||b.forEach(v=>v(d))}).catch(p=>{n&&console.debug("[hass-omnibus-card] history fetch error",{key:s,error:p}),M.set(s,[]),R.delete(s);const c=L.get(s);L.delete(s),c==null||c.forEach(d=>d([]))}),null}class lt extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._activeSection=null,this._cameraRefreshTimer=null}setConfig(e){var a,r;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');(r=this._config)!=null&&r.debug&&console.debug("[hass-omnibus-card] set config",{config:e}),this._config={...e},this._stateHash=null,this._activeSection=e.controls_collapsed===!1?"__default__":null,this._hass&&this._update(),this._startCameraRefreshTimer()}connectedCallback(){this._startCameraRefreshTimer()}disconnectedCallback(){clearInterval(this._cameraRefreshTimer)}_startCameraRefreshTimer(){var a,r,i;(a=this._config)!=null&&a.debug&&console.debug("[hass-omnibus-card] start camera refresh timer",{interval:(r=this._config)==null?void 0:r.camera_refresh_interval}),clearInterval(this._cameraRefreshTimer);const e=(i=this._config)==null?void 0:i.camera_refresh_interval;!e||e<=0||(this._cameraRefreshTimer=setInterval(()=>ue(this.shadowRoot),e*6e4))}setActiveSection(e){var a;(a=this._config)!=null&&a.debug&&console.debug("[hass-omnibus-card] set active section",{section:e}),this._activeSection=this._activeSection===e?null:e,this._update()}set hass(e){var r;if((r=this._config)!=null&&r.debug&&console.debug("[hass-omnibus-card] set hass",{hass:e}),this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var r,i,n,l;if(!this._hass||!this._config)return"";let e;if((r=this._config.entities)!=null&&r.length)e=this._config.entities.map(s=>{var o;return{entityId:s,state:(o=this._hass.states)==null?void 0:o[s]}}).filter(s=>s.state);else{e=re(this._hass,this._config.area);for(const s of this._config.add_entities??[])if(!e.some(o=>o.entityId===s)){const o=(i=this._hass.states)==null?void 0:i[s];o&&e.push({entityId:s,state:o})}}const a=(n=this._config.history_chart)==null?void 0:n.entity_id;if(a&&!e.some(s=>s.entityId===a)){const s=(l=this._hass.states)==null?void 0:l[a];s&&e.push({entityId:a,state:s})}return e.map(({entityId:s,state:o})=>{var u,p,c;return`${s}=${o.state}|${((u=o.attributes)==null?void 0:u.rgb_color)??""}|${((p=o.attributes)==null?void 0:p.current_temperature)??""}|${((c=o.attributes)==null?void 0:c.entity_picture)??""}`}).sort().join(";")}_update(){var i,n;let e=null;const a=(i=this._config)==null?void 0:i.history_chart;a!=null&&a.entity_id&&(e=ot(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const r=Pe(this._hass,this._config,e,this._activeSection);r.error||(this._activeSection=r.activeSection??null),(n=this._config)!=null&&n.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:r}),at(this.shadowRoot,this,r)}}window.customCards=window.customCards||[],window.customCards.push({type:te,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${we} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(te,lt)})();
