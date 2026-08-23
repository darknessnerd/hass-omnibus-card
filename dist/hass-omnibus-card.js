(function(){"use strict";const q="hass-omnibus-card",ce="1.20.0",j=new Set(["on","open","playing","home","unlocked"]),de={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},B={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high"},pe="mdi:weather-windy-variant",W={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"},he={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"};function U(t,e){const{entities:a={},devices:n={},states:i={}}=t;return Object.keys(i).reduce((r,l)=>{var d;const s=a[l];if(!s||s.hidden_by)return r;const o=s.area_id===e,p=s.device_id&&((d=n[s.device_id])==null?void 0:d.area_id)===e;return(o||p)&&r.push({entityId:l,state:i[l],deviceId:s.device_id??null}),r},[])}function ue(t,e,a){var l,s,o,p;if((l=e.entities)!=null&&l.length)return e.entities.map(d=>{var u,h,v;const c=(u=a.states)==null?void 0:u[d];return c?{entityId:d,state:c,deviceId:((v=(h=a.entities)==null?void 0:h[d])==null?void 0:v.device_id)??null}:null}).filter(Boolean);const n=new Set(e.exclude_entities??[]),i=e.add_entities??[],r=t.filter(d=>!n.has(d.entityId));for(const d of i){if(r.some(u=>u.entityId===d))continue;const c=(s=a.states)==null?void 0:s[d];c&&r.push({entityId:d,state:c,deviceId:((p=(o=a.entities)==null?void 0:o[d])==null?void 0:p.device_id)??null})}return r}const ge=new Set(["sensor","binary_sensor","image"]),fe=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),Y={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},me=new RegExp(`ptz.*_(${Object.keys(Y).join("|")})$`,"i");function be(t){var n;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],ptz:[],updates:[],others:[]};for(const i of t){const{entityId:r,state:l}=i,s=r.split(".")[0],o=((n=l.attributes)==null?void 0:n.device_class)??"",p=l.state;if(s==="light")e.lights.push(i);else if(s==="climate")e.climate.push(i);else if(s==="camera")e.cameras.push(i);else if(s==="update"&&p!=="unavailable")e.updates.push(i);else if(s==="sensor"&&o==="temperature")e.temperatures.push(i);else if(s==="sensor"&&o==="humidity")e.humidities.push(i);else if(s==="sensor"&&fe.has(o))e.weathers.push(i);else if(s==="binary_sensor"&&o==="motion")e.motions.push(i);else if(s==="binary_sensor"&&o==="occupancy")e.occupancy.push(i);else if(s==="binary_sensor"&&o==="smoke")e.smokes.push(i);else if(s==="binary_sensor"&&o==="gas")e.gases.push(i);else if(s==="binary_sensor"&&o==="moisture")e.moistures.push(i);else if(s==="sensor"&&o==="battery"&&p!=="unavailable")e.batteries.push(i),e.others.push(i);else if(p==="unavailable"||s==="binary_sensor"&&["problem","tamper","safety"].includes(o)&&p==="on")e.problems.push(i);else if(s==="siren")e.controls.push(i);else if(s==="button"){const d=r.match(me);d?e.ptz.push({...i,direction:Y[d[1].toLowerCase()]}):e.controls.push(i)}else e.others.push(i)}const a=new Set(e.cameras.map(i=>i.deviceId).filter(Boolean));if(a.size){const i=[];for(const r of e.others){const l=r.entityId.split(".")[0];r.deviceId&&a.has(r.deviceId)&&!ge.has(l)?e.controls.push(r):i.push(r)}e.others=i}return e}const Z=`
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

  /* Dense series render with no permanent per-point dot (see DOT_MAX_POINTS
     in sparkline.js — avoids scalloping a downsampled curve), so hovering
     the (otherwise invisible) hit-target is the only cue a point is there.
     Paint it on hover as the interaction affordance. CSS wins over the
     inline fill="transparent" attribute regardless of specificity, since
     presentation attributes always lose to author stylesheet rules. */
  .chart-hit-layer circle:hover {
    fill: var(--room-accent-color, var(--primary-color, #03a9f4));
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

  /* Weather segments: color-tint icons by device_class (same idea as .env-chip.temp/.hum)
     and a hairline divider so the packed pill reads as distinct readings, not one blob. */
  .weather-seg:not(:last-child) {
    border-right: 1px solid var(--divider-color, rgba(128, 128, 128, 0.25));
  }

  .weather-seg[data-dc="wind_speed"] ha-icon     { color: #546e7a; }
  .weather-seg[data-dc="precipitation"] ha-icon  { color: #0288d1; }
  .weather-seg[data-dc="illuminance"] ha-icon    { color: #f9a825; }
  .weather-seg[data-dc="sound_pressure"] ha-icon { color: #8e24aa; }

  .group-seg:hover ha-icon { color: white; }

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
`;function G(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,n)=>a+n,0)/e.length:null}function z(t){return t.some(e=>e.state.state==="on")}function ye(t){return t.filter(e=>e.state.state==="on")}function ve(t){let e=null;for(const a of t){const n=parseFloat(a.state.state);isNaN(n)||(!e||n<e.value)&&(e={value:n,entityId:a.entityId,state:a.state})}return e}function xe(t){var e;for(const a of t){const n=(e=a.state.attributes)==null?void 0:e.rgb_color;if(n)return`rgb(${n.join(",")})`}return null}const _e=/_(max|gust|peak)$/i;function V(t,e){var n;return(((n=e.attributes)==null?void 0:n.friendly_name)??t.split(".")[1]).split(" ").pop()}function L(t,e){var l,s;if((l=e.attributes)!=null&&l.icon)return e.attributes.icon;const a=t.split(".")[0],n=((s=e.attributes)==null?void 0:s.device_class)??"",i=j.has(e.state),r=o=>typeof o=="string"?o:i?o.on:o.off;return a==="sensor"&&n==="battery"?X(parseFloat(e.state)):n==="wind_speed"&&_e.test(t)?pe:n&&B[n]?r(B[n]):W[a]?r(W[a]):"mdi:help-circle-outline"}function X(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function C(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function $e(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function J(t,e,a){const n=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,i=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:n,max:i,range:i-n}}function we(t,e=150){if(t.length<=e)return t.map((r,l)=>({value:r,index:l}));const a=Math.ceil(e/2),n=t.length/a,i=[];for(let r=0;r<a;r++){const l=Math.floor(r*n),s=r===a-1?t.length:Math.floor((r+1)*n);if(l>=s)continue;let o=l,p=l;for(let d=l+1;d<s;d++)t[d]<t[o]&&(o=d),t[d]>t[p]&&(p=d);if(o===p)i.push({value:t[o],index:o});else{const[d,c]=o<p?[o,p]:[p,o];i.push({value:t[d],index:d},{value:t[c],index:c})}}return i}const ke=40;function Ce(t,e,a=null,n=""){if(!(t!=null&&t.length)||t.length<2)return"";const i=300,r=60,l=Math.min(...t),s=Math.max(...t),{min:o,range:p}=J(a,l,s);if(p===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return"";const d=p||1,c=we(t),u=t.length,h=c.map(g=>g.index/(u-1)*i),v=c.map(g=>r-(g.value-o)/d*r),_=`${h.map((g,$)=>`${$?"L":"M"}${g.toFixed(1)},${v[$].toFixed(1)}`).join(" ")} V${r} H0 Z`,I=c.length>ke?"":h.map((g,$)=>`<circle cx="${g.toFixed(1)}" cy="${v[$].toFixed(1)}" r="1.5" fill="${e}"/>`).join(""),y=i/(h.length-1),D=Math.min(4,y/2).toFixed(1),x=h.map((g,$)=>Number.isFinite(c[$].value)?`<circle cx="${g.toFixed(1)}" cy="${v[$].toFixed(1)}" r="${D}" fill="transparent"><title>${c[$].value.toFixed(1)}${n}</title></circle>`:"").join(""),f=`<svg class="chart-hit-layer" viewBox="0 0 ${i} ${r}" preserveAspectRatio="none" aria-hidden="true">${x}</svg>`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null)))return K(i,r,`<path d="${_}" fill="${e}"/>${I}`)+f;const S=a.color??"rgba(3, 169, 244, 0.12)",M=a.color_high??"rgba(244, 67, 54, 0.25)",F=a.color_low??"rgba(33, 150, 243, 0.25)",O=g=>Math.max(0,Math.min(r,r-(g-o)/d*r)),P=`<defs><clipPath id="sg-cp"><path d="${_}"/></clipPath></defs>`;let E=`<path d="${_}" fill="${S}"/>`;if(a.threshold_high!=null){const g=O(a.threshold_high);g>0&&(E+=`<rect x="0" y="0" width="${i}" height="${g.toFixed(1)}" fill="${M}" clip-path="url(#sg-cp)"/>`),g>0&&g<r&&(E+=`<line x1="0" y1="${g.toFixed(1)}" x2="${i}" y2="${g.toFixed(1)}" stroke="${M}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}if(a.threshold_low!=null){const g=O(a.threshold_low);g<r&&(E+=`<rect x="0" y="${g.toFixed(1)}" width="${i}" height="${(r-g).toFixed(1)}" fill="${F}" clip-path="url(#sg-cp)"/>`),g>0&&g<r&&(E+=`<line x1="0" y1="${g.toFixed(1)}" x2="${i}" y2="${g.toFixed(1)}" stroke="${F}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}return K(i,r,P+E+I)+f}function K(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function Se(t,e,a=null,n=!1){var M,F,O,P,E,g,$,R,ee,te,ae,ie,re,oe;const i=e.area,r=(M=t.areas)==null?void 0:M[i];if(!r&&!e.name&&!((F=e.entities)!=null&&F.length))return{error:i??"(no area)"};const l=(O=e.entities)!=null&&O.length?[]:U(t,i),s=ue(l,e,t),o=be(s),p=ye(o.lights),d=xe(p),c=G(o.temperatures),u=G(o.humidities),h=o.climate[0]??null,[v,k]=de[(P=h==null?void 0:h.state)==null?void 0:P.state]??[null,null],_=e.mold_threshold??70,I=e.navigate_to||((E=e.tap_action)==null?void 0:E.navigation_path)||null,y=e.history_chart??null,D=e.battery_low_threshold??20,x=ve(o.batteries),f=o.cameras[0]??null,Q=o.cameras.slice(1),S=o.updates.filter(m=>m.state.state==="on");return{areaName:e.name||(r==null?void 0:r.name)||i||"",cardIcon:e.icon||(r==null?void 0:r.icon)||"mdi:home",navPath:I,hasLights:o.lights.length>0,lightCount:p.length,offlineLights:o.lights.filter(m=>m.state.state==="unavailable").length,lightColor:d,occupied:z(o.motions)||z(o.occupancy),hasOccupancySensors:o.motions.length>0||o.occupancy.length>0,problemCount:o.problems.length,showBatteryBadge:x!=null&&x.value<=D,batteryValue:(x==null?void 0:x.value)??null,batteryIcon:x?X(x.value):null,batteryEntity:(x==null?void 0:x.entityId)??null,batteryTitle:x?`${o.batteries.length>1?`Lowest of ${o.batteries.length} — `:""}${((g=x.state.attributes)==null?void 0:g.friendly_name)??x.entityId}: ${x.value}%`:"",tempVal:c,humVal:u,tempUnit:((R=($=o.temperatures[0])==null?void 0:$.state.attributes)==null?void 0:R.unit_of_measurement)??"°C",tempEntities:o.temperatures,humEntities:o.humidities,climate:h,climIcon:v,climColor:k,smokeOn:z(o.smokes),gasOn:z(o.gases),waterOn:z(o.moistures),moldRisk:u!==null&&u>=_,updateCount:S.length,updateEntity:((ee=S[0])==null?void 0:ee.entityId)??null,updateTitle:S.length?`${S.length} update${S.length!==1?"s":""} available: ${S.map(m=>{var b;return((b=m.state.attributes)==null?void 0:b.friendly_name)??m.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!f,cameraEntity:(f==null?void 0:f.entityId)??null,cameraImage:((te=f==null?void 0:f.state.attributes)==null?void 0:te.entity_picture)??null,cameraIcon:f?L(f.entityId,f.state):null,cameraTitle:((ae=f==null?void 0:f.state.attributes)==null?void 0:ae.friendly_name)??(f==null?void 0:f.entityId)??"",cameraState:(f==null?void 0:f.state.state)??"",cameraOffline:(f==null?void 0:f.state.state)==="unavailable",controlItems:e.show_entities!==!1?o.controls.map(({entityId:m,state:b})=>{var w;return{entityId:m,domain:m.split(".")[0],isActive:j.has(b.state),icon:L(m,b),label:V(m,b),title:`${((w=b.attributes)==null?void 0:w.friendly_name)??m} — ${b.state}`}}):[],collapsibleControls:e.collapsible_controls!==!1,controlsCollapsed:e.collapsible_controls!==!1&&n,ptzItems:e.show_entities!==!1?o.ptz.map(({entityId:m,state:b,direction:w})=>{var T;return{entityId:m,direction:w,icon:he[w],title:((T=b.attributes)==null?void 0:T.friendly_name)??m}}):[],weatherItems:e.show_entities!==!1?o.weathers.map(({entityId:m,state:b})=>{var ne,se,le;const w=parseFloat(b.state),T=((ne=b.attributes)==null?void 0:ne.unit_of_measurement)??"",Be=((se=b.attributes)==null?void 0:se.device_class)??"";return{entityId:m,dc:Be,icon:L(m,b),value:isNaN(w)?b.state:w.toFixed(1),unit:T,title:`${((le=b.attributes)==null?void 0:le.friendly_name)??m} — ${b.state}${T}`}}):[],historyPoints:y!=null&&y.entity_id?a:null,historyColor:(y==null?void 0:y.color)??"rgba(3, 169, 244, 0.12)",historyChart:y,historyMin:y!=null&&y.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a):null,historyMax:y!=null&&y.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a):null,historyUnit:((oe=(re=(ie=t.states)==null?void 0:ie[y==null?void 0:y.entity_id])==null?void 0:re.attributes)==null?void 0:oe.unit_of_measurement)??"",historyHours:(y==null?void 0:y.hours)??24,chipItems:e.show_entities!==!1?[...o.others,...Q].slice(0,e.max_entities??6).map(({entityId:m,state:b})=>{var w;return{entityId:m,isActive:j.has(b.state),icon:L(m,b),label:V(m,b),title:`${((w=b.attributes)==null?void 0:w.friendly_name)??m} — ${b.state}`}}):[]}}function Ee({areaName:t,cardIcon:e,hasLights:a,lightCount:n,offlineLights:i,occupied:r,hasOccupancySensors:l,problemCount:s,showBatteryBadge:o,batteryValue:p,batteryIcon:d,batteryEntity:c,batteryTitle:u,updateCount:h,updateEntity:v,updateTitle:k}){const _=n===0,I=_?i>0?`${i} light${i!==1?"s":""} offline`:"Lights off":`${n} light${n!==1?"s":""} on${i>0?` · ${i} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${_?"off":""} ${i>0?"has-offline":""}"
               title="${I}">
            <ha-icon icon="mdi:lightbulb${_?"-off":""}"></ha-icon>
            ${n>1?`<span>${n}</span>`:""}
          </div>`:""}
        ${l?`<div class="occupancy-dot ${r?"":"idle"}" title="${r?"Occupied":"Not occupied"}"></div>`:""}
        ${o?`
          <div class="badge badge-battery"
               data-entity="${c}"
               title="${u}">
            <ha-icon icon="${d}"></ha-icon>
            <span>${p}%</span>
          </div>`:""}
        ${s>0?`
          <div class="badge badge-problems"
               title="${s} problem${s!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${s>1?`<span>${s}</span>`:""}
          </div>`:""}
        ${h>0?`
          <div class="badge badge-update"
               data-entity="${v}"
               title="${k}">
            <ha-icon icon="mdi:package-up"></ha-icon>
            ${h>1?`<span>${h}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function Ie({tempVal:t,humVal:e,tempUnit:a,tempEntities:n,humEntities:i,climate:r,climIcon:l,climColor:s}){var o,p,d,c,u,h,v,k;return t===null&&e===null&&!l?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((o=n[0])==null?void 0:o.entityId)??""}"
             title="${n.length>1?`Avg of ${n.length} sensors`:((d=(p=n[0])==null?void 0:p.state.attributes)==null?void 0:d.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((c=i[0])==null?void 0:c.entityId)??""}"
             title="${i.length>1?`Avg of ${i.length} sensors`:((h=(u=i[0])==null?void 0:u.state.attributes)==null?void 0:h.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${l?`
        <div class="env-chip climate"
             style="--climate-color: ${s}"
             data-entity="${r.entityId}"
             title="${((v=r.state.attributes)==null?void 0:v.friendly_name)??r.entityId}">
          <ha-icon icon="${l}"></ha-icon>
          <span>${((k=r.state.attributes)==null?void 0:k.current_temperature)!=null?`${r.state.attributes.current_temperature}°`:r.state.state}</span>
        </div>`:""}
    </div>`}function ze({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip" title="Weather">
      ${t.map(({entityId:e,dc:a,icon:n,value:i,unit:r,title:l})=>`
        <span class="group-seg weather-seg" data-entity="${e}" data-dc="${a}" title="${l}">
          <ha-icon icon="${n}"></ha-icon>
          <span class="group-seg-value">${i}${r?" "+r:""}</span>
        </span>`).join("")}
    </div>`:""}function Ae({chipItems:t,weatherItems:e}){return!t.length&&!e.length?"":`
    <div class="entity-chips">
      ${ze({weatherItems:e})}
      ${t.map(({entityId:a,isActive:n,icon:i,label:r,title:l})=>`
        <div class="chip${n?" on":""}" data-entity="${a}" title="${l}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="chip-label">${r}</span>
        </div>`).join("")}
    </div>`}function Me({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:n,cameraTitle:i,cameraState:r,cameraOffline:l}){if(!t)return"";const s=l?`${i} (offline)`:i;return`
    <div class="camera-preview${l?" offline":""}" data-entity="${n}" title="${s}">
      ${e?`<img src="${e}" alt="${s}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${r==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
    </div>`}function Fe({ptzItems:t}){return t.length?`
    <div class="chip group-chip control-chip ptz-chip" title="PTZ">
      ${t.map(({entityId:e,direction:a,icon:n,title:i})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" title="${i}">
          <ha-icon icon="${n}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function Oe({controlItems:t,ptzItems:e,collapsibleControls:a,controlsCollapsed:n}){return!t.length&&!e.length?"":`
    <div class="controls-row${n?" collapsed":""}">
      <span class="controls-label${a?" clickable":""}"
        ${a?`role="button" tabindex="0" title="${n?"Expand":"Collapse"} controls"`:""}
        >Controls${a?`<ha-icon class="controls-toggle" icon="mdi:chevron-${n?"down":"up"}"></ha-icon>`:""}</span>
      <div class="controls-chips">
        ${Fe({ptzItems:e})}
        ${t.map(({entityId:i,domain:r,isActive:l,icon:s,label:o,title:p})=>`
          <div class="chip control-chip${l?" on":""}" data-entity="${i}" data-domain="${r}" title="${p}">
            <ha-icon icon="${s}"></ha-icon>
            <span class="chip-label">${o}</span>
          </div>`).join("")}
      </div>
    </div>`}function Te({smokeOn:t,gasOn:e,waterOn:a,moldRisk:n}){return!t&&!e&&!a&&!n?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${n?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function Le(t){return`
    <style>${Z}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function Ne({historyMin:t,historyMax:e,historyUnit:a,historyHours:n,historyChart:i}){if(t===null)return"";const r=[];if((i==null?void 0:i.threshold_high)!=null||(i==null?void 0:i.threshold_low)!=null){const{min:l,range:s}=J(i,t,e),o=s||1,p=d=>(1-(d-l)/o)*100;if(i.threshold_high!=null){const d=p(i.threshold_high);d>0&&d<100&&r.push(`<span class="chart-threshold" style="top:${d.toFixed(1)}%">${i.threshold_high.toFixed(1)}${a}</span>`)}if(i.threshold_low!=null){const d=p(i.threshold_low);d>0&&d<100&&r.push(`<span class="chart-threshold" style="top:${d.toFixed(1)}%">${i.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period">${n}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${r.join("")}
    </div>`}function He(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",n=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${Z}</style>
    <ha-card
      ${n?`class="${n}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?Ce(t.historyPoints,t.historyColor,t.historyChart,t.historyUnit):""}
      ${Ne(t)}
      <div class="card-content">
        ${Me(t)}
        ${Ee(t)}
        ${Ie(t)}
        ${Ae(t)}
        ${Oe(t)}
        ${Te(t)}
      </div>
    </ha-card>`}function Pe(t,e,a){var i,r;const n=(i=t.activeElement)==null?void 0:i.className;t.innerHTML=a.error?Le(a.error):He(a),a.error||je(t,e,a),n&&((r=t.querySelector(`.${n.split(" ").join(".")}`))==null||r.focus())}function je(t,e,{navPath:a,chipItems:n}){var p,d;a&&t.querySelector("ha-card").addEventListener("click",c=>{!c.target.closest(".chip")&&!c.target.closest(".env-chip")&&!c.target.closest(".badge-lights")&&!c.target.closest(".badge-battery")&&!c.target.closest(".badge-update")&&!c.target.closest(".camera-preview")&&!c.target.closest(".controls-label.clickable")&&$e(a)});const i=t.querySelector(".controls-label.clickable");i&&(i.addEventListener("click",c=>{c.stopPropagation(),e.toggleControlsCollapsed()}),i.addEventListener("keydown",c=>{c.key!=="Enter"&&c.key!==" "||(c.preventDefault(),c.stopPropagation(),e.toggleControlsCollapsed())})),t.querySelectorAll(".ptz-seg[data-entity]").forEach(c=>{c.addEventListener("click",u=>{var h;u.stopPropagation(),(h=e._hass)!=null&&h.callService?e._hass.callService("button","press",{},{entity_id:c.dataset.entity}):C(e,c.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(c=>{c.addEventListener("click",u=>{u.stopPropagation(),C(e,c.dataset.entity)})});const r=t.querySelector(".badge-update[data-entity]");r&&r.addEventListener("click",c=>{c.stopPropagation(),C(e,r.dataset.entity)});const l=t.querySelector(".camera-preview[data-entity]");l&&l.addEventListener("click",c=>{c.stopPropagation(),C(e,l.dataset.entity)}),t.querySelectorAll(".control-chip[data-entity]").forEach(c=>{c.addEventListener("click",u=>{var k,_;u.stopPropagation();const h=c.dataset.entity,v=c.dataset.domain;v==="button"&&((k=e._hass)!=null&&k.callService)?e._hass.callService("button","press",{},{entity_id:h}):v==="siren"&&((_=e._hass)!=null&&_.callService)?e._hass.callService("siren","toggle",{},{entity_id:h}):C(e,h)})});const s=t.querySelector(".badge-lights");s&&((p=e._config)!=null&&p.area)&&((d=e._hass)!=null&&d.callService)&&s.addEventListener("click",c=>{c.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const o=t.querySelector(".badge-battery[data-entity]");o&&o.addEventListener("click",c=>{c.stopPropagation(),C(e,o.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(c=>{const u=c.dataset.entity;u&&c.addEventListener("click",h=>{h.stopPropagation(),C(e,u)})}),t.querySelectorAll(".chip[data-entity]:not(.control-chip)").forEach(c=>{c.addEventListener("click",u=>{u.stopPropagation(),C(e,c.dataset.entity)})})}const N=new Map,H=new Set,A=new Map;function De(t,e,a,n,i){var o;const r=(o=i==null?void 0:i._config)==null?void 0:o.debug,l=`${e}:${a}:${Math.floor(Date.now()/3e5)}`;if(N.has(l))return r&&console.debug("[hass-omnibus-card] history cache hit",{key:l,points:N.get(l).length}),N.get(l);if(H.has(l))return r&&console.debug("[hass-omnibus-card] history fetch pending, queuing callback",{key:l}),A.get(l).set(i,n),null;if(!(t!=null&&t.callWS))return r&&console.debug("[hass-omnibus-card] history skipped — no callWS",{entityId:e}),null;r&&console.debug("[hass-omnibus-card] history fetch start",{key:l,entityId:e,hours:a}),H.add(l),A.set(l,new Map([[i,n]]));const s=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:s,minimal_response:!0,no_attributes:!0}).then(p=>{const d=Array.isArray(p==null?void 0:p[e])?p[e]:[],c=d.map(h=>parseFloat(h.s??h.state)).filter(h=>!isNaN(h));r&&console.debug("[hass-omnibus-card] history fetch done",{key:l,rawCount:d.length,pointCount:c.length}),N.set(l,c),H.delete(l);const u=A.get(l);A.delete(l),u==null||u.forEach(h=>h(c))}).catch(p=>{r&&console.debug("[hass-omnibus-card] history fetch error",{key:l,error:p}),H.delete(l),A.delete(l)}),null}class qe extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._controlsCollapsed=null}setConfig(e){var a;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._controlsCollapsed=e.controls_collapsed!==!1,this._hass&&this._update()}toggleControlsCollapsed(){this._controlsCollapsed=!this._controlsCollapsed,this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var n,i,r,l;if(!this._hass||!this._config)return"";let e;if((n=this._config.entities)!=null&&n.length)e=this._config.entities.map(s=>{var o;return{entityId:s,state:(o=this._hass.states)==null?void 0:o[s]}}).filter(s=>s.state);else{e=U(this._hass,this._config.area);for(const s of this._config.add_entities??[])if(!e.some(o=>o.entityId===s)){const o=(i=this._hass.states)==null?void 0:i[s];o&&e.push({entityId:s,state:o})}}const a=(r=this._config.history_chart)==null?void 0:r.entity_id;if(a&&!e.some(s=>s.entityId===a)){const s=(l=this._hass.states)==null?void 0:l[a];s&&e.push({entityId:a,state:s})}return e.map(({entityId:s,state:o})=>{var p,d,c;return`${s}=${o.state}|${((p=o.attributes)==null?void 0:p.rgb_color)??""}|${((d=o.attributes)==null?void 0:d.current_temperature)??""}|${((c=o.attributes)==null?void 0:c.entity_picture)??""}`}).sort().join(";")}_update(){var i,r;let e=null;const a=(i=this._config)==null?void 0:i.history_chart;a!=null&&a.entity_id&&(e=De(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const n=Se(this._hass,this._config,e,this._controlsCollapsed);(r=this._config)!=null&&r.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:n}),Pe(this.shadowRoot,this,n)}}window.customCards=window.customCards||[],window.customCards.push({type:q,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${ce} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(q,qe)})();
