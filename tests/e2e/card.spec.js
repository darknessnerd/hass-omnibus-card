import { test, expect } from '@playwright/test';

const FIXTURE = '/tests/fixture.html';
const CARD    = { area: 'living_room' };
const SNAP    = { maxDiffPixels: 5 };   // allow ≤5px anti-aliasing drift

async function mount(page, config, stateOverrides) {
  await page.evaluate(
    ({ cfg, overrides }) => window.mountCard(cfg, overrides),
    { cfg: config, overrides: stateOverrides ?? null },
  );
  // card renders synchronously; one rAF ensures Shadow DOM is painted
  await page.waitForFunction(() => !!document.querySelector('hass-omnibus-card')?.shadowRoot?.querySelector('ha-card'));
}

test.beforeEach(async ({ page }) => {
  await page.goto(FIXTURE);
});

// ── Normal states ─────────────────────────────────────────────────────────────

test('normal — lights on, temp, humidity, motion, climate, chip strip', async ({ page }) => {
  await mount(page, CARD);
  await expect(page.locator('#mount')).toHaveScreenshot('normal.png', SNAP);
});

test('lights off — grey badge, no rgb tint', async ({ page }) => {
  await mount(page, CARD, {
    'light.ceiling':    { state: 'off', attributes: { friendly_name: 'Ceiling' } },
    'light.floor_lamp': { state: 'off', attributes: { friendly_name: 'Floor Lamp' } },
  });
  await expect(page.locator('#mount').locator('.badge-lights.off')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('lights-off.png', SNAP);
});

test('single light on — badge without count number', async ({ page }) => {
  await mount(page, CARD, {
    'light.floor_lamp': { state: 'off', attributes: { friendly_name: 'Floor Lamp' } },
  });
  await expect(page.locator('#mount')).toHaveScreenshot('single-light.png', SNAP);
});

test('multiple lights on — badge shows count', async ({ page }) => {
  await mount(page, CARD);  // both ceiling + floor lamp are on in BASE_HASS
  const badge = page.locator('#mount').getByTitle(/lights on/);
  await expect(badge).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('multi-lights.png', SNAP);
});

// ── Occupancy ─────────────────────────────────────────────────────────────────

test('occupied — green dot visible', async ({ page }) => {
  await mount(page, CARD);
  await expect(page.locator('#mount').locator('.occupancy-dot')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('occupied.png', SNAP);
});

test('not occupied — grey dot', async ({ page }) => {
  await mount(page, CARD, {
    'binary_sensor.motion': { state: 'off', attributes: { friendly_name: 'Motion', device_class: 'motion' } },
  });
  await expect(page.locator('#mount').locator('.occupancy-dot.idle')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('not-occupied.png', SNAP);
});

// ── Alarms ────────────────────────────────────────────────────────────────────

test('smoke alarm — alarm bar with smoke badge', async ({ page }) => {
  await mount(page, CARD, {
    'binary_sensor.smoke': { state: 'on', attributes: { friendly_name: 'Smoke', device_class: 'smoke' } },
  });
  await expect(page.locator('#mount').locator('.alarm-smoke')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('alarm-smoke.png', SNAP);
});

test('gas alarm — alarm bar with gas badge', async ({ page }) => {
  await mount(page, CARD, {
    'binary_sensor.gas': { state: 'on', attributes: { friendly_name: 'Gas', device_class: 'gas' } },
  });
  await expect(page.locator('#mount').locator('.alarm-gas')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('alarm-gas.png', SNAP);
});

test('water alarm — alarm bar with water badge', async ({ page }) => {
  await mount(page, CARD, {
    'binary_sensor.water': { state: 'on', attributes: { friendly_name: 'Water', device_class: 'moisture' } },
  });
  await expect(page.locator('#mount').locator('.alarm-water')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('alarm-water.png', SNAP);
});

test('all alarms — smoke + gas + water simultaneously', async ({ page }) => {
  await mount(page, CARD, {
    'binary_sensor.smoke': { state: 'on', attributes: { friendly_name: 'Smoke', device_class: 'smoke' } },
    'binary_sensor.gas':   { state: 'on', attributes: { friendly_name: 'Gas',   device_class: 'gas' } },
    'binary_sensor.water': { state: 'on', attributes: { friendly_name: 'Water', device_class: 'moisture' } },
  });
  await expect(page.locator('#mount')).toHaveScreenshot('alarm-all.png', SNAP);
});

// ── Mold risk ─────────────────────────────────────────────────────────────────

test('mold risk — humidity above default threshold (70%)', async ({ page }) => {
  await mount(page, CARD, {
    'sensor.humidity': { state: '75', attributes: { friendly_name: 'Humidity', device_class: 'humidity', unit_of_measurement: '%' } },
  });
  await expect(page.locator('#mount').locator('.alarm-mold')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('mold-risk.png', SNAP);
});

test('mold risk — custom threshold respected', async ({ page }) => {
  await mount(page, { area: 'living_room', mold_threshold: 50 }, {
    'sensor.humidity': { state: '55', attributes: { friendly_name: 'Humidity', device_class: 'humidity', unit_of_measurement: '%' } },
  });
  await expect(page.locator('#mount').locator('.alarm-mold')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('mold-custom-threshold.png', SNAP);
});

// ── Problems ──────────────────────────────────────────────────────────────────

test('problem badge — problem binary_sensor on', async ({ page }) => {
  await mount(page, CARD, {
    'binary_sensor.problem': { state: 'on', attributes: { friendly_name: 'Problem sensor', device_class: 'problem' } },
  });
  await expect(page.locator('#mount').locator('.badge-problems')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('problems.png', SNAP);
});

test('problem badge — unavailable entity', async ({ page }) => {
  await mount(page, CARD, {
    'switch.outlet': { state: 'unavailable', attributes: { friendly_name: 'Outlet' } },
  });
  await expect(page.locator('#mount').locator('.badge-problems')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('unavailable-entity.png', SNAP);
});

// ── Climate ───────────────────────────────────────────────────────────────────

test('climate heat mode', async ({ page }) => {
  await mount(page, CARD);   // BASE_HASS has climate.hvac in heat mode
  await expect(page.locator('#mount').locator('.env-chip.climate')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('climate-heat.png', SNAP);
});

test('climate cool mode', async ({ page }) => {
  await mount(page, CARD, {
    'climate.hvac': { state: 'cool', attributes: { friendly_name: 'HVAC', current_temperature: 23.0 } },
  });
  await expect(page.locator('#mount')).toHaveScreenshot('climate-cool.png', SNAP);
});

test('climate off', async ({ page }) => {
  await mount(page, CARD, {
    'climate.hvac': { state: 'off', attributes: { friendly_name: 'HVAC' } },
  });
  await expect(page.locator('#mount')).toHaveScreenshot('climate-off.png', SNAP);
});

// ── Environmental sensors ─────────────────────────────────────────────────────

test('no environmental sensors — env row hidden', async ({ page }) => {
  await mount(page, CARD, {
    'sensor.temperature': { state: 'unavailable', attributes: { friendly_name: 'Temperature', device_class: 'temperature', unit_of_measurement: '°C' } },
    'sensor.humidity':    { state: 'unavailable', attributes: { friendly_name: 'Humidity',    device_class: 'humidity',    unit_of_measurement: '%' } },
    'climate.hvac':       { state: 'unavailable', attributes: { friendly_name: 'HVAC' } },
  });
  await expect(page.locator('#mount').locator('.env-row')).not.toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('no-env.png', SNAP);
});

// ── Entity chips ──────────────────────────────────────────────────────────────

test('entity chips — show_entities true (default)', async ({ page }) => {
  await mount(page, CARD);
  await expect(page.locator('#mount').locator('.entity-chips')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('chips-visible.png', SNAP);
});

test('entity chips — show_entities false', async ({ page }) => {
  await mount(page, { area: 'living_room', show_entities: false });
  await expect(page.locator('#mount').locator('.entity-chips')).not.toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('chips-hidden.png', SNAP);
});

test('entity chips — active chip has on class', async ({ page }) => {
  await mount(page, CARD, {
    'media_player.tv': { state: 'on', attributes: { friendly_name: 'TV' } },
  });
  await expect(page.locator('#mount')).toHaveScreenshot('chips-active.png', SNAP);
});

// ── Navigation ────────────────────────────────────────────────────────────────

test('navigable card — has clickable class', async ({ page }) => {
  await mount(page, { area: 'living_room', navigate_to: '/lovelace/1' });
  await expect(page.locator('#mount').locator('ha-card')).toHaveClass(/clickable/);
  await expect(page.locator('#mount')).toHaveScreenshot('navigable.png', SNAP);
});

test('non-navigable card — no clickable class', async ({ page }) => {
  await mount(page, CARD);
  await expect(page.locator('#mount').locator('ha-card')).not.toHaveClass(/clickable/);
});

// ── Error state ───────────────────────────────────────────────────────────────

test('error — area not found', async ({ page }) => {
  await mount(page, { area: 'nonexistent_area' });
  await expect(page.locator('#mount').locator('.error-card')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('error-area-not-found.png', SNAP);
});

test('error — area not found but name override provided', async ({ page }) => {
  await mount(page, { area: 'nonexistent_area', name: 'My Room' });
  // name override suppresses error; card renders with provided name
  await expect(page.locator('#mount').locator('.error-card')).not.toBeVisible();
  await expect(page.locator('#mount').locator('.room-name')).toHaveText('My Room');
  await expect(page.locator('#mount')).toHaveScreenshot('name-override.png', SNAP);
});

// ── Config options ────────────────────────────────────────────────────────────

test('custom icon via config', async ({ page }) => {
  await mount(page, { area: 'living_room', icon: 'mdi:sofa-outline' });
  await expect(page.locator('#mount')).toHaveScreenshot('custom-icon.png', SNAP);
});

test('custom name via config', async ({ page }) => {
  await mount(page, { area: 'living_room', name: 'Soggiorno' });
  await expect(page.locator('#mount').locator('.room-name')).toHaveText('Soggiorno');
  await expect(page.locator('#mount')).toHaveScreenshot('custom-name.png', SNAP);
});

test('max_entities limits chip count', async ({ page }) => {
  await mount(page, { area: 'living_room', max_entities: 1 });
  const chips = page.locator('#mount').locator('.chip');
  await expect(chips).toHaveCount(1);
  await expect(page.locator('#mount')).toHaveScreenshot('max-entities-1.png', SNAP);
});

// ── Entity filtering ──────────────────────────────────────────────────────────

test('exclude_entities — classified entity removed', async ({ page }) => {
  await mount(page, { area: 'living_room', exclude_entities: ['binary_sensor.motion'] });
  await expect(page.locator('#mount').locator('.occupancy-dot')).not.toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('exclude-classified.png', SNAP);
});

test('exclude_entities — chip-strip entity removed', async ({ page }) => {
  await mount(page, { area: 'living_room', exclude_entities: ['switch.outlet'] });
  const chips = page.locator('#mount').locator('.chip');
  await expect(chips).toHaveCount(2);
  await expect(page.locator('#mount')).toHaveScreenshot('exclude-chip.png', SNAP);
});

test('add_entities — entity from outside area pinned', async ({ page }) => {
  // sensor.bed_humidity (bedroom, 72%) + sensor.humidity (living_room, 52%) → avg 62%
  await mount(page, { area: 'living_room', add_entities: ['sensor.bed_humidity'] });
  await expect(page.locator('#mount').locator('.env-chip.hum > span')).toHaveText('62%');
  await expect(page.locator('#mount')).toHaveScreenshot('add-entity.png', SNAP);
});

test('entities — whitelist overrides area discovery', async ({ page }) => {
  // living_room has lights, motion, climate, etc — whitelist to only temp sensor
  await mount(page, { area: 'living_room', entities: ['sensor.temperature'] });
  await expect(page.locator('#mount').locator('.badge-lights')).not.toBeVisible();
  await expect(page.locator('#mount').locator('.occupancy-dot')).not.toBeVisible();
  await expect(page.locator('#mount').locator('.env-chip.temp')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('entities-whitelist.png', SNAP);
});

// ── History chart ─────────────────────────────────────────────────────────────

test('history chart — svg rendered when history_chart configured', async ({ page }) => {
  await mount(page, { area: 'living_room', history_chart: { entity_id: 'sensor.temperature' } });
  // callWS returns Promise.resolve — microtask fires before first poll
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
});

test('history chart — absent when history_chart not configured', async ({ page }) => {
  await mount(page, CARD);
  await expect(page.locator('#mount').locator('.bg-chart')).not.toBeVisible();
});

test('history chart — gradient thresholds both high and low', async ({ page }) => {
  await mount(page, {
    area: 'living_room',
    history_chart: { entity_id: 'sensor.temperature', threshold_high: 22, threshold_low: 18 },
  });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#mount')).toHaveScreenshot('history-gradient-thresholds.png', SNAP);
});

test('history chart — high threshold only', async ({ page }) => {
  await mount(page, {
    area: 'living_room',
    history_chart: { entity_id: 'sensor.temperature', threshold_high: 22 },
  });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#mount')).toHaveScreenshot('history-high-threshold.png', SNAP);
});

// ── History chart — Y axis bounds ────────────────────────────────────────────

test('history chart — flat data (all identical) without y_min hides sparkline', async ({ page }) => {
  // Override callWS to return 2 identical points — simulates brand-new sensor
  await page.evaluate(() => {
    window.BASE_HASS.callWS = msg => {
      if (msg.type === 'history/history_during_period') {
        const id = msg.entity_ids[0];
        return Promise.resolve({ [id]: [{ s: '29.4', lu: 1 }, { s: '29.4', lu: 2 }] });
      }
      return Promise.resolve({});
    };
  });
  await mount(page, { area: 'living_room', history_chart: { entity_id: 'sensor.temperature' } });
  await page.waitForTimeout(200);
  await expect(page.locator('#mount').locator('.bg-chart')).not.toBeVisible();
});

test('history chart — flat data with y_min: 0 shows sparkline', async ({ page }) => {
  await page.evaluate(() => {
    window.BASE_HASS.callWS = msg => {
      if (msg.type === 'history/history_during_period') {
        const id = msg.entity_ids[0];
        return Promise.resolve({ [id]: [{ s: '29.4', lu: 1 }, { s: '29.4', lu: 2 }] });
      }
      return Promise.resolve({});
    };
  });
  await mount(page, { area: 'living_room', history_chart: { entity_id: 'sensor.temperature', y_min: 0 } });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
});

test('history chart — y_min: 0 anchors scale floor', async ({ page }) => {
  await mount(page, {
    area: 'living_room',
    history_chart: { entity_id: 'sensor.temperature', y_min: 0 },
  });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#mount')).toHaveScreenshot('history-y-min-0.png', SNAP);
});

test('history chart — y_min and y_max both set', async ({ page }) => {
  await mount(page, {
    area: 'living_room',
    history_chart: { entity_id: 'sensor.temperature', y_min: 0, y_max: 40 },
  });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#mount')).toHaveScreenshot('history-y-min-max.png', SNAP);
});

// ── History chart overlay labels ──────────────────────────────────────────────

test('history chart overlay — stat-max/min show ↑/↓ prefixes', async ({ page }) => {
  await mount(page, { area: 'living_room', history_chart: { entity_id: 'sensor.temperature' } });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#mount').locator('.stat-max')).toContainText(/^↑\s/);
  await expect(page.locator('#mount').locator('.stat-min')).toContainText(/^↓\s/);
});

test('history chart overlay — threshold_high label visible and shows value', async ({ page }) => {
  await mount(page, {
    area: 'living_room',
    history_chart: { entity_id: 'sensor.temperature', threshold_high: 22 },
  });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
  const label = page.locator('#mount').locator('.chart-threshold');
  await expect(label).toHaveCount(1);
  await expect(label).toContainText('22.0°C');
});

test('history chart overlay — both threshold labels rendered when high and low set', async ({ page }) => {
  await mount(page, {
    area: 'living_room',
    history_chart: { entity_id: 'sensor.temperature', threshold_high: 22, threshold_low: 18 },
  });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#mount').locator('.chart-threshold')).toHaveCount(2);
});

test('history chart overlay — no threshold labels without thresholds configured', async ({ page }) => {
  await mount(page, { area: 'living_room', history_chart: { entity_id: 'sensor.temperature' } });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#mount').locator('.chart-threshold')).toHaveCount(0);
});

test('history chart overlay — threshold outside data range suppresses label', async ({ page }) => {
  // sensor.temperature data oscillates ~17-23°C — 100 is far outside range → yPct <= 0
  await mount(page, {
    area: 'living_room',
    history_chart: { entity_id: 'sensor.temperature', threshold_high: 100 },
  });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#mount').locator('.chart-threshold')).toHaveCount(0);
});

// ── Debug mode ────────────────────────────────────────────────────────────────

test('debug: true — console.debug fires on render', async ({ page }) => {
  const debugMessages = [];
  page.on('console', msg => { if (msg.type() === 'debug') debugMessages.push(msg.text()); });
  await mount(page, { area: 'living_room', debug: true });
  expect(debugMessages.some(m => m.includes('[hass-omnibus-card]'))).toBe(true);
});

test('debug: false (default) — no console.debug', async ({ page }) => {
  const debugMessages = [];
  page.on('console', msg => { if (msg.type() === 'debug') debugMessages.push(msg.text()); });
  await mount(page, CARD);
  expect(debugMessages.filter(m => m.includes('[hass-omnibus-card]'))).toHaveLength(0);
});

// ── Battery badge ─────────────────────────────────────────────────────────────

test('battery — chip shown, no low badge when above threshold', async ({ page }) => {
  await mount(page, { area: 'living_room', entities: ['sensor.battery_test'] });
  await expect(page.locator('#mount').locator('.chip')).toHaveCount(1);
  await expect(page.locator('#mount').locator('.badge-battery')).not.toBeVisible();
});

test('battery — low badge appears at/below default threshold (20%), chip still shown', async ({ page }) => {
  await mount(page, { area: 'living_room', entities: ['sensor.battery_test'] }, {
    'sensor.battery_test': { state: '15', attributes: { friendly_name: 'Battery Test', device_class: 'battery', unit_of_measurement: '%' } },
  });
  await expect(page.locator('#mount').locator('.badge-battery')).toBeVisible();
  await expect(page.locator('#mount').locator('.badge-battery > span')).toHaveText('15%');
  await expect(page.locator('#mount').locator('.chip')).toHaveCount(1);
});

test('battery — custom battery_low_threshold respected', async ({ page }) => {
  await mount(page, { area: 'living_room', entities: ['sensor.battery_test'], battery_low_threshold: 50 }, {
    'sensor.battery_test': { state: '45', attributes: { friendly_name: 'Battery Test', device_class: 'battery', unit_of_measurement: '%' } },
  });
  await expect(page.locator('#mount').locator('.badge-battery')).toBeVisible();
});

test('battery — unavailable sensor counted as problem, not battery chip', async ({ page }) => {
  await mount(page, { area: 'living_room', entities: ['sensor.battery_test'] }, {
    'sensor.battery_test': { state: 'unavailable', attributes: { friendly_name: 'Battery Test', device_class: 'battery', unit_of_measurement: '%' } },
  });
  await expect(page.locator('#mount').locator('.badge-problems')).toBeVisible();
  await expect(page.locator('#mount').locator('.badge-battery')).not.toBeVisible();
  await expect(page.locator('#mount').locator('.chip')).toHaveCount(0);
});

// ── Light badge enhancements ───────────────────────────────────────────────

test('lights off — badge has .off class', async ({ page }) => {
  await mount(page, CARD, {
    'light.ceiling':    { state: 'off', attributes: { friendly_name: 'Ceiling' } },
    'light.floor_lamp': { state: 'off', attributes: { friendly_name: 'Floor Lamp' } },
  });
  await expect(page.locator('#mount').locator('.badge-lights.off')).toBeVisible();
});

test('offline light — badge has .has-offline class', async ({ page }) => {
  await mount(page, CARD, {
    'light.ceiling': { state: 'unavailable', attributes: { friendly_name: 'Ceiling' } },
  });
  await expect(page.locator('#mount').locator('.badge-lights.has-offline')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('lights-offline.png', SNAP);
});

// ── Occupancy enhancements ─────────────────────────────────────────────────

test('not occupied — idle dot visible', async ({ page }) => {
  await mount(page, CARD, {
    'binary_sensor.motion': { state: 'off', attributes: { friendly_name: 'Motion', device_class: 'motion' } },
  });
  await expect(page.locator('#mount').locator('.occupancy-dot.idle')).toBeVisible();
});

// ── Camera preview ──────────────────────────────────────────────────────────

// max_entities raised — the garage fixture models a real multi-entity camera device
// (ptz/switches/sensors/image/update) plus a weather station; default cap (6) would
// clip chips these tests need to assert on. Cap behavior itself is tested elsewhere.
// collapsible_controls: false keeps the Controls row expanded (no chevron, unaffected
// pixels) for tests written before the section became collapsible — dedicated tests
// below cover the toggle icon and the new collapsed-by-default behavior.
const GARAGE = { area: 'garage', max_entities: 20, collapsible_controls: false };

test('camera — preview image rendered, recording dot visible', async ({ page }) => {
  await mount(page, GARAGE);
  const preview = page.locator('#mount').locator('.camera-preview');
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute('data-entity', 'camera.garage_cam');
  await expect(preview.locator('img')).toHaveAttribute('src', /camera_proxy/);
  await expect(preview.locator('.camera-rec-dot')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('camera-preview.png', SNAP);
});

test('camera — no camera entity means no preview', async ({ page }) => {
  await mount(page, CARD);
  await expect(page.locator('#mount').locator('.camera-preview')).not.toBeVisible();
});

test('camera — show_camera: false hides preview even with camera entity', async ({ page }) => {
  await mount(page, { ...GARAGE, show_camera: false });
  await expect(page.locator('#mount').locator('.camera-preview')).not.toBeVisible();
});

test('camera — click opens more-info', async ({ page }) => {
  await mount(page, GARAGE);
  const moreInfo = page.evaluate(() => new Promise(resolve => {
    document.addEventListener('hass-more-info', e => resolve(e.detail.entityId), { once: true });
  }));
  await page.locator('#mount').locator('.camera-preview').click();
  expect(await moreInfo).toBe('camera.garage_cam');
});

// ── Camera controls group ───────────────────────────────────────────────────

test('controls — siren, generic button, device-linked switch/lock pulled in; PTZ buttons form their own group', async ({ page }) => {
  await mount(page, GARAGE);
  // ptz_up + ptz_down are grouped into one ptz-chip; reboot/siren/switch/lock stay individual control-chips
  const controls = page.locator('#mount').locator('.controls-chips .control-chip:not(.ptz-chip)');
  await expect(controls).toHaveCount(4); // reboot button + siren + IR-light switch + housing lock
  await expect(page.locator('#mount').locator('.control-chip[data-domain="lock"]')).toBeVisible();
  await expect(page.locator('#mount').locator('.ptz-chip .ptz-seg')).toHaveCount(2);
  await expect(page.locator('#mount')).toHaveScreenshot('camera-controls.png', SNAP);
});

test('controls — PTZ segment click presses the specific direction button', async ({ page }) => {
  await mount(page, GARAGE);
  await page.locator('#mount').locator('.ptz-seg[data-direction="up"]').click();
  const calls = await page.evaluate(() => window.__serviceCalls);
  expect(calls).toEqual([{ domain: 'button', service: 'press', data: {}, target: { entity_id: 'button.garage_cam_ptz_up' } }]);
});

test('controls — PTZ segment click falls back to more-info when callService is unavailable', async ({ page }) => {
  await mount(page, GARAGE);
  await page.evaluate(() => { document.querySelector('hass-omnibus-card')._hass.callService = null; });
  const moreInfo = page.evaluate(() => new Promise(resolve => {
    document.addEventListener('hass-more-info', e => resolve(e.detail.entityId), { once: true });
  }));
  await page.locator('#mount').locator('.ptz-seg[data-direction="up"]').click();
  expect(await moreInfo).toBe('button.garage_cam_ptz_up');
});

test('controls — device-linked lock click opens more-info (generic fallback, no lock-specific service)', async ({ page }) => {
  await mount(page, GARAGE);
  const moreInfo = page.evaluate(() => new Promise(resolve => {
    document.addEventListener('hass-more-info', e => resolve(e.detail.entityId), { once: true });
  }));
  await page.locator('#mount').locator('.control-chip[data-domain="lock"]').click();
  expect(await moreInfo).toBe('lock.garage_cam_housing');
});

test('controls — read-only sensor/image sharing the camera device stay chips, not controls', async ({ page }) => {
  // real ezviz camera device exposes ip/alarm-code sensors and a motion snapshot image
  // alongside the actual switches/buttons — neither is operable, so the device-link
  // sweep must not pull them into Controls
  await mount(page, GARAGE);
  for (const entityId of ['sensor.garage_cam_ip', 'image.garage_cam_snapshot']) {
    const chip = page.locator('#mount').locator(`.chip[data-entity="${entityId}"]`);
    await expect(chip).toBeVisible();
    await expect(chip).not.toHaveClass(/control-chip/);
  }
});

test('controls — label is keyboard-focusable and toggles on Enter/Space', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20 });
  const label = page.locator('#mount').locator('.controls-label.clickable');
  const chips = page.locator('#mount').locator('.controls-chips');

  await expect(label).toHaveAttribute('role', 'button');
  await expect(label).toHaveAttribute('tabindex', '0');

  await label.focus();
  await page.keyboard.press('Enter');
  await expect(chips).toBeVisible();

  await page.keyboard.press(' ');
  await expect(chips).not.toBeVisible();
});

test('controls — collapsed by default, toggle icon shown', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20 });
  await expect(page.locator('#mount').locator('.controls-toggle')).toBeVisible();
  await expect(page.locator('#mount').locator('.controls-toggle')).toHaveAttribute('icon', 'mdi:chevron-down');
  await expect(page.locator('#mount').locator('.controls-chips')).not.toBeVisible();
});

test('controls — clicking the "Controls" label text expands and re-collapses the chip strip', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20 });
  const label = page.locator('#mount').locator('.controls-label.clickable');
  const toggle = page.locator('#mount').locator('.controls-toggle');
  const chips  = page.locator('#mount').locator('.controls-chips');

  // click the label text itself, not the chevron icon
  await label.click({ position: { x: 4, y: 4 } });
  await expect(chips).toBeVisible();
  await expect(toggle).toHaveAttribute('icon', 'mdi:chevron-up');

  await label.click({ position: { x: 4, y: 4 } });
  await expect(chips).not.toBeVisible();
  await expect(toggle).toHaveAttribute('icon', 'mdi:chevron-down');
});

test('controls — clicking the chevron icon also toggles (bubbles to the label)', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20 });
  const toggle = page.locator('#mount').locator('.controls-toggle');
  const chips  = page.locator('#mount').locator('.controls-chips');

  await toggle.click();
  await expect(chips).toBeVisible();
  await expect(toggle).toHaveAttribute('icon', 'mdi:chevron-up');
});

test('controls — controls_collapsed: false starts the section expanded', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20, controls_collapsed: false });
  await expect(page.locator('#mount').locator('.controls-chips')).toBeVisible();
  await expect(page.locator('#mount').locator('.controls-toggle')).toHaveAttribute('icon', 'mdi:chevron-up');
});

test('controls — collapsible_controls: false hides the toggle icon and always shows chips', async ({ page }) => {
  await mount(page, GARAGE);   // GARAGE sets collapsible_controls: false
  await expect(page.locator('#mount').locator('.controls-toggle')).not.toBeVisible();
  await expect(page.locator('#mount').locator('.controls-chips')).toBeVisible();
});

test('controls — label click does not trigger card navigation', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20, navigate_to: '/lovelace/garage' });
  let navigated = false;
  await page.exposeFunction('__onNavigate', () => { navigated = true; });
  await page.evaluate(() => {
    window.addEventListener('location-changed', () => window.__onNavigate());
  });
  await page.locator('#mount').locator('.controls-label.clickable').click({ position: { x: 4, y: 4 } });
  expect(navigated).toBe(false);
});

