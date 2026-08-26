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
  await expect(page.locator('#mount').locator('.status-seg-problem')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('problems.png', SNAP);
});

test('problem badge — unavailable entity', async ({ page }) => {
  await mount(page, CARD, {
    'switch.outlet': { state: 'unavailable', attributes: { friendly_name: 'Outlet' } },
  });
  await expect(page.locator('#mount').locator('.status-seg-problem')).toBeVisible();
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

test('history chart — real dataset (esterno, 244 pts, thresholds + y_min)', async ({ page }) => {
  const points = [
    30.6111111111111, 30.7777777777778, 30.8888888888889, 31, 31.2222222222222, 31.2777777777778, 31.3888888888889, 31.5, 31.6111111111111, 31.8888888888889,
    31.7777777777778, 31.7222222222222, 31.6111111111111, 31.2222222222222, 31.1111111111111, 30.8888888888889, 31, 31.1111111111111, 31.2222222222222, 31.2777777777778,
    32, 32.1111111111111, 32.2222222222222, 32.2777777777778, 32.3888888888889, 32.5, 32.6111111111111, 32.7222222222222, 32.2777777777778, 32.2222222222222,
    32.1111111111111, 32, 31.8888888888889, 31.7777777777778, 31.7222222222222, 31.2777777777778, 31.2222222222222, 31.1111111111111, 31, 30.8888888888889,
    30.7222222222222, 30.6111111111111, 30.5, 30.3888888888889, 30.2777777777778, 30.2222222222222, 29.8888888888889, 29.7777777777778, 29.7222222222222, 29.6111111111111,
    29.5, 29.3888888888889, 29.2777777777778, 29.2222222222222, 29.1111111111111, 29, 28.8888888888889, 28.7777777777778, 28.7222222222222, 28.6111111111111,
    28.5, 28.3888888888889, 28.2777777777778, 28.2222222222222, 28, 27.7222222222222, 27.6111111111111, 27.5, 27.3888888888889, 27.2777777777778,
    27.2222222222222, 27.1111111111111, 27, 26.7777777777778, 26.7222222222222, 26.6111111111111, 26.5, 26.3888888888889, 26.2777777777778, 26.2222222222222,
    26.1111111111111, 26, 25.8888888888889, 25.7777777777778, 25.7222222222222, 25.6111111111111, 25.5, 25.3888888888889, 25.2777777777778, 25.3888888888889,
    25.5, 25.3888888888889, 25.2777777777778, 25.2222222222222, 25.1111111111111, 25, 24.8888888888889, 24.7777777777778, 24.7222222222222, 24.6111111111111,
    24.5, 24.3888888888889, 24.2777777777778, 24.2222222222222, 24.2777777777778, 24.2222222222222, 24.1111111111111, 24, 24.1111111111111, 24.2222222222222,
    24.1111111111111, 24, 23.8888888888889, 24, 23.8888888888889, 23.7777777777778, 23.7222222222222, 23.6111111111111, 23.5, 23.3888888888889,
    23.2777777777778, 23.2222222222222, 23.2777777777778, 23.3888888888889, 23.2777777777778, 23.2222222222222, 23.1111111111111, 23.2222222222222, 23.2777777777778, 23.2222222222222,
    23.1111111111111, 23, 22.8888888888889, 23, 22.8888888888889, 22.7777777777778, 22.7222222222222, 22.7777777777778, 22.8888888888889, 23,
    23.1111111111111, 23.2222222222222, 23.2777777777778, 23.3888888888889, 23.5, 23.6111111111111, 23.7222222222222, 23.7777777777778, 23.8888888888889, 24,
    24.1111111111111, 24.2222222222222, 24.2777777777778, 24.3888888888889, 24.5, 24.6111111111111, 24.7222222222222, 24.7777777777778, 24.8888888888889, 25,
    25.1111111111111, 25.2222222222222, 25.2777777777778, 25.3888888888889, 25.5, 25.6111111111111, 25.7222222222222, 25.7777777777778, 25.8888888888889, 26,
    26.1111111111111, 26.2222222222222, 26.2777777777778, 26.3888888888889, 26.5, 26.6111111111111, 26.7222222222222, 26.7777777777778, 26.8888888888889, 27,
    27.1111111111111, 27.2222222222222, 27.2777777777778, 27.5, 27.7222222222222, 27.8888888888889, 28, 28.1111111111111, 28.2222222222222, 28.2777777777778,
    28.3888888888889, 28.5, 28.7222222222222, 28.7777777777778, 29, 29.1111111111111, 29.2222222222222, 29.2777777777778, 29.3888888888889, 29.5,
    29.6111111111111, 29.7222222222222, 29.7777777777778, 29.8888888888889, 30, 30.1111111111111, 30.2222222222222, 30.2777777777778, 30.5, 30.6111111111111,
    30.7222222222222, 30.7777777777778, 30.8888888888889, 31, 31.1111111111111, 31.2777777777778, 31.3888888888889, 31.2777777777778, 31.3888888888889, 31.5,
    31.7222222222222, 31.7777777777778, 31.8888888888889, 32, 32.1111111111111, 32.2222222222222, 32.2777777777778, 32.5, 32.6111111111111, 32.2777777777778,
    32.5, 32.6111111111111, 32.7777777777778, 32.8888888888889, 33, 33.2222222222222, 33.2777777777778, 33.3888888888889, 33.6111111111111, 32,
    31.8888888888889, 31.7777777777778, 31.8888888888889, 32,
  ];
  await page.evaluate(pts => {
    window.BASE_HASS.callWS = msg => {
      if (msg.type === 'history/history_during_period') {
        const id = msg.entity_ids[0];
        const now = Date.now() / 1000;
        const step = (18 * 3600) / (pts.length - 1);
        return Promise.resolve({ [id]: pts.map((v, i) => ({ s: String(v), lu: now - (pts.length - 1 - i) * step })) });
      }
      return Promise.resolve({});
    };
  }, points);
  await mount(page, {
    area: 'living_room',
    history_chart: {
      entity_id: 'sensor.temperature', hours: 18,
      color: 'rgba(255,200,100,0.15)',
      threshold_high: 34, color_high: 'rgba(244,67,54,0.18)',
      threshold_low: 27.6, color_low: 'rgba(33,150,243,0.18)',
      y_min: 5,
    },
  });
  await expect(page.locator('#mount').locator('.bg-chart')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#mount')).toHaveScreenshot('history-esterno-dataset.png', SNAP);
});

// ── History chart — per-point dots, hover hit-targets, dense/sparse split ─────

test('history chart — sparse series (24 pts, default mock) shows a visible dot per point, not marked dense', async ({ page }) => {
  await mount(page, { area: 'living_room', history_chart: { entity_id: 'sensor.temperature' } });
  const chart = page.locator('#mount').locator('.bg-chart');
  await expect(chart).toBeVisible({ timeout: 2000 });
  await expect(chart.locator('circle')).toHaveCount(24);
  await expect(page.locator('#mount').locator('.chart-hit-layer')).not.toHaveClass(/dense/);
});

test('history chart — hit-layer circle exposes value+unit as data-v, no native title (avoids a duplicate browser tooltip)', async ({ page }) => {
  await mount(page, { area: 'living_room', history_chart: { entity_id: 'sensor.temperature' } });
  const firstHit = page.locator('#mount').locator('.chart-hit-layer circle').first();
  await expect(firstHit).toHaveAttribute('data-v', '20.0°C'); // i=0 → 20 + sin(0)*3, per BASE_HASS mock history
  await expect(firstHit.locator('title')).toHaveCount(0);
});

test('history chart — dense series (200 pts, past DOT_MAX_POINTS) hides per-point dots, hit-layer marked dense', async ({ page }) => {
  const points = Array.from({ length: 200 }, (_, i) => 20 + Math.sin(i / 10) * 5);
  await page.evaluate(pts => {
    window.BASE_HASS.callWS = msg => {
      if (msg.type === 'history/history_during_period') {
        const id = msg.entity_ids[0];
        const now = Date.now() / 1000;
        const step = (18 * 3600) / (pts.length - 1);
        return Promise.resolve({ [id]: pts.map((v, i) => ({ s: String(v), lu: now - (pts.length - 1 - i) * step })) });
      }
      return Promise.resolve({});
    };
  }, points);
  await mount(page, { area: 'living_room', history_chart: { entity_id: 'sensor.temperature', hours: 18 } });
  const chart = page.locator('#mount').locator('.bg-chart');
  await expect(chart).toBeVisible({ timeout: 2000 });
  await expect(chart.locator('circle')).toHaveCount(0);
  await expect(page.locator('#mount').locator('.chart-hit-layer')).toHaveClass(/dense/);
});

test('history chart — hovering a dense hit-target shows a round HTML marker dot, not a stretched SVG circle', async ({ page }) => {
  const points = Array.from({ length: 200 }, (_, i) => 20 + Math.sin(i / 10) * 5);
  await page.evaluate(pts => {
    window.BASE_HASS.callWS = msg => {
      if (msg.type === 'history/history_during_period') {
        const id = msg.entity_ids[0];
        const now = Date.now() / 1000;
        const step = (18 * 3600) / (pts.length - 1);
        return Promise.resolve({ [id]: pts.map((v, i) => ({ s: String(v), lu: now - (pts.length - 1 - i) * step })) });
      }
      return Promise.resolve({});
    };
  }, points);
  await mount(page, { area: 'living_room', history_chart: { entity_id: 'sensor.temperature', hours: 18 } });
  const hit = page.locator('#mount').locator('.chart-hit-layer circle').first();
  const marker = page.locator('#mount').locator('.chart-hover-dot');
  await expect(marker).not.toBeVisible();
  // dispatchEvent, not .hover() — at this downsampling+stretch a hit-target
  // is only ~2 real px wide, and Chromium's real pointer-movement hit-testing
  // doesn't reliably land on a target that thin even when elementFromPoint
  // says it should (confirmed independently of this change: a plain
  // getBoundingClientRect-center document.elementFromPoint check resolves to
  // the circle, but page.mouse.move to that same point never fires
  // pointerenter). That's a Chromium/SVG sub-pixel hit-testing quirk, not
  // something this test is about — dispatch the event directly to test our
  // own listener logic instead of fighting the platform's pixel-hunting.
  await hit.dispatchEvent('pointerenter');
  // the SVG hit-target itself stays transparent — the accent dot is now a
  // sibling HTML element, immune to the chart's non-uniform SVG stretch
  await expect(hit).toHaveCSS('fill', 'rgba(0, 0, 0, 0)');
  await expect(marker).toBeVisible();
  await hit.dispatchEvent('pointerleave');
  await expect(marker).not.toBeVisible();
});

test('history chart — hovering a sparse series\' hit-target does NOT show the dense marker dot (already has its own always-visible dot)', async ({ page }) => {
  await mount(page, { area: 'living_room', history_chart: { entity_id: 'sensor.temperature' } });
  const hit = page.locator('#mount').locator('.chart-hit-layer circle').first();
  await hit.dispatchEvent('pointerenter');
  await expect(page.locator('#mount').locator('.chart-hover-dot')).toHaveCount(0);
  await expect(page.locator('#mount').locator('.chart-tooltip')).toBeVisible();
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
  await expect(page.locator('#mount').locator('.status-seg-battery')).not.toBeVisible();
});

test('battery — low badge appears at/below default threshold (20%), chip still shown', async ({ page }) => {
  await mount(page, { area: 'living_room', entities: ['sensor.battery_test'] }, {
    'sensor.battery_test': { state: '15', attributes: { friendly_name: 'Battery Test', device_class: 'battery', unit_of_measurement: '%' } },
  });
  await expect(page.locator('#mount').locator('.status-seg-battery')).toBeVisible();
  await expect(page.locator('#mount').locator('.status-seg-battery > span')).toHaveText('15%');
  // .chip alone would also match the header's status-cluster wrapper (it reuses
  // the .chip/.group-chip pill styling, same as weather/ptz) — scope to actual
  // entity chips only.
  await expect(page.locator('#mount').locator('.chip[data-entity]')).toHaveCount(1);
});

test('battery — custom battery_low_threshold respected', async ({ page }) => {
  await mount(page, { area: 'living_room', entities: ['sensor.battery_test'], battery_low_threshold: 50 }, {
    'sensor.battery_test': { state: '45', attributes: { friendly_name: 'Battery Test', device_class: 'battery', unit_of_measurement: '%' } },
  });
  await expect(page.locator('#mount').locator('.status-seg-battery')).toBeVisible();
});

test('battery — unavailable sensor counted as problem, not battery chip', async ({ page }) => {
  await mount(page, { area: 'living_room', entities: ['sensor.battery_test'] }, {
    'sensor.battery_test': { state: 'unavailable', attributes: { friendly_name: 'Battery Test', device_class: 'battery', unit_of_measurement: '%' } },
  });
  await expect(page.locator('#mount').locator('.status-seg-problem')).toBeVisible();
  await expect(page.locator('#mount').locator('.status-seg-battery')).not.toBeVisible();
  await expect(page.locator('#mount').locator('.chip[data-entity]')).toHaveCount(0);
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

test('camera — refresh button changes the img src (cache-busts) without opening more-info', async ({ page }) => {
  await mount(page, GARAGE);
  const preview = page.locator('#mount').locator('.camera-preview');
  const img = preview.locator('img');
  const srcBefore = await img.getAttribute('src');

  let moreInfoFired = false;
  await page.evaluate(() => {
    document.addEventListener('hass-more-info', () => { window.__moreInfoFired = true; }, { once: true });
  });

  await preview.locator('.camera-refresh-btn').click();
  await expect(img).not.toHaveAttribute('src', srcBefore);
  await expect(img).toHaveAttribute('src', /_refresh=/);
  moreInfoFired = await page.evaluate(() => !!window.__moreInfoFired);
  expect(moreInfoFired).toBe(false);
});

test('camera_refresh_interval — auto-refreshes the snapshot on a timer', async ({ page }) => {
  await page.clock.install();
  await mount(page, { ...GARAGE, camera_refresh_interval: 5 });
  const img = page.locator('#mount').locator('.camera-preview img');
  const srcBefore = await img.getAttribute('src');

  await page.clock.fastForward('05:00');
  await expect(img).not.toHaveAttribute('src', srcBefore);
  await expect(img).toHaveAttribute('src', /_refresh=/);
});

test('camera_refresh_interval unset — snapshot src stays stable over time (no auto-refresh)', async ({ page }) => {
  await page.clock.install();
  await mount(page, GARAGE);
  const img = page.locator('#mount').locator('.camera-preview img');
  const srcBefore = await img.getAttribute('src');

  await page.clock.fastForward('30:00');
  await expect(img).toHaveAttribute('src', srcBefore);
});

// ── Camera controls group ───────────────────────────────────────────────────

test('controls — siren/button in Controls; device-linked switch/lock in Settings; PTZ buttons form their own group', async ({ page }) => {
  await mount(page, GARAGE);
  // ptz_up + ptz_down grouped into their own pill; reboot button + siren
  // ("press to act") grouped into controls-chip; switch/lock ("configure")
  // grouped into settings-chip — not one shared pill of 4.
  await expect(page.locator('#mount').locator('.controls-chip .control-seg')).toHaveCount(2); // reboot button + siren
  await expect(page.locator('#mount').locator('.settings-chip .settings-seg')).toHaveCount(2); // IR-light switch + housing lock
  await expect(page.locator('#mount').locator('.settings-seg[data-domain="lock"]')).toBeVisible();
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
  await page.locator('#mount').locator('.settings-seg[data-domain="lock"]').click();
  expect(await moreInfo).toBe('lock.garage_cam_housing');
});

test('controls — read-only sensor/image sharing the camera device stay out of controls, grouped as diagnostics', async ({ page }) => {
  // real ezviz camera device exposes ip/alarm-code sensors and a motion snapshot image
  // alongside the actual switches/buttons — neither is operable, so the device-link
  // sweep must not pull them into Controls. Two or more of them group into their
  // own diagnostics pill (same pattern as weather/controls) instead of two plain chips.
  await mount(page, GARAGE);
  await expect(page.locator('#mount').locator('.diagnostics-chip')).toBeVisible();
  for (const entityId of ['sensor.garage_cam_ip', 'image.garage_cam_snapshot']) {
    const seg = page.locator('#mount').locator(`.diagnostics-seg[data-entity="${entityId}"]`);
    await expect(seg).toBeVisible();
    await expect(page.locator('#mount').locator(`.control-seg[data-entity="${entityId}"]`)).toHaveCount(0);
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

test('re-render with a focused multi-class element (e.g. badge-lights "off") does not throw', async ({ page }) => {
  // regression: className "badge badge-lights off " (trailing space when
  // has-offline is empty) split into a trailing empty token, producing the
  // invalid selector `.badge.badge-lights.off.` in the focus-restore code.
  const errors = [];
  page.on('pageerror', err => errors.push(err));

  await mount(page, CARD, {
    'light.ceiling':    { state: 'off', attributes: { friendly_name: 'Ceiling' } },
    'light.floor_lamp': { state: 'off', attributes: { friendly_name: 'Floor Lamp' } },
  });

  const badge = page.locator('#mount').locator('.badge-lights');
  await badge.focus();

  // force a re-render while the badge is focused. Re-setting `hass` with
  // unchanged state is a no-op (hash guard), so drive render() through
  // toggleSectionCollapsed() instead — same _update()/render() path, no
  // hash check to work around.
  await page.evaluate(() => {
    document.querySelector('hass-omnibus-card').toggleSectionCollapsed('controls');
  });

  expect(errors).toEqual([]);
  await expect(badge).toBeFocused();
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

// ── Settings / Diagnostics — collapsible like Controls, independently ──────

test('settings — collapsed by default, toggle icon shown, same as Controls', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20 });
  const label = page.locator('#mount').locator('.group-label-settings.clickable');
  await expect(label.locator('.group-toggle')).toHaveAttribute('icon', 'mdi:chevron-down');
  await expect(page.locator('#mount').locator('.settings-chip')).not.toBeVisible();
});

test('diagnostics — collapsed by default, toggle icon shown, same as Controls', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20 });
  const label = page.locator('#mount').locator('.group-label-diagnostics.clickable');
  await expect(label.locator('.group-toggle')).toHaveAttribute('icon', 'mdi:chevron-down');
  await expect(page.locator('#mount').locator('.diagnostics-chip')).not.toBeVisible();
});

test('settings/diagnostics — clicking one label expands only that section', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20 });
  await page.locator('#mount').locator('.group-label-settings.clickable').click();
  await expect(page.locator('#mount').locator('.settings-chip')).toBeVisible();
  await expect(page.locator('#mount').locator('.diagnostics-chip')).not.toBeVisible();
  await expect(page.locator('#mount').locator('.controls-chips')).not.toBeVisible();
});

test('settings/diagnostics — collapsing Controls does not collapse an already-expanded Settings', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20, controls_collapsed: false }); // all three start expanded
  await expect(page.locator('#mount').locator('.settings-chip')).toBeVisible();
  await page.locator('#mount').locator('.controls-label.clickable').click(); // collapse Controls only
  await expect(page.locator('#mount').locator('.controls-chips')).not.toBeVisible();
  await expect(page.locator('#mount').locator('.settings-chip')).toBeVisible();
  await expect(page.locator('#mount').locator('.diagnostics-chip')).toBeVisible();
});

