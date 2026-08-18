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

test('lights off — no badge, no rgb tint', async ({ page }) => {
  await mount(page, CARD, {
    'light.ceiling':    { state: 'off', attributes: { friendly_name: 'Ceiling' } },
    'light.floor_lamp': { state: 'off', attributes: { friendly_name: 'Floor Lamp' } },
  });
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

test('not occupied — no dot', async ({ page }) => {
  await mount(page, CARD, {
    'binary_sensor.motion': { state: 'off', attributes: { friendly_name: 'Motion', device_class: 'motion' } },
  });
  await expect(page.locator('#mount').locator('.occupancy-dot')).not.toBeVisible();
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

test('include_entities — entity from outside area pinned', async ({ page }) => {
  // sensor.bed_humidity (bedroom, 72%) + sensor.humidity (living_room, 52%) → avg 62%
  await mount(page, { area: 'living_room', include_entities: ['sensor.bed_humidity'] });
  await expect(page.locator('#mount').locator('.env-chip.hum > span')).toHaveText('62%');
  await expect(page.locator('#mount')).toHaveScreenshot('include-entity.png', SNAP);
});
