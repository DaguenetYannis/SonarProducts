import type { Metadata, Viewport } from "next";
import { MainMenuButton } from "@/components/navigation/MainMenuButton";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sonar Products",
    template: "%s | Sonar Products"
  },
  description: "A mobile-friendly learning app for Sonar products and CSE interview practice.",
  applicationName: "Sonar Products",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sonar Products"
  },
  icons: {
    icon: [
      { url: "/icons/sonar-products.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/icons/sonar-products.svg", type: "image/svg+xml" }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: "#090b10",
  colorScheme: "dark",
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <MainMenuButton />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
