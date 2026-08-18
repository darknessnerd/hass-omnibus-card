(function(){"use strict";const A="hass-omnibus-card",j="1.5.0",E=new Set(["on","open","playing","home","unlocked"]),Y={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},H={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:"mdi:battery",connectivity:"mdi:wifi"},M={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted"};function O(t,e){const{entities:a={},devices:i={},states:r={}}=t;return Object.keys(r).reduce((n,s)=>{var d;const o=a[s];if(!o||o.hidden_by)return n;const l=o.area_id===e,c=o.device_id&&((d=i[o.device_id])==null?void 0:d.area_id)===e;return(l||c)&&n.push({entityId:s,state:r[s]}),n},[])}function q(t,e,a){var s,o;if((s=e.entities)!=null&&s.length)return e.entities.map(l=>{var d;const c=(d=a.states)==null?void 0:d[l];return c?{entityId:l,state:c}:null}).filter(Boolean);const i=new Set(e.exclude_entities??[]),r=e.add_entities??[],n=t.filter(l=>!i.has(l.entityId));for(const l of r){if(n.some(d=>d.entityId===l))continue;const c=(o=a.states)==null?void 0:o[l];c&&n.push({entityId:l,state:c})}return n}function R(t){var a;const e={lights:[],climate:[],temperatures:[],humidities:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],problems:[],others:[]};for(const i of t){const{entityId:r,state:n}=i,s=r.split(".")[0],o=((a=n.attributes)==null?void 0:a.device_class)??"",l=n.state;s==="light"?e.lights.push(i):s==="climate"?e.climate.push(i):s==="sensor"&&o==="temperature"?e.temperatures.push(i):s==="sensor"&&o==="humidity"?e.humidities.push(i):s==="binary_sensor"&&o==="motion"?e.motions.push(i):s==="binary_sensor"&&o==="occupancy"?e.occupancy.push(i):s==="binary_sensor"&&o==="smoke"?e.smokes.push(i):s==="binary_sensor"&&o==="gas"?e.gases.push(i):s==="binary_sensor"&&o==="moisture"?e.moistures.push(i):l==="unavailable"||s==="binary_sensor"&&["problem","tamper","safety"].includes(o)&&l==="on"?e.problems.push(i):e.others.push(i)}return e}const z=`
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
`;function L(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,i)=>a+i,0)/e.length:null}function _(t){return t.some(e=>e.state.state==="on")}function W(t){return t.filter(e=>e.state.state==="on")}function G(t){var e;for(const a of t){const i=(e=a.state.attributes)==null?void 0:e.rgb_color;if(i)return`rgb(${i.join(",")})`}return null}function U(t,e){var i;return(((i=e.attributes)==null?void 0:i.friendly_name)??t.split(".")[1]).split(" ").pop()}function V(t,e){var s,o;if((s=e.attributes)!=null&&s.icon)return e.attributes.icon;const a=t.split(".")[0],i=((o=e.attributes)==null?void 0:o.device_class)??"",r=E.has(e.state),n=l=>typeof l=="string"?l:r?l.on:l.off;return i&&H[i]?n(H[i]):M[a]?n(M[a]):"mdi:help-circle-outline"}function I(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function Z(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function J(t,e,a=null){if(!(t!=null&&t.length)||t.length<2)return"";const i=300,r=60,n=Math.min(...t),o=Math.max(...t)-n||1,l=t.map((h,m)=>m/(t.length-1)*i),c=t.map(h=>r-(h-n)/o*r),p=`${l.map((h,m)=>`${m?"L":"M"}${h.toFixed(1)},${c[m].toFixed(1)}`).join(" ")} V${r} H0 Z`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null)))return N(i,r,`<path d="${p}" fill="${e}"/>`);const g=a.color??"rgba(3, 169, 244, 0.12)",b=a.color_high??"rgba(244, 67, 54, 0.25)",y=a.color_low??"rgba(33, 150, 243, 0.25)",S=h=>Math.max(0,Math.min(r,r-(h-n)/o*r)),u=`<defs><clipPath id="sg-cp"><path d="${p}"/></clipPath></defs>`;let x=`<path d="${p}" fill="${g}"/>`;if(a.threshold_high!=null){const h=S(a.threshold_high);h>0&&(x+=`<rect x="0" y="0" width="${i}" height="${h.toFixed(1)}" fill="${b}" clip-path="url(#sg-cp)"/>`)}if(a.threshold_low!=null){const h=S(a.threshold_low);h<r&&(x+=`<rect x="0" y="${h.toFixed(1)}" width="${i}" height="${(r-h).toFixed(1)}" fill="${y}" clip-path="url(#sg-cp)"/>`)}return N(i,r,u+x)}function N(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function K(t,e,a=null){var x,h,m,P,T,D,F;const i=e.area,r=(x=t.areas)==null?void 0:x[i];if(!r&&!e.name&&!((h=e.entities)!=null&&h.length))return{error:i??"(no area)"};const n=(m=e.entities)!=null&&m.length?[]:O(t,i),s=q(n,e,t),o=R(s),l=W(o.lights),c=G(l),d=L(o.temperatures),p=L(o.humidities),f=o.climate[0]??null,[g,b]=Y[(P=f==null?void 0:f.state)==null?void 0:P.state]??[null,null],y=e.mold_threshold??70,S=e.navigate_to||((T=e.tap_action)==null?void 0:T.navigation_path)||null,u=e.history_chart??null;return{areaName:e.name||(r==null?void 0:r.name)||i||"",cardIcon:e.icon||(r==null?void 0:r.icon)||"mdi:home",navPath:S,hasLights:o.lights.length>0,lightCount:l.length,offlineLights:o.lights.filter(v=>v.state.state==="unavailable").length,lightColor:c,occupied:_(o.motions)||_(o.occupancy),hasOccupancySensors:o.motions.length>0||o.occupancy.length>0,problemCount:o.problems.length,tempVal:d,humVal:p,tempUnit:((F=(D=o.temperatures[0])==null?void 0:D.state.attributes)==null?void 0:F.unit_of_measurement)??"°C",tempEntities:o.temperatures,humEntities:o.humidities,climate:f,climIcon:g,climColor:b,smokeOn:_(o.smokes),gasOn:_(o.gases),waterOn:_(o.moistures),moldRisk:p!==null&&p>=y,historyPoints:u!=null&&u.entity_id?a:null,historyColor:(u==null?void 0:u.color)??"rgba(3, 169, 244, 0.12)",historyChart:u,chipItems:e.show_entities!==!1?o.others.slice(0,e.max_entities??6).map(({entityId:v,state:$})=>{var B;return{entityId:v,isActive:E.has($.state),icon:V(v,$),label:U(v,$),title:`${((B=$.attributes)==null?void 0:B.friendly_name)??v} — ${$.state}`}}):[]}}function Q({areaName:t,cardIcon:e,hasLights:a,lightCount:i,offlineLights:r,occupied:n,hasOccupancySensors:s,problemCount:o}){const l=i===0,c=l?r>0?`${r} light${r!==1?"s":""} offline`:"Lights off":`${i} light${i!==1?"s":""} on${r>0?` · ${r} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${l?"off":""} ${r>0?"has-offline":""}"
               title="${c}">
            <ha-icon icon="mdi:lightbulb${l?"-off":""}"></ha-icon>
            ${i>1?`<span>${i}</span>`:""}
          </div>`:""}
        ${s?`<div class="occupancy-dot ${n?"":"idle"}" title="${n?"Occupied":"Not occupied"}"></div>`:""}
        ${o>0?`
          <div class="badge badge-problems"
               title="${o} problem${o!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${o>1?`<span>${o}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function X({tempVal:t,humVal:e,tempUnit:a,tempEntities:i,humEntities:r,climate:n,climIcon:s,climColor:o}){var l,c,d,p,f,g,b,y;return t===null&&e===null&&!s?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((l=i[0])==null?void 0:l.entityId)??""}"
             title="${i.length>1?`Avg of ${i.length} sensors`:((d=(c=i[0])==null?void 0:c.state.attributes)==null?void 0:d.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((p=r[0])==null?void 0:p.entityId)??""}"
             title="${r.length>1?`Avg of ${r.length} sensors`:((g=(f=r[0])==null?void 0:f.state.attributes)==null?void 0:g.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${s?`
        <div class="env-chip climate"
             style="--climate-color: ${o}"
             data-entity="${n.entityId}"
             title="${((b=n.state.attributes)==null?void 0:b.friendly_name)??n.entityId}">
          <ha-icon icon="${s}"></ha-icon>
          <span>${((y=n.state.attributes)==null?void 0:y.current_temperature)!=null?`${n.state.attributes.current_temperature}°`:n.state.state}</span>
        </div>`:""}
    </div>`}function ee({chipItems:t}){return t.length?`
    <div class="entity-chips">
      ${t.map(({entityId:e,isActive:a,icon:i,label:r,title:n})=>`
        <div class="chip ${a?"on":""}" data-entity="${e}" title="${n}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="chip-label">${r}</span>
        </div>`).join("")}
    </div>`:""}function te({smokeOn:t,gasOn:e,waterOn:a,moldRisk:i}){return!t&&!e&&!a&&!i?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${i?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function ae(t){return`
    <style>${z}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function ie(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, #fff)) 60%);`:"";return`
    <style>${z}</style>
    <ha-card
      class="${t.navPath?"clickable":""} ${e?"alarm-active":""}"
      style="${a}"
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
    </ha-card>`}function re(t,e,a){t.innerHTML=a.error?ae(a.error):ie(a),a.error||oe(t,e,a)}function oe(t,e,{navPath:a,chipItems:i}){var n,s;a&&t.querySelector("ha-card").addEventListener("click",o=>{!o.target.closest(".chip")&&!o.target.closest(".env-chip")&&!o.target.closest(".badge-lights")&&Z(a)});const r=t.querySelector(".badge-lights");r&&((n=e._config)!=null&&n.area)&&((s=e._hass)!=null&&s.callService)&&r.addEventListener("click",o=>{o.stopPropagation(),e._hass.callService("light","toggle",{area_id:e._config.area})}),t.querySelectorAll(".env-chip[data-entity]").forEach(o=>{const l=o.dataset.entity;l&&o.addEventListener("click",c=>{c.stopPropagation(),I(e,l)})}),t.querySelectorAll(".chip[data-entity]").forEach(o=>{o.addEventListener("click",l=>{l.stopPropagation(),I(e,o.dataset.entity)})})}const C=new Map,k=new Set,w=new Map;function ne(t,e,a,i){const r=`${e}:${Math.floor(Date.now()/3e5)}`;if(C.has(r))return C.get(r);if(k.has(r))return w.get(r).add(i),null;if(!(t!=null&&t.callWS))return null;k.add(r),w.set(r,new Set([i]));const n=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:n,minimal_response:!0,no_attributes:!0}).then(s=>{const l=((s==null?void 0:s[e])??[]).map(d=>parseFloat(d.s)).filter(d=>!isNaN(d));C.set(r,l),k.delete(r);const c=w.get(r);w.delete(r),c==null||c.forEach(d=>d(l))}).catch(()=>{k.delete(r),w.delete(r)}),null}class se extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(e){var a;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._hass&&this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var a;return!this._hass||!this._config?"":((a=this._config.entities)!=null&&a.length?this._config.entities.map(i=>{var r;return{entityId:i,state:(r=this._hass.states)==null?void 0:r[i]}}).filter(i=>i.state):O(this._hass,this._config.area)).map(({entityId:i,state:r})=>{var n,s;return`${i}=${r.state}|${((n=r.attributes)==null?void 0:n.rgb_color)??""}|${((s=r.attributes)==null?void 0:s.current_temperature)??""}`}).sort().join(";")}_update(){var r;let e=null;const a=(r=this._config)==null?void 0:r.history_chart;a!=null&&a.entity_id&&(e=ne(this._hass,a.entity_id,a.hours??24,()=>this._update()));const i=K(this._hass,this._config,e);re(this.shadowRoot,this,i)}}window.customCards=window.customCards||[],window.customCards.push({type:A,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${j} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(A,se)})();