test('controls_collapsed: false starts Settings and Diagnostics expanded too (shared config)', async ({ page }) => {
  await mount(page, { area: 'garage', max_entities: 20, controls_collapsed: false });
  await expect(page.locator('#mount').locator('.settings-chip')).toBeVisible();
  await expect(page.locator('#mount').locator('.diagnostics-chip')).toBeVisible();
  await expect(page.locator('#mount').locator('.group-label-settings .group-toggle')).toHaveAttribute('icon', 'mdi:chevron-up');
});

test('collapsible_controls: false hides Settings/Diagnostics toggles too and always shows them', async ({ page }) => {
  await mount(page, GARAGE); // GARAGE sets collapsible_controls: false
  await expect(page.locator('#mount').locator('.group-label-settings.clickable')).toHaveCount(0);
  await expect(page.locator('#mount').locator('.settings-chip')).toBeVisible();
  await expect(page.locator('#mount').locator('.diagnostics-chip')).toBeVisible();
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
  const badge = page.locator('#mount').locator('.status-seg-update');
  await expect(badge).toBeVisible();
  await expect(badge).toHaveAttribute('data-entity', 'update.garage_cam_firmware');
  await expect(page.locator('#mount').locator('.chip[data-entity="update.garage_cam_firmware"]')).toHaveCount(0);
});

