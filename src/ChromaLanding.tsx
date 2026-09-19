import { useEffect, useState } from "react";
import type { FC, ReactNode, SVGProps } from "react";
import HalftoneReveal from "./components/HalftoneReveal";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface NavLink {
  label: string;
  href: string;
}

interface Stat {
  label: string;
  value: ReactNode;
  tone?: "ink" | "forest";
}

interface Stream {
  name: string;
  code: string;
  dot: string; // tailwind text-color class driving the status dot
}

const NAV_LINKS: readonly NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Proactive PM", href: "#proactive" },
  { label: "Architecture", href: "#architecture" },
];

const STATS: readonly Stat[] = [
  {
    label: "Webhook Ingestion",
    value: (
      <>
        &lt;50<span className="align-top text-[0.5em] opacity-50">ms</span>
      </>
    ),
  },
  { label: "Voice Pipeline", value: "Whisper v3" },
  { label: "Proactive Agent", value: "Active", tone: "forest" },
];

const STREAMS: readonly Stream[] = [
  { name: "Voice Note Transcription", code: "Whisper-v3", dot: "text-forest" },
  { name: "Proactive Standup Worker", code: "09:00 AM", dot: "text-signal" },
  { name: "pgvector Semantic Memory", code: "Cosine Sim", dot: "text-forest" },
  { name: "Zero-SQL Tool Execution", code: "Pydantic", dot: "text-orange" },
];

/* ------------------------------------------------------------------ */
/*  WhatsApp CTA — campaign-attributed link                            */
/* ------------------------------------------------------------------ */

// TODO(launch): replace with the real Orbit WhatsApp Business number before this goes live.
const WHATSAPP_NUMBER = "15550000000";

const DEFAULT_WHATSAPP_MESSAGE = "Hey Orbit — I'd like a design-partner spot.";

// Keys match the `?src=` query param on the campaign-specific links (see GTM wa.me link scheme).
const CAMPAIGN_WHATSAPP_MESSAGES: Record<string, string> = {
  indie: "Hey Orbit — INDIE50, I'd like a design-partner spot.",
  founder: "Hey Orbit — FOUNDER50, I'd like a design-partner spot.",
  agency: "Hey Orbit — AGENCY50, I'd like a design-partner spot.",
};

function buildWhatsAppHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Reads `?src=` on first client render so the CTA carries campaign attribution end-to-end. */
function useWhatsAppHref(): string {
  const [href, setHref] = useState(() => buildWhatsAppHref(DEFAULT_WHATSAPP_MESSAGE));

  useEffect(() => {
    const src = new URLSearchParams(window.location.search).get("src");
    const message = (src && CAMPAIGN_WHATSAPP_MESSAGES[src]) || DEFAULT_WHATSAPP_MESSAGE;
    setHref(buildWhatsAppHref(message));
  }, []);

  return href;
}

/* ------------------------------------------------------------------ */
/*  Shared atoms                                                       */
/* ------------------------------------------------------------------ */

/**
 * Film-grain texture layer. `blend` maps to a *literal* class string so
 * Tailwind's source scanner emits the utility (it can't see interpolated names).
 */
type Blend = "multiply" | "screen" | "overlay";
const BLEND: Record<Blend, string> = {
  multiply: "mix-blend-multiply",
  screen: "mix-blend-screen",
  overlay: "mix-blend-overlay",
};

const Grain: FC<{ className?: string; blend?: Blend }> = ({ className = "", blend = "multiply" }) => (
  <div
    aria-hidden
    className={`grain pointer-events-none absolute inset-0 bg-repeat ${BLEND[blend]} ${className}`}
  />
);

const ArrowRight: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

const BetaBanner: FC<{ href: string }> = ({ href }) => (
  <div className="border-b border-ink/15 bg-ink text-paper">
    <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 py-2.5 text-center">
      <span className="label-mono text-orange">Free Beta</span>
      <span className="text-sm text-paper/80">50 design-partner spots open this wave —</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold underline underline-offset-4 hover:text-orange"
      >
        claim yours on WhatsApp
      </a>
    </div>
  </div>
);

const Nav: FC<{ whatsappHref: string }> = ({ whatsappHref }) => (
  <header className="border-b border-ink/15 mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-8 pb-6 md:px-12">
    <a href="#top" className="flex items-center gap-3 font-display text-xl font-bold tracking-tight">
      <span className="relative h-6 w-6 overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_30%,#5f8ea0,#2e6b40_55%,#ed5a14)]">
        <Grain blend="overlay" className="opacity-60" />
      </span>
      <span>ORBIT</span>
      <span className="label-mono rounded bg-ink/10 px-2 py-0.5 text-[0.6rem] text-ink/70">
        POCKET PM
      </span>
    </a>

    <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
      {NAV_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-sm font-medium text-ink/80 transition-colors hover:text-ink"
        >
          {link.label}
        </a>
      ))}
    </nav>

    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:text-ink hover:bg-paper border border-ink"
    >
      Start on WhatsApp
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  </header>
);

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

