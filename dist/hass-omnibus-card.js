(function(){"use strict";const A="hass-omnibus-card",U="1.5.0",E=new Set(["on","open","playing","home","unlocked"]),W={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},M={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:"mdi:battery",connectivity:"mdi:wifi"},H={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted"};function O(t,e){const{entities:a={},devices:r={},states:o={}}=t;return Object.keys(o).reduce((l,s)=>{var h;const i=a[s];if(!i||i.hidden_by)return l;const n=i.area_id===e,c=i.device_id&&((h=r[i.device_id])==null?void 0:h.area_id)===e;return(n||c)&&l.push({entityId:s,state:o[s]}),l},[])}function G(t,e,a){var s,i;if((s=e.entities)!=null&&s.length)return e.entities.map(n=>{var h;const c=(h=a.states)==null?void 0:h[n];return c?{entityId:n,state:c}:null}).filter(Boolean);const r=new Set(e.exclude_entities??[]),o=e.add_entities??[],l=t.filter(n=>!r.has(n.entityId));for(const n of o){if(l.some(h=>h.entityId===n))continue;const c=(i=a.states)==null?void 0:i[n];c&&l.push({entityId:n,state:c})}return l}function V(t){var a;const e={lights:[],climate:[],temperatures:[],humidities:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],problems:[],others:[]};for(const r of t){const{entityId:o,state:l}=r,s=o.split(".")[0],i=((a=l.attributes)==null?void 0:a.device_class)??"",n=l.state;s==="light"?e.lights.push(r):s==="climate"?e.climate.push(r):s==="sensor"&&i==="temperature"?e.temperatures.push(r):s==="sensor"&&i==="humidity"?e.humidities.push(r):s==="binary_sensor"&&i==="motion"?e.motions.push(r):s==="binary_sensor"&&i==="occupancy"?e.occupancy.push(r):s==="binary_sensor"&&i==="smoke"?e.smokes.push(r):s==="binary_sensor"&&i==="gas"?e.gases.push(r):s==="binary_sensor"&&i==="moisture"?e.moistures.push(r):n==="unavailable"||s==="binary_sensor"&&["problem","tamper","safety"].includes(i)&&n==="on"?e.problems.push(r):e.others.push(r)}return e}const z=`
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
    color: rgba(255, 255, 255, 0.28);
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
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
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
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
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
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
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
`;function I(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,r)=>a+r,0)/e.length:null}function v(t){return t.some(e=>e.state.state==="on")}function Z(t){return t.filter(e=>e.state.state==="on")}function J(t){var e;for(const a of t){const r=(e=a.state.attributes)==null?void 0:e.rgb_color;if(r)return`rgb(${r.join(",")})`}return null}function K(t,e){var r;return(((r=e.attributes)==null?void 0:r.friendly_name)??t.split(".")[1]).split(" ").pop()}function P(t,e){var s,i;if((s=e.attributes)!=null&&s.icon)return e.attributes.icon;const a=t.split(".")[0],r=((i=e.attributes)==null?void 0:i.device_class)??"",o=E.has(e.state),l=n=>typeof n=="string"?n:o?n.on:n.off;return r&&M[r]?l(M[r]):H[a]?l(H[a]):"mdi:help-circle-outline"}function F(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function Q(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function X(t,e,a=null){if(!(t!=null&&t.length)||t.length<2)return"";const r=300,o=60,l=Math.min(...t),i=Math.max(...t)-l||1,n=t.map((d,x)=>x/(t.length-1)*r),c=t.map(d=>o-(d-l)/i*o),u=`${n.map((d,x)=>`${x?"L":"M"}${d.toFixed(1)},${c[x].toFixed(1)}`).join(" ")} V${o} H0 Z`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null)))return L(r,o,`<path d="${u}" fill="${e}"/>`);const y=a.color??"rgba(3, 169, 244, 0.12)",g=a.color_high??"rgba(244, 67, 54, 0.25)",b=a.color_low??"rgba(33, 150, 243, 0.25)",S=d=>Math.max(0,Math.min(o,o-(d-l)/i*o)),p=`<defs><clipPath id="sg-cp"><path d="${u}"/></clipPath></defs>`;let m=`<path d="${u}" fill="${y}"/>`;if(a.threshold_high!=null){const d=S(a.threshold_high);d>0&&(m+=`<rect x="0" y="0" width="${r}" height="${d.toFixed(1)}" fill="${g}" clip-path="url(#sg-cp)"/>`),d>0&&d<o&&(m+=`<line x1="0" y1="${d.toFixed(1)}" x2="${r}" y2="${d.toFixed(1)}" stroke="${g}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}if(a.threshold_low!=null){const d=S(a.threshold_low);d<o&&(m+=`<rect x="0" y="${d.toFixed(1)}" width="${r}" height="${(o-d).toFixed(1)}" fill="${b}" clip-path="url(#sg-cp)"/>`),d>0&&d<o&&(m+=`<line x1="0" y1="${d.toFixed(1)}" x2="${r}" y2="${d.toFixed(1)}" stroke="${b}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}return L(r,o,p+m)}function L(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function ee(t,e,a=null){var m,d,x,N,T,D,B,j,Y,q;const r=e.area,o=(m=t.areas)==null?void 0:m[r];if(!o&&!e.name&&!((d=e.entities)!=null&&d.length))return{error:r??"(no area)"};const l=(x=e.entities)!=null&&x.length?[]:O(t,r),s=G(l,e,t),i=V(s),n=Z(i.lights),c=J(n),h=I(i.temperatures),u=I(i.humidities),f=i.climate[0]??null,[y,g]=W[(N=f==null?void 0:f.state)==null?void 0:N.state]??[null,null],b=e.mold_threshold??70,S=e.navigate_to||((T=e.tap_action)==null?void 0:T.navigation_path)||null,p=e.history_chart??null;return{areaName:e.name||(o==null?void 0:o.name)||r||"",cardIcon:e.icon||(o==null?void 0:o.icon)||"mdi:home",navPath:S,hasLights:i.lights.length>0,lightCount:n.length,offlineLights:i.lights.filter(_=>_.state.state==="unavailable").length,lightColor:c,occupied:v(i.motions)||v(i.occupancy),hasOccupancySensors:i.motions.length>0||i.occupancy.length>0,problemCount:i.problems.length,tempVal:h,humVal:u,tempUnit:((B=(D=i.temperatures[0])==null?void 0:D.state.attributes)==null?void 0:B.unit_of_measurement)??"°C",tempEntities:i.temperatures,humEntities:i.humidities,climate:f,climIcon:y,climColor:g,smokeOn:v(i.smokes),gasOn:v(i.gases),waterOn:v(i.moistures),moldRisk:u!==null&&u>=b,historyPoints:p!=null&&p.entity_id?a:null,historyColor:(p==null?void 0:p.color)??"rgba(3, 169, 244, 0.12)",historyChart:p,historyMin:p!=null&&p.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a):null,historyMax:p!=null&&p.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a):null,historyUnit:((q=(Y=(j=t.states)==null?void 0:j[p==null?void 0:p.entity_id])==null?void 0:Y.attributes)==null?void 0:q.unit_of_measurement)??"",historyHours:(p==null?void 0:p.hours)??24,chipItems:e.show_entities!==!1?i.others.slice(0,e.max_entities??6).map(({entityId:_,state:w})=>{var R;return{entityId:_,isActive:E.has(w.state),icon:P(_,w),label:K(_,w),title:`${((R=w.attributes)==null?void 0:R.friendly_name)??_} — ${w.state}`}}):[]}}function te({areaName:t,cardIcon:e,hasLights:a,lightCount:r,offlineLights:o,occupied:l,hasOccupancySensors:s,problemCount:i}){const n=r===0,c=n?o>0?`${o} light${o!==1?"s":""} offline`:"Lights off":`${r} light${r!==1?"s":""} on${o>0?` · ${o} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
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
    </div>`}function ae({tempVal:t,humVal:e,tempUnit:a,tempEntities:r,humEntities:o,climate:l,climIcon:s,climColor:i}){var n,c,h,u,f,y,g,b;return t===null&&e===null&&!s?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((n=r[0])==null?void 0:n.entityId)??""}"
             title="${r.length>1?`Avg of ${r.length} sensors`:((h=(c=r[0])==null?void 0:c.state.attributes)==null?void 0:h.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((u=o[0])==null?void 0:u.entityId)??""}"
             title="${o.length>1?`Avg of ${o.length} sensors`:((y=(f=o[0])==null?void 0:f.state.attributes)==null?void 0:y.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${s?`
        <div class="env-chip climate"
             style="--climate-color: ${i}"
             data-entity="${l.entityId}"
             title="${((g=l.state.attributes)==null?void 0:g.friendly_name)??l.entityId}">
          <ha-icon icon="${s}"></ha-icon>
          <span>${((b=l.state.attributes)==null?void 0:b.current_temperature)!=null?`${l.state.attributes.current_temperature}°`:l.state.state}</span>
        </div>`:""}
    </div>`}function ie({chipItems:t}){return t.length?`
    <div class="entity-chips">
      ${t.map(({entityId:e,isActive:a,icon:r,label:o,title:l})=>`
        <div class="chip ${a?"on":""}" data-entity="${e}" title="${l}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="chip-label">${o}</span>
        </div>`).join("")}
    </div>`:""}function re({smokeOn:t,gasOn:e,waterOn:a,moldRisk:r}){return!t&&!e&&!a&&!r?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${r?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function oe(t){return`
    <style>${z}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function ne({historyMin:t,historyMax:e,historyUnit:a,historyHours:r}){return t===null?"":`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period">${r}h</span>
      <span class="chart-stat stat-min">${t.toFixed(1)}${a}</span>
    </div>`}function se(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, #fff)) 60%);`:"";return`
    <style>${z}</style>
    <ha-card
      class="${t.navPath?"clickable":""} ${e?"alarm-active":""}"
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?X(t.historyPoints,t.historyColor,t.historyChart):""}
      ${ne(t)}
      <div class="card-content">
        ${te(t)}
        ${ae(t)}
        ${ie(t)}
        ${re(t)}
      </div>
    </ha-card>`}function le(t,e,a){t.innerHTML=a.error?oe(a.error):se(a),a.error||ce(t,e,a)}function ce(t,e,{navPath:a,chipItems:r}){var l,s;a&&t.querySelector("ha-card").addEventListener("click",i=>{!i.target.closest(".chip")&&!i.target.closest(".env-chip")&&!i.target.closest(".badge-lights")&&Q(a)});const o=t.querySelector(".badge-lights");o&&((l=e._config)!=null&&l.area)&&((s=e._hass)!=null&&s.callService)&&o.addEventListener("click",i=>{i.stopPropagation(),e._hass.callService("light","toggle",{area_id:e._config.area})}),t.querySelectorAll(".env-chip[data-entity]").forEach(i=>{const n=i.dataset.entity;n&&i.addEventListener("click",c=>{c.stopPropagation(),F(e,n)})}),t.querySelectorAll(".chip[data-entity]").forEach(i=>{i.addEventListener("click",n=>{n.stopPropagation(),F(e,i.dataset.entity)})})}const C=new Map,k=new Set,$=new Map;function de(t,e,a,r){const o=`${e}:${Math.floor(Date.now()/3e5)}`;if(C.has(o))return C.get(o);if(k.has(o))return $.get(o).add(r),null;if(!(t!=null&&t.callWS))return null;k.add(o),$.set(o,new Set([r]));const l=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:l,minimal_response:!0,no_attributes:!0}).then(s=>{const n=(Array.isArray(s==null?void 0:s[e])?s[e]:[]).map(h=>parseFloat(h.s??h.state)).filter(h=>!isNaN(h));C.set(o,n),k.delete(o);const c=$.get(o);$.delete(o),c==null||c.forEach(h=>h(n))}).catch(()=>{k.delete(o),$.delete(o)}),null}class he extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(e){var a;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._hass&&this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var r,o,l,s;if(!this._hass||!this._config)return"";let e;if((r=this._config.entities)!=null&&r.length)e=this._config.entities.map(i=>{var n;return{entityId:i,state:(n=this._hass.states)==null?void 0:n[i]}}).filter(i=>i.state);else{e=O(this._hass,this._config.area);for(const i of this._config.add_entities??[])if(!e.some(n=>n.entityId===i)){const n=(o=this._hass.states)==null?void 0:o[i];n&&e.push({entityId:i,state:n})}}const a=(l=this._config.history_chart)==null?void 0:l.entity_id;if(a&&!e.some(i=>i.entityId===a)){const i=(s=this._hass.states)==null?void 0:s[a];i&&e.push({entityId:a,state:i})}return e.map(({entityId:i,state:n})=>{var c,h;return`${i}=${n.state}|${((c=n.attributes)==null?void 0:c.rgb_color)??""}|${((h=n.attributes)==null?void 0:h.current_temperature)??""}`}).sort().join(";")}_update(){var o;let e=null;const a=(o=this._config)==null?void 0:o.history_chart;a!=null&&a.entity_id&&(e=de(this._hass,a.entity_id,a.hours??24,()=>this._update()));const r=ee(this._hass,this._config,e);le(this.shadowRoot,this,r)}}window.customCards=window.customCards||[],window.customCards.push({type:A,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${U} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(A,he)})();