test('update badge — no badge when no update is pending', async ({ page }) => {
  await mount(page, GARAGE, {
    'update.garage_cam_firmware': { state: 'off', attributes: { friendly_name: 'Garage Cam Firmware' } },
  });
  await expect(page.locator('#mount').locator('.status-seg-update')).not.toBeVisible();
});

test('update badge — click opens more-info', async ({ page }) => {
  await mount(page, GARAGE);
  const moreInfo = page.evaluate(() => new Promise(resolve => {
    document.addEventListener('hass-more-info', e => resolve(e.detail.entityId), { once: true });
  }));
  await page.locator('#mount').locator('.status-seg-update').click();
  expect(await moreInfo).toBe('update.garage_cam_firmware');
});

test('update badge — unavailable update entity counts as a problem, not silently dropped', async ({ page }) => {
  await mount(page, GARAGE, {
    'update.garage_cam_firmware': { state: 'unavailable', attributes: { friendly_name: 'Garage Cam Firmware' } },
  });
  await expect(page.locator('#mount').locator('.status-seg-update')).not.toBeVisible();
  await expect(page.locator('#mount').locator('.chip[data-entity="update.garage_cam_firmware"]')).toHaveCount(0);
  await expect(page.locator('#mount').locator('.status-seg-problem')).toBeVisible();
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
  await expect(page.locator('#mount').locator('.weather-chip .weather-seg')).toHaveCount(5);
  await expect(page.locator('#mount').locator('.chip[data-entity="sensor.garage_wind"]:not(.weather-seg)')).toHaveCount(0); // not also a plain chip

  const iconFor = entityId => page.locator('#mount').locator(`.weather-seg[data-entity="${entityId}"] ha-icon`).getAttribute('icon');
  expect(await iconFor('sensor.garage_wind')).toBe('mdi:weather-windy');
  expect(await iconFor('sensor.garage_wind_max')).toBe('mdi:weather-windy-variant'); // same device_class, gust icon keyed off entity_id suffix
  expect(await iconFor('sensor.garage_rain')).toBe('mdi:weather-rainy');
  expect(await iconFor('sensor.garage_illuminance')).toBe('mdi:brightness-6');
  expect(await iconFor('sensor.garage_noise')).toBe('mdi:volume-high');

  const dcFor = entityId => page.locator('#mount').locator(`.weather-seg[data-entity="${entityId}"]`).getAttribute('data-dc');
  expect(await dcFor('sensor.garage_wind')).toBe('wind_speed');
  expect(await dcFor('sensor.garage_wind_max')).toBe('wind_speed');
  expect(await dcFor('sensor.garage_rain')).toBe('precipitation');
  expect(await dcFor('sensor.garage_illuminance')).toBe('illuminance');
  expect(await dcFor('sensor.garage_noise')).toBe('sound_pressure');

  await expect(page.locator('#mount').locator('.weather-seg[data-entity="sensor.garage_wind"] .group-seg-value')).toHaveText('2.5 km/h');
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
  await page.locator('#mount').locator('.control-seg[data-domain="button"]').click();
  const calls = await page.evaluate(() => window.__serviceCalls);
  expect(calls).toEqual([{ domain: 'button', service: 'press', data: {}, target: { entity_id: 'button.garage_cam_reboot' } }]);
});

