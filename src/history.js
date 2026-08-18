const _cache   = new Map();
const _pending = new Set();

/**
 * Return cached history points synchronously; kick off async fetch on miss.
 * onDone is called once with points[] when the fetch resolves.
 * Returns null on cache miss or when callWS is unavailable.
 */
export function getHistory(hass, entityId, hours, onDone) {
  const key = `${entityId}:${Math.floor(Date.now() / 300_000)}`;
  if (_cache.has(key))  return _cache.get(key);
  if (_pending.has(key)) return null;
  if (!hass?.callWS)    return null;

  _pending.add(key);
  const start = new Date(Date.now() - hours * 3_600_000).toISOString();
  hass.callWS({
    type:             'history/history_during_period',
    entity_ids:       [entityId],
    start_time:       start,
    minimal_response: true,
    no_attributes:    true,
  }).then(data => {
    const raw    = data?.[entityId] ?? [];
    const points = raw.map(p => parseFloat(p.s)).filter(v => !isNaN(v));
    _cache.set(key, points);
    _pending.delete(key);
    onDone(points);
  }).catch(() => {
    _pending.delete(key);
  });

  return null;
}
