import { useMemo, useState } from "react";
import type { FC, ReactNode } from "react";
import { BOOK_CALL_URL, PATHS, WHATSAPP_LINK } from "../config";
import {
  ActionRow,
  Bubble,
  Button,
  ChatHead,
  FaqBands,
  LeadColumns,
  PlanTable,
  SiteFooter,
  StagesBar,
  TextLink,
  Typing,
  reveal,
  useReveal,
} from "../components/site";
import { Hero, VoiceNote } from "../components/hero";
import type { Beat, HeroCard } from "../components/hero";

/* ------------------------------------------------------------------ */
/*  Hero: one morning in the group, played out                         */
/* ------------------------------------------------------------------ */

const HERO_BEATS: Beat[] = [
  { kind: "msg", m: { from: "Kemi", text: "Orbit, assign the vendor payments report to Ada, due Friday 12:00", time: "10:12" } },
  {
    kind: "msg",
    m: { from: "orbit", text: "Done. Vendor payments report is with Ada in Finance ops, due Fri 30 Oct at 12:00. I've let her know.", time: "10:12" },
    typing: 1500,
  },
  { kind: "msg", m: { from: "Tobi", text: <VoiceNote length="0:42" />, time: "11:03" }, wait: 1500 },
  { kind: "msg", m: { from: "orbit", text: "Moved Payments dashboard filters to In review, Tobi. Settlement alerts is yours, due Mon 2 Nov.", time: "11:03" }, typing: 1400 },
  { kind: "msg", m: { from: "Chidi", text: "thanks Orbit", time: "11:05" }, wait: 1400 },
  { kind: "note", text: "No reply. Nothing needed one.", wait: 1100 },
  { kind: "msg", m: { from: "Kemi", text: "Orbit, status?", time: "11:20" }, wait: 1500 },
  {
    kind: "msg",
    m: {
      from: "orbit",
      text: "23 open, 2 overdue, 1 blocked. Month-end close checklist is 2 days late; I've followed up with Ada twice.",
      time: "11:20",
    },
    typing: 1400,
  },
];

