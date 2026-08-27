(function(){"use strict";const te="hass-omnibus-card",Ee="2.0.0",Z=new Set(["on","open","playing","home","unlocked"]),Ae={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},ae={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},lock:{on:"mdi:lock-open",off:"mdi:lock"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high"},ze="mdi:weather-windy-variant",ie={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"},Ie={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"},Te=/_(max|gust|peak)$/i;function ne(t,e){var n;return(((n=e.attributes)==null?void 0:n.friendly_name)??t.split(".")[1]).split(" ").pop()}function re(t){const e=new Map;for(const n of t)e.set(n.label,(e.get(n.label)??0)+1);if(![...e.values()].some(n=>n>1))return t;const a=n=>n.fullName.trim().split(/\s+/);return t.map(n=>{if(e.get(n.label)===1)return n;const r=a(n);for(let i=2;i<=r.length;i++){const o=r.slice(-i).join(" ");if(!t.some(s=>s!==n&&a(s).slice(-i).join(" ")===o))return{...n,label:o}}return{...n,label:n.entityId.split(".")[1]}})}function Me(t,e,a){var l;const n=(l=t.devices)==null?void 0:l[e],r=(n==null?void 0:n.name_by_user)??(n==null?void 0:n.name);if(r)return r;const i=a.map(({entityId:s})=>s.split(".")[1].split("_"));let o=i[0]??[];for(const s of i.slice(1)){let p=0;for(;p<o.length&&p<s.length&&o[p]===s[p];)p++;o=o.slice(0,p)}return o.length?o.map(s=>s[0].toUpperCase()+s.slice(1)).join(" "):"Device"}function B(t,e){var o,l;if((o=e.attributes)!=null&&o.icon)return e.attributes.icon;const a=t.split(".")[0],n=((l=e.attributes)==null?void 0:l.device_class)??"",r=Z.has(e.state),i=s=>typeof s=="string"?s:r?s.on:s.off;return a==="sensor"&&n==="battery"?se(parseFloat(e.state)):n==="wind_speed"&&Te.test(t)?ze:n&&ae[n]?i(ae[n]):ie[a]?i(ie[a]):"mdi:help-circle-outline"}function H(t,e,a){var r,i;if(e==null)return a;if(typeof e=="number")return e;const n=parseFloat((i=(r=t.states)==null?void 0:r[e])==null?void 0:i.state);return Number.isFinite(n)?n:a}function se(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function oe(t,e){const{entities:a={},devices:n={},states:r={}}=t;return Object.keys(r).reduce((i,o)=>{var h;const l=a[o];if(!l||l.hidden_by)return i;const s=l.area_id===e,p=l.device_id&&((h=n[l.device_id])==null?void 0:h.area_id)===e;return(s||p)&&i.push({entityId:o,state:r[o],deviceId:l.device_id??null}),i},[])}function Le(t,e,a){var o,l,s,p;if((o=e.entities)!=null&&o.length)return e.entities.map(h=>{var d,u,g;const c=(d=a.states)==null?void 0:d[h];return c?{entityId:h,state:c,deviceId:((g=(u=a.entities)==null?void 0:u[h])==null?void 0:g.device_id)??null}:null}).filter(Boolean);const n=new Set(e.exclude_entities??[]),r=e.add_entities??[],i=t.filter(h=>!n.has(h.entityId));for(const h of r){if(i.some(d=>d.entityId===h))continue;const c=(l=a.states)==null?void 0:l[h];c&&i.push({entityId:h,state:c,deviceId:((p=(s=a.entities)==null?void 0:s[h])==null?void 0:p.device_id)??null})}return i}const Ne=new Set(["sensor","binary_sensor","image"]),Oe=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),le={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},je=new RegExp(`ptz.*_(${Object.keys(le).join("|")})$`,"i");function Fe(t){var r;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],settings:[],ptz:[],updates:[],others:[],diagnostics:[]};for(const i of t){const{entityId:o,state:l}=i,s=o.split(".")[0],p=((r=l.attributes)==null?void 0:r.device_class)??"",h=l.state;if(s==="light")e.lights.push(i);else if(s==="climate")e.climate.push(i);else if(s==="camera")e.cameras.push(i);else if(s==="update"&&h!=="unavailable")e.updates.push(i);else if(s==="sensor"&&p==="temperature")e.temperatures.push(i);else if(s==="sensor"&&p==="humidity")e.humidities.push(i);else if(s==="sensor"&&Oe.has(p))e.weathers.push(i);else if(s==="binary_sensor"&&p==="motion")e.motions.push(i);else if(s==="binary_sensor"&&p==="occupancy")e.occupancy.push(i);else if(s==="binary_sensor"&&p==="smoke")e.smokes.push(i);else if(s==="binary_sensor"&&p==="gas")e.gases.push(i);else if(s==="binary_sensor"&&p==="moisture")e.moistures.push(i);else if(s==="sensor"&&p==="battery"&&h!=="unavailable")e.batteries.push(i),e.others.push(i);else if(h==="unavailable"||s==="binary_sensor"&&["problem","tamper","safety"].includes(p)&&h==="on")e.problems.push(i);else if(s==="siren")e.controls.push(i);else if(s==="button"){const c=o.match(je);c?e.ptz.push({...i,direction:le[c[1].toLowerCase()]}):e.controls.push(i)}else e.others.push(i)}const a=new Map;for(const i of e.others)i.deviceId&&(a.has(i.deviceId)||a.set(i.deviceId,[]),a.get(i.deviceId).push(i));const n=[];for(const i of e.others){const o=i.deviceId?a.get(i.deviceId):null;if(!o||o.length<2){n.push(i);continue}const l=i.entityId.split(".")[0];Ne.has(l)?e.diagnostics.push(i):e.settings.push(i)}return e.others=n,e}function ce(t){const{controls:e,settings:a,diagnostics:n}=t,r=re([...e,...a,...n]);return{ptz:t.ptz,controls:r.slice(0,e.length),settings:r.slice(e.length,e.length+a.length),diagnostics:r.slice(e.length+a.length)}}function De(t,{ptz:e,controls:a,settings:n,diagnostics:r},i=null){const o={ptz:e,controls:a,settings:n,diagnostics:r},l=()=>({ptz:[],controls:[],settings:[],diagnostics:[]}),s=d=>d.ptz.length+d.controls.length+d.settings.length+d.diagnostics.length,p=new Map;for(const[d,u]of Object.entries(o))for(const g of u){const w=g.deviceId??null;p.has(w)||p.set(w,l()),p.get(w)[d].push(g)}const h=[];let c=l();for(const[d,u]of p)if(d==null||s(u)<2)for(const g of["ptz","controls","settings","diagnostics"])c[g].push(...u[g]);else{const g=ce(u),w=[...g.ptz,...g.controls,...g.settings,...g.diagnostics];h.push({key:d,label:Me(t,d,w),...g})}return c=ce(c),h.sort((d,u)=>d.key===i?-1:u.key===i?1:s(u)-s(d)),s(c)>0&&h.push({key:"__other__",label:"Other",...c}),h}function de(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,n)=>a+n,0)/e.length:null}function N(t){return t.some(e=>e.state.state==="on")}function Pe(t){return t.filter(e=>e.state.state==="on")}function qe(t){let e=null;for(const a of t){const n=parseFloat(a.state.state);isNaN(n)||(!e||n<e.value)&&(e={value:n,entityId:a.entityId,state:a.state})}return e}function Be(t){var e;for(const a of t){const n=(e=a.state.attributes)==null?void 0:e.rgb_color;if(n)return`rgb(${n.join(",")})`}return null}function He(t,e){const a=H(t,e.threshold_high,null),n=H(t,e.threshold_low,null);return a===e.threshold_high&&n===e.threshold_low?e:{...e,threshold_high:a,threshold_low:n}}function X(t,e,a,n){var r,i,o;return{entityId:t,deviceId:a,domain:t.split(".")[0],isActive:Z.has(e.state),icon:B(t,e),label:((r=n.entity_labels)==null?void 0:r[t])??ne(t,e),fullName:((i=e.attributes)==null?void 0:i.friendly_name)??t,title:`${((o=e.attributes)==null?void 0:o.friendly_name)??t} — ${e.state}`}}function We(t,e,a=null,n=null){var P,Y,z,q,f,_,V,be,ye,ve,xe,_e,we,$e;const r=e.area,i=(P=t.areas)==null?void 0:P[r];if(!i&&!e.name&&!((Y=e.entities)!=null&&Y.length))return{error:r??"(no area)"};const o=(z=e.entities)!=null&&z.length?[]:oe(t,r),l=Le(o,e,t),s=Fe(l),p=Pe(s.lights),h=Be(p),c=de(s.temperatures),d=de(s.humidities),u=s.climate[0]??null,[g,w]=Ae[(q=u==null?void 0:u.state)==null?void 0:q.state]??[null,null],k=H(t,e.mold_threshold,70),S=e.navigate_to||((f=e.tap_action)==null?void 0:f.navigation_path)||null,E=e.history_chart??null,v=E?He(t,E):null,O=H(t,e.battery_low_threshold,20),x=qe(s.batteries),b=s.cameras[0]??null,J=s.cameras.slice(1),A=s.updates.filter(m=>m.state.state==="on"),Q=e.show_entities!==!1?s.controls.map(({entityId:m,state:y,deviceId:$})=>X(m,y,$,e)):[],R=e.show_entities!==!1?s.settings.map(({entityId:m,state:y,deviceId:$})=>X(m,y,$,e)):[],me=e.show_entities!==!1?s.ptz.map(({entityId:m,state:y,direction:$,deviceId:T})=>{var M;return{entityId:m,deviceId:T,direction:$,icon:Ie[$],title:((M=y.attributes)==null?void 0:M.friendly_name)??m}}):[],ee=e.show_entities!==!1?s.diagnostics.map(({entityId:m,state:y,deviceId:$})=>X(m,y,$,e)):[],j=e.collapsible_controls!==!1,F=De(t,{ptz:me,controls:Q,settings:R,diagnostics:ee},(b==null?void 0:b.deviceId)??null),D=F.map(m=>m.key),U=j?n==="__default__"?D[0]??null:D.includes(n)?n:null:null;return{areaName:e.name||(i==null?void 0:i.name)||r||"",cardIcon:e.icon||(i==null?void 0:i.icon)||"mdi:home",navPath:S,hasLights:s.lights.length>0,lightCount:p.length,offlineLights:s.lights.filter(m=>m.state.state==="unavailable").length,lightColor:h,occupied:N(s.motions)||N(s.occupancy),hasOccupancySensors:s.motions.length>0||s.occupancy.length>0,problemCount:s.problems.length,showBatteryBadge:x!=null&&x.value<=O,batteryValue:(x==null?void 0:x.value)??null,batteryIcon:x?se(x.value):null,batteryEntity:(x==null?void 0:x.entityId)??null,batteryTitle:x?`${s.batteries.length>1?`Lowest of ${s.batteries.length} — `:""}${((_=x.state.attributes)==null?void 0:_.friendly_name)??x.entityId}: ${x.value}%`:"",tempVal:c,humVal:d,tempUnit:((be=(V=s.temperatures[0])==null?void 0:V.state.attributes)==null?void 0:be.unit_of_measurement)??"°C",tempEntities:s.temperatures,humEntities:s.humidities,climate:u,climIcon:g,climColor:w,smokeOn:N(s.smokes),gasOn:N(s.gases),waterOn:N(s.moistures),moldRisk:d!==null&&d>=k,updateCount:A.length,updateEntity:((ye=A[0])==null?void 0:ye.entityId)??null,updateTitle:A.length?`${A.length} update${A.length!==1?"s":""} available: ${A.map(m=>{var y;return((y=m.state.attributes)==null?void 0:y.friendly_name)??m.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!b,cameraEntity:(b==null?void 0:b.entityId)??null,cameraImage:((ve=b==null?void 0:b.state.attributes)==null?void 0:ve.entity_picture)??null,cameraIcon:b?B(b.entityId,b.state):null,cameraTitle:((xe=b==null?void 0:b.state.attributes)==null?void 0:xe.friendly_name)??(b==null?void 0:b.entityId)??"",cameraState:(b==null?void 0:b.state.state)??"",cameraOffline:(b==null?void 0:b.state.state)==="unavailable",deviceGroups:F,collapsibleControls:j,activeSection:U,weatherItems:e.show_entities!==!1?s.weathers.map(({entityId:m,state:y})=>{var ke,Se,Ce;const $=parseFloat(y.state),T=((ke=y.attributes)==null?void 0:ke.unit_of_measurement)??"",M=((Se=y.attributes)==null?void 0:Se.device_class)??"";return{entityId:m,dc:M,icon:B(m,y),value:isNaN($)?y.state:$.toFixed(1),unit:T,title:`${((Ce=y.attributes)==null?void 0:Ce.friendly_name)??m} — ${y.state}${T}`}}):[],historyPoints:v!=null&&v.entity_id?a:null,historyColor:(v==null?void 0:v.color)??"rgba(3, 169, 244, 0.2)",historyChart:v,historyMin:v!=null&&v.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a.map(m=>m.v)):null,historyMax:v!=null&&v.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a.map(m=>m.v)):null,historyUnit:(($e=(we=(_e=t.states)==null?void 0:_e[v==null?void 0:v.entity_id])==null?void 0:we.attributes)==null?void 0:$e.unit_of_measurement)??"",historyHours:(v==null?void 0:v.hours)??24,historyEmpty:!!(v!=null&&v.entity_id)&&Array.isArray(a)&&a.length<2,chipItems:e.show_entities!==!1?re([...s.others,...J].slice(0,e.max_entities??12).map(({entityId:m,state:y})=>{var $,T,M;return{entityId:m,isActive:Z.has(y.state),icon:B(m,y),label:(($=e.entity_labels)==null?void 0:$[m])??ne(m,y),fullName:((T=y.attributes)==null?void 0:T.friendly_name)??m,title:`${((M=y.attributes)==null?void 0:M.friendly_name)??m} — ${y.state}`}})):[]}}const pe=`
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

  /* Every interactive element in this card carries role="button" + tabindex —
     one rule gives all of them a visible keyboard-focus ring instead of
     relying on the browser's (often invisible-on-dark-themes) default. */
  [role="button"]:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
    border-radius: 2px;
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

  /* Invisible hover hit-targets for sparkline dots — must sit ABOVE
     .card-content (z-index 1), otherwise it swallows the hover before it
     reaches the (visually lower, z-index 0) sparkline dots underneath. */
  .chart-hit-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }

  /* The layer itself stays pointer-events:none (so it doesn't block clicks
     elsewhere on the card) — only the per-point hit-target dots opt back in. */
  .chart-hit-layer circle {
    pointer-events: auto;
  }

  /* Background is a fixed dark pill on purpose — text color must be fixed
     too (not a theme variable like --secondary-text-color) so contrast holds
     regardless of whether the active HA theme is light or dark; a theme's
     mid-gray secondary-text-color reads fine on its own light background but
     can fail contrast against this always-dark chip. */
  .chart-stat, .chart-threshold, .chart-tooltip {
    position: absolute;
    font-weight: 600;
    color: #fff;
    opacity: 0.95;
    background: rgba(0,0,0,0.5);
    border-radius: 3px;
    padding: 1px 4px;
    backdrop-filter: blur(3px);
    line-height: 1;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .chart-stat { font-size: 8px; }

  .chart-empty {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .stat-max    { top: 5px;    right: 7px; }
  .stat-min    { bottom: 5px; right: 7px; }
  .stat-period { bottom: 5px; left:  7px; }

  .chart-threshold {
    left: 7px;
    font-size: 9px;
    transform: translateY(-50%);
  }

  /* Tap-to-show value pill for touch devices (bindChartTooltip in dom.js)
     — native SVG <title> tooltips never fire on touch, so this is the only
     feedback a tap on a hit-target circle gets. Positioned via left/top %
     set inline from the tapped circle's own viewBox coordinates. */
  .chart-tooltip {
    display: none;
    font-size: 10px;
    z-index: 3;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }

  /* Dense series (.dense, see DOT_MAX_POINTS in sparkline.js) render with no
     permanent per-point dot — avoids scalloping a downsampled curve — so
     hovering the (otherwise invisible) hit-target is the only cue a point
     is there. This used to be painted by giving the hit-target SVG circle
     itself a fill on :hover, but that circle lives inside .bg-chart's
     stretched (preserveAspectRatio="none") viewBox — on a card whose real
     aspect ratio is far from the chart's native 300:60, the circle renders
     as a tall/wide ellipse, not a dot. This is a plain HTML marker instead,
     sized in real pixels and positioned by percentage (bindChartTooltip in
     dom.js), so it stays round regardless of how the chart is stretched. */
  .chart-hover-dot {
    display: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--room-accent-color, var(--primary-color, #03a9f4));
    z-index: 3;
    pointer-events: none;
    transform: translate(-50%, -50%);
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

  /* Temp/humidity/climate are the card's headline stat — sized and weighted
     up from the 0.72-0.83rem band everything else (chip labels, seg labels)
     sits in, so they read as the number that matters, not another chip. */
  .env-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--primary-text-color);
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
    max-width: 4.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Group chips (PTZ pad, weather readings) — one pill, many segments ── */

  .group-chip {
    padding: 2px 3px;
    gap: 0;
    cursor: default;
    /* A device can expose more segments than fit on one line (e.g. a real
       camera device with 9 operable entities) — wrap onto a second row
       inside the pill instead of clipping at the card edge. */
    flex-wrap: wrap;
  }

  .group-chip:hover {
    background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
    color: var(--secondary-text-color);
  }

  .group-seg {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 6px;
    min-height: 24px;
    box-sizing: border-box;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .group-seg:hover {
    background: var(--primary-color, #03a9f4);
    color: white;
  }

  .group-seg ha-icon { --mdc-icon-size: 13px; }

  .group-seg-value { font-size: 0.72rem; }

  /* Active/on state for toggleable segments (controls) — same language as .chip.on,
     just without the border since segments already sit inside one shared pill. */
  .group-seg.on {
    color: var(--primary-color, #03a9f4);
  }

  .ptz-chip .group-seg { padding: 3px 5px; }

  /* Any grouped pill (weather, PTZ, controls): hairline divider between segments
     so a packed pill reads as distinct readings, not one blob. */
  .group-seg:not(:last-child) {
    border-right: 1px solid var(--divider-color, rgba(128, 128, 128, 0.25));
  }

  .seg-label {
    font-size: 0.72rem;
    max-width: 3.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Group sections (Weather, and Controls/Settings/Diagnostics when
     collapsible_controls: false) ── A small visible caption + a color
     identity per pill type, so the card stops reading as one repeated
     grey-capsule component wearing three different tooltips. Diagnostics
     stays neutral on purpose — it's the "least important, read-only" bucket,
     and staying quiet is itself part of the hierarchy. Always-visible; the
     collapsible variant of Controls/Settings/Diagnostics lives in the
     .section-tabs rules below instead. */
  .group-section {
    margin-bottom: 8px;
  }

  .group-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.66rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.7;
    margin-bottom: 4px;
  }

  .group-label-weather { color: var(--primary-color, #03a9f4); }

  .weather-chip  { background: rgba(3, 169, 244, 0.08); }
  .settings-chip { background: rgba(84, 110, 122, 0.14); }

  .weather-seg[data-dc="wind_speed"] ha-icon     { color: #546e7a; }
  .weather-seg[data-dc="precipitation"] ha-icon  { color: #0288d1; }
  .weather-seg[data-dc="illuminance"] ha-icon    { color: #f9a825; }
  .weather-seg[data-dc="sound_pressure"] ha-icon { color: #8e24aa; }

  .group-seg:hover ha-icon { color: white; }

  /* ── Status cluster (battery / problem / update alerts, grouped) ──
     One pill instead of up to three separate badges — each segment keeps
     its own semantic color so battery (critical, red) and problem
     (attention, amber) stay visually distinct rather than reading as the
     same alert twice. Rules placed after the generic .group-seg:hover so
     they win the cascade at equal specificity. */
  .status-seg-battery { color: var(--error-color, #f44336); }
  .status-seg-battery:hover { background: rgba(244, 67, 54, 0.28); color: var(--error-color, #f44336); }
  .status-seg-battery:hover ha-icon { color: var(--error-color, #f44336); }

  .status-seg-problem { color: var(--warning-color, #ff9800); cursor: default; }
  .status-seg-problem:hover { background: transparent; color: var(--warning-color, #ff9800); }
  .status-seg-problem:hover ha-icon { color: var(--warning-color, #ff9800); }

  .status-seg-update { color: var(--primary-color, #03a9f4); }
  .status-seg-update:hover { background: rgba(3, 169, 244, 0.28); color: var(--primary-color, #03a9f4); }
  .status-seg-update:hover ha-icon { color: var(--primary-color, #03a9f4); }

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

  .camera-refresh-btn {
    position: absolute;
    top: 8px;
    left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    cursor: pointer;
    transition: background 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .camera-refresh-btn:hover {
    background: rgba(0, 0, 0, 0.65);
  }

  .camera-refresh-btn ha-icon { --mdc-icon-size: 14px; }

  /* ── Section tabs (Controls / Settings / Diagnostics, collapsible_controls
     default) ── One exclusive tab strip instead of three independent
     chevron accordions: only the active tab's pill is ever in the DOM, so
     switching tabs can never stack height on top of an already-open one —
     at most one panel's worth of card-height change, capped by max-height so
     a long pill scrolls internally instead of pushing sibling cards around
     in a dashboard grid. */
  .section-tabs {
    margin-top: 8px;
  }

  .section-tabs-bar {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 4px;
  }

  /* Device names run longer and more varied than the old fixed "Controls" /
     "Settings" / "Diagnostics" labels, and the tab count is no longer capped
     at 3 — wrap onto a second row (bar above) and ellipsis any single label
     that's still too long for one tab, rather than overflowing the card. */
  .section-tab {
    max-width: 6.5rem;
    padding: 3px 9px;
    border-radius: 12px;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
    opacity: 0.6;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .section-tab:hover { opacity: 0.85; }

  .section-tab.active {
    background: var(--secondary-background-color, rgba(128, 128, 128, 0.12));
    opacity: 1;
  }

  .section-tab-panel {
    display: none;
    max-height: 6.5rem;
    overflow-y: auto;
  }

  .section-tab-panel.active {
    display: flex;
    justify-content: center;
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
`;function he(t,e,a){const n=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,r=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:n,max:r,range:r-n}}function Ge(t,e=150){if(t.length<=e)return t.slice();const a=Math.floor(e/2),n=t.length/a,r=[];for(let i=0;i<a;i++){const o=Math.floor(i*n),l=i===a-1?t.length:Math.floor((i+1)*n);if(o>=l)continue;let s=-1,p=-1;for(let h=o;h<l;h++)Number.isFinite(t[h].v)&&((s===-1||t[h].v<t[s].v)&&(s=h),(p===-1||t[h].v>t[p].v)&&(p=h));if(s===-1)r.push(t[o]);else if(s===p)r.push(t[s]);else{const[h,c]=s<p?[s,p]:[p,s];r.push(t[h],t[c])}}return r}const Re=40,K=14,W=new WeakMap;function Ue(t,e,a=null,n=""){if(!(t!=null&&t.length)||t.length<2)return"";const r=W.get(t);if(r&&r.color===e&&r.hc===a&&r.unit===n)return r.result;const i=300,o=60,l=t.map(f=>f.v),s=Math.min(...l),p=Math.max(...l),{min:h,range:c}=he(a,s,p);if(c===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return W.set(t,{color:e,hc:a,unit:n,result:""}),"";const d=c||1,u=Ge(t),g=t[0].t,k=t[t.length-1].t-g||1,S=u.map(f=>(f.t-g)/k*i),E=u.map(f=>o-(f.v-h)/d*o),O=`${S.map((f,_)=>`${_?"L":"M"}${f.toFixed(1)},${E[_].toFixed(1)}`).join(" ")} V${o} H0 Z`,x=u.length>Re,b=x?"":S.map((f,_)=>`<circle cx="${f.toFixed(1)}" cy="${E[_].toFixed(1)}" r="1.5" fill="${e}"/>`).join(""),J=i/(S.length-1),A=Math.min(4,J/2).toFixed(1),Q=S.map((f,_)=>{if(!Number.isFinite(u[_].v))return"";const V=`${u[_].v.toFixed(1)}${n}`;return`<circle cx="${f.toFixed(1)}" cy="${E[_].toFixed(1)}" r="${A}" fill="transparent" data-v="${V}"/>`}).join(""),R=`<svg class="chart-hit-layer${x?" dense":""}" viewBox="0 0 ${i} ${o}" preserveAspectRatio="none" aria-hidden="true">${Q}</svg>`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null))){const f=ue(i,o,`<path d="${O}" fill="${e}"/>${b}`)+R;return W.set(t,{color:e,hc:a,unit:n,result:f}),f}const ee=a.color??"rgba(3, 169, 244, 0.12)",j=a.color_high??"rgba(244, 67, 54, 0.25)",F=a.color_low??"rgba(33, 150, 243, 0.25)",D=f=>Math.max(0,Math.min(o,o-(f-h)/d*o)),U=o*(K/100),P=f=>Math.min(o-U,Math.max(U,f)),Y=`<defs><clipPath id="sg-cp"><path d="${O}"/></clipPath></defs>`;let z=`<path d="${O}" fill="${ee}"/>`;if(a.threshold_high!=null){const f=D(a.threshold_high);if(f>0&&(z+=`<rect x="0" y="0" width="${i}" height="${f.toFixed(1)}" fill="${j}" clip-path="url(#sg-cp)"/>`),f>0&&f<o){const _=P(f).toFixed(1);z+=`<line x1="0" y1="${_}" x2="${i}" y2="${_}" stroke="${j}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}if(a.threshold_low!=null){const f=D(a.threshold_low);if(f<o&&(z+=`<rect x="0" y="${f.toFixed(1)}" width="${i}" height="${(o-f).toFixed(1)}" fill="${F}" clip-path="url(#sg-cp)"/>`),f>0&&f<o){const _=P(f).toFixed(1);z+=`<line x1="0" y1="${_}" x2="${i}" y2="${_}" stroke="${F}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}const q=ue(i,o,Y+z+b)+R;return W.set(t,{color:e,hc:a,unit:n,result:q}),q}function ue(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function Ye({areaName:t,cardIcon:e,hasLights:a,lightCount:n,offlineLights:r,occupied:i,hasOccupancySensors:o,problemCount:l,showBatteryBadge:s,batteryValue:p,batteryIcon:h,batteryEntity:c,batteryTitle:d,updateCount:u,updateEntity:g,updateTitle:w}){const k=n===0,S=k?r>0?`${r} light${r!==1?"s":""} offline`:"Lights off":`${n} light${n!==1?"s":""} on${r>0?` · ${r} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${k?"off":""} ${r>0?"has-offline":""}"
               role="button" tabindex="0" aria-label="${S}" title="${S}">
            <ha-icon icon="mdi:lightbulb${k?"-off":""}"></ha-icon>
            ${n>1?`<span>${n}</span>`:""}
          </div>`:""}
        ${o?`<div class="occupancy-dot ${i?"":"idle"}" title="${i?"Occupied":"Not occupied"}"></div>`:""}
        ${Ve({showBatteryBadge:s,batteryValue:p,batteryIcon:h,batteryEntity:c,batteryTitle:d,problemCount:l,updateCount:u,updateEntity:g,updateTitle:w})}
      </div>
    </div>`}function Ve({showBatteryBadge:t,batteryValue:e,batteryIcon:a,batteryEntity:n,batteryTitle:r,problemCount:i,updateCount:o,updateEntity:l,updateTitle:s}){const p=[];return t&&p.push(`
    <span class="group-seg status-seg-battery" data-entity="${n}" role="button" tabindex="0" aria-label="${r}" title="${r}">
      <ha-icon icon="${a}"></ha-icon><span>${e}%</span>
    </span>`),i>0&&p.push(`
    <span class="group-seg status-seg-problem" title="${i} problem${i!==1?"s":""}">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>${i>1?`<span>${i}</span>`:""}
    </span>`),o>0&&p.push(`
    <span class="group-seg status-seg-update" data-entity="${l}" role="button" tabindex="0" aria-label="${s}" title="${s}">
      <ha-icon icon="mdi:package-up"></ha-icon>${o>1?`<span>${o}</span>`:""}
    </span>`),p.length?`<div class="chip group-chip status-cluster" title="Alerts">${p.join("")}</div>`:""}function Ze({tempVal:t,humVal:e,tempUnit:a,tempEntities:n,humEntities:r,climate:i,climIcon:o,climColor:l}){var c,d,u,g,w,k,S,E;if(t===null&&e===null&&!o)return"";const s=n.length>1?`Avg of ${n.length} sensors`:((d=(c=n[0])==null?void 0:c.state.attributes)==null?void 0:d.friendly_name)??"",p=r.length>1?`Avg of ${r.length} sensors`:((g=(u=r[0])==null?void 0:u.state.attributes)==null?void 0:g.friendly_name)??"",h=((w=i==null?void 0:i.state.attributes)==null?void 0:w.friendly_name)??(i==null?void 0:i.entityId)??"";return`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((k=n[0])==null?void 0:k.entityId)??""}"
             role="button" tabindex="0" aria-label="${s}" title="${s}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((S=r[0])==null?void 0:S.entityId)??""}"
             role="button" tabindex="0" aria-label="${p}" title="${p}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${o?`
        <div class="env-chip climate"
             style="--climate-color: ${l}"
             data-entity="${i.entityId}"
             role="button" tabindex="0" aria-label="${h}" title="${h}">
          <ha-icon icon="${o}"></ha-icon>
          <span>${((E=i.state.attributes)==null?void 0:E.current_temperature)!=null?`${i.state.attributes.current_temperature}°`:i.state.state}</span>
        </div>`:""}
    </div>`}function ge(t,e,a){return a?`<div class="group-section"><span class="group-label ${e}">${t}</span>${a}</div>`:""}function Xe({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip">
      ${t.map(({entityId:e,dc:a,icon:n,value:r,unit:i,title:o})=>`
        <span class="group-seg weather-seg" data-entity="${e}" data-dc="${a}" role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="${n}"></ha-icon>
          <span class="group-seg-value">${r}${i?" "+i:""}</span>
        </span>`).join("")}
    </div>`:""}function Ke({chipItems:t}){return`${t.length?`
      <div class="entity-chips">
        ${t.map(({entityId:e,isActive:a,icon:n,label:r,title:i})=>`
          <div class="chip${a?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${i}" title="${i}">
            <ha-icon icon="${n}"></ha-icon>
            <span class="chip-label">${r}</span>
          </div>`).join("")}
      </div>`:""}`}function Je({diagnosticsItems:t}){return t.length?`
    <div class="chip group-chip diagnostics-chip">
      ${t.map(({entityId:e,icon:a,label:n,title:r})=>`
        <span class="group-seg diagnostics-seg" data-entity="${e}" role="button" tabindex="0" aria-label="${r}" title="${r}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}function Qe({chipItems:t,weatherItems:e}){const a=ge("","",Ke({chipItems:t})),n=ge("Weather","group-label-weather",Xe({weatherItems:e}));return!t.length&&!n?"":`${a}
    ${n}
    `}function et({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:n,cameraTitle:r,cameraState:i,cameraOffline:o}){if(!t)return"";const l=o?`${r} (offline)`:r;return`
    <div class="camera-preview${o?" offline":""}" data-entity="${n}"
         role="button" tabindex="0" aria-label="${l}" title="${l}">
      ${e?`<img src="${e}" alt="${l}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${i==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
      ${e?`
        <span class="camera-refresh-btn" role="button" tabindex="0" aria-label="Refresh snapshot" title="Refresh snapshot">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </span>`:""}
    </div>`}function tt({ptzItems:t}){return t.length?`
    <div class="chip group-chip ptz-chip">
      ${t.map(({entityId:e,direction:a,icon:n,title:r})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" role="button" tabindex="0" aria-label="${r}" title="${r}">
          <ha-icon icon="${n}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function at({controlItems:t}){return t.length?`
    <div class="chip group-chip controls-chip">
      ${t.map(({entityId:e,domain:a,isActive:n,icon:r,label:i,title:o})=>`
        <span class="group-seg control-seg${n?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="seg-label">${i}</span>
        </span>`).join("")}
    </div>`:""}function it({settingsItems:t}){return t.length?`
    <div class="chip group-chip settings-chip">
      ${t.map(({entityId:e,domain:a,isActive:n,icon:r,label:i,title:o})=>`
        <span class="group-seg settings-seg${n?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="seg-label">${i}</span>
        </span>`).join("")}
    </div>`:""}function nt({deviceGroups:t,collapsibleControls:e,activeSection:a}){const n=t.map(({key:r,label:i,ptz:o,controls:l,settings:s,diagnostics:p})=>({key:r,label:i,pill:tt({ptzItems:o})+at({controlItems:l})+it({settingsItems:s})+Je({diagnosticsItems:p})})).filter(r=>r.pill);return n.length?e?`
    <div class="section-tabs">
      <div class="section-tabs-bar" role="tablist">
        ${n.map(({key:r,label:i})=>`
          <span class="section-tab${a===r?" active":""}" data-section="${r}"
            role="tab" tabindex="0" aria-selected="${a===r}" title="${i}">${i}</span>`).join("")}
      </div>
      ${n.map(({key:r,pill:i})=>`
        <div class="section-tab-panel${a===r?" active":""}">${i}</div>`).join("")}
    </div>`:n.map(({label:r,pill:i})=>`
      <div class="group-section">
        <span class="group-label">${r}</span>
        <div class="group-pill">${i}</div>
      </div>`).join(""):""}function rt({smokeOn:t,gasOn:e,waterOn:a,moldRisk:n}){return!t&&!e&&!a&&!n?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${n?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function st(t){return`
    <style>${pe}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function ot({historyMin:t,historyMax:e,historyUnit:a,historyHours:n,historyChart:r,historyEmpty:i}){if(t===null)return i?'<div class="chart-overlay"><span class="chart-stat chart-empty">No numeric history</span></div>':"";const o=[];if((r==null?void 0:r.threshold_high)!=null||(r==null?void 0:r.threshold_low)!=null){const{min:l,range:s}=he(r,t,e),p=s||1,h=d=>(1-(d-l)/p)*100,c=d=>Math.min(100-K,Math.max(K,d));if(r.threshold_high!=null){const d=h(r.threshold_high);d>0&&d<100&&o.push(`<span class="chart-threshold" style="top:${c(d).toFixed(1)}%">${r.threshold_high.toFixed(1)}${a}</span>`)}if(r.threshold_low!=null){const d=h(r.threshold_low);d>0&&d<100&&o.push(`<span class="chart-threshold" style="top:${c(d).toFixed(1)}%">${r.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period" title="Tracking ${r.entity_id} — may differ from the averaged value shown above">${n}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${o.join("")}
    </div>`}function lt(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",n=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${pe}</style>
    <ha-card
      ${n?`class="${n}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?Ue(t.historyPoints,t.historyColor,t.historyChart,t.historyUnit):""}
      ${ot(t)}
      <div class="card-content">
        ${et(t)}
        ${Ye(t)}
        ${Ze(t)}
        ${Qe(t)}
        ${nt(t)}
        ${rt(t)}
      </div>
    </ha-card>`}function C(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function ct(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function dt(t,e,a){var r,i;const n=(r=t.activeElement)==null?void 0:r.className;t.innerHTML=a.error?st(a.error):lt(a),a.error||(ht(t,e,a),pt(t)),n&&((i=t.querySelector(`.${n.trim().split(/\s+/).join(".")}`))==null||i.focus())}function fe(t){const e=t.querySelector(".camera-preview img");if(!e)return;const a=new URL(e.getAttribute("src"),window.location.href);a.searchParams.set("_refresh",Date.now()),e.src=a.pathname+a.search}function pt(t){const e=t.querySelectorAll(".chart-threshold");if(!e.length)return;const a=[...t.querySelectorAll(".card-content > *")].map(r=>r.getBoundingClientRect()).filter(r=>r.width>0&&r.height>0),n=(r,i)=>r.left<i.right&&r.right>i.left&&r.top<i.bottom&&r.bottom>i.top;e.forEach(r=>{const i=r.getBoundingClientRect();a.some(o=>n(i,o))&&(r.style.display="none")})}function ht(t,e,{navPath:a,chipItems:n}){var p,h;a&&t.querySelector("ha-card").addEventListener("click",c=>{!c.target.closest(".chip")&&!c.target.closest(".env-chip")&&!c.target.closest(".badge-lights")&&!c.target.closest(".status-seg-battery")&&!c.target.closest(".status-seg-update")&&!c.target.closest(".camera-preview")&&!c.target.closest(".section-tab")&&ct(a)}),t.querySelectorAll('[role="button"][tabindex], [role="tab"][tabindex]').forEach(c=>{c.addEventListener("keydown",d=>{d.key!=="Enter"&&d.key!==" "||(d.preventDefault(),d.stopPropagation(),c.click())})}),t.querySelectorAll(".section-tab[data-section]").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),e.setActiveSection(c.dataset.section)})}),t.querySelectorAll(".ptz-seg[data-entity]").forEach(c=>{c.addEventListener("click",d=>{var u;d.stopPropagation(),(u=e._hass)!=null&&u.callService?e._hass.callService("button","press",{},{entity_id:c.dataset.entity}):C(e,c.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),C(e,c.dataset.entity)})}),t.querySelectorAll(".diagnostics-seg[data-entity]").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),C(e,c.dataset.entity)})});const r=t.querySelector(".status-seg-update[data-entity]");r&&r.addEventListener("click",c=>{c.stopPropagation(),C(e,r.dataset.entity)});const i=t.querySelector(".camera-preview[data-entity]");i&&i.addEventListener("click",c=>{c.stopPropagation(),C(e,i.dataset.entity)});const o=t.querySelector(".camera-refresh-btn");o&&o.addEventListener("click",c=>{c.stopPropagation(),fe(t)}),t.querySelectorAll(".control-seg[data-entity]").forEach(c=>{c.addEventListener("click",d=>{var w,k;d.stopPropagation();const u=c.dataset.entity,g=c.dataset.domain;g==="button"&&((w=e._hass)!=null&&w.callService)?e._hass.callService("button","press",{},{entity_id:u}):g==="siren"&&((k=e._hass)!=null&&k.callService)?e._hass.callService("siren","toggle",{},{entity_id:u}):C(e,u)})}),t.querySelectorAll(".settings-seg[data-entity]").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),C(e,c.dataset.entity)})});const l=t.querySelector(".badge-lights");l&&((p=e._config)!=null&&p.area)&&((h=e._hass)!=null&&h.callService)&&l.addEventListener("click",c=>{c.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const s=t.querySelector(".status-seg-battery[data-entity]");s&&s.addEventListener("click",c=>{c.stopPropagation(),C(e,s.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(c=>{const d=c.dataset.entity;d&&c.addEventListener("click",u=>{u.stopPropagation(),C(e,d)})}),t.querySelectorAll(".chip[data-entity]").forEach(c=>{c.addEventListener("click",d=>{d.stopPropagation(),C(e,c.dataset.entity)})}),ut(t)}function ut(t){const e=t.querySelectorAll(".chart-hit-layer circle[data-v]");if(!e.length)return;const a=t.querySelector("ha-card");let n=null,r=null;const i=(o,l)=>{o.style.left=`${parseFloat(l.getAttribute("cx"))/300*100}%`,o.style.top=`${parseFloat(l.getAttribute("cy"))/60*100}%`};e.forEach(o=>{var s;const l=(s=o.closest(".chart-hit-layer"))==null?void 0:s.classList.contains("dense");o.addEventListener("pointerenter",p=>{p.stopPropagation(),n||(n=document.createElement("div"),n.className="chart-tooltip",a.appendChild(n)),n.textContent=o.dataset.v,i(n,o),n.style.display="block",l&&(r||(r=document.createElement("div"),r.className="chart-hover-dot",a.appendChild(r)),i(r,o),r.style.display="block")}),o.addEventListener("pointerleave",p=>{p.stopPropagation(),n&&(n.style.display="none"),r&&(r.style.display="none")})})}const I=new Map,G=new Set,L=new Map,gt=2;function ft(t){for(const e of I.keys()){const a=Number(e.slice(e.lastIndexOf(":")+1));t-a>gt&&I.delete(e)}}function mt(t,e,a,n,r){var p;const i=(p=r==null?void 0:r._config)==null?void 0:p.debug,o=Math.floor(Date.now()/3e5),l=`${e}:${a}:${o}`;if(ft(o),I.has(l))return i&&console.debug("[hass-omnibus-card] history cache hit",{key:l,points:I.get(l).length}),I.get(l);if(G.has(l))return i&&console.debug("[hass-omnibus-card] history fetch pending, queuing callback",{key:l}),L.get(l).set(r,n),null;if(!(t!=null&&t.callWS))return i&&console.debug("[hass-omnibus-card] history skipped — no callWS",{entityId:e}),null;i&&console.debug("[hass-omnibus-card] history fetch start",{key:l,entityId:e,hours:a}),G.add(l),L.set(l,new Map([[r,n]]));const s=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:s,minimal_response:!0,no_attributes:!0}).then(h=>{const c=Array.isArray(h==null?void 0:h[e])?h[e]:[],d=c.map(g=>({t:(g.lu??g.last_updated??0)*1e3,v:parseFloat(g.s??g.state)})).filter(g=>!isNaN(g.v));i&&console.debug("[hass-omnibus-card] history fetch done",{key:l,rawCount:c.length,pointCount:d.length}),I.set(l,d),G.delete(l);const u=L.get(l);L.delete(l),u==null||u.forEach(g=>g(d))}).catch(h=>{i&&console.debug("[hass-omnibus-card] history fetch error",{key:l,error:h}),I.set(l,[]),G.delete(l);const c=L.get(l);L.delete(l),c==null||c.forEach(d=>d([]))}),null}class bt extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._activeSection=null,this._cameraRefreshTimer=null}setConfig(e){var a,n;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');(n=this._config)!=null&&n.debug&&console.debug("[hass-omnibus-card] set config",{config:e}),this._config={...e},this._stateHash=null,this._activeSection=e.controls_collapsed===!1?"__default__":null,this._hass&&this._update(),this._startCameraRefreshTimer()}connectedCallback(){this._startCameraRefreshTimer()}disconnectedCallback(){clearInterval(this._cameraRefreshTimer)}_startCameraRefreshTimer(){var a,n,r;(a=this._config)!=null&&a.debug&&console.debug("[hass-omnibus-card] start camera refresh timer",{interval:(n=this._config)==null?void 0:n.camera_refresh_interval}),clearInterval(this._cameraRefreshTimer);const e=(r=this._config)==null?void 0:r.camera_refresh_interval;!e||e<=0||(this._cameraRefreshTimer=setInterval(()=>fe(this.shadowRoot),e*6e4))}setActiveSection(e){var a;(a=this._config)!=null&&a.debug&&console.debug("[hass-omnibus-card] set active section",{section:e}),this._activeSection=this._activeSection===e?null:e,this._update()}set hass(e){var n;if((n=this._config)!=null&&n.debug&&console.debug("[hass-omnibus-card] set hass",{hass:e}),this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var n,r,i,o;if(!this._hass||!this._config)return"";let e;if((n=this._config.entities)!=null&&n.length)e=this._config.entities.map(l=>{var s;return{entityId:l,state:(s=this._hass.states)==null?void 0:s[l]}}).filter(l=>l.state);else{e=oe(this._hass,this._config.area);for(const l of this._config.add_entities??[])if(!e.some(s=>s.entityId===l)){const s=(r=this._hass.states)==null?void 0:r[l];s&&e.push({entityId:l,state:s})}}const a=(i=this._config.history_chart)==null?void 0:i.entity_id;if(a&&!e.some(l=>l.entityId===a)){const l=(o=this._hass.states)==null?void 0:o[a];l&&e.push({entityId:a,state:l})}return e.map(({entityId:l,state:s})=>{var p,h,c;return`${l}=${s.state}|${((p=s.attributes)==null?void 0:p.rgb_color)??""}|${((h=s.attributes)==null?void 0:h.current_temperature)??""}|${((c=s.attributes)==null?void 0:c.entity_picture)??""}`}).sort().join(";")}_update(){var r,i;let e=null;const a=(r=this._config)==null?void 0:r.history_chart;a!=null&&a.entity_id&&(e=mt(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const n=We(this._hass,this._config,e,this._activeSection);n.error||(this._activeSection=n.activeSection??null),(i=this._config)!=null&&i.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:n}),dt(this.shadowRoot,this,n)}}window.customCards=window.customCards||[],window.customCards.push({type:te,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${Ee} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(te,bt)})();