// ── Firmware update badge ────────────────────────────────────────────────────

test('update badge — firmware update available renders header badge, not a plain chip', async ({ page }) => {
  await mount(page, GARAGE);
  const badge = page.locator('#mount').locator('.badge-update');
  await expect(badge).toBeVisible();
  await expect(badge).toHaveAttribute('data-entity', 'update.garage_cam_firmware');
  await expect(page.locator('#mount').locator('.chip[data-entity="update.garage_cam_firmware"]')).toHaveCount(0);
});

test('update badge — no badge when no update is pending', async ({ page }) => {
  await mount(page, GARAGE, {
    'update.garage_cam_firmware': { state: 'off', attributes: { friendly_name: 'Garage Cam Firmware' } },
  });
  await expect(page.locator('#mount').locator('.badge-update')).not.toBeVisible();
});

test('update badge — click opens more-info', async ({ page }) => {
  await mount(page, GARAGE);
  const moreInfo = page.evaluate(() => new Promise(resolve => {
    document.addEventListener('hass-more-info', e => resolve(e.detail.entityId), { once: true });
  }));
  await page.locator('#mount').locator('.badge-update').click();
  expect(await moreInfo).toBe('update.garage_cam_firmware');
});

test('update badge — unavailable update entity counts as a problem, not silently dropped', async ({ page }) => {
  await mount(page, GARAGE, {
    'update.garage_cam_firmware': { state: 'unavailable', attributes: { friendly_name: 'Garage Cam Firmware' } },
  });
  await expect(page.locator('#mount').locator('.badge-update')).not.toBeVisible();
  await expect(page.locator('#mount').locator('.chip[data-entity="update.garage_cam_firmware"]')).toHaveCount(0);
  await expect(page.locator('#mount').locator('.badge-problems')).toBeVisible();
});

