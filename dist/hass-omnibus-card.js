(function(){"use strict";const x="hass-omnibus-card",N="1.2.0",y=new Set(["on","open","playing","home","unlocked"]),T={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},_={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:"mdi:battery",connectivity:"mdi:wifi"},w={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted"};function $(t,e){const{entities:a={},devices:i={},states:o={}}=t;return Object.keys(o).reduce((n,r)=>{var l;const s=a[r];if(!s||s.hidden_by)return n;const c=s.area_id===e,d=s.device_id&&((l=i[s.device_id])==null?void 0:l.area_id)===e;return(c||d)&&n.push({entityId:r,state:o[r]}),n},[])}function D(t,e,a){var r,s;if((r=e.entities)!=null&&r.length)return e.entities.map(c=>{var l;const d=(l=a.states)==null?void 0:l[c];return d?{entityId:c,state:d}:null}).filter(Boolean);const i=new Set(e.exclude_entities??[]),o=e.add_entities??[],n=t.filter(c=>!i.has(c.entityId));for(const c of o){if(n.some(l=>l.entityId===c))continue;const d=(s=a.states)==null?void 0:s[c];d&&n.push({entityId:c,state:d})}return n}function j(t){var a;const e={lights:[],climate:[],temperatures:[],humidities:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],problems:[],others:[]};for(const i of t){const{entityId:o,state:n}=i,r=o.split(".")[0],s=((a=n.attributes)==null?void 0:a.device_class)??"",c=n.state;r==="light"?e.lights.push(i):r==="climate"?e.climate.push(i):r==="sensor"&&s==="temperature"?e.temperatures.push(i):r==="sensor"&&s==="humidity"?e.humidities.push(i):r==="binary_sensor"&&s==="motion"?e.motions.push(i):r==="binary_sensor"&&s==="occupancy"?e.occupancy.push(i):r==="binary_sensor"&&s==="smoke"?e.smokes.push(i):r==="binary_sensor"&&s==="gas"?e.gases.push(i):r==="binary_sensor"&&s==="moisture"?e.moistures.push(i):c==="unavailable"||r==="binary_sensor"&&["problem","tamper","safety"].includes(s)&&c==="on"?e.problems.push(i):e.others.push(i)}return e}const k=`
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
`;function C(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,i)=>a+i,0)/e.length:null}function u(t){return t.some(e=>e.state.state==="on")}function B(t){return t.filter(e=>e.state.state==="on")}function P(t){var e;for(const a of t){const i=(e=a.state.attributes)==null?void 0:e.rgb_color;if(i)return`rgb(${i.join(",")})`}return null}function Y(t,e){var i;return(((i=e.attributes)==null?void 0:i.friendly_name)??t.split(".")[1]).split(" ").pop()}function q(t,e){var r,s;if((r=e.attributes)!=null&&r.icon)return e.attributes.icon;const a=t.split(".")[0],i=((s=e.attributes)==null?void 0:s.device_class)??"",o=y.has(e.state),n=c=>typeof c=="string"?c:o?c.on:c.off;return i&&_[i]?n(_[i]):w[a]?n(w[a]):"mdi:help-circle-outline"}function A(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function R(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function F(t,e){var E,S,H,O,z,I,L;const a=e.area,i=(E=t.areas)==null?void 0:E[a];if(!i&&!e.name&&!((S=e.entities)!=null&&S.length))return{error:a??"(no area)"};const o=(H=e.entities)!=null&&H.length?[]:$(t,a),n=D(o,e,t),r=j(n),s=B(r.lights),c=P(s),d=C(r.temperatures),l=C(r.humidities),p=r.climate[0]??null,[m,f]=T[(O=p==null?void 0:p.state)==null?void 0:O.state]??[null,null],b=e.mold_threshold??70,g=e.navigate_to||((z=e.tap_action)==null?void 0:z.navigation_path)||null;return{areaName:e.name||(i==null?void 0:i.name)||a||"",cardIcon:e.icon||(i==null?void 0:i.icon)||"mdi:home",navPath:g,lightCount:s.length,lightColor:c,occupied:u(r.motions)||u(r.occupancy),problemCount:r.problems.length,tempVal:d,humVal:l,tempUnit:((L=(I=r.temperatures[0])==null?void 0:I.state.attributes)==null?void 0:L.unit_of_measurement)??"°C",tempEntities:r.temperatures,humEntities:r.humidities,climate:p,climIcon:m,climColor:f,smokeOn:u(r.smokes),gasOn:u(r.gases),waterOn:u(r.moistures),moldRisk:l!==null&&l>=b,chipItems:e.show_entities!==!1?r.others.slice(0,e.max_entities??6).map(({entityId:v,state:h})=>{var M;return{entityId:v,isActive:y.has(h.state),icon:q(v,h),label:Y(v,h),title:`${((M=h.attributes)==null?void 0:M.friendly_name)??v} — ${h.state}`}}):[]}}function G({areaName:t,cardIcon:e,lightCount:a,occupied:i,problemCount:o}){return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a>0?`
          <div class="badge badge-lights"
               title="${a} light${a!==1?"s":""} on">
            <ha-icon icon="mdi:lightbulb"></ha-icon>
            ${a>1?`<span>${a}</span>`:""}
          </div>`:""}
        ${i?'<div class="occupancy-dot" title="Occupied"></div>':""}
        ${o>0?`
          <div class="badge badge-problems"
               title="${o} problem${o!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${o>1?`<span>${o}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function U({tempVal:t,humVal:e,tempUnit:a,tempEntities:i,humEntities:o,climate:n,climIcon:r,climColor:s}){var c,d,l,p,m,f,b,g;return t===null&&e===null&&!r?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((c=i[0])==null?void 0:c.entityId)??""}"
             title="${i.length>1?`Avg of ${i.length} sensors`:((l=(d=i[0])==null?void 0:d.state.attributes)==null?void 0:l.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((p=o[0])==null?void 0:p.entityId)??""}"
             title="${o.length>1?`Avg of ${o.length} sensors`:((f=(m=o[0])==null?void 0:m.state.attributes)==null?void 0:f.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${r?`
        <div class="env-chip climate"
             style="--climate-color: ${s}"
             data-entity="${n.entityId}"
             title="${((b=n.state.attributes)==null?void 0:b.friendly_name)??n.entityId}">
          <ha-icon icon="${r}"></ha-icon>
          <span>${((g=n.state.attributes)==null?void 0:g.current_temperature)!=null?`${n.state.attributes.current_temperature}°`:n.state.state}</span>
        </div>`:""}
    </div>`}function V({chipItems:t}){return t.length?`
    <div class="entity-chips">
      ${t.map(({entityId:e,isActive:a,icon:i,label:o,title:n})=>`
        <div class="chip ${a?"on":""}" data-entity="${e}" title="${n}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="chip-label">${o}</span>
        </div>`).join("")}
    </div>`:""}function W({smokeOn:t,gasOn:e,waterOn:a,moldRisk:i}){return!t&&!e&&!a&&!i?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${i?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function J(t){return`
    <style>${k}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function K(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, #fff)) 60%);`:"";return`
    <style>${k}</style>
    <ha-card
      class="${t.navPath?"clickable":""} ${e?"alarm-active":""}"
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      <div class="card-content">
        ${G(t)}
        ${U(t)}
        ${V(t)}
        ${W(t)}
      </div>
    </ha-card>`}function Q(t,e,a){t.innerHTML=a.error?J(a.error):K(a),a.error||X(t,e,a)}function X(t,e,{navPath:a,chipItems:i}){a&&t.querySelector("ha-card").addEventListener("click",o=>{!o.target.closest(".chip")&&!o.target.closest(".env-chip")&&R(a)}),t.querySelectorAll(".env-chip[data-entity]").forEach(o=>{const n=o.dataset.entity;n&&o.addEventListener("click",r=>{r.stopPropagation(),A(e,n)})}),t.querySelectorAll(".chip[data-entity]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation(),A(e,o.dataset.entity)})})}class Z extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(e){var a;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._hass&&this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var a;return!this._hass||!this._config?"":((a=this._config.entities)!=null&&a.length?this._config.entities.map(i=>{var o;return{entityId:i,state:(o=this._hass.states)==null?void 0:o[i]}}).filter(i=>i.state):$(this._hass,this._config.area)).map(({entityId:i,state:o})=>{var n,r;return`${i}=${o.state}|${((n=o.attributes)==null?void 0:n.rgb_color)??""}|${((r=o.attributes)==null?void 0:r.current_temperature)??""}`}).sort().join(";")}_update(){const e=F(this._hass,this._config);Q(this.shadowRoot,this,e)}}window.customCards=window.customCards||[],window.customCards.push({type:x,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${N} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(x,Z)})();