test('controls — siren click toggles siren service, not more-info', async ({ page }) => {
  await mount(page, GARAGE);
  await page.locator('#mount').locator('.control-seg[data-domain="siren"]').click();
  const calls = await page.evaluate(() => window.__serviceCalls);
  expect(calls).toEqual([{ domain: 'siren', service: 'toggle', data: {}, target: { entity_id: 'siren.garage_alarm' } }]);
});

test('controls — device-linked switch (Settings) click opens more-info (no dedicated switch service)', async ({ page }) => {
  await mount(page, GARAGE);
  const moreInfo = page.evaluate(() => new Promise(resolve => {
    document.addEventListener('hass-more-info', e => resolve(e.detail.entityId), { once: true });
  }));
  await page.locator('#mount').locator('.settings-seg[data-domain="switch"]').click();
  expect(await moreInfo).toBe('switch.garage_cam_ir_light');
});

// ── Real-world dataset (EZVIZ camera + Bresser weather station) ────────────
// Modeled directly on a production debug log — see tests/unit/discovery.test.js
// for the same shape tested at the classify() level. Nine operable entities
// (siren, 5 switches, a number, 2 selects) share one camera device: this is
// the real-world case the controls-grouping restyle needs to hold up under.
const ESTERNO_REAL = { area: 'esterno' };

