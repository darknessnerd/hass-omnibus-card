(function(){"use strict";const C="hass-omnibus-card",F="1.4.0",A=new Set(["on","open","playing","home","unlocked"]),q={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},E={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:"mdi:battery",connectivity:"mdi:wifi"},H={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted"};function M(t,e){const{entities:o={},devices:r={},states:a={}}=t;return Object.keys(a).reduce((n,s)=>{var d;const i=o[s];if(!i||i.hidden_by)return n;const l=i.area_id===e,c=i.device_id&&((d=r[i.device_id])==null?void 0:d.area_id)===e;return(l||c)&&n.push({entityId:s,state:a[s]}),n},[])}function Y(t,e,o){var s,i;if((s=e.entities)!=null&&s.length)return e.entities.map(l=>{var d;const c=(d=o.states)==null?void 0:d[l];return c?{entityId:l,state:c}:null}).filter(Boolean);const r=new Set(e.exclude_entities??[]),a=e.add_entities??[],n=t.filter(l=>!r.has(l.entityId));for(const l of a){if(n.some(d=>d.entityId===l))continue;const c=(i=o.states)==null?void 0:i[l];c&&n.push({entityId:l,state:c})}return n}function G(t){var o;const e={lights:[],climate:[],temperatures:[],humidities:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],problems:[],others:[]};for(const r of t){const{entityId:a,state:n}=r,s=a.split(".")[0],i=((o=n.attributes)==null?void 0:o.device_class)??"",l=n.state;s==="light"?e.lights.push(r):s==="climate"?e.climate.push(r):s==="sensor"&&i==="temperature"?e.temperatures.push(r):s==="sensor"&&i==="humidity"?e.humidities.push(r):s==="binary_sensor"&&i==="motion"?e.motions.push(r):s==="binary_sensor"&&i==="occupancy"?e.occupancy.push(r):s==="binary_sensor"&&i==="smoke"?e.smokes.push(r):s==="binary_sensor"&&i==="gas"?e.gases.push(r):s==="binary_sensor"&&i==="moisture"?e.moistures.push(r):l==="unavailable"||s==="binary_sensor"&&["problem","tamper","safety"].includes(i)&&l==="on"?e.problems.push(r):e.others.push(r)}return e}const O=`
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
`;function z(t){const e=t.map(o=>parseFloat(o.state.state)).filter(o=>!isNaN(o));return e.length?e.reduce((o,r)=>o+r,0)/e.length:null}function _(t){return t.some(e=>e.state.state==="on")}function R(t){return t.filter(e=>e.state.state==="on")}function W(t){var e;for(const o of t){const r=(e=o.state.attributes)==null?void 0:e.rgb_color;if(r)return`rgb(${r.join(",")})`}return null}function V(t,e){var r;return(((r=e.attributes)==null?void 0:r.friendly_name)??t.split(".")[1]).split(" ").pop()}function U(t,e){var s,i;if((s=e.attributes)!=null&&s.icon)return e.attributes.icon;const o=t.split(".")[0],r=((i=e.attributes)==null?void 0:i.device_class)??"",a=A.has(e.state),n=l=>typeof l=="string"?l:a?l.on:l.off;return r&&E[r]?n(E[r]):H[o]?n(H[o]):"mdi:help-circle-outline"}function I(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function Z(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function J(t,e,o=null){if(!(t!=null&&t.length)||t.length<2)return"";const r=300,a=60,n=Math.min(...t),i=Math.max(...t)-n||1,l=t.map((h,x)=>x/(t.length-1)*r),c=t.map(h=>a-(h-n)/i*a),d=l.map((h,x)=>`${x?"L":"M"}${h.toFixed(1)},${c[x].toFixed(1)}`).join(" ");if(!(o&&(o.threshold_high!=null||o.threshold_low!=null)))return L(r,a,`<path d="${d} V${a} H0 Z" fill="${e}"/>`);const p=o.color??"rgba(3, 169, 244, 0.12)",g=o.color_high??"rgba(244, 67, 54, 0.25)",b=o.color_low??"rgba(33, 150, 243, 0.25)",y=h=>(Math.max(0,Math.min(a,a-(h-n)/i*a))/a*100).toFixed(1),u=[];if(o.threshold_high!=null){const h=y(o.threshold_high);u.push(`<stop offset="0%"   stop-color="${g}"/>`),u.push(`<stop offset="${h}%" stop-color="${g}"/>`),u.push(`<stop offset="${h}%" stop-color="${p}"/>`)}else u.push(`<stop offset="0%"   stop-color="${p}"/>`);if(o.threshold_low!=null){const h=y(o.threshold_low);u.push(`<stop offset="${h}%" stop-color="${p}"/>`),u.push(`<stop offset="${h}%" stop-color="${b}"/>`),u.push(`<stop offset="100%" stop-color="${b}"/>`)}else u.push(`<stop offset="100%" stop-color="${p}"/>`);const f=`<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">${u.join("")}</linearGradient></defs>`;return L(r,a,f+`<path d="${d} V${a} H0 Z" fill="url(#sg)"/>`)}function L(t,e,o){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${o}</svg>`}function K(t,e,o=null){var h,x,N,T,P,D,j;const r=e.area,a=(h=t.areas)==null?void 0:h[r];if(!a&&!e.name&&!((x=e.entities)!=null&&x.length))return{error:r??"(no area)"};const n=(N=e.entities)!=null&&N.length?[]:M(t,r),s=Y(n,e,t),i=G(s),l=R(i.lights),c=W(l),d=z(i.temperatures),m=z(i.humidities),p=i.climate[0]??null,[g,b]=q[(T=p==null?void 0:p.state)==null?void 0:T.state]??[null,null],y=e.mold_threshold??70,u=e.navigate_to||((P=e.tap_action)==null?void 0:P.navigation_path)||null,f=e.history_chart??null;return{areaName:e.name||(a==null?void 0:a.name)||r||"",cardIcon:e.icon||(a==null?void 0:a.icon)||"mdi:home",navPath:u,hasLights:i.lights.length>0,lightCount:l.length,offlineLights:i.lights.filter(v=>v.state.state==="unavailable").length,lightColor:c,occupied:_(i.motions)||_(i.occupancy),hasOccupancySensors:i.motions.length>0||i.occupancy.length>0,problemCount:i.problems.length,tempVal:d,humVal:m,tempUnit:((j=(D=i.temperatures[0])==null?void 0:D.state.attributes)==null?void 0:j.unit_of_measurement)??"°C",tempEntities:i.temperatures,humEntities:i.humidities,climate:p,climIcon:g,climColor:b,smokeOn:_(i.smokes),gasOn:_(i.gases),waterOn:_(i.moistures),moldRisk:m!==null&&m>=y,historyPoints:f!=null&&f.entity_id?o:null,historyColor:(f==null?void 0:f.color)??"rgba(3, 169, 244, 0.12)",historyChart:f,chipItems:e.show_entities!==!1?i.others.slice(0,e.max_entities??6).map(({entityId:v,state:w})=>{var B;return{entityId:v,isActive:A.has(w.state),icon:U(v,w),label:V(v,w),title:`${((B=w.attributes)==null?void 0:B.friendly_name)??v} — ${w.state}`}}):[]}}function Q({areaName:t,cardIcon:e,hasLights:o,lightCount:r,offlineLights:a,occupied:n,hasOccupancySensors:s,problemCount:i}){const l=r===0,c=l?a>0?`${a} light${a!==1?"s":""} offline`:"Lights off":`${r} light${r!==1?"s":""} on${a>0?` · ${a} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${o?`
          <div class="badge badge-lights ${l?"off":""} ${a>0?"has-offline":""}"
               title="${c}">
            <ha-icon icon="mdi:lightbulb${l?"-off":""}"></ha-icon>
            ${r>1?`<span>${r}</span>`:""}
          </div>`:""}
        ${s?`<div class="occupancy-dot ${n?"":"idle"}" title="${n?"Occupied":"Not occupied"}"></div>`:""}
        ${i>0?`
          <div class="badge badge-problems"
               title="${i} problem${i!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${i>1?`<span>${i}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function X({tempVal:t,humVal:e,tempUnit:o,tempEntities:r,humEntities:a,climate:n,climIcon:s,climColor:i}){var l,c,d,m,p,g,b,y;return t===null&&e===null&&!s?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((l=r[0])==null?void 0:l.entityId)??""}"
             title="${r.length>1?`Avg of ${r.length} sensors`:((d=(c=r[0])==null?void 0:c.state.attributes)==null?void 0:d.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${o}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((m=a[0])==null?void 0:m.entityId)??""}"
             title="${a.length>1?`Avg of ${a.length} sensors`:((g=(p=a[0])==null?void 0:p.state.attributes)==null?void 0:g.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${s?`
        <div class="env-chip climate"
             style="--climate-color: ${i}"
             data-entity="${n.entityId}"
             title="${((b=n.state.attributes)==null?void 0:b.friendly_name)??n.entityId}">
          <ha-icon icon="${s}"></ha-icon>
          <span>${((y=n.state.attributes)==null?void 0:y.current_temperature)!=null?`${n.state.attributes.current_temperature}°`:n.state.state}</span>
        </div>`:""}
    </div>`}function ee({chipItems:t}){return t.length?`
    <div class="entity-chips">
      ${t.map(({entityId:e,isActive:o,icon:r,label:a,title:n})=>`
        <div class="chip ${o?"on":""}" data-entity="${e}" title="${n}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="chip-label">${a}</span>
        </div>`).join("")}
    </div>`:""}function te({smokeOn:t,gasOn:e,waterOn:o,moldRisk:r}){return!t&&!e&&!o&&!r?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${o?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${r?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function oe(t){return`
    <style>${O}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function ae(t){const e=t.smokeOn||t.gasOn||t.waterOn,o=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, #fff)) 60%);`:"";return`
    <style>${O}</style>
    <ha-card
      class="${t.navPath?"clickable":""} ${e?"alarm-active":""}"
      style="${o}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?J(t.historyPoints,t.historyColor,t.historyChart):""}
      <div class="card-content">
        ${Q(t)}
        ${X(t)}
        ${ee(t)}
        ${te(t)}
      </div>
    </ha-card>`}function re(t,e,o){t.innerHTML=o.error?oe(o.error):ae(o),o.error||ie(t,e,o)}function ie(t,e,{navPath:o,chipItems:r}){var n,s;o&&t.querySelector("ha-card").addEventListener("click",i=>{!i.target.closest(".chip")&&!i.target.closest(".env-chip")&&!i.target.closest(".badge-lights")&&Z(o)});const a=t.querySelector(".badge-lights");a&&((n=e._config)!=null&&n.area)&&((s=e._hass)!=null&&s.callService)&&a.addEventListener("click",i=>{i.stopPropagation(),e._hass.callService("light","toggle",{area_id:e._config.area})}),t.querySelectorAll(".env-chip[data-entity]").forEach(i=>{const l=i.dataset.entity;l&&i.addEventListener("click",c=>{c.stopPropagation(),I(e,l)})}),t.querySelectorAll(".chip[data-entity]").forEach(i=>{i.addEventListener("click",l=>{l.stopPropagation(),I(e,i.dataset.entity)})})}const S=new Map,k=new Set,$=new Map;function ne(t,e,o,r){const a=`${e}:${Math.floor(Date.now()/3e5)}`;if(S.has(a))return S.get(a);if(k.has(a))return $.get(a).add(r),null;if(!(t!=null&&t.callWS))return null;k.add(a),$.set(a,new Set([r]));const n=new Date(Date.now()-o*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:n,minimal_response:!0,no_attributes:!0}).then(s=>{const l=((s==null?void 0:s[e])??[]).map(d=>parseFloat(d.s)).filter(d=>!isNaN(d));S.set(a,l),k.delete(a);const c=$.get(a);$.delete(a),c==null||c.forEach(d=>d(l))}).catch(()=>{k.delete(a),$.delete(a)}),null}class se extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(e){var o;if(!(e!=null&&e.area)&&!((o=e==null?void 0:e.entities)!=null&&o.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._hass&&this._update()}set hass(e){if(this._hass=e,!this._config)return;const o=this._buildHash();o!==this._stateHash&&(this._stateHash=o,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var o;return!this._hass||!this._config?"":((o=this._config.entities)!=null&&o.length?this._config.entities.map(r=>{var a;return{entityId:r,state:(a=this._hass.states)==null?void 0:a[r]}}).filter(r=>r.state):M(this._hass,this._config.area)).map(({entityId:r,state:a})=>{var n,s;return`${r}=${a.state}|${((n=a.attributes)==null?void 0:n.rgb_color)??""}|${((s=a.attributes)==null?void 0:s.current_temperature)??""}`}).sort().join(";")}_update(){var a;let e=null;const o=(a=this._config)==null?void 0:a.history_chart;o!=null&&o.entity_id&&(e=ne(this._hass,o.entity_id,o.hours??24,()=>this._update()));const r=K(this._hass,this._config,e);re(this.shadowRoot,this,r)}}window.customCards=window.customCards||[],window.customCards.push({type:C,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${F} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(C,se)})();
