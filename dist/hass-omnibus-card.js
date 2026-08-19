(function(){"use strict";const I="hass-omnibus-card",Z="1.11.0",F=new Set(["on","open","playing","home","unlocked"]),J={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},H={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi"},z={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted"};function O(e,t){const{entities:a={},devices:r={},states:n={}}=e;return Object.keys(n).reduce((s,l)=>{var c;const i=a[l];if(!i||i.hidden_by)return s;const o=i.area_id===t,d=i.device_id&&((c=r[i.device_id])==null?void 0:c.area_id)===t;return(o||d)&&s.push({entityId:l,state:n[l]}),s},[])}function K(e,t,a){var l,i;if((l=t.entities)!=null&&l.length)return t.entities.map(o=>{var c;const d=(c=a.states)==null?void 0:c[o];return d?{entityId:o,state:d}:null}).filter(Boolean);const r=new Set(t.exclude_entities??[]),n=t.add_entities??[],s=e.filter(o=>!r.has(o.entityId));for(const o of n){if(s.some(c=>c.entityId===o))continue;const d=(i=a.states)==null?void 0:i[o];d&&s.push({entityId:o,state:d})}return s}function Q(e){var a;const t={lights:[],climate:[],temperatures:[],humidities:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],others:[]};for(const r of e){const{entityId:n,state:s}=r,l=n.split(".")[0],i=((a=s.attributes)==null?void 0:a.device_class)??"",o=s.state;l==="light"?t.lights.push(r):l==="climate"?t.climate.push(r):l==="sensor"&&i==="temperature"?t.temperatures.push(r):l==="sensor"&&i==="humidity"?t.humidities.push(r):l==="binary_sensor"&&i==="motion"?t.motions.push(r):l==="binary_sensor"&&i==="occupancy"?t.occupancy.push(r):l==="binary_sensor"&&i==="smoke"?t.smokes.push(r):l==="binary_sensor"&&i==="gas"?t.gases.push(r):l==="binary_sensor"&&i==="moisture"?t.moistures.push(r):l==="sensor"&&i==="battery"?t.batteries.push(r):o==="unavailable"||l==="binary_sensor"&&["problem","tamper","safety"].includes(i)&&o==="on"?t.problems.push(r):t.others.push(r)}return t}const L=`
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
`;function N(e){const t=e.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return t.length?t.reduce((a,r)=>a+r,0)/t.length:null}function $(e){return e.some(t=>t.state.state==="on")}function X(e){return e.filter(t=>t.state.state==="on")}function tt(e){let t=null;for(const a of e){const r=parseFloat(a.state.state);isNaN(r)||(!t||r<t.value)&&(t={value:r,entityId:a.entityId,state:a.state})}return t}function et(e){var t;for(const a of e){const r=(t=a.state.attributes)==null?void 0:t.rgb_color;if(r)return`rgb(${r.join(",")})`}return null}function at(e,t){var r;return(((r=t.attributes)==null?void 0:r.friendly_name)??e.split(".")[1]).split(" ").pop()}function rt(e,t){var l,i;if((l=t.attributes)!=null&&l.icon)return t.attributes.icon;const a=e.split(".")[0],r=((i=t.attributes)==null?void 0:i.device_class)??"",n=F.has(t.state),s=o=>typeof o=="string"?o:n?o.on:o.off;return a==="sensor"&&r==="battery"?T(parseFloat(t.state)):r&&H[r]?s(H[r]):z[a]?s(z[a]):"mdi:help-circle-outline"}function T(e){if(e==null||isNaN(e))return"mdi:battery-unknown";const t=Math.min(100,Math.max(0,e));return t<=5?"mdi:battery-alert-variant-outline":t>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(t/10)*10))}`}function A(e,t){e.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}))}function it(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function B(e,t,a){const r=(e==null?void 0:e.y_min)!=null?Math.min(e.y_min,t):t,n=(e==null?void 0:e.y_max)!=null?Math.max(e.y_max,a):a;return{min:r,max:n,range:n-r}}function nt(e,t,a=null){if(!(e!=null&&e.length)||e.length<2)return"";const r=300,n=60,s=Math.min(...e),l=Math.max(...e),{min:i,range:o}=B(a,s,l);if(o===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return"";const d=o||1,c=e.map((h,x)=>x/(e.length-1)*r),u=e.map(h=>n-(h-i)/d*n),m=`${c.map((h,x)=>`${x?"L":"M"}${h.toFixed(1)},${u[x].toFixed(1)}`).join(" ")} V${n} H0 Z`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null)))return D(r,n,`<path d="${m}" fill="${t}"/>`);const _=a.color??"rgba(3, 169, 244, 0.12)",S=a.color_high??"rgba(244, 67, 54, 0.25)",p=a.color_low??"rgba(33, 150, 243, 0.25)",M=h=>Math.max(0,Math.min(n,n-(h-i)/d*n)),f=`<defs><clipPath id="sg-cp"><path d="${m}"/></clipPath></defs>`;let b=`<path d="${m}" fill="${_}"/>`;if(a.threshold_high!=null){const h=M(a.threshold_high);h>0&&(b+=`<rect x="0" y="0" width="${r}" height="${h.toFixed(1)}" fill="${S}" clip-path="url(#sg-cp)"/>`),h>0&&h<n&&(b+=`<line x1="0" y1="${h.toFixed(1)}" x2="${r}" y2="${h.toFixed(1)}" stroke="${S}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}if(a.threshold_low!=null){const h=M(a.threshold_low);h<n&&(b+=`<rect x="0" y="${h.toFixed(1)}" width="${r}" height="${(n-h).toFixed(1)}" fill="${p}" clip-path="url(#sg-cp)"/>`),h>0&&h<n&&(b+=`<line x1="0" y1="${h.toFixed(1)}" x2="${r}" y2="${h.toFixed(1)}" stroke="${p}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}return D(r,n,f+b)}function D(e,t,a){return`<svg class="bg-chart" viewBox="0 0 ${e} ${t}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function ot(e,t,a=null){var b,h,x,j,Y,q,P,R,U,W,V;const r=t.area,n=(b=e.areas)==null?void 0:b[r];if(!n&&!t.name&&!((h=t.entities)!=null&&h.length))return{error:r??"(no area)"};const s=(x=t.entities)!=null&&x.length?[]:O(e,r),l=K(s,t,e),i=Q(l),o=X(i.lights),d=et(o),c=N(i.temperatures),u=N(i.humidities),g=i.climate[0]??null,[m,y]=J[(j=g==null?void 0:g.state)==null?void 0:j.state]??[null,null],_=t.mold_threshold??70,S=t.navigate_to||((Y=t.tap_action)==null?void 0:Y.navigation_path)||null,p=t.history_chart??null,M=t.battery_low_threshold??20,f=tt(i.batteries);return{areaName:t.name||(n==null?void 0:n.name)||r||"",cardIcon:t.icon||(n==null?void 0:n.icon)||"mdi:home",navPath:S,hasLights:i.lights.length>0,lightCount:o.length,offlineLights:i.lights.filter(v=>v.state.state==="unavailable").length,lightColor:d,occupied:$(i.motions)||$(i.occupancy),hasOccupancySensors:i.motions.length>0||i.occupancy.length>0,problemCount:i.problems.length,showBatteryBadge:f!=null&&f.value<=M,batteryValue:(f==null?void 0:f.value)??null,batteryIcon:f?T(f.value):null,batteryEntity:(f==null?void 0:f.entityId)??null,batteryTitle:f?`${i.batteries.length>1?`Lowest of ${i.batteries.length} — `:""}${((q=f.state.attributes)==null?void 0:q.friendly_name)??f.entityId}: ${f.value}%`:"",tempVal:c,humVal:u,tempUnit:((R=(P=i.temperatures[0])==null?void 0:P.state.attributes)==null?void 0:R.unit_of_measurement)??"°C",tempEntities:i.temperatures,humEntities:i.humidities,climate:g,climIcon:m,climColor:y,smokeOn:$(i.smokes),gasOn:$(i.gases),waterOn:$(i.moistures),moldRisk:u!==null&&u>=_,historyPoints:p!=null&&p.entity_id?a:null,historyColor:(p==null?void 0:p.color)??"rgba(3, 169, 244, 0.12)",historyChart:p,historyMin:p!=null&&p.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a):null,historyMax:p!=null&&p.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a):null,historyUnit:((V=(W=(U=e.states)==null?void 0:U[p==null?void 0:p.entity_id])==null?void 0:W.attributes)==null?void 0:V.unit_of_measurement)??"",historyHours:(p==null?void 0:p.hours)??24,chipItems:t.show_entities!==!1?i.others.slice(0,t.max_entities??6).map(({entityId:v,state:k})=>{var G;return{entityId:v,isActive:F.has(k.state),icon:rt(v,k),label:at(v,k),title:`${((G=k.attributes)==null?void 0:G.friendly_name)??v} — ${k.state}`}}):[]}}function st({areaName:e,cardIcon:t,hasLights:a,lightCount:r,offlineLights:n,occupied:s,hasOccupancySensors:l,problemCount:i,showBatteryBadge:o,batteryValue:d,batteryIcon:c,batteryEntity:u,batteryTitle:g}){const m=r===0,y=m?n>0?`${n} light${n!==1?"s":""} offline`:"Lights off":`${r} light${r!==1?"s":""} on${n>0?` · ${n} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${t}"></ha-icon>
        <span class="room-name">${e}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${m?"off":""} ${n>0?"has-offline":""}"
               title="${y}">
            <ha-icon icon="mdi:lightbulb${m?"-off":""}"></ha-icon>
            ${r>1?`<span>${r}</span>`:""}
          </div>`:""}
        ${l?`<div class="occupancy-dot ${s?"":"idle"}" title="${s?"Occupied":"Not occupied"}"></div>`:""}
        ${o?`
          <div class="badge badge-battery"
               data-entity="${u}"
               title="${g}">
            <ha-icon icon="${c}"></ha-icon>
            <span>${d}%</span>
          </div>`:""}
        ${i>0?`
          <div class="badge badge-problems"
               title="${i} problem${i!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${i>1?`<span>${i}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function lt({tempVal:e,humVal:t,tempUnit:a,tempEntities:r,humEntities:n,climate:s,climIcon:l,climColor:i}){var o,d,c,u,g,m,y,_;return e===null&&t===null&&!l?"":`
    <div class="env-row">
      ${e!==null?`
        <div class="env-chip temp"
             data-entity="${((o=r[0])==null?void 0:o.entityId)??""}"
             title="${r.length>1?`Avg of ${r.length} sensors`:((c=(d=r[0])==null?void 0:d.state.attributes)==null?void 0:c.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${e.toFixed(1)}${a}</span>
        </div>`:""}
      ${t!==null?`
        <div class="env-chip hum"
             data-entity="${((u=n[0])==null?void 0:u.entityId)??""}"
             title="${n.length>1?`Avg of ${n.length} sensors`:((m=(g=n[0])==null?void 0:g.state.attributes)==null?void 0:m.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${t.toFixed(0)}%</span>
        </div>`:""}
      ${l?`
        <div class="env-chip climate"
             style="--climate-color: ${i}"
             data-entity="${s.entityId}"
             title="${((y=s.state.attributes)==null?void 0:y.friendly_name)??s.entityId}">
          <ha-icon icon="${l}"></ha-icon>
          <span>${((_=s.state.attributes)==null?void 0:_.current_temperature)!=null?`${s.state.attributes.current_temperature}°`:s.state.state}</span>
        </div>`:""}
    </div>`}function ct({chipItems:e}){return e.length?`
    <div class="entity-chips">
      ${e.map(({entityId:t,isActive:a,icon:r,label:n,title:s})=>`
        <div class="chip${a?" on":""}" data-entity="${t}" title="${s}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="chip-label">${n}</span>
        </div>`).join("")}
    </div>`:""}function dt({smokeOn:e,gasOn:t,waterOn:a,moldRisk:r}){return!e&&!t&&!a&&!r?"":`
    <div class="alarm-bar">
      ${e?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${t?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${r?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function ht(e){return`
    <style>${L}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${e}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function pt({historyMin:e,historyMax:t,historyUnit:a,historyHours:r,historyChart:n}){if(e===null)return"";const s=[];if((n==null?void 0:n.threshold_high)!=null||(n==null?void 0:n.threshold_low)!=null){const{min:l,range:i}=B(n,e,t),o=i||1,d=c=>(1-(c-l)/o)*100;if(n.threshold_high!=null){const c=d(n.threshold_high);c>0&&c<100&&s.push(`<span class="chart-threshold" style="top:${c.toFixed(1)}%">${n.threshold_high.toFixed(1)}${a}</span>`)}if(n.threshold_low!=null){const c=d(n.threshold_low);c>0&&c<100&&s.push(`<span class="chart-threshold" style="top:${c.toFixed(1)}%">${n.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${t.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period">${r}h</span>
      <span class="chart-stat stat-min">↓ ${e.toFixed(1)}${a}</span>
      ${s.join("")}
    </div>`}function ut(e){const t=e.smokeOn||e.gasOn||e.waterOn,a=e.lightColor?`background: linear-gradient(135deg, ${e.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",r=[e.navPath?"clickable":"",t?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${L}</style>
    <ha-card
      ${r?`class="${r}"`:""}
      style="${a}"
      ${e.navPath?'role="button" tabindex="0"':""}
      aria-label="${e.areaName}"
    >
      ${e.historyPoints?nt(e.historyPoints,e.historyColor,e.historyChart):""}
      ${pt(e)}
      <div class="card-content">
        ${st(e)}
        ${lt(e)}
        ${ct(e)}
        ${dt(e)}
      </div>
    </ha-card>`}function ft(e,t,a){e.innerHTML=a.error?ht(a.error):ut(a),a.error||mt(e,t,a)}function mt(e,t,{navPath:a,chipItems:r}){var l,i;a&&e.querySelector("ha-card").addEventListener("click",o=>{!o.target.closest(".chip")&&!o.target.closest(".env-chip")&&!o.target.closest(".badge-lights")&&!o.target.closest(".badge-battery")&&it(a)});const n=e.querySelector(".badge-lights");n&&((l=t._config)!=null&&l.area)&&((i=t._hass)!=null&&i.callService)&&n.addEventListener("click",o=>{o.stopPropagation(),t._hass.callService("light","toggle",{},{area_id:t._config.area})});const s=e.querySelector(".badge-battery[data-entity]");s&&s.addEventListener("click",o=>{o.stopPropagation(),A(t,s.dataset.entity)}),e.querySelectorAll(".env-chip[data-entity]").forEach(o=>{const d=o.dataset.entity;d&&o.addEventListener("click",c=>{c.stopPropagation(),A(t,d)})}),e.querySelectorAll(".chip[data-entity]").forEach(o=>{o.addEventListener("click",d=>{d.stopPropagation(),A(t,o.dataset.entity)})})}const E=new Map,C=new Set,w=new Map;function gt(e,t,a,r,n){const s=`${t}:${Math.floor(Date.now()/3e5)}`;if(E.has(s))return E.get(s);if(C.has(s))return w.get(s).set(n,r),null;if(!(e!=null&&e.callWS))return null;C.add(s),w.set(s,new Map([[n,r]]));const l=new Date(Date.now()-a*36e5).toISOString();return e.callWS({type:"history/history_during_period",entity_ids:[t],start_time:l,minimal_response:!0,no_attributes:!0}).then(i=>{const d=(Array.isArray(i==null?void 0:i[t])?i[t]:[]).map(u=>parseFloat(u.s??u.state)).filter(u=>!isNaN(u));E.set(s,d),C.delete(s);const c=w.get(s);w.delete(s),c==null||c.forEach(u=>u(d))}).catch(()=>{C.delete(s),w.delete(s)}),null}class bt extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(t){var a;if(!(t!=null&&t.area)&&!((a=t==null?void 0:t.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...t},this._stateHash=null,this._hass&&this._update()}set hass(t){if(this._hass=t,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var r,n,s,l;if(!this._hass||!this._config)return"";let t;if((r=this._config.entities)!=null&&r.length)t=this._config.entities.map(i=>{var o;return{entityId:i,state:(o=this._hass.states)==null?void 0:o[i]}}).filter(i=>i.state);else{t=O(this._hass,this._config.area);for(const i of this._config.add_entities??[])if(!t.some(o=>o.entityId===i)){const o=(n=this._hass.states)==null?void 0:n[i];o&&t.push({entityId:i,state:o})}}const a=(s=this._config.history_chart)==null?void 0:s.entity_id;if(a&&!t.some(i=>i.entityId===a)){const i=(l=this._hass.states)==null?void 0:l[a];i&&t.push({entityId:a,state:i})}return t.map(({entityId:i,state:o})=>{var d,c;return`${i}=${o.state}|${((d=o.attributes)==null?void 0:d.rgb_color)??""}|${((c=o.attributes)==null?void 0:c.current_temperature)??""}`}).sort().join(";")}_update(){var n,s;let t=null;const a=(n=this._config)==null?void 0:n.history_chart;a!=null&&a.entity_id&&(t=gt(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const r=ot(this._hass,this._config,t);(s=this._config)!=null&&s.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:r}),ft(this.shadowRoot,this,r)}}window.customCards=window.customCards||[],window.customCards.push({type:I,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${Z} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(I,bt)})();
