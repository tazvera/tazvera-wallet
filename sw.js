/* Tazvera wallet · sw.js · MIT License · https://github.com/tazvera/tazvera-wallet
   Lets the installed app open without internet. Always network-first: when online, the newest files are used
   (and saved for next time); only when offline does it fall back to the saved copy.
   Never stores /api/ answers or anything from other websites. Keys and wallet data are not touched here. */
"use strict";
var CACHE = "tazvera-v9-3";
var CORE = ["/", "/index.html", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/ethers.min.js", "/wallet.js", "/qrcode.min.js", "/jsqr.js",
  "/app/css/fonts.css", "/app/css/app.css",
  "/app/js/05-splash.js", "/app/js/00-config.js", "/app/js/01-i18n.js", "/app/js/02-core.js", "/app/js/10-send.js", "/app/js/11-scan.js", "/app/js/12-request.js",
  "/app/js/13-lock-onboarding.js", "/app/js/20-faucet-security.js", "/app/js/21-tools.js", "/app/js/22-wallets-help-backup.js",
  "/app/js/23-back-button.js", "/app/js/24-explore.js", "/app/js/25-settings.js", "/app/js/26-v8-trust.js", "/app/js/27-ai.js", "/app/js/28-backup.js", "/app/js/29-ai2.js", "/app/js/30-render-boot.js"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(new Request(u, { cache: "reload" })).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.indexOf("/api/") === 0 || url.pathname === "/sw.js") return;
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok && res.type === "basic") { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) {
      if (hit) return hit;
      if (req.mode === "navigate") return caches.match("/index.html").then(function (h) { return h || caches.match("/"); });
      return new Response("", { status: 504, statusText: "offline" });
    });
  }));
});
