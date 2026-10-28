import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Links the whole site shares. Change them here, not in the pages.   */
/* ------------------------------------------------------------------ */

// Number-based link: wa.me short links (wa.me/message/...) ignore ?text=, which
// would drop the campaign keyword the backend uses for attribution.
export const WHATSAPP_LINK = "https://wa.me/2347064287664";
export const WHATSAPP_DISPLAY = "+234 706 428 7664";

/**
 * Where "Book a call" goes for Orbit Teams. Teams billing isn't self-serve yet,
 * so every plan starts with a call. Replace with a Cal.com / Calendly link when
 * there is one; until then it opens a WhatsApp chat with a written request.
 */
export const BOOK_CALL_URL = `${WHATSAPP_LINK}?text=${encodeURIComponent(
  "Hello, I'd like to book a call about Orbit Teams for my team.",
)}`;

const DEFAULT_WHATSAPP_MESSAGE = "Hey Orbit, I'd like to start my free trial.";

// Keys match the `?src=` query param on campaign links. The backend reads the
// INDIE50 / FOUNDER50 / AGENCY50 keyword from the first message for attribution.
const CAMPAIGN_WHATSAPP_MESSAGES: Record<string, string> = {
  indie: "Hey Orbit, INDIE50, I'd like to start my free trial.",
  founder: "Hey Orbit, FOUNDER50, I'd like to start my free trial.",
  agency: "Hey Orbit, AGENCY50, I'd like to start my free trial.",
};

function buildWhatsAppHref(message?: string): string {
  if (!message) return WHATSAPP_LINK;
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}

/** Reads `?src=` on first client render so the CTA carries campaign attribution end-to-end. */
export function useWhatsAppHref(): string {
  const [href, setHref] = useState(() => buildWhatsAppHref(DEFAULT_WHATSAPP_MESSAGE));

  useEffect(() => {
    const src = new URLSearchParams(window.location.search).get("src");
    const message = (src && CAMPAIGN_WHATSAPP_MESSAGES[src]) || DEFAULT_WHATSAPP_MESSAGE;
    setHref(buildWhatsAppHref(message));
  }, []);

  return href;
}

/** Internal page paths. `/teams/` is its own HTML entry, so it works on any static host. */
export const PATHS = {
  home: "/",
  teams: "/teams/",
} as const;
