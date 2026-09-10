const CACHE_NAME = "offline-notes-v4";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const indexUrl = new URL("index.html", self.registration.scope);

      const response = await fetch(indexUrl);
      const html = await response.text();

      const parser = new DOMParser();
      const document = parser.parseFromString(html, "text/html");

      const resources = [
        indexUrl.toString(),
        new URL("manifest.webmanifest", self.registration.scope).toString(),
      ];

      document
        .querySelectorAll('script[src], link[href]')
        .forEach((element) => {
          const url =
            element.getAttribute("src") ||
            element.getAttribute("href");

          if (url) {
            resources.push(
              new URL(url, indexUrl).toString()
            );
          }
        });

      await cache.addAll([...new Set(resources)]);
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
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
            networkResponse.status === 200 &&
            networkResponse.type !== "opaque"
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