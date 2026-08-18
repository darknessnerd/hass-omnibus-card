const _cache     = new Map();
const _pending   = new Set();
const _callbacks = new Map(); // key → Set<onDone> for in-flight de-dup

/**
 * Return cached history points synchronously; kick off async fetch on miss.
 * Multiple callers waiting on the same key all receive onDone when the single
 * fetch resolves — prevents duplicate requests while ensuring every card re-renders.
 */
export function getHistory(hass, entityId, hours, onDone) {
  const key = `${entityId}:${Math.floor(Date.now() / 300_000)}`;
  if (_cache.has(key)) return _cache.get(key);

  if (_pending.has(key)) {
    _callbacks.get(key).add(onDone);
    return null;
  }

  if (!hass?.callWS) return null;

  _pending.add(key);
  _callbacks.set(key, new Set([onDone]));

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