// ── Camera edge cases ────────────────────────────────────────────────────────

test('camera — second camera in the same area falls back to a chip, not lost', async ({ page }) => {
  await mount(page, GARAGE);
  await expect(page.locator('#mount').locator('.camera-preview')).toHaveAttribute('data-entity', 'camera.garage_cam');
  await expect(page.locator('#mount').locator('.chip[data-entity="camera.garage_cam_2"]')).toBeVisible();
});

test('camera — unavailable camera dims the preview and marks it offline', async ({ page }) => {
  await mount(page, GARAGE, {
    'camera.garage_cam': { state: 'unavailable', attributes: { friendly_name: 'Garage Cam', entity_picture: '/api/camera_proxy/camera.garage_cam?token=abc' } },
  });
  const preview = page.locator('#mount').locator('.camera-preview');
  await expect(preview).toHaveClass(/offline/);
  await expect(preview).toHaveAttribute('title', /offline/);
  await expect(preview.locator('.camera-rec-dot')).not.toBeVisible();
});

// ── Weather sensor icons ─────────────────────────────────────────────────────

test('weather sensors — grouped into one weather-chip, dedicated device_class icons + values', async ({ page }) => {
  await mount(page, GARAGE);
  await expect(page.locator('#mount').locator('.weather-chip')).toHaveCount(1);
  await expect(page.locator('#mount').locator('.weather-chip .weather-seg')).toHaveCount(4);
  await expect(page.locator('#mount').locator('.chip[data-entity="sensor.garage_wind"]:not(.weather-seg)')).toHaveCount(0); // not also a plain chip

  const iconFor = entityId => page.locator('#mount').locator(`.weather-seg[data-entity="${entityId}"] ha-icon`).getAttribute('icon');
  expect(await iconFor('sensor.garage_wind')).toBe('mdi:weather-windy');
  expect(await iconFor('sensor.garage_rain')).toBe('mdi:weather-rainy');
  expect(await iconFor('sensor.garage_illuminance')).toBe('mdi:brightness-6');
  expect(await iconFor('sensor.garage_noise')).toBe('mdi:volume-high');

  await expect(page.locator('#mount').locator('.weather-seg[data-entity="sensor.garage_wind"] .group-seg-value')).toHaveText('2.5km/h');
});

