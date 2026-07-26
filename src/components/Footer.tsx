import Image from "next/image";
import Link from "next/link";

import { CookieSettingsLink } from "@/components/consent";

const contactEmails = [
  "contact@james-square.com",
  "support@james-square.com",
  "committee@james-square.com",
];

const quickLinks = [
  { href: "/local", label: "More Information", icon: InfoIcon },
  { href: "/message-board", label: "Message Board", icon: MessageIcon },
  { href: "/book", label: "Book Facilities", icon: CalendarIcon },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/acceptable-use", label: "Acceptable Use" },
  { href: "/data-retention", label: "Data Retention" },
];

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="jqs-glass rounded-t-3xl rounded-b-none border border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-10 text-[10px] sm:text-[11px] md:text-sm text-slate-600 dark:text-slate-300">
            <section className="min-w-0 flex flex-col gap-2 md:gap-3">
              <div className="hidden md:flex items-center gap-3">
                <LogoMark />
                <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  About
                </h2>
              </div>
              <h2 className="md:hidden text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                About
              </h2>
              <p className="break-words leading-tight md:leading-relaxed text-slate-600 dark:text-slate-300">
                James-Square.com is an online portal for residents and owners to manage facilities, communications, and
                building information.
              </p>
            </section>

            <section className="min-w-0 flex flex-col gap-2 md:gap-3">
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Contact
              </h2>
              <ul className="space-y-2 md:space-y-3">
                {contactEmails.map((email) => (
                  <li key={email}>
                    <a
                      className="flex items-center gap-1.5 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 md:gap-2"
                      href={`mailto:${email}`}
                    >
                      <MailIcon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
                      <span className="break-all text-[10px] sm:text-[11px] md:text-sm leading-tight">{email}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400">
                We respond during business hours and committee review windows.
              </p>
            </section>

            <section className="min-w-0 flex flex-col gap-2 md:gap-3">
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Links
              </h2>
              <ul className="space-y-2 md:space-y-3">
                {quickLinks.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-1.5 rounded-lg text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 md:gap-2"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
                      <span className="break-words text-[10px] sm:text-[11px] md:text-sm leading-tight">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="min-w-0 flex flex-col gap-2 md:gap-3">
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Privacy &amp; Legal
              </h2>
              <ul className="space-y-2 md:space-y-3">
                {legalLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-1.5 rounded-lg text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 md:gap-2"
                    >
                      <ShieldIcon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
                      <span className="break-words text-[10px] sm:text-[11px] md:text-sm leading-tight">
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  {/* Permanent, always-available way to review or withdraw consent. */}
                  <CookieSettingsLink className="flex w-full items-center gap-1.5 rounded-lg text-left text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 md:gap-2" />
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-4 flex flex-col gap-1 border-t border-slate-200/70 dark:border-slate-700/60 pt-2 text-[10px] text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} James Square. All rights reserved.</span>
            <span>
              Privacy enquiries:{" "}
              <a
                className="underline underline-offset-2 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                href="mailto:privacy@james-square.com"
              >
                privacy@james-square.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LogoMark() {
  return (
    <div className="relative">
      <span
        className="animate-footer-glow footer-logo-glow pointer-events-none absolute -inset-6 rounded-full blur-2xl bg-[radial-gradient(circle,rgba(148,163,184,0.35),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(96,165,250,0.5),transparent_70%)]"
        aria-hidden="true"
      />
      <Image
        src="/images/logo/Logo.png"
        alt="James Square"
        width={36}
        height={36}
        className="relative h-9 w-9 dark:hidden"
      />
      <Image
        src="/images/logo/Logo-white.PNG"
        alt="James Square"
        width={36}
        height={36}
        className="relative hidden h-9 w-9 dark:block"
      />
    </div>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
      <path d="m22 8-10 6L2 8" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 4 6v6c0 5 3.2 8.4 8 9 4.8-.6 8-4 8-9V6l-8-3Z" />
    </svg>
  );
}


function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3v3" />
      <path d="M16 3v3" />
      <path d="M4 9h16" />
      <rect x="4" y="5" width="16" height="16" rx="2" />
    </svg>
  );
}
