export const CARD_TAG     = 'hass-omnibus-card';
export const CARD_VERSION = __VERSION__;

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
  window:       { on: 'mdi:window-open',  off: 'mdi:window-closed' },
  lock:         { on: 'mdi:lock-open',    off: 'mdi:lock' },
  vibration:    'mdi:vibrate',
  plug:         'mdi:power-plug',
  presence:     'mdi:home-account',
  power:        'mdi:flash',
  energy:       'mdi:lightning-bolt',
  battery:      { on: 'mdi:battery-alert', off: 'mdi:battery' },
  connectivity: 'mdi:wifi',
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
};