test('real dataset — Italian PTZ buttons render with correct compass directions', async ({ page }) => {
  await mount(page, ESTERNO_REAL);
  const byDir = dir => page.locator('#mount').locator(`.ptz-seg[data-direction="${dir}"]`);
  await expect(byDir('up')).toHaveAttribute('data-entity', 'button.esterno_cb8c_bh2113803_ptz_su');
  await expect(byDir('down')).toHaveAttribute('data-entity', 'button.esterno_cb8c_bh2113803_ptz_giu');
  await expect(byDir('left')).toHaveAttribute('data-entity', 'button.esterno_cb8c_bh2113803_ptz_sinistra');
  await expect(byDir('right')).toHaveAttribute('data-entity', 'button.esterno_cb8c_bh2113803_ptz_destra');
});

test('real dataset — siren alone in Controls ("press to act"); 5 switches + number + 2 selects grouped into Settings ("configure")', async ({ page }) => {
  await mount(page, ESTERNO_REAL);
  await page.locator('#mount').locator('.controls-label.clickable').click(); // expand (collapsed by default)
  await expect(page.locator('#mount').locator('.controls-chip .control-seg')).toHaveCount(1);
  await expect(page.locator('#mount').locator('.settings-chip .settings-seg')).toHaveCount(8);
});