/** The interactive HalftoneReveal speech-bubble bloom on the right of the hero. */
const HeroBloom: FC = () => (
  <div className="group relative mx-auto aspect-[5/5] w-full max-w-[560px] select-none">
    {/* Main speech-bubble container hosting the WebGL HalftoneReveal */}
    <div className="relative h-full w-full overflow-hidden rounded-xl shadow-[0_20px_60px_-15px_rgba(46,107,64,0.35)] transition-shadow duration-500 hover:shadow-[0_25px_70px_-10px_rgba(237,90,20,0.3)]">
      <HalftoneReveal
        src="/hero-bg.jpg"
        mode="color"
        shape="circle"
        paperColor="#37604b"
        inkColor="#111111"
        dotDensity={80}
        dotSize={1.05}
        revealRadius={0.38}
        edge={0.82}
        follow={0.22}
        contrast={1.2}
        trigger="hover"
        className="h-full w-full"
        borderRadius="0px"
      />

      {/* Specular gloss and grain textures over the canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 90% at 12% 20%, rgba(95,142,158,0.35), transparent 60%)",
        }}
      />
      <Grain blend="overlay" className="pointer-events-none opacity-60" />

      {/* Floating guidance badge */}
      <div className="pointer-events-none absolute bottom-4 right-8 flex items-center gap-2 rounded-full border border-white/20 bg-ink/60 px-3.5 py-1.5 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-0">
        <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
        <span className="label-mono text-[0.65rem] text-paper">
          Hover to Inspect PM Engine
        </span>
      </div>
    </div>
  </div>
);

const Hero: FC = () => (
  <section
    id="top"
    className="h-[90vh] mx-auto grid max-w-[1400px] items-center gap-16 px-6 pt-16 pb-24 md:px-12 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24"
  >
    <div>
      <p className="label-mono text-orange">v1.0 WhatsApp Live // AI Co-Developer</p>

      <h1 className="mt-6 font-display text-[clamp(3rem,8vw,5.9rem)] font-bold leading-[0.95] tracking-tight">
        Your Pocket PM
        <br />
        on WhatsApp.
      </h1>

      <p className="mt-8 max-w-[42ch] text-lg leading-relaxed text-ink/75">
        An autonomous PM that lives where you already chat.
        Orbit catches your late-night voice dumps,
        organizes client deliverables, tracks blockers,
        and keeps your projects unblocked on autopilot.
      </p>

      <div className="mt-14 max-w-[55ch] border-t border-ink/15 pt-6">
        <dl className="flex flex-wrap gap-x-12 gap-y-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <dt className="label-mono text-ink/60">{stat.label}</dt>
              <dd
                className={`font-display text-2xl font-semibold ${
                  stat.tone === "forest" ? "text-forest" : "text-ink"
                }`}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>

    <HeroBloom />
  </section>
);

/* ------------------------------------------------------------------ */
/*  Workflow — Active Streams panel                                    */
/* ------------------------------------------------------------------ */

