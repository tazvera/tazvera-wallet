/* Tazvera wallet · PWA service worker registration · MIT License
   Registers the existing same-origin service worker on supported browsers.
   This does not access wallet keys, PINs, or local wallet storage. */
(function () {
  "use strict";
  if (!("serviceWorker" in navigator)) return;

  function registerTazveraWorker() {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function () {
      /* The wallet remains usable if offline caching is unavailable. */
    });
  }

  if (document.readyState === "complete") {
    registerTazveraWorker();
  } else {
    window.addEventListener("load", registerTazveraWorker, { once: true });
  }
})();
