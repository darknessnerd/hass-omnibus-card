const _cache     = new Map();
const _pending   = new Set();
const _callbacks = new Map(); // key → Map<cardRef, onDone>

// Cache keys carry the 5-minute bucket they were fetched in (see `key` below) —
// once a bucket is more than a couple of steps stale, nothing will ever hit it
// again (the next fetch always lands in the *current* bucket), so it's pure
// leaked memory on a long-running wall-tablet tab. Swept opportunistically on
// every call rather than on a timer, since there's no lifecycle hook to hang one off.
const _MAX_STALE_BUCKETS = 2;

function _pruneStale(currentBucket) {
  for (const key of _cache.keys()) {
    const bucket = Number(key.slice(key.lastIndexOf(':') + 1));
    if (currentBucket - bucket > _MAX_STALE_BUCKETS) _cache.delete(key);
  }
}

/**
 * Return cached history points synchronously; kick off async fetch on miss.
 * _callbacks is a Map-of-Maps keyed by card instance — each card gets its own
 * slot so multiple cards sharing an entity all receive the callback, while
 * rapid hass updates from the same card only keep the latest callback (no flood).
 */
export function getHistory(hass, entityId, hours, onDone, cardRef) {
  const debug  = cardRef?._config?.debug;
  const bucket = Math.floor(Date.now() / 300_000);
  const key    = `${entityId}:${hours}:${bucket}`;
  _pruneStale(bucket);
  if (_cache.has(key)) {
    if (debug) console.debug('[hass-omnibus-card] history cache hit', { key, points: _cache.get(key).length });
    return _cache.get(key);
  }

  if (_pending.has(key)) {
    if (debug) console.debug('[hass-omnibus-card] history fetch pending, queuing callback', { key });
    _callbacks.get(key).set(cardRef, onDone); // replace same card's old cb, keep others
    return null;
  }

  if (!hass?.callWS) {
    if (debug) console.debug('[hass-omnibus-card] history skipped — no callWS', { entityId });
    return null;
  }

  if (debug) console.debug('[hass-omnibus-card] history fetch start', { key, entityId, hours });
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
    // Keep the timestamp (`lu`, epoch seconds) alongside each value — on-change
    // sensors report unevenly (bursts vs. overnight gaps), so the chart needs
    // real elapsed time per point, not just array order, to avoid distorting
    // the trend shape it's supposed to show.
    const points = raw
      .map(p => ({ t: (p.lu ?? p.last_updated ?? 0) * 1000, v: parseFloat(p.s ?? p.state) }))
      .filter(p => !isNaN(p.v));
    if (debug) console.debug('[hass-omnibus-card] history fetch done', { key, rawCount: raw.length, pointCount: points.length });
    _cache.set(key, points);
    _pending.delete(key);
    const cbs = _callbacks.get(key);
    _callbacks.delete(key);
    cbs?.forEach(cb => cb(points));
  }).catch(err => {
    if (debug) console.debug('[hass-omnibus-card] history fetch error', { key, error: err });
    // Cache an empty result rather than leaving the key un-cached — otherwise
    // getHistory keeps returning null (its "still loading" signal) forever,
    // and the chart stays silently blank instead of surfacing the "no data"
    // state a card can actually render.
    _cache.set(key, []);
    _pending.delete(key);
    const cbs = _callbacks.get(key);
    _callbacks.delete(key);
    cbs?.forEach(cb => cb([]));
  });

  return null;
}
