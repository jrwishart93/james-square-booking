import { ArrowRight, ArrowUp, BookOpen, Building2, HandCoins, Landmark, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { Accordion, ExternalLink, copyClass, focusRing, glassPanel, h2Class } from "./ui";
import { FIOR_COMPANY, LINKS, SOURCES_CHECKED_ON } from "./claimPrepSources";
import { POLICE_LINKS } from "./policeInfo";

// FAQ, "What would you like to do?" and official resources for /fior-info.
// Court procedure answers link to the live SCTS guidance rather than repeating
// figures that may change.

const internalLink = `inline-flex items-center gap-1 rounded font-semibold text-sky-700 underline decoration-sky-400/50 underline-offset-4 hover:decoration-sky-600 dark:text-sky-300 dark:hover:decoration-sky-300 ${focusRing}`;

function InternalLink({ href, children, up }: { href: string; children: React.ReactNode; up?: boolean }) {
  const Icon = up ? ArrowUp : ArrowRight;
  return (
    <a href={href} className={internalLink}>
      {children}
      <Icon className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "What happened to FIOR?",
    a: (
      <>
        <p>
          FIOR Property Assets ceased acting as factor for James Square at the end of January 2026. Myreside Management
          took over from 1 February 2026.
        </p>
        <p>
          <InternalLink href="#part-1" up>
            Read the background
          </InternalLink>
        </p>
      </>
    ),
  },
  {
    q: "Does FIOR owe me money?",
    a: (
      <>
        <p>James Square cannot determine whether money is legally owed to an individual owner.</p>
        <p>
          If you believe you made payments which should be returned, Part 2 explains how you can request repayment and
          consider your options if the matter remains unresolved.
        </p>
        <p>
          <InternalLink href="#part-2">Recovering your money</InternalLink>
        </p>
      </>
    ),
  },
  {
    q: "Will the Owners Committee recover my money for me?",
    a: (
      <>
        <p>No. Money potentially owed directly to an individual owner is separate from communal James Square funds.</p>
        <p>
          Individual owners are responsible for deciding what action, if any, they wish to take regarding their own
          payments.
        </p>
      </>
    ),
  },
  {
    q: "What is happening with communal James Square money?",
    a: (
      <p>
        Communal funds are separate from individual owner claims. Myreside Management has been pursuing the transfer and
        recovery of outstanding communal funds from the previous factor on behalf of the development. The outcome of that
        process cannot be guaranteed.
      </p>
    ),
  },
  {
    q: "Should I contact Police Scotland?",
    a: (
      <>
        <p>
          If you believe you have information which may be relevant to the existing enquiry, particularly regarding
          payments towards proposed works which were not carried out or other circumstances which concern you, you can
          make Police Scotland aware of your circumstances.
        </p>
        <p>Police Scotland will determine whether the information is relevant to its enquiry.</p>
        <p>
          <InternalLink href="#part-3">Police Scotland information</InternalLink>
        </p>
      </>
    ),
  },
  {
    q: "Will Police Scotland recover my money?",
    a: (
      <>
        <p>A police enquiry and recovery of a civil debt are separate matters.</p>
        <p>Providing information to Police Scotland should not be treated as a method of obtaining repayment.</p>
        <p>
          <InternalLink href="#part-2">Recovering your money</InternalLink>
        </p>
      </>
    ),
  },
  {
    q: "Can I make a Simple Procedure claim and contact Police Scotland?",
    a: (
      <p>
        They are separate processes. An owner may decide to provide information to Police Scotland while also
        considering their options for recovering money they believe is due to them. Whether to do either, or both, is a
        decision for each owner.
      </p>
    ),
  },
  {
    q: "What is Simple Procedure?",
    a: (
      <>
        <p>
          Simple Procedure is a Scottish sheriff court process which can be used for certain civil claims, including
          eligible claims seeking payment of £5,000 or less.
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <ExternalLink href={LINKS.simpleProcedure.href}>Official SCTS Simple Procedure guidance</ExternalLink>
          <InternalLink href="#part-2b">Prepare your claim</InternalLink>
        </p>
      </>
    ),
  },
  {
    q: "Is Simple Procedure free?",
    a: (
      <>
        <p>
          No. A court fee will normally apply when submitting a claim, although some people may qualify for exemption.
          Check the current fee on the official Scottish Courts website before you submit.
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <ExternalLink href={LINKS.fees.href}>Check current court fees</ExternalLink>
          <ExternalLink href={LINKS.feeExemption.href}>{LINKS.feeExemption.label}</ExternalLink>
        </p>
      </>
    ),
  },
  {
    q: "Do I need a solicitor?",
    a: (
      <>
        <p>
          No. The Scottish Courts and Tribunals Service allows individuals to represent themselves in Simple Procedure and
          a solicitor is not compulsory. You can still choose to obtain legal advice or representation.
        </p>
        <p>
          <ExternalLink href={LINKS.guide.href}>{LINKS.guide.label}</ExternalLink>
        </p>
      </>
    ),
  },
  {
    q: "What if I am owed more than £5,000?",
    a: (
      <>
        <p>
          The Simple Procedure information on this page is intended for claims within the current Simple Procedure
          monetary limit.
        </p>
        <p>
          If you believe you are owed more than the limit, check the current Scottish Courts guidance and consider
          obtaining independent legal advice about the appropriate procedure.
        </p>
        <p>
          <ExternalLink href={LINKS.simpleProcedure.href}>{LINKS.simpleProcedure.label}</ExternalLink>
        </p>
      </>
    ),
  },
  {
    q: "What evidence should I keep?",
    a: (
      <>
        <p>Keep relevant:</p>
        <ul className="grid list-disc gap-x-8 pl-5 sm:grid-cols-2">
          <li>Payment records</li>
          <li>Bank statements</li>
          <li>Direct Debit information</li>
          <li>Invoices</li>
          <li>Emails</li>
          <li>Letters</li>
          <li>Repayment requests</li>
          <li>Responses</li>
          <li>Documents relating to the reason for payment</li>
        </ul>
        <p>
          <InternalLink href="#police-evidence">View evidence checklist</InternalLink>
        </p>
      </>
    ),
  },
  {
    q: "What if FIOR pays me after I start preparing a claim?",
    a: (
      <>
        <p>
          If the matter is resolved before you submit a court claim, you can decide whether any further action is
          necessary.
        </p>
        <p>
          If proceedings have already been formally raised, follow the current Scottish Courts guidance and any
          instructions issued by the court in your case about what to do next.
        </p>
        <p>
          <ExternalLink href={LINKS.guide.href}>{LINKS.guide.label}</ExternalLink>
        </p>
      </>
    ),
  },
  {
    q: "What if FIOR doesn’t respond to the court claim?",
    a: (
      <>
        <p>Do not assume that no response means you automatically receive judgment.</p>
        <p>
          The court timetable will tell you the relevant response date, and current SCTS procedure may require you to
          submit an Application for a Decision within a specified period.
        </p>
        <p>
          <ExternalLink href={LINKS.noResponse.href}>{LINKS.noResponse.label}</ExternalLink>
        </p>
      </>
    ),
  },
  {
    q: "What if I win but FIOR still doesn’t pay?",
    a: (
      <>
        <p>
          A court order does not necessarily result in payment being transferred automatically. Further enforcement steps
          may be required.
        </p>
        <p>
          <ExternalLink href={LINKS.enforcement.href}>SCTS enforcement guidance</ExternalLink>
        </p>
      </>
    ),
  },
  {
    q: "Is James Square giving me legal advice?",
    a: (
      <>
        <p>No. This resource provides general information, preparation tools and links to official services.</p>
        <p>
          The Owners Committee cannot determine whether an individual has a valid claim or represent an owner in court
          proceedings.
        </p>
      </>
    ),
  },
];

const destinations = [
  {
    href: "#part-1",
    icon: BookOpen,
    need: "I want to understand what happened",
    action: "Read the FIOR background",
    part: "Part 1",
  },
  {
    href: "#part-2",
    icon: HandCoins,
    need: "I want to try to recover my money",
    action: "Start the recovery guide",
    part: "Part 2A / 2B",
  },
  {
    href: "#part-3",
    icon: ShieldCheck,
    need: "I have information which may be relevant to Police Scotland",
    action: "Police Scotland information",
    part: "Part 3",
  },
];

const resourceGroups: { title: string; icon: typeof Landmark; links: { label: string; href: string }[]; note?: string }[] = [
  {
    title: "Scottish Courts and Tribunals Service",
    icon: Landmark,
    links: [
      { label: "Simple Procedure", href: LINKS.simpleProcedure.href },
      { label: "How to make a Simple Procedure claim", href: LINKS.howToClaim.href },
      { label: "Civil Online", href: LINKS.civilOnline.href },
      { label: "Civil Online user guide (PDF)", href: LINKS.civilOnlineGuide.href },
      { label: "Simple Procedure forms", href: LINKS.forms.href },
      { label: "Court fees", href: LINKS.fees.href },
      { label: "Enforcement guidance", href: LINKS.enforcement.href },
    ],
  },
  {
    title: "Police Scotland",
    icon: ShieldCheck,
    links: [
      { label: "Contact Police Scotland", href: POLICE_LINKS.contact.href },
      { label: "101 non-emergency service", href: POLICE_LINKS.nonEmergency.href },
    ],
    note: "In an emergency, always call 999.",
  },
  {
    title: "Companies House",
    icon: Building2,
    links: [
      {
        label: `${FIOR_COMPANY.legalName} (${FIOR_COMPANY.companyNumber})`,
        href: FIOR_COMPANY.companiesHouseUrl,
      },
    ],
    note: "The official register of company details. Check the live record for the company’s current status and registered office.",
  },
];

export default function FiorFaq() {
  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ── FAQ ─────────────────────────────────────────── */}
      <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-[calc(var(--nav-height,4rem)+4.5rem)]">
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
            <span className="font-mono tracking-normal text-slate-400 dark:text-slate-500">3.5</span>
            <span className="h-px w-6 bg-sky-600/40 dark:bg-sky-300/40" aria-hidden="true" />
            Questions
          </p>
          <h2 id="faq-heading" className={`${h2Class} mt-4`}>
            Frequently Asked Questions
          </h2>
        </Reveal>
        <Reveal className="mt-8">
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <Accordion key={q} title={q} headingLevel="h3">
                <div className="space-y-3">{a}</div>
              </Accordion>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── What would you like to do? ──────────────────── */}
      <section aria-labelledby="wayfinder-heading">
        <Reveal className="max-w-3xl">
          <h2 id="wayfinder-heading" className={h2Class}>
            What would you like to do?
          </h2>
        </Reveal>
        <ul className="mt-8 grid gap-4 md:grid-cols-3" role="list">
          {destinations.map(({ href, icon: Icon, need, action, part }, i) => (
            <Reveal as="li" key={href} delay={i} className="h-full">
              <a
                href={href}
                className={`${glassPanel} group flex h-full flex-col p-6 transition hover:border-sky-300 dark:hover:border-sky-400/40 sm:p-7 ${focusRing}`}
              >
                <span className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{part}</span>
                </span>
                <span className="mt-6 text-lg font-semibold leading-snug tracking-tight text-slate-950 dark:text-white">
                  {need}
                </span>
                <span className="mt-auto flex items-center gap-1.5 pt-6 text-[15px] font-semibold text-sky-700 dark:text-sky-300">
                  {action}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── Official resources ──────────────────────────── */}
      <section aria-labelledby="resources-heading">
        <Reveal className="max-w-3xl">
          <h2 id="resources-heading" className={h2Class}>
            Official resources
          </h2>
          <p className={`${copyClass} mt-4`}>
            These links open official websites in a new tab and leave James-Square.com. Court links were last checked on{" "}
            {SOURCES_CHECKED_ON}.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {resourceGroups.map(({ title, icon: Icon, links, note }, i) => (
            <Reveal key={title} delay={i} className="h-full">
              <div className={`${glassPanel} flex h-full flex-col p-5 sm:p-6`}>
                <h3 className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-slate-950 dark:text-white">
                  <Icon className="h-5 w-5 text-sky-700 dark:text-sky-300" strokeWidth={1.75} aria-hidden="true" />
                  {title}
                </h3>
                <ul className="mt-4 space-y-2" role="list">
                  {links.map((link) => (
                    <li key={link.href}>
                      <ExternalLink href={link.href} variant="card" className="w-full text-sm">
                        {link.label}
                      </ExternalLink>
                    </li>
                  ))}
                </ul>
                {note && <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{note}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
