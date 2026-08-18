(function(){"use strict";const _="hass-omnibus-card",j="1.3.0",w=new Set(["on","open","playing","home","unlocked"]),B={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},$={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:"mdi:battery",connectivity:"mdi:wifi"},k={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted"};function C(t,e){const{entities:i={},devices:a={},states:r={}}=t;return Object.keys(r).reduce((s,o)=>{var d;const n=i[o];if(!n||n.hidden_by)return s;const c=n.area_id===e,l=n.device_id&&((d=a[n.device_id])==null?void 0:d.area_id)===e;return(c||l)&&s.push({entityId:o,state:r[o]}),s},[])}function F(t,e,i){var o,n;if((o=e.entities)!=null&&o.length)return e.entities.map(c=>{var d;const l=(d=i.states)==null?void 0:d[c];return l?{entityId:c,state:l}:null}).filter(Boolean);const a=new Set(e.exclude_entities??[]),r=e.add_entities??[],s=t.filter(c=>!a.has(c.entityId));for(const c of r){if(s.some(d=>d.entityId===c))continue;const l=(n=i.states)==null?void 0:n[c];l&&s.push({entityId:c,state:l})}return s}function R(t){var i;const e={lights:[],climate:[],temperatures:[],humidities:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],problems:[],others:[]};for(const a of t){const{entityId:r,state:s}=a,o=r.split(".")[0],n=((i=s.attributes)==null?void 0:i.device_class)??"",c=s.state;o==="light"?e.lights.push(a):o==="climate"?e.climate.push(a):o==="sensor"&&n==="temperature"?e.temperatures.push(a):o==="sensor"&&n==="humidity"?e.humidities.push(a):o==="binary_sensor"&&n==="motion"?e.motions.push(a):o==="binary_sensor"&&n==="occupancy"?e.occupancy.push(a):o==="binary_sensor"&&n==="smoke"?e.smokes.push(a):o==="binary_sensor"&&n==="gas"?e.gases.push(a):o==="binary_sensor"&&n==="moisture"?e.moistures.push(a):c==="unavailable"||o==="binary_sensor"&&["problem","tamper","safety"].includes(n)&&c==="on"?e.problems.push(a):e.others.push(a)}return e}const S=`
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
`;function A(t){const e=t.map(i=>parseFloat(i.state.state)).filter(i=>!isNaN(i));return e.length?e.reduce((i,a)=>i+a,0)/e.length:null}function u(t){return t.some(e=>e.state.state==="on")}function Y(t){return t.filter(e=>e.state.state==="on")}function q(t){var e;for(const i of t){const a=(e=i.state.attributes)==null?void 0:e.rgb_color;if(a)return`rgb(${a.join(",")})`}return null}function W(t,e){var a;return(((a=e.attributes)==null?void 0:a.friendly_name)??t.split(".")[1]).split(" ").pop()}function G(t,e){var o,n;if((o=e.attributes)!=null&&o.icon)return e.attributes.icon;const i=t.split(".")[0],a=((n=e.attributes)==null?void 0:n.device_class)??"",r=w.has(e.state),s=c=>typeof c=="string"?c:r?c.on:c.off;return a&&$[a]?s($[a]):k[i]?s(k[i]):"mdi:help-circle-outline"}function E(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function U(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function V(t,e){if(!(t!=null&&t.length)||t.length<2)return"";const i=300,a=60,r=Math.min(...t),o=Math.max(...t)-r||1,n=t.map((d,p)=>p/(t.length-1)*i),c=t.map(d=>a-(d-r)/o*a),l=n.map((d,p)=>`${p?"L":"M"}${d.toFixed(1)},${c[p].toFixed(1)}`).join(" ");return`<svg class="bg-chart" viewBox="0 0 ${i} ${a}" preserveAspectRatio="none" aria-hidden="true"><path d="${l} V${a} H0 Z" fill="${e}"/></svg>`}function Z(t,e,i=null){var H,z,M,O,I,L,N,D,P;const a=e.area,r=(H=t.areas)==null?void 0:H[a];if(!r&&!e.name&&!((z=e.entities)!=null&&z.length))return{error:a??"(no area)"};const s=(M=e.entities)!=null&&M.length?[]:C(t,a),o=F(s,e,t),n=R(o),c=Y(n.lights),l=q(c),d=A(n.temperatures),p=A(n.humidities),h=n.climate[0]??null,[g,b]=B[(O=h==null?void 0:h.state)==null?void 0:O.state]??[null,null],y=e.mold_threshold??70,oe=e.navigate_to||((I=e.tap_action)==null?void 0:I.navigation_path)||null;return{areaName:e.name||(r==null?void 0:r.name)||a||"",cardIcon:e.icon||(r==null?void 0:r.icon)||"mdi:home",navPath:oe,lightCount:c.length,lightColor:l,occupied:u(n.motions)||u(n.occupancy),problemCount:n.problems.length,tempVal:d,humVal:p,tempUnit:((N=(L=n.temperatures[0])==null?void 0:L.state.attributes)==null?void 0:N.unit_of_measurement)??"°C",tempEntities:n.temperatures,humEntities:n.humidities,climate:h,climIcon:g,climColor:b,smokeOn:u(n.smokes),gasOn:u(n.gases),waterOn:u(n.moistures),moldRisk:p!==null&&p>=y,historyPoints:(D=e.history_chart)!=null&&D.entity_id?i:null,historyColor:((P=e.history_chart)==null?void 0:P.color)??"rgba(3, 169, 244, 0.12)",chipItems:e.show_entities!==!1?n.others.slice(0,e.max_entities??6).map(({entityId:x,state:m})=>{var T;return{entityId:x,isActive:w.has(m.state),icon:G(x,m),label:W(x,m),title:`${((T=m.attributes)==null?void 0:T.friendly_name)??x} — ${m.state}`}}):[]}}function J({areaName:t,cardIcon:e,lightCount:i,occupied:a,problemCount:r}){return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${i>0?`
          <div class="badge badge-lights"
               title="${i} light${i!==1?"s":""} on">
            <ha-icon icon="mdi:lightbulb"></ha-icon>
            ${i>1?`<span>${i}</span>`:""}
          </div>`:""}
        ${a?'<div class="occupancy-dot" title="Occupied"></div>':""}
        ${r>0?`
          <div class="badge badge-problems"
               title="${r} problem${r!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${r>1?`<span>${r}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function K({tempVal:t,humVal:e,tempUnit:i,tempEntities:a,humEntities:r,climate:s,climIcon:o,climColor:n}){var c,l,d,p,h,g,b,y;return t===null&&e===null&&!o?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((c=a[0])==null?void 0:c.entityId)??""}"
             title="${a.length>1?`Avg of ${a.length} sensors`:((d=(l=a[0])==null?void 0:l.state.attributes)==null?void 0:d.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${i}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((p=r[0])==null?void 0:p.entityId)??""}"
             title="${r.length>1?`Avg of ${r.length} sensors`:((g=(h=r[0])==null?void 0:h.state.attributes)==null?void 0:g.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${o?`
        <div class="env-chip climate"
             style="--climate-color: ${n}"
             data-entity="${s.entityId}"
             title="${((b=s.state.attributes)==null?void 0:b.friendly_name)??s.entityId}">
          <ha-icon icon="${o}"></ha-icon>
          <span>${((y=s.state.attributes)==null?void 0:y.current_temperature)!=null?`${s.state.attributes.current_temperature}°`:s.state.state}</span>
        </div>`:""}
    </div>`}function Q({chipItems:t}){return t.length?`
    <div class="entity-chips">
      ${t.map(({entityId:e,isActive:i,icon:a,label:r,title:s})=>`
        <div class="chip ${i?"on":""}" data-entity="${e}" title="${s}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="chip-label">${r}</span>
        </div>`).join("")}
    </div>`:""}function X({smokeOn:t,gasOn:e,waterOn:i,moldRisk:a}){return!t&&!e&&!i&&!a?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${i?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${a?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function ee(t){return`
    <style>${S}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function te(t){const e=t.smokeOn||t.gasOn||t.waterOn,i=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, #fff)) 60%);`:"";return`
    <style>${S}</style>
    <ha-card
      class="${t.navPath?"clickable":""} ${e?"alarm-active":""}"
      style="${i}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?V(t.historyPoints,t.historyColor):""}
      <div class="card-content">
        ${J(t)}
        ${K(t)}
        ${Q(t)}
        ${X(t)}
      </div>
    </ha-card>`}function ie(t,e,i){t.innerHTML=i.error?ee(i.error):te(i),i.error||ae(t,e,i)}function ae(t,e,{navPath:i,chipItems:a}){i&&t.querySelector("ha-card").addEventListener("click",r=>{!r.target.closest(".chip")&&!r.target.closest(".env-chip")&&U(i)}),t.querySelectorAll(".env-chip[data-entity]").forEach(r=>{const s=r.dataset.entity;s&&r.addEventListener("click",o=>{o.stopPropagation(),E(e,s)})}),t.querySelectorAll(".chip[data-entity]").forEach(r=>{r.addEventListener("click",s=>{s.stopPropagation(),E(e,r.dataset.entity)})})}const v=new Map,f=new Set;function re(t,e,i,a){const r=`${e}:${Math.floor(Date.now()/3e5)}`;if(v.has(r))return v.get(r);if(f.has(r)||!(t!=null&&t.callWS))return null;f.add(r);const s=new Date(Date.now()-i*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:s,minimal_response:!0,no_attributes:!0}).then(o=>{const c=((o==null?void 0:o[e])??[]).map(l=>parseFloat(l.s)).filter(l=>!isNaN(l));v.set(r,c),f.delete(r),a(c)}).catch(()=>{f.delete(r)}),null}class ne extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(e){var i;if(!(e!=null&&e.area)&&!((i=e==null?void 0:e.entities)!=null&&i.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._hass&&this._update()}set hass(e){if(this._hass=e,!this._config)return;const i=this._buildHash();i!==this._stateHash&&(this._stateHash=i,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var i;return!this._hass||!this._config?"":((i=this._config.entities)!=null&&i.length?this._config.entities.map(a=>{var r;return{entityId:a,state:(r=this._hass.states)==null?void 0:r[a]}}).filter(a=>a.state):C(this._hass,this._config.area)).map(({entityId:a,state:r})=>{var s,o;return`${a}=${r.state}|${((s=r.attributes)==null?void 0:s.rgb_color)??""}|${((o=r.attributes)==null?void 0:o.current_temperature)??""}`}).sort().join(";")}_update(){var r;let e=null;const i=(r=this._config)==null?void 0:r.history_chart;i!=null&&i.entity_id&&(e=re(this._hass,i.entity_id,i.hours??24,()=>this._update()));const a=Z(this._hass,this._config,e);ie(this.shadowRoot,this,a)}}window.customCards=window.customCards||[],window.customCards.push({type:_,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${j} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(_,ne)})();
