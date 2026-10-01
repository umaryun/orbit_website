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

const NAV_LINKS: readonly NavLink[] = [
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const HERO_POINTS: readonly string[] = [
  "Voice notes become tasks with due dates",
  "Texts you before a deadline slips",
  "No new app to open",
];

interface Step {
  n: string;
  title: string;
  body: string;
}

const STEPS: readonly Step[] = [
  {
    n: "01",
    title: "Talk to it",
    body: "Send a voice note or a quick text after a client call, the way you'd tell a friend what's on your plate.",
  },
  {
    n: "02",
    title: "It organizes",
    body: "Orbit sorts it into projects and tasks with due dates, and remembers the client details and decisions you mention.",
  },
  {
    n: "03",
    title: "It texts you first",
    body: "A morning plan, a nudge before a deadline, a follow-up when you're blocked. You reply in WhatsApp and it updates everything.",
  },
];

type Who = "you" | "orbit";

interface ChatLine {
  who: Who;
  text: ReactNode;
  meta?: string;
}

const EXAMPLE_CHAT: readonly ChatLine[] = [
  {
    who: "you",
    meta: "Voice note · 0:38",
    text: "Just got off the call with Acme. They want the Stripe checkout live by Friday, and I still owe Tunde the dashboard fixes…",
  },
  {
    who: "orbit",
    text: (
      <>
        Got it. Added to <b>Acme</b>: Stripe checkout, due Fri. Added to <b>Tunde</b>: dashboard
        fixes. Want me to check in Thursday morning on the checkout?
      </>
    ),
  },
  { who: "you", text: "Yes please" },
  { who: "orbit", meta: "Thursday, 9:02", text: "Morning! Stripe checkout for Acme is due tomorrow. Still on track?" },
];

interface Plan {
  name: string;
  price: string;
  cadence: string;
  note: string;
  features: readonly string[];
  highlight?: boolean;
}

const PLANS: readonly Plan[] = [
  {
    name: "Free trial",
    price: "₦0",
    cadence: "for 14 days",
    note: "No card needed. Just say hi.",
    features: ["Everything in Pro", "Reminders, morning plans and nudges", "Cancel by simply not paying"],
  },
  {
    name: "Founding member",
    price: "₦3,500",
    cadence: "/ month, locked for life",
    note: "First 25 people only. In return, a short feedback call each month.",
    features: ["Everything in Pro", "Price never goes up", "Direct line to the founder"],
    highlight: true,
  },
  {
    name: "Pro",
    price: "₦5,000",
    cadence: "/ month",
    note: "Or ₦50,000 / year (two months free).",
    features: ["Unlimited projects and tasks", "Voice notes and PRD uploads", "Client-ready status updates"],
  },
];

interface Faq {
  q: string;
  a: string;
}

const FAQS: readonly Faq[] = [
  {
    q: "Do I need to install anything?",
    a: "No. Orbit is a WhatsApp chat. Tap the button, say hi, and it asks your name and timezone. Save the number as “Orbit” so you know who's texting.",
  },
  {
    q: "What does Orbit remember about me?",
    a: "Your projects, tasks, deadlines and the details you mention about them. Ask “what do you know about me?” any time to see it, and tell it to delete anything that's wrong.",
  },
  {
    q: "Can my clients see it?",
    a: "No. Orbit only talks to you. If you want to send a client an update, it drafts one for you to copy, with your internal notes left out.",
  },
  {
    q: "Is it a general AI chatbot?",
    a: "No, on purpose. Orbit does one job: keeping track of your client work and deadlines. For anything else, use your favourite assistant.",
  },
  {
    q: "What happens after the trial?",
    a: "Orbit sends you a recap of what it did and a payment link. If you don't subscribe, chat still works, but reminders and check-ins pause.",
  },
  {
    q: "How do I pay?",
    a: "By card through Paystack, in naira. Monthly plans renew automatically; to cancel, just message Orbit and we'll stop it. The yearly plan can also be paid by transfer.",
  },
];

/* ------------------------------------------------------------------ */
/*  WhatsApp CTA — campaign-attributed link                            */
/* ------------------------------------------------------------------ */

const WHATSAPP_LINK = "https://wa.me/message/NGU6OR5CVCGVO1";

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

const Check: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CtaButton: FC<{ href: string; children: ReactNode; tone?: "ink" | "paper"; className?: string }> = ({
  href,
  children,
  tone = "ink",
  className = "",
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group inline-flex items-center gap-2 rounded-full border px-6 py-3 font-display font-semibold transition-colors ${
      tone === "ink"
        ? "border-ink bg-ink text-paper hover:bg-paper hover:text-ink"
        : "border-paper bg-paper text-ink hover:bg-transparent hover:text-paper"
    } ${className}`}
  >
    {children}
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </a>
);

const SectionHead: FC<{ kicker: string; title: string; sub?: string }> = ({ kicker, title, sub }) => (
  <div className="border-b border-ink/25 pb-5">
    <p className="label-mono text-orange">{kicker}</p>
    <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
    {sub && <p className="mt-2 max-w-[60ch] text-ink/70">{sub}</p>}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

const TrialBanner: FC<{ href: string }> = ({ href }) => (
  <div className="border-b border-ink/15 bg-ink text-paper">
    <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 py-2.5 text-center">
      <span className="label-mono text-orange">Founding members</span>
      <span className="text-sm text-paper/80">₦3,500/month locked for life, first 25 people.</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold underline underline-offset-4 hover:text-orange"
      >
        Start free on WhatsApp
      </a>
    </div>
  </div>
);

const Nav: FC<{ whatsappHref: string }> = ({ whatsappHref }) => (
  <header className="mx-auto flex max-w-[1400px] items-center justify-between border-b border-ink/15 px-6 pt-8 pb-6 md:px-12">
    <a href="#top" className="flex items-center gap-3 font-display text-xl font-bold tracking-tight">
      <span className="relative h-6 w-6 overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_30%,#5f8ea0,#2e6b40_55%,#ed5a14)]">
        <Grain blend="overlay" className="opacity-60" />
      </span>
      <span>ORBIT</span>
      <span className="label-mono hidden rounded bg-ink/10 px-2 py-0.5 text-[0.6rem] text-ink/70 sm:inline">
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
      className="group inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-paper hover:text-ink"
    >
      Start free
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  </header>
);

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

/** The interactive HalftoneReveal bloom on the right of the hero. */
const HeroBloom: FC = () => (
  <div className="group relative mx-auto aspect-square w-full max-w-[560px] select-none">
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(60% 90% at 12% 20%, rgba(95,142,158,0.35), transparent 60%)",
        }}
      />
      <Grain blend="overlay" className="pointer-events-none opacity-60" />
    </div>
  </div>
);

const Hero: FC<{ whatsappHref: string }> = ({ whatsappHref }) => (
  <section
    id="top"
    className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 pt-16 pb-24 md:px-12 lg:min-h-[85vh] lg:grid-cols-[1.15fr_0.85fr] lg:pt-24"
  >
    <div>
      <p className="label-mono text-orange">For freelance developers juggling clients</p>

      <h1 className="mt-6 font-display text-[clamp(3rem,8vw,5.9rem)] font-bold leading-[0.95] tracking-tight">
        Your Pocket PM
        <br />
        on WhatsApp.
      </h1>

      <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-ink/75">
        Send Orbit a voice note after a client call. It turns it into tasks with deadlines, then
        texts you before anything slips. No new app, no dashboard to keep updated.
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        {HERO_POINTS.map((p) => (
          <li key={p} className="flex items-center gap-3 text-ink/85">
            <Check className="h-4 w-4 shrink-0 text-forest" />
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
        <CtaButton href={whatsappHref}>Start your free trial</CtaButton>
        <span className="label-mono text-ink/60">14 days free · no card</span>
      </div>
    </div>

    <HeroBloom />
  </section>
);

/* ------------------------------------------------------------------ */
/*  How it works + example conversation                                */
/* ------------------------------------------------------------------ */

const Bubble: FC<{ line: ChatLine }> = ({ line }) => {
  const mine = line.who === "you";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.95rem] leading-snug shadow-sm ${
          mine ? "rounded-br-sm bg-[#d9fdd3] text-ink" : "rounded-bl-sm bg-white text-ink"
        }`}
      >
        {line.meta && <p className="label-mono mb-1 text-[0.6rem] text-ink/50">{line.meta}</p>}
        <p>{line.text}</p>
      </div>
    </div>
  );
};

