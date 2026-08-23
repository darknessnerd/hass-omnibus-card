(function(){"use strict";const T="hass-omnibus-card",ce="1.18.0",N=new Set(["on","open","playing","home","unlocked"]),de={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},F={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high"},pe="mdi:weather-windy-variant",H={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"},he={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"};function P(t,e){const{entities:a={},devices:r={},states:i={}}=t;return Object.keys(i).reduce((n,l)=>{var d;const s=a[l];if(!s||s.hidden_by)return n;const o=s.area_id===e,h=s.device_id&&((d=r[s.device_id])==null?void 0:d.area_id)===e;return(o||h)&&n.push({entityId:l,state:i[l],deviceId:s.device_id??null}),n},[])}function ue(t,e,a){var l,s,o,h;if((l=e.entities)!=null&&l.length)return e.entities.map(d=>{var g,u,v;const c=(g=a.states)==null?void 0:g[d];return c?{entityId:d,state:c,deviceId:((v=(u=a.entities)==null?void 0:u[d])==null?void 0:v.device_id)??null}:null}).filter(Boolean);const r=new Set(e.exclude_entities??[]),i=e.add_entities??[],n=t.filter(d=>!r.has(d.entityId));for(const d of i){if(n.some(g=>g.entityId===d))continue;const c=(s=a.states)==null?void 0:s[d];c&&n.push({entityId:d,state:c,deviceId:((h=(o=a.entities)==null?void 0:o[d])==null?void 0:h.device_id)??null})}return n}const ge=new Set(["sensor","binary_sensor","image"]),fe=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),j={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},me=new RegExp(`ptz.*_(${Object.keys(j).join("|")})$`,"i");function be(t){var r;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],ptz:[],updates:[],others:[]};for(const i of t){const{entityId:n,state:l}=i,s=n.split(".")[0],o=((r=l.attributes)==null?void 0:r.device_class)??"",h=l.state;if(s==="light")e.lights.push(i);else if(s==="climate")e.climate.push(i);else if(s==="camera")e.cameras.push(i);else if(s==="update"&&h!=="unavailable")e.updates.push(i);else if(s==="sensor"&&o==="temperature")e.temperatures.push(i);else if(s==="sensor"&&o==="humidity")e.humidities.push(i);else if(s==="sensor"&&fe.has(o))e.weathers.push(i);else if(s==="binary_sensor"&&o==="motion")e.motions.push(i);else if(s==="binary_sensor"&&o==="occupancy")e.occupancy.push(i);else if(s==="binary_sensor"&&o==="smoke")e.smokes.push(i);else if(s==="binary_sensor"&&o==="gas")e.gases.push(i);else if(s==="binary_sensor"&&o==="moisture")e.moistures.push(i);else if(s==="sensor"&&o==="battery"&&h!=="unavailable")e.batteries.push(i),e.others.push(i);else if(h==="unavailable"||s==="binary_sensor"&&["problem","tamper","safety"].includes(o)&&h==="on")e.problems.push(i);else if(s==="siren")e.controls.push(i);else if(s==="button"){const d=n.match(me);d?e.ptz.push({...i,direction:j[d[1].toLowerCase()]}):e.controls.push(i)}else e.others.push(i)}const a=new Set(e.cameras.map(i=>i.deviceId).filter(Boolean));if(a.size){const i=[];for(const n of e.others){const l=n.entityId.split(".")[0];n.deviceId&&a.has(n.deviceId)&&!ge.has(l)?e.controls.push(n):i.push(n)}e.others=i}return e}const D=`
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
`;function q(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,r)=>a+r,0)/e.length:null}function E(t){return t.some(e=>e.state.state==="on")}function ye(t){return t.filter(e=>e.state.state==="on")}function ve(t){let e=null;for(const a of t){const r=parseFloat(a.state.state);isNaN(r)||(!e||r<e.value)&&(e={value:r,entityId:a.entityId,state:a.state})}return e}function xe(t){var e;for(const a of t){const r=(e=a.state.attributes)==null?void 0:e.rgb_color;if(r)return`rgb(${r.join(",")})`}return null}const _e=/_(max|gust|peak)$/i;function B(t,e){var r;return(((r=e.attributes)==null?void 0:r.friendly_name)??t.split(".")[1]).split(" ").pop()}function A(t,e){var l,s;if((l=e.attributes)!=null&&l.icon)return e.attributes.icon;const a=t.split(".")[0],r=((s=e.attributes)==null?void 0:s.device_class)??"",i=N.has(e.state),n=o=>typeof o=="string"?o:i?o.on:o.off;return a==="sensor"&&r==="battery"?W(parseFloat(e.state)):r==="wind_speed"&&_e.test(t)?pe:r&&F[r]?n(F[r]):H[a]?n(H[a]):"mdi:help-circle-outline"}function W(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function w(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function $e(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function Y(t,e,a){const r=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,i=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:r,max:i,range:i-r}}function we(t,e,a=null){if(!(t!=null&&t.length)||t.length<2)return"";const r=300,i=60,n=Math.min(...t),l=Math.max(...t),{min:s,range:o}=Y(a,n,l);if(o===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return"";const h=o||1,d=t.map((p,C)=>C/(t.length-1)*r),c=t.map(p=>i-(p-s)/h*i),u=`${d.map((p,C)=>`${C?"L":"M"}${p.toFixed(1)},${c[C].toFixed(1)}`).join(" ")} V${i} H0 Z`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null)))return U(r,i,`<path d="${u}" fill="${e}"/>`);const x=a.color??"rgba(3, 169, 244, 0.12)",_=a.color_high??"rgba(244, 67, 54, 0.25)",k=a.color_low??"rgba(33, 150, 243, 0.25)",b=p=>Math.max(0,Math.min(i,i-(p-s)/h*i)),O=`<defs><clipPath id="sg-cp"><path d="${u}"/></clipPath></defs>`;let y=`<path d="${u}" fill="${x}"/>`;if(a.threshold_high!=null){const p=b(a.threshold_high);p>0&&(y+=`<rect x="0" y="0" width="${r}" height="${p.toFixed(1)}" fill="${_}" clip-path="url(#sg-cp)"/>`),p>0&&p<i&&(y+=`<line x1="0" y1="${p.toFixed(1)}" x2="${r}" y2="${p.toFixed(1)}" stroke="${_}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}if(a.threshold_low!=null){const p=b(a.threshold_low);p<i&&(y+=`<rect x="0" y="${p.toFixed(1)}" width="${r}" height="${(i-p).toFixed(1)}" fill="${k}" clip-path="url(#sg-cp)"/>`),p>0&&p<i&&(y+=`<line x1="0" y1="${p.toFixed(1)}" x2="${r}" y2="${p.toFixed(1)}" stroke="${k}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}return U(r,i,O+y)}function U(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function ke(t,e,a=null,r=!1){var Z,G,V,J,K,Q,X,R,ee,te,ae,ie,re,oe;const i=e.area,n=(Z=t.areas)==null?void 0:Z[i];if(!n&&!e.name&&!((G=e.entities)!=null&&G.length))return{error:i??"(no area)"};const l=(V=e.entities)!=null&&V.length?[]:P(t,i),s=ue(l,e,t),o=be(s),h=ye(o.lights),d=xe(h),c=q(o.temperatures),g=q(o.humidities),u=o.climate[0]??null,[v,x]=de[(J=u==null?void 0:u.state)==null?void 0:J.state]??[null,null],_=e.mold_threshold??70,k=e.navigate_to||((K=e.tap_action)==null?void 0:K.navigation_path)||null,b=e.history_chart??null,O=e.battery_low_threshold??20,y=ve(o.batteries),p=o.cameras[0]??null,C=o.cameras.slice(1),S=o.updates.filter(f=>f.state.state==="on");return{areaName:e.name||(n==null?void 0:n.name)||i||"",cardIcon:e.icon||(n==null?void 0:n.icon)||"mdi:home",navPath:k,hasLights:o.lights.length>0,lightCount:h.length,offlineLights:o.lights.filter(f=>f.state.state==="unavailable").length,lightColor:d,occupied:E(o.motions)||E(o.occupancy),hasOccupancySensors:o.motions.length>0||o.occupancy.length>0,problemCount:o.problems.length,showBatteryBadge:y!=null&&y.value<=O,batteryValue:(y==null?void 0:y.value)??null,batteryIcon:y?W(y.value):null,batteryEntity:(y==null?void 0:y.entityId)??null,batteryTitle:y?`${o.batteries.length>1?`Lowest of ${o.batteries.length} — `:""}${((Q=y.state.attributes)==null?void 0:Q.friendly_name)??y.entityId}: ${y.value}%`:"",tempVal:c,humVal:g,tempUnit:((R=(X=o.temperatures[0])==null?void 0:X.state.attributes)==null?void 0:R.unit_of_measurement)??"°C",tempEntities:o.temperatures,humEntities:o.humidities,climate:u,climIcon:v,climColor:x,smokeOn:E(o.smokes),gasOn:E(o.gases),waterOn:E(o.moistures),moldRisk:g!==null&&g>=_,updateCount:S.length,updateEntity:((ee=S[0])==null?void 0:ee.entityId)??null,updateTitle:S.length?`${S.length} update${S.length!==1?"s":""} available: ${S.map(f=>{var m;return((m=f.state.attributes)==null?void 0:m.friendly_name)??f.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!p,cameraEntity:(p==null?void 0:p.entityId)??null,cameraImage:((te=p==null?void 0:p.state.attributes)==null?void 0:te.entity_picture)??null,cameraIcon:p?A(p.entityId,p.state):null,cameraTitle:((ae=p==null?void 0:p.state.attributes)==null?void 0:ae.friendly_name)??(p==null?void 0:p.entityId)??"",cameraState:(p==null?void 0:p.state.state)??"",cameraOffline:(p==null?void 0:p.state.state)==="unavailable",controlItems:e.show_entities!==!1?o.controls.map(({entityId:f,state:m})=>{var $;return{entityId:f,domain:f.split(".")[0],isActive:N.has(m.state),icon:A(f,m),label:B(f,m),title:`${(($=m.attributes)==null?void 0:$.friendly_name)??f} — ${m.state}`}}):[],collapsibleControls:e.collapsible_controls!==!1,controlsCollapsed:e.collapsible_controls!==!1&&r,ptzItems:e.show_entities!==!1?o.ptz.map(({entityId:f,state:m,direction:$})=>{var I;return{entityId:f,direction:$,icon:he[$],title:((I=m.attributes)==null?void 0:I.friendly_name)??f}}):[],weatherItems:e.show_entities!==!1?o.weathers.map(({entityId:f,state:m})=>{var ne,se,le;const $=parseFloat(m.state),I=((ne=m.attributes)==null?void 0:ne.unit_of_measurement)??"",De=((se=m.attributes)==null?void 0:se.device_class)??"";return{entityId:f,dc:De,icon:A(f,m),value:isNaN($)?m.state:$.toFixed(1),unit:I,title:`${((le=m.attributes)==null?void 0:le.friendly_name)??f} — ${m.state}${I}`}}):[],historyPoints:b!=null&&b.entity_id?a:null,historyColor:(b==null?void 0:b.color)??"rgba(3, 169, 244, 0.12)",historyChart:b,historyMin:b!=null&&b.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a):null,historyMax:b!=null&&b.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a):null,historyUnit:((oe=(re=(ie=t.states)==null?void 0:ie[b==null?void 0:b.entity_id])==null?void 0:re.attributes)==null?void 0:oe.unit_of_measurement)??"",historyHours:(b==null?void 0:b.hours)??24,chipItems:e.show_entities!==!1?[...o.others,...C].slice(0,e.max_entities??6).map(({entityId:f,state:m})=>{var $;return{entityId:f,isActive:N.has(m.state),icon:A(f,m),label:B(f,m),title:`${(($=m.attributes)==null?void 0:$.friendly_name)??f} — ${m.state}`}}):[]}}function Ce({areaName:t,cardIcon:e,hasLights:a,lightCount:r,offlineLights:i,occupied:n,hasOccupancySensors:l,problemCount:s,showBatteryBadge:o,batteryValue:h,batteryIcon:d,batteryEntity:c,batteryTitle:g,updateCount:u,updateEntity:v,updateTitle:x}){const _=r===0,k=_?i>0?`${i} light${i!==1?"s":""} offline`:"Lights off":`${r} light${r!==1?"s":""} on${i>0?` · ${i} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${_?"off":""} ${i>0?"has-offline":""}"
               title="${k}">
            <ha-icon icon="mdi:lightbulb${_?"-off":""}"></ha-icon>
            ${r>1?`<span>${r}</span>`:""}
          </div>`:""}
        ${l?`<div class="occupancy-dot ${n?"":"idle"}" title="${n?"Occupied":"Not occupied"}"></div>`:""}
        ${o?`
          <div class="badge badge-battery"
               data-entity="${c}"
               title="${g}">
            <ha-icon icon="${d}"></ha-icon>
            <span>${h}%</span>
          </div>`:""}
        ${s>0?`
          <div class="badge badge-problems"
               title="${s} problem${s!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${s>1?`<span>${s}</span>`:""}
          </div>`:""}
        ${u>0?`
          <div class="badge badge-update"
               data-entity="${v}"
               title="${x}">
            <ha-icon icon="mdi:package-up"></ha-icon>
            ${u>1?`<span>${u}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function Se({tempVal:t,humVal:e,tempUnit:a,tempEntities:r,humEntities:i,climate:n,climIcon:l,climColor:s}){var o,h,d,c,g,u,v,x;return t===null&&e===null&&!l?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((o=r[0])==null?void 0:o.entityId)??""}"
             title="${r.length>1?`Avg of ${r.length} sensors`:((d=(h=r[0])==null?void 0:h.state.attributes)==null?void 0:d.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((c=i[0])==null?void 0:c.entityId)??""}"
             title="${i.length>1?`Avg of ${i.length} sensors`:((u=(g=i[0])==null?void 0:g.state.attributes)==null?void 0:u.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${l?`
        <div class="env-chip climate"
             style="--climate-color: ${s}"
             data-entity="${n.entityId}"
             title="${((v=n.state.attributes)==null?void 0:v.friendly_name)??n.entityId}">
          <ha-icon icon="${l}"></ha-icon>
          <span>${((x=n.state.attributes)==null?void 0:x.current_temperature)!=null?`${n.state.attributes.current_temperature}°`:n.state.state}</span>
        </div>`:""}
    </div>`}function Ee({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip" title="Weather">
      ${t.map(({entityId:e,dc:a,icon:r,value:i,unit:n,title:l})=>`
        <span class="group-seg weather-seg" data-entity="${e}" data-dc="${a}" title="${l}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="group-seg-value">${i}${n?" "+n:""}</span>
        </span>`).join("")}
    </div>`:""}function ze({chipItems:t,weatherItems:e}){return!t.length&&!e.length?"":`
    <div class="entity-chips">
      ${Ee({weatherItems:e})}
      ${t.map(({entityId:a,isActive:r,icon:i,label:n,title:l})=>`
        <div class="chip${r?" on":""}" data-entity="${a}" title="${l}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="chip-label">${n}</span>
        </div>`).join("")}
    </div>`}function Ie({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:r,cameraTitle:i,cameraState:n,cameraOffline:l}){if(!t)return"";const s=l?`${i} (offline)`:i;return`
    <div class="camera-preview${l?" offline":""}" data-entity="${r}" title="${s}">
      ${e?`<img src="${e}" alt="${s}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${n==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
    </div>`}function Ae({ptzItems:t}){return t.length?`
    <div class="chip group-chip control-chip ptz-chip" title="PTZ">
      ${t.map(({entityId:e,direction:a,icon:r,title:i})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" title="${i}">
          <ha-icon icon="${r}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function Me({controlItems:t,ptzItems:e,collapsibleControls:a,controlsCollapsed:r}){return!t.length&&!e.length?"":`
    <div class="controls-row${r?" collapsed":""}">
      <span class="controls-label${a?" clickable":""}"
        ${a?`role="button" tabindex="0" title="${r?"Expand":"Collapse"} controls"`:""}
        >Controls${a?`<ha-icon class="controls-toggle" icon="mdi:chevron-${r?"down":"up"}"></ha-icon>`:""}</span>
      <div class="controls-chips">
        ${Ae({ptzItems:e})}
        ${t.map(({entityId:i,domain:n,isActive:l,icon:s,label:o,title:h})=>`
          <div class="chip control-chip${l?" on":""}" data-entity="${i}" data-domain="${n}" title="${h}">
            <ha-icon icon="${s}"></ha-icon>
            <span class="chip-label">${o}</span>
          </div>`).join("")}
      </div>
    </div>`}function Le({smokeOn:t,gasOn:e,waterOn:a,moldRisk:r}){return!t&&!e&&!a&&!r?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${r?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function Ne(t){return`
    <style>${D}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function Oe({historyMin:t,historyMax:e,historyUnit:a,historyHours:r,historyChart:i}){if(t===null)return"";const n=[];if((i==null?void 0:i.threshold_high)!=null||(i==null?void 0:i.threshold_low)!=null){const{min:l,range:s}=Y(i,t,e),o=s||1,h=d=>(1-(d-l)/o)*100;if(i.threshold_high!=null){const d=h(i.threshold_high);d>0&&d<100&&n.push(`<span class="chart-threshold" style="top:${d.toFixed(1)}%">${i.threshold_high.toFixed(1)}${a}</span>`)}if(i.threshold_low!=null){const d=h(i.threshold_low);d>0&&d<100&&n.push(`<span class="chart-threshold" style="top:${d.toFixed(1)}%">${i.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period">${r}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${n.join("")}
    </div>`}function Te(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",r=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${D}</style>
    <ha-card
      ${r?`class="${r}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?we(t.historyPoints,t.historyColor,t.historyChart):""}
      ${Oe(t)}
      <div class="card-content">
        ${Ie(t)}
        ${Ce(t)}
        ${Se(t)}
        ${ze(t)}
        ${Me(t)}
        ${Le(t)}
      </div>
    </ha-card>`}function Fe(t,e,a){var i,n;const r=(i=t.activeElement)==null?void 0:i.className;t.innerHTML=a.error?Ne(a.error):Te(a),a.error||He(t,e,a),r&&((n=t.querySelector(`.${r.split(" ").join(".")}`))==null||n.focus())}function He(t,e,{navPath:a,chipItems:r}){var h,d;a&&t.querySelector("ha-card").addEventListener("click",c=>{!c.target.closest(".chip")&&!c.target.closest(".env-chip")&&!c.target.closest(".badge-lights")&&!c.target.closest(".badge-battery")&&!c.target.closest(".badge-update")&&!c.target.closest(".camera-preview")&&!c.target.closest(".controls-label.clickable")&&$e(a)});const i=t.querySelector(".controls-label.clickable");i&&(i.addEventListener("click",c=>{c.stopPropagation(),e.toggleControlsCollapsed()}),i.addEventListener("keydown",c=>{c.key!=="Enter"&&c.key!==" "||(c.preventDefault(),c.stopPropagation(),e.toggleControlsCollapsed())})),t.querySelectorAll(".ptz-seg[data-entity]").forEach(c=>{c.addEventListener("click",g=>{var u;g.stopPropagation(),(u=e._hass)!=null&&u.callService?e._hass.callService("button","press",{},{entity_id:c.dataset.entity}):w(e,c.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(c=>{c.addEventListener("click",g=>{g.stopPropagation(),w(e,c.dataset.entity)})});const n=t.querySelector(".badge-update[data-entity]");n&&n.addEventListener("click",c=>{c.stopPropagation(),w(e,n.dataset.entity)});const l=t.querySelector(".camera-preview[data-entity]");l&&l.addEventListener("click",c=>{c.stopPropagation(),w(e,l.dataset.entity)}),t.querySelectorAll(".control-chip[data-entity]").forEach(c=>{c.addEventListener("click",g=>{var x,_;g.stopPropagation();const u=c.dataset.entity,v=c.dataset.domain;v==="button"&&((x=e._hass)!=null&&x.callService)?e._hass.callService("button","press",{},{entity_id:u}):v==="siren"&&((_=e._hass)!=null&&_.callService)?e._hass.callService("siren","toggle",{},{entity_id:u}):w(e,u)})});const s=t.querySelector(".badge-lights");s&&((h=e._config)!=null&&h.area)&&((d=e._hass)!=null&&d.callService)&&s.addEventListener("click",c=>{c.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const o=t.querySelector(".badge-battery[data-entity]");o&&o.addEventListener("click",c=>{c.stopPropagation(),w(e,o.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(c=>{const g=c.dataset.entity;g&&c.addEventListener("click",u=>{u.stopPropagation(),w(e,g)})}),t.querySelectorAll(".chip[data-entity]:not(.control-chip)").forEach(c=>{c.addEventListener("click",g=>{g.stopPropagation(),w(e,c.dataset.entity)})})}const M=new Map,L=new Set,z=new Map;function Pe(t,e,a,r,i){var o;const n=(o=i==null?void 0:i._config)==null?void 0:o.debug,l=`${e}:${Math.floor(Date.now()/3e5)}`;if(M.has(l))return n&&console.debug("[hass-omnibus-card] history cache hit",{key:l,points:M.get(l).length}),M.get(l);if(L.has(l))return n&&console.debug("[hass-omnibus-card] history fetch pending, queuing callback",{key:l}),z.get(l).set(i,r),null;if(!(t!=null&&t.callWS))return n&&console.debug("[hass-omnibus-card] history skipped — no callWS",{entityId:e}),null;n&&console.debug("[hass-omnibus-card] history fetch start",{key:l,entityId:e,hours:a}),L.add(l),z.set(l,new Map([[i,r]]));const s=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:s,minimal_response:!0,no_attributes:!0}).then(h=>{const d=Array.isArray(h==null?void 0:h[e])?h[e]:[],c=d.map(u=>parseFloat(u.s??u.state)).filter(u=>!isNaN(u));n&&console.debug("[hass-omnibus-card] history fetch done",{key:l,rawCount:d.length,pointCount:c.length}),M.set(l,c),L.delete(l);const g=z.get(l);z.delete(l),g==null||g.forEach(u=>u(c))}).catch(h=>{n&&console.debug("[hass-omnibus-card] history fetch error",{key:l,error:h}),L.delete(l),z.delete(l)}),null}class je extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._controlsCollapsed=null}setConfig(e){var a;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._controlsCollapsed=e.controls_collapsed!==!1,this._hass&&this._update()}toggleControlsCollapsed(){this._controlsCollapsed=!this._controlsCollapsed,this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var r,i,n,l;if(!this._hass||!this._config)return"";let e;if((r=this._config.entities)!=null&&r.length)e=this._config.entities.map(s=>{var o;return{entityId:s,state:(o=this._hass.states)==null?void 0:o[s]}}).filter(s=>s.state);else{e=P(this._hass,this._config.area);for(const s of this._config.add_entities??[])if(!e.some(o=>o.entityId===s)){const o=(i=this._hass.states)==null?void 0:i[s];o&&e.push({entityId:s,state:o})}}const a=(n=this._config.history_chart)==null?void 0:n.entity_id;if(a&&!e.some(s=>s.entityId===a)){const s=(l=this._hass.states)==null?void 0:l[a];s&&e.push({entityId:a,state:s})}return e.map(({entityId:s,state:o})=>{var h,d,c;return`${s}=${o.state}|${((h=o.attributes)==null?void 0:h.rgb_color)??""}|${((d=o.attributes)==null?void 0:d.current_temperature)??""}|${((c=o.attributes)==null?void 0:c.entity_picture)??""}`}).sort().join(";")}_update(){var i,n;let e=null;const a=(i=this._config)==null?void 0:i.history_chart;a!=null&&a.entity_id&&(e=Pe(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const r=ke(this._hass,this._config,e,this._controlsCollapsed);(n=this._config)!=null&&n.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:r}),Fe(this.shadowRoot,this,r)}}window.customCards=window.customCards||[],window.customCards.push({type:T,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${ce} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(T,je)})();
