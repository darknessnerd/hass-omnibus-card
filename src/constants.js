export const CARD_TAG     = 'hass-omnibus-card';
// __VERSION__ is injected by Vite's `define` at build/dev-serve time (vite.config.js);
// bare-node contexts (e.g. `node --test`) never define it, so fall back to 'dev'.
export const CARD_VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'dev';

export const ACTIVE_STATES = new Set(['on', 'open', 'playing', 'home', 'unlocked']);

export const CLIMATE_MAP = {
  heat:      ['mdi:fire',             '#ef6c00'],
  cool:      ['mdi:snowflake',         '#0288d1'],
  auto:      ['mdi:thermostat-auto',   '#43a047'],
  dry:       ['mdi:water-off-outline', '#f9a825'],
  fan_only:  ['mdi:fan',               '#546e7a'],
  heat_cool: ['mdi:fire-circle',       '#e64a19'],
  off:       ['mdi:thermostat-off',    'var(--secondary-text-color)'],
};

// icon can be a string (state-independent) or { on, off } (state-dependent)
export const ICON_BY_DC = {
  motion:       'mdi:motion-sensor',
  door:         { on: 'mdi:door-open',    off: 'mdi:door-closed' },
  // Zigbee contact sensors (e.g. SONOFF SNZB-04P) commonly report device_class
  // "opening" rather than "door" — same on/off semantics, same icon.
  opening:      { on: 'mdi:door-open',    off: 'mdi:door-closed' },
  window:       { on: 'mdi:window-open',  off: 'mdi:window-closed' },
  garage_door:  { on: 'mdi:garage-open',  off: 'mdi:garage' },
  lock:         { on: 'mdi:lock-open',    off: 'mdi:lock' },
  tamper:       { on: 'mdi:shield-alert', off: 'mdi:shield-check-outline' },
  vibration:    'mdi:vibrate',
  plug:         'mdi:power-plug',
  presence:     'mdi:home-account',
  power:        'mdi:flash',
  energy:       'mdi:lightning-bolt',
  battery:      { on: 'mdi:battery-alert', off: 'mdi:battery' },
  connectivity: 'mdi:wifi',
  wind_speed:    'mdi:weather-windy',
  precipitation: 'mdi:weather-rainy',
  illuminance:   'mdi:brightness-6',
  sound_pressure:'mdi:volume-high',
  voltage:       'mdi:flash-triangle-outline',
  // media_player device_class — distinguishes a TV from a plain speaker/receiver
  // instead of every media_player sharing the one generic play/pause icon.
  tv:            'mdi:television',
  speaker:       'mdi:speaker',
  receiver:      'mdi:audio-video',
};

// wind_speed covers both the running average and gust/max readings — same device_class,
// so entityIcon() swaps this icon in by entity_id suffix to keep the two segments distinct.
export const WIND_GUST_ICON = 'mdi:weather-windy-variant';

// Icon tint per weather device_class — same treatment as temp/humidity chips,
// so a glance at the pill tells wind apart from rain/light/sound without reading text.
export const WEATHER_DC_COLOR = {
  wind_speed:     '#546e7a',
  precipitation:  '#0288d1',
  illuminance:    '#f9a825',
  sound_pressure: '#8e24aa',
};

export const ICON_BY_DOMAIN = {
  switch:         { on: 'mdi:toggle-switch',         off: 'mdi:toggle-switch-off-outline' },
  cover:          { on: 'mdi:blinds-open',            off: 'mdi:blinds' },
  fan:            { on: 'mdi:fan',                    off: 'mdi:fan-off' },
  media_player:   { on: 'mdi:play-circle',            off: 'mdi:multimedia' },
  input_boolean:  { on: 'mdi:check-circle-outline',   off: 'mdi:close-circle-outline' },
  binary_sensor:  { on: 'mdi:radiobox-marked',        off: 'mdi:radiobox-blank' },
  automation:     'mdi:robot',
  script:         'mdi:script-text',
  person:         'mdi:account',
  device_tracker: 'mdi:map-marker',
  sensor:         'mdi:eye',
  input_select:   'mdi:format-list-bulleted',
  siren:          { on: 'mdi:bullhorn', off: 'mdi:bullhorn-outline' },
  button:         'mdi:gesture-tap-button',
  camera:         'mdi:cctv',
  remote:         'mdi:remote',
  lock:           { on: 'mdi:lock-open-variant', off: 'mdi:lock' },
  vacuum:         'mdi:robot-vacuum',
  humidifier:     { on: 'mdi:air-humidifier', off: 'mdi:air-humidifier-off' },
  water_heater:   'mdi:water-boiler',
  valve:          { on: 'mdi:valve-open', off: 'mdi:valve-closed' },
  number:         'mdi:ray-vertex',
  select:         'mdi:format-list-bulleted',
  text:           'mdi:form-textbox',
  scene:          'mdi:palette',
  timer:          'mdi:timer-outline',
  alarm_control_panel: 'mdi:shield-home-outline',
};

export const PTZ_ICON = {
  up:    'mdi:arrow-up-bold',
  down:  'mdi:arrow-down-bold',
  left:  'mdi:arrow-left-bold',
  right: 'mdi:arrow-right-bold',
};
