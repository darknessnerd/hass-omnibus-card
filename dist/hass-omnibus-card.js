(function(){"use strict";const x="hass-omnibus-card",L="1.1.0",y=new Set(["on","open","playing","home","unlocked"]),I={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},w={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:"mdi:battery",connectivity:"mdi:wifi"},_={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted"};function $(a,e){const{entities:t={},devices:i={},states:o={}}=a;return Object.keys(o).reduce((r,n)=>{var l;const s=t[n];if(!s||s.hidden_by)return r;const c=s.area_id===e,d=s.device_id&&((l=i[s.device_id])==null?void 0:l.area_id)===e;return(c||d)&&r.push({entityId:n,state:o[n]}),r},[])}function M(a){var t;const e={lights:[],climate:[],temperatures:[],humidities:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],problems:[],others:[]};for(const i of a){const{entityId:o,state:r}=i,n=o.split(".")[0],s=((t=r.attributes)==null?void 0:t.device_class)??"",c=r.state;n==="light"?e.lights.push(i):n==="climate"?e.climate.push(i):n==="sensor"&&s==="temperature"?e.temperatures.push(i):n==="sensor"&&s==="humidity"?e.humidities.push(i):n==="binary_sensor"&&s==="motion"?e.motions.push(i):n==="binary_sensor"&&s==="occupancy"?e.occupancy.push(i):n==="binary_sensor"&&s==="smoke"?e.smokes.push(i):n==="binary_sensor"&&s==="gas"?e.gases.push(i):n==="binary_sensor"&&s==="moisture"?e.moistures.push(i):c==="unavailable"||n==="binary_sensor"&&["problem","tamper","safety"].includes(s)&&c==="on"?e.problems.push(i):e.others.push(i)}return e}const k=`
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

  .card-content {
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
  }

  .badge-problems {
    background: rgba(244, 67, 54, 0.15);
    color: var(--error-color, #f44336);
  }

  /* Occupancy green pulse dot */
  .occupancy-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--success-color, #4caf50);
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.7);
    animation: occ-blink 3s ease-in-out infinite;
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
`;function C(a){const e=a.map(t=>parseFloat(t.state.state)).filter(t=>!isNaN(t));return e.length?e.reduce((t,i)=>t+i,0)/e.length:null}function p(a){return a.some(e=>e.state.state==="on")}function N(a){return a.filter(e=>e.state.state==="on")}function T(a){var e;for(const t of a){const i=(e=t.state.attributes)==null?void 0:e.rgb_color;if(i)return`rgb(${i.join(",")})`}return null}function D(a,e){var i;return(((i=e.attributes)==null?void 0:i.friendly_name)??a.split(".")[1]).split(" ").pop()}function j(a,e){var n,s;if((n=e.attributes)!=null&&n.icon)return e.attributes.icon;const t=a.split(".")[0],i=((s=e.attributes)==null?void 0:s.device_class)??"",o=y.has(e.state),r=c=>typeof c=="string"?c:o?c.on:c.off;return i&&w[i]?r(w[i]):_[t]?r(_[t]):"mdi:help-circle-outline"}function A(a,e){a.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function P(a){history.pushState(null,"",a),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function Y(a,e){var u,E,S,H,O;const t=e.area,i=(u=a.areas)==null?void 0:u[t];if(!i&&!e.name)return{error:t};const o=$(a,t),r=M(o),n=N(r.lights),s=T(n),c=C(r.temperatures),d=C(r.humidities),l=r.climate[0]??null,[m,f]=I[(E=l==null?void 0:l.state)==null?void 0:E.state]??[null,null],b=e.mold_threshold??70,g=e.navigate_to||((S=e.tap_action)==null?void 0:S.navigation_path)||null;return{areaName:e.name||(i==null?void 0:i.name)||t,cardIcon:e.icon||(i==null?void 0:i.icon)||"mdi:home",navPath:g,lightCount:n.length,lightColor:s,occupied:p(r.motions)||p(r.occupancy),problemCount:r.problems.length,tempVal:c,humVal:d,tempUnit:((O=(H=r.temperatures[0])==null?void 0:H.state.attributes)==null?void 0:O.unit_of_measurement)??"°C",tempEntities:r.temperatures,humEntities:r.humidities,climate:l,climIcon:m,climColor:f,smokeOn:p(r.smokes),gasOn:p(r.gases),waterOn:p(r.moistures),moldRisk:d!==null&&d>=b,chipItems:e.show_entities!==!1?r.others.slice(0,e.max_entities??6).map(({entityId:v,state:h})=>{var z;return{entityId:v,isActive:y.has(h.state),icon:j(v,h),label:D(v,h),title:`${((z=h.attributes)==null?void 0:z.friendly_name)??v} — ${h.state}`}}):[]}}function q({areaName:a,cardIcon:e,lightCount:t,occupied:i,problemCount:o}){return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${a}</span>
      </div>
      <div class="header-right">
        ${t>0?`
          <div class="badge badge-lights"
               title="${t} light${t!==1?"s":""} on">
            <ha-icon icon="mdi:lightbulb"></ha-icon>
            ${t>1?`<span>${t}</span>`:""}
          </div>`:""}
        ${i?'<div class="occupancy-dot" title="Occupied"></div>':""}
        ${o>0?`
          <div class="badge badge-problems"
               title="${o} problem${o!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${o>1?`<span>${o}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function B({tempVal:a,humVal:e,tempUnit:t,tempEntities:i,humEntities:o,climate:r,climIcon:n,climColor:s}){var c,d,l,m,f,b,g,u;return a===null&&e===null&&!n?"":`
    <div class="env-row">
      ${a!==null?`
        <div class="env-chip temp"
             data-entity="${((c=i[0])==null?void 0:c.entityId)??""}"
             title="${i.length>1?`Avg of ${i.length} sensors`:((l=(d=i[0])==null?void 0:d.state.attributes)==null?void 0:l.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${a.toFixed(1)}${t}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((m=o[0])==null?void 0:m.entityId)??""}"
             title="${o.length>1?`Avg of ${o.length} sensors`:((b=(f=o[0])==null?void 0:f.state.attributes)==null?void 0:b.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${n?`
        <div class="env-chip climate"
             style="--climate-color: ${s}"
             data-entity="${r.entityId}"
             title="${((g=r.state.attributes)==null?void 0:g.friendly_name)??r.entityId}">
          <ha-icon icon="${n}"></ha-icon>
          <span>${((u=r.state.attributes)==null?void 0:u.current_temperature)!=null?`${r.state.attributes.current_temperature}°`:r.state.state}</span>
        </div>`:""}
    </div>`}function R({chipItems:a}){return a.length?`
    <div class="entity-chips">
      ${a.map(({entityId:e,isActive:t,icon:i,label:o,title:r})=>`
        <div class="chip ${t?"on":""}" data-entity="${e}" title="${r}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="chip-label">${o}</span>
        </div>`).join("")}
    </div>`:""}function F({smokeOn:a,gasOn:e,waterOn:t,moldRisk:i}){return!a&&!e&&!t&&!i?"":`
    <div class="alarm-bar">
      ${a?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${t?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${i?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function G(a){return`
    <style>${k}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${a}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function U(a){const e=a.smokeOn||a.gasOn||a.waterOn,t=a.lightColor?`background: linear-gradient(135deg, ${a.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, #fff)) 60%);`:"";return`
    <style>${k}</style>
    <ha-card
      class="${a.navPath?"clickable":""} ${e?"alarm-active":""}"
      style="${t}"
      ${a.navPath?'role="button" tabindex="0"':""}
      aria-label="${a.areaName}"
    >
      <div class="card-content">
        ${q(a)}
        ${B(a)}
        ${R(a)}
        ${F(a)}
      </div>
    </ha-card>`}function V(a,e,t){a.innerHTML=t.error?G(t.error):U(t),t.error||W(a,e,t)}function W(a,e,{navPath:t,chipItems:i}){t&&a.querySelector("ha-card").addEventListener("click",o=>{!o.target.closest(".chip")&&!o.target.closest(".env-chip")&&P(t)}),a.querySelectorAll(".env-chip[data-entity]").forEach(o=>{const r=o.dataset.entity;r&&o.addEventListener("click",n=>{n.stopPropagation(),A(e,r)})}),a.querySelectorAll(".chip[data-entity]").forEach(o=>{o.addEventListener("click",r=>{r.stopPropagation(),A(e,o.dataset.entity)})})}class J extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(e){if(!(e!=null&&e.area))throw new Error('[hass-omnibus-card] Missing required field: "area"');this._config={...e},this._stateHash=null,this._hass&&this._update()}set hass(e){if(this._hass=e,!this._config)return;const t=this._buildHash();t!==this._stateHash&&(this._stateHash=t,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){return!this._hass||!this._config?"":$(this._hass,this._config.area).map(({entityId:e,state:t})=>{var i,o;return`${e}=${t.state}|${((i=t.attributes)==null?void 0:i.rgb_color)??""}|${((o=t.attributes)==null?void 0:o.current_temperature)??""}`}).sort().join(";")}_update(){const e=Y(this._hass,this._config);V(this.shadowRoot,this,e)}}window.customCards=window.customCards||[],window.customCards.push({type:x,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${L} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(x,J)})();
