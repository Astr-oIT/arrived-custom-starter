"use client";

import { useEffect, useRef } from "react";
import type { HappilyEnv, PublicEventData, PublicForm } from "@/lib/happily/types";

type ConfigFestivalPageProps = {
  eventData: PublicEventData;
  eventId: string;
  env?: HappilyEnv;
};

/**
 * ConfigFestivalPage
 *
 * Renders the Meng To Sketchbook interaction engine (page-turn, draggable
 * magnifying glass, zoom, editorial index) as a full-viewport iframe,
 * adapted with Config Festival 2026 / Lisbon content.
 *
 * The HTML lives at /landing-pages/meng-to-sketchbook/config-festival.html
 * so it is served as a static asset — no re-renders, no RSC overhead.
 *
 * The iframe communicates back via postMessage when the user clicks the
 * registration CTA, at which point we smoothly scroll the host page to
 * the #register section rendered by Next.js below the iframe.
 */
export function ConfigFestivalPage({
  eventData,
  eventId,
  env = "prod",
}: ConfigFestivalPageProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const registerSectionRef = useRef<HTMLDivElement>(null);

  // Listen for the registration CTA postMessage from the iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (
        e.data &&
        typeof e.data === "object" &&
        e.data.type === "config-festival-register"
      ) {
        registerSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const form = eventData.form;

  return (
    <>
      {/* Full-viewport sketchbook iframe — the entire ThreeUI interaction engine */}
      <div
        style={{
          width: "100%",
          height: "100svh",
          position: "relative",
          overflow: "hidden",
        }}
        aria-label="Config Festival 2026 — Lisbon sketchbook"
      >
        <iframe
          ref={iframeRef}
          id="config-festival-iframe"
          src="/landing-pages/meng-to-sketchbook/config-festival.html"
          title="Config 2026 — Lisbon Sketchbook"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
          // Allow pointer capture within the iframe for the drag interactions
          allow="same-origin"
        />
      </div>

      {/* Registration section — rendered by Next.js, scrolled to via postMessage */}
      {form && (
        <div
          ref={registerSectionRef}
          id="register"
          style={{
            background: "#ece7dc",
            minHeight: "100svh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(48px, 10vh, 96px) clamp(20px, 5vw, 64px)",
            fontFamily: '"Newsreader", Georgia, "Times New Roman", serif',
            color: "#2b2721",
          }}
        >
          {/* Decorative rule */}
          <div
            aria-hidden="true"
            style={{
              width: "min(420px, 52vw)",
              height: "clamp(26px, 4vw, 46px)",
              background:
                "url(/landing-pages/meng-to-sketchbook/divider.png) center / 100% auto no-repeat",
              opacity: 0.4,
              marginBottom: "clamp(32px, 6vh, 64px)",
            }}
          />

          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(43,39,33,.36)",
              margin: "0 0 18px",
            }}
          >
            Registration
          </p>

          {form.form_title && (
            <h2
              style={{
                fontFamily:
                  '"Instrument Serif", "New York", Georgia, "Times New Roman", serif',
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 400,
                margin: "0 0 16px",
                letterSpacing: "0.01em",
                textAlign: "center",
              }}
            >
              {form.form_title}
            </h2>
          )}

          {form.form_description && (
            <p
              style={{
                fontSize: "clamp(15px, 1.5vw, 18px)",
                color: "rgba(43,39,33,.58)",
                fontWeight: 300,
                maxWidth: "48ch",
                margin: "0 auto 32px",
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              {form.form_description}
            </p>
          )}

          {/* Inline registration form — lazy import to keep the sketchbook fast */}
          <RegistrationFormLoader eventId={eventId} env={env} form={form} />

          {/* Footer line */}
          <p
            style={{
              marginTop: "clamp(48px, 8vh, 80px)",
              fontSize: 11.5,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(43,39,33,.36)",
              textAlign: "center",
            }}
          >
            Lisbon, Portugal · October 16–18, 2026 · CONFIG 2026
          </p>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Lazy registration form — only mounts when #register scrolls into view.
// We import RegistrationForm from the existing starter component.
// ---------------------------------------------------------------------------
import { RegistrationForm } from "@/components/registration-form";


function RegistrationFormLoader({
  eventId,
  env,
  form,
}: {
  eventId: string;
  env: HappilyEnv;
  form: PublicForm;
}) {
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <RegistrationForm
        eventId={eventId}
        env={env}
        form={form}
        redirectTo="/confirmation"
        buttonText={form.form_button_text ?? "Register for Config 2026"}
      />
    </div>
  );
}
