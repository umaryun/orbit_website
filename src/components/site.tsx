import { useEffect } from "react";
import type { CSSProperties, FC, ReactNode } from "react";
import { WHATSAPP_DISPLAY, WHATSAPP_LINK } from "../config";

/* ------------------------------------------------------------------ */
/*  Motion: section entrances                                          */
/* ------------------------------------------------------------------ */

/**
 * Arms `[data-reveal]` entrances once JS runs (html.js) and reveals each element
 * as its top enters the viewport. Anything already scrolled past (a jump to
 * #pricing, a footer link) is revealed too, so nothing stays hidden.
 * Without JS, or with reduced motion, everything is simply visible.
 */
export function useReveal(): void {
  useEffect(() => {
    document.documentElement.classList.add("js");
    let pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let frame = 0;
    const check = () => {
      frame = 0;
      const line = window.innerHeight * 0.92;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < line) {
          el.classList.add("is-in");
          return false;
        }
        return true;
      });
      if (!pending.length) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}

/** Stagger helper: `{...reveal(2)}` delays the entrance by two 80ms beats. */
export const reveal = (beat = 0): { "data-reveal": true; style: CSSProperties } => ({
  "data-reveal": true,
  style: { "--d": `${beat * 80}ms` } as CSSProperties,
});

/* ------------------------------------------------------------------ */
/*  Atoms                                                              */
/* ------------------------------------------------------------------ */

/** Orbit's logo: the silhouette circled by its orbit. Decorative wherever the name sits beside it. */
export const Mark: FC<{ className?: string }> = ({ className = "h-7 w-7" }) => (
  <img src="/logo.jpg" alt="" width={256} height={256} className={`shrink-0 rounded-full bg-white object-cover ${className}`} />
);

type Tone = "orange" | "ink" | "paper";
const TONES: Record<Tone, string> = {
  orange: "bg-orange text-ink hover:bg-[#ff6d27]",
  ink: "bg-ink text-paper hover:bg-ink-3",
  paper: "bg-paper text-ink hover:bg-white",
};

export const Arrow: FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/** The one button shape on the site: a flat rectangle, 48px tall. */
export const Button: FC<{
  href: string;
  children: ReactNode;
  tone?: Tone;
  external?: boolean;
  className?: string;
}> = ({ href, children, tone = "orange", external = true, className = "" }) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={`group inline-flex min-h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-tile px-6 font-display text-step-base font-semibold transition-[background-color,transform] duration-200 active:scale-[0.97] ${TONES[tone]} ${className}`}
  >
    {children}
    <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  </a>
);

/** A plain text link that answers the pointer with its underline. */
export const TextLink: FC<{ href: string; children: ReactNode; className?: string; external?: boolean }> = ({
  href,
  children,
  className = "",
  external = false,
}) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={`underline decoration-current/30 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-current ${className}`}
  >
    {children}
  </a>
);

/* ------------------------------------------------------------------ */
/*  WhatsApp fragments (real interface, marked data-ui)                */
/* ------------------------------------------------------------------ */

export interface Msg {
  from: "me" | "orbit" | string;
  text: ReactNode;
  time?: string;
  meta?: string;
}

