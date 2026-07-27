"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainMenuButton() {
  const pathname = usePathname();
  const href = pathname?.startsWith("/offline") ? "/offline" : "/";

  return (
    <Link
      href={href}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 rounded-lg border border-good/60 bg-ink/95 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-ink/40 backdrop-blur transition hover:border-good"
    >
      Main menu
    </Link>
  );
}
