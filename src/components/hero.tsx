import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FC, ReactNode } from "react";
import { Bubble, ChatHead, Mark, TextLink, Typing } from "./site";
import type { Msg } from "./site";

/* ------------------------------------------------------------------ */
/*  Script for the hero conversation                                   */
/* ------------------------------------------------------------------ */

/** One step of the conversation the hero plays. */
export type Beat =
  | { kind: "msg"; m: Msg; group?: boolean; typing?: number; wait?: number }
  | { kind: "day"; label: string; wait?: number }
  | { kind: "note"; text: string; wait?: number };

/** A card docked under the chat, shown once the conversation passes beat `after`. */
export interface HeroCard {
  after: number;
  node: ReactNode;
}

const START_DELAY = 1100; // let the headline land first
const HOLD = 5200; // how long the finished conversation stays before it replays
const FADE = 600;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/**
 * Plays `beats` one by one (with a typing indicator before Orbit's messages),
 * holds the finished conversation, fades and starts again. With reduced motion
 * the finished conversation is shown and nothing moves.
 */
function useConversation(beats: Beat[]) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [fading, setFading] = useState(false);
  const visible = useRef(true);

  useEffect(() => {
    if (reduced) {
      setShown(beats.length);
      setTyping(false);
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const step = (i: number) => {
      if (cancelled) return;
      if (i >= beats.length) {
        later(() => setFading(true), HOLD);
        later(() => {
          setShown(0);
          setFading(false);
          step(0);
        }, HOLD + FADE);
        return;
      }
      const beat = beats[i];
      const wait = beat.wait ?? (i === 0 ? START_DELAY : 900);
      const typingFor = beat.kind === "msg" && beat.m.from === "orbit" ? (beat.typing ?? 1300) : 0;
      later(() => {
        if (!visible.current) return later(() => step(i), 800); // paused while off screen
        if (typingFor) setTyping(true);
        later(() => {
          setTyping(false);
          setShown(i + 1);
          step(i + 1);
        }, typingFor);
      }, wait);
    };
    step(0);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [beats, reduced]);

  return { shown, typing, fading, reduced, visible };
}

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

const WAVE = [4, 9, 14, 8, 16, 11, 6, 13, 18, 10, 7, 15, 12, 5, 9, 14, 17, 8, 11, 6, 13, 9, 5, 10];

/** A WhatsApp voice note: play button, waveform and length. */
export const VoiceNote: FC<{ length: string; live?: boolean }> = ({ length, live = true }) => (
  <span className="flex items-center gap-3 py-0.5" aria-label={`Voice note, ${length}`}>
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest text-paper" aria-hidden>
      <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5" fill="currentColor">
        <path d="M7 4.5v15l12-7.5z" />
      </svg>
    </span>
    <span className="flex h-5 items-center gap-[3px]" aria-hidden>
      {WAVE.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] origin-center rounded-full bg-ink-soft ${live ? "wave-bar" : ""}`}
          style={{ height: h, animationDelay: `${i * 45}ms` } as CSSProperties}
        />
      ))}
    </span>
    <span className="text-[0.8125rem] text-ink-soft tnum">{length}</span>
  </span>
);

/**
 * The brand mark, enlarged into the stage: two orbits drawn in, with a planet
 * and a moon travelling slowly around them.
 */
const Orbits: FC = () => (
  <svg viewBox="-300 -300 600 600" className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 2xl:h-[720px] 2xl:w-[720px]" aria-hidden>
    <circle r="262" className="orbit-path" fill="none" stroke="rgba(242,240,232,0.16)" strokeWidth="2" pathLength={1} />
    <circle r="214" className="orbit-path orbit-path-2" fill="none" stroke="rgba(242,240,232,0.1)" strokeWidth="2" pathLength={1} />
    <g className="orbit-spin">
      <circle cx="262" cy="0" r="12" fill="#ed5a14" />
    </g>
    <g className="orbit-spin-rev">
      <circle cx="0" cy="-214" r="7" fill="#f29fc8" />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/*  The hero                                                           */
/* ------------------------------------------------------------------ */

export interface HeroProps {
  brand: string;
  homeHref: string;
  links: { label: string; href: string }[];
  navAction: { label: string; href: string };
  /** The headline, one string per line; each line rises out of its own mask. */
  title: string[];
  sub: ReactNode;
  actions: ReactNode;
  note?: ReactNode;
  chat: { title: string; sub: string; group?: boolean; beats: Beat[] };
  cards?: HeroCard[];
  /** Real things people send Orbit, drifting along the bottom of the hero on wide screens. */
  ticker?: { label: string; items: string[] };
}

/** A slow, endless row of sent messages. Pauses on hover; still under reduced motion. */
const Ticker: FC<{ label: string; items: string[] }> = ({ label, items }) => (
  <div className="hero-rise hidden items-center gap-8 pb-8 lg:flex" style={{ animationDelay: "900ms" }}>
    <p className="shrink-0 pl-5 text-step-sm text-ink-soft md:pl-8">{label}</p>
    <div className="marquee min-w-0 flex-1 overflow-hidden">
      <div className="marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-3 pr-3">
            {items.map((t) => (
              <li
                key={t}
                className="rounded-lg rounded-tr-none bg-wa-out px-4 py-2.5 text-step-sm whitespace-nowrap text-ink transition-colors duration-300 hover:bg-forest hover:text-paper"
              >
                {t}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  </div>
);

export const Hero: FC<HeroProps> = ({ brand, homeHref, links, navAction, title, sub, actions, note, chat, cards = [], ticker }) => {
  const { shown, typing, fading, visible } = useConversation(chat.beats);
  const stage = useRef<HTMLDivElement>(null);

  // Pause the conversation while the stage is off screen.
  useEffect(() => {
    const el = stage.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <>
      <header className="hero-fade flex items-center justify-between gap-6 px-5 py-5 md:px-8">
        <a href={homeHref} className="flex items-center gap-2.5 font-display text-[1.375rem] font-bold tracking-tight">
          <Mark className="h-9 w-9" />
          {brand}
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 text-step-sm md:flex">
          {links.map((l) => (
            <TextLink key={l.label} href={l.href} className="decoration-transparent hover:decoration-current">
              {l.label}
            </TextLink>
          ))}
        </nav>
        <a
          href={navAction.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-tile bg-ink px-4 text-step-sm font-semibold text-paper transition-colors duration-200 hover:bg-forest"
        >
          {navAction.label}
        </a>
      </header>

      <section aria-labelledby="hero-title" className="flex flex-col lg:min-h-[calc(100svh-84px)]">
      <div className="grid flex-1 items-center gap-12 px-5 pt-8 pb-16 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-4 lg:pb-12 2xl:gap-16">
        <div className="lg:col-span-7">
          <h1 id="hero-title" className="font-display text-[clamp(2.5rem,4.8vw,7.25rem)] leading-[0.98] font-bold tracking-[-0.04em]">
            {title.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span className="line-rise block" style={{ animationDelay: `${120 + i * 110}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-rise mt-7 max-w-[44ch] text-[clamp(1.1875rem,1.1vw,1.5rem)] leading-relaxed text-ink 2xl:mt-9" style={{ animationDelay: "480ms" }}>
            {sub}
          </p>
          <div className="hero-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: "600ms" }}>
            {actions}
            {note && <span className="text-step-sm text-ink-soft">{note}</span>}
          </div>
        </div>

        <div ref={stage} className="lg:col-span-5">
          <div className="stage-open relative h-[560px] overflow-hidden rounded-tile bg-forest md:h-[620px] 2xl:h-[clamp(620px,66svh,800px)]">
            <Orbits />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5">
              <div data-ui className="w-full max-w-[370px] overflow-hidden rounded-tile bg-wa-bg 2xl:max-w-[430px]">
                <ChatHead title={chat.title} sub={chat.sub} />
                <div
                  className={`flex h-[340px] flex-col justify-end gap-2 overflow-hidden p-3 transition-opacity duration-500 md:h-[390px] 2xl:h-[clamp(390px,40svh,500px)] ${fading ? "opacity-0" : "opacity-100"}`}
                >
                  {chat.beats.slice(0, shown).map((beat, i) => (
                    <div key={i} className="bubble-in shrink-0">
                      {beat.kind === "msg" && <Bubble m={beat.m} group={beat.group ?? chat.group} />}
                      {beat.kind === "day" && (
                        <p className="mx-auto w-fit rounded-md bg-white/80 px-2.5 py-1 text-[0.8125rem] text-ink-soft">{beat.label}</p>
                      )}
                      {beat.kind === "note" && <p className="py-0.5 text-center text-[0.8125rem] text-ink-soft">{beat.text}</p>}
                    </div>
                  ))}
                  {typing && (
                    <div className="bubble-in shrink-0">
                      <Typing />
                    </div>
                  )}
                </div>
              </div>

              {/* What the conversation turned into: one card at a time, docked under the chat. */}
              <div className="relative h-[92px] w-full max-w-[370px] 2xl:max-w-[430px]">
                {cards.map((c, i) => {
                  const next = cards[i + 1];
                  const on = shown > c.after && !(next && shown > next.after) && !fading;
                  return (
                    <div
                      key={i}
                      aria-hidden={!on}
                      className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                      }`}
                    >
                      <div data-ui className="h-full rounded-tile bg-paper px-4 py-3 text-ink">
                        {c.node}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {ticker && <Ticker label={ticker.label} items={ticker.items} />}
      </section>
    </>
  );
};