/** One message bubble. `from` is "me" (right), "orbit", or a group member's name. */
export const Bubble: FC<{ m: Msg; group?: boolean; className?: string }> = ({ m, group, className = "" }) => {
  const mine = m.from === "me";
  const name = !mine && group ? (m.from === "orbit" ? "Orbit" : m.from) : null;
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} ${className}`}>
      <div
        className={`max-w-[88%] rounded-lg px-3 py-2 text-[0.875rem] leading-snug text-ink ${
          mine ? "rounded-tr-none bg-wa-out" : "rounded-tl-none bg-white"
        }`}
      >
        {name && (
          <p className={`mb-0.5 text-[0.8125rem] font-semibold ${m.from === "orbit" ? "text-forest" : "text-signal"}`}>{name}</p>
        )}
        {m.meta && <p className="mb-1 text-[0.8125rem] text-ink-soft">{m.meta}</p>}
        <div className="whitespace-pre-line">{m.text}</div>
        {m.time && <p className="mt-0.5 text-right text-[0.8125rem] leading-none text-ink-soft tnum">{m.time}</p>}
      </div>
    </div>
  );
};

export const ChatHead: FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <div className="flex items-center gap-3 bg-wa-head px-4 py-3 text-paper">
    <Mark className="h-9 w-9" />
    <div className="min-w-0">
      <p className="truncate font-display text-[0.9375rem] font-semibold leading-tight">{title}</p>
      <p className="truncate text-[0.8125rem] text-paper/75">{sub}</p>
    </div>
  </div>
);

export const Typing: FC = () => (
  <div className="flex justify-start" aria-label="Orbit is typing">
    <div className="flex gap-1 rounded-lg rounded-tl-none bg-white px-3 py-3">
      {[0, 150, 300].map((d) => (
        <span key={d} className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-soft" style={{ animationDelay: `${d}ms` }} />
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Intro: a lead paragraph over four columns                          */
/* ------------------------------------------------------------------ */

export const LeadColumns: FC<{
  id?: string;
  heading: string;
  lead: ReactNode;
  columns: { runIn: string; text: string }[];
}> = ({ id, heading, lead, columns }) => (
  <section id={id} className="px-5 py-16 md:px-8 md:py-24">
    <h2 {...reveal(0)} className="max-w-[18ch] text-step-lg font-bold">
      {heading}
    </h2>
    <p {...reveal(1)} className="mt-8 max-w-[62ch] text-step-md text-ink">
      {lead}
    </p>
    <div className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map((c, i) => (
        <p key={c.runIn} {...reveal(2 + i)} className="text-step-base text-ink-soft">
          <strong className="font-semibold text-ink">{c.runIn}</strong> {c.text}
        </p>
      ))}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  How it works: the stages as one bar                                */
/* ------------------------------------------------------------------ */

export interface Stage {
  duration: string;
  clause: string;
  grow: number;
  tone: string;
}

export const StagesBar: FC<{ id?: string; heading: string; stages: Stage[] }> = ({ id, heading, stages }) => (
  <section id={id} className="px-3 py-16 md:py-24">
    <h2 {...reveal(0)} className="px-2 text-step-xl font-bold md:px-5">
      {heading}
    </h2>
    <ol className="mt-16 flex flex-col gap-1.5 lg:flex-row" data-ui>
      {stages.map((s, i) => (
        <li key={s.duration} className="flex flex-col lg:min-w-[12%]" style={{ flexGrow: s.grow, flexBasis: 0 }}>
          <div {...reveal(1 + i)} className={`flex min-h-[88px] items-start rounded-tile p-5 lg:h-[22vh] lg:min-h-[180px] ${s.tone}`}>
            <p className="font-display text-step-md font-semibold">{s.duration}</p>
          </div>
          <p {...reveal(2 + i)} className="mt-3 mb-5 max-w-[30ch] px-1 text-step-base text-ink lg:mb-0">
            {s.clause}
          </p>
        </li>
      ))}
    </ol>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Pricing: plans as a large table                                    */
/* ------------------------------------------------------------------ */

export interface PlanCol {
  name: string;
  price: string;
  period: string;
  recommended?: boolean;
  cta: { label: string; href: string };
}

export const PlanTable: FC<{
  id?: string;
  heading: string;
  sub?: ReactNode;
  plans: PlanCol[];
  rows: { label: string; values: string[] }[];
}> = ({ id, heading, sub, plans, rows }) => {
  const col = (i: number) => (plans[i].recommended ? "bg-orange text-ink" : "");
  return (
    <section id={id} className="px-3 py-16 md:py-24">
      {/* Desktop: one large table */}
      <div {...reveal(0)} className="hidden overflow-hidden rounded-tile lg:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{heading}</caption>
          <thead>
            <tr className="align-top">
              <th scope="col" className="w-1/3 p-6 pb-10">
                <h2 className="text-step-lg font-bold">{heading}</h2>
                {sub && <p className="mt-4 max-w-[36ch] text-step-base font-normal text-ink-soft">{sub}</p>}
              </th>
              {plans.map((p, i) => (
                <th key={p.name} scope="col" className={`p-6 pb-10 ${col(i)} ${i === 0 ? "" : ""}`}>
                  <p className="font-display text-step-md font-bold">{p.name}</p>
                  <p className="mt-3 font-display text-step-lg font-normal tnum">
                    {p.price}
                  </p>
                  <p className="mt-2 text-step-base font-normal">{p.period}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.label} className={ri % 2 === 0 ? "bg-paper-2" : ""}>
                <th scope="row" className="px-6 py-5 font-display text-step-base font-semibold">
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td key={i} className={`px-6 py-5 text-step-base ${col(i)}`}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-6" />
              {plans.map((p, i) => (
                <td key={p.name} className={`p-6 ${col(i)}`}>
                  <Button href={p.cta.href} tone={p.recommended ? "ink" : "orange"}>
                    {p.cta.label}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Phone and tablet: one block per plan */}
      <div className="lg:hidden">
        <h2 className="px-2 text-step-lg font-bold">{heading}</h2>
        {sub && <p className="mt-4 px-2 text-step-base text-ink-soft">{sub}</p>}
        <div className="mt-8 grid gap-4">
          {plans.map((p, i) => (
            <div key={p.name} {...reveal(i)} className={`flex flex-col rounded-tile p-6 ${p.recommended ? "bg-orange" : "bg-paper-2"}`}>
              <h3 className="text-step-lg font-bold">{p.name}</h3>
              <p className="mt-2 font-display text-step-lg tnum">{p.price}</p>
              <p className="mt-2 text-step-base">{p.period}</p>
              <dl className="mt-6 mb-8 flex flex-col gap-4">
                {rows.map((r) => (
                  <div key={r.label}>
                    <dt className={`text-step-base ${p.recommended ? "text-ink/75" : "text-ink-soft"}`}>{r.label}</dt>
                    <dd className="text-step-base font-medium">{r.values[i]}</dd>
                  </div>
                ))}
              </dl>
              <Button href={p.cta.href} tone={p.recommended ? "ink" : "orange"} className="mt-auto w-full">
                {p.cta.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  FAQ: a band per question, every answer visible                     */
/* ------------------------------------------------------------------ */

export const FaqBands: FC<{ id?: string; heading: string; items: { q: string; a: ReactNode }[] }> = ({
  id,
  heading,
  items,
}) => (
  <section id={id} aria-labelledby={`${id}-h`}>
    <div className="flex min-h-[30svh] items-end bg-forest px-5 pt-16 pb-8 text-paper md:min-h-[40svh] md:px-8 md:pb-10">
      <h2 id={`${id}-h`} {...reveal(0)} className="text-step-xl font-bold">
        {heading}
      </h2>
    </div>
    {items.map((f, i) => (
      <div key={f.q} className={`grid gap-4 px-5 py-8 md:px-8 md:py-12 lg:grid-cols-12 lg:gap-6 ${i % 2 ? "bg-paper-2" : "bg-paper"}`}>
        <h3 {...reveal(0)} className="text-step-md font-bold lg:col-span-5">
          {f.q}
        </h3>
        <div {...reveal(1)} className="max-w-[60ch] text-step-base text-ink lg:col-span-6 lg:col-start-7">
          {f.a}
        </div>
      </div>
    ))}
  </section>
);

/* ------------------------------------------------------------------ */
/*  Close: the action tile row                                         */
/* ------------------------------------------------------------------ */

export const ActionRow: FC<{ heading: string; text: ReactNode; action: ReactNode; left: ReactNode; right: ReactNode }> = ({
  heading,
  text,
  action,
  left,
  right,
}) => (
  <section aria-label={heading} className="overflow-hidden py-16 md:py-24">
    <div className="grid grid-cols-2 gap-2 lg:-mx-12 lg:grid-cols-12 lg:gap-3">
      <div className="order-2 h-[120px] overflow-hidden rounded-tile lg:order-1 lg:col-span-2 lg:h-[380px]">{left}</div>
      <div
        {...reveal(0)}
        className="order-1 col-span-2 mx-3 flex min-h-[300px] flex-col justify-center rounded-tile bg-orange p-8 text-ink lg:order-2 lg:col-span-8 lg:mx-0 lg:h-[380px] lg:p-12"
      >
        <h2 className="max-w-[20ch] text-step-lg font-bold">{heading}</h2>
        <p className="mt-4 max-w-[52ch] text-step-base">{text}</p>
        <div className="mt-8">{action}</div>
      </div>
      <div className="order-3 h-[120px] overflow-hidden rounded-tile lg:col-span-2 lg:h-[380px]">{right}</div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Footer: the mark, built large                                      */
/* ------------------------------------------------------------------ */

const LETTERS: { ch: string; h: string; tone: string }[] = [
  { ch: "O", h: "100%", tone: "bg-orange text-ink" },
  { ch: "R", h: "78%", tone: "bg-forest text-paper" },
  { ch: "B", h: "90%", tone: "bg-signal text-paper" },
  { ch: "I", h: "64%", tone: "bg-blossom text-ink" },
  { ch: "T", h: "84%", tone: "bg-paper text-ink" },
];

export const SiteFooter: FC<{ columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] }> = ({
  columns,
}) => (
  <footer className="bg-ink px-3 pt-3 pb-8 text-paper">
    <div role="img" aria-label="Orbit" className="flex h-[22svh] items-end gap-1 md:h-[34svh]">
      {LETTERS.map((l) => (
        <div
          key={l.ch}
          className={`flex flex-1 items-end justify-start rounded-tile px-3 pb-2 font-display text-[clamp(3.5rem,13vw,13rem)] leading-[0.8] font-bold tracking-tight ${l.tone}`}
          style={{ height: l.h }}
        >
          {l.ch}
        </div>
      ))}
    </div>
    <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 px-2 md:px-5 lg:grid-cols-12">
      {columns.map((c) => (
        <div key={c.title} className="lg:col-span-2">
          <h2 className="font-display text-step-base font-semibold">{c.title}</h2>
          <ul className="mt-3 flex flex-col gap-2 text-step-sm text-on-ink-soft">
            {c.links.map((l) => (
              <li key={l.label}>
                <TextLink href={l.href} external={l.external} className="hover:text-paper">
                  {l.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="col-span-2 lg:col-span-4 lg:col-start-9">
        <h2 className="font-display text-step-base font-semibold">Talk to Orbit</h2>
        <p className="mt-3 text-step-sm text-on-ink-soft">
          WhatsApp{" "}
          <TextLink href={WHATSAPP_LINK} external className="text-paper">
            {WHATSAPP_DISPLAY}
          </TextLink>
          <br />
          Save the number as “Orbit” so you know who's texting.
        </p>
      </div>
    </div>
    <div className="mt-12 flex items-center justify-between gap-4 px-2 text-step-sm text-on-ink-soft md:px-5">
      <p>© {new Date().getFullYear()} Orbit</p>
      <a
        href="#top"
        className="inline-flex min-h-11 items-center rounded-tile bg-ink-3 px-4 text-paper transition-colors hover:bg-forest"
      >
        Back to top
      </a>
    </div>
  </footer>
);
