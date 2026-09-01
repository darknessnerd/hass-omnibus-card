(function(){"use strict";const te="hass-omnibus-card",Ne="2.6.0",H=new Set(["on","open","playing","home","unlocked"]),Me={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},ae={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},opening:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},garage_door:{on:"mdi:garage-open",off:"mdi:garage"},lock:{on:"mdi:lock-open",off:"mdi:lock"},tamper:{on:"mdi:shield-alert",off:"mdi:shield-check-outline"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high",voltage:"mdi:flash-triangle-outline",tv:"mdi:television",speaker:"mdi:speaker",receiver:"mdi:audio-video"},Oe="mdi:weather-windy-variant",ne={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv",remote:"mdi:remote",lock:{on:"mdi:lock-open-variant",off:"mdi:lock"},vacuum:"mdi:robot-vacuum",humidifier:{on:"mdi:air-humidifier",off:"mdi:air-humidifier-off"},water_heater:"mdi:water-boiler",valve:{on:"mdi:valve-open",off:"mdi:valve-closed"},number:"mdi:ray-vertex",select:"mdi:format-list-bulleted",text:"mdi:form-textbox",scene:"mdi:palette",timer:"mdi:timer-outline",alarm_control_panel:"mdi:shield-home-outline"},je={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"},De=/_(max|gust|peak)$/i;function ie(t,e){var i;return(((i=e.attributes)==null?void 0:i.friendly_name)??t.split(".")[1]).split(" ").pop()}function oe(t){const e=new Map;for(const i of t)e.set(i.label,(e.get(i.label)??0)+1);if(![...e.values()].some(i=>i>1))return t;const a=i=>i.fullName.trim().split(/\s+/);return t.map(i=>{if(e.get(i.label)===1)return i;const o=a(i);for(let n=2;n<=o.length;n++){const s=o.slice(-n).join(" ");if(!t.some(r=>r!==i&&a(r).slice(-n).join(" ")===s))return{...i,label:s}}return{...i,label:i.entityId.split(".")[1]}})}function Fe(t,e,a){var c;const i=(c=t.devices)==null?void 0:c[e],o=(i==null?void 0:i.name_by_user)??(i==null?void 0:i.name);if(o)return o;const n=a.map(({entityId:r})=>r.split(".")[1].split("_"));let s=n[0]??[];for(const r of n.slice(1)){let d=0;for(;d<s.length&&d<r.length&&s[d]===r[d];)d++;s=s.slice(0,d)}return s.length?s.map(r=>r[0].toUpperCase()+r.slice(1)).join(" "):"Device"}function Pe({ptz:t=[],controls:e=[],settings:a=[],diagnostics:i=[]}){for(const o of[a,e,i,t]){const n=o.find(s=>s.icon);if(n)return n.icon}return"mdi:help-circle-outline"}function M(t,e){var s,c;if((s=e.attributes)!=null&&s.icon)return e.attributes.icon;const a=t.split(".")[0],i=((c=e.attributes)==null?void 0:c.device_class)??"",o=H.has(e.state),n=r=>typeof r=="string"?r:o?r.on:r.off;return a==="sensor"&&i==="battery"?re(parseFloat(e.state)):i==="wind_speed"&&De.test(t)?Oe:i&&ae[i]?n(ae[i]):ne[a]?n(ne[a]):"mdi:help-circle-outline"}function R(t,e,a){var o,n;if(e==null)return a;if(typeof e=="number")return e;const i=parseFloat((n=(o=t.states)==null?void 0:o[e])==null?void 0:n.state);return Number.isFinite(i)?i:a}function re(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function se(t,e){const{entities:a={},devices:i={},states:o={}}=t;return Object.keys(o).reduce((n,s)=>{var h;const c=a[s];if(!c||c.hidden_by)return n;const r=c.area_id===e,d=c.device_id&&((h=i[c.device_id])==null?void 0:h.area_id)===e;return(r||d)&&n.push({entityId:s,state:o[s],deviceId:c.device_id??null,entityCategory:c.entity_category??null}),n},[])}function Be(t,e,a){var s,c,r;if((s=e.entities)!=null&&s.length)return e.entities.map(d=>{var p,u;const h=(p=a.states)==null?void 0:p[d],l=(u=a.entities)==null?void 0:u[d];return h?{entityId:d,state:h,deviceId:(l==null?void 0:l.device_id)??null,entityCategory:(l==null?void 0:l.entity_category)??null}:null}).filter(Boolean);const i=new Set(e.exclude_entities??[]),o=e.add_entities??[],n=t.filter(d=>!i.has(d.entityId));for(const d of o){if(n.some(p=>p.entityId===d))continue;const h=(c=a.states)==null?void 0:c[d],l=(r=a.entities)==null?void 0:r[d];h&&n.push({entityId:d,state:h,deviceId:(l==null?void 0:l.device_id)??null,entityCategory:(l==null?void 0:l.entity_category)??null})}return n}const qe=new Set(["sensor","binary_sensor","image"]),He=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),le={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},Re=new RegExp(`ptz.*_(${Object.keys(le).join("|")})$`,"i"),We=new Set(["door","window","opening","garage_door"]),Ge=/_dew_point$/i,Ue=/_(privacy|riservatezza|suspend|sospensione)$/i;function Ye(t){var o;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],openings:[],tampers:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],cameraPrivacy:[],controls:[],settings:[],ptz:[],updates:[],others:[],diagnostics:[]};for(const n of t){const{entityId:s,state:c}=n,r=s.split(".")[0],d=((o=c.attributes)==null?void 0:o.device_class)??"",h=c.state,l=!n.entityCategory;if(r==="light")e.lights.push(n);else if(r==="climate")e.climate.push(n);else if(r==="camera")e.cameras.push(n);else if(r==="update"&&h!=="unavailable")e.updates.push(n);else if(r==="sensor"&&d==="temperature"&&l&&Ge.test(s))e.weathers.push(n);else if(r==="sensor"&&d==="temperature"&&l)e.temperatures.push(n);else if(r==="sensor"&&d==="humidity"&&l)e.humidities.push(n);else if(r==="sensor"&&He.has(d)&&l)e.weathers.push(n);else if(r==="binary_sensor"&&d==="motion")e.motions.push(n);else if(r==="binary_sensor"&&d==="occupancy")e.occupancy.push(n);else if(r==="binary_sensor"&&We.has(d)&&h!=="unavailable")e.openings.push(n);else if(r==="binary_sensor"&&d==="tamper"&&h!=="unavailable")e.tampers.push(n);else if(r==="binary_sensor"&&d==="smoke")e.smokes.push(n);else if(r==="binary_sensor"&&d==="gas")e.gases.push(n);else if(r==="binary_sensor"&&d==="moisture")e.moistures.push(n);else if(r==="sensor"&&d==="battery"&&h!=="unavailable")e.batteries.push(n),e.others.push(n);else if(r==="switch"&&Ue.test(s))e.cameraPrivacy.push(n),e.others.push(n);else if(h==="unavailable"||r==="binary_sensor"&&["problem","safety"].includes(d)&&h==="on")e.problems.push(n);else if(r==="siren")e.controls.push(n);else if(r==="button"){const p=s.match(Re);p?e.ptz.push({...n,direction:le[p[1].toLowerCase()]}):e.controls.push(n)}else e.others.push(n)}const a=new Map;for(const n of e.others)n.deviceId&&(a.has(n.deviceId)||a.set(n.deviceId,[]),a.get(n.deviceId).push(n));const i=[];for(const n of e.others){const s=n.deviceId?a.get(n.deviceId):null;if(!s||s.length<2){i.push(n);continue}const c=n.entityId.split(".")[0];qe.has(c)?e.diagnostics.push(n):e.settings.push(n)}return e.others=i,e}function ce(t){const{controls:e,settings:a,diagnostics:i}=t,o=oe([...e,...a,...i]);return{ptz:t.ptz,controls:o.slice(0,e.length),settings:o.slice(e.length,e.length+a.length),diagnostics:o.slice(e.length+a.length)}}function Ze(t,{ptz:e,controls:a,settings:i,diagnostics:o},n=null){const s={ptz:e,controls:a,settings:i,diagnostics:o},c=()=>({ptz:[],controls:[],settings:[],diagnostics:[]}),r=p=>p.ptz.length+p.controls.length+p.settings.length+p.diagnostics.length,d=new Map;for(const[p,u]of Object.entries(s))for(const f of u){const w=f.deviceId??null;d.has(w)||d.set(w,c()),d.get(w)[p].push(f)}const h=[];let l=c();for(const[p,u]of d)if(p==null||r(u)<2)for(const f of["ptz","controls","settings","diagnostics"])l[f].push(...u[f]);else{const f=ce(u),w=[...f.ptz,...f.controls,...f.settings,...f.diagnostics],y=p===n?"mdi:cctv":Pe(f);h.push({key:p,label:Fe(t,p,w),icon:y,...f})}return l=ce(l),h.sort((p,u)=>p.key===n?-1:u.key===n?1:r(u)-r(p)),r(l)>0&&h.push({key:"__other__",label:"Other",icon:"mdi:dots-horizontal",...l}),h}function de(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,i)=>a+i,0)/e.length:null}function O(t){return t.some(e=>e.state.state==="on")}function Ve(t){return t.filter(e=>e.state.state==="on")}function Xe(t){let e=null;for(const a of t){const i=parseFloat(a.state.state);isNaN(i)||(!e||i<e.value)&&(e={value:i,entityId:a.entityId,state:a.state})}return e}function Ke(t){var e;for(const a of t){const i=(e=a.state.attributes)==null?void 0:e.rgb_color;if(i)return`rgb(${i.join(",")})`}return null}function Je(t,e){const a=R(t,e.threshold_high,null),i=R(t,e.threshold_low,null);return a===e.threshold_high&&i===e.threshold_low?e:{...e,threshold_high:a,threshold_low:i}}function K(t,e,a,i){var o,n,s;return{entityId:t,deviceId:a,domain:t.split(".")[0],isActive:H.has(e.state),icon:M(t,e),label:((o=i.entity_labels)==null?void 0:o[t])??ie(t,e),fullName:((n=e.attributes)==null?void 0:n.friendly_name)??t,title:`${((s=e.attributes)==null?void 0:s.friendly_name)??t} — ${e.state}`}}function pe(t,e,a,i,o){var s;const n=H.has(e.state);return{entityId:t,icon:M(t,e),[a]:n,title:`${((s=e.attributes)==null?void 0:s.friendly_name)??t} — ${n?i:o}`}}function Qe(t,e,a){if(!Array.isArray(t)||t.length<4)return null;const i=Math.floor(t.length/2),o=t.slice(0,i),n=t.slice(i),s=d=>d.reduce((h,l)=>h+l.v,0)/d.length,c=s(n)-s(o),r=a-e;return r===0||Math.abs(c)<r*.05?"flat":c>0?"up":"down"}function et(t,e,a=null,i=null){var m,$,X,ye,xe,we,_e,$e,ke,Se,Ce,Ee,Ae,Te;const o=e.area,n=(m=t.areas)==null?void 0:m[o];if(!n&&!e.name&&!(($=e.entities)!=null&&$.length))return{error:o??"(no area)"};const s=(X=e.entities)!=null&&X.length?[]:se(t,o),c=Be(s,e,t),r=Ye(c),d=Ve(r.lights),h=Ke(d),l=de(r.temperatures),p=de(r.humidities),u=r.climate[0]??null,[f,w]=Me[(ye=u==null?void 0:u.state)==null?void 0:ye.state]??[null,null],y=R(t,e.mold_threshold,70),E=e.navigate_to||((xe=e.tap_action)==null?void 0:xe.navigation_path)||null,S=e.history_chart??null,x=S?Je(t,S):null,j=R(t,e.battery_low_threshold,20),_=Xe(r.batteries),b=r.cameras[0]??null,Q=r.cameras.slice(1),D=b?r.cameraPrivacy.find(g=>g.deviceId===b.deviceId)??null:null,A=r.updates.filter(g=>g.state.state==="on"),U=e.show_entities!==!1?r.controls.map(({entityId:g,state:v,deviceId:k})=>K(g,v,k,e)):[],ve=e.show_entities!==!1?r.settings.map(({entityId:g,state:v,deviceId:k})=>K(g,v,k,e)):[],ee=e.show_entities!==!1?r.ptz.map(({entityId:g,state:v,direction:k,deviceId:I})=>{var L;return{entityId:g,deviceId:I,direction:k,icon:je[k],title:((L=v.attributes)==null?void 0:L.friendly_name)??g}}):[],Y=e.show_entities!==!1?r.diagnostics.map(({entityId:g,state:v,deviceId:k})=>K(g,v,k,e)):[],F=e.collapsible_controls!==!1,P=Ze(t,{ptz:ee,controls:U,settings:ve,diagnostics:Y},(b==null?void 0:b.deviceId)??null),B=P.map(g=>g.key),Z=F?i==="__default__"?B[0]??null:B.includes(i)?i:null:null,V=!!(x!=null&&x.entity_id&&(a==null?void 0:a.length)>=2),T=V?Math.min(...a.map(g=>g.v)):null,q=V?Math.max(...a.map(g=>g.v)):null;return{areaName:e.name||(n==null?void 0:n.name)||o||"",cardIcon:e.icon||(n==null?void 0:n.icon)||"mdi:home",navPath:E,hasLights:r.lights.length>0,lightCount:d.length,offlineLights:r.lights.filter(g=>g.state.state==="unavailable").length,lightColor:h,occupied:O(r.motions)||O(r.occupancy),hasOccupancySensors:r.motions.length>0||r.occupancy.length>0,problemCount:r.problems.length,showBatteryBadge:_!=null&&_.value<=j,batteryValue:(_==null?void 0:_.value)??null,batteryIcon:_?re(_.value):null,batteryEntity:(_==null?void 0:_.entityId)??null,batteryTitle:_?`${r.batteries.length>1?`Lowest of ${r.batteries.length} — `:""}${((we=_.state.attributes)==null?void 0:we.friendly_name)??_.entityId}: ${_.value}%`:"",tempVal:l,humVal:p,tempUnit:(($e=(_e=r.temperatures[0])==null?void 0:_e.state.attributes)==null?void 0:$e.unit_of_measurement)??"°C",tempEntities:r.temperatures,humEntities:r.humidities,climate:u,climIcon:f,climColor:w,smokeOn:O(r.smokes),gasOn:O(r.gases),waterOn:O(r.moistures),moldRisk:p!==null&&p>=y,updateCount:A.length,updateEntity:((ke=A[0])==null?void 0:ke.entityId)??null,updateTitle:A.length?`${A.length} update${A.length!==1?"s":""} available: ${A.map(g=>{var v;return((v=g.state.attributes)==null?void 0:v.friendly_name)??g.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!b,cameraEntity:(b==null?void 0:b.entityId)??null,cameraImage:((Se=b==null?void 0:b.state.attributes)==null?void 0:Se.entity_picture)??null,cameraIcon:b?M(b.entityId,b.state):null,cameraTitle:((Ce=b==null?void 0:b.state.attributes)==null?void 0:Ce.friendly_name)??(b==null?void 0:b.entityId)??"",cameraState:(b==null?void 0:b.state.state)??"",cameraOffline:(b==null?void 0:b.state.state)==="unavailable",cameraPrivacy:(D==null?void 0:D.state.state)==="on",deviceGroups:P,collapsibleControls:F,activeSection:Z,openingItems:e.show_entities!==!1?r.openings.map(({entityId:g,state:v})=>pe(g,v,"isOpen","Open","Closed")):[],tamperItems:e.show_entities!==!1?r.tampers.map(({entityId:g,state:v})=>pe(g,v,"isTampered","Tamper detected","Normal")):[],weatherItems:e.show_entities!==!1?r.weathers.map(({entityId:g,state:v})=>{var ze,Ie,Le;const k=parseFloat(v.state),I=((ze=v.attributes)==null?void 0:ze.unit_of_measurement)??"",L=((Ie=v.attributes)==null?void 0:Ie.device_class)??"";return{entityId:g,dc:L,icon:M(g,v),value:isNaN(k)?v.state:k.toFixed(1),unit:I,title:`${((Le=v.attributes)==null?void 0:Le.friendly_name)??g} — ${v.state}${I}`}}):[],historyPoints:x!=null&&x.entity_id?a:null,historyColor:(x==null?void 0:x.color)??"rgba(3, 169, 244, 0.2)",historyChart:x,historyMin:T,historyMax:q,historyTrend:Qe(a,T,q),historyUnit:((Te=(Ae=(Ee=t.states)==null?void 0:Ee[x==null?void 0:x.entity_id])==null?void 0:Ae.attributes)==null?void 0:Te.unit_of_measurement)??"",historyHours:(x==null?void 0:x.hours)??24,historyEmpty:!!(x!=null&&x.entity_id)&&Array.isArray(a)&&a.length<2,chipItems:e.show_entities!==!1?oe([...r.others,...Q].slice(0,e.max_entities??12).map(({entityId:g,state:v})=>{var k,I,L;return{entityId:g,isActive:H.has(v.state),icon:M(g,v),label:((k=e.entity_labels)==null?void 0:k[g])??ie(g,v),fullName:((I=v.attributes)==null?void 0:I.friendly_name)??g,title:`${((L=v.attributes)==null?void 0:L.friendly_name)??g} — ${v.state}`}})):[]}}const he=`
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

  /* max-height caps these three to roughly a card's height with no device
     tab open (camera preview + header + env row + chips + tab bar) — an open
     tab's own content isn't part of what the chart is meant to back. Without
     this, growing a tab (see .section-tab-panel — no scroll cap, by design)
     stretches the chart/hit-layer proportionally with it: since top+bottom
     stay pinned (inset: 0) but the container's actual height grows, every
     percentage-positioned hit-target circle drifts further down in real
     pixels, eventually landing on top of unrelated controls below the chart
     (confirmed: it could intercept clicks on a second device tab once a
     first tab's content had pushed the card tall enough). max-height clamps
     the box at that ceiling instead, anchored to the top via inset: 0's own
     top: 0 — content taller than the cap just grows past the chart's
     bottom edge rather than dragging the chart (and its hit-targets) down
     with it. */
  .bg-chart {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-height: none;
    z-index: 0;
    pointer-events: none;
  }

  .chart-overlay {
    position: absolute;
    inset: 0;
    max-height: 22rem;
    pointer-events: none;
    z-index: 0;
  }

  /* Invisible hover hit-targets for sparkline dots — sit BELOW .card-content
     (z-index 2), on purpose: real controls (a device tab, a chip) always win
     a click/hover over an invisible dot that happens to share their screen
     position, rather than the dot silently swallowing it. This used to be
     inverted (hit-layer above card-content, so a dot's hover would register
     even where content visually covered it) — confirmed broken by a real
     case: a dense series' hit-target circle landed exactly on a second
     device tab and ate every click meant for it. The cost is dot-hover only
     works where the chart is visually exposed (gaps between chips/tabs), not
     "through" solid content — a worse hover nicety is a fair trade for
     controls that are reliably clickable everywhere. */
  .chart-hit-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-height: 22rem;
    z-index: 1;
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

  /* Dimmer than the shared .chart-threshold/.chart-tooltip opacity above —
     these three are always-on chrome sitting over the chart on every render,
     not a hover/tap-triggered readout, so they need to recede rather than
     compete with the line itself. Scoped to the specific classes (not the
     shared .chart-stat) so it doesn't also wash out .chart-empty's one-and-
     only message or the trend badge's deliberately saturated colors below. */
  .stat-max, .stat-min, .stat-period { opacity: 0.55; }

  .stat-trend { font-weight: 700; }
  .trend-up   { color: #ff8a65; }
  .trend-down { color: #4fc3f7; }
  .trend-flat { color: #bdbdbd; }

  .chart-empty {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .stat-max    { top: 5px;    right: 7px; }
  .stat-min    { bottom: 5px; right: 7px; }
  .stat-period { bottom: 5px; left:  7px; }
  .stat-trend  { top: 5px;    left:  7px; }

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
    z-index: 2;
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

  /* Sub-caption for a role's pill (PTZ/Controls/Settings/Diagnostics) inside
     one device's tab/stacked group. Once a device bundles multiple role
     pills together, the tab/group label alone ("Cam Cucina") no longer says
     where its settings end and its diagnostics begin — this restores that
     boundary as a text caption rather than a forced color, so diagnostics
     can stay visually neutral (see .group-section above) while still being
     distinguishable from ptz/controls above/below it. Smaller and dimmer
     than .group-label — it's one level deeper, captioning a pill within a
     device, not the device itself. */
  .device-role { margin-bottom: 6px; }
  .device-role:last-child { margin-bottom: 0; }

  .device-role-label {
    display: block;
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.5;
    margin-bottom: 2px;
  }

  .weather-chip  { background: rgba(3, 169, 244, 0.08); }
  .settings-chip { background: rgba(84, 110, 122, 0.14); }

  .weather-seg[data-dc="wind_speed"] ha-icon     { color: #546e7a; }
  .weather-seg[data-dc="precipitation"] ha-icon  { color: #0288d1; }
  .weather-seg[data-dc="illuminance"] ha-icon    { color: #f9a825; }
  .weather-seg[data-dc="sound_pressure"] ha-icon { color: #8e24aa; }

  /* Shared "all clear" swatch for opening/tamper segments — green, not grey,
     so closed/normal reads as a positive state at a glance (not just an
     absence of alert color) instead of icon tint alone (too subtle at
     13px). Each .on variant below overrides bg+color only. */
  .opening-seg, .tamper-seg {
    background: rgba(76, 175, 80, 0.15);
    color: var(--success-color, #4caf50);
  }
  /* Open door/window — amber, same on/off language as .badge-lights. */
  .opening-seg.on {
    background: rgba(255, 152, 0, 0.28);
    color: var(--warning-color, #ff9800);
  }
  /* Tamper — red, not amber, so it never reads as "just a door open" next
     to the openings badge it sits beside. */
  .tamper-seg.on {
    background: rgba(244, 67, 54, 0.28);
    color: var(--error-color, #f44336);
  }

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

  .camera-preview.privacy {
    opacity: 0.75;
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

  /* ── Section tabs (one per device, collapsible_controls default) ── One
     exclusive tab strip instead of one accordion per device: only the
     active tab's pill is ever visible, so switching tabs can never stack
     height on top of an already-open one — at most one panel's worth of
     card-height change. No internal scroll/max-height on purpose: a nested
     scroll region inside a card that's already inside a scrolling dashboard
     is a scroll trap on touch (a swipe meant for the page scrolls the tiny
     box instead), and a hard-clipped edge with no fade/affordance reads as
     "that's everything" rather than "there's more below" — a busy device
     (a real IR blaster can expose 25+ segments) just makes the card taller
     instead of hiding content either way. */
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
    display: inline-flex;
    align-items: center;
    gap: 4px;
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
  }

  .section-tab ha-icon {
    --mdc-icon-size: 13px;
    flex-shrink: 0;
  }

  .section-tab-label {
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
  }

  .section-tab-panel.active {
    display: flex;
    flex-wrap: wrap;
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
`;function ue(t,e,a){const i=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,o=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:i,max:o,range:o-i}}function tt(t,e=150){if(t.length<=e)return t.slice();const a=Math.floor(e/2),i=t.length/a,o=[];for(let n=0;n<a;n++){const s=Math.floor(n*i),c=n===a-1?t.length:Math.floor((n+1)*i);if(s>=c)continue;let r=-1,d=-1;for(let h=s;h<c;h++)Number.isFinite(t[h].v)&&((r===-1||t[h].v<t[r].v)&&(r=h),(d===-1||t[h].v>t[d].v)&&(d=h));if(r===-1)o.push(t[s]);else if(r===d)o.push(t[r]);else{const[h,l]=r<d?[r,d]:[d,r];o.push(t[h],t[l])}}return o}const at=40,J=14,W=new WeakMap;function nt(t,e,a=null,i=""){if(!(t!=null&&t.length)||t.length<2)return"";const o=W.get(t);if(o&&o.color===e&&o.hc===a&&o.unit===i)return o.result;const n=300,s=60,c=t.map(m=>m.v),r=Math.min(...c),d=Math.max(...c),{min:h,range:l}=ue(a,r,d);if(l===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return W.set(t,{color:e,hc:a,unit:i,result:""}),"";const p=l||1,u=tt(t),f=t[0].t,y=t[t.length-1].t-f||1,E=u.map(m=>(m.t-f)/y*n),S=u.map(m=>s-(m.v-h)/p*s),j=`${E.map((m,$)=>`${$?"L":"M"}${m.toFixed(1)},${S[$].toFixed(1)}`).join(" ")} V${s} H0 Z`,_=u.length>at,b=_?"":E.map((m,$)=>`<circle cx="${m.toFixed(1)}" cy="${S[$].toFixed(1)}" r="1.5" fill="${e}"/>`).join(""),Q=n/(E.length-1),D=Math.min(4,Q/2).toFixed(1),A=E.map((m,$)=>{if(!Number.isFinite(u[$].v))return"";const X=`${u[$].v.toFixed(1)}${i}`;return`<circle cx="${m.toFixed(1)}" cy="${S[$].toFixed(1)}" r="${D}" fill="transparent" data-v="${X}"/>`}).join(""),U=`<svg class="chart-hit-layer${_?" dense":""}" viewBox="0 0 ${n} ${s}" preserveAspectRatio="none" aria-hidden="true">${A}</svg>`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null))){const m=ge(n,s,`<path d="${j}" fill="${e}"/>${b}`)+U;return W.set(t,{color:e,hc:a,unit:i,result:m}),m}const ee=a.color??"rgba(3, 169, 244, 0.12)",Y=a.color_high??"rgba(244, 67, 54, 0.25)",F=a.color_low??"rgba(33, 150, 243, 0.25)",P=m=>Math.max(0,Math.min(s,s-(m-h)/p*s)),B=s*(J/100),Z=m=>Math.min(s-B,Math.max(B,m)),V=`<defs><clipPath id="sg-cp"><path d="${j}"/></clipPath></defs>`;let T=`<path d="${j}" fill="${ee}"/>`;if(a.threshold_high!=null){const m=P(a.threshold_high);if(m>0&&(T+=`<rect x="0" y="0" width="${n}" height="${m.toFixed(1)}" fill="${Y}" clip-path="url(#sg-cp)"/>`),m>0&&m<s){const $=Z(m).toFixed(1);T+=`<line x1="0" y1="${$}" x2="${n}" y2="${$}" stroke="${Y}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}if(a.threshold_low!=null){const m=P(a.threshold_low);if(m<s&&(T+=`<rect x="0" y="${m.toFixed(1)}" width="${n}" height="${(s-m).toFixed(1)}" fill="${F}" clip-path="url(#sg-cp)"/>`),m>0&&m<s){const $=Z(m).toFixed(1);T+=`<line x1="0" y1="${$}" x2="${n}" y2="${$}" stroke="${F}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}const q=ge(n,s,V+T+b)+U;return W.set(t,{color:e,hc:a,unit:i,result:q}),q}function ge(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function it({areaName:t,cardIcon:e,hasLights:a,lightCount:i,offlineLights:o,occupied:n,hasOccupancySensors:s,problemCount:c,showBatteryBadge:r,batteryValue:d,batteryIcon:h,batteryEntity:l,batteryTitle:p,updateCount:u,updateEntity:f,updateTitle:w,openingItems:y,tamperItems:E}){const S=i===0,x=S?o>0?`${o} light${o!==1?"s":""} offline`:"Lights off":`${i} light${i!==1?"s":""} on${o>0?` · ${o} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${S?"off":""} ${o>0?"has-offline":""}"
               role="button" tabindex="0" aria-label="${x}" title="${x}">
            <ha-icon icon="mdi:lightbulb${S?"-off":""}"></ha-icon>
            ${i>1?`<span>${i}</span>`:""}
          </div>`:""}
        ${ct({openingItems:y})}
        ${lt({tamperItems:E})}
        ${s?`<div class="occupancy-dot ${n?"":"idle"}" title="${n?"Occupied":"Not occupied"}"></div>`:""}
        ${ot({showBatteryBadge:r,batteryValue:d,batteryIcon:h,batteryEntity:l,batteryTitle:p,problemCount:c,updateCount:u,updateEntity:f,updateTitle:w})}
      </div>
    </div>`}function ot({showBatteryBadge:t,batteryValue:e,batteryIcon:a,batteryEntity:i,batteryTitle:o,problemCount:n,updateCount:s,updateEntity:c,updateTitle:r}){const d=[];return t&&d.push(`
    <span class="group-seg status-seg-battery" data-entity="${i}" role="button" tabindex="0" aria-label="${o}" title="${o}">
      <ha-icon icon="${a}"></ha-icon><span>${e}%</span>
    </span>`),n>0&&d.push(`
    <span class="group-seg status-seg-problem" title="${n} problem${n!==1?"s":""}">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>${n>1?`<span>${n}</span>`:""}
    </span>`),s>0&&d.push(`
    <span class="group-seg status-seg-update" data-entity="${c}" role="button" tabindex="0" aria-label="${r}" title="${r}">
      <ha-icon icon="mdi:package-up"></ha-icon>${s>1?`<span>${s}</span>`:""}
    </span>`),d.length?`<div class="chip group-chip status-cluster" title="Alerts">${d.join("")}</div>`:""}function rt({tempVal:t,humVal:e,tempUnit:a,tempEntities:i,humEntities:o,climate:n,climIcon:s,climColor:c}){var l,p,u,f,w,y,E,S;if(t===null&&e===null&&!s)return"";const r=i.length>1?`Avg of ${i.length} sensors`:((p=(l=i[0])==null?void 0:l.state.attributes)==null?void 0:p.friendly_name)??"",d=o.length>1?`Avg of ${o.length} sensors`:((f=(u=o[0])==null?void 0:u.state.attributes)==null?void 0:f.friendly_name)??"",h=((w=n==null?void 0:n.state.attributes)==null?void 0:w.friendly_name)??(n==null?void 0:n.entityId)??"";return`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((y=i[0])==null?void 0:y.entityId)??""}"
             role="button" tabindex="0" aria-label="${r}" title="${r}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((E=o[0])==null?void 0:E.entityId)??""}"
             role="button" tabindex="0" aria-label="${d}" title="${d}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${s?`
        <div class="env-chip climate"
             style="--climate-color: ${c}"
             data-entity="${n.entityId}"
             role="button" tabindex="0" aria-label="${h}" title="${h}">
          <ha-icon icon="${s}"></ha-icon>
          <span>${((S=n.state.attributes)==null?void 0:S.current_temperature)!=null?`${n.state.attributes.current_temperature}°`:n.state.state}</span>
        </div>`:""}
    </div>`}function fe(t,e,a){return a?`<div class="group-section"><span class="group-label ${e}">${t}</span>${a}</div>`:""}function st({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip">
      ${t.map(({entityId:e,dc:a,icon:i,value:o,unit:n,title:s})=>`
        <span class="group-seg weather-seg" data-entity="${e}" data-dc="${a}" role="button" tabindex="0" aria-label="${s}" title="${s}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="group-seg-value">${o}${n?" "+n:""}</span>
        </span>`).join("")}
    </div>`:""}function lt({tamperItems:t}){return t.length?`
    <div class="chip group-chip tamper-chip">
      ${t.map(({entityId:e,icon:a,isTampered:i,title:o})=>`
        <span class="group-seg tamper-seg${i?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="${a}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function ct({openingItems:t}){return t.length?`
    <div class="chip group-chip openings-chip">
      ${t.map(({entityId:e,icon:a,isOpen:i,title:o})=>`
        <span class="group-seg opening-seg${i?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="${a}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function dt({chipItems:t}){return`${t.length?`
      <div class="entity-chips">
        ${t.map(({entityId:e,isActive:a,icon:i,label:o,title:n})=>`
          <div class="chip${a?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${n}" title="${n}">
            <ha-icon icon="${i}"></ha-icon>
            <span class="chip-label">${o}</span>
          </div>`).join("")}
      </div>`:""}`}function pt({diagnosticsItems:t}){return t.length?`
    <div class="chip group-chip diagnostics-chip">
      ${t.map(({entityId:e,icon:a,label:i,title:o})=>`
        <span class="group-seg diagnostics-seg" data-entity="${e}" role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="seg-label">${i}</span>
        </span>`).join("")}
    </div>`:""}function ht({chipItems:t,weatherItems:e}){const a=fe("","",dt({chipItems:t})),i=fe("Weather","group-label-weather",st({weatherItems:e}));return!t.length&&!i?"":`${a}
    ${i}
    `}function ut({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:i,cameraTitle:o,cameraState:n,cameraOffline:s,cameraPrivacy:c}){if(!t)return"";const r=c?`${o} (privacy mode)`:s?`${o} (offline)`:o,d=e&&!c;return`
    <div class="camera-preview${s?" offline":""}${c?" privacy":""}" data-entity="${i}"
         role="button" tabindex="0" aria-label="${r}" title="${r}">
      ${d?`<img src="${e}" alt="${r}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${c?"mdi:eye-off":a}"></ha-icon></div>`}
      ${n==="recording"&&!c?'<span class="camera-rec-dot" title="Recording"></span>':""}
      ${d?`
        <span class="camera-refresh-btn" role="button" tabindex="0" aria-label="Refresh snapshot" title="Refresh snapshot">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </span>`:""}
    </div>`}function gt({ptzItems:t}){return t.length?`
    <div class="chip group-chip ptz-chip">
      ${t.map(({entityId:e,direction:a,icon:i,title:o})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="${i}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function ft({controlItems:t}){return t.length?`
    <div class="chip group-chip controls-chip">
      ${t.map(({entityId:e,domain:a,isActive:i,icon:o,label:n,title:s})=>`
        <span class="group-seg control-seg${i?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${s}" title="${s}">
          <ha-icon icon="${o}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}function mt({settingsItems:t}){return t.length?`
    <div class="chip group-chip settings-chip">
      ${t.map(({entityId:e,domain:a,isActive:i,icon:o,label:n,title:s})=>`
        <span class="group-seg settings-seg${i?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${s}" title="${s}">
          <ha-icon icon="${o}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}const bt={ptz:"PTZ",controls:"Controls",settings:"Settings",diagnostics:"Diagnostics"};function vt({ptz:t,controls:e,settings:a,diagnostics:i}){return[{role:"ptz",pill:gt({ptzItems:t})},{role:"controls",pill:ft({controlItems:e})},{role:"settings",pill:mt({settingsItems:a})},{role:"diagnostics",pill:pt({diagnosticsItems:i})}].filter(o=>o.pill)}function me(t){return t.map(({role:e,pill:a})=>`
    <div class="device-role">
      <span class="device-role-label">${bt[e]}</span>
      ${a}
    </div>`).join("")}function yt({deviceGroups:t,collapsibleControls:e,activeSection:a}){const i=t.map(({key:o,label:n,icon:s,ptz:c,controls:r,settings:d,diagnostics:h})=>({key:o,label:n,icon:s,roleSections:vt({ptz:c,controls:r,settings:d,diagnostics:h})})).filter(o=>o.roleSections.length);return i.length?e?`
    <div class="section-tabs">
      <div class="section-tabs-bar" role="tablist">
        ${i.map(({key:o,label:n,icon:s})=>`
          <span class="section-tab${a===o?" active":""}" data-section="${o}"
            role="tab" tabindex="0" aria-selected="${a===o}" title="${n}">
            <ha-icon icon="${s}"></ha-icon><span class="section-tab-label">${n}</span>
          </span>`).join("")}
      </div>
      ${i.map(({key:o,roleSections:n})=>`
        <div class="section-tab-panel${a===o?" active":""}">${me(n)}</div>`).join("")}
    </div>`:i.map(({label:o,icon:n,roleSections:s})=>`
      <div class="group-section">
        <span class="group-label"><ha-icon icon="${n}"></ha-icon>${o}</span>
        ${me(s)}
      </div>`).join(""):""}function xt({smokeOn:t,gasOn:e,waterOn:a,moldRisk:i}){return!t&&!e&&!a&&!i?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${i?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function wt(t){return`
    <style>${he}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function _t({historyMin:t,historyMax:e,historyUnit:a,historyHours:i,historyChart:o,historyEmpty:n,historyTrend:s}){if(t===null)return n?'<div class="chart-overlay"><span class="chart-stat chart-empty">No numeric history</span></div>':"";const c=[];if((o==null?void 0:o.threshold_high)!=null||(o==null?void 0:o.threshold_low)!=null){const{min:l,range:p}=ue(o,t,e),u=p||1,f=y=>(1-(y-l)/u)*100,w=y=>Math.min(100-J,Math.max(J,y));if(o.threshold_high!=null){const y=f(o.threshold_high);y>0&&y<100&&c.push(`<span class="chart-threshold" style="top:${w(y).toFixed(1)}%">${o.threshold_high.toFixed(1)}${a}</span>`)}if(o.threshold_low!=null){const y=f(o.threshold_low);y>0&&y<100&&c.push(`<span class="chart-threshold" style="top:${w(y).toFixed(1)}%">${o.threshold_low.toFixed(1)}${a}</span>`)}}const r={up:"⬈",down:"⬊",flat:"➡"};return`
    <div class="chart-overlay">
      ${s?`<span class="chart-stat stat-trend trend-${s}" title="Trending ${{up:"up",down:"down",flat:"no change"}[s]} over ${i}h">${r[s]}</span>`:""}
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period" title="Tracking ${o.entity_id} — may differ from the averaged value shown above">${i}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${c.join("")}
    </div>`}function $t(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",i=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${he}</style>
    <ha-card
      ${i?`class="${i}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?nt(t.historyPoints,t.historyColor,t.historyChart,t.historyUnit):""}
      ${_t(t)}
      <div class="card-content">
        ${ut(t)}
        ${it(t)}
        ${rt(t)}
        ${ht(t)}
        ${yt(t)}
        ${xt(t)}
      </div>
    </ha-card>`}function C(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function kt(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function St(t,e,a){var o,n;const i=(o=t.activeElement)==null?void 0:o.className;t.innerHTML=a.error?wt(a.error):$t(a),a.error||(Et(t,e,a),Ct(t)),i&&((n=t.querySelector(`.${i.trim().split(/\s+/).join(".")}`))==null||n.focus())}function be(t){const e=t.querySelector(".camera-preview img");if(!e)return;const a=new URL(e.getAttribute("src"),window.location.href);a.searchParams.set("_refresh",Date.now()),e.src=a.pathname+a.search}function Ct(t){const e=t.querySelectorAll(".chart-threshold");if(!e.length)return;const a=[...t.querySelectorAll(".card-content > *")].map(o=>o.getBoundingClientRect()).filter(o=>o.width>0&&o.height>0),i=(o,n)=>o.left<n.right&&o.right>n.left&&o.top<n.bottom&&o.bottom>n.top;e.forEach(o=>{const n=o.getBoundingClientRect();a.some(s=>i(n,s))&&(o.style.display="none")})}function Et(t,e,{navPath:a,chipItems:i}){var d,h;a&&t.querySelector("ha-card").addEventListener("click",l=>{!l.target.closest(".chip")&&!l.target.closest(".env-chip")&&!l.target.closest(".badge-lights")&&!l.target.closest(".status-seg-battery")&&!l.target.closest(".status-seg-update")&&!l.target.closest(".camera-preview")&&!l.target.closest(".section-tab")&&kt(a)}),t.querySelectorAll('[role="button"][tabindex], [role="tab"][tabindex]').forEach(l=>{l.addEventListener("keydown",p=>{p.key!=="Enter"&&p.key!==" "||(p.preventDefault(),p.stopPropagation(),l.click())})}),t.querySelectorAll(".section-tab[data-section]").forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation(),e.setActiveSection(l.dataset.section)})}),t.querySelectorAll(".ptz-seg[data-entity]").forEach(l=>{l.addEventListener("click",p=>{var u;p.stopPropagation(),(u=e._hass)!=null&&u.callService?e._hass.callService("button","press",{},{entity_id:l.dataset.entity}):C(e,l.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation(),C(e,l.dataset.entity)})}),t.querySelectorAll(".opening-seg[data-entity]").forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation(),C(e,l.dataset.entity)})}),t.querySelectorAll(".tamper-seg[data-entity]").forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation(),C(e,l.dataset.entity)})}),t.querySelectorAll(".diagnostics-seg[data-entity]").forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation(),C(e,l.dataset.entity)})});const o=t.querySelector(".status-seg-update[data-entity]");o&&o.addEventListener("click",l=>{l.stopPropagation(),C(e,o.dataset.entity)});const n=t.querySelector(".camera-preview[data-entity]");n&&n.addEventListener("click",l=>{l.stopPropagation(),C(e,n.dataset.entity)});const s=t.querySelector(".camera-refresh-btn");s&&s.addEventListener("click",l=>{l.stopPropagation(),be(t)}),t.querySelectorAll(".control-seg[data-entity]").forEach(l=>{l.addEventListener("click",p=>{var w,y;p.stopPropagation();const u=l.dataset.entity,f=l.dataset.domain;f==="button"&&((w=e._hass)!=null&&w.callService)?e._hass.callService("button","press",{},{entity_id:u}):f==="siren"&&((y=e._hass)!=null&&y.callService)?e._hass.callService("siren","toggle",{},{entity_id:u}):C(e,u)})}),t.querySelectorAll(".settings-seg[data-entity]").forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation(),C(e,l.dataset.entity)})});const c=t.querySelector(".badge-lights");c&&((d=e._config)!=null&&d.area)&&((h=e._hass)!=null&&h.callService)&&c.addEventListener("click",l=>{l.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const r=t.querySelector(".status-seg-battery[data-entity]");r&&r.addEventListener("click",l=>{l.stopPropagation(),C(e,r.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(l=>{const p=l.dataset.entity;p&&l.addEventListener("click",u=>{u.stopPropagation(),C(e,p)})}),t.querySelectorAll(".chip[data-entity]").forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation(),C(e,l.dataset.entity)})}),At(t)}function At(t){const e=t.querySelectorAll(".chart-hit-layer circle[data-v]");if(!e.length)return;const a=t.querySelector("ha-card");let i=null,o=null;const n=(s,c)=>{s.style.left=`${parseFloat(c.getAttribute("cx"))/300*100}%`,s.style.top=`${parseFloat(c.getAttribute("cy"))/60*100}%`};e.forEach(s=>{var r;const c=(r=s.closest(".chart-hit-layer"))==null?void 0:r.classList.contains("dense");s.addEventListener("pointerenter",d=>{d.stopPropagation(),i||(i=document.createElement("div"),i.className="chart-tooltip",a.appendChild(i)),i.textContent=s.dataset.v,n(i,s),i.style.display="block",c&&(o||(o=document.createElement("div"),o.className="chart-hover-dot",a.appendChild(o)),n(o,s),o.style.display="block")}),s.addEventListener("pointerleave",d=>{d.stopPropagation(),i&&(i.style.display="none"),o&&(o.style.display="none")})})}const z=new Map,G=new Set,N=new Map,Tt=2;function zt(t){for(const e of z.keys()){const a=Number(e.slice(e.lastIndexOf(":")+1));t-a>Tt&&z.delete(e)}}function It(t,e,a,i,o){var d;const n=(d=o==null?void 0:o._config)==null?void 0:d.debug,s=Math.floor(Date.now()/3e5),c=`${e}:${a}:${s}`;if(zt(s),z.has(c))return n&&console.debug("[hass-omnibus-card] history cache hit",{key:c,points:z.get(c).length}),z.get(c);if(G.has(c))return n&&console.debug("[hass-omnibus-card] history fetch pending, queuing callback",{key:c}),N.get(c).set(o,i),null;if(!(t!=null&&t.callWS))return n&&console.debug("[hass-omnibus-card] history skipped — no callWS",{entityId:e}),null;n&&console.debug("[hass-omnibus-card] history fetch start",{key:c,entityId:e,hours:a}),G.add(c),N.set(c,new Map([[o,i]]));const r=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:r,minimal_response:!0,no_attributes:!0}).then(h=>{const l=Array.isArray(h==null?void 0:h[e])?h[e]:[],p=l.map(f=>({t:(f.lu??f.last_updated??0)*1e3,v:parseFloat(f.s??f.state)})).filter(f=>!isNaN(f.v));n&&console.debug("[hass-omnibus-card] history fetch done",{key:c,rawCount:l.length,pointCount:p.length}),z.set(c,p),G.delete(c);const u=N.get(c);N.delete(c),u==null||u.forEach(f=>f(p))}).catch(h=>{n&&console.debug("[hass-omnibus-card] history fetch error",{key:c,error:h}),z.set(c,[]),G.delete(c);const l=N.get(c);N.delete(c),l==null||l.forEach(p=>p([]))}),null}class Lt extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._activeSection=null,this._cameraRefreshTimer=null}setConfig(e){var a,i;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');(i=this._config)!=null&&i.debug&&console.debug("[hass-omnibus-card] set config",{config:e}),this._config={...e},this._stateHash=null,this._activeSection=e.controls_collapsed===!1?"__default__":null,this._hass&&this._update(),this._startCameraRefreshTimer()}connectedCallback(){this._startCameraRefreshTimer()}disconnectedCallback(){clearInterval(this._cameraRefreshTimer)}_startCameraRefreshTimer(){var a,i,o;(a=this._config)!=null&&a.debug&&console.debug("[hass-omnibus-card] start camera refresh timer",{interval:(i=this._config)==null?void 0:i.camera_refresh_interval}),clearInterval(this._cameraRefreshTimer);const e=(o=this._config)==null?void 0:o.camera_refresh_interval;!e||e<=0||(this._cameraRefreshTimer=setInterval(()=>be(this.shadowRoot),e*6e4))}setActiveSection(e){var a;(a=this._config)!=null&&a.debug&&console.debug("[hass-omnibus-card] set active section",{section:e}),this._activeSection=this._activeSection===e?null:e,this._update()}set hass(e){var i;if((i=this._config)!=null&&i.debug&&console.debug("[hass-omnibus-card] set hass",{hass:e}),this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var i,o,n,s;if(!this._hass||!this._config)return"";let e;if((i=this._config.entities)!=null&&i.length)e=this._config.entities.map(c=>{var r;return{entityId:c,state:(r=this._hass.states)==null?void 0:r[c]}}).filter(c=>c.state);else{e=se(this._hass,this._config.area);for(const c of this._config.add_entities??[])if(!e.some(r=>r.entityId===c)){const r=(o=this._hass.states)==null?void 0:o[c];r&&e.push({entityId:c,state:r})}}const a=(n=this._config.history_chart)==null?void 0:n.entity_id;if(a&&!e.some(c=>c.entityId===a)){const c=(s=this._hass.states)==null?void 0:s[a];c&&e.push({entityId:a,state:c})}return e.map(({entityId:c,state:r})=>{var d,h,l;return`${c}=${r.state}|${((d=r.attributes)==null?void 0:d.rgb_color)??""}|${((h=r.attributes)==null?void 0:h.current_temperature)??""}|${((l=r.attributes)==null?void 0:l.entity_picture)??""}`}).sort().join(";")}_update(){var o,n;let e=null;const a=(o=this._config)==null?void 0:o.history_chart;a!=null&&a.entity_id&&(e=It(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const i=et(this._hass,this._config,e,this._activeSection);i.error||(this._activeSection=i.activeSection??null),(n=this._config)!=null&&n.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:i}),St(this.shadowRoot,this,i)}}window.customCards=window.customCards||[],window.customCards.push({type:te,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${Ne} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(te,Lt)})();