const ExampleChat: FC = () => (
  <figure className="overflow-hidden rounded-2xl border border-ink/12 bg-[#efeae2]">
    <div className="flex items-center gap-3 bg-forest px-5 py-3 text-paper">
      <span className="relative h-8 w-8 overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_30%,#5f8ea0,#2e6b40_55%,#ed5a14)]" />
      <div>
        <p className="font-display font-semibold leading-none">Orbit</p>
        <p className="mt-1 text-xs text-paper/70">your PM</p>
      </div>
    </div>
    <div className="flex flex-col gap-3 p-5">
      {EXAMPLE_CHAT.map((line, i) => (
        <Bubble key={i} line={line} />
      ))}
    </div>
    <figcaption className="label-mono border-t border-ink/10 bg-paper-2 px-5 py-3 text-[0.6rem] text-ink/55">
      Example conversation
    </figcaption>
  </figure>
);

const HowItWorks: FC = () => (
  <section id="how" className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
    <SectionHead
      kicker="How it works"
      title="Talk to it like a friend. It keeps the deadlines."
      sub="Most task apps die because you stop opening them. Orbit lives in the chat you already open all day, and it reaches out first."
    />

    <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_minmax(320px,460px)] lg:items-start">
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-ink/12 bg-ink/10">
        {STEPS.map((s) => (
          <li key={s.n} className="bg-paper p-6 md:p-8">
            <p className="label-mono text-orange">{s.n}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2 max-w-[55ch] text-ink/75">{s.body}</p>
          </li>
        ))}
      </ol>

      <ExampleChat />
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Testimonial + positioning restraint                                */
/* ------------------------------------------------------------------ */

