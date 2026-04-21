'use client';

import { useState } from 'react';

const SHOW_ANNOUNCEMENT = true;
const GATES_NOTICE_PUBLISHED_AT = new Date('2026-02-06T00:00:00Z');
const GATES_NOTICE_EXPIRES_AT = new Date(
  GATES_NOTICE_PUBLISHED_AT.getTime() + 5 * 24 * 60 * 60 * 1000,
);

export default function AnnouncementNotice() {
  const [expanded, setExpanded] = useState(false);

  if (!SHOW_ANNOUNCEMENT) {
    return null;
  }

  const isGatesNoticeActive = Date.now() < GATES_NOTICE_EXPIRES_AT.getTime();

  return (
    <section className="mx-auto max-w-6xl mt-6 sm:mt-8">
      <div className="jqs-glass rounded-2xl border border-white/30 bg-white/60 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:p-8">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/90">
            OWNER NOTICE
          </p>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-2xl">
            Update – Appointment of New Factor
          </h2>
        </header>

        <div className="mt-4 space-y-3 text-sm text-neutral-700 dark:text-neutral-200 sm:text-base">
          <p>
            Following the conclusion of the owner vote, the factor for James Square was formally
            changed from Fior Asset &amp; Property to Myreside Management Limited with effect from 1
            February 2026.
          </p>

          {expanded && (
            <>
              <p>
                Owners should no longer make any payments to Fior Asset &amp; Property. If any
                payments have been made to Fior after 1 February 2026, owners are advised to
                contact Fior directly and request a refund as soon as possible.
              </p>
              <p>
                Following a meeting with Myreside on 11 March 2026, it was confirmed that
                approximately 50% of owners at James Square have already begun making payments to
                Myreside since February. Myreside are aware that some owners have experienced
                technical issues with their online portal and are currently working to resolve
                these. In the meantime, they have asked that any owners who have not yet made
                payment contact them directly so they can assist.
              </p>

              <p className="font-semibold">Myreside Management Limited – Contact Details</p>

              <p>
                <span className="font-medium">Telephone</span>
                <br />
                0131 466 3001
              </p>

              <p>
                <span className="font-medium">24 Hour Emergencies</span>
                <br />
                0131 466 3001 – then press 1
              </p>

              <p>
                <span className="font-medium">Address</span>
                <br />
                Myreside Management Limited
                <br />
                3 Dalkeith Road Mews
                <br />
                Edinburgh EH16 5GA
              </p>

              <p>
                <span className="font-medium">Opening Hours</span>
                <br />
                Monday – Friday: 9am – 5:30pm
              </p>

              <p>
                Company Number SC213664
                <br />
                Registered Property Factor Number PF000177
              </p>

              {isGatesNoticeActive && (
                <div className="border-t border-amber-200/60 pt-4 dark:border-amber-300/20">
                  <header className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/90">
                      Owner Notice
                    </p>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Update – Main Gates
                    </h3>
                  </header>
                  <div className="mt-3 space-y-2">
                    <p>
                      The issue with the main entrance gates has now been resolved. Repairs were
                      completed on Friday, and the gates are fully operational.
                    </p>
                    <p>Thank you for your patience while this was addressed.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-4 inline-flex items-center text-sm font-semibold text-amber-700 hover:underline dark:text-amber-300"
        >
          {expanded ? 'Show less' : 'View more'}
        </button>
      </div>
    </section>
  );
}
