(function(){"use strict";const H="hass-omnibus-card",le="1.15.0",L=new Set(["on","open","playing","home","unlocked"]),ce={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},N={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high"},T={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"},de={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"};function P(t,e){const{entities:a={},devices:r={},states:i={}}=t;return Object.keys(i).reduce((o,p)=>{var c;const s=a[p];if(!s||s.hidden_by)return o;const n=s.area_id===e,u=s.device_id&&((c=r[s.device_id])==null?void 0:c.area_id)===e;return(n||u)&&o.push({entityId:p,state:i[p],deviceId:s.device_id??null}),o},[])}function pe(t,e,a){var p,s,n,u;if((p=e.entities)!=null&&p.length)return e.entities.map(c=>{var g,h,v;const l=(g=a.states)==null?void 0:g[c];return l?{entityId:c,state:l,deviceId:((v=(h=a.entities)==null?void 0:h[c])==null?void 0:v.device_id)??null}:null}).filter(Boolean);const r=new Set(e.exclude_entities??[]),i=e.add_entities??[],o=t.filter(c=>!r.has(c.entityId));for(const c of i){if(o.some(g=>g.entityId===c))continue;const l=(s=a.states)==null?void 0:s[c];l&&o.push({entityId:c,state:l,deviceId:((u=(n=a.entities)==null?void 0:n[c])==null?void 0:u.device_id)??null})}return o}const ue=new Set(["sensor","binary_sensor","image"]),he=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),j={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},ge=new RegExp(`ptz.*_(${Object.keys(j).join("|")})$`,"i");function fe(t){var r;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],ptz:[],updates:[],others:[]};for(const i of t){const{entityId:o,state:p}=i,s=o.split(".")[0],n=((r=p.attributes)==null?void 0:r.device_class)??"",u=p.state;if(s==="light")e.lights.push(i);else if(s==="climate")e.climate.push(i);else if(s==="camera")e.cameras.push(i);else if(s==="update"&&u!=="unavailable")e.updates.push(i);else if(s==="sensor"&&n==="temperature")e.temperatures.push(i);else if(s==="sensor"&&n==="humidity")e.humidities.push(i);else if(s==="sensor"&&he.has(n))e.weathers.push(i);else if(s==="binary_sensor"&&n==="motion")e.motions.push(i);else if(s==="binary_sensor"&&n==="occupancy")e.occupancy.push(i);else if(s==="binary_sensor"&&n==="smoke")e.smokes.push(i);else if(s==="binary_sensor"&&n==="gas")e.gases.push(i);else if(s==="binary_sensor"&&n==="moisture")e.moistures.push(i);else if(s==="sensor"&&n==="battery"&&u!=="unavailable")e.batteries.push(i),e.others.push(i);else if(u==="unavailable"||s==="binary_sensor"&&["problem","tamper","safety"].includes(n)&&u==="on")e.problems.push(i);else if(s==="siren")e.controls.push(i);else if(s==="button"){const c=o.match(ge);c?e.ptz.push({...i,direction:j[c[1].toLowerCase()]}):e.controls.push(i)}else e.others.push(i)}const a=new Set(e.cameras.map(i=>i.deviceId).filter(Boolean));if(a.size){const i=[];for(const o of e.others){const p=o.entityId.split(".")[0];o.deviceId&&a.has(o.deviceId)&&!ue.has(p)?e.controls.push(o):i.push(o)}e.others=i}return e}const D=`
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
`;function q(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,r)=>a+r,0)/e.length:null}function E(t){return t.some(e=>e.state.state==="on")}function me(t){return t.filter(e=>e.state.state==="on")}function be(t){let e=null;for(const a of t){const r=parseFloat(a.state.state);isNaN(r)||(!e||r<e.value)&&(e={value:r,entityId:a.entityId,state:a.state})}return e}function ye(t){var e;for(const a of t){const r=(e=a.state.attributes)==null?void 0:e.rgb_color;if(r)return`rgb(${r.join(",")})`}return null}function B(t,e){var r;return(((r=e.attributes)==null?void 0:r.friendly_name)??t.split(".")[1]).split(" ").pop()}function A(t,e){var p,s;if((p=e.attributes)!=null&&p.icon)return e.attributes.icon;const a=t.split(".")[0],r=((s=e.attributes)==null?void 0:s.device_class)??"",i=L.has(e.state),o=n=>typeof n=="string"?n:i?n.on:n.off;return a==="sensor"&&r==="battery"?Y(parseFloat(e.state)):r&&N[r]?o(N[r]):T[a]?o(T[a]):"mdi:help-circle-outline"}function Y(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function w(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function ve(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function W(t,e,a){const r=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,i=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:r,max:i,range:i-r}}function xe(t,e,a=null){if(!(t!=null&&t.length)||t.length<2)return"";const r=300,i=60,o=Math.min(...t),p=Math.max(...t),{min:s,range:n}=W(a,o,p);if(n===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return"";const u=n||1,c=t.map((d,C)=>C/(t.length-1)*r),l=t.map(d=>i-(d-s)/u*i),h=`${c.map((d,C)=>`${C?"L":"M"}${d.toFixed(1)},${l[C].toFixed(1)}`).join(" ")} V${i} H0 Z`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null)))return Z(r,i,`<path d="${h}" fill="${e}"/>`);const x=a.color??"rgba(3, 169, 244, 0.12)",_=a.color_high??"rgba(244, 67, 54, 0.25)",k=a.color_low??"rgba(33, 150, 243, 0.25)",b=d=>Math.max(0,Math.min(i,i-(d-s)/u*i)),O=`<defs><clipPath id="sg-cp"><path d="${h}"/></clipPath></defs>`;let y=`<path d="${h}" fill="${x}"/>`;if(a.threshold_high!=null){const d=b(a.threshold_high);d>0&&(y+=`<rect x="0" y="0" width="${r}" height="${d.toFixed(1)}" fill="${_}" clip-path="url(#sg-cp)"/>`),d>0&&d<i&&(y+=`<line x1="0" y1="${d.toFixed(1)}" x2="${r}" y2="${d.toFixed(1)}" stroke="${_}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}if(a.threshold_low!=null){const d=b(a.threshold_low);d<i&&(y+=`<rect x="0" y="${d.toFixed(1)}" width="${r}" height="${(i-d).toFixed(1)}" fill="${k}" clip-path="url(#sg-cp)"/>`),d>0&&d<i&&(y+=`<line x1="0" y1="${d.toFixed(1)}" x2="${r}" y2="${d.toFixed(1)}" stroke="${k}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}return Z(r,i,O+y)}function Z(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function _e(t,e,a=null,r=!1){var U,V,G,R,J,K,Q,X,ee,te,ae,ie,re,ne;const i=e.area,o=(U=t.areas)==null?void 0:U[i];if(!o&&!e.name&&!((V=e.entities)!=null&&V.length))return{error:i??"(no area)"};const p=(G=e.entities)!=null&&G.length?[]:P(t,i),s=pe(p,e,t),n=fe(s),u=me(n.lights),c=ye(u),l=q(n.temperatures),g=q(n.humidities),h=n.climate[0]??null,[v,x]=ce[(R=h==null?void 0:h.state)==null?void 0:R.state]??[null,null],_=e.mold_threshold??70,k=e.navigate_to||((J=e.tap_action)==null?void 0:J.navigation_path)||null,b=e.history_chart??null,O=e.battery_low_threshold??20,y=be(n.batteries),d=n.cameras[0]??null,C=n.cameras.slice(1),S=n.updates.filter(f=>f.state.state==="on");return{areaName:e.name||(o==null?void 0:o.name)||i||"",cardIcon:e.icon||(o==null?void 0:o.icon)||"mdi:home",navPath:k,hasLights:n.lights.length>0,lightCount:u.length,offlineLights:n.lights.filter(f=>f.state.state==="unavailable").length,lightColor:c,occupied:E(n.motions)||E(n.occupancy),hasOccupancySensors:n.motions.length>0||n.occupancy.length>0,problemCount:n.problems.length,showBatteryBadge:y!=null&&y.value<=O,batteryValue:(y==null?void 0:y.value)??null,batteryIcon:y?Y(y.value):null,batteryEntity:(y==null?void 0:y.entityId)??null,batteryTitle:y?`${n.batteries.length>1?`Lowest of ${n.batteries.length} — `:""}${((K=y.state.attributes)==null?void 0:K.friendly_name)??y.entityId}: ${y.value}%`:"",tempVal:l,humVal:g,tempUnit:((X=(Q=n.temperatures[0])==null?void 0:Q.state.attributes)==null?void 0:X.unit_of_measurement)??"°C",tempEntities:n.temperatures,humEntities:n.humidities,climate:h,climIcon:v,climColor:x,smokeOn:E(n.smokes),gasOn:E(n.gases),waterOn:E(n.moistures),moldRisk:g!==null&&g>=_,updateCount:S.length,updateEntity:((ee=S[0])==null?void 0:ee.entityId)??null,updateTitle:S.length?`${S.length} update${S.length!==1?"s":""} available: ${S.map(f=>{var m;return((m=f.state.attributes)==null?void 0:m.friendly_name)??f.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!d,cameraEntity:(d==null?void 0:d.entityId)??null,cameraImage:((te=d==null?void 0:d.state.attributes)==null?void 0:te.entity_picture)??null,cameraIcon:d?A(d.entityId,d.state):null,cameraTitle:((ae=d==null?void 0:d.state.attributes)==null?void 0:ae.friendly_name)??(d==null?void 0:d.entityId)??"",cameraState:(d==null?void 0:d.state.state)??"",cameraOffline:(d==null?void 0:d.state.state)==="unavailable",controlItems:e.show_entities!==!1?n.controls.map(({entityId:f,state:m})=>{var $;return{entityId:f,domain:f.split(".")[0],isActive:L.has(m.state),icon:A(f,m),label:B(f,m),title:`${(($=m.attributes)==null?void 0:$.friendly_name)??f} — ${m.state}`}}):[],collapsibleControls:e.collapsible_controls!==!1,controlsCollapsed:e.collapsible_controls!==!1&&r,ptzItems:e.show_entities!==!1?n.ptz.map(({entityId:f,state:m,direction:$})=>{var I;return{entityId:f,direction:$,icon:de[$],title:((I=m.attributes)==null?void 0:I.friendly_name)??f}}):[],weatherItems:e.show_entities!==!1?n.weathers.map(({entityId:f,state:m})=>{var oe,se;const $=parseFloat(m.state),I=((oe=m.attributes)==null?void 0:oe.unit_of_measurement)??"";return{entityId:f,icon:A(f,m),value:isNaN($)?m.state:$.toFixed(1),unit:I,title:`${((se=m.attributes)==null?void 0:se.friendly_name)??f} — ${m.state}${I}`}}):[],historyPoints:b!=null&&b.entity_id?a:null,historyColor:(b==null?void 0:b.color)??"rgba(3, 169, 244, 0.12)",historyChart:b,historyMin:b!=null&&b.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a):null,historyMax:b!=null&&b.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a):null,historyUnit:((ne=(re=(ie=t.states)==null?void 0:ie[b==null?void 0:b.entity_id])==null?void 0:re.attributes)==null?void 0:ne.unit_of_measurement)??"",historyHours:(b==null?void 0:b.hours)??24,chipItems:e.show_entities!==!1?[...n.others,...C].slice(0,e.max_entities??6).map(({entityId:f,state:m})=>{var $;return{entityId:f,isActive:L.has(m.state),icon:A(f,m),label:B(f,m),title:`${(($=m.attributes)==null?void 0:$.friendly_name)??f} — ${m.state}`}}):[]}}function $e({areaName:t,cardIcon:e,hasLights:a,lightCount:r,offlineLights:i,occupied:o,hasOccupancySensors:p,problemCount:s,showBatteryBadge:n,batteryValue:u,batteryIcon:c,batteryEntity:l,batteryTitle:g,updateCount:h,updateEntity:v,updateTitle:x}){const _=r===0,k=_?i>0?`${i} light${i!==1?"s":""} offline`:"Lights off":`${r} light${r!==1?"s":""} on${i>0?` · ${i} offline`:""}`;return`
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
        ${p?`<div class="occupancy-dot ${o?"":"idle"}" title="${o?"Occupied":"Not occupied"}"></div>`:""}
        ${n?`
          <div class="badge badge-battery"
               data-entity="${l}"
               title="${g}">
            <ha-icon icon="${c}"></ha-icon>
            <span>${u}%</span>
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
               title="${x}">
            <ha-icon icon="mdi:package-up"></ha-icon>
            ${h>1?`<span>${h}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function we({tempVal:t,humVal:e,tempUnit:a,tempEntities:r,humEntities:i,climate:o,climIcon:p,climColor:s}){var n,u,c,l,g,h,v,x;return t===null&&e===null&&!p?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((n=r[0])==null?void 0:n.entityId)??""}"
             title="${r.length>1?`Avg of ${r.length} sensors`:((c=(u=r[0])==null?void 0:u.state.attributes)==null?void 0:c.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((l=i[0])==null?void 0:l.entityId)??""}"
             title="${i.length>1?`Avg of ${i.length} sensors`:((h=(g=i[0])==null?void 0:g.state.attributes)==null?void 0:h.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${p?`
        <div class="env-chip climate"
             style="--climate-color: ${s}"
             data-entity="${o.entityId}"
             title="${((v=o.state.attributes)==null?void 0:v.friendly_name)??o.entityId}">
          <ha-icon icon="${p}"></ha-icon>
          <span>${((x=o.state.attributes)==null?void 0:x.current_temperature)!=null?`${o.state.attributes.current_temperature}°`:o.state.state}</span>
        </div>`:""}
    </div>`}function ke({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip" title="Weather">
      ${t.map(({entityId:e,icon:a,value:r,unit:i,title:o})=>`
        <span class="group-seg weather-seg" data-entity="${e}" title="${o}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="group-seg-value">${r}${i}</span>
        </span>`).join("")}
    </div>`:""}function Ce({chipItems:t,weatherItems:e}){return!t.length&&!e.length?"":`
    <div class="entity-chips">
      ${ke({weatherItems:e})}
      ${t.map(({entityId:a,isActive:r,icon:i,label:o,title:p})=>`
        <div class="chip${r?" on":""}" data-entity="${a}" title="${p}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="chip-label">${o}</span>
        </div>`).join("")}
    </div>`}function Se({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:r,cameraTitle:i,cameraState:o,cameraOffline:p}){if(!t)return"";const s=p?`${i} (offline)`:i;return`
    <div class="camera-preview${p?" offline":""}" data-entity="${r}" title="${s}">
      ${e?`<img src="${e}" alt="${s}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${o==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
    </div>`}function Ee({ptzItems:t}){return t.length?`
    <div class="chip group-chip control-chip ptz-chip" title="PTZ">
      ${t.map(({entityId:e,direction:a,icon:r,title:i})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" title="${i}">
          <ha-icon icon="${r}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function ze({controlItems:t,ptzItems:e,collapsibleControls:a,controlsCollapsed:r}){return!t.length&&!e.length?"":`
    <div class="controls-row${r?" collapsed":""}">
      <span class="controls-label${a?" clickable":""}"
        ${a?`role="button" tabindex="0" title="${r?"Expand":"Collapse"} controls"`:""}
        >Controls${a?`<ha-icon class="controls-toggle" icon="mdi:chevron-${r?"down":"up"}"></ha-icon>`:""}</span>
      <div class="controls-chips">
        ${Ee({ptzItems:e})}
        ${t.map(({entityId:i,domain:o,isActive:p,icon:s,label:n,title:u})=>`
          <div class="chip control-chip${p?" on":""}" data-entity="${i}" data-domain="${o}" title="${u}">
            <ha-icon icon="${s}"></ha-icon>
            <span class="chip-label">${n}</span>
          </div>`).join("")}
      </div>
    </div>`}function Ie({smokeOn:t,gasOn:e,waterOn:a,moldRisk:r}){return!t&&!e&&!a&&!r?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${r?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function Ae(t){return`
    <style>${D}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function Me({historyMin:t,historyMax:e,historyUnit:a,historyHours:r,historyChart:i}){if(t===null)return"";const o=[];if((i==null?void 0:i.threshold_high)!=null||(i==null?void 0:i.threshold_low)!=null){const{min:p,range:s}=W(i,t,e),n=s||1,u=c=>(1-(c-p)/n)*100;if(i.threshold_high!=null){const c=u(i.threshold_high);c>0&&c<100&&o.push(`<span class="chart-threshold" style="top:${c.toFixed(1)}%">${i.threshold_high.toFixed(1)}${a}</span>`)}if(i.threshold_low!=null){const c=u(i.threshold_low);c>0&&c<100&&o.push(`<span class="chart-threshold" style="top:${c.toFixed(1)}%">${i.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period">${r}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${o.join("")}
    </div>`}function Le(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",r=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${D}</style>
    <ha-card
      ${r?`class="${r}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?xe(t.historyPoints,t.historyColor,t.historyChart):""}
      ${Me(t)}
      <div class="card-content">
        ${Se(t)}
        ${$e(t)}
        ${we(t)}
        ${Ce(t)}
        ${ze(t)}
        ${Ie(t)}
      </div>
    </ha-card>`}function Fe(t,e,a){var i,o;const r=(i=t.activeElement)==null?void 0:i.className;t.innerHTML=a.error?Ae(a.error):Le(a),a.error||Oe(t,e,a),r&&((o=t.querySelector(`.${r.split(" ").join(".")}`))==null||o.focus())}function Oe(t,e,{navPath:a,chipItems:r}){var u,c;a&&t.querySelector("ha-card").addEventListener("click",l=>{!l.target.closest(".chip")&&!l.target.closest(".env-chip")&&!l.target.closest(".badge-lights")&&!l.target.closest(".badge-battery")&&!l.target.closest(".badge-update")&&!l.target.closest(".camera-preview")&&!l.target.closest(".controls-label.clickable")&&ve(a)});const i=t.querySelector(".controls-label.clickable");i&&(i.addEventListener("click",l=>{l.stopPropagation(),e.toggleControlsCollapsed()}),i.addEventListener("keydown",l=>{l.key!=="Enter"&&l.key!==" "||(l.preventDefault(),l.stopPropagation(),e.toggleControlsCollapsed())})),t.querySelectorAll(".ptz-seg[data-entity]").forEach(l=>{l.addEventListener("click",g=>{var h;g.stopPropagation(),(h=e._hass)!=null&&h.callService?e._hass.callService("button","press",{},{entity_id:l.dataset.entity}):w(e,l.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(l=>{l.addEventListener("click",g=>{g.stopPropagation(),w(e,l.dataset.entity)})});const o=t.querySelector(".badge-update[data-entity]");o&&o.addEventListener("click",l=>{l.stopPropagation(),w(e,o.dataset.entity)});const p=t.querySelector(".camera-preview[data-entity]");p&&p.addEventListener("click",l=>{l.stopPropagation(),w(e,p.dataset.entity)}),t.querySelectorAll(".control-chip[data-entity]").forEach(l=>{l.addEventListener("click",g=>{var x,_;g.stopPropagation();const h=l.dataset.entity,v=l.dataset.domain;v==="button"&&((x=e._hass)!=null&&x.callService)?e._hass.callService("button","press",{},{entity_id:h}):v==="siren"&&((_=e._hass)!=null&&_.callService)?e._hass.callService("siren","toggle",{},{entity_id:h}):w(e,h)})});const s=t.querySelector(".badge-lights");s&&((u=e._config)!=null&&u.area)&&((c=e._hass)!=null&&c.callService)&&s.addEventListener("click",l=>{l.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const n=t.querySelector(".badge-battery[data-entity]");n&&n.addEventListener("click",l=>{l.stopPropagation(),w(e,n.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(l=>{const g=l.dataset.entity;g&&l.addEventListener("click",h=>{h.stopPropagation(),w(e,g)})}),t.querySelectorAll(".chip[data-entity]:not(.control-chip)").forEach(l=>{l.addEventListener("click",g=>{g.stopPropagation(),w(e,l.dataset.entity)})})}const F=new Map,M=new Set,z=new Map;function He(t,e,a,r,i){const o=`${e}:${Math.floor(Date.now()/3e5)}`;if(F.has(o))return F.get(o);if(M.has(o))return z.get(o).set(i,r),null;if(!(t!=null&&t.callWS))return null;M.add(o),z.set(o,new Map([[i,r]]));const p=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:p,minimal_response:!0,no_attributes:!0}).then(s=>{const u=(Array.isArray(s==null?void 0:s[e])?s[e]:[]).map(l=>parseFloat(l.s??l.state)).filter(l=>!isNaN(l));F.set(o,u),M.delete(o);const c=z.get(o);z.delete(o),c==null||c.forEach(l=>l(u))}).catch(()=>{M.delete(o),z.delete(o)}),null}class Ne extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._controlsCollapsed=null}setConfig(e){var a;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._controlsCollapsed=e.controls_collapsed!==!1,this._hass&&this._update()}toggleControlsCollapsed(){this._controlsCollapsed=!this._controlsCollapsed,this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var r,i,o,p;if(!this._hass||!this._config)return"";let e;if((r=this._config.entities)!=null&&r.length)e=this._config.entities.map(s=>{var n;return{entityId:s,state:(n=this._hass.states)==null?void 0:n[s]}}).filter(s=>s.state);else{e=P(this._hass,this._config.area);for(const s of this._config.add_entities??[])if(!e.some(n=>n.entityId===s)){const n=(i=this._hass.states)==null?void 0:i[s];n&&e.push({entityId:s,state:n})}}const a=(o=this._config.history_chart)==null?void 0:o.entity_id;if(a&&!e.some(s=>s.entityId===a)){const s=(p=this._hass.states)==null?void 0:p[a];s&&e.push({entityId:a,state:s})}return e.map(({entityId:s,state:n})=>{var u,c,l;return`${s}=${n.state}|${((u=n.attributes)==null?void 0:u.rgb_color)??""}|${((c=n.attributes)==null?void 0:c.current_temperature)??""}|${((l=n.attributes)==null?void 0:l.entity_picture)??""}`}).sort().join(";")}_update(){var i,o;let e=null;const a=(i=this._config)==null?void 0:i.history_chart;a!=null&&a.entity_id&&(e=He(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const r=_e(this._hass,this._config,e,this._controlsCollapsed);(o=this._config)!=null&&o.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:r}),Fe(this.shadowRoot,this,r)}}window.customCards=window.customCards||[],window.customCards.push({type:H,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${le} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(H,Ne)})();