const StreamsPanel: FC = () => (
  <div className="flex flex-col gap-8 border border-ink/12 bg-paper-2/60 p-6 lg:rounded-l-2xl">
    <div className="flex items-center justify-between">
      <h3 className="label-mono font-bold text-ink">Live PM Pipelines</h3>
      <button
        type="button"
        aria-label="Add stream"
        className="text-ink/60 transition-colors hover:text-ink"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </button>
    </div>

    <ul className="flex flex-col gap-4">
      {STREAMS.map((stream) => (
        <li key={stream.name} className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full bg-current ${stream.dot}`} aria-hidden />
            {stream.name}
          </span>
          <span className="label-mono text-ink/70">{stream.code}</span>
        </li>
      ))}
    </ul>

    <div className="mt-auto">
      <p className="label-mono mb-2 text-ink/60">Worker Throughput // 99.98% SLA</p>
      <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10">
        <div className="h-full w-[88%] rounded-full bg-orange" />
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Workflow — Graph Inspector panel                                   */
/* ------------------------------------------------------------------ */

const GraphViz: FC = () => (
  <svg
    viewBox="0 0 1000 260"
    preserveAspectRatio="none"
    className="h-full w-full"
    role="img"
    aria-label="Live signal waveform trending across the render window"
  >
    <defs>
      <linearGradient id="orbit-line" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1e5fce" />
        <stop offset="50%" stopColor="#f29fc8" />
        <stop offset="100%" stopColor="#ed5a14" />
      </linearGradient>
      <pattern id="orbit-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      </pattern>
      <filter id="orbit-rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
      </filter>
    </defs>

    <rect width="1000" height="260" fill="url(#orbit-grid)" />

    <path
      d="M 0,150 C 150,200 250,70 400,130 S 600,230 750,170 S 900,90 1000,140"
      fill="none"
      stroke="url(#orbit-line)"
      strokeWidth="4"
      strokeLinecap="round"
      filter="url(#orbit-rough)"
    />

    <circle cx="400" cy="130" r="5" fill="#ffffff" />
    <circle cx="750" cy="170" r="5" fill="#ffffff" />
  </svg>
);

const Pip: FC<{ children: ReactNode; ring?: boolean }> = ({ children, ring }) => (
  <span
    className={`label-mono rounded px-2 py-1 text-[0.65rem] text-white/80 ${
      ring ? "border border-white/20" : "bg-white/10"
    }`}
  >
    {children}
  </span>
);

const GraphPanel: FC = () => (
  <div className="relative flex flex-col gap-4 overflow-hidden border border-ink/12 bg-ink p-6 text-white lg:rounded-r-2xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="label-mono text-white/80">Context & Memory Graph</span>
        <span className="label-mono rounded bg-white/10 px-2 py-0.5 text-[0.6rem] text-white/80">
          LIVE EMBEDDINGS
        </span>
      </div>
      <div className="flex gap-1.5">
        <Pip ring>TASKS</Pip>
        <Pip ring>PROJECTS</Pip>
        <Pip ring>MEMORY</Pip>
      </div>
    </div>

    <div className="relative min-h-[200px] flex-1">
      <GraphViz />
    </div>

    <div className="flex items-center justify-between">
      <span className="label-mono text-white/50">T-0.00ms (Webhook Ingest)</span>
      <span className="label-mono text-white/50">T-480.00ms (Dispatched)</span>
    </div>
  </div>
);

const Workflow: FC = () => (
  <section id="features" className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
    <div className="flex flex-col items-start justify-between gap-3 border-b border-ink/25 pb-5 sm:flex-row sm:items-end">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Autonomous Workflow Orchestration
        </h2>
        <p className="mt-2 text-sm text-ink/70">
          Zero-overhead project management powered by background workers and strict zero-raw-SQL tools.
        </p>
      </div>
      <span className="label-mono text-ink/70">Module 01 // Proactive PM Engine</span>
    </div>

    <div id="architecture" className="mt-10 grid gap-px lg:grid-cols-[minmax(260px,1fr)_2.6fr]">
      <StreamsPanel />
      <GraphPanel />
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Testimonial + positioning restraint                                */
/* ------------------------------------------------------------------ */

const Testimonial: FC = () => (
  <section id="proactive" className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
    <div className="grid gap-10 border-t border-ink/25 pt-12 lg:grid-cols-[1.3fr_0.7fr]">
      <div>
        <p className="label-mono text-orange">Design Partner Feedback</p>
        <blockquote className="mt-6 font-display text-2xl font-medium leading-snug text-ink md:text-3xl">
          &ldquo;Seeing notifications reminding me about a task I am supposed to complete helps my
          productivity. I&rsquo;m always on WhatsApp.&rdquo;
        </blockquote>
        <p className="label-mono mt-6 text-ink/60">
          — Early Orbit design partner, freelance developer
        </p>
      </div>

      <div className="border-l border-ink/15 pl-8">
        <p className="label-mono text-forest">One Job. On Purpose.</p>
        <p className="mt-4 text-lg leading-relaxed text-ink/75">
          Orbit won&rsquo;t be your therapist, your calendar, or your CRM. It remembers your
          projects, tracks your deadlines, and nudges you before something slips — that&rsquo;s
          the whole job, and we&rsquo;re not diluting it into a 5-in-1 chatbot.
        </p>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  CTA footer                                                         */
/* ------------------------------------------------------------------ */

const CtaFooter: FC<{ whatsappHref: string }> = ({ whatsappHref }) => (
  <section id="app" className="mx-auto max-w-[1400px] px-6 pb-20 md:px-12">
    <div className="relative overflow-hidden rounded-2xl bg-ink px-6 py-24 text-center text-paper">
      {/* checkerboard bleed, bottom-right */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 opacity-[0.6]"
        style={{
          backgroundImage:
            "repeating-conic-gradient(rgba(255,255,255,0.05) 0% 25%, transparent 0% 50%)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to left, black, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to left, black, transparent 80%)",
        }}
      />

      <div className="relative">
        <h2 className="font-display text-5xl font-bold tracking-tight md:text-6xl">
          Ready to put your PM on autopilot?
        </h2>

        <p className="mx-auto mt-6 max-w-[48ch] text-lg text-paper/75">
          Send voice notes, dump client briefs, and keep your multi-project sprints organized
          directly from WhatsApp.
        </p>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center rounded-full bg-paper px-8 py-4 font-display font-semibold text-ink transition-transform hover:scale-[1.02]"
        >
          Claim Your Design-Partner Spot
        </a>

        <p className="label-mono mt-4 text-orange">Free during beta · 50 spots per wave</p>

        <p className="label-mono mt-8 text-white/45">
          FastAPI • PostgreSQL + pgvector • Gemini 3.7 Flash • Groq Whisper v3
        </p>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const ChromaLanding: FC = () => {
  const whatsappHref = useWhatsAppHref();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-paper text-ink">
      {/* global page grain */}
      <Grain blend="multiply" className="fixed inset-0 z-50 opacity-[0.04]" />
      <BetaBanner href={whatsappHref} />
      <Nav whatsappHref={whatsappHref} />
      <main>
        <Hero />
        <Workflow />
        <Testimonial />
        <CtaFooter whatsappHref={whatsappHref} />
      </main>
    </div>
  );
};

export default ChromaLanding;
