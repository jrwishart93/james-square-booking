import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  FileText,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

const contactLinks = [
  {
    email: "contact@james-square.com",
    helper: "General enquiries",
  },
  {
    email: "support@james-square.com",
    helper: "Technical support",
  },
  {
    email: "committee@james-square.com",
    helper: "Committee contact",
  },
];

const usefulLinks = [
  // TODO: Add Privacy Policy page.
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
    icon: ShieldCheck,
  },
  // TODO: Add Terms of Use page.
  {
    label: "Terms of Use",
    href: "/terms-of-use",
    icon: FileText,
  },
  {
    label: "Useful Information",
    href: "/how-to-app",
    icon: Info,
  },
  {
    label: "Message Board",
    href: "/message-board",
    icon: MessageSquare,
  },
  {
    label: "Book Facilities",
    href: "/book",
    icon: CalendarDays,
  },
  // TODO: Add Contact page.
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
  },
];

const linkClassName =
  "inline-flex items-start gap-2 text-sm text-sky-700 transition-colors hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white/70 dark:text-sky-300 dark:hover:text-sky-200 dark:focus-visible:ring-offset-neutral-900/80";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      className="mt-12 border-t border-white/10 bg-white/40 backdrop-blur-xl dark:bg-neutral-950/50"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 text-slate-700 md:grid-cols-4 dark:text-slate-300">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
              <div
                className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35),transparent_70%)] opacity-60 blur-xl"
                aria-hidden="true"
              />
              <Image
                src="/images/logo/Logo.png"
                alt="James Square"
                width={32}
                height={32}
                className="relative h-8 w-8 object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">James Square</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            James-Square.com portal is provided for residents and owners to manage bookings,
            communications, and building updates.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            Contact
          </h2>
          <ul className="space-y-3">
            {contactLinks.map((link) => (
              <li key={link.email}>
                <a
                  href={`mailto:${link.email}`}
                  className={`${linkClassName} flex items-start gap-3 rounded-sm`}
                >
                  <Mail className="mt-0.5 h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                  <span className="space-y-1">
                    <span className="block text-sm">{link.email}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      {link.helper}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            Address
          </h2>
          <address className="not-italic text-sm leading-6 text-slate-600 dark:text-slate-300">
            <span className="block">James Square</span>
            <span className="block">Caledonian Crescent</span>
            <span className="block">Edinburgh</span>
            <span className="block">EH11 2AT</span>
          </address>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This portal is provided for information and communication only.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Useful links</h2>
          <ul className="space-y-3">
            {usefulLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.label}>
                  <Link href={link.href} className={`${linkClassName} rounded-sm`}>
                    <Icon className="mt-0.5 h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/50 text-xs text-slate-500 dark:bg-neutral-950/70 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <span>© {currentYear} James Square. All rights reserved.</span>
          <span>
            Website enquiries:{" "}
            <a
              href="mailto:contact@james-square.com?subject=Website%20enquiry%20(from%20James-Square.com)"
              className={linkClassName}
            >
              contact@james-square.com
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
