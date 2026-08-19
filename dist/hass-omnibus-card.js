(function(){"use strict";const H="hass-omnibus-card",te="1.13.0",A=new Set(["on","open","playing","home","unlocked"]),ae={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},L={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high"},O={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"};function N(t,e){const{entities:a={},devices:n={},states:i={}}=t;return Object.keys(i).reduce((o,d)=>{var c;const r=a[d];if(!r||r.hidden_by)return o;const s=r.area_id===e,l=r.device_id&&((c=n[r.device_id])==null?void 0:c.area_id)===e;return(s||l)&&o.push({entityId:d,state:i[d],deviceId:r.device_id??null}),o},[])}function ie(t,e,a){var d,r,s,l;if((d=e.entities)!=null&&d.length)return e.entities.map(c=>{var m,g,y;const p=(m=a.states)==null?void 0:m[c];return p?{entityId:c,state:p,deviceId:((y=(g=a.entities)==null?void 0:g[c])==null?void 0:y.device_id)??null}:null}).filter(Boolean);const n=new Set(e.exclude_entities??[]),i=e.add_entities??[],o=t.filter(c=>!n.has(c.entityId));for(const c of i){if(o.some(m=>m.entityId===c))continue;const p=(r=a.states)==null?void 0:r[c];p&&o.push({entityId:c,state:p,deviceId:((l=(s=a.entities)==null?void 0:s[c])==null?void 0:l.device_id)??null})}return o}function re(t){var n;const e={lights:[],climate:[],temperatures:[],humidities:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],others:[]};for(const i of t){const{entityId:o,state:d}=i,r=o.split(".")[0],s=((n=d.attributes)==null?void 0:n.device_class)??"",l=d.state;r==="light"?e.lights.push(i):r==="climate"?e.climate.push(i):r==="camera"?e.cameras.push(i):r==="sensor"&&s==="temperature"?e.temperatures.push(i):r==="sensor"&&s==="humidity"?e.humidities.push(i):r==="binary_sensor"&&s==="motion"?e.motions.push(i):r==="binary_sensor"&&s==="occupancy"?e.occupancy.push(i):r==="binary_sensor"&&s==="smoke"?e.smokes.push(i):r==="binary_sensor"&&s==="gas"?e.gases.push(i):r==="binary_sensor"&&s==="moisture"?e.moistures.push(i):r==="sensor"&&s==="battery"&&l!=="unavailable"?(e.batteries.push(i),e.others.push(i)):l==="unavailable"||r==="binary_sensor"&&["problem","tamper","safety"].includes(s)&&l==="on"?e.problems.push(i):r==="siren"||r==="button"?e.controls.push(i):e.others.push(i)}const a=new Set(e.cameras.map(i=>i.deviceId).filter(Boolean));if(a.size){const i=[];for(const o of e.others)o.deviceId&&a.has(o.deviceId)?e.controls.push(o):i.push(o);e.others=i}return e}const T=`
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
`;function j(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,n)=>a+n,0)/e.length:null}function w(t){return t.some(e=>e.state.state==="on")}function ne(t){return t.filter(e=>e.state.state==="on")}function oe(t){let e=null;for(const a of t){const n=parseFloat(a.state.state);isNaN(n)||(!e||n<e.value)&&(e={value:n,entityId:a.entityId,state:a.state})}return e}function se(t){var e;for(const a of t){const n=(e=a.state.attributes)==null?void 0:e.rgb_color;if(n)return`rgb(${n.join(",")})`}return null}function B(t,e){var n;return(((n=e.attributes)==null?void 0:n.friendly_name)??t.split(".")[1]).split(" ").pop()}function z(t,e){var d,r;if((d=e.attributes)!=null&&d.icon)return e.attributes.icon;const a=t.split(".")[0],n=((r=e.attributes)==null?void 0:r.device_class)??"",i=A.has(e.state),o=s=>typeof s=="string"?s:i?s.on:s.off;return a==="sensor"&&n==="battery"?D(parseFloat(e.state)):n&&L[n]?o(L[n]):O[a]?o(O[a]):"mdi:help-circle-outline"}function D(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function k(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function le(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function q(t,e,a){const n=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,i=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:n,max:i,range:i-n}}function ce(t,e,a=null){if(!(t!=null&&t.length)||t.length<2)return"";const n=300,i=60,o=Math.min(...t),d=Math.max(...t),{min:r,range:s}=q(a,o,d);if(s===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return"";const l=s||1,c=t.map((u,_)=>_/(t.length-1)*n),p=t.map(u=>i-(u-r)/l*i),g=`${c.map((u,_)=>`${_?"L":"M"}${u.toFixed(1)},${p[_].toFixed(1)}`).join(" ")} V${i} H0 Z`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null)))return P(n,i,`<path d="${g}" fill="${e}"/>`);const $=a.color??"rgba(3, 169, 244, 0.12)",E=a.color_high??"rgba(244, 67, 54, 0.25)",f=a.color_low??"rgba(33, 150, 243, 0.25)",M=u=>Math.max(0,Math.min(i,i-(u-r)/l*i)),b=`<defs><clipPath id="sg-cp"><path d="${g}"/></clipPath></defs>`;let h=`<path d="${g}" fill="${$}"/>`;if(a.threshold_high!=null){const u=M(a.threshold_high);u>0&&(h+=`<rect x="0" y="0" width="${n}" height="${u.toFixed(1)}" fill="${E}" clip-path="url(#sg-cp)"/>`),u>0&&u<i&&(h+=`<line x1="0" y1="${u.toFixed(1)}" x2="${n}" y2="${u.toFixed(1)}" stroke="${E}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}if(a.threshold_low!=null){const u=M(a.threshold_low);u<i&&(h+=`<rect x="0" y="${u.toFixed(1)}" width="${n}" height="${(i-u).toFixed(1)}" fill="${f}" clip-path="url(#sg-cp)"/>`),u>0&&u<i&&(h+=`<line x1="0" y1="${u.toFixed(1)}" x2="${n}" y2="${u.toFixed(1)}" stroke="${f}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}return P(n,i,b+h)}function P(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function de(t,e,a=null){var _,Y,U,W,R,V,G,Z,J,K,Q,X,ee;const n=e.area,i=(_=t.areas)==null?void 0:_[n];if(!i&&!e.name&&!((Y=e.entities)!=null&&Y.length))return{error:n??"(no area)"};const o=(U=e.entities)!=null&&U.length?[]:N(t,n),d=ie(o,e,t),r=re(d),s=ne(r.lights),l=se(s),c=j(r.temperatures),p=j(r.humidities),m=r.climate[0]??null,[g,y]=ae[(W=m==null?void 0:m.state)==null?void 0:W.state]??[null,null],$=e.mold_threshold??70,E=e.navigate_to||((R=e.tap_action)==null?void 0:R.navigation_path)||null,f=e.history_chart??null,M=e.battery_low_threshold??20,b=oe(r.batteries),h=r.cameras[0]??null,u=r.cameras.slice(1);return{areaName:e.name||(i==null?void 0:i.name)||n||"",cardIcon:e.icon||(i==null?void 0:i.icon)||"mdi:home",navPath:E,hasLights:r.lights.length>0,lightCount:s.length,offlineLights:r.lights.filter(v=>v.state.state==="unavailable").length,lightColor:l,occupied:w(r.motions)||w(r.occupancy),hasOccupancySensors:r.motions.length>0||r.occupancy.length>0,problemCount:r.problems.length,showBatteryBadge:b!=null&&b.value<=M,batteryValue:(b==null?void 0:b.value)??null,batteryIcon:b?D(b.value):null,batteryEntity:(b==null?void 0:b.entityId)??null,batteryTitle:b?`${r.batteries.length>1?`Lowest of ${r.batteries.length} — `:""}${((V=b.state.attributes)==null?void 0:V.friendly_name)??b.entityId}: ${b.value}%`:"",tempVal:c,humVal:p,tempUnit:((Z=(G=r.temperatures[0])==null?void 0:G.state.attributes)==null?void 0:Z.unit_of_measurement)??"°C",tempEntities:r.temperatures,humEntities:r.humidities,climate:m,climIcon:g,climColor:y,smokeOn:w(r.smokes),gasOn:w(r.gases),waterOn:w(r.moistures),moldRisk:p!==null&&p>=$,hasCamera:e.show_camera!==!1&&!!h,cameraEntity:(h==null?void 0:h.entityId)??null,cameraImage:((J=h==null?void 0:h.state.attributes)==null?void 0:J.entity_picture)??null,cameraIcon:h?z(h.entityId,h.state):null,cameraTitle:((K=h==null?void 0:h.state.attributes)==null?void 0:K.friendly_name)??(h==null?void 0:h.entityId)??"",cameraState:(h==null?void 0:h.state.state)??"",cameraOffline:(h==null?void 0:h.state.state)==="unavailable",controlItems:e.show_entities!==!1?r.controls.map(({entityId:v,state:x})=>{var C;return{entityId:v,domain:v.split(".")[0],isActive:A.has(x.state),icon:z(v,x),label:B(v,x),title:`${((C=x.attributes)==null?void 0:C.friendly_name)??v} — ${x.state}`}}):[],historyPoints:f!=null&&f.entity_id?a:null,historyColor:(f==null?void 0:f.color)??"rgba(3, 169, 244, 0.12)",historyChart:f,historyMin:f!=null&&f.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a):null,historyMax:f!=null&&f.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a):null,historyUnit:((ee=(X=(Q=t.states)==null?void 0:Q[f==null?void 0:f.entity_id])==null?void 0:X.attributes)==null?void 0:ee.unit_of_measurement)??"",historyHours:(f==null?void 0:f.hours)??24,chipItems:e.show_entities!==!1?[...r.others,...u].slice(0,e.max_entities??6).map(({entityId:v,state:x})=>{var C;return{entityId:v,isActive:A.has(x.state),icon:z(v,x),label:B(v,x),title:`${((C=x.attributes)==null?void 0:C.friendly_name)??v} — ${x.state}`}}):[]}}function pe({areaName:t,cardIcon:e,hasLights:a,lightCount:n,offlineLights:i,occupied:o,hasOccupancySensors:d,problemCount:r,showBatteryBadge:s,batteryValue:l,batteryIcon:c,batteryEntity:p,batteryTitle:m}){const g=n===0,y=g?i>0?`${i} light${i!==1?"s":""} offline`:"Lights off":`${n} light${n!==1?"s":""} on${i>0?` · ${i} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${g?"off":""} ${i>0?"has-offline":""}"
               title="${y}">
            <ha-icon icon="mdi:lightbulb${g?"-off":""}"></ha-icon>
            ${n>1?`<span>${n}</span>`:""}
          </div>`:""}
        ${d?`<div class="occupancy-dot ${o?"":"idle"}" title="${o?"Occupied":"Not occupied"}"></div>`:""}
        ${s?`
          <div class="badge badge-battery"
               data-entity="${p}"
               title="${m}">
            <ha-icon icon="${c}"></ha-icon>
            <span>${l}%</span>
          </div>`:""}
        ${r>0?`
          <div class="badge badge-problems"
               title="${r} problem${r!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${r>1?`<span>${r}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function he({tempVal:t,humVal:e,tempUnit:a,tempEntities:n,humEntities:i,climate:o,climIcon:d,climColor:r}){var s,l,c,p,m,g,y,$;return t===null&&e===null&&!d?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((s=n[0])==null?void 0:s.entityId)??""}"
             title="${n.length>1?`Avg of ${n.length} sensors`:((c=(l=n[0])==null?void 0:l.state.attributes)==null?void 0:c.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((p=i[0])==null?void 0:p.entityId)??""}"
             title="${i.length>1?`Avg of ${i.length} sensors`:((g=(m=i[0])==null?void 0:m.state.attributes)==null?void 0:g.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${d?`
        <div class="env-chip climate"
             style="--climate-color: ${r}"
             data-entity="${o.entityId}"
             title="${((y=o.state.attributes)==null?void 0:y.friendly_name)??o.entityId}">
          <ha-icon icon="${d}"></ha-icon>
          <span>${(($=o.state.attributes)==null?void 0:$.current_temperature)!=null?`${o.state.attributes.current_temperature}°`:o.state.state}</span>
        </div>`:""}
    </div>`}function ue({chipItems:t}){return t.length?`
    <div class="entity-chips">
      ${t.map(({entityId:e,isActive:a,icon:n,label:i,title:o})=>`
        <div class="chip${a?" on":""}" data-entity="${e}" title="${o}">
          <ha-icon icon="${n}"></ha-icon>
          <span class="chip-label">${i}</span>
        </div>`).join("")}
    </div>`:""}function fe({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:n,cameraTitle:i,cameraState:o,cameraOffline:d}){if(!t)return"";const r=d?`${i} (offline)`:i;return`
    <div class="camera-preview${d?" offline":""}" data-entity="${n}" title="${r}">
      ${e?`<img src="${e}" alt="${r}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${o==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
    </div>`}function me({controlItems:t}){return t.length?`
    <div class="controls-row">
      <span class="controls-label">Controls</span>
      <div class="controls-chips">
        ${t.map(({entityId:e,domain:a,isActive:n,icon:i,label:o,title:d})=>`
          <div class="chip control-chip${n?" on":""}" data-entity="${e}" data-domain="${a}" title="${d}">
            <ha-icon icon="${i}"></ha-icon>
            <span class="chip-label">${o}</span>
          </div>`).join("")}
      </div>
    </div>`:""}function ge({smokeOn:t,gasOn:e,waterOn:a,moldRisk:n}){return!t&&!e&&!a&&!n?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${n?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function be(t){return`
    <style>${T}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function ye({historyMin:t,historyMax:e,historyUnit:a,historyHours:n,historyChart:i}){if(t===null)return"";const o=[];if((i==null?void 0:i.threshold_high)!=null||(i==null?void 0:i.threshold_low)!=null){const{min:d,range:r}=q(i,t,e),s=r||1,l=c=>(1-(c-d)/s)*100;if(i.threshold_high!=null){const c=l(i.threshold_high);c>0&&c<100&&o.push(`<span class="chart-threshold" style="top:${c.toFixed(1)}%">${i.threshold_high.toFixed(1)}${a}</span>`)}if(i.threshold_low!=null){const c=l(i.threshold_low);c>0&&c<100&&o.push(`<span class="chart-threshold" style="top:${c.toFixed(1)}%">${i.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period">${n}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${o.join("")}
    </div>`}function ve(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",n=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${T}</style>
    <ha-card
      ${n?`class="${n}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?ce(t.historyPoints,t.historyColor,t.historyChart):""}
      ${ye(t)}
      <div class="card-content">
        ${fe(t)}
        ${pe(t)}
        ${he(t)}
        ${ue(t)}
        ${me(t)}
        ${ge(t)}
      </div>
    </ha-card>`}function xe(t,e,a){t.innerHTML=a.error?be(a.error):ve(a),a.error||_e(t,e,a)}function _e(t,e,{navPath:a,chipItems:n}){var r,s;a&&t.querySelector("ha-card").addEventListener("click",l=>{!l.target.closest(".chip")&&!l.target.closest(".env-chip")&&!l.target.closest(".badge-lights")&&!l.target.closest(".badge-battery")&&!l.target.closest(".camera-preview")&&le(a)});const i=t.querySelector(".camera-preview[data-entity]");i&&i.addEventListener("click",l=>{l.stopPropagation(),k(e,i.dataset.entity)}),t.querySelectorAll(".control-chip[data-entity]").forEach(l=>{l.addEventListener("click",c=>{var g,y;c.stopPropagation();const p=l.dataset.entity,m=l.dataset.domain;m==="button"&&((g=e._hass)!=null&&g.callService)?e._hass.callService("button","press",{},{entity_id:p}):m==="siren"&&((y=e._hass)!=null&&y.callService)?e._hass.callService("siren","toggle",{},{entity_id:p}):k(e,p)})});const o=t.querySelector(".badge-lights");o&&((r=e._config)!=null&&r.area)&&((s=e._hass)!=null&&s.callService)&&o.addEventListener("click",l=>{l.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const d=t.querySelector(".badge-battery[data-entity]");d&&d.addEventListener("click",l=>{l.stopPropagation(),k(e,d.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(l=>{const c=l.dataset.entity;c&&l.addEventListener("click",p=>{p.stopPropagation(),k(e,c)})}),t.querySelectorAll(".chip[data-entity]:not(.control-chip)").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation(),k(e,l.dataset.entity)})})}const F=new Map,I=new Set,S=new Map;function $e(t,e,a,n,i){const o=`${e}:${Math.floor(Date.now()/3e5)}`;if(F.has(o))return F.get(o);if(I.has(o))return S.get(o).set(i,n),null;if(!(t!=null&&t.callWS))return null;I.add(o),S.set(o,new Map([[i,n]]));const d=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:d,minimal_response:!0,no_attributes:!0}).then(r=>{const l=(Array.isArray(r==null?void 0:r[e])?r[e]:[]).map(p=>parseFloat(p.s??p.state)).filter(p=>!isNaN(p));F.set(o,l),I.delete(o);const c=S.get(o);S.delete(o),c==null||c.forEach(p=>p(l))}).catch(()=>{I.delete(o),S.delete(o)}),null}class we extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(e){var a;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._hass&&this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var n,i,o,d;if(!this._hass||!this._config)return"";let e;if((n=this._config.entities)!=null&&n.length)e=this._config.entities.map(r=>{var s;return{entityId:r,state:(s=this._hass.states)==null?void 0:s[r]}}).filter(r=>r.state);else{e=N(this._hass,this._config.area);for(const r of this._config.add_entities??[])if(!e.some(s=>s.entityId===r)){const s=(i=this._hass.states)==null?void 0:i[r];s&&e.push({entityId:r,state:s})}}const a=(o=this._config.history_chart)==null?void 0:o.entity_id;if(a&&!e.some(r=>r.entityId===a)){const r=(d=this._hass.states)==null?void 0:d[a];r&&e.push({entityId:a,state:r})}return e.map(({entityId:r,state:s})=>{var l,c,p;return`${r}=${s.state}|${((l=s.attributes)==null?void 0:l.rgb_color)??""}|${((c=s.attributes)==null?void 0:c.current_temperature)??""}|${((p=s.attributes)==null?void 0:p.entity_picture)??""}`}).sort().join(";")}_update(){var i,o;let e=null;const a=(i=this._config)==null?void 0:i.history_chart;a!=null&&a.entity_id&&(e=$e(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const n=de(this._hass,this._config,e);(o=this._config)!=null&&o.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:n}),xe(this.shadowRoot,this,n)}}window.customCards=window.customCards||[],window.customCards.push({type:H,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${te} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(H,we)})();
