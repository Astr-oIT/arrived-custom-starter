import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../globals.css";

import { styleValue } from "@/components/helpers";
import { PreviewBanner } from "@/components/preview-banner";
import { isPreviewRequest, resolveEventEnv } from "@/lib/happily/config";
import { getPublicEvent } from "@/lib/happily/queries";

// First-party analytics proxy host.
const ANALYTICS_HOST = "https://hx.happily.events";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  // Config Festival 2026 — Lisbon
  return {
    title: "Config 2026 — Lisbon",
    description:
      "CONFIG 2026 — A design and technology festival in Lisbon, Portugal. October 16–18, 2026.",
    openGraph: {
      title: "Config 2026 — Lisbon",
      description:
        "Three days of design, technology, and inspiration by the Tagus.",
    },
  };
}

export default async function EventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const preview = await isPreviewRequest();
  const env = await resolveEventEnv();
  const eventData = await getPublicEvent({ env });
  const styles = eventData.event.styles;

  // Only track published-site visits: no analytics in preview or when
  // the event has no analytics configured.
  const analyticsId = env === "prod" ? eventData.event.analytics_id : null;

  const eventVars = {
    "--event-primary-bg": styleValue(styles, "primaryBg", "#ece7dc"),
    "--event-primary-text": styleValue(styles, "primaryText", "#2b2721"),
    "--event-secondary-bg": styleValue(styles, "secondaryBg", "#f4ede0"),
    "--event-secondary-text": styleValue(styles, "secondaryText", "#2b2721"),
    "--event-accent-bg": styleValue(styles, "accentBg", "#2b2721"),
    "--event-accent-text": styleValue(styles, "accentText", "#ece7dc"),
    "--event-base-bg": styleValue(styles, "baseBg", "#ece7dc"),
    "--event-base-text": styleValue(styles, "baseText", "#2b2721"),
    "--event-border-radius": styleValue(styles, "borderRadius", "2px"),
  } as CSSProperties;

  return (
    <html
      lang="en"
      className={`${openSans.variable} h-full antialiased`}
    >
      {/*
        The sketchbook renders full-bleed inside a 100svh iframe.
        No EventShell header/footer is mounted here — the iframe's own
        top bar (CONFIG 2026 + nav) and foot are the page chrome.
        The Happily registration form is rendered below the iframe by
        ConfigFestivalPage, which receives eventData from the server component.
      */}
      <body
        style={{ ...eventVars, margin: 0, padding: 0, overflow: "auto" }}
        className="min-h-full"
      >
        {preview && <PreviewBanner />}
        {analyticsId && (
          <script
            defer
            src={`${ANALYTICS_HOST}/script.js`}
            data-host-url={ANALYTICS_HOST}
            data-website-id={analyticsId}
          />
        )}
        {children}
      </body>
    </html>
  );
}
