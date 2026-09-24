import type { HappilyEnv, PublicEventData } from "@/lib/happily/types";
import { ConfigFestivalPage } from "./sketchbook/config-festival-page";

type EventPageProps = {
  eventData: PublicEventData;
  eventId: string;
  env: HappilyEnv;
};

/**
 * EventPage — now delegates to ConfigFestivalPage, which renders the
 * full Meng To Sketchbook interaction engine (page-turn, magnifying glass,
 * zoom controls, editorial index) adapted for Config Festival 2026 / Lisbon.
 *
 * The Happily API connection is preserved: eventData, eventId, and env are
 * passed through so the registration form uses live event data.
 */
export function EventPage({ eventData, eventId, env }: EventPageProps) {
  return (
    <ConfigFestivalPage
      eventData={eventData}
      eventId={eventId}
      env={env}
    />
  );
}
