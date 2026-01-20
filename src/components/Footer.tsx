import Image from "next/image";
import Link from "next/link";

const contactEmails = [
  "contact@james-square.com",
  "support@james-square.com",
  "committee@james-square.com",
];

const quickLinks = [
  { href: "/privacy", label: "Privacy Policy", icon: ShieldIcon },
  { href: "/terms", label: "Terms of Use", icon: FileIcon },
  { href: "/local", label: "More Information", icon: InfoIcon },
  { href: "/message-board", label: "Message Board", icon: MessageIcon },
  { href: "/book", label: "Book Facilities", icon: CalendarIcon },
];

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="jqs-glass rounded-t-3xl rounded-b-none border border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 md:py-8">
          <div className="flex justify-center md:hidden mb-3">
            <LogoMark />
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-10 text-[11px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-300">
            <section className="flex flex-col gap-2 md:gap-3">
              <div className="hidden md:flex items-center gap-3">
                <LogoMark />
                <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  About
                </h2>
              </div>
              <h2 className="md:hidden text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 text-center">
                About
              </h2>
              <p className="leading-snug md:leading-relaxed text-slate-600 dark:text-slate-300">
                James-Square.com is an online portal for residents and owners to manage facilities, communications, and
                building information.
              </p>
            </section>

            <section className="flex flex-col gap-2 md:gap-3">
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 text-center md:text-left">
                Contact
              </h2>
              <ul className="space-y-2 md:space-y-3">
                {contactEmails.map((email) => (
                  <li key={email}>
                    <a
                      className="flex flex-col items-center gap-1 text-center text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 md:items-start md:text-left"
                      href={`mailto:${email}`}
                    >
                      <MailIcon className="h-4 w-4" />
                      <span className="text-[10px] sm:text-[11px] md:text-sm leading-snug">{email}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400">
                We respond during business hours and committee review windows.
              </p>
            </section>

            <section className="flex flex-col gap-2 md:gap-3">
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 text-center md:text-left">
                Links
              </h2>
              <ul className="space-y-2 md:space-y-3">
                {quickLinks.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex flex-col items-center gap-1 rounded-lg px-1.5 py-1 text-center text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 md:items-start md:text-left"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[10px] sm:text-[11px] md:text-sm leading-snug">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-4 border-t border-slate-200/70 dark:border-slate-700/60 pt-2 text-[10px] text-slate-500 dark:text-slate-400">
            © 2025 James Square. All rights reserved.
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
      <Image src="/images/logo/Logo.png" alt="James Square" width={36} height={36} className="relative h-9 w-9" />
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

function FileIcon({ className }: { className?: string }) {
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
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" />
      <path d="M14 3v6h6" />
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
