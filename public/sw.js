const CACHE_NAME = "offline-notes-v5";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const scope = self.registration.scope;
      const indexUrl = new URL("index.html", scope);

      const response = await fetch(indexUrl);
      const html = await response.text();

      const resources = [
        indexUrl.toString(),
        new URL("manifest.webmanifest", scope).toString(),
      ];

      // Find JS and CSS files from the built index.html
      const matches = html.matchAll(
        /(?:src|href)="([^"]+)"/g
      );

      for (const match of matches) {
        const path = match[1];

        if (
          path.endsWith(".js") ||
          path.endsWith(".css")
        ) {
          resources.push(
            new URL(path, indexUrl).toString()
          );
        }
      }

      await cache.addAll([...new Set(resources)]);
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200
          ) {
            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match(
              new URL("index.html", self.registration.scope).toString()
            );
          }
        });
    })
  );
});