const Testimonial: FC = () => (
  <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
    <div className="grid gap-10 border-t border-ink/25 pt-12 lg:grid-cols-[1.3fr_0.7fr]">
      <div>
        <p className="label-mono text-orange">From an early user</p>
        <blockquote className="mt-6 font-display text-2xl font-medium leading-snug text-ink md:text-3xl">
          &ldquo;Seeing notifications reminding me about a task I am supposed to complete helps my
          productivity. I&rsquo;m always on WhatsApp.&rdquo;
        </blockquote>
        <p className="label-mono mt-6 text-ink/60">Freelance developer, Orbit beta</p>
      </div>

      <div className="border-ink/15 lg:border-l lg:pl-8">
        <p className="label-mono text-forest">One job. On purpose.</p>
        <p className="mt-4 text-lg leading-relaxed text-ink/75">
          Orbit won&rsquo;t be your therapist, your calendar, or your CRM. It remembers your
          projects, tracks your deadlines, and nudges you before something slips. That&rsquo;s the
          whole job.
        </p>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Pricing                                                            */
/* ------------------------------------------------------------------ */

const Pricing: FC<{ whatsappHref: string }> = ({ whatsappHref }) => (
  <section id="pricing" className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
    <SectionHead
      kicker="Pricing"
      title="Less than one missed deadline costs you."
      sub="Start free. Orbit sends you a payment link near the end of your trial, right in the chat."
    />

    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {PLANS.map((plan) => (
        <div
          key={plan.name}
          className={`flex flex-col rounded-2xl border p-6 md:p-8 ${
            plan.highlight ? "border-ink bg-ink text-paper" : "border-ink/15 bg-paper"
          }`}
        >
          <p className={`label-mono ${plan.highlight ? "text-orange" : "text-ink/60"}`}>{plan.name}</p>
          <p className="mt-4 font-display text-5xl font-bold tracking-tight">{plan.price}</p>
          <p className={`mt-1 text-sm ${plan.highlight ? "text-paper/70" : "text-ink/60"}`}>{plan.cadence}</p>
          <p className={`mt-4 text-sm ${plan.highlight ? "text-paper/85" : "text-ink/75"}`}>{plan.note}</p>
          <ul className="mt-6 flex flex-col gap-2.5 text-sm">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-orange" : "text-forest"}`} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
      <CtaButton href={whatsappHref}>Start your 14-day trial</CtaButton>
      <span className="text-sm text-ink/60">Every plan starts with the free trial.</span>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

const FaqSection: FC = () => (
  <section id="faq" className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
    <SectionHead kicker="FAQ" title="Questions people ask first" />
    <div className="mt-6 divide-y divide-ink/15">
      {FAQS.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-semibold">
            {f.q}
            <span
              aria-hidden
              className="text-2xl leading-none text-ink/50 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-[70ch] text-ink/75">{f.a}</p>
        </details>
      ))}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  CTA footer                                                         */
/* ------------------------------------------------------------------ */

const CtaFooter: FC<{ whatsappHref: string }> = ({ whatsappHref }) => (
  <section id="app" className="mx-auto max-w-[1400px] px-6 pb-20 md:px-12">
    <div className="relative overflow-hidden rounded-2xl bg-ink px-6 py-24 text-center text-paper">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 opacity-[0.6]"
        style={{
          backgroundImage: "repeating-conic-gradient(rgba(255,255,255,0.05) 0% 25%, transparent 0% 50%)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to left, black, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to left, black, transparent 80%)",
        }}
      />

      <div className="relative">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
          Stop keeping deadlines in your head.
        </h2>

        <p className="mx-auto mt-6 max-w-[48ch] text-lg text-paper/75">
          Say hi to Orbit on WhatsApp, tell it what you're working on this week, and let it do the
          remembering.
        </p>

        <CtaButton href={whatsappHref} tone="paper" className="mt-10 px-8 py-4">
          Start free on WhatsApp
        </CtaButton>

        <p className="label-mono mt-4 text-orange">14 days free · no card needed</p>
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
      <Grain blend="multiply" className="fixed inset-0 z-50 opacity-[0.04]" />
      <TrialBanner href={whatsappHref} />
      <Nav whatsappHref={whatsappHref} />
      <main>
        <Hero whatsappHref={whatsappHref} />
        <HowItWorks />
        <Testimonial />
        <Pricing whatsappHref={whatsappHref} />
        <FaqSection />
        <CtaFooter whatsappHref={whatsappHref} />
      </main>
    </div>
  );
};

export default ChromaLanding;
