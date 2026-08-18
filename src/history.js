const _cache     = new Map();
const _pending   = new Set();
const _callbacks = new Map(); // key → Map<cardRef, onDone>

/**
 * Return cached history points synchronously; kick off async fetch on miss.
 * _callbacks is a Map-of-Maps keyed by card instance — each card gets its own
 * slot so multiple cards sharing an entity all receive the callback, while
 * rapid hass updates from the same card only keep the latest callback (no flood).
 */
export function getHistory(hass, entityId, hours, onDone, cardRef) {
  const key = `${entityId}:${Math.floor(Date.now() / 300_000)}`;
  if (_cache.has(key)) return _cache.get(key);

  if (_pending.has(key)) {
    _callbacks.get(key).set(cardRef, onDone); // replace same card's old cb, keep others
    return null;
  }

  if (!hass?.callWS) return null;

  _pending.add(key);
  _callbacks.set(key, new Map([[cardRef, onDone]]));

  const start = new Date(Date.now() - hours * 3_600_000).toISOString();
  hass.callWS({
    type:             'history/history_during_period',
    entity_ids:       [entityId],
    start_time:       start,
    minimal_response: true,
    no_attributes:    true,
  }).then(data => {
    const raw    = Array.isArray(data?.[entityId]) ? data[entityId] : [];
    const points = raw.map(p => parseFloat(p.s ?? p.state)).filter(v => !isNaN(v));
    _cache.set(key, points);
    _pending.delete(key);
    const cbs = _callbacks.get(key);
    _callbacks.delete(key);
    cbs?.forEach(cb => cb(points));
  }).catch(() => {
    _pending.delete(key);
    _callbacks.delete(key);
  });

  return null;
}
