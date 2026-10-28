import type { FC, ReactNode } from "react";
import { BOOK_CALL_URL, PATHS, useWhatsAppHref } from "../config";
import { Hero, VoiceNote } from "../components/hero";
import type { Beat, HeroCard } from "../components/hero";
import {
  ActionRow,
  Bubble,
  Button,
  FaqBands,
  LeadColumns,
  PlanTable,
  SiteFooter,
  StagesBar,
  TextLink,
  reveal,
  useReveal,
} from "../components/site";

/* ------------------------------------------------------------------ */
/*  Hero: one conversation, played out                                 */
/* ------------------------------------------------------------------ */

const HERO_BEATS: Beat[] = [
  { kind: "day", label: "Tuesday" },
  { kind: "msg", m: { from: "me", text: <VoiceNote length="0:38" />, time: "16:20" }, wait: 700 },
  {
    kind: "msg",
    m: {
      from: "orbit",
      text: (
        <>
          Got it. Added to <b>Acme</b>: Stripe checkout, due Fri. Added to <b>Tunde</b>: dashboard fixes, due Thu. Want me to check
          in Thursday morning?
        </>
      ),
      time: "16:20",
    },
    typing: 1600,
  },
  { kind: "msg", m: { from: "me", text: "Yes please", time: "16:22" }, wait: 1500 },
  { kind: "msg", m: { from: "orbit", text: "Done. I'll message you Thu at 09:00.", time: "16:22" }, typing: 900 },
  { kind: "day", label: "Thursday", wait: 1600 },
  { kind: "msg", m: { from: "orbit", text: "Morning! Stripe checkout for Acme is due tomorrow. Still on track?", time: "09:00" }, typing: 1000, wait: 600 },
  { kind: "msg", m: { from: "me", text: "yes, just the webhooks left", time: "09:07" }, wait: 1400 },
];

const TaskLine: FC<{ title: string; meta: string; tone: string }> = ({ title, meta, tone }) => (
  <p className="flex items-center gap-2 text-[0.8125rem]">
    <span className={`h-2 w-2 shrink-0 rounded-full ${tone}`} aria-hidden />
    <span className="font-semibold">{title}</span>
    <span className="truncate text-ink-soft">{meta}</span>
  </p>
);