const HERO_CARDS: HeroCard[] = [
  {
    after: 1,
    node: (
      <div>
        <p className="text-[0.8125rem] text-ink-soft">Private chat · to Ada</p>
        <p className="mt-1 text-step-sm font-semibold">New task assigned in Ops team</p>
        <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">Vendor payments report · due Fri 30 Oct, 12:00</p>
      </div>
    ),
  },
  {
    after: 3,
    node: (
      <div>
        <p className="text-[0.8125rem] text-ink-soft">Board</p>
        <p className="mt-1 text-step-sm font-semibold">Payments dashboard filters</p>
        <p className="mt-2 flex items-center gap-2 text-[0.8125rem]">
          <span className="rounded-tile bg-signal px-2 py-0.5 text-paper line-through decoration-paper/70">In progress</span>
          <span aria-hidden>→</span>
          <span className="rounded-tile bg-blossom px-2 py-0.5 text-ink">In review</span>
        </p>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  The board: every task the group handed out                          */
/* ------------------------------------------------------------------ */

type Status = "Done" | "In progress" | "In review" | "Overdue" | "Blocked" | "Pending";
const STATUS_TONE: Record<Status, string> = {
  Done: "bg-forest text-paper",
  "In progress": "bg-signal text-paper",
  "In review": "bg-blossom text-ink",
  Overdue: "bg-orange text-ink",
  Blocked: "bg-paper text-ink",
  Pending: "bg-ink-3 text-paper",
};

interface Row {
  task: string;
  who: string;
  project: string;
  due: string;
  status: Status;
  trail: string;
}

const ROWS: readonly Row[] = [
  {
    task: "Q3 invoice reconciliation",
    who: "Kemi",
    project: "Finance ops",
    due: "Mon 26 Oct",
    status: "Done",
    trail: "Kemi replied “done” to the heads-up Orbit sent the day before. It counts toward this week's completions on the dashboard.",
  },
  {
    task: "Payments dashboard filters",
    who: "Tobi",
    project: "Payments dashboard",
    due: "Today 16:00",
    status: "In review",
    trail: "Tobi said in a voice note that the filters are done. Orbit moved the task to In review without anyone typing a thing.",
  },
  {
    task: "Bank onboarding flow",
    who: "Ben",
    project: "Bank onboarding",
    due: "Thu 29 Oct",
    status: "In progress",
    trail: "Ben dragged it across on the console's board. The group gets the same answer the next time anyone asks “Orbit, status”.",
  },
  {
    task: "Month-end close checklist",
    who: "Ada",
    project: "Finance ops",
    due: "Mon 26 Oct",
    status: "Overdue",
    trail: "Ada got a heads-up the day before, a follow-up once it was late and another a day after. No answer, so at 17:05 Kemi, the manager, is told.",
  },
  {
    task: "KYC document upload",
    who: "Ben",
    project: "Bank onboarding",
    due: "Fri 30 Oct",
    status: "Blocked",
    trail: "Ben answered his follow-up with “blocked by the bank's API keys”. Orbit stopped chasing him and told Kemi privately, with the reason.",
  },
  {
    task: "Vendor payments report",
    who: "Ada",
    project: "Finance ops",
    due: "Fri 30 Oct",
    status: "In progress",
    trail: "Kemi assigned it in the group on Monday and Ada got the details in a private message. Her heads-up goes out Thursday at 12:00.",
  },
  {
    task: "Settlement alerts",
    who: "Tobi",
    project: "Payments dashboard",
    due: "Mon 2 Nov",
    status: "Pending",
    trail: "Nobody named a project, so Orbit filed it under Tobi's main one and said so in its reply. Ask it to move the task if that's wrong.",
  },
  {
    task: "Refund policy page",
    who: "Chidi",
    project: "Chidi's tasks",
    due: "Tue 3 Nov",
    status: "Pending",
    trail: "Chidi joined last week and isn't on a project yet, so his work sits in “Chidi's tasks”. When he joins one, it moves with him.",
  },
  {
    task: "Merchant FAQ update",
    who: "Chidi",
    project: "Website",
    due: "Fri 23 Oct",
    status: "Done",
    trail: "Finished last week. Done work stays on the board for 14 days so the team can see what shipped, then it drops off.",
  },
];

const StatusBlock: FC<{ s: Status; onAccent?: boolean }> = ({ s, onAccent }) => (
  <span
    className={`inline-flex h-10 min-w-[7.5rem] items-center justify-center rounded-tile px-3 font-display text-step-sm font-semibold md:min-w-[8.5rem] ${
      onAccent && s === "Overdue" ? "bg-ink text-paper" : STATUS_TONE[s]
    }`}
  >
    {s}
  </span>
);

const CONSOLE_PAGES: readonly { name: string; text: string }[] = [
  { name: "Dashboard", text: "Open, done, overdue, blocked and escalated work, per team or across all of them." },
  { name: "Board", text: "Drag tasks between columns, filter by person or project, nudge someone in one click." },
  { name: "Check-ins", text: "Each day's answers, who hasn't replied, the summary and the last 14 days." },
  { name: "Docs", text: "Every file shared in the group, with search across what's inside them." },
  { name: "People", text: "Who's a manager, who has muted Orbit, and whose workload needs attention." },
];

const Board: FC = () => {
  const [open, setOpen] = useState(3);
  return (
    <section id="board" aria-labelledby="board-h" className="bg-ink py-16 text-paper md:py-24">
      <div className="grid gap-6 px-5 md:px-8 lg:grid-cols-12">
        <h2 id="board-h" {...reveal(0)} className="text-step-lg font-bold lg:col-span-6">
          From the group chat to one board
        </h2>
        <p {...reveal(1)} className="max-w-[48ch] text-step-base text-on-ink-soft lg:col-span-5 lg:col-start-8 lg:self-end">
          Say it the way you'd say it to a colleague. Orbit files the task to the right person and project, with a deadline,
          and the web console shows it all live. Tap a row to see what Orbit did.
        </p>
      </div>

      <div data-ui className="relative mt-14 overflow-hidden px-2 md:px-3">
        <ul className="flex flex-col gap-1" aria-label="Ops team board">
          {ROWS.map((r, i) => {
            const isOpen = i === open;
            return (
              <li key={r.task} {...reveal(Math.min(i, 6))}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(i)}
                  className={`grid w-full grid-cols-[1fr_auto] items-center gap-4 rounded-tile px-4 text-left transition-colors duration-300 md:grid-cols-12 md:px-5 ${
                    isOpen ? "min-h-[200px] bg-orange py-5 text-ink md:min-h-[216px]" : "min-h-16 bg-ink-2 hover:bg-ink-3 md:min-h-[72px]"
                  }`}
                >
                  <span className={`font-display font-semibold tracking-tight md:col-span-4 ${isOpen ? "text-step-md lg:text-step-lg" : "text-step-base md:text-step-md"}`}>
                    {r.task}
                  </span>
                  <span className={`hidden text-step-base md:col-span-2 md:block lg:text-step-md ${isOpen ? "" : "text-on-ink-soft"}`}>{r.who}</span>
                  <span className={`hidden text-step-base md:col-span-2 md:block lg:text-step-md ${isOpen ? "" : "text-on-ink-soft"}`}>{r.project}</span>
                  <span className={`hidden text-step-base tnum md:col-span-2 md:block lg:text-step-md ${isOpen ? "" : "text-on-ink-soft"}`}>{r.due}</span>
                  <span className="justify-self-end md:col-span-2">
                    <StatusBlock s={r.status} onAccent={isOpen} />
                  </span>
                  {isOpen && (
                    <span className="col-span-2 flex flex-col gap-1 text-step-base md:col-span-12 md:max-w-[80ch]">
                      <span className="md:hidden">
                        {r.who} · {r.project} · due {r.due}
                      </span>
                      <span>{r.trail}</span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-20 px-5 md:px-8">
        <h3 {...reveal(0)} className="max-w-[30ch] text-step-md font-semibold">
          The web console, for when you want the whole picture
        </h3>
        <p {...reveal(1)} className="mt-3 max-w-[60ch] text-step-base text-on-ink-soft">
          Message Orbit “open console” for a sign-in link. No passwords: you sign in with a WhatsApp message, and any
          change you make there is the same change in the chat.
        </p>
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {CONSOLE_PAGES.map((p, i) => (
            <li key={p.name} {...reveal(i)}>
              <p className="font-display text-step-md font-semibold">{p.name}</p>
              <p className="mt-2 text-step-sm text-on-ink-soft">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  What Orbit does all day: staggered fragment cells                  */
/* ------------------------------------------------------------------ */

interface Cell {
  title: string;
  text: string;
  fragment: ReactNode;
}

const Thread: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div data-ui className={`flex min-h-[220px] flex-col justify-center gap-1.5 bg-wa-bg p-3 ${className}`}>
    {children}
  </div>
);

const CELLS: readonly Cell[] = [
  {
    title: "Daily check-ins, in private",
    text: "At the time you pick, Orbit asks everyone three questions in a private chat. Once all have answered, or two hours later, one summary goes to the group.",
    fragment: (
      <Thread>
        <Bubble
          group
          m={{
            from: "orbit",
            text: (
              <>
                <b>Daily check-in · Ops team</b>
                {"\n"}• Ada: Q3 recon closed, vendor report next{"\n"}• Ben: KYC upload blocked on the bank's API keys{"\n"}• Tobi: settlement alerts, due Monday{"\n"}• Kemi: reviewing the bank onboarding flow
              </>
            ),
            time: "09:40",
          }}
        />
      </Thread>
    ),
  },
  {
    title: "Voice notes, in any language",
    text: "Talk instead of typing. Orbit transcribes voice notes in the group and in private, in whatever language they're spoken, and acts on what was said.",
    fragment: (
      <Thread>
        <Bubble group m={{ from: "Tobi", meta: "Voice note · 0:42", text: "“Filters are done. I'll start settlement alerts tomorrow, should take till Monday.”", time: "11:03" }} />
        <Bubble group m={{ from: "orbit", text: "Moved Payments dashboard filters to In review. Settlement alerts is yours, due Mon 2 Nov.", time: "11:03" }} />
      </Thread>
    ),
  },
  {
    title: "It reads your documents",
    text: "Share a PDF or Word file in the group and Orbit reads it, so anyone can ask about it weeks later. The console lists every file and searches inside them.",
    fragment: (
      <Thread>
        <Bubble group m={{ from: "Ben", meta: "Vendor agreement.pdf · 14 pages", text: "Here's the signed contract", time: "16:02" }} />
        <Bubble group m={{ from: "Ada", text: "Orbit, what's the notice period to end it?", time: "16:38" }} />
        <Bubble group m={{ from: "orbit", text: "60 days in writing, per section 12 of Vendor agreement.pdf.", time: "16:38" }} />
      </Thread>
    ),
  },
  {
    title: "Quiet unless it's called",
    text: "Orbit answers when someone says its name, tags it or replies to it. Thanks, thumbs-ups and passing mentions get nothing back, and group replies stay short.",
    fragment: (
      <Thread>
        <Bubble group m={{ from: "Chidi", text: "thanks Orbit", time: "12:15" }} />
        <Bubble group m={{ from: "Ada", text: "I'll ask Orbit about the fees later", time: "12:16" }} />
        <p className="py-1 text-center text-[0.8125rem] text-ink-soft">No reply. Nothing needed one.</p>
        <Bubble group m={{ from: "Kemi", text: "Orbit, who's on the refund page?", time: "12:20" }} />
        <Typing />
      </Thread>
    ),
  },
  {
    title: "Undo, and who changed what",
    text: "Every change to a task or project is recorded. “Orbit, undo” reverses your last one, and “who moved this deadline?” gets a straight answer.",
    fragment: (
      <Thread>
        <Bubble group m={{ from: "Kemi", text: "Orbit, who moved the KYC deadline?", time: "10:41" }} />
        <Bubble
          group
          m={{
            from: "orbit",
            text: "Ben moved KYC document upload from Wed 28 Oct to Fri 30 Oct, yesterday at 18:02, in his private chat with me.",
            time: "10:41",
          }}
        />
      </Thread>
    ),
  },
  {
    title: "It learns how your team talks",
    text: "For its first 15 days Orbit picks up your field and your words from the group, never your tone or mood. A manager can also just tell it.",
    fragment: (
      <div data-ui className="bg-paper p-5 text-ink">
        <p className="text-step-sm text-ink-soft">Work style · Ops team</p>
        <p className="mt-2 font-display text-[1.25rem] font-semibold">Finance operations</p>
        <p className="mt-1 text-step-sm text-ink-soft">Technical level: mixed</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {["month-end close", "recon", "settlement", "KYC", "vendor run", "float"].map((t) => (
            <li key={t} className="rounded-tile bg-paper-3 px-2.5 py-1 text-step-sm">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-step-sm text-ink-soft">Manager note: “we call it month-end close, not month end”</p>
      </div>
    ),
  },
];

const Features: FC = () => (
  <section id="features" aria-labelledby="features-h" className="px-3 py-16 md:py-24">
    <h2 id="features-h" {...reveal(0)} className="px-2 text-step-lg font-bold md:px-5">
      What Orbit does all day
    </h2>
    <div className="mt-14 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      {CELLS.map((c, i) => {
        // Checkerboard: row one runs text, fragment, text; row two the reverse.
        const fragmentFirst = i < 3 ? i % 2 === 1 : i % 2 === 0;
        return (
          <article
            key={c.title}
            {...reveal(i % 3)}
            className={`flex min-h-[440px] flex-col overflow-hidden rounded-tile bg-paper-2 ${fragmentFirst ? "lg:flex-col-reverse" : ""}`}
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

/* ------------------------------------------------------------------ */
/*  Follow-ups: a live demo of the ladder                               */
/* ------------------------------------------------------------------ */

// Hours from Mon 2 Nov 00:00 (Ada's time). Rules mirror orbit_teams' followups.py:
// heads-up 24h before, follow-up once overdue, again 24h later, managers 24h after that;
// only 09:00–18:30 in the person's timezone; muted people aren't chased, and a day
// after the deadline the managers are told they muted Orbit.
const DAY_NAMES = ["Mon 02 Nov", "Tue 03 Nov", "Wed 04 Nov", "Thu 05 Nov", "Fri 06 Nov"];
const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const T_MIN = 9;
const T_MAX = 4 * 24 + 18;

const clock = (t: number) => {
  const h = Math.floor(t % 24);
  const m = Math.round((t % 1) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
const stamp = (t: number) => `${SHORT_DAYS[Math.floor(t / 24)] ?? "Sat"} ${clock(t)}`;

/** The first moment at or after `t` inside working hours (09:00–18:30). */
const nextWorking = (t: number) => {
  const day = Math.floor(t / 24);
  const hod = t - day * 24;
  if (hod < 9) return day * 24 + 9;
  if (hod > 18.5) return (day + 1) * 24 + 9;
  return t;
};

/** "today at 12:00", "tomorrow at 20:00", "yesterday at 12:00" or "Tue 03 Nov at 12:00". */
const dueLabel = (due: number, at: number) => {
  const diff = Math.floor(due / 24) - Math.floor(at / 24);
  const c = clock(due);
  if (diff === 0) return `today at ${c}`;
  if (diff === 1) return `tomorrow at ${c}`;
  if (diff === -1) return `yesterday at ${c}`;
  return `${DAY_NAMES[Math.floor(due / 24)]} at ${c}`;
};

const overdueLabel = (due: number, at: number) => {
  const hours = Math.floor(at - due);
  if (hours < 24) return `${Math.max(hours, 1)} hour${hours === 1 ? "" : "s"}`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
};

interface LadderMsg {
  at: number;
  to: "Ada" | "Kemi" | "from-Ada" | "reply";
  label: string;
  text: ReactNode;
}

function buildLadder(evening: boolean, muted: boolean, replies: boolean): LadderMsg[] {
  const due = 24 + (evening ? 20 : 12); // Tuesday
  const title = <b>Expense audit</b>;
  const out: LadderMsg[] = [];

  if (muted) {
    const esc = nextWorking(due + 24);
    if (replies) {
      const done = nextWorking(due + 2);
      out.push({ at: done, to: "from-Ada", label: "Ada", text: "done, sent it to finance this morning" });
      out.push({ at: done + 0.02, to: "reply", label: "Orbit to Ada", text: <>Marked {title} as done. Thank you, Ada.</> });
      return out;
    }
    out.push({
      at: esc,
      to: "Kemi",
      label: "Orbit to Kemi, manager",
      text: (
        <>
          {title} (Finance ops), assigned to Ada, is {overdueLabel(due, esc)} overdue. Ada muted Orbit, so I haven't chased them.
          Reply here to reassign it, move the deadline, or say 'nudge them again'.
        </>
      ),
    });
    return out;
  }

  const remind = nextWorking(due - 24);
  if (remind < due) {
    out.push({
      at: remind,
      to: "Ada",
      label: "Orbit to Ada",
      text: (
        <>
          Heads-up: {title} (Finance ops) is due {dueLabel(due, remind)}. Reply here if you need more time or something is blocking it.
        </>
      ),
    });
  }
  const f1 = nextWorking(due);
  out.push({
    at: f1,
    to: "Ada",
    label: "Orbit to Ada",
    text: (
      <>
        {title} (Finance ops) was due {dueLabel(due, f1)}. Is it done, do you need more time, or is something blocking it?
        {"\n\n"}
        <i>Reply 'mute' to pause these follow-ups.</i>
      </>
    ),
  });
  if (replies) {
    const done = nextWorking(f1 + 1);
    out.push({ at: done, to: "from-Ada", label: "Ada", text: "done, sent it to finance this morning" });
    out.push({ at: done + 0.02, to: "reply", label: "Orbit to Ada", text: <>Marked {title} as done. Thank you, Ada.</> });
    return out;
  }
  const f2 = nextWorking(f1 + 24);
  out.push({
    at: f2,
    to: "Ada",
    label: "Orbit to Ada",
    text: (
      <>
        Checking again on {title} (Finance ops), due {dueLabel(due, f2)}. A quick 'done', 'need until &lt;day&gt;' or 'blocked by …'
        is all I need.
      </>
    ),
  });
  const esc = nextWorking(f2 + 24);
  out.push({
    at: esc,
    to: "Kemi",
    label: "Orbit to Kemi, manager",
    text: (
      <>
        {title} (Finance ops), assigned to Ada, is {overdueLabel(due, esc)} overdue. It hasn't been updated after two follow-ups.
        Reply here to reassign it, move the deadline, or say 'nudge them again'.
      </>
    ),
  });
  return out;
}

const Toggle: FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-step-sm">
    <span>{label}</span>
    <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span
      aria-hidden
      className="relative h-6 w-11 shrink-0 rounded-full bg-paper-3 transition-colors peer-checked:bg-forest peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
    />
  </label>
);

const FollowUpDemo: FC = () => {
  const [now, setNow] = useState(3 * 24 + 13);
  const [evening, setEvening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [replies, setReplies] = useState(false);
  const ladder = useMemo(() => buildLadder(evening, muted, replies), [evening, muted, replies]);
  const shown = ladder.filter((m) => m.at <= now);
  const next = ladder.find((m) => m.at > now);

  return (
    <section id="follow-ups" aria-labelledby="fu-h" className="px-3 py-16 md:py-24">
      <div>
        <div className="grid gap-6 px-2 md:px-5 lg:grid-cols-12">
          <h2 id="fu-h" {...reveal(0)} className="text-step-lg font-bold lg:col-span-7">
            Chasing deadlines, minus the awkwardness
          </h2>
          <p {...reveal(1)} className="max-w-[46ch] text-step-base text-ink lg:col-span-5 lg:self-end">
            Nobody likes asking a colleague for the third time. Orbit does it in private, at sensible hours, and only tells the
            managers when the follow-ups go unanswered. Move the clock and see the week play out.
          </p>
        </div>

        <div {...reveal(2)} className="mt-12 grid overflow-hidden rounded-tile bg-paper-2 lg:grid-cols-[62fr_38fr]">
          {/* The product doing its job */}
          <div data-ui className="flex min-h-[520px] flex-col bg-wa-bg">
            <ChatHead title="Expense audit" sub={`Due Tue 03 Nov at ${evening ? "20:00" : "12:00"} · Ada · Finance ops`} />
            <div className="flex flex-1 flex-col justify-end gap-2 p-4" aria-live="polite">
              {shown.length === 0 && (
                <p className="m-auto max-w-[32ch] text-center text-step-sm text-ink-soft">
                  {muted ? "Ada has muted Orbit, so there's no heads-up. " : ""}Nothing sent yet. Next: {next ? `${stamp(next.at)}, ${next.label.toLowerCase()}` : "nothing"}.
                </p>
              )}
              {shown.map((m) => (
                <div key={`${m.at}-${m.to}`} className="bubble-in">
                  <Bubble
                    m={{
                      from: m.to === "from-Ada" ? "me" : "orbit",
                      meta: m.to === "from-Ada" ? `Ada · ${stamp(m.at)}` : `${m.label} · ${stamp(m.at)}`,
                      text: m.text,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* The controls */}
          <div className="flex flex-col gap-1 p-5 md:p-6">
            <div className="py-2">
              <label htmlFor="fu-now" className="flex items-center justify-between text-step-sm">
                <span>Now</span>
                <span className="font-display text-step-base font-semibold tnum">{stamp(now)}</span>
              </label>
              <input
                id="fu-now"
                type="range"
                min={T_MIN}
                max={T_MAX}
                step={1}
                value={now}
                onChange={(e) => setNow(Number(e.target.value))}
                className="mt-3 h-11 w-full cursor-pointer accent-orange"
              />
            </div>
            <Toggle label="Due in the evening (20:00)" checked={evening} onChange={setEvening} />
            <Toggle label="Ada has muted Orbit" checked={muted} onChange={setMuted} />
            <Toggle label="Ada replies “done”" checked={replies} onChange={setReplies} />
            <div className="flex min-h-11 items-center justify-between text-step-sm">
              <span>Working hours</span>
              <span className="tnum">09:00–18:30, Ada's time</span>
            </div>
            <div className="flex min-h-11 items-center justify-between text-step-sm">
              <span>Manager</span>
              <span>Kemi</span>
            </div>
            <div className="mt-2 rounded-tile bg-paper p-4 text-step-sm">
              <p className="text-ink-soft">Next message</p>
              <p className="mt-1 font-medium">{next ? `${stamp(next.at)}, ${next.label}` : "None. The ladder is finished."}</p>
            </div>
            <TextLink href="#faq" className="mt-auto pt-6 text-step-sm">
              Who gets private messages, and how to mute them
            </TextLink>
          </div>
        </div>
        <p className="mt-5 px-2 text-step-sm text-ink-soft md:px-5">
          Each step is sent once, never twice. Moving the deadline starts the ladder again; blocked and finished tasks aren't chased.
        </p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const PROBLEMS = [
  {
    runIn: "Assignments sink.",
    text: "“Ada, can you take the vendor report?” is forty messages up by lunch. Nobody wrote down who said yes, or by when.",
  },
  {
    runIn: "Nobody wants to chase.",
    text: "Asking a colleague for the third time feels petty, so nobody does. The deadline passes quietly and turns up at the review.",
  },
  {
    runIn: "Standups flood the chat.",
    text: "Ten people posting yesterday, today and blockers buries the one message that needed an answer. So the standup quietly stops.",
  },
  {
    runIn: "Managers hear last.",
    text: "The overdue task, the blocker, the deadline that moved: it reaches the manager when it's already a problem, often from the client.",
  },
];

const STAGES = [
  { duration: "Thirty minutes", clause: "First, a call. We look at how your team hands out work and set Orbit up with you.", grow: 1, tone: "bg-orange text-ink" },
  { duration: "Two minutes", clause: "Then add Orbit's number to your WhatsApp group. It reads the members and says hello.", grow: 1, tone: "bg-signal text-paper" },
  { duration: "One message", clause: "Next, tell it who's on what: “Orbit, projects: Tobi, Payments dashboard; Ada, Finance ops”.", grow: 1.4, tone: "bg-blossom text-ink" },
  { duration: "Every working day after", clause: "From then on it assigns, reminds, follows up and sums up, in the group and in private.", grow: 6, tone: "bg-forest text-paper" },
];

const PLANS = [
  { name: "Team", price: "Per team", period: "agreed on a call", cta: { label: "Book a call", href: BOOK_CALL_URL } },
  { name: "Organisation", price: "Volume", period: "for several teams", recommended: true, cta: { label: "Book a call", href: BOOK_CALL_URL } },
  { name: "Enterprise", price: "Custom", period: "terms and invoicing to suit", cta: { label: "Talk to us", href: BOOK_CALL_URL } },
];

const PLAN_ROWS = [
  { label: "WhatsApp groups", values: ["One", "One per team", "As many as you need"] },
  { label: "People", values: ["Everyone in the group", "Everyone in every group", "Everyone in every group"] },
  { label: "Tasks, follow-ups, check-ins", values: ["Included", "Included", "Included"] },
  { label: "Documents and voice notes", values: ["Included", "Included", "Included"] },
  { label: "Web console", values: ["Included", "Included, across all teams", "Included, across all teams"] },
  { label: "Setup", values: ["Together on the call", "Each team set up with its lead", "A planned rollout by department"] },
  { label: "Support", values: ["On WhatsApp", "A direct line to the founder", "A named contact"] },
  { label: "Billing", values: ["Monthly", "Monthly or yearly", "Yearly, by invoice"] },
];

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "Does everyone need to install something?",
    a: "No. Orbit is a WhatsApp number you add to the group, and everyone keeps using WhatsApp. The web console is optional, and signing in to it is a WhatsApp message, not a password.",
  },
  {
    q: "Will it reply to everything we say?",
    a: "No. It answers when someone says “Orbit”, tags it or replies to one of its messages. Thanks, thumbs-ups and passing mentions get no reply, and its group messages are kept short.",
  },
  {
    q: "Who gets private messages from Orbit?",
    a: "People hear from Orbit privately when they're given a task, for their daily check-in, and when their deadline is near or past. Anyone can reply “mute” to pause nudges and follow-ups; task assignments and reminders they set themselves still arrive.",
  },
  {
    q: "Who counts as a manager?",
    a: "The group's WhatsApp admins, automatically, and you can change it: “Orbit, make Ben a manager”. Managers hear about overdue work and blockers. Being one never limits what anyone else in the team can do.",
  },
  {
    q: "Can the group see my private chats with Orbit?",
    a: "No. In the group, Orbit only uses the team's projects, tasks and shared documents. Your personal projects and notes stay in your private chat, and the console never shows one member's private work to another.",
  },
  {
    q: "What languages does it understand?",
    a: "Voice notes are transcribed in whatever language they're spoken. Orbit always replies in English, in the same polished tone, however casual the group gets.",
  },
  {
    q: "How is Orbit Teams priced?",
    a: (
      <>
        Per team, agreed on a short call while self-serve billing for teams is being built. Working alone?{" "}
        <TextLink href={PATHS.home}>Orbit for freelancers</TextLink> starts free on WhatsApp, no call needed.
      </>
    ),
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Orbit Teams",
    links: [
      { label: "The board", href: "#board" },
      { label: "Follow-ups", href: "#follow-ups" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Orbit",
    links: [
      { label: "For freelancers", href: PATHS.home },
      { label: "Pricing", href: `${PATHS.home}#pricing` },
      { label: "FAQ", href: `${PATHS.home}#faq` },
    ],
  },
  {
    title: "Start",
    links: [
      { label: "Book a Teams call", href: BOOK_CALL_URL, external: true },
      { label: "Try Orbit on your own", href: WHATSAPP_LINK, external: true },
    ],
  },
];

const Teams: FC = () => {
  useReveal();
  return (
    <div id="top" className="min-h-svh overflow-x-clip bg-paper text-ink">
      <main>
        <Hero
          brand="Orbit Teams"
          homeHref={PATHS.teams}
          links={[
            { label: "For freelancers", href: PATHS.home },
            { label: "How it works", href: "#how" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ]}
          navAction={{ label: "Book a call", href: BOOK_CALL_URL }}
          title={["The project manager", "in your group chat."]}
          sub="Orbit joins your team's WhatsApp group. It hands out the work, follows up on deadlines in private, runs daily check-ins and keeps a live board on the web. Nobody installs anything."
          actions={<Button href={BOOK_CALL_URL}>Book a call</Button>}
          note="Pricing agreed on the call"
          chat={{ title: "Ops team", sub: "Kemi, Ada, Ben, Tobi, Chidi, Orbit", group: true, beats: HERO_BEATS }}
          cards={HERO_CARDS}
          ticker={{
            label: "Things teams say to Orbit",
            items: [
              "Orbit, assign the vendor report to Ada, due Friday",
              "Orbit, status",
              "Orbit, my tasks",
              "Orbit, undo",
              "Orbit, make Ben a manager",
              "Orbit, move check-ins to 10:00",
              "Orbit, who moved the KYC deadline?",
              "Orbit, what does the contract say about late fees?",
              "Orbit, my project is Payments dashboard",
              "nudge them again",
              "Orbit, turn on daily check-ins",
            ],
          }}
        />

        <LeadColumns
          id="problem"
          heading="The group chat is where work gets lost."
          lead="Your team already runs its work in a WhatsApp group. Jobs are handed out between voice notes and memes, deadlines live in someone's head, and the only way to know where things stand is to ask. Again."
          columns={PROBLEMS}
        />

        <Board />

        <StagesBar id="how" heading="Running by tomorrow" stages={STAGES} />

        <FollowUpDemo />

        <Features />

        <PlanTable
          id="pricing"
          heading="Priced with you"
          sub="Self-serve billing for teams isn't open yet. Every plan starts with a 30-minute call, then we set Orbit up in your group together."
          plans={PLANS}
          rows={PLAN_ROWS}
        />

        <FaqBands id="faq" heading="Before you ask" items={FAQS} />

        <ActionRow
          heading="Bring Orbit into your group"
          text="Thirty minutes on a call: we look at how your team hands out work today, agree a price, and add Orbit to your group together."
          action={<Button href={BOOK_CALL_URL} tone="ink">Book a call</Button>}
          left={
            <div data-ui className="flex h-full flex-col justify-end gap-1.5 bg-wa-bg p-3">
              <Bubble group m={{ from: "orbit", text: "Hello team, I'm Orbit, your project manager here in Ops team. I keep track of who's doing what and by when.", time: "09:00" }} />
            </div>
          }
          right={<img src="/hero-bg.jpg" alt="Orbit's mark: a silhouette in profile, circled by a glowing orbit" width={1200} height={1200} loading="lazy" className="h-full w-full object-cover" />}
        />
      </main>
      <SiteFooter columns={FOOTER_COLUMNS} />
    </div>
  );
};

export default Teams;
