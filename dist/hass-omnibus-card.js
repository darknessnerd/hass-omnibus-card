(function(){"use strict";const O="hass-omnibus-card",se="1.14.0",F=new Set(["on","open","playing","home","unlocked"]),le={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},H={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high"},T={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"},ce={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"};function N(t,e){const{entities:a={},devices:n={},states:i={}}=t;return Object.keys(i).reduce((s,c)=>{var o;const r=a[c];if(!r||r.hidden_by)return s;const l=r.area_id===e,p=r.device_id&&((o=n[r.device_id])==null?void 0:o.area_id)===e;return(l||p)&&s.push({entityId:c,state:i[c],deviceId:r.device_id??null}),s},[])}function de(t,e,a){var c,r,l,p;if((c=e.entities)!=null&&c.length)return e.entities.map(o=>{var u,y,x;const d=(u=a.states)==null?void 0:u[o];return d?{entityId:o,state:d,deviceId:((x=(y=a.entities)==null?void 0:y[o])==null?void 0:x.device_id)??null}:null}).filter(Boolean);const n=new Set(e.exclude_entities??[]),i=e.add_entities??[],s=t.filter(o=>!n.has(o.entityId));for(const o of i){if(s.some(u=>u.entityId===o))continue;const d=(r=a.states)==null?void 0:r[o];d&&s.push({entityId:o,state:d,deviceId:((p=(l=a.entities)==null?void 0:l[o])==null?void 0:p.device_id)??null})}return s}const pe=new Set(["sensor","binary_sensor","image"]),he=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),P={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},ue=new RegExp(`ptz.*_(${Object.keys(P).join("|")})$`,"i");function ge(t){var n;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],ptz:[],updates:[],others:[]};for(const i of t){const{entityId:s,state:c}=i,r=s.split(".")[0],l=((n=c.attributes)==null?void 0:n.device_class)??"",p=c.state;if(r==="light")e.lights.push(i);else if(r==="climate")e.climate.push(i);else if(r==="camera")e.cameras.push(i);else if(r==="update"&&p!=="unavailable")e.updates.push(i);else if(r==="sensor"&&l==="temperature")e.temperatures.push(i);else if(r==="sensor"&&l==="humidity")e.humidities.push(i);else if(r==="sensor"&&he.has(l))e.weathers.push(i);else if(r==="binary_sensor"&&l==="motion")e.motions.push(i);else if(r==="binary_sensor"&&l==="occupancy")e.occupancy.push(i);else if(r==="binary_sensor"&&l==="smoke")e.smokes.push(i);else if(r==="binary_sensor"&&l==="gas")e.gases.push(i);else if(r==="binary_sensor"&&l==="moisture")e.moistures.push(i);else if(r==="sensor"&&l==="battery"&&p!=="unavailable")e.batteries.push(i),e.others.push(i);else if(p==="unavailable"||r==="binary_sensor"&&["problem","tamper","safety"].includes(l)&&p==="on")e.problems.push(i);else if(r==="siren")e.controls.push(i);else if(r==="button"){const o=s.match(ue);o?e.ptz.push({...i,direction:P[o[1].toLowerCase()]}):e.controls.push(i)}else e.others.push(i)}const a=new Set(e.cameras.map(i=>i.deviceId).filter(Boolean));if(a.size){const i=[];for(const s of e.others){const c=s.entityId.split(".")[0];s.deviceId&&a.has(s.deviceId)&&!pe.has(c)?e.controls.push(s):i.push(s)}e.others=i}return e}const j=`
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
    display: block;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
    opacity: 0.6;
    margin-bottom: 4px;
  }

  .controls-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
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
`;function D(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,n)=>a+n,0)/e.length:null}function C(t){return t.some(e=>e.state.state==="on")}function fe(t){return t.filter(e=>e.state.state==="on")}function me(t){let e=null;for(const a of t){const n=parseFloat(a.state.state);isNaN(n)||(!e||n<e.value)&&(e={value:n,entityId:a.entityId,state:a.state})}return e}function be(t){var e;for(const a of t){const n=(e=a.state.attributes)==null?void 0:e.rgb_color;if(n)return`rgb(${n.join(",")})`}return null}function q(t,e){var n;return(((n=e.attributes)==null?void 0:n.friendly_name)??t.split(".")[1]).split(" ").pop()}function z(t,e){var c,r;if((c=e.attributes)!=null&&c.icon)return e.attributes.icon;const a=t.split(".")[0],n=((r=e.attributes)==null?void 0:r.device_class)??"",i=F.has(e.state),s=l=>typeof l=="string"?l:i?l.on:l.off;return a==="sensor"&&n==="battery"?B(parseFloat(e.state)):n&&H[n]?s(H[n]):T[a]?s(T[a]):"mdi:help-circle-outline"}function B(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function k(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function ye(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function Y(t,e,a){const n=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,i=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:n,max:i,range:i-n}}function ve(t,e,a=null){if(!(t!=null&&t.length)||t.length<2)return"";const n=300,i=60,s=Math.min(...t),c=Math.max(...t),{min:r,range:l}=Y(a,s,c);if(l===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return"";const p=l||1,o=t.map((m,$)=>$/(t.length-1)*n),d=t.map(m=>i-(m-r)/p*i),y=`${o.map((m,$)=>`${$?"L":"M"}${m.toFixed(1)},${d[$].toFixed(1)}`).join(" ")} V${i} H0 Z`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null)))return W(n,i,`<path d="${y}" fill="${e}"/>`);const _=a.color??"rgba(3, 169, 244, 0.12)",S=a.color_high??"rgba(244, 67, 54, 0.25)",g=a.color_low??"rgba(33, 150, 243, 0.25)",M=m=>Math.max(0,Math.min(i,i-(m-r)/p*i)),v=`<defs><clipPath id="sg-cp"><path d="${y}"/></clipPath></defs>`;let h=`<path d="${y}" fill="${_}"/>`;if(a.threshold_high!=null){const m=M(a.threshold_high);m>0&&(h+=`<rect x="0" y="0" width="${n}" height="${m.toFixed(1)}" fill="${S}" clip-path="url(#sg-cp)"/>`),m>0&&m<i&&(h+=`<line x1="0" y1="${m.toFixed(1)}" x2="${n}" y2="${m.toFixed(1)}" stroke="${S}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}if(a.threshold_low!=null){const m=M(a.threshold_low);m<i&&(h+=`<rect x="0" y="${m.toFixed(1)}" width="${n}" height="${(i-m).toFixed(1)}" fill="${g}" clip-path="url(#sg-cp)"/>`),m>0&&m<i&&(h+=`<line x1="0" y1="${m.toFixed(1)}" x2="${n}" y2="${m.toFixed(1)}" stroke="${g}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}return W(n,i,v+h)}function W(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function xe(t,e,a=null){var Z,U,R,V,G,J,K,Q,X,ee,te,ae,ie,re;const n=e.area,i=(Z=t.areas)==null?void 0:Z[n];if(!i&&!e.name&&!((U=e.entities)!=null&&U.length))return{error:n??"(no area)"};const s=(R=e.entities)!=null&&R.length?[]:N(t,n),c=de(s,e,t),r=ge(c),l=fe(r.lights),p=be(l),o=D(r.temperatures),d=D(r.humidities),u=r.climate[0]??null,[y,x]=le[(V=u==null?void 0:u.state)==null?void 0:V.state]??[null,null],_=e.mold_threshold??70,S=e.navigate_to||((G=e.tap_action)==null?void 0:G.navigation_path)||null,g=e.history_chart??null,M=e.battery_low_threshold??20,v=me(r.batteries),h=r.cameras[0]??null,m=r.cameras.slice(1),$=r.updates.filter(f=>f.state.state==="on");return{areaName:e.name||(i==null?void 0:i.name)||n||"",cardIcon:e.icon||(i==null?void 0:i.icon)||"mdi:home",navPath:S,hasLights:r.lights.length>0,lightCount:l.length,offlineLights:r.lights.filter(f=>f.state.state==="unavailable").length,lightColor:p,occupied:C(r.motions)||C(r.occupancy),hasOccupancySensors:r.motions.length>0||r.occupancy.length>0,problemCount:r.problems.length,showBatteryBadge:v!=null&&v.value<=M,batteryValue:(v==null?void 0:v.value)??null,batteryIcon:v?B(v.value):null,batteryEntity:(v==null?void 0:v.entityId)??null,batteryTitle:v?`${r.batteries.length>1?`Lowest of ${r.batteries.length} — `:""}${((J=v.state.attributes)==null?void 0:J.friendly_name)??v.entityId}: ${v.value}%`:"",tempVal:o,humVal:d,tempUnit:((Q=(K=r.temperatures[0])==null?void 0:K.state.attributes)==null?void 0:Q.unit_of_measurement)??"°C",tempEntities:r.temperatures,humEntities:r.humidities,climate:u,climIcon:y,climColor:x,smokeOn:C(r.smokes),gasOn:C(r.gases),waterOn:C(r.moistures),moldRisk:d!==null&&d>=_,updateCount:$.length,updateEntity:((X=$[0])==null?void 0:X.entityId)??null,updateTitle:$.length?`${$.length} update${$.length!==1?"s":""} available: ${$.map(f=>{var b;return((b=f.state.attributes)==null?void 0:b.friendly_name)??f.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!h,cameraEntity:(h==null?void 0:h.entityId)??null,cameraImage:((ee=h==null?void 0:h.state.attributes)==null?void 0:ee.entity_picture)??null,cameraIcon:h?z(h.entityId,h.state):null,cameraTitle:((te=h==null?void 0:h.state.attributes)==null?void 0:te.friendly_name)??(h==null?void 0:h.entityId)??"",cameraState:(h==null?void 0:h.state.state)??"",cameraOffline:(h==null?void 0:h.state.state)==="unavailable",controlItems:e.show_entities!==!1?r.controls.map(({entityId:f,state:b})=>{var w;return{entityId:f,domain:f.split(".")[0],isActive:F.has(b.state),icon:z(f,b),label:q(f,b),title:`${((w=b.attributes)==null?void 0:w.friendly_name)??f} — ${b.state}`}}):[],ptzItems:e.show_entities!==!1?r.ptz.map(({entityId:f,state:b,direction:w})=>{var I;return{entityId:f,direction:w,icon:ce[w],title:((I=b.attributes)==null?void 0:I.friendly_name)??f}}):[],weatherItems:e.show_entities!==!1?r.weathers.map(({entityId:f,state:b})=>{var ne,oe;const w=parseFloat(b.state),I=((ne=b.attributes)==null?void 0:ne.unit_of_measurement)??"";return{entityId:f,icon:z(f,b),value:isNaN(w)?b.state:w.toFixed(1),unit:I,title:`${((oe=b.attributes)==null?void 0:oe.friendly_name)??f} — ${b.state}${I}`}}):[],historyPoints:g!=null&&g.entity_id?a:null,historyColor:(g==null?void 0:g.color)??"rgba(3, 169, 244, 0.12)",historyChart:g,historyMin:g!=null&&g.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a):null,historyMax:g!=null&&g.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a):null,historyUnit:((re=(ie=(ae=t.states)==null?void 0:ae[g==null?void 0:g.entity_id])==null?void 0:ie.attributes)==null?void 0:re.unit_of_measurement)??"",historyHours:(g==null?void 0:g.hours)??24,chipItems:e.show_entities!==!1?[...r.others,...m].slice(0,e.max_entities??6).map(({entityId:f,state:b})=>{var w;return{entityId:f,isActive:F.has(b.state),icon:z(f,b),label:q(f,b),title:`${((w=b.attributes)==null?void 0:w.friendly_name)??f} — ${b.state}`}}):[]}}function _e({areaName:t,cardIcon:e,hasLights:a,lightCount:n,offlineLights:i,occupied:s,hasOccupancySensors:c,problemCount:r,showBatteryBadge:l,batteryValue:p,batteryIcon:o,batteryEntity:d,batteryTitle:u,updateCount:y,updateEntity:x,updateTitle:_}){const S=n===0,g=S?i>0?`${i} light${i!==1?"s":""} offline`:"Lights off":`${n} light${n!==1?"s":""} on${i>0?` · ${i} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${S?"off":""} ${i>0?"has-offline":""}"
               title="${g}">
            <ha-icon icon="mdi:lightbulb${S?"-off":""}"></ha-icon>
            ${n>1?`<span>${n}</span>`:""}
          </div>`:""}
        ${c?`<div class="occupancy-dot ${s?"":"idle"}" title="${s?"Occupied":"Not occupied"}"></div>`:""}
        ${l?`
          <div class="badge badge-battery"
               data-entity="${d}"
               title="${u}">
            <ha-icon icon="${o}"></ha-icon>
            <span>${p}%</span>
          </div>`:""}
        ${r>0?`
          <div class="badge badge-problems"
               title="${r} problem${r!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${r>1?`<span>${r}</span>`:""}
          </div>`:""}
        ${y>0?`
          <div class="badge badge-update"
               data-entity="${x}"
               title="${_}">
            <ha-icon icon="mdi:package-up"></ha-icon>
            ${y>1?`<span>${y}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function $e({tempVal:t,humVal:e,tempUnit:a,tempEntities:n,humEntities:i,climate:s,climIcon:c,climColor:r}){var l,p,o,d,u,y,x,_;return t===null&&e===null&&!c?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((l=n[0])==null?void 0:l.entityId)??""}"
             title="${n.length>1?`Avg of ${n.length} sensors`:((o=(p=n[0])==null?void 0:p.state.attributes)==null?void 0:o.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((d=i[0])==null?void 0:d.entityId)??""}"
             title="${i.length>1?`Avg of ${i.length} sensors`:((y=(u=i[0])==null?void 0:u.state.attributes)==null?void 0:y.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${c?`
        <div class="env-chip climate"
             style="--climate-color: ${r}"
             data-entity="${s.entityId}"
             title="${((x=s.state.attributes)==null?void 0:x.friendly_name)??s.entityId}">
          <ha-icon icon="${c}"></ha-icon>
          <span>${((_=s.state.attributes)==null?void 0:_.current_temperature)!=null?`${s.state.attributes.current_temperature}°`:s.state.state}</span>
        </div>`:""}
    </div>`}function we({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip" title="Weather">
      ${t.map(({entityId:e,icon:a,value:n,unit:i,title:s})=>`
        <span class="group-seg weather-seg" data-entity="${e}" title="${s}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="group-seg-value">${n}${i}</span>
        </span>`).join("")}
    </div>`:""}function ke({chipItems:t,weatherItems:e}){return!t.length&&!e.length?"":`
    <div class="entity-chips">
      ${we({weatherItems:e})}
      ${t.map(({entityId:a,isActive:n,icon:i,label:s,title:c})=>`
        <div class="chip${n?" on":""}" data-entity="${a}" title="${c}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="chip-label">${s}</span>
        </div>`).join("")}
    </div>`}function Se({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:n,cameraTitle:i,cameraState:s,cameraOffline:c}){if(!t)return"";const r=c?`${i} (offline)`:i;return`
    <div class="camera-preview${c?" offline":""}" data-entity="${n}" title="${r}">
      ${e?`<img src="${e}" alt="${r}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${s==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
    </div>`}function Ce({ptzItems:t}){return t.length?`
    <div class="chip group-chip control-chip ptz-chip" title="PTZ">
      ${t.map(({entityId:e,direction:a,icon:n,title:i})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" title="${i}">
          <ha-icon icon="${n}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function Ee({controlItems:t,ptzItems:e}){return!t.length&&!e.length?"":`
    <div class="controls-row">
      <span class="controls-label">Controls</span>
      <div class="controls-chips">
        ${Ce({ptzItems:e})}
        ${t.map(({entityId:a,domain:n,isActive:i,icon:s,label:c,title:r})=>`
          <div class="chip control-chip${i?" on":""}" data-entity="${a}" data-domain="${n}" title="${r}">
            <ha-icon icon="${s}"></ha-icon>
            <span class="chip-label">${c}</span>
          </div>`).join("")}
      </div>
    </div>`}function Ie({smokeOn:t,gasOn:e,waterOn:a,moldRisk:n}){return!t&&!e&&!a&&!n?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${n?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function ze(t){return`
    <style>${j}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function Ae({historyMin:t,historyMax:e,historyUnit:a,historyHours:n,historyChart:i}){if(t===null)return"";const s=[];if((i==null?void 0:i.threshold_high)!=null||(i==null?void 0:i.threshold_low)!=null){const{min:c,range:r}=Y(i,t,e),l=r||1,p=o=>(1-(o-c)/l)*100;if(i.threshold_high!=null){const o=p(i.threshold_high);o>0&&o<100&&s.push(`<span class="chart-threshold" style="top:${o.toFixed(1)}%">${i.threshold_high.toFixed(1)}${a}</span>`)}if(i.threshold_low!=null){const o=p(i.threshold_low);o>0&&o<100&&s.push(`<span class="chart-threshold" style="top:${o.toFixed(1)}%">${i.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period">${n}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${s.join("")}
    </div>`}function Me(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",n=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${j}</style>
    <ha-card
      ${n?`class="${n}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?ve(t.historyPoints,t.historyColor,t.historyChart):""}
      ${Ae(t)}
      <div class="card-content">
        ${Se(t)}
        ${_e(t)}
        ${$e(t)}
        ${ke(t)}
        ${Ee(t)}
        ${Ie(t)}
      </div>
    </ha-card>`}function Fe(t,e,a){t.innerHTML=a.error?ze(a.error):Me(a),a.error||Le(t,e,a)}function Le(t,e,{navPath:a,chipItems:n}){var l,p;a&&t.querySelector("ha-card").addEventListener("click",o=>{!o.target.closest(".chip")&&!o.target.closest(".env-chip")&&!o.target.closest(".badge-lights")&&!o.target.closest(".badge-battery")&&!o.target.closest(".badge-update")&&!o.target.closest(".camera-preview")&&ye(a)}),t.querySelectorAll(".ptz-seg[data-entity]").forEach(o=>{o.addEventListener("click",d=>{var u;d.stopPropagation(),(u=e._hass)!=null&&u.callService?e._hass.callService("button","press",{},{entity_id:o.dataset.entity}):k(e,o.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(o=>{o.addEventListener("click",d=>{d.stopPropagation(),k(e,o.dataset.entity)})});const i=t.querySelector(".badge-update[data-entity]");i&&i.addEventListener("click",o=>{o.stopPropagation(),k(e,i.dataset.entity)});const s=t.querySelector(".camera-preview[data-entity]");s&&s.addEventListener("click",o=>{o.stopPropagation(),k(e,s.dataset.entity)}),t.querySelectorAll(".control-chip[data-entity]").forEach(o=>{o.addEventListener("click",d=>{var x,_;d.stopPropagation();const u=o.dataset.entity,y=o.dataset.domain;y==="button"&&((x=e._hass)!=null&&x.callService)?e._hass.callService("button","press",{},{entity_id:u}):y==="siren"&&((_=e._hass)!=null&&_.callService)?e._hass.callService("siren","toggle",{},{entity_id:u}):k(e,u)})});const c=t.querySelector(".badge-lights");c&&((l=e._config)!=null&&l.area)&&((p=e._hass)!=null&&p.callService)&&c.addEventListener("click",o=>{o.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const r=t.querySelector(".badge-battery[data-entity]");r&&r.addEventListener("click",o=>{o.stopPropagation(),k(e,r.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(o=>{const d=o.dataset.entity;d&&o.addEventListener("click",u=>{u.stopPropagation(),k(e,d)})}),t.querySelectorAll(".chip[data-entity]:not(.control-chip)").forEach(o=>{o.addEventListener("click",d=>{d.stopPropagation(),k(e,o.dataset.entity)})})}const L=new Map,A=new Set,E=new Map;function Oe(t,e,a,n,i){const s=`${e}:${Math.floor(Date.now()/3e5)}`;if(L.has(s))return L.get(s);if(A.has(s))return E.get(s).set(i,n),null;if(!(t!=null&&t.callWS))return null;A.add(s),E.set(s,new Map([[i,n]]));const c=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:c,minimal_response:!0,no_attributes:!0}).then(r=>{const p=(Array.isArray(r==null?void 0:r[e])?r[e]:[]).map(d=>parseFloat(d.s??d.state)).filter(d=>!isNaN(d));L.set(s,p),A.delete(s);const o=E.get(s);E.delete(s),o==null||o.forEach(d=>d(p))}).catch(()=>{A.delete(s),E.delete(s)}),null}class He extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(e){var a;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._hass&&this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var n,i,s,c;if(!this._hass||!this._config)return"";let e;if((n=this._config.entities)!=null&&n.length)e=this._config.entities.map(r=>{var l;return{entityId:r,state:(l=this._hass.states)==null?void 0:l[r]}}).filter(r=>r.state);else{e=N(this._hass,this._config.area);for(const r of this._config.add_entities??[])if(!e.some(l=>l.entityId===r)){const l=(i=this._hass.states)==null?void 0:i[r];l&&e.push({entityId:r,state:l})}}const a=(s=this._config.history_chart)==null?void 0:s.entity_id;if(a&&!e.some(r=>r.entityId===a)){const r=(c=this._hass.states)==null?void 0:c[a];r&&e.push({entityId:a,state:r})}return e.map(({entityId:r,state:l})=>{var p,o,d;return`${r}=${l.state}|${((p=l.attributes)==null?void 0:p.rgb_color)??""}|${((o=l.attributes)==null?void 0:o.current_temperature)??""}|${((d=l.attributes)==null?void 0:d.entity_picture)??""}`}).sort().join(";")}_update(){var i,s;let e=null;const a=(i=this._config)==null?void 0:i.history_chart;a!=null&&a.entity_id&&(e=Oe(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const n=xe(this._hass,this._config,e);(s=this._config)!=null&&s.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:n}),Fe(this.shadowRoot,this,n)}}window.customCards=window.customCards||[],window.customCards.push({type:O,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${se} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(O,He)})();
