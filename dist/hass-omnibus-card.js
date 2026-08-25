(function(){"use strict";const Z="hass-omnibus-card",he="1.22.0",P=new Set(["on","open","playing","home","unlocked"]),ge={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},V={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high"},fe="mdi:weather-windy-variant",K={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"},be={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"};function X(t,e){const{entities:a={},devices:o={},states:i={}}=t;return Object.keys(i).reduce((r,l)=>{var s;const c=a[l];if(!c||c.hidden_by)return r;const n=c.area_id===e,p=c.device_id&&((s=o[c.device_id])==null?void 0:s.area_id)===e;return(n||p)&&r.push({entityId:l,state:i[l],deviceId:c.device_id??null}),r},[])}function me(t,e,a){var l,c,n,p;if((l=e.entities)!=null&&l.length)return e.entities.map(s=>{var f,b,$;const d=(f=a.states)==null?void 0:f[s];return d?{entityId:s,state:d,deviceId:(($=(b=a.entities)==null?void 0:b[s])==null?void 0:$.device_id)??null}:null}).filter(Boolean);const o=new Set(e.exclude_entities??[]),i=e.add_entities??[],r=t.filter(s=>!o.has(s.entityId));for(const s of i){if(r.some(f=>f.entityId===s))continue;const d=(c=a.states)==null?void 0:c[s];d&&r.push({entityId:s,state:d,deviceId:((p=(n=a.entities)==null?void 0:n[s])==null?void 0:p.device_id)??null})}return r}const J=new Set(["sensor","binary_sensor","image"]),ye=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),Q={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},ve=new RegExp(`ptz.*_(${Object.keys(Q).join("|")})$`,"i");function xe(t){var o;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],settings:[],ptz:[],updates:[],others:[],diagnostics:[]};for(const i of t){const{entityId:r,state:l}=i,c=r.split(".")[0],n=((o=l.attributes)==null?void 0:o.device_class)??"",p=l.state;if(c==="light")e.lights.push(i);else if(c==="climate")e.climate.push(i);else if(c==="camera")e.cameras.push(i);else if(c==="update"&&p!=="unavailable")e.updates.push(i);else if(c==="sensor"&&n==="temperature")e.temperatures.push(i);else if(c==="sensor"&&n==="humidity")e.humidities.push(i);else if(c==="sensor"&&ye.has(n))e.weathers.push(i);else if(c==="binary_sensor"&&n==="motion")e.motions.push(i);else if(c==="binary_sensor"&&n==="occupancy")e.occupancy.push(i);else if(c==="binary_sensor"&&n==="smoke")e.smokes.push(i);else if(c==="binary_sensor"&&n==="gas")e.gases.push(i);else if(c==="binary_sensor"&&n==="moisture")e.moistures.push(i);else if(c==="sensor"&&n==="battery"&&p!=="unavailable")e.batteries.push(i),e.others.push(i);else if(p==="unavailable"||c==="binary_sensor"&&["problem","tamper","safety"].includes(n)&&p==="on")e.problems.push(i);else if(c==="siren")e.controls.push(i);else if(c==="button"){const s=r.match(ve);s?e.ptz.push({...i,direction:Q[s[1].toLowerCase()]}):e.controls.push(i)}else e.others.push(i)}const a=new Set(e.cameras.map(i=>i.deviceId).filter(Boolean));if(a.size){const i=[],r=[];for(const l of e.others){const c=l.entityId.split(".")[0],n=l.deviceId&&a.has(l.deviceId);n&&!J.has(c)?e.settings.push(l):n&&J.has(c)?r.push(l):i.push(l)}r.length>1?e.diagnostics.push(...r):i.push(...r),e.others=i}return e}const R=`
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

  /* Dense series (.dense, see DOT_MAX_POINTS in sparkline.js) render with no
     permanent per-point dot — avoids scalloping a downsampled curve — so
     hovering the (otherwise invisible) hit-target is the only cue a point
     is there. Paint it on hover as the interaction affordance. Sparse
     series already have their own always-visible, series-colored dot, so
     this rule is scoped to .dense only — otherwise hover would repaint that
     dot an unrelated accent color. CSS wins over the inline
     fill="transparent" attribute regardless of specificity, since
     presentation attributes always lose to author stylesheet rules. */
  .chart-hit-layer.dense circle:hover {
    fill: var(--room-accent-color, var(--primary-color, #03a9f4));
  }

  .chart-stat, .chart-threshold {
    position: absolute;
    font-weight: 600;
    color: var(--secondary-text-color, #888);
    opacity: 0.95;
    background: rgba(0,0,0,0.34);
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
    margin-bottom: 10px;
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
`;function ee(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,o)=>a+o,0)/e.length:null}function L(t){return t.some(e=>e.state.state==="on")}function $e(t){return t.filter(e=>e.state.state==="on")}function we(t){let e=null;for(const a of t){const o=parseFloat(a.state.state);isNaN(o)||(!e||o<e.value)&&(e={value:o,entityId:a.entityId,state:a.state})}return e}function _e(t){var e;for(const a of t){const o=(e=a.state.attributes)==null?void 0:e.rgb_color;if(o)return`rgb(${o.join(",")})`}return null}const ke=/_(max|gust|peak)$/i;function D(t,e){var o;return(((o=e.attributes)==null?void 0:o.friendly_name)??t.split(".")[1]).split(" ").pop()}function I(t){const e=new Map;for(const o of t)e.set(o.label,(e.get(o.label)??0)+1);if(![...e.values()].some(o=>o>1))return t;const a=o=>o.fullName.trim().split(/\s+/);return t.map(o=>{if(e.get(o.label)===1)return o;const i=a(o);for(let r=2;r<=i.length;r++){const l=i.slice(-r).join(" ");if(!t.some(n=>n!==o&&a(n).slice(-r).join(" ")===l))return{...o,label:l}}return{...o,label:o.entityId.split(".")[1]}})}function N(t,e){var l,c;if((l=e.attributes)!=null&&l.icon)return e.attributes.icon;const a=t.split(".")[0],o=((c=e.attributes)==null?void 0:c.device_class)??"",i=P.has(e.state),r=n=>typeof n=="string"?n:i?n.on:n.off;return a==="sensor"&&o==="battery"?te(parseFloat(e.state)):o==="wind_speed"&&ke.test(t)?fe:o&&V[o]?r(V[o]):K[a]?r(K[a]):"mdi:help-circle-outline"}function te(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function C(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function Se(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function ae(t,e,a){const o=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,i=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:o,max:i,range:i-o}}function Ce(t,e=150){if(t.length<=e)return t.map((r,l)=>({value:r,index:l}));const a=Math.floor(e/2),o=t.length/a,i=[];for(let r=0;r<a;r++){const l=Math.floor(r*o),c=r===a-1?t.length:Math.floor((r+1)*o);if(l>=c)continue;let n=-1,p=-1;for(let s=l;s<c;s++)Number.isFinite(t[s])&&((n===-1||t[s]<t[n])&&(n=s),(p===-1||t[s]>t[p])&&(p=s));if(n===-1)i.push({value:t[l],index:l});else if(n===p)i.push({value:t[n],index:n});else{const[s,d]=n<p?[n,p]:[p,n];i.push({value:t[s],index:s},{value:t[d],index:d})}}return i}const Ee=40;function Ae(t,e,a=null,o=""){if(!(t!=null&&t.length)||t.length<2)return"";const i=300,r=60,l=Math.min(...t),c=Math.max(...t),{min:n,range:p}=ae(a,l,c);if(p===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return"";const s=p||1,d=Ce(t),f=t.length,b=d.map(g=>g.index/(f-1)*i),$=d.map(g=>r-(g.value-n)/s*r),k=`${b.map((g,S)=>`${S?"L":"M"}${g.toFixed(1)},${$[S].toFixed(1)}`).join(" ")} V${r} H0 Z`,A=d.length>Ee,m=A?"":b.map((g,S)=>`<circle cx="${g.toFixed(1)}" cy="${$[S].toFixed(1)}" r="1.5" fill="${e}"/>`).join(""),G=i/(b.length-1),w=Math.min(4,G/2).toFixed(1),y=b.map((g,S)=>Number.isFinite(d[S].value)?`<circle cx="${g.toFixed(1)}" cy="${$[S].toFixed(1)}" r="${w}" fill="transparent"><title>${d[S].value.toFixed(1)}${o}</title></circle>`:"").join(""),B=`<svg class="chart-hit-layer${A?" dense":""}" viewBox="0 0 ${i} ${r}" preserveAspectRatio="none" aria-hidden="true">${y}</svg>`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null)))return ie(i,r,`<path d="${k}" fill="${e}"/>${m}`)+B;const W=a.color??"rgba(3, 169, 244, 0.12)",O=a.color_high??"rgba(244, 67, 54, 0.25)",T=a.color_low??"rgba(33, 150, 243, 0.25)",j=g=>Math.max(0,Math.min(r,r-(g-n)/s*r)),U=`<defs><clipPath id="sg-cp"><path d="${k}"/></clipPath></defs>`;let z=`<path d="${k}" fill="${W}"/>`;if(a.threshold_high!=null){const g=j(a.threshold_high);g>0&&(z+=`<rect x="0" y="0" width="${i}" height="${g.toFixed(1)}" fill="${O}" clip-path="url(#sg-cp)"/>`),g>0&&g<r&&(z+=`<line x1="0" y1="${g.toFixed(1)}" x2="${i}" y2="${g.toFixed(1)}" stroke="${O}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}if(a.threshold_low!=null){const g=j(a.threshold_low);g<r&&(z+=`<rect x="0" y="${g.toFixed(1)}" width="${i}" height="${(r-g).toFixed(1)}" fill="${T}" clip-path="url(#sg-cp)"/>`),g>0&&g<r&&(z+=`<line x1="0" y1="${g.toFixed(1)}" x2="${i}" y2="${g.toFixed(1)}" stroke="${T}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}return ie(i,r,U+z+m)+B}function ie(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function ze(t,e,a=null,o={}){var W,O,T,j,U,z,g,S,re,oe,ne,se,le,ce;const i=e.area,r=(W=t.areas)==null?void 0:W[i];if(!r&&!e.name&&!((O=e.entities)!=null&&O.length))return{error:i??"(no area)"};const l=(T=e.entities)!=null&&T.length?[]:X(t,i),c=me(l,e,t),n=xe(c),p=$e(n.lights),s=_e(p),d=ee(n.temperatures),f=ee(n.humidities),b=n.climate[0]??null,[$,E]=ge[(j=b==null?void 0:b.state)==null?void 0:j.state]??[null,null],k=e.mold_threshold??70,A=e.navigate_to||((U=e.tap_action)==null?void 0:U.navigation_path)||null,m=e.history_chart??null,G=e.battery_low_threshold??20,w=we(n.batteries),y=n.cameras[0]??null,B=n.cameras.slice(1),M=n.updates.filter(u=>u.state.state==="on");return{areaName:e.name||(r==null?void 0:r.name)||i||"",cardIcon:e.icon||(r==null?void 0:r.icon)||"mdi:home",navPath:A,hasLights:n.lights.length>0,lightCount:p.length,offlineLights:n.lights.filter(u=>u.state.state==="unavailable").length,lightColor:s,occupied:L(n.motions)||L(n.occupancy),hasOccupancySensors:n.motions.length>0||n.occupancy.length>0,problemCount:n.problems.length,showBatteryBadge:w!=null&&w.value<=G,batteryValue:(w==null?void 0:w.value)??null,batteryIcon:w?te(w.value):null,batteryEntity:(w==null?void 0:w.entityId)??null,batteryTitle:w?`${n.batteries.length>1?`Lowest of ${n.batteries.length} — `:""}${((z=w.state.attributes)==null?void 0:z.friendly_name)??w.entityId}: ${w.value}%`:"",tempVal:d,humVal:f,tempUnit:((S=(g=n.temperatures[0])==null?void 0:g.state.attributes)==null?void 0:S.unit_of_measurement)??"°C",tempEntities:n.temperatures,humEntities:n.humidities,climate:b,climIcon:$,climColor:E,smokeOn:L(n.smokes),gasOn:L(n.gases),waterOn:L(n.moistures),moldRisk:f!==null&&f>=k,updateCount:M.length,updateEntity:((re=M[0])==null?void 0:re.entityId)??null,updateTitle:M.length?`${M.length} update${M.length!==1?"s":""} available: ${M.map(u=>{var h;return((h=u.state.attributes)==null?void 0:h.friendly_name)??u.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!y,cameraEntity:(y==null?void 0:y.entityId)??null,cameraImage:((oe=y==null?void 0:y.state.attributes)==null?void 0:oe.entity_picture)??null,cameraIcon:y?N(y.entityId,y.state):null,cameraTitle:((ne=y==null?void 0:y.state.attributes)==null?void 0:ne.friendly_name)??(y==null?void 0:y.entityId)??"",cameraState:(y==null?void 0:y.state.state)??"",cameraOffline:(y==null?void 0:y.state.state)==="unavailable",controlItems:e.show_entities!==!1?I(n.controls.map(({entityId:u,state:h})=>{var v,x,_;return{entityId:u,domain:u.split(".")[0],isActive:P.has(h.state),icon:N(u,h),label:((v=e.entity_labels)==null?void 0:v[u])??D(u,h),fullName:((x=h.attributes)==null?void 0:x.friendly_name)??u,title:`${((_=h.attributes)==null?void 0:_.friendly_name)??u} — ${h.state}`}})):[],settingsItems:e.show_entities!==!1?I(n.settings.map(({entityId:u,state:h})=>{var v,x,_;return{entityId:u,domain:u.split(".")[0],isActive:P.has(h.state),icon:N(u,h),label:((v=e.entity_labels)==null?void 0:v[u])??D(u,h),fullName:((x=h.attributes)==null?void 0:x.friendly_name)??u,title:`${((_=h.attributes)==null?void 0:_.friendly_name)??u} — ${h.state}`}})):[],collapsibleControls:e.collapsible_controls!==!1,controlsCollapsed:e.collapsible_controls!==!1&&!!o.controls,settingsCollapsed:e.collapsible_controls!==!1&&!!o.settings,diagnosticsCollapsed:e.collapsible_controls!==!1&&!!o.diagnostics,ptzItems:e.show_entities!==!1?n.ptz.map(({entityId:u,state:h,direction:v})=>{var x;return{entityId:u,direction:v,icon:be[v],title:((x=h.attributes)==null?void 0:x.friendly_name)??u}}):[],weatherItems:e.show_entities!==!1?n.weathers.map(({entityId:u,state:h})=>{var de,pe,ue;const v=parseFloat(h.state),x=((de=h.attributes)==null?void 0:de.unit_of_measurement)??"",_=((pe=h.attributes)==null?void 0:pe.device_class)??"";return{entityId:u,dc:_,icon:N(u,h),value:isNaN(v)?h.state:v.toFixed(1),unit:x,title:`${((ue=h.attributes)==null?void 0:ue.friendly_name)??u} — ${h.state}${x}`}}):[],diagnosticsItems:e.show_entities!==!1?I(n.diagnostics.map(({entityId:u,state:h})=>{var v,x,_;return{entityId:u,icon:N(u,h),label:((v=e.entity_labels)==null?void 0:v[u])??D(u,h),fullName:((x=h.attributes)==null?void 0:x.friendly_name)??u,title:`${((_=h.attributes)==null?void 0:_.friendly_name)??u} — ${h.state}`}})):[],historyPoints:m!=null&&m.entity_id?a:null,historyColor:(m==null?void 0:m.color)??"rgba(3, 169, 244, 0.2)",historyChart:m,historyMin:m!=null&&m.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a):null,historyMax:m!=null&&m.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a):null,historyUnit:((ce=(le=(se=t.states)==null?void 0:se[m==null?void 0:m.entity_id])==null?void 0:le.attributes)==null?void 0:ce.unit_of_measurement)??"",historyHours:(m==null?void 0:m.hours)??24,chipItems:e.show_entities!==!1?I([...n.others,...B].slice(0,e.max_entities??12).map(({entityId:u,state:h})=>{var v,x,_;return{entityId:u,isActive:P.has(h.state),icon:N(u,h),label:((v=e.entity_labels)==null?void 0:v[u])??D(u,h),fullName:((x=h.attributes)==null?void 0:x.friendly_name)??u,title:`${((_=h.attributes)==null?void 0:_.friendly_name)??u} — ${h.state}`}})):[]}}function Me({areaName:t,cardIcon:e,hasLights:a,lightCount:o,offlineLights:i,occupied:r,hasOccupancySensors:l,problemCount:c,showBatteryBadge:n,batteryValue:p,batteryIcon:s,batteryEntity:d,batteryTitle:f,updateCount:b,updateEntity:$,updateTitle:E}){const k=o===0,A=k?i>0?`${i} light${i!==1?"s":""} offline`:"Lights off":`${o} light${o!==1?"s":""} on${i>0?` · ${i} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${k?"off":""} ${i>0?"has-offline":""}"
               role="button" tabindex="0" aria-label="${A}" title="${A}">
            <ha-icon icon="mdi:lightbulb${k?"-off":""}"></ha-icon>
            ${o>1?`<span>${o}</span>`:""}
          </div>`:""}
        ${l?`<div class="occupancy-dot ${r?"":"idle"}" title="${r?"Occupied":"Not occupied"}"></div>`:""}
        ${Ne({showBatteryBadge:n,batteryValue:p,batteryIcon:s,batteryEntity:d,batteryTitle:f,problemCount:c,updateCount:b,updateEntity:$,updateTitle:E})}
      </div>
    </div>`}function Ne({showBatteryBadge:t,batteryValue:e,batteryIcon:a,batteryEntity:o,batteryTitle:i,problemCount:r,updateCount:l,updateEntity:c,updateTitle:n}){const p=[];return t&&p.push(`
    <span class="group-seg status-seg-battery" data-entity="${o}" role="button" tabindex="0" aria-label="${i}" title="${i}">
      <ha-icon icon="${a}"></ha-icon><span>${e}%</span>
    </span>`),r>0&&p.push(`
    <span class="group-seg status-seg-problem" title="${r} problem${r!==1?"s":""}">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>${r>1?`<span>${r}</span>`:""}
    </span>`),l>0&&p.push(`
    <span class="group-seg status-seg-update" data-entity="${c}" role="button" tabindex="0" aria-label="${n}" title="${n}">
      <ha-icon icon="mdi:package-up"></ha-icon>${l>1?`<span>${l}</span>`:""}
    </span>`),p.length?`<div class="chip group-chip status-cluster" title="Alerts">${p.join("")}</div>`:""}function Le({tempVal:t,humVal:e,tempUnit:a,tempEntities:o,humEntities:i,climate:r,climIcon:l,climColor:c}){var d,f,b,$,E,k,A,m;if(t===null&&e===null&&!l)return"";const n=o.length>1?`Avg of ${o.length} sensors`:((f=(d=o[0])==null?void 0:d.state.attributes)==null?void 0:f.friendly_name)??"",p=i.length>1?`Avg of ${i.length} sensors`:(($=(b=i[0])==null?void 0:b.state.attributes)==null?void 0:$.friendly_name)??"",s=((E=r==null?void 0:r.state.attributes)==null?void 0:E.friendly_name)??(r==null?void 0:r.entityId)??"";return`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((k=o[0])==null?void 0:k.entityId)??""}"
             role="button" tabindex="0" aria-label="${n}" title="${n}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((A=i[0])==null?void 0:A.entityId)??""}"
             role="button" tabindex="0" aria-label="${p}" title="${p}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${l?`
        <div class="env-chip climate"
             style="--climate-color: ${c}"
             data-entity="${r.entityId}"
             role="button" tabindex="0" aria-label="${s}" title="${s}">
          <ha-icon icon="${l}"></ha-icon>
          <span>${((m=r.state.attributes)==null?void 0:m.current_temperature)!=null?`${r.state.attributes.current_temperature}°`:r.state.state}</span>
        </div>`:""}
    </div>`}function Y(t,e,a,{sectionKey:o,collapsible:i,collapsed:r}={}){return a?i?`
    <div class="group-section${r?" collapsed":""}">
      <span class="group-label ${e} clickable" data-section="${o}"
        role="button" tabindex="0" title="${r?"Expand":"Collapse"} ${t.toLowerCase()}">
        ${t}<ha-icon class="group-toggle" icon="mdi:chevron-${r?"down":"up"}"></ha-icon>
      </span>
      <div class="group-pill">${a}</div>
    </div>`:`<div class="group-section"><span class="group-label ${e}">${t}</span>${a}</div>`:""}function Fe({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip">
      ${t.map(({entityId:e,dc:a,icon:o,value:i,unit:r,title:l})=>`
        <span class="group-seg weather-seg" data-entity="${e}" data-dc="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${o}"></ha-icon>
          <span class="group-seg-value">${i}${r?" "+r:""}</span>
        </span>`).join("")}
    </div>`:""}function Oe({diagnosticsItems:t}){return t.length?`
    <div class="chip group-chip diagnostics-chip">
      ${t.map(({entityId:e,icon:a,label:o,title:i})=>`
        <span class="group-seg diagnostics-seg" data-entity="${e}" role="button" tabindex="0" aria-label="${i}" title="${i}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="seg-label">${o}</span>
        </span>`).join("")}
    </div>`:""}function Te({chipItems:t,weatherItems:e,diagnosticsItems:a,collapsibleControls:o,diagnosticsCollapsed:i}){const r=Y("Weather","group-label-weather",Fe({weatherItems:e})),l=Y("Diagnostics","group-label-diagnostics",Oe({diagnosticsItems:a}),{sectionKey:"diagnostics",collapsible:o,collapsed:i});return!t.length&&!r&&!l?"":`
    ${r}
    ${l}
    ${t.length?`
      <div class="entity-chips">
        ${t.map(({entityId:c,isActive:n,icon:p,label:s,title:d})=>`
          <div class="chip${n?" on":""}" data-entity="${c}" role="button" tabindex="0" aria-label="${d}" title="${d}">
            <ha-icon icon="${p}"></ha-icon>
            <span class="chip-label">${s}</span>
          </div>`).join("")}
      </div>`:""}`}function je({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:o,cameraTitle:i,cameraState:r,cameraOffline:l}){if(!t)return"";const c=l?`${i} (offline)`:i;return`
    <div class="camera-preview${l?" offline":""}" data-entity="${o}"
         role="button" tabindex="0" aria-label="${c}" title="${c}">
      ${e?`<img src="${e}" alt="${c}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${r==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
    </div>`}function Pe({ptzItems:t}){return t.length?`
    <div class="chip group-chip ptz-chip">
      ${t.map(({entityId:e,direction:a,icon:o,title:i})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" role="button" tabindex="0" aria-label="${i}" title="${i}">
          <ha-icon icon="${o}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function De({controlItems:t}){return t.length?`
    <div class="chip group-chip controls-chip">
      ${t.map(({entityId:e,domain:a,isActive:o,icon:i,label:r,title:l})=>`
        <span class="group-seg control-seg${o?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="seg-label">${r}</span>
        </span>`).join("")}
    </div>`:""}function Ie({settingsItems:t}){return t.length?`
    <div class="chip group-chip settings-chip">
      ${t.map(({entityId:e,domain:a,isActive:o,icon:i,label:r,title:l})=>`
        <span class="group-seg settings-seg${o?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="seg-label">${r}</span>
        </span>`).join("")}
    </div>`:""}function qe({controlItems:t,settingsItems:e,ptzItems:a,collapsibleControls:o,controlsCollapsed:i,settingsCollapsed:r}){if(!t.length&&!e.length&&!a.length)return"";const l=Pe({ptzItems:a})+De({controlItems:t});return`
    ${l?`
      <div class="controls-row${i?" collapsed":""}">
        <span class="controls-label${o?" clickable":""}"
          data-section="controls"
          ${o?`role="button" tabindex="0" title="${i?"Expand":"Collapse"} controls"`:""}
          >Controls${o?`<ha-icon class="controls-toggle" icon="mdi:chevron-${i?"down":"up"}"></ha-icon>`:""}</span>
        <div class="controls-chips">${l}</div>
      </div>`:""}
    ${Y("Settings","group-label-settings",Ie({settingsItems:e}),{sectionKey:"settings",collapsible:o,collapsed:r})}`}function He({smokeOn:t,gasOn:e,waterOn:a,moldRisk:o}){return!t&&!e&&!a&&!o?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${o?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function Be(t){return`
    <style>${R}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function We({historyMin:t,historyMax:e,historyUnit:a,historyHours:o,historyChart:i}){if(t===null)return"";const r=[];if((i==null?void 0:i.threshold_high)!=null||(i==null?void 0:i.threshold_low)!=null){const{min:l,range:c}=ae(i,t,e),n=c||1,p=s=>(1-(s-l)/n)*100;if(i.threshold_high!=null){const s=p(i.threshold_high);s>0&&s<100&&r.push(`<span class="chart-threshold" style="top:${s.toFixed(1)}%">${i.threshold_high.toFixed(1)}${a}</span>`)}if(i.threshold_low!=null){const s=p(i.threshold_low);s>0&&s<100&&r.push(`<span class="chart-threshold" style="top:${s.toFixed(1)}%">${i.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period">${o}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${r.join("")}
    </div>`}function Ue(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",o=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${R}</style>
    <ha-card
      ${o?`class="${o}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?Ae(t.historyPoints,t.historyColor,t.historyChart,t.historyUnit):""}
      ${We(t)}
      <div class="card-content">
        ${je(t)}
        ${Me(t)}
        ${Le(t)}
        ${Te(t)}
        ${qe(t)}
        ${He(t)}
      </div>
    </ha-card>`}function Ye(t,e,a){var i,r;const o=(i=t.activeElement)==null?void 0:i.className;t.innerHTML=a.error?Be(a.error):Ue(a),a.error||Ge(t,e,a),o&&((r=t.querySelector(`.${o.split(" ").join(".")}`))==null||r.focus())}function Ge(t,e,{navPath:a,chipItems:o}){var n,p;a&&t.querySelector("ha-card").addEventListener("click",s=>{!s.target.closest(".chip")&&!s.target.closest(".env-chip")&&!s.target.closest(".badge-lights")&&!s.target.closest(".status-seg-battery")&&!s.target.closest(".status-seg-update")&&!s.target.closest(".camera-preview")&&!s.target.closest(".controls-label.clickable")&&!s.target.closest(".group-label.clickable")&&Se(a)}),t.querySelectorAll('[role="button"][tabindex]').forEach(s=>{s.addEventListener("keydown",d=>{d.key!=="Enter"&&d.key!==" "||(d.preventDefault(),d.stopPropagation(),s.click())})}),t.querySelectorAll(".controls-label.clickable[data-section], .group-label.clickable[data-section]").forEach(s=>{s.addEventListener("click",d=>{d.stopPropagation(),e.toggleSectionCollapsed(s.dataset.section)})}),t.querySelectorAll(".ptz-seg[data-entity]").forEach(s=>{s.addEventListener("click",d=>{var f;d.stopPropagation(),(f=e._hass)!=null&&f.callService?e._hass.callService("button","press",{},{entity_id:s.dataset.entity}):C(e,s.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(s=>{s.addEventListener("click",d=>{d.stopPropagation(),C(e,s.dataset.entity)})}),t.querySelectorAll(".diagnostics-seg[data-entity]").forEach(s=>{s.addEventListener("click",d=>{d.stopPropagation(),C(e,s.dataset.entity)})});const i=t.querySelector(".status-seg-update[data-entity]");i&&i.addEventListener("click",s=>{s.stopPropagation(),C(e,i.dataset.entity)});const r=t.querySelector(".camera-preview[data-entity]");r&&r.addEventListener("click",s=>{s.stopPropagation(),C(e,r.dataset.entity)}),t.querySelectorAll(".control-seg[data-entity]").forEach(s=>{s.addEventListener("click",d=>{var $,E;d.stopPropagation();const f=s.dataset.entity,b=s.dataset.domain;b==="button"&&(($=e._hass)!=null&&$.callService)?e._hass.callService("button","press",{},{entity_id:f}):b==="siren"&&((E=e._hass)!=null&&E.callService)?e._hass.callService("siren","toggle",{},{entity_id:f}):C(e,f)})}),t.querySelectorAll(".settings-seg[data-entity]").forEach(s=>{s.addEventListener("click",d=>{d.stopPropagation(),C(e,s.dataset.entity)})});const l=t.querySelector(".badge-lights");l&&((n=e._config)!=null&&n.area)&&((p=e._hass)!=null&&p.callService)&&l.addEventListener("click",s=>{s.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const c=t.querySelector(".status-seg-battery[data-entity]");c&&c.addEventListener("click",s=>{s.stopPropagation(),C(e,c.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(s=>{const d=s.dataset.entity;d&&s.addEventListener("click",f=>{f.stopPropagation(),C(e,d)})}),t.querySelectorAll(".chip[data-entity]").forEach(s=>{s.addEventListener("click",d=>{d.stopPropagation(),C(e,s.dataset.entity)})})}const q=new Map,H=new Set,F=new Map;function Ze(t,e,a,o,i){var n;const r=(n=i==null?void 0:i._config)==null?void 0:n.debug,l=`${e}:${a}:${Math.floor(Date.now()/3e5)}`;if(q.has(l))return r&&console.debug("[hass-omnibus-card] history cache hit",{key:l,points:q.get(l).length}),q.get(l);if(H.has(l))return r&&console.debug("[hass-omnibus-card] history fetch pending, queuing callback",{key:l}),F.get(l).set(i,o),null;if(!(t!=null&&t.callWS))return r&&console.debug("[hass-omnibus-card] history skipped — no callWS",{entityId:e}),null;r&&console.debug("[hass-omnibus-card] history fetch start",{key:l,entityId:e,hours:a}),H.add(l),F.set(l,new Map([[i,o]]));const c=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:c,minimal_response:!0,no_attributes:!0}).then(p=>{const s=Array.isArray(p==null?void 0:p[e])?p[e]:[],d=s.map(b=>parseFloat(b.s??b.state)).filter(b=>!isNaN(b));r&&console.debug("[hass-omnibus-card] history fetch done",{key:l,rawCount:s.length,pointCount:d.length}),q.set(l,d),H.delete(l);const f=F.get(l);F.delete(l),f==null||f.forEach(b=>b(d))}).catch(p=>{r&&console.debug("[hass-omnibus-card] history fetch error",{key:l,error:p}),H.delete(l),F.delete(l)}),null}class Ve extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._collapsed=null}setConfig(e){var o;if(!(e!=null&&e.area)&&!((o=e==null?void 0:e.entities)!=null&&o.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null;const a=e.controls_collapsed!==!1;this._collapsed={controls:a,settings:a,diagnostics:a},this._hass&&this._update()}toggleSectionCollapsed(e){this._collapsed[e]=!this._collapsed[e],this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var o,i,r,l;if(!this._hass||!this._config)return"";let e;if((o=this._config.entities)!=null&&o.length)e=this._config.entities.map(c=>{var n;return{entityId:c,state:(n=this._hass.states)==null?void 0:n[c]}}).filter(c=>c.state);else{e=X(this._hass,this._config.area);for(const c of this._config.add_entities??[])if(!e.some(n=>n.entityId===c)){const n=(i=this._hass.states)==null?void 0:i[c];n&&e.push({entityId:c,state:n})}}const a=(r=this._config.history_chart)==null?void 0:r.entity_id;if(a&&!e.some(c=>c.entityId===a)){const c=(l=this._hass.states)==null?void 0:l[a];c&&e.push({entityId:a,state:c})}return e.map(({entityId:c,state:n})=>{var p,s,d;return`${c}=${n.state}|${((p=n.attributes)==null?void 0:p.rgb_color)??""}|${((s=n.attributes)==null?void 0:s.current_temperature)??""}|${((d=n.attributes)==null?void 0:d.entity_picture)??""}`}).sort().join(";")}_update(){var i,r;let e=null;const a=(i=this._config)==null?void 0:i.history_chart;a!=null&&a.entity_id&&(e=Ze(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const o=ze(this._hass,this._config,e,this._collapsed);(r=this._config)!=null&&r.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:o}),Ye(this.shadowRoot,this,o)}}window.customCards=window.customCards||[],window.customCards.push({type:Z,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${he} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(Z,Ve)})();
