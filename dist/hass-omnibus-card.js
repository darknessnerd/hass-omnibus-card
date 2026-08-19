(function(){"use strict";const E="hass-omnibus-card",W="1.11.0",H=new Set(["on","open","playing","home","unlocked"]),P={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},F={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:"mdi:battery",connectivity:"mdi:wifi"},z={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted"};function O(t,e){const{entities:a={},devices:r={},states:o={}}=t;return Object.keys(o).reduce((n,l)=>{var c;const i=a[l];if(!i||i.hidden_by)return n;const s=i.area_id===e,d=i.device_id&&((c=r[i.device_id])==null?void 0:c.area_id)===e;return(s||d)&&n.push({entityId:l,state:o[l]}),n},[])}function G(t,e,a){var l,i;if((l=e.entities)!=null&&l.length)return e.entities.map(s=>{var c;const d=(c=a.states)==null?void 0:c[s];return d?{entityId:s,state:d}:null}).filter(Boolean);const r=new Set(e.exclude_entities??[]),o=e.add_entities??[],n=t.filter(s=>!r.has(s.entityId));for(const s of o){if(n.some(c=>c.entityId===s))continue;const d=(i=a.states)==null?void 0:i[s];d&&n.push({entityId:s,state:d})}return n}function V(t){var a;const e={lights:[],climate:[],temperatures:[],humidities:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],problems:[],others:[]};for(const r of t){const{entityId:o,state:n}=r,l=o.split(".")[0],i=((a=n.attributes)==null?void 0:a.device_class)??"",s=n.state;l==="light"?e.lights.push(r):l==="climate"?e.climate.push(r):l==="sensor"&&i==="temperature"?e.temperatures.push(r):l==="sensor"&&i==="humidity"?e.humidities.push(r):l==="binary_sensor"&&i==="motion"?e.motions.push(r):l==="binary_sensor"&&i==="occupancy"?e.occupancy.push(r):l==="binary_sensor"&&i==="smoke"?e.smokes.push(r):l==="binary_sensor"&&i==="gas"?e.gases.push(r):l==="binary_sensor"&&i==="moisture"?e.moistures.push(r):s==="unavailable"||l==="binary_sensor"&&["problem","tamper","safety"].includes(i)&&s==="on"?e.problems.push(r):e.others.push(r)}return e}const I=`
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
`;function L(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,r)=>a+r,0)/e.length:null}function _(t){return t.some(e=>e.state.state==="on")}function Z(t){return t.filter(e=>e.state.state==="on")}function J(t){var e;for(const a of t){const r=(e=a.state.attributes)==null?void 0:e.rgb_color;if(r)return`rgb(${r.join(",")})`}return null}function K(t,e){var r;return(((r=e.attributes)==null?void 0:r.friendly_name)??t.split(".")[1]).split(" ").pop()}function Q(t,e){var l,i;if((l=e.attributes)!=null&&l.icon)return e.attributes.icon;const a=t.split(".")[0],r=((i=e.attributes)==null?void 0:i.device_class)??"",o=H.has(e.state),n=s=>typeof s=="string"?s:o?s.on:s.off;return r&&F[r]?n(F[r]):z[a]?n(z[a]):"mdi:help-circle-outline"}function N(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function X(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function T(t,e,a){const r=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,o=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:r,max:o,range:o-r}}function ee(t,e,a=null){if(!(t!=null&&t.length)||t.length<2)return"";const r=300,o=60,n=Math.min(...t),l=Math.max(...t),{min:i,range:s}=T(a,n,l);if(s===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return"";const d=s||1,c=t.map((h,b)=>b/(t.length-1)*r),u=t.map(h=>o-(h-i)/d*o),m=`${c.map((h,b)=>`${b?"L":"M"}${h.toFixed(1)},${u[b].toFixed(1)}`).join(" ")} V${o} H0 Z`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null)))return D(r,o,`<path d="${m}" fill="${e}"/>`);const x=a.color??"rgba(3, 169, 244, 0.12)",S=a.color_high??"rgba(244, 67, 54, 0.25)",p=a.color_low??"rgba(33, 150, 243, 0.25)",w=h=>Math.max(0,Math.min(o,o-(h-i)/d*o)),A=`<defs><clipPath id="sg-cp"><path d="${m}"/></clipPath></defs>`;let g=`<path d="${m}" fill="${x}"/>`;if(a.threshold_high!=null){const h=w(a.threshold_high);h>0&&(g+=`<rect x="0" y="0" width="${r}" height="${h.toFixed(1)}" fill="${S}" clip-path="url(#sg-cp)"/>`),h>0&&h<o&&(g+=`<line x1="0" y1="${h.toFixed(1)}" x2="${r}" y2="${h.toFixed(1)}" stroke="${S}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}if(a.threshold_low!=null){const h=w(a.threshold_low);h<o&&(g+=`<rect x="0" y="${h.toFixed(1)}" width="${r}" height="${(o-h).toFixed(1)}" fill="${p}" clip-path="url(#sg-cp)"/>`),h>0&&h<o&&(g+=`<line x1="0" y1="${h.toFixed(1)}" x2="${r}" y2="${h.toFixed(1)}" stroke="${p}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`)}return D(r,o,A+g)}function D(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function te(t,e,a=null){var w,A,g,h,b,j,B,Y,q,R;const r=e.area,o=(w=t.areas)==null?void 0:w[r];if(!o&&!e.name&&!((A=e.entities)!=null&&A.length))return{error:r??"(no area)"};const n=(g=e.entities)!=null&&g.length?[]:O(t,r),l=G(n,e,t),i=V(l),s=Z(i.lights),d=J(s),c=L(i.temperatures),u=L(i.humidities),f=i.climate[0]??null,[m,$]=P[(h=f==null?void 0:f.state)==null?void 0:h.state]??[null,null],x=e.mold_threshold??70,S=e.navigate_to||((b=e.tap_action)==null?void 0:b.navigation_path)||null,p=e.history_chart??null;return{areaName:e.name||(o==null?void 0:o.name)||r||"",cardIcon:e.icon||(o==null?void 0:o.icon)||"mdi:home",navPath:S,hasLights:i.lights.length>0,lightCount:s.length,offlineLights:i.lights.filter(y=>y.state.state==="unavailable").length,lightColor:d,occupied:_(i.motions)||_(i.occupancy),hasOccupancySensors:i.motions.length>0||i.occupancy.length>0,problemCount:i.problems.length,tempVal:c,humVal:u,tempUnit:((B=(j=i.temperatures[0])==null?void 0:j.state.attributes)==null?void 0:B.unit_of_measurement)??"°C",tempEntities:i.temperatures,humEntities:i.humidities,climate:f,climIcon:m,climColor:$,smokeOn:_(i.smokes),gasOn:_(i.gases),waterOn:_(i.moistures),moldRisk:u!==null&&u>=x,historyPoints:p!=null&&p.entity_id?a:null,historyColor:(p==null?void 0:p.color)??"rgba(3, 169, 244, 0.12)",historyChart:p,historyMin:p!=null&&p.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a):null,historyMax:p!=null&&p.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a):null,historyUnit:((R=(q=(Y=t.states)==null?void 0:Y[p==null?void 0:p.entity_id])==null?void 0:q.attributes)==null?void 0:R.unit_of_measurement)??"",historyHours:(p==null?void 0:p.hours)??24,chipItems:e.show_entities!==!1?i.others.slice(0,e.max_entities??6).map(({entityId:y,state:k})=>{var U;return{entityId:y,isActive:H.has(k.state),icon:Q(y,k),label:K(y,k),title:`${((U=k.attributes)==null?void 0:U.friendly_name)??y} — ${k.state}`}}):[]}}function ae({areaName:t,cardIcon:e,hasLights:a,lightCount:r,offlineLights:o,occupied:n,hasOccupancySensors:l,problemCount:i}){const s=r===0,d=s?o>0?`${o} light${o!==1?"s":""} offline`:"Lights off":`${r} light${r!==1?"s":""} on${o>0?` · ${o} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${s?"off":""} ${o>0?"has-offline":""}"
               title="${d}">
            <ha-icon icon="mdi:lightbulb${s?"-off":""}"></ha-icon>
            ${r>1?`<span>${r}</span>`:""}
          </div>`:""}
        ${l?`<div class="occupancy-dot ${n?"":"idle"}" title="${n?"Occupied":"Not occupied"}"></div>`:""}
        ${i>0?`
          <div class="badge badge-problems"
               title="${i} problem${i!==1?"s":""}">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${i>1?`<span>${i}</span>`:""}
          </div>`:""}
      </div>
    </div>`}function ie({tempVal:t,humVal:e,tempUnit:a,tempEntities:r,humEntities:o,climate:n,climIcon:l,climColor:i}){var s,d,c,u,f,m,$,x;return t===null&&e===null&&!l?"":`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((s=r[0])==null?void 0:s.entityId)??""}"
             title="${r.length>1?`Avg of ${r.length} sensors`:((c=(d=r[0])==null?void 0:d.state.attributes)==null?void 0:c.friendly_name)??""}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((u=o[0])==null?void 0:u.entityId)??""}"
             title="${o.length>1?`Avg of ${o.length} sensors`:((m=(f=o[0])==null?void 0:f.state.attributes)==null?void 0:m.friendly_name)??""}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${l?`
        <div class="env-chip climate"
             style="--climate-color: ${i}"
             data-entity="${n.entityId}"
             title="${(($=n.state.attributes)==null?void 0:$.friendly_name)??n.entityId}">
          <ha-icon icon="${l}"></ha-icon>
          <span>${((x=n.state.attributes)==null?void 0:x.current_temperature)!=null?`${n.state.attributes.current_temperature}°`:n.state.state}</span>
        </div>`:""}
    </div>`}function re({chipItems:t}){return t.length?`
    <div class="entity-chips">
      ${t.map(({entityId:e,isActive:a,icon:r,label:o,title:n})=>`
        <div class="chip${a?" on":""}" data-entity="${e}" title="${n}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="chip-label">${o}</span>
        </div>`).join("")}
    </div>`:""}function oe({smokeOn:t,gasOn:e,waterOn:a,moldRisk:r}){return!t&&!e&&!a&&!r?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${r?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function ne(t){return`
    <style>${I}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function se({historyMin:t,historyMax:e,historyUnit:a,historyHours:r,historyChart:o}){if(t===null)return"";const n=[];if((o==null?void 0:o.threshold_high)!=null||(o==null?void 0:o.threshold_low)!=null){const{min:l,range:i}=T(o,t,e),s=i||1,d=c=>(1-(c-l)/s)*100;if(o.threshold_high!=null){const c=d(o.threshold_high);c>0&&c<100&&n.push(`<span class="chart-threshold" style="top:${c.toFixed(1)}%">${o.threshold_high.toFixed(1)}${a}</span>`)}if(o.threshold_low!=null){const c=d(o.threshold_low);c>0&&c<100&&n.push(`<span class="chart-threshold" style="top:${c.toFixed(1)}%">${o.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period">${r}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${n.join("")}
    </div>`}function le(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",r=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${I}</style>
    <ha-card
      ${r?`class="${r}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?ee(t.historyPoints,t.historyColor,t.historyChart):""}
      ${se(t)}
      <div class="card-content">
        ${ae(t)}
        ${ie(t)}
        ${re(t)}
        ${oe(t)}
      </div>
    </ha-card>`}function ce(t,e,a){t.innerHTML=a.error?ne(a.error):le(a),a.error||de(t,e,a)}function de(t,e,{navPath:a,chipItems:r}){var n,l;a&&t.querySelector("ha-card").addEventListener("click",i=>{!i.target.closest(".chip")&&!i.target.closest(".env-chip")&&!i.target.closest(".badge-lights")&&X(a)});const o=t.querySelector(".badge-lights");o&&((n=e._config)!=null&&n.area)&&((l=e._hass)!=null&&l.callService)&&o.addEventListener("click",i=>{i.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})}),t.querySelectorAll(".env-chip[data-entity]").forEach(i=>{const s=i.dataset.entity;s&&i.addEventListener("click",d=>{d.stopPropagation(),N(e,s)})}),t.querySelectorAll(".chip[data-entity]").forEach(i=>{i.addEventListener("click",s=>{s.stopPropagation(),N(e,i.dataset.entity)})})}const M=new Map,C=new Set,v=new Map;function he(t,e,a,r,o){const n=`${e}:${Math.floor(Date.now()/3e5)}`;if(M.has(n))return M.get(n);if(C.has(n))return v.get(n).set(o,r),null;if(!(t!=null&&t.callWS))return null;C.add(n),v.set(n,new Map([[o,r]]));const l=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:l,minimal_response:!0,no_attributes:!0}).then(i=>{const d=(Array.isArray(i==null?void 0:i[e])?i[e]:[]).map(u=>parseFloat(u.s??u.state)).filter(u=>!isNaN(u));M.set(n,d),C.delete(n);const c=v.get(n);v.delete(n),c==null||c.forEach(u=>u(d))}).catch(()=>{C.delete(n),v.delete(n)}),null}class pe extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null}setConfig(e){var a;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');this._config={...e},this._stateHash=null,this._hass&&this._update()}set hass(e){if(this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var r,o,n,l;if(!this._hass||!this._config)return"";let e;if((r=this._config.entities)!=null&&r.length)e=this._config.entities.map(i=>{var s;return{entityId:i,state:(s=this._hass.states)==null?void 0:s[i]}}).filter(i=>i.state);else{e=O(this._hass,this._config.area);for(const i of this._config.add_entities??[])if(!e.some(s=>s.entityId===i)){const s=(o=this._hass.states)==null?void 0:o[i];s&&e.push({entityId:i,state:s})}}const a=(n=this._config.history_chart)==null?void 0:n.entity_id;if(a&&!e.some(i=>i.entityId===a)){const i=(l=this._hass.states)==null?void 0:l[a];i&&e.push({entityId:a,state:i})}return e.map(({entityId:i,state:s})=>{var d,c;return`${i}=${s.state}|${((d=s.attributes)==null?void 0:d.rgb_color)??""}|${((c=s.attributes)==null?void 0:c.current_temperature)??""}`}).sort().join(";")}_update(){var o,n;let e=null;const a=(o=this._config)==null?void 0:o.history_chart;a!=null&&a.entity_id&&(e=he(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const r=te(this._hass,this._config,e);(n=this._config)!=null&&n.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:r}),ce(this.shadowRoot,this,r)}}window.customCards=window.customCards||[],window.customCards.push({type:E,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${W} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(E,pe)})();
