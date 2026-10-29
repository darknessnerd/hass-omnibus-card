(function(){"use strict";const ne="hass-omnibus-card",Pe="6.0.0",J=new Set(["on","open","playing","home","unlocked"]),He={heat:["mdi:fire","#ef6c00"],cool:["mdi:snowflake","#0288d1"],auto:["mdi:thermostat-auto","#43a047"],dry:["mdi:water-off-outline","#f9a825"],fan_only:["mdi:fan","#546e7a"],heat_cool:["mdi:fire-circle","#e64a19"],off:["mdi:thermostat-off","var(--secondary-text-color)"]},ie={motion:"mdi:motion-sensor",door:{on:"mdi:door-open",off:"mdi:door-closed"},opening:{on:"mdi:door-open",off:"mdi:door-closed"},window:{on:"mdi:window-open",off:"mdi:window-closed"},garage_door:{on:"mdi:garage-open",off:"mdi:garage"},lock:{on:"mdi:lock-open",off:"mdi:lock"},tamper:{on:"mdi:shield-alert",off:"mdi:shield-check-outline"},vibration:"mdi:vibrate",plug:"mdi:power-plug",presence:"mdi:home-account",power:"mdi:flash",energy:"mdi:lightning-bolt",battery:{on:"mdi:battery-alert",off:"mdi:battery"},connectivity:"mdi:wifi",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",illuminance:"mdi:brightness-6",sound_pressure:"mdi:volume-high",voltage:"mdi:flash-triangle-outline",tv:"mdi:television",speaker:"mdi:speaker",receiver:"mdi:audio-video"},Be="mdi:weather-windy-variant",oe={switch:{on:"mdi:toggle-switch",off:"mdi:toggle-switch-off-outline"},cover:{on:"mdi:blinds-open",off:"mdi:blinds"},fan:{on:"mdi:fan",off:"mdi:fan-off"},media_player:{on:"mdi:play-circle",off:"mdi:multimedia"},input_boolean:{on:"mdi:check-circle-outline",off:"mdi:close-circle-outline"},binary_sensor:{on:"mdi:radiobox-marked",off:"mdi:radiobox-blank"},automation:"mdi:robot",script:"mdi:script-text",person:"mdi:account",device_tracker:"mdi:map-marker",sensor:"mdi:eye",input_select:"mdi:format-list-bulleted",siren:{on:"mdi:bullhorn",off:"mdi:bullhorn-outline"},button:"mdi:gesture-tap-button",camera:"mdi:cctv",remote:"mdi:remote",lock:{on:"mdi:lock-open-variant",off:"mdi:lock"},vacuum:"mdi:robot-vacuum",humidifier:{on:"mdi:air-humidifier",off:"mdi:air-humidifier-off"},water_heater:"mdi:water-boiler",valve:{on:"mdi:valve-open",off:"mdi:valve-closed"},number:"mdi:ray-vertex",select:"mdi:format-list-bulleted",text:"mdi:form-textbox",scene:"mdi:palette",timer:"mdi:timer-outline",alarm_control_panel:"mdi:shield-home-outline"},qe={up:"mdi:arrow-up-bold",down:"mdi:arrow-down-bold",left:"mdi:arrow-left-bold",right:"mdi:arrow-right-bold"},Re=/_(max|gust|peak)$/i;function re(t,e){var i;return(((i=e.attributes)==null?void 0:i.friendly_name)??t.split(".")[1]).split(" ").pop()}function Ge(t,e,a,i=null,n=""){var l,d;const r=(l=a.attributes)==null?void 0:l.friendly_name;if(!r)return re(e,a);const o=i?(d=t.devices)==null?void 0:d[i]:null;return se(r,[o==null?void 0:o.name_by_user,o==null?void 0:o.name,n])??re(e,a)}function se(t,e){const a=i=>i.replace(/_/g," ").toLowerCase();for(const i of e.filter(Boolean))if(t.length>i.length&&a(t).startsWith(a(i)+" ")){const n=t.slice(i.length+1).replace(/_/g," ").trim();if(n)return n[0].toUpperCase()+n.slice(1)}return null}function We(t){const e=Math.abs(t);return e>=1e4?`${(t/1e3).toFixed(1).replace(/\.0$/,"")}k`:e>=100?String(Math.round(t)):t.toFixed(1).replace(/\.0$/,"")}function le(t){const e=new Map;for(const i of t)e.set(i.label,(e.get(i.label)??0)+1);if(![...e.values()].some(i=>i>1))return t;const a=i=>i.fullName.trim().split(/\s+/);return t.map(i=>{if(e.get(i.label)===1)return i;const n=a(i);for(let r=2;r<=n.length;r++){const o=n.slice(-r).join(" ");if(!t.some(d=>d!==i&&a(d).slice(-r).join(" ")===o))return{...i,label:o}}return{...i,label:i.entityId.split(".")[1]}})}function Ue(t,e,a,i=""){var d;const n=(d=t.devices)==null?void 0:d[e],r=(n==null?void 0:n.name_by_user)??(n==null?void 0:n.name);if(r)return se(r,[i])??r;const o=a.map(({entityId:s})=>s.split(".")[1].split("_"));let l=o[0]??[];for(const s of o.slice(1)){let p=0;for(;p<l.length&&p<s.length&&l[p]===s[p];)p++;l=l.slice(0,p)}return l.length?l.map(s=>s[0].toUpperCase()+s.slice(1)).join(" "):"Device"}function Ye({ptz:t=[],controls:e=[],settings:a=[],diagnostics:i=[]}){for(const n of[a,e,i,t]){const r=n.find(o=>o.icon);if(r)return r.icon}return"mdi:help-circle-outline"}function B(t,e){var o,l;if((o=e.attributes)!=null&&o.icon)return e.attributes.icon;const a=t.split(".")[0],i=((l=e.attributes)==null?void 0:l.device_class)??"",n=J.has(e.state),r=d=>typeof d=="string"?d:n?d.on:d.off;return a==="sensor"&&i==="battery"?ce(parseFloat(e.state)):i==="wind_speed"&&Re.test(t)?Be:i&&ie[i]?r(ie[i]):oe[a]?r(oe[a]):"mdi:help-circle-outline"}function q(t,e,a){var n,r;if(e==null)return a;if(typeof e=="number")return e;const i=parseFloat((r=(n=t.states)==null?void 0:n[e])==null?void 0:r.state);return Number.isFinite(i)?i:a}function ce(t){if(t==null||isNaN(t))return"mdi:battery-unknown";const e=Math.min(100,Math.max(0,t));return e<=5?"mdi:battery-alert-variant-outline":e>=100?"mdi:battery":`mdi:battery-${Math.min(90,Math.max(10,Math.round(e/10)*10))}`}function de(t,e){const{entities:a={},devices:i={},states:n={}}=t;return Object.keys(n).reduce((r,o)=>{var p;const l=a[o];if(!l||l.hidden_by)return r;const d=l.area_id===e,s=l.device_id&&((p=i[l.device_id])==null?void 0:p.area_id)===e;return(d||s)&&r.push({entityId:o,state:n[o],deviceId:l.device_id??null,entityCategory:l.entity_category??null}),r},[])}function Ze(t,e,a){var o,l,d;if((o=e.entities)!=null&&o.length)return e.entities.map(s=>{var h,u;const p=(h=a.states)==null?void 0:h[s],c=(u=a.entities)==null?void 0:u[s];return p?{entityId:s,state:p,deviceId:(c==null?void 0:c.device_id)??null,entityCategory:(c==null?void 0:c.entity_category)??null}:null}).filter(Boolean);const i=new Set(e.exclude_entities??[]),n=e.add_entities??[],r=t.filter(s=>!i.has(s.entityId));for(const s of n){if(r.some(h=>h.entityId===s))continue;const p=(l=a.states)==null?void 0:l[s],c=(d=a.entities)==null?void 0:d[s];p&&r.push({entityId:s,state:p,deviceId:(c==null?void 0:c.device_id)??null,entityCategory:(c==null?void 0:c.entity_category)??null})}return r}const Ve=new Set(["sensor","binary_sensor","image"]),Xe=new Set(["wind_speed","precipitation","illuminance","sound_pressure"]),pe={up:"up",down:"down",left:"left",right:"right",su:"up",giu:"down",sinistra:"left",destra:"right"},Ke=new RegExp(`ptz.*_(${Object.keys(pe).join("|")})$`,"i"),Je=new Set(["door","window","opening","garage_door"]),Qe=/_dew_point$/i,et=/_(privacy|riservatezza|suspend|sospensione)$/i;function tt(t,{showDiagnostics:e=!0}={}){var r;const a={lights:[],climate:[],temperatures:[],humidities:[],weathers:[],motions:[],occupancy:[],openings:[],tampers:[],smokes:[],gases:[],moistures:[],batteries:[],problems:[],cameras:[],cameraPrivacy:[],controls:[],settings:[],ptz:[],updates:[],others:[],diagnostics:[]};for(const o of t){const{entityId:l,state:d}=o,s=l.split(".")[0],p=((r=d.attributes)==null?void 0:r.device_class)??"",c=d.state,h=o.entityCategory==null||o.entityCategory!=="diagnostic"&&o.entityCategory!=="config",u=!e&&!h;if(s==="light")a.lights.push(o);else if(s==="climate")a.climate.push(o);else if(s==="camera")a.cameras.push(o);else if(s==="update"&&c!=="unavailable")a.updates.push(o);else if(s==="sensor"&&p==="temperature"&&h&&Qe.test(l))a.weathers.push(o);else if(s==="sensor"&&p==="temperature"&&h)a.temperatures.push(o);else if(s==="sensor"&&p==="humidity"&&h)a.humidities.push(o);else if(s==="sensor"&&Xe.has(p)&&h)a.weathers.push(o);else if(s==="binary_sensor"&&p==="motion")a.motions.push(o);else if(s==="binary_sensor"&&p==="occupancy")a.occupancy.push(o);else if(s==="binary_sensor"&&Je.has(p)&&c!=="unavailable")a.openings.push(o);else if(s==="binary_sensor"&&p==="tamper"&&c!=="unavailable")a.tampers.push(o);else if(s==="binary_sensor"&&p==="smoke")a.smokes.push(o);else if(s==="binary_sensor"&&p==="gas")a.gases.push(o);else if(s==="binary_sensor"&&p==="moisture")a.moistures.push(o);else if(s==="sensor"&&p==="battery"&&c!=="unavailable")a.batteries.push(o),e&&a.others.push(o);else if(s==="switch"&&et.test(l))a.cameraPrivacy.push(o),u||a.others.push(o);else if(c==="unavailable"||s==="binary_sensor"&&["problem","safety"].includes(p)&&c==="on")a.problems.push(o);else{if(u)continue;if(s==="siren")a.controls.push(o);else if(s==="button"){const g=l.match(Ke);g?a.ptz.push({...o,direction:pe[g[1].toLowerCase()]}):a.controls.push(o)}else a.others.push(o)}}const i=new Map;for(const o of a.others)o.deviceId&&(i.has(o.deviceId)||i.set(o.deviceId,[]),i.get(o.deviceId).push(o));const n=[];for(const o of a.others){const l=o.deviceId?i.get(o.deviceId):null;if(!l||l.length<2){n.push(o);continue}const d=o.entityId.split(".")[0];Ve.has(d)?a.diagnostics.push(o):a.settings.push(o)}return a.others=n,a}function he(t){const{controls:e,settings:a,diagnostics:i}=t,n=le([...e,...a,...i]);return{ptz:t.ptz,controls:n.slice(0,e.length),settings:n.slice(e.length,e.length+a.length),diagnostics:n.slice(e.length+a.length)}}function at(t,{ptz:e,controls:a,settings:i,diagnostics:n},r=null,o=""){const l={ptz:e,controls:a,settings:i,diagnostics:n},d=()=>({ptz:[],controls:[],settings:[],diagnostics:[]}),s=u=>u.ptz.length+u.controls.length+u.settings.length+u.diagnostics.length,p=new Map;for(const[u,g]of Object.entries(l))for(const b of g){const w=b.deviceId??null;p.has(w)||p.set(w,d()),p.get(w)[u].push(b)}const c=[];let h=d();for(const[u,g]of p)if(u==null||s(g)<2)for(const b of["ptz","controls","settings","diagnostics"])h[b].push(...g[b]);else{const b=he(g),w=[...b.ptz,...b.controls,...b.settings,...b.diagnostics],v=u===r?"mdi:cctv":Ye(b);c.push({key:u,label:Ue(t,u,w,o),icon:v,...b})}return h=he(h),c.sort((u,g)=>u.key===r?-1:g.key===r?1:s(g)-s(u)),s(h)>0&&c.push({key:"__other__",label:"Other",icon:"mdi:dots-horizontal",...h}),c}function ue(t){const e=t.map(a=>parseFloat(a.state.state)).filter(a=>!isNaN(a));return e.length?e.reduce((a,i)=>a+i,0)/e.length:null}function O(t){return t.some(e=>e.state.state==="on")}function nt(t){return t.filter(e=>e.state.state==="on")}function it(t){let e=null;for(const a of t){const i=parseFloat(a.state.state);isNaN(i)||(!e||i<e.value)&&(e={value:i,entityId:a.entityId,state:a.state})}return e}function ot(t){var e;for(const a of t){const i=(e=a.state.attributes)==null?void 0:e.rgb_color;if(i)return`rgb(${i.join(",")})`}return null}const rt=new Set(["light","switch","fan","input_boolean","cover","media_player","humidifier","automation"]),st=new Set(["scene","script"]);function lt(t,e){const a=q(t,e.threshold_high,null),i=q(t,e.threshold_low,null);return a===e.threshold_high&&i===e.threshold_low?e:{...e,threshold_high:a,threshold_low:i}}function R(t,e,a,i,n,r){var l,d,s;const o=e.split(".")[0];return{entityId:e,deviceId:i,domain:o,tapAction:ct(o,n),isActive:J.has(a.state),icon:B(e,a),label:((l=n.entity_labels)==null?void 0:l[e])??Ge(t,e,a,i,r),fullName:((d=a.attributes)==null?void 0:d.friendly_name)??e,title:`${((s=a.attributes)==null?void 0:s.friendly_name)??e} — ${a.state}`}}function ct(t,e){return e.chip_tap_action==="more-info"?"more-info":rt.has(t)?"toggle":st.has(t)?"trigger":"more-info"}function ge(t,e,a,i,n){var o;const r=J.has(e.state);return{entityId:t,icon:B(t,e),[a]:r,title:`${((o=e.attributes)==null?void 0:o.friendly_name)??t} — ${r?i:n}`}}function dt(t,e,a){if(!Array.isArray(t)||t.length<4)return null;const i=Math.floor(t.length/2),n=t.slice(0,i),r=t.slice(i),o=s=>s.reduce((p,c)=>p+c.v,0)/s.length,l=o(r)-o(n),d=a-e;return d===0||Math.abs(l)<d*.05?"flat":l>0?"up":"down"}function pt(t,e,a=null,i=null){var K,_e,$e,ke,Se,Ce,Ee,Ae,ze,Te,Ie,Le,Me,Ne;const n=e.area,r=(K=t.areas)==null?void 0:K[n];if(!r&&!e.name&&!((_e=e.entities)!=null&&_e.length))return{error:n??"(no area)"};const o=($e=e.entities)!=null&&$e.length?[]:de(t,n),l=Ze(o,e,t),d=e.show_diagnostics===!0,s=tt(l,{showDiagnostics:d}),p=e.name||(r==null?void 0:r.name)||n||"",c=nt(s.lights),h=ot(c),u=ue(s.temperatures),g=ue(s.humidities),b=s.climate[0]??null,[w,v]=He[(ke=b==null?void 0:b.state)==null?void 0:ke.state]??[null,null],E=q(t,e.mold_threshold,70),j=e.navigate_to||((Se=e.tap_action)==null?void 0:Se.navigation_path)||null,M=e.history_chart??null,x=M?lt(t,M):null,U=q(t,e.battery_low_threshold,20),k=it(s.batteries),y=s.cameras[0]??null,ee=s.cameras.slice(1),N=y?s.cameraPrivacy.find(m=>m.deviceId===y.deviceId)??null:null,T=s.updates.filter(m=>m.state.state==="on"),te=e.show_entities!==!1?s.controls.map(({entityId:m,state:_,deviceId:S})=>R(t,m,_,S,e,p)):[],Y=e.show_entities!==!1?s.settings.map(({entityId:m,state:_,deviceId:S})=>R(t,m,_,S,e,p)):[],Z=e.show_entities!==!1?s.ptz.map(({entityId:m,state:_,direction:S,deviceId:A})=>{var H;return{entityId:m,deviceId:A,direction:S,icon:qe[S],title:((H=_.attributes)==null?void 0:H.friendly_name)??m}}):[],V=e.show_entities!==!1&&d?s.diagnostics.map(({entityId:m,state:_,deviceId:S})=>R(t,m,_,S,e,p)):[],D=e.collapsible_controls!==!1,F=at(t,{ptz:Z,controls:te,settings:Y,diagnostics:V},(y==null?void 0:y.deviceId)??null,p),X=F.map(m=>m.key),I=D?i==="__default__"?X[0]??null:X.includes(i)?i:null:null,P=!!(x!=null&&x.entity_id&&(a==null?void 0:a.length)>=2),f=P?Math.min(...a.map(m=>m.v)):null,$=P?Math.max(...a.map(m=>m.v)):null;return{areaName:p,layout:e.layout==="panel"?"panel":"compact",hidden:new Set(e.hide??[]),cardIcon:e.icon||(r==null?void 0:r.icon)||"mdi:home",navPath:j,hasLights:s.lights.length>0,lightCount:c.length,offlineLights:s.lights.filter(m=>m.state.state==="unavailable").length,lightColor:h,occupied:O(s.motions)||O(s.occupancy),hasOccupancySensors:s.motions.length>0||s.occupancy.length>0,problemCount:s.problems.length,showBatteryBadge:k!=null&&k.value<=U,batteryValue:(k==null?void 0:k.value)??null,batteryIcon:k?ce(k.value):null,batteryEntity:(k==null?void 0:k.entityId)??null,batteryTitle:k?`${s.batteries.length>1?`Lowest of ${s.batteries.length} — `:""}${((Ce=k.state.attributes)==null?void 0:Ce.friendly_name)??k.entityId}: ${k.value}%`:"",tempVal:u,humVal:g,tempUnit:((Ae=(Ee=s.temperatures[0])==null?void 0:Ee.state.attributes)==null?void 0:Ae.unit_of_measurement)??"°C",tempEntities:s.temperatures,humEntities:s.humidities,climate:b,climIcon:w,climColor:v,smokeOn:O(s.smokes),gasOn:O(s.gases),waterOn:O(s.moistures),moldRisk:g!==null&&g>=E,updateCount:T.length,updateEntity:((ze=T[0])==null?void 0:ze.entityId)??null,updateTitle:T.length?`${T.length} update${T.length!==1?"s":""} available: ${T.map(m=>{var _;return((_=m.state.attributes)==null?void 0:_.friendly_name)??m.entityId}).join(", ")}`:"",hasCamera:e.show_camera!==!1&&!!y,cameraEntity:(y==null?void 0:y.entityId)??null,cameraImage:((Te=y==null?void 0:y.state.attributes)==null?void 0:Te.entity_picture)??null,cameraIcon:y?B(y.entityId,y.state):null,cameraTitle:((Ie=y==null?void 0:y.state.attributes)==null?void 0:Ie.friendly_name)??(y==null?void 0:y.entityId)??"",cameraState:(y==null?void 0:y.state.state)??"",cameraOffline:(y==null?void 0:y.state.state)==="unavailable",cameraPrivacy:(N==null?void 0:N.state.state)==="on",deviceGroups:F,collapsibleControls:D,activeSection:I,openingItems:e.show_entities!==!1?s.openings.map(({entityId:m,state:_})=>ge(m,_,"isOpen","Open","Closed")):[],tamperItems:e.show_entities!==!1?s.tampers.map(({entityId:m,state:_})=>ge(m,_,"isTampered","Tamper detected","Normal")):[],...(()=>{const m=e.show_entities!==!1?s.weathers.map(({entityId:S,state:A})=>{var je,De,Fe;const H=parseFloat(A.state),ae=((je=A.attributes)==null?void 0:je.unit_of_measurement)??"",Ut=((De=A.attributes)==null?void 0:De.device_class)??"",Oe=isNaN(H)?A.state:We(H);return{entityId:S,dc:Ut,icon:B(S,A),value:Oe,unit:ae,title:`${((Fe=A.attributes)==null?void 0:Fe.friendly_name)??S} — ${Oe}${ae?" "+ae:""}`}}):[],_=e.max_weather??3;return{weatherItems:m.slice(0,_),weatherOverflow:m.slice(_)}})(),historyPoints:x!=null&&x.entity_id?a:null,historyColor:(x==null?void 0:x.color)??"rgba(3, 169, 244, 0.2)",historyChart:x,historyMin:f,historyMax:$,historyTrend:dt(a,f,$),historyUnit:((Ne=(Me=(Le=t.states)==null?void 0:Le[x==null?void 0:x.entity_id])==null?void 0:Me.attributes)==null?void 0:Ne.unit_of_measurement)??"",historyHours:(x==null?void 0:x.hours)??24,historyEmpty:!!(x!=null&&x.entity_id)&&Array.isArray(a)&&a.length<2,chipItems:e.show_entities!==!1?le([...s.others,...ee].slice(0,e.max_entities??12).map(({entityId:m,state:_,deviceId:S})=>R(t,m,_,S,e,p))):[]}}const fe=`
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

  /* Wide enough for a stripped entity name ("Motion detection") — labels
     come from entityLabel() now, not just friendly_name's last word. */
  .chip-label {
    max-width: 7rem;
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
    max-width: 6rem;
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

  .weather-more { opacity: 0.7; }

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
    max-width: 9rem;
    padding: 3px 9px;
    border-radius: 12px;
    font-size: 0.72rem;
    font-weight: 600;
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
  /* Amber, not green — green reads as "all clear" everywhere else on the
     card (closed doors, normal tamper), so a risk badge can't wear it. */
  .alarm-mold  { background: rgba(255, 152, 0, 0.15); color: var(--warning-color, #ff9800); animation: none; }

  /* ── layout: panel ── Wall-mounted tablet mode: every tap target reaches
     ≥ 44px (WCAG 2.5.5 / Apple HIG), headline numbers readable from a couple
     of metres away. Same markup as compact — only sizing changes, so every
     template and event binding stays shared. */
  ha-card.layout-panel .card-content { padding: 20px 22px 18px; }

  ha-card.layout-panel .header       { margin-bottom: 14px; }
  ha-card.layout-panel .room-icon    { --mdc-icon-size: 30px; }
  ha-card.layout-panel .room-name    { font-size: 1.35rem; }
  ha-card.layout-panel .header-right { gap: 10px; }

  ha-card.layout-panel .badge         { padding: 8px 14px; font-size: 0.95rem; min-height: 44px; box-sizing: border-box; border-radius: 22px; }
  ha-card.layout-panel .badge ha-icon { --mdc-icon-size: 22px; }
  ha-card.layout-panel .occupancy-dot { width: 12px; height: 12px; }

  ha-card.layout-panel .env-row         { gap: 12px; margin-bottom: 16px; }
  ha-card.layout-panel .env-chip        { font-size: 1.6rem; padding: 6px 12px; gap: 6px; }
  ha-card.layout-panel .env-chip ha-icon { --mdc-icon-size: 26px; }

  ha-card.layout-panel .entity-chips  { gap: 10px; }
  ha-card.layout-panel .chip          { min-height: 48px; padding: 10px 16px; font-size: 0.95rem; gap: 8px; border-radius: 24px; box-sizing: border-box; }
  ha-card.layout-panel .chip ha-icon  { --mdc-icon-size: 22px; }
  ha-card.layout-panel .chip-label    { max-width: 10rem; }

  ha-card.layout-panel .group-chip        { padding: 3px 4px; min-height: 0; }
  ha-card.layout-panel .group-seg         { min-height: 44px; padding: 8px 12px; gap: 6px; border-radius: 20px; }
  ha-card.layout-panel .group-seg ha-icon { --mdc-icon-size: 20px; }
  ha-card.layout-panel .group-seg-value,
  ha-card.layout-panel .seg-label         { font-size: 0.9rem; }
  ha-card.layout-panel .seg-label         { max-width: 9rem; }
  ha-card.layout-panel .group-section     { margin-bottom: 12px; }

  ha-card.layout-panel .section-tab         { min-height: 40px; max-width: 10rem; padding: 8px 14px; font-size: 0.8rem; border-radius: 20px; box-sizing: border-box; }
  ha-card.layout-panel .section-tab ha-icon { --mdc-icon-size: 18px; }

  ha-card.layout-panel .alarm-badge         { padding: 10px 16px; font-size: 1rem; border-radius: 22px; }
  ha-card.layout-panel .alarm-badge ha-icon { --mdc-icon-size: 22px; }

  ha-card.layout-panel .camera-refresh-btn  { width: 40px; height: 40px; }
  ha-card.layout-panel .camera-refresh-btn ha-icon { --mdc-icon-size: 22px; }

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
`;function me(t,e,a){const i=(t==null?void 0:t.y_min)!=null?Math.min(t.y_min,e):e,n=(t==null?void 0:t.y_max)!=null?Math.max(t.y_max,a):a;return{min:i,max:n,range:n-i}}function ht(t,e=150){if(t.length<=e)return t.slice();const a=Math.floor(e/2),i=t.length/a,n=[];for(let r=0;r<a;r++){const o=Math.floor(r*i),l=r===a-1?t.length:Math.floor((r+1)*i);if(o>=l)continue;let d=-1,s=-1;for(let p=o;p<l;p++)Number.isFinite(t[p].v)&&((d===-1||t[p].v<t[d].v)&&(d=p),(s===-1||t[p].v>t[s].v)&&(s=p));if(d===-1)n.push(t[o]);else if(d===s)n.push(t[d]);else{const[p,c]=d<s?[d,s]:[s,d];n.push(t[p],t[c])}}return n}const ut=40,Q=14,G=new WeakMap;function gt(t,e,a=null,i=""){if(!(t!=null&&t.length)||t.length<2)return"";const n=G.get(t);if(n&&n.color===e&&n.hc===a&&n.unit===i)return n.result;const r=300,o=60,l=t.map(f=>f.v),d=Math.min(...l),s=Math.max(...l),{min:p,range:c}=me(a,d,s);if(c===0&&(a==null?void 0:a.y_min)==null&&(a==null?void 0:a.y_max)==null)return G.set(t,{color:e,hc:a,unit:i,result:""}),"";const h=c||1,u=ht(t),g=t[0].t,w=t[t.length-1].t-g||1,v=u.map(f=>(f.t-g)/w*r),E=u.map(f=>o-(f.v-p)/h*o),M=`${v.map((f,$)=>`${$?"L":"M"}${f.toFixed(1)},${E[$].toFixed(1)}`).join(" ")} V${o} H0 Z`,x=u.length>ut,U=x?"":v.map((f,$)=>`<circle cx="${f.toFixed(1)}" cy="${E[$].toFixed(1)}" r="1.5" fill="${e}"/>`).join(""),k=r/(v.length-1),y=Math.min(4,k/2).toFixed(1),ee=v.map((f,$)=>{if(!Number.isFinite(u[$].v))return"";const K=`${u[$].v.toFixed(1)}${i}`;return`<circle cx="${f.toFixed(1)}" cy="${E[$].toFixed(1)}" r="${y}" fill="transparent" data-v="${K}"/>`}).join(""),N=`<svg class="chart-hit-layer${x?" dense":""}" viewBox="0 0 ${r} ${o}" preserveAspectRatio="none" aria-hidden="true">${ee}</svg>`;if(!(a&&(a.threshold_high!=null||a.threshold_low!=null))){const f=be(r,o,`<path d="${M}" fill="${e}"/>${U}`)+N;return G.set(t,{color:e,hc:a,unit:i,result:f}),f}const te=a.color??"rgba(3, 169, 244, 0.12)",Y=a.color_high??"rgba(244, 67, 54, 0.25)",Z=a.color_low??"rgba(33, 150, 243, 0.25)",V=f=>Math.max(0,Math.min(o,o-(f-p)/h*o)),D=o*(Q/100),F=f=>Math.min(o-D,Math.max(D,f)),X=`<defs><clipPath id="sg-cp"><path d="${M}"/></clipPath></defs>`;let I=`<path d="${M}" fill="${te}"/>`;if(a.threshold_high!=null){const f=V(a.threshold_high);if(f>0&&(I+=`<rect x="0" y="0" width="${r}" height="${f.toFixed(1)}" fill="${Y}" clip-path="url(#sg-cp)"/>`),f>0&&f<o){const $=F(f).toFixed(1);I+=`<line x1="0" y1="${$}" x2="${r}" y2="${$}" stroke="${Y}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}if(a.threshold_low!=null){const f=V(a.threshold_low);if(f<o&&(I+=`<rect x="0" y="${f.toFixed(1)}" width="${r}" height="${(o-f).toFixed(1)}" fill="${Z}" clip-path="url(#sg-cp)"/>`),f>0&&f<o){const $=F(f).toFixed(1);I+=`<line x1="0" y1="${$}" x2="${r}" y2="${$}" stroke="${Z}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.6"/>`}}const P=be(r,o,X+I+U)+N;return G.set(t,{color:e,hc:a,unit:i,result:P}),P}function be(t,e,a){return`<svg class="bg-chart" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">${a}</svg>`}function ft({areaName:t,cardIcon:e,hasLights:a,lightCount:i,offlineLights:n,occupied:r,hasOccupancySensors:o,problemCount:l,showBatteryBadge:d,batteryValue:s,batteryIcon:p,batteryEntity:c,batteryTitle:h,updateCount:u,updateEntity:g,updateTitle:b,openingItems:w,tamperItems:v}){const E=i===0,j=E?n>0?`${n} light${n!==1?"s":""} offline`:"Lights off":`${i} light${i!==1?"s":""} on${n>0?` · ${n} offline`:""}`;return`
    <div class="header">
      <div class="header-left">
        <ha-icon class="room-icon" icon="${e}"></ha-icon>
        <span class="room-name">${t}</span>
      </div>
      <div class="header-right">
        ${a?`
          <div class="badge badge-lights ${E?"off":""} ${n>0?"has-offline":""}"
               role="button" tabindex="0" aria-label="${j}" title="${j}">
            <ha-icon icon="mdi:lightbulb${E?"-off":""}"></ha-icon>
            ${i>1?`<span>${i}</span>`:""}
          </div>`:""}
        ${xt({openingItems:w})}
        ${vt({tamperItems:v})}
        ${o?`<div class="occupancy-dot ${r?"":"idle"}" title="${r?"Occupied":"Not occupied"}"></div>`:""}
        ${mt({showBatteryBadge:d,batteryValue:s,batteryIcon:p,batteryEntity:c,batteryTitle:h,problemCount:l,updateCount:u,updateEntity:g,updateTitle:b})}
      </div>
    </div>`}function mt({showBatteryBadge:t,batteryValue:e,batteryIcon:a,batteryEntity:i,batteryTitle:n,problemCount:r,updateCount:o,updateEntity:l,updateTitle:d}){const s=[];return t&&s.push(`
    <span class="group-seg status-seg-battery" data-entity="${i}" role="button" tabindex="0" aria-label="${n}" title="${n}">
      <ha-icon icon="${a}"></ha-icon><span>${e}%</span>
    </span>`),r>0&&s.push(`
    <span class="group-seg status-seg-problem" title="${r} problem${r!==1?"s":""}">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>${r>1?`<span>${r}</span>`:""}
    </span>`),o>0&&s.push(`
    <span class="group-seg status-seg-update" data-entity="${l}" role="button" tabindex="0" aria-label="${d}" title="${d}">
      <ha-icon icon="mdi:package-up"></ha-icon>${o>1?`<span>${o}</span>`:""}
    </span>`),s.length?`<div class="chip group-chip status-cluster" title="Alerts">${s.join("")}</div>`:""}function bt({tempVal:t,humVal:e,tempUnit:a,tempEntities:i,humEntities:n,climate:r,climIcon:o,climColor:l}){var c,h,u,g,b,w,v,E;if(t===null&&e===null&&!o)return"";const d=i.length>1?`Avg of ${i.length} sensors`:((h=(c=i[0])==null?void 0:c.state.attributes)==null?void 0:h.friendly_name)??"",s=n.length>1?`Avg of ${n.length} sensors`:((g=(u=n[0])==null?void 0:u.state.attributes)==null?void 0:g.friendly_name)??"",p=((b=r==null?void 0:r.state.attributes)==null?void 0:b.friendly_name)??(r==null?void 0:r.entityId)??"";return`
    <div class="env-row">
      ${t!==null?`
        <div class="env-chip temp"
             data-entity="${((w=i[0])==null?void 0:w.entityId)??""}"
             role="button" tabindex="0" aria-label="${d}" title="${d}">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${t.toFixed(1)}${a}</span>
        </div>`:""}
      ${e!==null?`
        <div class="env-chip hum"
             data-entity="${((v=n[0])==null?void 0:v.entityId)??""}"
             role="button" tabindex="0" aria-label="${s}" title="${s}">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${e.toFixed(0)}%</span>
        </div>`:""}
      ${o?`
        <div class="env-chip climate"
             style="--climate-color: ${l}"
             data-entity="${r.entityId}"
             role="button" tabindex="0" aria-label="${p}" title="${p}">
          <ha-icon icon="${o}"></ha-icon>
          <span>${((E=r.state.attributes)==null?void 0:E.current_temperature)!=null?`${r.state.attributes.current_temperature}°`:r.state.state}</span>
        </div>`:""}
    </div>`}function ye(t,e,a){return a?`<div class="group-section">${a}</div>`:""}function yt({weatherItems:t,weatherOverflow:e=[]}){if(!t.length)return"";const a=e.map(i=>i.title).join(`
`);return`
    <div class="chip group-chip weather-chip">
      ${t.map(({entityId:i,dc:n,icon:r,value:o,unit:l,title:d})=>`
        <span class="group-seg weather-seg" data-entity="${i}" data-dc="${n}" role="button" tabindex="0" aria-label="${d}" title="${d}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="group-seg-value">${o}${l?" "+l:""}</span>
        </span>`).join("")}
      ${e.length?`
        <span class="group-seg weather-seg weather-more" data-entity="${e[0].entityId}" role="button" tabindex="0" aria-label="${a}" title="${a}">
          <span class="group-seg-value">+${e.length}</span>
        </span>`:""}
    </div>`}function vt({tamperItems:t}){return t.length?`
    <div class="chip group-chip tamper-chip">
      ${t.map(({entityId:e,icon:a,isTampered:i,title:n})=>`
        <span class="group-seg tamper-seg${i?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${n}" title="${n}">
          <ha-icon icon="${a}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function xt({openingItems:t}){return t.length?`
    <div class="chip group-chip openings-chip">
      ${t.map(({entityId:e,icon:a,isOpen:i,title:n})=>`
        <span class="group-seg opening-seg${i?" on":""}" data-entity="${e}" role="button" tabindex="0" aria-label="${n}" title="${n}">
          <ha-icon icon="${a}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function wt({chipItems:t}){return`${t.length?`
      <div class="entity-chips">
        ${t.map(({entityId:e,domain:a,tapAction:i,isActive:n,icon:r,label:o,title:l})=>`
          <div class="chip${n?" on":""}" data-entity="${e}" data-domain="${a}" data-tap="${i}" role="button" tabindex="0" aria-label="${l}" title="${l}">
            <ha-icon icon="${r}"></ha-icon>
            <span class="chip-label">${o}</span>
          </div>`).join("")}
      </div>`:""}`}function _t({diagnosticsItems:t}){return t.length?`
    <div class="chip group-chip diagnostics-chip">
      ${t.map(({entityId:e,icon:a,label:i,title:n})=>`
        <span class="group-seg diagnostics-seg" data-entity="${e}" role="button" tabindex="0" aria-label="${n}" title="${n}">
          <ha-icon icon="${a}"></ha-icon>
          <span class="seg-label">${i}</span>
        </span>`).join("")}
    </div>`:""}function $t({chipItems:t,hidden:e}){return e.has("chips")?"":ye("","",wt({chipItems:t}))}function kt({weatherItems:t,weatherOverflow:e,hidden:a}){return a.has("weather")?"":ye("","",yt({weatherItems:t,weatherOverflow:e}))}function St({hasCamera:t,cameraImage:e,cameraIcon:a,cameraEntity:i,cameraTitle:n,cameraState:r,cameraOffline:o,cameraPrivacy:l}){if(!t)return"";const d=l?`${n} (privacy mode)`:o?`${n} (offline)`:n,s=e&&!l;return`
    <div class="camera-preview${o?" offline":""}${l?" privacy":""}" data-entity="${i}"
         role="button" tabindex="0" aria-label="${d}" title="${d}">
      ${s?`<img src="${e}" alt="${d}" loading="lazy" />`:`<div class="camera-placeholder"><ha-icon icon="${l?"mdi:eye-off":a}"></ha-icon></div>`}
      ${r==="recording"&&!l?'<span class="camera-rec-dot" title="Recording"></span>':""}
      ${s?`
        <span class="camera-refresh-btn" role="button" tabindex="0" aria-label="Refresh snapshot" title="Refresh snapshot">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </span>`:""}
    </div>`}function Ct({ptzItems:t}){return t.length?`
    <div class="chip group-chip ptz-chip">
      ${t.map(({entityId:e,direction:a,icon:i,title:n})=>`
        <span class="group-seg ptz-seg" data-entity="${e}" data-direction="${a}" role="button" tabindex="0" aria-label="${n}" title="${n}">
          <ha-icon icon="${i}"></ha-icon>
        </span>`).join("")}
    </div>`:""}function Et({controlItems:t}){return t.length?`
    <div class="chip group-chip controls-chip">
      ${t.map(({entityId:e,domain:a,isActive:i,icon:n,label:r,title:o})=>`
        <span class="group-seg control-seg${i?" on":""}" data-entity="${e}" data-domain="${a}" role="button" tabindex="0" aria-label="${o}" title="${o}">
          <ha-icon icon="${n}"></ha-icon>
          <span class="seg-label">${r}</span>
        </span>`).join("")}
    </div>`:""}function At({settingsItems:t}){return t.length?`
    <div class="chip group-chip settings-chip">
      ${t.map(({entityId:e,domain:a,tapAction:i,isActive:n,icon:r,label:o,title:l})=>`
        <span class="group-seg settings-seg${n?" on":""}" data-entity="${e}" data-domain="${a}" data-tap="${i}" role="button" tabindex="0" aria-label="${l}" title="${l}">
          <ha-icon icon="${r}"></ha-icon>
          <span class="seg-label">${o}</span>
        </span>`).join("")}
    </div>`:""}const zt={ptz:"PTZ",controls:"Controls",settings:"Settings",diagnostics:"Diagnostics"};function Tt({ptz:t,controls:e,settings:a,diagnostics:i}){return[{role:"ptz",pill:Ct({ptzItems:t})},{role:"controls",pill:Et({controlItems:e})},{role:"settings",pill:At({settingsItems:a})},{role:"diagnostics",pill:_t({diagnosticsItems:i})}].filter(n=>n.pill)}function ve(t){const e=t.length>1;return t.map(({role:a,pill:i})=>`
    <div class="device-role">
      ${e?`<span class="device-role-label">${zt[a]}</span>`:""}
      ${i}
    </div>`).join("")}function It({deviceGroups:t,collapsibleControls:e,activeSection:a}){const i=t.map(({key:n,label:r,icon:o,ptz:l,controls:d,settings:s,diagnostics:p})=>({key:n,label:r,icon:o,roleSections:Tt({ptz:l,controls:d,settings:s,diagnostics:p})})).filter(n=>n.roleSections.length);return i.length?e?`
    <div class="section-tabs">
      <div class="section-tabs-bar" role="tablist">
        ${i.map(({key:n,label:r,icon:o})=>`
          <span class="section-tab${a===n?" active":""}" data-section="${n}"
            role="tab" tabindex="0" aria-selected="${a===n}" title="${r}">
            <ha-icon icon="${o}"></ha-icon><span class="section-tab-label">${r}</span>
          </span>`).join("")}
      </div>
      ${i.map(({key:n,roleSections:r})=>`
        <div class="section-tab-panel${a===n?" active":""}">${ve(r)}</div>`).join("")}
    </div>`:i.map(({label:n,icon:r,roleSections:o})=>`
      <div class="group-section">
        <span class="group-label"><ha-icon icon="${r}"></ha-icon>${n}</span>
        ${ve(o)}
      </div>`).join(""):""}function Lt({smokeOn:t,gasOn:e,waterOn:a,moldRisk:i}){return!t&&!e&&!a&&!i?"":`
    <div class="alarm-bar">
      ${t?'<span class="alarm-badge alarm-smoke"><ha-icon icon="mdi:smoke-detector-alert"></ha-icon> Smoke</span>':""}
      ${e?'<span class="alarm-badge alarm-gas"><ha-icon icon="mdi:molecule-co"></ha-icon> Gas</span>':""}
      ${a?'<span class="alarm-badge alarm-water"><ha-icon icon="mdi:water-alert"></ha-icon> Water</span>':""}
      ${i?'<span class="alarm-badge alarm-mold"><ha-icon icon="mdi:mold"></ha-icon> Mold risk</span>':""}
    </div>`}function Mt(t){return`
    <style>${fe}</style>
    <ha-card class="error-card">
      <div class="error-content">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Area <strong>${t}</strong> not found.
          Check the <code>area:</code> value or add a <code>name:</code> override.</span>
      </div>
    </ha-card>`}function Nt({historyMin:t,historyMax:e,historyUnit:a,historyHours:i,historyChart:n,historyEmpty:r,historyTrend:o}){if(t===null)return r?'<div class="chart-overlay"><span class="chart-stat chart-empty">No numeric history</span></div>':"";const l=[];if((n==null?void 0:n.threshold_high)!=null||(n==null?void 0:n.threshold_low)!=null){const{min:h,range:u}=me(n,t,e),g=u||1,b=v=>(1-(v-h)/g)*100,w=v=>Math.min(100-Q,Math.max(Q,v));if(n.threshold_high!=null){const v=b(n.threshold_high);v>0&&v<100&&l.push(`<span class="chart-threshold" style="top:${w(v).toFixed(1)}%">${n.threshold_high.toFixed(1)}${a}</span>`)}if(n.threshold_low!=null){const v=b(n.threshold_low);v>0&&v<100&&l.push(`<span class="chart-threshold" style="top:${w(v).toFixed(1)}%">${n.threshold_low.toFixed(1)}${a}</span>`)}}const d={up:"⬈",down:"⬊",flat:"➡"},p=o?`<span class="chart-stat stat-trend trend-${o}" title="Trending ${{up:"up",down:"down",flat:"no change"}[o]} over ${i}h">${d[o]}</span>`:"",c=n.show_stats?`
      <span class="chart-stat stat-max">↑ ${e.toFixed(1)}${a}</span>
      <span class="chart-stat stat-period" title="Tracking ${n.entity_id} — may differ from the averaged value shown above">${i}h</span>
      <span class="chart-stat stat-min">↓ ${t.toFixed(1)}${a}</span>`:"";return`
    <div class="chart-overlay">
      ${p}
      ${c}
      ${l.join("")}
    </div>`}function Ot(t){const e=t.smokeOn||t.gasOn||t.waterOn,a=t.lightColor?`background: linear-gradient(135deg, ${t.lightColor}1a 0%, var(--ha-card-background, var(--card-background-color, transparent)) 60%);`:"",i=[t.navPath?"clickable":"",e?"alarm-active":"",`layout-${t.layout}`].filter(Boolean).join(" "),n=r=>!t.hidden.has(r);return`
    <style>${fe}</style>
    <ha-card
      ${i?`class="${i}"`:""}
      style="${a}"
      ${t.navPath?'role="button" tabindex="0"':""}
      aria-label="${t.areaName}"
    >
      ${t.historyPoints&&n("history")?gt(t.historyPoints,t.historyColor,t.historyChart,t.historyUnit):""}
      ${n("history")?Nt(t):""}
      <div class="card-content">
        ${n("camera")?St(t):""}
        ${ft(t)}
        ${n("env")?bt(t):""}
        ${$t(t)}
        ${kt(t)}
        ${n("devices")?It(t):""}
        ${Lt(t)}
      </div>
    </ha-card>`}function C(t,e){t.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}function jt(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0,detail:{replace:!1}}))}function Dt(t,e,a){var n,r;const i=(n=t.activeElement)==null?void 0:n.className;t.innerHTML=a.error?Mt(a.error):Ot(a),a.error||(Pt(t,e,a),Ft(t)),i&&((r=t.querySelector(`.${i.trim().split(/\s+/).join(".")}`))==null||r.focus())}function xe(t){const e=t.querySelector(".camera-preview img");if(!e)return;const a=new URL(e.getAttribute("src"),window.location.href);a.searchParams.set("_refresh",Date.now()),e.src=a.pathname+a.search}function Ft(t){const e=t.querySelectorAll(".chart-threshold");if(!e.length)return;const a=[...t.querySelectorAll(".card-content > *")].map(n=>n.getBoundingClientRect()).filter(n=>n.width>0&&n.height>0),i=(n,r)=>n.left<r.right&&n.right>r.left&&n.top<r.bottom&&n.bottom>r.top;e.forEach(n=>{const r=n.getBoundingClientRect();a.some(o=>i(r,o))&&(n.style.display="none")})}function Pt(t,e,{navPath:a,chipItems:i}){var s,p;a&&t.querySelector("ha-card").addEventListener("click",c=>{!c.target.closest(".chip")&&!c.target.closest(".env-chip")&&!c.target.closest(".badge-lights")&&!c.target.closest(".status-seg-battery")&&!c.target.closest(".status-seg-update")&&!c.target.closest(".camera-preview")&&!c.target.closest(".section-tab")&&jt(a)}),t.querySelectorAll('[role="button"][tabindex], [role="tab"][tabindex]').forEach(c=>{c.addEventListener("keydown",h=>{h.key!=="Enter"&&h.key!==" "||(h.preventDefault(),h.stopPropagation(),c.click())})}),t.querySelectorAll(".section-tab[data-section]").forEach(c=>{c.addEventListener("click",h=>{h.stopPropagation(),e.setActiveSection(c.dataset.section)})}),t.querySelectorAll(".ptz-seg[data-entity]").forEach(c=>{c.addEventListener("click",h=>{var u;h.stopPropagation(),(u=e._hass)!=null&&u.callService?e._hass.callService("button","press",{},{entity_id:c.dataset.entity}):C(e,c.dataset.entity)})}),t.querySelectorAll(".weather-seg[data-entity]").forEach(c=>{c.addEventListener("click",h=>{h.stopPropagation(),C(e,c.dataset.entity)})}),t.querySelectorAll(".opening-seg[data-entity]").forEach(c=>{c.addEventListener("click",h=>{h.stopPropagation(),C(e,c.dataset.entity)})}),t.querySelectorAll(".tamper-seg[data-entity]").forEach(c=>{c.addEventListener("click",h=>{h.stopPropagation(),C(e,c.dataset.entity)})}),t.querySelectorAll(".diagnostics-seg[data-entity]").forEach(c=>{c.addEventListener("click",h=>{h.stopPropagation(),C(e,c.dataset.entity)})});const n=t.querySelector(".status-seg-update[data-entity]");n&&n.addEventListener("click",c=>{c.stopPropagation(),C(e,n.dataset.entity)});const r=t.querySelector(".camera-preview[data-entity]");r&&r.addEventListener("click",c=>{c.stopPropagation(),C(e,r.dataset.entity)});const o=t.querySelector(".camera-refresh-btn");o&&o.addEventListener("click",c=>{c.stopPropagation(),xe(t)}),t.querySelectorAll(".control-seg[data-entity]").forEach(c=>{c.addEventListener("click",h=>{var b,w;h.stopPropagation();const u=c.dataset.entity,g=c.dataset.domain;g==="button"&&((b=e._hass)!=null&&b.callService)?e._hass.callService("button","press",{},{entity_id:u}):g==="siren"&&((w=e._hass)!=null&&w.callService)?e._hass.callService("siren","toggle",{},{entity_id:u}):C(e,u)})}),t.querySelectorAll(".settings-seg[data-entity]").forEach(c=>we(c,e));const l=t.querySelector(".badge-lights");l&&((s=e._config)!=null&&s.area)&&((p=e._hass)!=null&&p.callService)&&l.addEventListener("click",c=>{c.stopPropagation(),e._hass.callService("light","toggle",{},{area_id:e._config.area})});const d=t.querySelector(".status-seg-battery[data-entity]");d&&d.addEventListener("click",c=>{c.stopPropagation(),C(e,d.dataset.entity)}),t.querySelectorAll(".env-chip[data-entity]").forEach(c=>{const h=c.dataset.entity;h&&c.addEventListener("click",u=>{u.stopPropagation(),C(e,h)})}),t.querySelectorAll(".chip[data-entity]").forEach(c=>we(c,e)),Bt(t)}const Ht=500;function we(t,e){const a=t.dataset.entity,i=t.dataset.tap??"more-info";let n=null,r=!1;const o=()=>{clearTimeout(n),n=null};t.addEventListener("pointerdown",()=>{r=!1,o(),n=setTimeout(()=>{r=!0,C(e,a)},Ht)}),["pointerup","pointerleave","pointercancel"].forEach(l=>t.addEventListener(l,o)),t.addEventListener("contextmenu",l=>l.preventDefault()),t.addEventListener("click",l=>{var p;if(l.stopPropagation(),r){r=!1;return}const d=a.split(".")[0],s=(p=e._hass)==null?void 0:p.callService;i==="toggle"&&s?e._hass.callService(d,"toggle",{},{entity_id:a}):i==="trigger"&&s?e._hass.callService(d,"turn_on",{},{entity_id:a}):C(e,a)})}function Bt(t){const e=t.querySelectorAll(".chart-hit-layer circle[data-v]");if(!e.length)return;const a=t.querySelector("ha-card");let i=null,n=null;const r=(o,l)=>{o.style.left=`${parseFloat(l.getAttribute("cx"))/300*100}%`,o.style.top=`${parseFloat(l.getAttribute("cy"))/60*100}%`};e.forEach(o=>{var d;const l=(d=o.closest(".chart-hit-layer"))==null?void 0:d.classList.contains("dense");o.addEventListener("pointerenter",s=>{s.stopPropagation(),i||(i=document.createElement("div"),i.className="chart-tooltip",a.appendChild(i)),i.textContent=o.dataset.v,r(i,o),i.style.display="block",l&&(n||(n=document.createElement("div"),n.className="chart-hover-dot",a.appendChild(n)),r(n,o),n.style.display="block")}),o.addEventListener("pointerleave",s=>{s.stopPropagation(),i&&(i.style.display="none"),n&&(n.style.display="none")})})}const z=new Map,W=new Set,L=new Map,qt=2;function Rt(t){for(const e of z.keys()){const a=Number(e.slice(e.lastIndexOf(":")+1));t-a>qt&&z.delete(e)}}function Gt(t,e,a,i,n){var s;const r=(s=n==null?void 0:n._config)==null?void 0:s.debug,o=Math.floor(Date.now()/3e5),l=`${e}:${a}:${o}`;if(Rt(o),z.has(l))return r&&console.debug("[hass-omnibus-card] history cache hit",{key:l,points:z.get(l).length}),z.get(l);if(W.has(l))return r&&console.debug("[hass-omnibus-card] history fetch pending, queuing callback",{key:l}),L.get(l).set(n,i),null;if(!(t!=null&&t.callWS))return r&&console.debug("[hass-omnibus-card] history skipped — no callWS",{entityId:e}),null;r&&console.debug("[hass-omnibus-card] history fetch start",{key:l,entityId:e,hours:a}),W.add(l),L.set(l,new Map([[n,i]]));const d=new Date(Date.now()-a*36e5).toISOString();return t.callWS({type:"history/history_during_period",entity_ids:[e],start_time:d,minimal_response:!0,no_attributes:!0}).then(p=>{const c=Array.isArray(p==null?void 0:p[e])?p[e]:[],h=c.map(g=>({t:(g.lu??g.last_updated??0)*1e3,v:parseFloat(g.s??g.state)})).filter(g=>!isNaN(g.v));r&&console.debug("[hass-omnibus-card] history fetch done",{key:l,rawCount:c.length,pointCount:h.length}),z.set(l,h),W.delete(l);const u=L.get(l);L.delete(l),u==null||u.forEach(g=>g(h))}).catch(p=>{r&&console.debug("[hass-omnibus-card] history fetch error",{key:l,error:p}),z.set(l,[]),W.delete(l);const c=L.get(l);L.delete(l),c==null||c.forEach(h=>h([]))}),null}class Wt extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._stateHash=null,this._activeSection=null,this._cameraRefreshTimer=null}setConfig(e){var a,i;if(!(e!=null&&e.area)&&!((a=e==null?void 0:e.entities)!=null&&a.length))throw new Error('[hass-omnibus-card] Missing required field: "area" or "entities"');(i=this._config)!=null&&i.debug&&console.debug("[hass-omnibus-card] set config",{config:e}),this._config={...e},this._stateHash=null,this._activeSection=e.controls_collapsed===!1?"__default__":null,this._hass&&this._update(),this._startCameraRefreshTimer()}connectedCallback(){this._startCameraRefreshTimer()}disconnectedCallback(){clearInterval(this._cameraRefreshTimer)}_startCameraRefreshTimer(){var a,i,n;(a=this._config)!=null&&a.debug&&console.debug("[hass-omnibus-card] start camera refresh timer",{interval:(i=this._config)==null?void 0:i.camera_refresh_interval}),clearInterval(this._cameraRefreshTimer);const e=(n=this._config)==null?void 0:n.camera_refresh_interval;!e||e<=0||(this._cameraRefreshTimer=setInterval(()=>xe(this.shadowRoot),e*6e4))}setActiveSection(e){var a;(a=this._config)!=null&&a.debug&&console.debug("[hass-omnibus-card] set active section",{section:e}),this._activeSection=this._activeSection===e?null:e,this._update()}set hass(e){var i;if((i=this._config)!=null&&i.debug&&console.debug("[hass-omnibus-card] set hass",{hass:e}),this._hass=e,!this._config)return;const a=this._buildHash();a!==this._stateHash&&(this._stateHash=a,this._update())}getCardSize(){return 2}static getStubConfig(){return{area:"living_room",icon:"mdi:sofa"}}_buildHash(){var i,n,r,o;if(!this._hass||!this._config)return"";let e;if((i=this._config.entities)!=null&&i.length)e=this._config.entities.map(l=>{var d;return{entityId:l,state:(d=this._hass.states)==null?void 0:d[l]}}).filter(l=>l.state);else{e=de(this._hass,this._config.area);for(const l of this._config.add_entities??[])if(!e.some(d=>d.entityId===l)){const d=(n=this._hass.states)==null?void 0:n[l];d&&e.push({entityId:l,state:d})}}const a=(r=this._config.history_chart)==null?void 0:r.entity_id;if(a&&!e.some(l=>l.entityId===a)){const l=(o=this._hass.states)==null?void 0:o[a];l&&e.push({entityId:a,state:l})}return e.map(({entityId:l,state:d})=>{var s,p,c;return`${l}=${d.state}|${((s=d.attributes)==null?void 0:s.rgb_color)??""}|${((p=d.attributes)==null?void 0:p.current_temperature)??""}|${((c=d.attributes)==null?void 0:c.entity_picture)??""}`}).sort().join(";")}_update(){var n,r;let e=null;const a=(n=this._config)==null?void 0:n.history_chart;a!=null&&a.entity_id&&(e=Gt(this._hass,a.entity_id,a.hours??24,()=>this._update(),this));const i=pt(this._hass,this._config,e,this._activeSection);i.error||(this._activeSection=i.activeSection??null),(r=this._config)!=null&&r.debug&&console.debug("[hass-omnibus-card] update",{area:this._config.area,hash:this._stateHash,viewModel:i}),Dt(this.shadowRoot,this,i)}}window.customCards=window.customCards||[],window.customCards.push({type:ne,name:"Hass Omnibus Card",description:"Compact, area-based room summary with automatic entity discovery.",preview:!0}),console.info(`%c HASS-OMNIBUS-CARD %c v${Pe} `,"color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px","color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"),customElements.define(ne,Wt)})();