test('weather-chip segment click opens more-info', async ({ page }) => {
  await mount(page, GARAGE);
  const moreInfo = page.evaluate(() => new Promise(resolve => {
    document.addEventListener('hass-more-info', e => resolve(e.detail.entityId), { once: true });
  }));
  await page.locator('#mount').locator('.weather-seg[data-entity="sensor.garage_wind"]').click();
  expect(await moreInfo).toBe('sensor.garage_wind');
});

test('controls — generic (non-PTZ) button click presses button service, not more-info', async ({ page }) => {
  await mount(page, GARAGE);
  await page.locator('#mount').locator('.control-chip[data-domain="button"]').click();
  const calls = await page.evaluate(() => window.__serviceCalls);
  expect(calls).toEqual([{ domain: 'button', service: 'press', data: {}, target: { entity_id: 'button.garage_cam_reboot' } }]);
});

test('controls — siren click toggles siren service, not more-info', async ({ page }) => {
  await mount(page, GARAGE);
  await page.locator('#mount').locator('.control-chip[data-domain="siren"]').click();
  const calls = await page.evaluate(() => window.__serviceCalls);
  expect(calls).toEqual([{ domain: 'siren', service: 'toggle', data: {}, target: { entity_id: 'siren.garage_alarm' } }]);
});

test('controls — device-linked switch click opens more-info (no dedicated switch service)', async ({ page }) => {
  await mount(page, GARAGE);
  const moreInfo = page.evaluate(() => new Promise(resolve => {
    document.addEventListener('hass-more-info', e => resolve(e.detail.entityId), { once: true });
  }));
  await page.locator('#mount').locator('.control-chip[data-domain="switch"]').click();
  expect(await moreInfo).toBe('switch.garage_cam_ir_light');
});
