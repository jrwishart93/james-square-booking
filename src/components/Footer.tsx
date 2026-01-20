import Image from "next/image";
import Link from "next/link";

const contactEmails = [
  "contact@james-square.com",
  "support@james-square.com",
  "committee@james-square.com",
];

const quickLinks = [
  { href: "/privacy", label: "Privacy Policy", shortLabel: "Privacy", icon: ShieldIcon },
  { href: "/terms", label: "Terms of Use", shortLabel: "Terms", icon: FileIcon },
  { href: "/local", label: "More Information", shortLabel: "Info", icon: InfoIcon },
  { href: "/message-board", label: "Message Board", shortLabel: "Board", icon: MessageIcon },
  { href: "/booking", label: "Book Facilities", shortLabel: "Book", icon: CalendarIcon },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/70 text-slate-600 dark:border-slate-800/70 dark:text-slate-400">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 md:py-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 text-[11px] sm:text-xs md:text-sm">
          <section className="flex flex-col gap-1.5 md:gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo/Logo.png"
                alt="James Square"
                width={32}
                height={32}
                className="hidden h-8 w-8 md:block"
              />
              <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 sr-only md:not-sr-only">
                About
              </h2>
            </div>
            <p className="leading-snug md:leading-relaxed text-slate-600 dark:text-slate-400">
              James-Square.com is an online portal for residents and owners to manage facilities, communications, and
              building information.
            </p>
          </section>

          <section className="flex flex-col gap-1.5 md:gap-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 sr-only md:not-sr-only">
              Contact
            </h2>
            <ul className="space-y-1 md:space-y-2">
              {contactEmails.map((email) => (
                <li key={email}>
                  <a
                    className="flex items-center gap-1.5 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    href={`mailto:${email}`}
                  >
                    <MailIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{email}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="hidden text-[11px] text-slate-500 dark:text-slate-500 md:block">
              We respond during business hours and building committee review windows.
            </p>
          </section>

          <section className="flex flex-col gap-1.5 md:gap-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 sr-only md:not-sr-only">
              Links
            </h2>
            <ul className="space-y-1 md:space-y-2">
              {quickLinks.map(({ href, label, shortLabel, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="sm:hidden">{shortLabel}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="mt-3 text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">
          © 2025 James Square. All rights reserved.
        </div>
      </div>
    </footer>
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
