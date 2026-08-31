/**
 * DOM layer — writes the rendered card into the shadow root and binds event
 * listeners. The only module that touches the DOM directly; templates.js
 * stays pure (ViewModel) → HTML string, viewModel.js stays pure hass/config → ViewModel.
 */

import { renderCard, renderErrorCard } from './templates.js';
import { fireMoreInfo, navigate }      from './events.js';

/**
 * Writes the card HTML into shadowRoot and binds event listeners.
 * Called once per state change that passes the hash guard.
 *
 * @param {ShadowRoot} shadowRoot
 * @param {HTMLElement} host  - the custom element (for fireMoreInfo dispatch)
 * @param {object}      vm    - view model from buildViewModel()
 */
export function render(shadowRoot, host, vm) {
  const focusedClass = shadowRoot.activeElement?.className;
  shadowRoot.innerHTML = vm.error ? renderErrorCard(vm.error) : renderCard(vm);
  if (!vm.error) {
    bindEvents(shadowRoot, host, vm);
    hideOverlappingThresholdLabels(shadowRoot);
  }
  // full innerHTML rewrite drops focus every render — restore it for keyboard users
  // toggling a section tab, otherwise a second Enter/Space press is lost
  if (focusedClass) shadowRoot.querySelector(`.${focusedClass.trim().split(/\s+/).join('.')}`)?.focus();
}

// entity_picture URLs are stable per state — the browser will happily serve
// a cached response for the exact same URL, so a refresh has to change the
// URL to force a real re-fetch. Doesn't call any HA service; camera_proxy
// ignores unknown query params and serves the current frame. Shared by the
// manual refresh button and the camera_refresh_interval auto-refresh timer.
export function refreshCameraImage(shadowRoot) {
  const img = shadowRoot.querySelector('.camera-preview img');
  if (!img) return;
  const url = new URL(img.getAttribute('src'), window.location.href);
  url.searchParams.set('_refresh', Date.now());
  img.src = url.pathname + url.search;
}

// .chart-threshold labels position via top:X% of the WHOLE card (the chart is
// a full-height background layer, see sparkline.js) with no awareness of
// where .card-content's actual rows land — on a short card (no camera, few
// chips) a threshold near the data's mid-range can land right on top of a
// chip/header row. Chip rows are semi-transparent, so the label's opaque
// pill bleeds through and garbles the chip's text instead of just sitting
// unread behind it. Only a real DOM measurement (post-paint) can know where
// content rows actually fall, so this runs as a layout pass after innerHTML
// is written — the dashed guide line (drawn in the SVG background layer, a
// separate element) is untouched, only the floating text pill is hidden.
function hideOverlappingThresholdLabels(shadowRoot) {
  const labels = shadowRoot.querySelectorAll('.chart-threshold');
  if (!labels.length) return;
  const contentBlocks = [...shadowRoot.querySelectorAll('.card-content > *')]
    .map(el => el.getBoundingClientRect())
    .filter(r => r.width > 0 && r.height > 0);
  const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  labels.forEach(label => {
    const labelRect = label.getBoundingClientRect();
    if (contentBlocks.some(block => overlaps(labelRect, block))) label.style.display = 'none';
  });
}

