import Link from 'next/link';

import { GlassCard } from '@/components/GlassCard';

const VotingCallout = () => {
  // TODO: Remove after 23/01/26 once the voting window closes.
  return (
    <GlassCard title="Owner Voting Now Open" className="jqs-glass">
      <div className="space-y-4 text-sm md:text-base text-slate-700 dark:text-slate-200">
        <p>
          Voting is now open for owners to place their vote on which factor they feel would be the best fit for James
          Square and take over property management following Fior stepping down.
        </p>
        <p>
          Owners will need the <span className="font-semibold text-slate-900 dark:text-slate-100">voting access code</span>{' '}
          that was issued to all owners by Fior in order to submit a vote.
        </p>
        <p>
          If you experience any technical difficulties, please email{' '}
          <a
            className="font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
            href="mailto:support@james-square.com"
          >
            support@james-square.com
          </a>{' '}
          for assistance.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Voting will close at 5:00pm on Friday 23 January 2026.
          </span>
        </p>
        <div>
          <Link
            href="/voting"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-slate-900 transition jqs-glass hover:brightness-[1.05] dark:text-slate-100"
          >
            👉 Go to Voting Page
          </Link>
        </div>
      </div>
    </GlassCard>
  );
};

export default VotingCallout;
