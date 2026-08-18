(function(){"use strict";const E="hass-omnibus-card",U="1.8.0",H=new Set(["on","open","playing","home","unlocked"]),W={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},O={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:"mdi:battery",connectivity:"mdi:wifi"},z={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted"};function I(a,e){const{entities:t={},devices:r={},states:o={}}=a;return Object.keys(o).reduce((l,s)=>{var d;const i=t[s];if(!i||i.hidden_by)return l;const n=i.area_id===e,c=i.device_id&&((d=r[i.device_id])==null?void 0:d.area_id)===e;return(n||c)&&l.push({entityId:s,state:o[s]}),l},[])}function G(a,e,t){var s,i;if((s=e.entities)!=null&&s.length)return e.entities.map(n=>{var d;const c=(d=t.states)==null?void 0:d[n];return c?{entityId:n,state:c}:null}).filter(Boolean);const r=new Set(e.exclude_entities??[]),o=e.add_entities??[],l=a.filter(n=>!r.has(n.entityId));for(const n of o){if(l.some(d=>d.entityId===n))continue;const c=(i=t.states)==null?void 0:i[n];c&&l.push({entityId:n,state:c})}return l}function V(a){var t;const e={lights:[],climate:[],temperatures:[],humidities:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],problems:[],others:[]};for(const r of a){const{entityId:o,state:l}=r,s=o.split(".")[0],i=((t=l.attributes)==null?void 0:t.device_class)??"",n=l.state;s==="light"?e.lights.push(r):s==="climate"?e.climate.push(r):s==="sensor"&&i==="temperature"?e.temperatures.push(r):s==="sensor"&&i==="humidity"?e.humidities.push(r):s==="binary_sensor"&&i==="motion"?e.motions.push(r):s==="binary_sensor"&&i==="occupancy"?e.occupancy.push(r):s==="binary_sensor"&&i==="smoke"?e.smokes.push(r):s==="binary_sensor"&&i==="gas"?e.gases.push(r):s==="binary_sensor"&&i==="moisture"?e.moistures.push(r):n==="unavailable"||s==="binary_sensor"&&["problem","tamper","safety"].includes(i)&&n==="on"?e.problems.push(r):e.others.push(r)}return e}const F=`
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

  .chart-stat {
    position: absolute;
    font-size: 9px;
    font-weight: 500;
    color: var(--secondary-text-color, #888);
    opacity: 0.5;
    line-height: 1;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .stat-max    { top: 5px;    right: 7px; }
  .stat-min    { bottom: 5px; right: 7px; }
  .stat-period { bottom: 5px; left:  7px; }

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
`;function L(a){const e=a.map(t=>parseFloat(t.state.state)).filter(t=>!isNaN(t));return e.length?e.reduce((t,r)=>t+r,0)/e.length:null}function _(a){return a.some(e=>e.state.state==="on")}function Z(a){return a.filter(e=>e.state.state==="on")}function J(a){var e;for(const t of a){const r=(e=t.state.attributes)==null?void 0:e.rgb_color;if(r)return`rgb(${r.join(",")})`}return null}function K(a,e){var r;return(((r=e.attributes)==null?void 0:r.friendly_name)??a.split(".")[1]).split(" ").pop()}function P(a,e){var s,i;if((s=e.attributes)!=null&&s.icon)return e.attributes.icon;const t=a.split(".")[0],r=((i=e.attributes)==null?void 0:i.device_class)??"",o=H.has(e.state),l=n=>typeof n=="string"?n:o?n.on:n.off;return r&&O[r]?l(O[r]):z[t]?l(z[t]):"mdi:help-circle-outline"}function N(a,e){a.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function Q(a){history.pushState(null,"",a),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function X(a,e,t=null){if(!(a!=null&&a.length)||a.length<2)return"";const r=300,o=60,l=Math.min(...a),s=Math.max(...a),i=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,l):l,c=((t==null?void 0:t.y_max)!=null?Math.max(t.y_max,s):s)-i||1,d=a.map((h,b)=>b/(a.length-1)*r),u=a.map(h=>o-(h-i)/c*o),m=`${d.map((h,b)=>`${b?"L":"M"}${h.toFixed(1)},${u[b].toFixed(1)}`).join(" ")} V${o} H0 Z`;if(!(t&&(t.threshold_high!=null||t.threshold_low!=null)))return T(r,o,`<path d="${m}" fill="${e}"/>`);const x=t.color??"rgba(3, 169, 244, 0.12)",S=t.color_high??"rgba(244, 67, 54, 0.25)",p=t.color_low??"rgba(33, 150, 243, 0.25)",w=h=>Math.max(0,Math.min(o,o-(h-i)/c*o)),M=`<defs><clipPath id="sg-cp"><path d="${m}"/></clipPath></defs>`;let g=`<path d="${m}" fill="${x}"/>`;if(t.threshold_high!=null){const h=w(t.threshold_high);h>0&&(g+=`<rect x="0" y="0" width="${r}" height="${h.toFixed(1)}" fill="${S}" clip-path="url(#sg-cp)"/>`),h>0&&h<o&&(g+=`<line x1="0" y1="${h.toFixed(1)}" x2="${r}" y2="${h.toFixed(1)}" stroke="${S}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}if(t.threshold_low!=null){const h=w(t.threshold_low);h<o&&(g+=`<rect x="0" y="${h.toFixed(1)}" width="${r}" height="${(o-h).toFixed(1)}" fill="${p}" clip-path="url(#sg-cp)"/>`),h>0&&h<o&&(g+=`<line x1="0" y1="${h.toFixed(1)}" x2="${r}" y2="${h.toFixed(1)}" stroke="${p}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}return T(r,o,M+g)}function T(a,e,t){return`<svg class="bg-chart" viewBox="0 0 ${a} ${e}" preserveAspectRatio="none" aria-hidden="true">${t}</svg>`}function ee(a,e,t=null){var w,M,g,h,b,D,B,j,Y,q;const r=e.area,o=(w=a.areas)==null?void 0:w[r];if(!o&&!e.name&&!((M=e.entities)!=null&&M.length))return{error:r??"(no area)"};const l=(g=e.entities)!=null&&g.length?[]:I(a,r),s=G(l,e,a),i=V(s),n=Z(i.lights),c=J(n),d=L(i.temperatures),u=L(i.humidities),f=i.climate[0]??null,[m,$]=W[(h=f==null?void 0:f.state)==null?void 0:h.state]??[null,null],x=e.mold_threshold??70,S=e.navigate_to||((b=e.tap_action)==null?void 0:b.navigation_path)||null,p=e.history_chart??null;return{areaName:e.name||(o==null?void 0:o.name)||r||"",cardIcon:e.icon||(o==null?void 0:o.icon)||"mdi:home",navPath:S,hasLights:i.lights.length>0,lightCount:n.length,offlineLights:i.lights.filter(y=>y.state.state==="unavailable").length,lightColor:c,occupied:_(i.motions)||_(i.occupancy),hasOccupancySensors:i.motions.length>0||i.occupancy.length>0,problemCount:i.problems.length,tempVal:d,humVal:u,tempUnit:((B=(D=i.temperatures[0])==null?void 0:D.state.attributes)==null?void 0:B.unit_of_measurement)??"°C",tempEntities:i.temperatures,humEntities:i.humidities,climate:f,climIcon:m,climColor:$,smokeOn:_(i.smokes),gasOn:_(i.gases),waterOn:_(i.moistures),moldRisk:u!==null&&u>=x,historyPoints:p!=null&&p.entity_id?t:null,historyColor:(p==null?void 0:p.color)??"rgba(3, 169, 244, 0.12)",historyChart:p,historyMin:p!=null&&p.entity_id&&(t==null?void 0:t.length)>=2?Math.min(...t):null,historyMax:p!=null&&p.entity_id&&(t==null?void 0:t.length)>=2?Math.max(...t):null,historyUnit:((q=(Y=(j=a.states)==null?void 0:j[p==null?void 0:p.entity_id])==null?void 0:Y.attributes)==null?void 0:q.unit_of_measurement)??"",historyHours:(p==null?void 0:p.hours)??24,chipItems:e.show_entities!==!1?i.others.slice(0,e.max_entities??6).map(({entityId:y,state:k})=>{var R;return{entityId:y,isActive:H.has(k.state),icon:P(y,k),label:K(y,k),title:`${((R=k.attributes)==null?void 0:R.friendly_name)??y} — ${k.state}`}}):[]}}function te({areaName:a,cardIcon:e,hasLights:t,lightCount:r,offlineLights:o,occupied:l,hasOccupancySensors:s,problemCount:i}){const n=r===0,c=n?o>0?`${o} light${o!==1?"s":""} offline`:"Lights off":`${r} light${r!==1?"s":""} on${o>0?` · ${o} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${a}</span>
      </div>
      <div class="header-right">
        ${t?`
          <div class="badge badge-lights ${n?"off":""} ${o>0?"has-offline":""}"
               title="${c}">
            <ha-icon icon="mdi:lightbulb${n?"-off":""}"></ha-icon>
            ${r>1?`<span>${r}</span>`:""}
          </div>`:""}
        ${s?`<div class="occupancy-dot ${l?"":"idle"}" title="${l?"Occupied":"Not occupied"}"></div>`:""}
        ${i>0?`
          <div class="badge badge-problems"
               title="${i} problem${i!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${i>1?`<span>${i}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function ae({tempVal:a,humVal:e,tempUnit:t,tempEntities:r,humEntities:o,climate:l,climIcon:s,climColor:i}){var n,c,d,u,f,m,$,x;return a===null&&e===null&&!s?"":`
    <div class="env-row">
      ${a!==null?`
        <div class="env-chip temp"
             data-entity="${((n=r[0])==null?void 0:n.entityId)??""}"
             title="${r.length>1?`Avg of ${r.length} sensors`:((d=(c=r[0])==null?void 0:c.state.attributes)==null?void 0:d.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${a.toFixed(1)}${t}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((u=o[0])==null?void 0:u.entityId)??""}"
             title="${o.length>1?`Avg of ${o.length} sensors`:((m=(f=o[0])==null?void 0:f.state.attributes)==null?void 0:m.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${s?`
        <div class="env-chip climate"
             style="--climate-color: ${i}"
             data-entity="${l.entityId}"
             title="${(($=l.state.attributes)==null?void 0:$.friendly_name)??l.entityId}">
          <ha-icon icon="${s}"></ha-icon>
          <span>${((x=l.state.attributes)==null?void 0:x.current_temperature)!=null?`${l.state.attributes.current_temperature}°`:l.state.state}</span>
        </div>`:""}
    </div>`}function ie({chipItems:a}){return a.length?`
    <div class="entity-chips">
      ${a.map(({entityId:e,isActive:t,icon:r,label:o,title:l})=>`
        <div class="chip${t?" on":""}" data-entity="${e}" title="${l}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="chip-label">${o}</span>
        </div>`).join("")}
    </div>`:""}function re({smokeOn:a,gasOn:e,waterOn:t,moldRisk:r}){return!a&&!e&&!t&&!r?"":`
    <div class="alarm-bar">
      ${a?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${t?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${r?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function oe(a){return`
    <style>${F}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${a}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function ne({historyMin:a,historyMax:e,historyUnit:t,historyHours:r}){return a===null?"":`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">${e.toFixed(1)}${t}</span>
      <span class="chart-stat stat-period">${r}h</span>
      <span class="chart-stat stat-min">${a.toFixed(1)}${t}</span>
    </div>`}function se(a){const e=a.smokeOn||a.gasOn||a.waterOn,t=a.lightColor?`background: linear-gradient(135deg, ${a.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",r=[a.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${F}</style>
    <ha-card
      ${r?`class="${r}"`:""}
      style="${t}"
      ${a.navPath?'role="button" tabindex="0"':""}
      aria-label="${a.areaName}"
    >
      ${a.historyPoints?X(a.historyPoints,a.historyColor,a.historyChart):""}
      ${ne(a)}
      <div class="card-content">
        ${te(a)}
        ${ae(a)}
        ${ie(a)}
        ${re(a)}
      </div>
    </ha-card>`}function le(a,e,t){a.innerHTML=t.error?oe(t.error):se(t),t.error||ce(a,e,t)}function ce(a,e,{navPath:t,chipItems:r}){var l,s;t&&a.querySelector("ha-card").addEventListener("click",i=>{!i.target.closest(".chip")&&!i.target.closest(".env-chip")&&!i.target.closest(".badge-lights")&&Q(t)});const o=a.querySelector(".badge-lights");o&&((l=e._config)!=null&&l.area)&&((s=e._hass)!=null&&s.callService)&&o.addEventListener("click",i=>{i.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})}),a.querySelectorAll(".env-chip[data-entity]").forEach(i=>{const n=i.dataset.entity;n&&i.addEventListener("click",c=>{c.stopPropagation(),N(e,n)})}),a.querySelectorAll(".chip[data-entity]").forEach(i=>{i.addEventListener("click",n=>{n.stopPropagation(),N(e,i.dataset.entity)})})}const A=new Map,C=new Set,v=new Map;function de(a,e,t,r){const o=`${e}:${Math.floor(Date.now()/3e5)}`;if(A.has(o))return A.get(o);if(C.has(o))return v.get(o).add(r),null;if(!(a!=null&&a.callWS))return null;C.add(o),v.set(o,new Set([r]));const l=new Date(Date.now()-t*36e5).toISOString();return a.callWS({type:"history/history_during_period",entity_ids:[e],start_time:l,minimal_response:!0,no_attributes:!0}).then(s=>{const n=(Array.isArray(s==null?void 0:s[e])?s[e]:[]).map(d=>parseFloat(d.s??d.state)).filter(d=>!isNaN(d));A.set(o,n),C.delete(o);const c=v.get(o);v.delete(o),c==null||c.forEach(d=>d(n))}).catch(()=>{C.delete(o),v.delete(o)}),null}class he extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(e){var t;if(!(e!=null&&e.area)&&!((t=e==null?void 0:e.entities)!=null&&t.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._hass&&this._update()}set hass(e){if(this._hass=e,!this._config)return;const t=this._buildHash();t!==this._stateHash&&(this._stateHash=t,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var r,o,l,s;if(!this._hass||!this._config)return"";let e;if((r=this._config.entities)!=null&&r.length)e=this._config.entities.map(i=>{var n;return{entityId:i,state:(n=this._hass.states)==null?void 0:n[i]}}).filter(i=>i.state);else{e=I(this._hass,this._config.area);for(const i of this._config.add_entities??[])if(!e.some(n=>n.entityId===i)){const n=(o=this._hass.states)==null?void 0:o[i];n&&e.push({entityId:i,state:n})}}const t=(l=this._config.history_chart)==null?void 0:l.entity_id;if(t&&!e.some(i=>i.entityId===t)){const i=(s=this._hass.states)==null?void 0:s[t];i&&e.push({entityId:t,state:i})}return e.map(({entityId:i,state:n})=>{var c,d;return`${i}=${n.state}|${((c=n.attributes)==null?void 0:c.rgb_color)??""}|${((d=n.attributes)==null?void 0:d.current_temperature)??""}`}).sort().join(";")}_update(){var o,l;let e=null;const t=(o=this._config)==null?void 0:o.history_chart;t!=null&&t.entity_id&&(e=de(this._hass,t.entity_id,t.hours??24,()=>this._update()));const r=ee(this._hass,this._config,e);(l=this._config)!=null&&l.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:r}),le(this.shadowRoot,this,r)}}window.customCards=window.customCards||[],window.customCards.push({type:E,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${U} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(E,he)})();