function bindEvents(shadowRoot, host, { navPath, chipItems }) {
  if (navPath) {
    shadowRoot.querySelector('ha-card').addEventListener('click', e => {
      if (!e.target.closest('.chip') && !e.target.closest('.env-chip')
          && !e.target.closest('.badge-lights') && !e.target.closest('.status-seg-battery')
          && !e.target.closest('.status-seg-update') && !e.target.closest('.camera-preview')
          && !e.target.closest('.section-tab')) navigate(navPath);
    });
  }

  // Every interactive element carries role="button"/"tab" + tabindex="0" in
  // its template; this one delegated listener turns Enter/Space into a click
  // for all of them instead of a bespoke keydown handler per element type.
  shadowRoot.querySelectorAll('[role="button"][tabindex], [role="tab"][tabindex]').forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      e.stopPropagation();
      el.click();
    });
  });

  // Device tabs — mutually exclusive; clicking the active tab again closes
  // it (back to no panel shown).
  shadowRoot.querySelectorAll('.section-tab[data-section]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      host.setActiveSection(el.dataset.section);
    });
  });

  shadowRoot.querySelectorAll('.ptz-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      if (host._hass?.callService) host._hass.callService('button', 'press', {}, { entity_id: el.dataset.entity });
      else fireMoreInfo(host, el.dataset.entity);
    });
  });

  shadowRoot.querySelectorAll('.weather-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });

  shadowRoot.querySelectorAll('.opening-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });

  shadowRoot.querySelectorAll('.tamper-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });

  shadowRoot.querySelectorAll('.diagnostics-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });

  const updateBadge = shadowRoot.querySelector('.status-seg-update[data-entity]');
  if (updateBadge) updateBadge.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, updateBadge.dataset.entity); });

  const cameraPreview = shadowRoot.querySelector('.camera-preview[data-entity]');
  if (cameraPreview) cameraPreview.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, cameraPreview.dataset.entity); });

  const cameraRefreshBtn = shadowRoot.querySelector('.camera-refresh-btn');
  if (cameraRefreshBtn) {
    cameraRefreshBtn.addEventListener('click', e => {
      e.stopPropagation();
      refreshCameraImage(shadowRoot);
    });
  }

  shadowRoot.querySelectorAll('.control-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const entityId = el.dataset.entity;
      const domain    = el.dataset.domain;
      if (domain === 'button' && host._hass?.callService) {
        host._hass.callService('button', 'press', {}, { entity_id: entityId });
      } else if (domain === 'siren' && host._hass?.callService) {
        host._hass.callService('siren', 'toggle', {}, { entity_id: entityId });
      } else {
        fireMoreInfo(host, entityId);
      }
    });
  });

  shadowRoot.querySelectorAll('.settings-seg[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });

  const lightBadge = shadowRoot.querySelector('.badge-lights');
  if (lightBadge && host._config?.area && host._hass?.callService) {
    lightBadge.addEventListener('click', e => {
      e.stopPropagation();
      host._hass.callService('light', 'toggle', {}, { area_id: host._config.area });
    });
  }

  const batteryBadge = shadowRoot.querySelector('.status-seg-battery[data-entity]');
  if (batteryBadge) batteryBadge.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, batteryBadge.dataset.entity); });

  shadowRoot.querySelectorAll('.env-chip[data-entity]').forEach(el => {
    const eid = el.dataset.entity;
    if (eid) el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, eid); });
  });

  shadowRoot.querySelectorAll('.chip[data-entity]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); fireMoreInfo(host, el.dataset.entity); });
  });

  bindChartTooltip(shadowRoot);
}

// Native SVG <title> tooltips only fire on desktop hover — dead on touch,
// which is most real Home Assistant dashboard usage. pointerenter/pointerleave
// cover both: a mouse hover fires enter-on-arrival/leave-on-departure, and a
// touch tap fires enter-on-contact/leave-on-lift, so one pair of listeners
// drives the value pill (and, for dense series, a round marker dot) for both.
//
// The marker is a plain HTML element, not an SVG circle — a circle drawn
// inside .bg-chart/.chart-hit-layer (stretched via preserveAspectRatio="none")
// renders as an ellipse whenever the card's real aspect ratio strays from the
// chart's native 300:60, which on a tall/narrow card shows up as an ugly thin
// vertical needle instead of a dot. Positioned by percentage from the
// circle's own viewBox coordinates (0-300 / 0-60), which map 1:1 to percent
// since the chart layers always stretch to fill the card exactly.
function bindChartTooltip(shadowRoot) {
  const circles = shadowRoot.querySelectorAll('.chart-hit-layer circle[data-v]');
  if (!circles.length) return;

  const card = shadowRoot.querySelector('ha-card');
  let tooltipEl = null, dotEl = null;

  const positionAt = (el, circle) => {
    el.style.left = `${(parseFloat(circle.getAttribute('cx')) / 300) * 100}%`;
    el.style.top  = `${(parseFloat(circle.getAttribute('cy')) / 60) * 100}%`;
  };

  circles.forEach(circle => {
    // Sparse series already carry their own always-visible, series-colored
    // dot (see sparklineSvg's `dot`) — showing the accent marker on top of
    // it too would read as an unrelated color glitch, so the marker is
    // dense-only; the value pill still shows for both.
    const dense = circle.closest('.chart-hit-layer')?.classList.contains('dense');

    circle.addEventListener('pointerenter', e => {
      e.stopPropagation();
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'chart-tooltip';
        card.appendChild(tooltipEl);
      }
      tooltipEl.textContent = circle.dataset.v;
      positionAt(tooltipEl, circle);
      tooltipEl.style.display = 'block';

      if (dense) {
        if (!dotEl) {
          dotEl = document.createElement('div');
          dotEl.className = 'chart-hover-dot';
          card.appendChild(dotEl);
        }
        positionAt(dotEl, circle);
        dotEl.style.display = 'block';
      }
    });

    circle.addEventListener('pointerleave', e => {
      e.stopPropagation();
      if (tooltipEl) tooltipEl.style.display = 'none';
      if (dotEl) dotEl.style.display = 'none';
    });
  });
}
