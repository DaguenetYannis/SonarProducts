"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (isLocalDevelopmentHost(globalThis.location.hostname)) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .catch(() => {
          // Local cache cleanup should never block rendering.
        });
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Installation should never block the learning app itself.
    });
  }, []);

  return null;
}

function isLocalDevelopmentHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}