test('real dataset — camera diagnostic sensors/binary_sensor/image group into one diagnostics pill, not controls', async ({ page }) => {
  await mount(page, ESTERNO_REAL);
  await page.locator('#mount').locator('.group-label-diagnostics.clickable').click(); // expand (collapsed by default, like Controls)
  await expect(page.locator('#mount').locator('.diagnostics-chip')).toBeVisible();
  for (const entityId of [
    'binary_sensor.esterno_cb8c_bh2113803_crittografia_2',
    'sensor.esterno_cb8c_bh2113803_ip_locale_2',
    'sensor.esterno_cb8c_bh2113803_stato_pir_2',
    'image.esterno_cb8c_bh2113803_ultima_immagine_motion',
  ]) {
    await expect(page.locator('#mount').locator(`.diagnostics-seg[data-entity="${entityId}"]`)).toBeVisible();
  }
  await expect(page.locator('#mount').locator('.control-seg[data-entity="binary_sensor.esterno_cb8c_bh2113803_crittografia_2"]')).toHaveCount(0);
});

test('real dataset — Bresser weather station groups 5 readings into one weather chip', async ({ page }) => {
  await mount(page, ESTERNO_REAL);
  await expect(page.locator('#mount').locator('.weather-chip')).toHaveCount(1);
  await expect(page.locator('#mount').locator('.weather-chip .weather-seg')).toHaveCount(5); // wind avg + max, rain, luminance, noise
});

test('real dataset — full card snapshot', async ({ page }) => {
  await mount(page, { ...ESTERNO_REAL, collapsible_controls: false });
  await expect(page.locator('#mount').locator('.controls-chip')).toBeVisible();
  await expect(page.locator('#mount')).toHaveScreenshot('real-dataset-esterno.png', SNAP);
});