const HERO_CARDS: HeroCard[] = [
  {
    after: 2,
    node: (
      <div className="flex flex-col gap-1">
        <p className="text-[0.8125rem] text-ink-soft">Added to your tasks</p>
        <TaskLine title="Stripe checkout" meta="Acme · due Fri 30 Oct" tone="bg-orange" />
        <TaskLine title="Dashboard fixes" meta="Tunde · due Thu 29 Oct" tone="bg-signal" />
      </div>
    ),
  },
  {
    after: 4,
    node: (
      <div className="flex flex-col gap-1">
        <p className="text-[0.8125rem] text-ink-soft">Check-in scheduled</p>
        <p className="text-step-sm font-semibold">Thu 29 Oct, 09:00</p>
        <p className="text-[0.8125rem] text-ink-soft">Stripe checkout · Acme</p>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */

const TwoWays: FC<{ whatsappHref: string }> = ({ whatsappHref }) => (
  <section aria-labelledby="ways-h" className="px-3 pt-16 md:pt-24">
    <h2 id="ways-h" {...reveal(0)} className="px-2 text-step-lg font-bold md:px-5">
      One Orbit, two ways in
    </h2>
    <div className="mt-12 grid gap-2 lg:grid-cols-12">
      <article {...reveal(1)} className="flex min-h-[380px] flex-col rounded-tile bg-paper-2 p-6 md:p-8 lg:col-span-5">
        <h3 className="font-display text-step-md font-semibold">On your own</h3>
        <p className="mt-3 max-w-[44ch] text-step-base text-ink">
          For freelance developers and solo founders juggling clients. Orbit keeps your projects, tasks and deadlines in a private
          WhatsApp chat and texts you before anything slips.
        </p>
        <p className="mt-6 font-display text-step-lg font-bold tnum">₦3,500</p>
        <p className="text-step-sm text-ink-soft">a month for founding members, after 14 free days</p>
        <div className="mt-auto pt-8">
          <Button href={whatsappHref}>Start free on WhatsApp</Button>
        </div>
      </article>
      <article {...reveal(2)} className="flex min-h-[380px] flex-col rounded-tile bg-forest p-6 text-paper md:p-8 lg:col-span-7">
        <h3 className="font-display text-step-md font-semibold">With your team</h3>
        <p className="mt-3 max-w-[50ch] text-step-base text-paper">
          Orbit Teams joins your team's WhatsApp group. It assigns work in plain words, follows up on deadlines privately, runs
          daily check-ins and tells managers what's slipping, for teams in finance, operations, engineering and more.
        </p>
        <ul className="mt-6 grid gap-x-6 gap-y-2 text-step-base sm:grid-cols-2">
          {["Assignments from the group chat", "A follow-up ladder, in private", "Daily check-ins, one summary", "A live board for managers"].map(
            (t) => (
              <li key={t} className="text-paper">
                {t}
              </li>
            ),
          )}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
          <Button href={PATHS.teams} tone="paper" external={false}>
            See Orbit Teams
          </Button>
          <TextLink href={BOOK_CALL_URL} external className="text-step-base text-paper">
            or book a call
          </TextLink>
        </div>
      </article>
    </div>
  </section>
);

interface Cell {
  title: string;
  text: string;
  fragment: ReactNode;
}

const Thread: FC<{ children: ReactNode }> = ({ children }) => (
  <div data-ui className="flex min-h-[220px] flex-col justify-center gap-1.5 bg-wa-bg p-3">
    {children}
  </div>
);

const CELLS: readonly Cell[] = [
  {
    title: "Voice notes become tasks",
    text: "Talk after a client call the way you'd tell a friend. Orbit files each thing under the right project with a due date, in any language you speak it.",
    fragment: (
      <Thread>
        <Bubble m={{ from: "me", meta: "Voice note · 0:38", text: "“Acme want the Stripe checkout live by Friday…”", time: "16:20" }} />
        <Bubble m={{ from: "orbit", text: "Added to Acme: Stripe checkout, due Fri 30 Oct.", time: "16:20" }} />
      </Thread>
    ),
  },
  {
    title: "It texts you first",
    text: "A plan in the morning, a nudge before a deadline, a follow-up when you said you were blocked, and a Friday recap of what shipped.",
    fragment: (
      <Thread>
        <Bubble m={{ from: "orbit", text: "Morning! Stripe checkout for Acme is due tomorrow. Still on track?", time: "09:02" }} />
        <Bubble m={{ from: "me", text: "Yes please, check again at 4", time: "09:10" }} />
      </Thread>
    ),
  },
  {
    title: "It reads your specs",
    text: "Send a PRD as a PDF, Word or Markdown file. Orbit reads it into the project, answers questions about it and turns features into tasks.",
    fragment: (
      <Thread>
        <Bubble m={{ from: "me", meta: "Acme_PRD_v3.pdf · 9 pages", text: "this is the spec", time: "11:41" }} />
        <Bubble m={{ from: "orbit", text: "Read it. Want checkout broken into tasks with dates?", time: "11:42" }} />
      </Thread>
    ),
  },
  {
    title: "Client updates, drafted",
    text: "Ask for an update and Orbit drafts one from what you finished, what's in progress and what's next, with your internal notes left out.",
    fragment: (
      <Thread>
        <Bubble m={{ from: "orbit", text: "Draft for Acme:\n“Cart and order emails are done. Checkout goes live Friday; refunds follow next week.”", time: "17:30" }} />
      </Thread>
    ),
  },
  {
    title: "Memory you can see",
    text: "Orbit remembers the client details and decisions you mention. Ask what it knows any time, and tell it to forget anything that's wrong.",
    fragment: (
      <Thread>
        <Bubble m={{ from: "me", text: "what do you know about Acme?", time: "13:12" }} />
        <Bubble m={{ from: "orbit", text: "Next.js + Stripe on Vercel. Sade signs off on design. Updates on Fridays.", time: "13:12" }} />
      </Thread>
    ),
  },
  {
    title: "Reminders, to the minute",
    text: "“Remind me to invoice Tunde Monday at 10.” One-off or every weekday, in your own timezone, delivered in the chat you already have open.",
    fragment: (
      <Thread>
        <Bubble m={{ from: "me", text: "remind me to invoice Tunde on Monday at 10", time: "18:04" }} />
        <Bubble m={{ from: "orbit", text: "Done. I'll message you Mon at 10:00.", time: "18:04" }} />
      </Thread>
    ),
  },
];

const Features: FC = () => (
  <section id="features" aria-labelledby="features-h" className="px-3 py-16 md:py-24">
    <h2 id="features-h" {...reveal(0)} className="px-2 text-step-lg font-bold md:px-5">
      Talk to it like a friend. It keeps the deadlines.
    </h2>
    <div className="mt-14 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      {CELLS.map((c, i) => {
        const fragmentFirst = i < 3 ? i % 2 === 1 : i % 2 === 0;
        return (
          <article
            key={c.title}
            {...reveal(i % 3)}
            className={`flex min-h-[420px] flex-col overflow-hidden rounded-tile bg-paper-2 ${fragmentFirst ? "lg:flex-col-reverse" : ""}`}
          >
            <div className="p-6">
              <h3 className="text-step-md font-semibold">{c.title}</h3>
              <p className="mt-2 text-step-base text-ink-soft">{c.text}</p>
            </div>
            <div className={`mt-auto ${fragmentFirst ? "lg:mt-0 lg:mb-auto" : ""} ${i % 2 ? "ml-6 md:ml-10" : "mr-6 md:mr-10"}`}>
              <div className="overflow-hidden rounded-tile">{c.fragment}</div>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

/** A slice of the solo console's dashboard, built at true size. */
const ConsoleFragment: FC = () => (
  <div data-ui className="grid overflow-hidden rounded-tile bg-paper text-ink md:grid-cols-[200px_1fr]">
    <nav aria-label="Console pages (example)" className="hidden flex-col gap-1 bg-paper-2 p-4 text-step-sm md:flex">
      {["Dashboard", "Tasks", "Projects", "Reminders", "Settings", "Billing", "Privacy"].map((p, i) => (
        <span key={p} className={`rounded-tile px-3 py-2 ${i === 0 ? "bg-paper font-semibold" : "text-ink-soft"}`}>
          {p}
        </span>
      ))}
    </nav>
    <div className="p-5 md:p-6">
      <p className="font-display text-step-md font-semibold">Good to see you, Tola</p>
      <p className="text-step-sm text-ink-soft">Wednesday 28 October · Lagos</p>
      <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ["Open", "12"],
          ["Due today", "2"],
          ["Overdue", "1"],
          ["Blocked", "0"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-tile bg-paper-2 p-3">
            <dt className="text-step-sm text-ink-soft">{k}</dt>
            <dd className="mt-1 font-display text-step-md font-semibold tnum">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-step-sm font-semibold">Top priority</p>
      <ul className="mt-2 flex flex-col gap-1.5 text-step-sm">
        {[
          ["Stripe webhooks", "Acme", "Overdue · was due yesterday", "bg-orange"],
          ["Dashboard fixes", "Tunde", "Due today at 17:00", "bg-signal"],
          ["Checkout copy review", "Acme", "Due Fri 30 Oct", "bg-paper-3"],
        ].map(([t, p, d, tone]) => (
          <li key={t} className="flex items-center gap-3 rounded-tile bg-paper-2 px-3 py-2.5">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone}`} aria-hidden />
            <span className="font-medium">{t}</span>
            <span className="text-ink-soft">{p}</span>
            <span className="ml-auto hidden text-ink-soft tnum sm:inline">{d}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const ConsoleSection: FC = () => (
  <section id="console" aria-labelledby="console-h" className="bg-ink px-3 py-16 text-paper md:py-24">
    <div className="grid gap-10 px-2 md:px-5 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-5">
        <h2 id="console-h" {...reveal(0)} className="text-step-lg font-bold">
          Your whole week on one screen
        </h2>
        <p {...reveal(1)} className="mt-6 max-w-[46ch] text-step-base text-paper">
          WhatsApp is where you talk to Orbit. The web console is where you see everything at once: what's due, what's overdue,
          each project's board, your reminders, your plan and receipts.
        </p>
        <p {...reveal(2)} className="mt-4 max-w-[46ch] text-step-base text-on-ink-soft">
          Send “open console” and Orbit replies with a one-time sign-in link. No password. From the Privacy page you can
          download everything Orbit holds about you, or delete your account.
        </p>
      </div>
      <div {...reveal(2)} className="lg:col-span-7">
        <ConsoleFragment />
      </div>
    </div>
  </section>
);

const Quote: FC = () => (
  <section aria-labelledby="quote-h" className="px-3 py-16 md:py-24">
    <h2 id="quote-h" className="sr-only">
      What early users say
    </h2>
    <div className="grid gap-2 lg:grid-cols-12">
      <figure {...reveal(0)} className="flex min-h-[340px] flex-col justify-between rounded-tile bg-blossom p-6 md:p-10 lg:col-span-8">
        <blockquote className="max-w-[32ch] font-display text-step-md font-medium">
          “Seeing notifications reminding me about a task I am supposed to complete helps my productivity. I'm always on WhatsApp.”
        </blockquote>
        <figcaption className="mt-8 text-step-base">Freelance developer, Orbit beta</figcaption>
      </figure>
      <div {...reveal(1)} className="flex flex-col rounded-tile bg-paper-2 p-6 md:p-8 lg:col-span-4">
        <h3 className="font-display text-step-md font-semibold">One job, on purpose</h3>
        <p className="mt-4 text-step-base text-ink">
          Orbit won't be your therapist, your calendar or your CRM. It remembers your projects, tracks your deadlines, and nudges you
          before something slips. That's the whole job.
        </p>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const PROBLEMS = [
  {
    runIn: "Notes scatter.",
    text: "Voice memos, sticky notes, a Notion page you stopped opening in March. What you need is never in the one you check.",
  },
  {
    runIn: "Task apps go quiet.",
    text: "You set one up on Sunday and by Wednesday you're back to remembering. An app only works if you remember to open it.",
  },
  {
    runIn: "Clients notice first.",
    text: "The first sign something slipped is a polite message asking how it's going. By then the afternoon is gone.",
  },
  {
    runIn: "Fridays surprise you.",
    text: "Without a look back at the week, you don't see what slipped until the invoice, or the client, points it out.",
  },
];

const STAGES = [
  { duration: "Ten seconds", clause: "First, tap the button and say hi. Orbit asks your name and works out your timezone.", grow: 1, tone: "bg-orange text-ink" },
  { duration: "One voice note", clause: "Then tell it this week's work, the way you'd tell a friend over the phone.", grow: 1.5, tone: "bg-signal text-paper" },
  { duration: "Every day after", clause: "From then on it plans your mornings, nudges before deadlines and follows up when you're stuck.", grow: 6, tone: "bg-forest text-paper" },
];

const PLAN_ROWS = [
  { label: "Projects and tasks", values: ["Unlimited", "Unlimited", "Unlimited"] },
  { label: "Voice notes and PRD uploads", values: ["Included", "Included", "Included"] },
  { label: "Morning plans, nudges, reminders", values: ["Included", "Included", "Included"] },
  { label: "Client-ready updates", values: ["Included", "Included", "Included"] },
  { label: "Web console", values: ["Included", "Included", "Included"] },
  { label: "Who it's for", values: ["Everyone, to start", "The first 25 people", "Everyone after the trial"] },
  { label: "The fine print", values: ["No card needed", "Price never goes up; a short feedback call each month", "₦50,000 a year, or $8 a month outside Nigeria"] },
];

const FAQS = (whatsappHref: string): { q: string; a: ReactNode }[] => [
  {
    q: "Do I need to install anything?",
    a: "No. Orbit is a WhatsApp chat. Tap the button, say hi, and it asks your name and timezone. Save the number as “Orbit” so you know who's texting.",
  },
  {
    q: "Is there a web version?",
    a: "Yes. Send Orbit “open console” and it replies with a one-time sign-in link to your console: a dashboard, your tasks and projects, reminders, settings, billing and privacy. Everything there is the same data as the chat.",
  },
  {
    q: "What does Orbit remember about me?",
    a: "Your projects, tasks, deadlines and the details you mention about them. Ask “what do you know about me?” any time, and tell it to delete anything that's wrong. The console lets you download all of it, or delete your account.",
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
    a: "By card through Paystack: in naira in Nigeria, $8 a month elsewhere. Monthly plans renew automatically; to cancel, message Orbit or use the Billing page in the console. The yearly plan can also be paid by transfer.",
  },
  {
    q: "Can my team use it too?",
    a: (
      <>
        Yes, with <TextLink href={PATHS.teams}>Orbit Teams</TextLink>. It joins your team's WhatsApp group, hands out work and
        follows up with everyone privately. Teams pricing is set on a call; your own plan stays as it is.{" "}
        <TextLink href={whatsappHref} external>
          Your own trial
        </TextLink>{" "}
        starts right away.
      </>
    ),
  },
];

const Home: FC = () => {
  useReveal();
  const whatsappHref = useWhatsAppHref();

  const footerColumns = [
    {
      title: "Orbit",
      links: [
        { label: "How it works", href: "#how" },
        { label: "Web console", href: "#console" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Orbit Teams",
      links: [
        { label: "Overview", href: PATHS.teams },
        { label: "Follow-ups", href: `${PATHS.teams}#follow-ups` },
        { label: "Pricing", href: `${PATHS.teams}#pricing` },
      ],
    },
    {
      title: "Start",
      links: [
        { label: "Start free on WhatsApp", href: whatsappHref, external: true },
        { label: "Book a Teams call", href: BOOK_CALL_URL, external: true },
      ],
    },
  ];

  return (
    <div id="top" className="min-h-svh overflow-x-clip bg-paper text-ink">
      <main>
        <Hero
          brand="Orbit"
          homeHref={PATHS.home}
          links={[
            { label: "For teams", href: PATHS.teams },
            { label: "How it works", href: "#how" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ]}
          navAction={{ label: "Start free", href: whatsappHref }}
          title={["Your project", "manager, on WhatsApp."]}
          sub="Send a voice note after a client call. Orbit turns it into tasks with deadlines and texts you before anything slips. No new app to open."
          actions={<Button href={whatsappHref}>Start free on WhatsApp</Button>}
          note="14 days free, no card"
          chat={{ title: "Orbit", sub: "your project manager", beats: HERO_BEATS }}
          cards={HERO_CARDS}
        />

        <TwoWays whatsappHref={whatsappHref} />

        <LeadColumns
          id="problem"
          heading="Deadlines don't slip. They get forgotten."
          lead="When you're juggling three clients, the work isn't the hard part. Remembering is: what Acme asked for on Tuesday's call, what you promised Tunde, and which one is due first."
          columns={PROBLEMS}
        />

        <StagesBar id="how" heading="Set up in one chat" stages={STAGES} />

        <Features />

        <ConsoleSection />

        <Quote />

        <PlanTable
          id="pricing"
          heading="Start free"
          sub={
            <>
              Every plan starts with 14 free days, no card. Near the end Orbit sends a payment link in the chat, and the price is less than one missed deadline. Running a team?{" "}
              <TextLink href={PATHS.teams}>Orbit Teams</TextLink> is priced on a call.
            </>
          }
          plans={[
            { name: "Free trial", price: "₦0", period: "for 14 days", cta: { label: "Start free", href: whatsappHref } },
            { name: "Founding", price: "₦3,500", period: "a month, locked for life", recommended: true, cta: { label: "Claim a spot", href: whatsappHref } },
            { name: "Pro", price: "₦5,000", period: "a month", cta: { label: "Start with the trial", href: whatsappHref } },
          ]}
          rows={PLAN_ROWS}
        />

        <FaqBands id="faq" heading="Fair questions" items={FAQS(whatsappHref)} />

        <ActionRow
          heading="Let Orbit do the remembering"
          text="Stop keeping deadlines in your head. Say hi to Orbit on WhatsApp and tell it what you're working on this week. 14 days free, no card."
          action={<Button href={whatsappHref} tone="ink">Start free on WhatsApp</Button>}
          left={<img src="/hero-bg.jpg" alt="Silhouette of a man in profile against a pale wall" width={1026} height={935} loading="lazy" className="h-full w-full object-cover" />}
          right={<div className="h-full bg-forest" />}
        />
      </main>
      <SiteFooter columns={footerColumns} />
    </div>
  );
};

export default Home;
