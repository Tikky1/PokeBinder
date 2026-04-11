const CACHE = 'pokebinder-v10';
const PRECACHE = ['./index.html', './search.html', './img.png', './manifest.json'];

/* ── Install: sadece kritik dosyaları önceden cache'le ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

/* ── Activate: eski cache'leri temizle ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── Fetch: cache-first, yoksa network'ten al ve cache'e ekle ── */
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  /* Sadece GET isteklerini handle et */
  if (req.method !== 'GET') return;

  /* PokeAPI ve harici kaynaklar — network-first, hata varsa cache */
  if (url.hostname !== self.location.hostname &&
      !url.hostname.includes('fonts.gstatic.com') &&
      !url.hostname.includes('fonts.googleapis.com')) {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  /* Yerel dosyalar (data/*.json, img/**, index.html) + Google Fonts — cache-first */
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => new Response('', { status: 503 }));
    })
  );
});
