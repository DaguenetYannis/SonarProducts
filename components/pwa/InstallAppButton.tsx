"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type InstallState = "ready" | "installed" | "manual";

export function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState, setInstallState] = useState<InstallState>("manual");

  useEffect(() => {
    if (isStandalone()) {
      setInstallState("installed");
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setInstallState("ready");
    }

    function handleInstalled() {
      setInstallPrompt(null);
      setInstallState("installed");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) {
      setInstallState("manual");
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    setInstallState(choice.outcome === "accepted" ? "installed" : "manual");
  }

  if (installState === "installed") {
    return <p className="mt-5 text-sm text-good">Installed. Open each level once while online to cache it.</p>;
  }

  return (
    <div className="mx-auto mt-5 grid max-w-md gap-3">
      <button
        type="button"
        onClick={installApp}
        className="min-h-14 rounded-lg border border-good bg-good px-5 py-3 font-semibold text-ink transition hover:bg-good/90"
      >
        Install app
      </button>
      {installState === "manual" ? (
        <p className="text-sm leading-6 text-slate-300">
          If the button does not open an install prompt, use your browser menu: Add to Home Screen or Install app.
        </p>
      ) : null}
    </div>
  );
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || getNavigatorStandalone();
}

function getNavigatorStandalone() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
  return navigatorWithStandalone.standalone === true;
}
