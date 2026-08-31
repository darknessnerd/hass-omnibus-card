(function(){"use strict";const te="hass-omnibus-card",Te="2.2.0",H=new Set(["on","open","playing","home","unlocked"]),ze={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},ae={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},opening:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},garage_door:{on:"mdi:garage-open",off:"mdi:garage"},lock:{on:"mdi:lock-open",off:"mdi:lock"},tamper:{on:"mdi:shield-alert",off:"mdi:shield-check-outline"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high",voltage:"mdi:flash-triangle-outline"},Ie="mdi:weather-windy-variant",ne={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv"},Le={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"},Ne=/_(max|gust|peak)$/i;function ie(t,e){var i;return(((i=e.attributes)==null?void 0:i.friendly_name)??t.split(".")[1]).split(" ").pop()}function re(t){const e=new Map;for(const i of t)e.set(i.label,(e.get(i.label)??0)+1);if(![...e.values()].some(i=>i>1))return t;const a=i=>i.fullName.trim().split(/\s+/);return t.map(i=>{if(e.get(i.label)===1)return i;const r=a(i);for(let n=2;n<=r.length;n++){const s=r.slice(-n).join(" ");if(!t.some(o=>o!==i&&a(o).slice(-n).join(" ")===s))return{...i,label:s}}return{...i,label:i.entityId.split(".")[1]}})}function Me(t,e,a){var c;const i=(c=t.devices)==null?void 0:c[e],r=(i==null?void 0:i.name_by_user)??(i==null?void 0:i.name);if(r)return r;const n=a.map(({entityId:o})=>o.split(".")[1].split("_"));let s=n[0]??[];for(const o of n.slice(1)){let p=0;for(;p<s.length&&p<o.length&&s[p]===o[p];)p++;s=s.slice(0,p)}return s.length?s.map(o=>o[0].toUpperCase()+o.slice(1)).join(" "):"Device"}function M(t,e){var s,c;if((s=e.attributes)!=null&&s.icon)return e.attributes.icon;const a=t.split(".")[0],i=((c=e.attributes)==null?void 0:c.device_class)??"",r=H.has(e.state),n=o=>typeof o=="string"?o:r?o.on:o.off;return a==="sensor"&&i==="battery"?oe(parseFloat(e.state)):i==="wind_speed"&&Ne.test(t)?Ie:i&&ae[i]?n(ae[i]):ne[a]?n(ne[a]):"mdi:help-circle-outline"}function W(t,e,a){var r,n;if(e==null)return a;if(typeof e=="number")return e;const i=parseFloat((n=(r=t.states)==null?void 0:r[e])==null?void 0:n.state);return Number.isFinite(i)?i:a}function oe(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function se(t,e){const{entities:a={},devices:i={},states:r={}}=t;return Object.keys(r).reduce((n,s)=>{var h;const c=a[s];if(!c||c.hidden_by)return n;const o=c.area_id===e,p=c.device_id&&((h=i[c.device_id])==null?void 0:h.area_id)===e;return(o||p)&&n.push({entityId:s,state:r[s],deviceId:c.device_id??null}),n},[])}function Oe(t,e,a){var s,c,o,p;if((s=e.entities)!=null&&s.length)return e.entities.map(h=>{var d,u,g;const l=(d=a.states)==null?void 0:d[h];return l?{entityId:h,state:l,deviceId:((g=(u=a.entities)==null?void 0:u[h])==null?void 0:g.device_id)??null}:null}).filter(Boolean);const i=new Set(e.exclude_entities??[]),r=e.add_entities??[],n=t.filter(h=>!i.has(h.entityId));for(const h of r){if(n.some(d=>d.entityId===h))continue;const l=(c=a.states)==null?void 0:c[h];l&&n.push({entityId:h,state:l,deviceId:((p=(o=a.entities)==null?void 0:o[h])==null?void 0:p.device_id)??null})}return n}const je=new Set(["sensor","binary_sensor","image"]),Fe=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),le={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},De=new RegExp(`ptz.*_(${Object.keys(le).join("|")})$`,"i"),Pe=new Set(["door","window","opening","garage_door"]),qe=/_dew_point$/i;function Be(t){var r;const e={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],openings:[],tampers:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],controls:[],settings:[],ptz:[],updates:[],others:[],diagnostics:[]};for(const n of t){const{entityId:s,state:c}=n,o=s.split(".")[0],p=((r=c.attributes)==null?void 0:r.device_class)??"",h=c.state;if(o==="light")e.lights.push(n);else if(o==="climate")e.climate.push(n);else if(o==="camera")e.cameras.push(n);else if(o==="update"&&h!=="unavailable")e.updates.push(n);else if(o==="sensor"&&p==="temperature"&&qe.test(s))e.weathers.push(n);else if(o==="sensor"&&p==="temperature")e.temperatures.push(n);else if(o==="sensor"&&p==="humidity")e.humidities.push(n);else if(o==="sensor"&&Fe.has(p))e.weathers.push(n);else if(o==="binary_sensor"&&p==="motion")e.motions.push(n);else if(o==="binary_sensor"&&p==="occupancy")e.occupancy.push(n);else if(o==="binary_sensor"&&Pe.has(p)&&h!=="unavailable")e.openings.push(n);else if(o==="binary_sensor"&&p==="tamper"&&h!=="unavailable")e.tampers.push(n);else if(o==="binary_sensor"&&p==="smoke")e.smokes.push(n);else if(o==="binary_sensor"&&p==="gas")e.gases.push(n);else if(o==="binary_sensor"&&p==="moisture")e.moistures.push(n);else if(o==="sensor"&&p==="battery"&&h!=="unavailable")e.batteries.push(n),e.others.push(n);else if(h==="unavailable"||o==="binary_sensor"&&["problem","safety"].includes(p)&&h==="on")e.problems.push(n);else if(o==="siren")e.controls.push(n);else if(o==="button"){const l=s.match(De);l?e.ptz.push({...n,direction:le[l[1].toLowerCase()]}):e.controls.push(n)}else e.others.push(n)}const a=new Map;for(const n of e.others)n.deviceId&&(a.has(n.deviceId)||a.set(n.deviceId,[]),a.get(n.deviceId).push(n));const i=[];for(const n of e.others){const s=n.deviceId?a.get(n.deviceId):null;if(!s||s.length<2){i.push(n);continue}const c=n.entityId.split(".")[0];je.has(c)?e.diagnostics.push(n):e.settings.push(n)}return e.others=i,e}function ce(t){const{controls:e,settings:a,diagnostics:i}=t,r=re([...e,...a,...i]);return{ptz:t.ptz,controls:r.slice(0,e.length),settings:r.slice(e.length,e.length+a.length),diagnostics:r.slice(e.length+a.length)}}function He(t,{ptz:e,controls:a,settings:i,diagnostics:r},n=null){const s={ptz:e,controls:a,settings:i,diagnostics:r},c=()=>({ptz:[],controls:[],settings:[],diagnostics:[]}),o=d=>d.ptz.length+d.controls.length+d.settings.length+d.diagnostics.length,p=new Map;for(const[d,u]of Object.entries(s))for(const g of u){const _=g.deviceId??null;p.has(_)||p.set(_,c()),p.get(_)[d].push(g)}const h=[];let l=c();for(const[d,u]of p)if(d==null||o(u)<2)for(const g of["ptz","controls","settings","diagnostics"])l[g].push(...u[g]);else{const g=ce(u),_=[...g.ptz,...g.controls,...g.settings,...g.diagnostics];h.push({key:d,label:Me(t,d,_),...g})}return l=ce(l),h.sort((d,u)=>d.key===n?-1:u.key===n?1:o(u)-o(d)),o(l)>0&&h.push({key:"__other__",label:"Other",...l}),h}function de(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,i)=>a+i,0)/e.length:null}function O(t){return t.some(e=>e.state.state==="on")}function We(t){return t.filter(e=>e.state.state==="on")}function Re(t){let e=null;for(const a of t){const i=parseFloat(a.state.state);isNaN(i)||(!e||i<e.value)&&(e={value:i,entityId:a.entityId,state:a.state})}return e}function Ge(t){var e;for(const a of t){const i=(e=a.state.attributes)==null?void 0:e.rgb_color;if(i)return`rgb(${i.join(",")})`}return null}function Ue(t,e){const a=W(t,e.threshold_high,null),i=W(t,e.threshold_low,null);return a===e.threshold_high&&i===e.threshold_low?e:{...e,threshold_high:a,threshold_low:i}}function X(t,e,a,i){var r,n,s;return{entityId:t,deviceId:a,domain:t.split(".")[0],isActive:H.has(e.state),icon:M(t,e),label:((r=i.entity_labels)==null?void 0:r[t])??ie(t,e),fullName:((n=e.attributes)==null?void 0:n.friendly_name)??t,title:`${((s=e.attributes)==null?void 0:s.friendly_name)??t} — ${e.state}`}}function pe(t,e,a,i,r){var s;const n=H.has(e.state);return{entityId:t,icon:M(t,e),[a]:n,title:`${((s=e.attributes)==null?void 0:s.friendly_name)??t} — ${n?i:r}`}}function Ye(t,e,a=null,i=null){var q,Z,T,B,b,w,V,ye,xe,we,_e,$e,ke,Se;const r=e.area,n=(q=t.areas)==null?void 0:q[r];if(!n&&!e.name&&!((Z=e.entities)!=null&&Z.length))return{error:r??"(no area)"};const s=(T=e.entities)!=null&&T.length?[]:se(t,r),c=Oe(s,e,t),o=Be(c),p=We(o.lights),h=Ge(p),l=de(o.temperatures),d=de(o.humidities),u=o.climate[0]??null,[g,_]=ze[(B=u==null?void 0:u.state)==null?void 0:B.state]??[null,null],C=W(t,e.mold_threshold,70),E=e.navigate_to||((b=e.tap_action)==null?void 0:b.navigation_path)||null,k=e.history_chart??null,y=k?Ue(t,k):null,j=W(t,e.battery_low_threshold,20),x=Re(o.batteries),v=o.cameras[0]??null,J=o.cameras.slice(1),A=o.updates.filter(f=>f.state.state==="on"),Q=e.show_entities!==!1?o.controls.map(({entityId:f,state:m,deviceId:$})=>X(f,m,$,e)):[],U=e.show_entities!==!1?o.settings.map(({entityId:f,state:m,deviceId:$})=>X(f,m,$,e)):[],ve=e.show_entities!==!1?o.ptz.map(({entityId:f,state:m,direction:$,deviceId:I})=>{var L;return{entityId:f,deviceId:I,direction:$,icon:Le[$],title:((L=m.attributes)==null?void 0:L.friendly_name)??f}}):[],ee=e.show_entities!==!1?o.diagnostics.map(({entityId:f,state:m,deviceId:$})=>X(f,m,$,e)):[],F=e.collapsible_controls!==!1,D=He(t,{ptz:ve,controls:Q,settings:U,diagnostics:ee},(v==null?void 0:v.deviceId)??null),P=D.map(f=>f.key),Y=F?i==="__default__"?P[0]??null:P.includes(i)?i:null:null;return{areaName:e.name||(n==null?void 0:n.name)||r||"",cardIcon:e.icon||(n==null?void 0:n.icon)||"mdi:home",navPath:E,hasLights:o.lights.length>0,lightCount:p.length,offlineLights:o.lights.filter(f=>f.state.state==="unavailable").length,lightColor:h,occupied:O(o.motions)||O(o.occupancy),hasOccupancySensors:o.motions.length>0||o.occupancy.length>0,problemCount:o.problems.length,showBatteryBadge:x!=null&&x.value<=j,batteryValue:(x==null?void 0:x.value)??null,batteryIcon:x?oe(x.value):null,batteryEntity:(x==null?void 0:x.entityId)??null,batteryTitle:x?`${o.batteries.length>1?`Lowest of ${o.batteries.length} — `:""}${((w=x.state.attributes)==null?void 0:w.friendly_name)??x.entityId}: ${x.value}%`:"",tempVal:l,humVal:d,tempUnit:((ye=(V=o.temperatures[0])==null?void 0:V.state.attributes)==null?void 0:ye.unit_of_measurement)??"°C",tempEntities:o.temperatures,humEntities:o.humidities,climate:u,climIcon:g,climColor:_,smokeOn:O(o.smokes),gasOn:O(o.gases),waterOn:O(o.moistures),moldRisk:d!==null&&d>=C,updateCount:A.length,updateEntity:((xe=A[0])==null?void 0:xe.entityId)??null,updateTitle:A.length?`${A.length} update${A.length!==1?"s":""} available: ${A.map(f=>{var m;return((m=f.state.attributes)==null?void 0:m.friendly_name)??f.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!v,cameraEntity:(v==null?void 0:v.entityId)??null,cameraImage:((we=v==null?void 0:v.state.attributes)==null?void 0:we.entity_picture)??null,cameraIcon:v?M(v.entityId,v.state):null,cameraTitle:((_e=v==null?void 0:v.state.attributes)==null?void 0:_e.friendly_name)??(v==null?void 0:v.entityId)??"",cameraState:(v==null?void 0:v.state.state)??"",cameraOffline:(v==null?void 0:v.state.state)==="unavailable",deviceGroups:D,collapsibleControls:F,activeSection:Y,openingItems:e.show_entities!==!1?o.openings.map(({entityId:f,state:m})=>pe(f,m,"isOpen","Open","Closed")):[],tamperItems:e.show_entities!==!1?o.tampers.map(({entityId:f,state:m})=>pe(f,m,"isTampered","Tamper detected","Normal")):[],weatherItems:e.show_entities!==!1?o.weathers.map(({entityId:f,state:m})=>{var Ce,Ee,Ae;const $=parseFloat(m.state),I=((Ce=m.attributes)==null?void 0:Ce.unit_of_measurement)??"",L=((Ee=m.attributes)==null?void 0:Ee.device_class)??"";return{entityId:f,dc:L,icon:M(f,m),value:isNaN($)?m.state:$.toFixed(1),unit:I,title:`${((Ae=m.attributes)==null?void 0:Ae.friendly_name)??f} — ${m.state}${I}`}}):[],historyPoints:y!=null&&y.entity_id?a:null,historyColor:(y==null?void 0:y.color)??"rgba(3, 169, 244, 0.2)",historyChart:y,historyMin:y!=null&&y.entity_id&&(a==null?void 0:a.length)>=2?Math.min(...a.map(f=>f.v)):null,historyMax:y!=null&&y.entity_id&&(a==null?void 0:a.length)>=2?Math.max(...a.map(f=>f.v)):null,historyUnit:((Se=(ke=($e=t.states)==null?void 0:$e[y==null?void 0:y.entity_id])==null?void 0:ke.attributes)==null?void 0:Se.unit_of_measurement)??"",historyHours:(y==null?void 0:y.hours)??24,historyEmpty:!!(y!=null&&y.entity_id)&&Array.isArray(a)&&a.length<2,chipItems:e.show_entities!==!1?re([...o.others,...J].slice(0,e.max_entities??12).map(({entityId:f,state:m})=>{var $,I,L;return{entityId:f,isActive:H.has(m.state),icon:M(f,m),label:(($=e.entity_labels)==null?void 0:$[f])??ie(f,m),fullName:((I=m.attributes)==null?void 0:I.friendly_name)??f,title:`${((L=m.attributes)==null?void 0:L.friendly_name)??f} — ${m.state}`}})):[]}}const he=`
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
    display: inline-block;
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
`;function ue(t,e,a){const i=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,r=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:i,max:r,range:r-i}}function Ze(t,e=150){if(t.length<=e)return t.slice();const a=Math.floor(e/2),i=t.length/a,r=[];for(let n=0;n<a;n++){const s=Math.floor(n*i),c=n===a-1?t.length:Math.floor((n+1)*i);if(s>=c)continue;let o=-1,p=-1;for(let h=s;h<c;h++)Number.isFinite(t[h].v)&&((o===-1||t[h].v<t[o].v)&&(o=h),(p===-1||t[h].v>t[p].v)&&(p=h));if(o===-1)r.push(t[s]);else if(o===p)r.push(t[o]);else{const[h,l]=o<p?[o,p]:[p,o];r.push(t[h],t[l])}}return r}const Ve=40,K=14,R=new WeakMap;function Xe(t,e,a=null,i=""){if(!(t!=null&&t.length)||t.length<2)return"";const r=R.get(t);if(r&&r.color===e&&r.hc===a&&r.unit===i)return r.result;const n=300,s=60,c=t.map(b=>b.v),o=Math.min(...c),p=Math.max(...c),{min:h,range:l}=ue(a,o,p);if(l===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return R.set(t,{color:e,hc:a,unit:i,result:""}),"";const d=l||1,u=Ze(t),g=t[0].t,C=t[t.length-1].t-g||1,E=u.map(b=>(b.t-g)/C*n),k=u.map(b=>s-(b.v-h)/d*s),j=`${E.map((b,w)=>`${w?"L":"M"}${b.toFixed(1)},${k[w].toFixed(1)}`).join(" ")} V${s} H0 Z`,x=u.length>Ve,v=x?"":E.map((b,w)=>`<circle cx="${b.toFixed(1)}" cy="${k[w].toFixed(1)}" r="1.5" fill="${e}"/>`).join(""),J=n/(E.length-1),A=Math.min(4,J/2).toFixed(1),Q=E.map((b,w)=>{if(!Number.isFinite(u[w].v))return"";const V=`${u[w].v.toFixed(1)}${i}`;return`<circle cx="${b.toFixed(1)}" cy="${k[w].toFixed(1)}" r="${A}" fill="transparent" data-v="${V}"/>`}).join(""),U=`<svg class="chart-hit-layer${x?" dense":""}" viewBox="0 0 ${n} ${s}" preserveAspectRatio="none" aria-hidden="true">${Q}</svg>`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null))){const b=ge(n,s,`<path d="${j}" fill="${e}"/>${v}`)+U;return R.set(t,{color:e,hc:a,unit:i,result:b}),b}const ee=a.color??"rgba(3, 169, 244, 0.12)",F=a.color_high??"rgba(244, 67, 54, 0.25)",D=a.color_low??"rgba(33, 150, 243, 0.25)",P=b=>Math.max(0,Math.min(s,s-(b-h)/d*s)),Y=s*(K/100),q=b=>Math.min(s-Y,Math.max(Y,b)),Z=`<defs><clipPath id="sg-cp"><path d="${j}"/></clipPath></defs>`;let T=`<path d="${j}" fill="${ee}"/>`;if(a.threshold_high!=null){const b=P(a.threshold_high);if(b>0&&(T+=`<rect x="0" y="0" width="${n}" height="${b.toFixed(1)}" fill="${F}" clip-path="url(#sg-cp)"/>`),b>0&&b<s){const w=q(b).toFixed(1);T+=`<line x1="0" y1="${w}" x2="${n}" y2="${w}" stroke="${F}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}if(a.threshold_low!=null){const b=P(a.threshold_low);if(b<s&&(T+=`<rect x="0" y="${b.toFixed(1)}" width="${n}" height="${(s-b).toFixed(1)}" fill="${D}" clip-path="url(#sg-cp)"/>`),b>0&&b<s){const w=q(b).toFixed(1);T+=`<line x1="0" y1="${w}" x2="${n}" y2="${w}" stroke="${D}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}const B=ge(n,s,Z+T+v)+U;return R.set(t,{color:e,hc:a,unit:i,result:B}),B}function ge(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function Ke({areaName:t,cardIcon:e,hasLights:a,lightCount:i,offlineLights:r,occupied:n,hasOccupancySensors:s,problemCount:c,showBatteryBadge:o,batteryValue:p,batteryIcon:h,batteryEntity:l,batteryTitle:d,updateCount:u,updateEntity:g,updateTitle:_,openingItems:C,tamperItems:E}){const k=i===0,y=k?r>0?`${r} light${r!==1?"s":""} offline`:"Lights off":`${i} light${i!==1?"s":""} on${r>0?` · ${r} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${k?"off":""} ${r>0?"has-offline":""}"
               role="button" tabindex="0" aria-label="${y}" title="${y}">
            <ha-icon icon="mdi:lightbulb${k?"-off":""}"></ha-icon>
            ${i>1?`<span>${i}</span>`:""}
          </div>`:""}
        ${at({openingItems:C})}
        ${tt({tamperItems:E})}
        ${s?`<div class="occupancy-dot ${n?"":"idle"}" title="${n?"Occupied":"Not occupied"}"></div>`:""}
        ${Je({showBatteryBadge:o,batteryValue:p,batteryIcon:h,batteryEntity:l,batteryTitle:d,problemCount:c,updateCount:u,updateEntity:g,updateTitle:_})}
      </div>
    </div>`}function Je({showBatteryBadge:t,batteryValue:e,batteryIcon:a,batteryEntity:i,batteryTitle:r,problemCount:n,updateCount:s,updateEntity:c,updateTitle:o}){const p=[];return t&&p.push(`
    <span class="group-seg status-seg-battery" data-entity="${i}" role="button" tabindex="0" aria-label="${r}" title="${r}">
      <ha-icon icon="${a}"></ha-icon><span>${e}%</span>
    </span>`),n>0&&p.push(`
    <span class="group-seg status-seg-problem" title="${n} problem${n!==1?"s":""}">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>${n>1?`<span>${n}</span>`:""}
    </span>`),s>0&&p.push(`
    <span class="group-seg status-seg-update" data-entity="${c}" role="button" tabindex="0" aria-label="${o}" title="${o}">
      <ha-icon icon="mdi:package-up"></ha-icon>${s>1?`<span>${s}</span>`:""}
    </span>`),p.length?`<div class="chip group-chip status-cluster" title="Alerts">${p.join("")}</div>`:""}function Qe({tempVal:t,humVal:e,tempUnit:a,tempEntities:i,humEntities:r,climate:n,climIcon:s,climColor:c}){var l,d,u,g,_,C,E,k;if(t===null&&e===null&&!s)return"";const o=i.length>1?`Avg of ${i.length} sensors`:((d=(l=i[0])==null?void 0:l.state.attributes)==null?void 0:d.friendly_name)??"",p=r.length>1?`Avg of ${r.length} sensors`:((g=(u=r[0])==null?void 0:u.state.attributes)==null?void 0:g.friendly_name)??"",h=((_=n==null?void 0:n.state.attributes)==null?void 0:_.friendly_name)??(n==null?void 0:n.entityId)??"";return`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((C=i[0])==null?void 0:C.entityId)??""}"
             role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((E=r[0])==null?void 0:E.entityId)??""}"
             role="button" tabindex="0" aria-label="${p}" title="${p}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${s?`
        <div class="env-chip climate"
             style="--climate-color: ${c}"
             data-entity="${n.entityId}"
             role="button" tabindex="0" aria-label="${h}" title="${h}">
          <ha-icon icon="${s}"></ha-icon>
          <span>${((k=n.state.attributes)==null?void 0:k.current_temperature)!=null?`${n.state.attributes.current_temperature}°`:n.state.state}</span>
        </div>`:""}
    </div>`}function fe(t,e,a){return a?`<div class="group-section"><span class="group-label ${e}">${t}</span>${a}</div>`:""}function et({weatherItems:t}){return t.length?`
    <div class="chip group-chip weather-chip">
      ${t.map(({entityId:e,dc:a,icon:i,value:r,unit:n,title:s})=>`
        <span class="group-seg weather-seg" data-entity="${e}" data-dc="${a}" role="button" tabindex="0" aria-label="${s}" title="${s}">
          <ha-icon icon="${i}"></ha-icon>
          <span class="group-seg-value">${r}${n?" "+n:""}</span>
        </span>`).join("")}
    </div>`:""}function tt({tamperItems:t}){return t.length?`
    <div class="chip group-chip tamper-chip">
      ${t.map(({entityId:e,icon:a,isTampered:i,title:r})=>`
        <span class="group-seg tamper-seg${i?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${r}" title="${r}">
          <ha-icon icon="${a}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function at({openingItems:t}){return t.length?`
    <div class="chip group-chip openings-chip">
      ${t.map(({entityId:e,icon:a,isOpen:i,title:r})=>`
        <span class="group-seg opening-seg${i?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${r}" title="${r}">
          <ha-icon icon="${a}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function nt({chipItems:t}){return`${t.length?`
      <div class="entity-chips">
        ${t.map(({entityId:e,isActive:a,icon:i,label:r,title:n})=>`
          <div class="chip${a?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${n}" title="${n}">
            <ha-icon icon="${i}"></ha-icon>
            <span class="chip-label">${r}</span>
          </div>`).join("")}
      </div>`:""}`}function it({diagnosticsItems:t}){return t.length?`
    <div class="chip group-chip diagnostics-chip">
      ${t.map(({entityId:e,icon:a,label:i,title:r})=>`
        <span class="group-seg diagnostics-seg" data-entity="${e}" role="button" tabindex="0" aria-label="${r}" title="${r}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="seg-label">${i}</span>
        </span>`).join("")}
    </div>`:""}function rt({chipItems:t,weatherItems:e}){const a=fe("","",nt({chipItems:t})),i=fe("Weather","group-label-weather",et({weatherItems:e}));return!t.length&&!i?"":`${a}
    ${i}
    `}function ot({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:i,cameraTitle:r,cameraState:n,cameraOffline:s}){if(!t)return"";const c=s?`${r} (offline)`:r;return`
    <div class="camera-preview${s?" offline":""}" data-entity="${i}"
         role="button" tabindex="0" aria-label="${c}" title="${c}">
      ${e?`<img src="${e}" alt="${c}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${a}"></ha-icon></div>`}
      ${n==="recording"?'<span class="camera-rec-dot" title="Recording"></span>':""}
      ${e?`
        <span class="camera-refresh-btn" role="button" tabindex="0" aria-label="Refresh snapshot" title="Refresh snapshot">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </span>`:""}
    </div>`}function st({ptzItems:t}){return t.length?`
    <div class="chip group-chip ptz-chip">
      ${t.map(({entityId:e,direction:a,icon:i,title:r})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" role="button" tabindex="0" aria-label="${r}" title="${r}">
          <ha-icon icon="${i}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function lt({controlItems:t}){return t.length?`
    <div class="chip group-chip controls-chip">
      ${t.map(({entityId:e,domain:a,isActive:i,icon:r,label:n,title:s})=>`
        <span class="group-seg control-seg${i?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${s}" title="${s}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}function ct({settingsItems:t}){return t.length?`
    <div class="chip group-chip settings-chip">
      ${t.map(({entityId:e,domain:a,isActive:i,icon:r,label:n,title:s})=>`
        <span class="group-seg settings-seg${i?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${s}" title="${s}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="seg-label">${n}</span>
        </span>`).join("")}
    </div>`:""}const dt={ptz:"PTZ",controls:"Controls",settings:"Settings",diagnostics:"Diagnostics"};function pt({ptz:t,controls:e,settings:a,diagnostics:i}){return[{role:"ptz",pill:st({ptzItems:t})},{role:"controls",pill:lt({controlItems:e})},{role:"settings",pill:ct({settingsItems:a})},{role:"diagnostics",pill:it({diagnosticsItems:i})}].filter(r=>r.pill)}function be(t){return t.map(({role:e,pill:a})=>`
    <div class="device-role">
      <span class="device-role-label">${dt[e]}</span>
      ${a}
    </div>`).join("")}function ht({deviceGroups:t,collapsibleControls:e,activeSection:a}){const i=t.map(({key:r,label:n,ptz:s,controls:c,settings:o,diagnostics:p})=>({key:r,label:n,roleSections:pt({ptz:s,controls:c,settings:o,diagnostics:p})})).filter(r=>r.roleSections.length);return i.length?e?`
    <div class="section-tabs">
      <div class="section-tabs-bar" role="tablist">
        ${i.map(({key:r,label:n})=>`
          <span class="section-tab${a===r?" active":""}" data-section="${r}"
            role="tab" tabindex="0" aria-selected="${a===r}" title="${n}">${n}</span>`).join("")}
      </div>
      ${i.map(({key:r,roleSections:n})=>`
        <div class="section-tab-panel${a===r?" active":""}">${be(n)}</div>`).join("")}
    </div>`:i.map(({label:r,roleSections:n})=>`
      <div class="group-section">
        <span class="group-label">${r}</span>
        ${be(n)}
      </div>`).join(""):""}function ut({smokeOn:t,gasOn:e,waterOn:a,moldRisk:i}){return!t&&!e&&!a&&!i?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${i?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function gt(t){return`
    <style>${he}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function ft({historyMin:t,historyMax:e,historyUnit:a,historyHours:i,historyChart:r,historyEmpty:n}){if(t===null)return n?'<div class="chart-overlay"><span class="chart-stat chart-empty">No numeric history</span></div>':"";const s=[];if((r==null?void 0:r.threshold_high)!=null||(r==null?void 0:r.threshold_low)!=null){const{min:c,range:o}=ue(r,t,e),p=o||1,h=d=>(1-(d-c)/p)*100,l=d=>Math.min(100-K,Math.max(K,d));if(r.threshold_high!=null){const d=h(r.threshold_high);d>0&&d<100&&s.push(`<span class="chart-threshold" style="top:${l(d).toFixed(1)}%">${r.threshold_high.toFixed(1)}${a}</span>`)}if(r.threshold_low!=null){const d=h(r.threshold_low);d>0&&d<100&&s.push(`<span class="chart-threshold" style="top:${l(d).toFixed(1)}%">${r.threshold_low.toFixed(1)}${a}</span>`)}}return`
    <div class="chart-overlay">
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period" title="Tracking ${r.entity_id} — may differ from the averaged value shown above">${i}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>
      ${s.join("")}
    </div>`}function bt(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",i=[t.navPath?"clickable":"",e?"alarm-active":""].filter(Boolean).join(" ");return`
    <style>${he}</style>
    <ha-card
      ${i?`class="${i}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints?Xe(t.historyPoints,t.historyColor,t.historyChart,t.historyUnit):""}
      ${ft(t)}
      <div class="card-content">
        ${ot(t)}
        ${Ke(t)}
        ${Qe(t)}
        ${rt(t)}
        ${ht(t)}
        ${ut(t)}
      </div>
    </ha-card>`}function S(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function mt(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function vt(t,e,a){var r,n;const i=(r=t.activeElement)==null?void 0:r.className;t.innerHTML=a.error?gt(a.error):bt(a),a.error||(xt(t,e,a),yt(t)),i&&((n=t.querySelector(`.${i.trim().split(/\s+/).join(".")}`))==null||n.focus())}function me(t){const e=t.querySelector(".camera-preview img");if(!e)return;const a=new URL(e.getAttribute("src"),window.location.href);a.searchParams.set("_refresh",Date.now()),e.src=a.pathname+a.search}function yt(t){const e=t.querySelectorAll(".chart-threshold");if(!e.length)return;const a=[...t.querySelectorAll(".card-content > *")].map(r=>r.getBoundingClientRect()).filter(r=>r.width>0&&r.height>0),i=(r,n)=>r.left<n.right&&r.right>n.left&&r.top<n.bottom&&r.bottom>n.top;e.forEach(r=>{const n=r.getBoundingClientRect();a.some(s=>i(n,s))&&(r.style.display="none")})}function xt(t,e,{navPath:a,chipItems:i}){var p,h;a&&t.querySelector("ha-card").addEventListener("click",l=>{!l.target.closest(".chip")&&!l.target.closest(".env-chip")&&!l.target.closest(".badge-lights")&&!l.target.closest(".status-seg-battery")&&!l.target.closest(".status-seg-update")&&!l.target.closest(".camera-preview")&&!l.target.closest(".section-tab")&&mt(a)}),t.querySelectorAll('[role="button"][tabindex], [role="tab"][tabindex]').forEach(l=>{l.addEventListener("keydown",d=>{d.key!=="Enter"&&d.key!==" "||(d.preventDefault(),d.stopPropagation(),l.click())})}),t.querySelectorAll(".section-tab[data-section]").forEach(l=>{l.addEventListener("click",d=>{d.stopPropagation(),e.setActiveSection(l.dataset.section)})}),t.querySelectorAll(".ptz-seg[data-entity]").forEach(l=>{l.addEventListener("click",d=>{var u;d.stopPropagation(),(u=e._hass)!=null&&u.callService?e._hass.callService("button","press",{},{entity_id:l.dataset.entity}):S(e,l.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(l=>{l.addEventListener("click",d=>{d.stopPropagation(),S(e,l.dataset.entity)})}),t.querySelectorAll(".opening-seg[data-entity]").forEach(l=>{l.addEventListener("click",d=>{d.stopPropagation(),S(e,l.dataset.entity)})}),t.querySelectorAll(".tamper-seg[data-entity]").forEach(l=>{l.addEventListener("click",d=>{d.stopPropagation(),S(e,l.dataset.entity)})}),t.querySelectorAll(".diagnostics-seg[data-entity]").forEach(l=>{l.addEventListener("click",d=>{d.stopPropagation(),S(e,l.dataset.entity)})});const r=t.querySelector(".status-seg-update[data-entity]");r&&r.addEventListener("click",l=>{l.stopPropagation(),S(e,r.dataset.entity)});const n=t.querySelector(".camera-preview[data-entity]");n&&n.addEventListener("click",l=>{l.stopPropagation(),S(e,n.dataset.entity)});const s=t.querySelector(".camera-refresh-btn");s&&s.addEventListener("click",l=>{l.stopPropagation(),me(t)}),t.querySelectorAll(".control-seg[data-entity]").forEach(l=>{l.addEventListener("click",d=>{var _,C;d.stopPropagation();const u=l.dataset.entity,g=l.dataset.domain;g==="button"&&((_=e._hass)!=null&&_.callService)?e._hass.callService("button","press",{},{entity_id:u}):g==="siren"&&((C=e._hass)!=null&&C.callService)?e._hass.callService("siren","toggle",{},{entity_id:u}):S(e,u)})}),t.querySelectorAll(".settings-seg[data-entity]").forEach(l=>{l.addEventListener("click",d=>{d.stopPropagation(),S(e,l.dataset.entity)})});const c=t.querySelector(".badge-lights");c&&((p=e._config)!=null&&p.area)&&((h=e._hass)!=null&&h.callService)&&c.addEventListener("click",l=>{l.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const o=t.querySelector(".status-seg-battery[data-entity]");o&&o.addEventListener("click",l=>{l.stopPropagation(),S(e,o.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(l=>{const d=l.dataset.entity;d&&l.addEventListener("click",u=>{u.stopPropagation(),S(e,d)})}),t.querySelectorAll(".chip[data-entity]").forEach(l=>{l.addEventListener("click",d=>{d.stopPropagation(),S(e,l.dataset.entity)})}),wt(t)}function wt(t){const e=t.querySelectorAll(".chart-hit-layer circle[data-v]");if(!e.length)return;const a=t.querySelector("ha-card");let i=null,r=null;const n=(s,c)=>{s.style.left=`${parseFloat(c.getAttribute("cx"))/300*100}%`,s.style.top=`${parseFloat(c.getAttribute("cy"))/60*100}%`};e.forEach(s=>{var o;const c=(o=s.closest(".chart-hit-layer"))==null?void 0:o.classList.contains("dense");s.addEventListener("pointerenter",p=>{p.stopPropagation(),i||(i=document.createElement("div"),i.className="chart-tooltip",a.appendChild(i)),i.textContent=s.dataset.v,n(i,s),i.style.display="block",c&&(r||(r=document.createElement("div"),r.className="chart-hover-dot",a.appendChild(r)),n(r,s),r.style.display="block")}),s.addEventListener("pointerleave",p=>{p.stopPropagation(),i&&(i.style.display="none"),r&&(r.style.display="none")})})}const z=new Map,G=new Set,N=new Map,_t=2;function $t(t){for(const e of z.keys()){const a=Number(e.slice(e.lastIndexOf(":")+1));t-a>_t&&z.delete(e)}}function kt(t,e,a,i,r){var p;const n=(p=r==null?void 0:r._config)==null?void 0:p.debug,s=Math.floor(Date.now()/3e5),c=`${e}:${a}:${s}`;if($t(s),z.has(c))return n&&console.debug("[hass-omnibus-card] history cache hit",{key:c,points:z.get(c).length}),z.get(c);if(G.has(c))return n&&console.debug("[hass-omnibus-card] history fetch pending, queuing callback",{key:c}),N.get(c).set(r,i),null;if(!(t!=null&&t.callWS))return n&&console.debug("[hass-omnibus-card] history skipped — no callWS",{entityId:e}),null;n&&console.debug("[hass-omnibus-card] history fetch start",{key:c,entityId:e,hours:a}),G.add(c),N.set(c,new Map([[r,i]]));const o=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:o,minimal_response:!0,no_attributes:!0}).then(h=>{const l=Array.isArray(h==null?void 0:h[e])?h[e]:[],d=l.map(g=>({t:(g.lu??g.last_updated??0)*1e3,v:parseFloat(g.s??g.state)})).filter(g=>!isNaN(g.v));n&&console.debug("[hass-omnibus-card] history fetch done",{key:c,rawCount:l.length,pointCount:d.length}),z.set(c,d),G.delete(c);const u=N.get(c);N.delete(c),u==null||u.forEach(g=>g(d))}).catch(h=>{n&&console.debug("[hass-omnibus-card] history fetch error",{key:c,error:h}),z.set(c,[]),G.delete(c);const l=N.get(c);N.delete(c),l==null||l.forEach(d=>d([]))}),null}class St extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._activeSection=null,this._cameraRefreshTimer=null}setConfig(e){var a,i;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');(i=this._config)!=null&&i.debug&&console.debug("[hass-omnibus-card] set config",{config:e}),this._config={...e},this._stateHash=null,this._activeSection=e.controls_collapsed===!1?"__default__":null,this._hass&&this._update(),this._startCameraRefreshTimer()}connectedCallback(){this._startCameraRefreshTimer()}disconnectedCallback(){clearInterval(this._cameraRefreshTimer)}_startCameraRefreshTimer(){var a,i,r;(a=this._config)!=null&&a.debug&&console.debug("[hass-omnibus-card] start camera refresh timer",{interval:(i=this._config)==null?void 0:i.camera_refresh_interval}),clearInterval(this._cameraRefreshTimer);const e=(r=this._config)==null?void 0:r.camera_refresh_interval;!e||e<=0||(this._cameraRefreshTimer=setInterval(()=>me(this.shadowRoot),e*6e4))}setActiveSection(e){var a;(a=this._config)!=null&&a.debug&&console.debug("[hass-omnibus-card] set active section",{section:e}),this._activeSection=this._activeSection===e?null:e,this._update()}set hass(e){var i;if((i=this._config)!=null&&i.debug&&console.debug("[hass-omnibus-card] set hass",{hass:e}),this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var i,r,n,s;if(!this._hass||!this._config)return"";let e;if((i=this._config.entities)!=null&&i.length)e=this._config.entities.map(c=>{var o;return{entityId:c,state:(o=this._hass.states)==null?void 0:o[c]}}).filter(c=>c.state);else{e=se(this._hass,this._config.area);for(const c of this._config.add_entities??[])if(!e.some(o=>o.entityId===c)){const o=(r=this._hass.states)==null?void 0:r[c];o&&e.push({entityId:c,state:o})}}const a=(n=this._config.history_chart)==null?void 0:n.entity_id;if(a&&!e.some(c=>c.entityId===a)){const c=(s=this._hass.states)==null?void 0:s[a];c&&e.push({entityId:a,state:c})}return e.map(({entityId:c,state:o})=>{var p,h,l;return`${c}=${o.state}|${((p=o.attributes)==null?void 0:p.rgb_color)??""}|${((h=o.attributes)==null?void 0:h.current_temperature)??""}|${((l=o.attributes)==null?void 0:l.entity_picture)??""}`}).sort().join(";")}_update(){var r,n;let e=null;const a=(r=this._config)==null?void 0:r.history_chart;a!=null&&a.entity_id&&(e=kt(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const i=Ye(this._hass,this._config,e,this._activeSection);i.error||(this._activeSection=i.activeSection??null),(n=this._config)!=null&&n.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:i}),vt(this.shadowRoot,this,i)}}window.customCards=window.customCards||[],window.customCards.push({type:te,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${Te} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(te,St)})();
