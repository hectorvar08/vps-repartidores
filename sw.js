// Guarda la app en el cel para que abra aunque no haya señal.
// Al cambiar algo de la app, sube el número de VERSION para que los celulares bajen lo nuevo.
var VERSION = 'vps-ventas-1';
var ARCHIVOS = ['./', 'index.html', 'manifest.json', 'icono-180.png', 'icono-192.png', 'icono-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(ARCHIVOS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;   // las ventas van directo a Google
  // La página: primero intenta la nueva (si hay señal rápido), si no, la guardada.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      Promise.race([
        fetch(e.request).then(function (r) {
          var copia = r.clone(); caches.open(VERSION).then(function (c) { c.put('index.html', copia); }); return r;
        }),
        new Promise(function (_, no) { setTimeout(no, 3000); })
      ]).catch(function () { return caches.match('index.html', { ignoreSearch: true }); })
    );
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || fetch(e.request); }));
});
