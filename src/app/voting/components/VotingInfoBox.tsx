import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Info } from 'lucide-react';

const transition = { duration: 0.25, ease: [0.4, 0, 0.2, 1] };

const VotingInfoBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="voting-info-panel"
        className="
          w-full
          flex items-center justify-between gap-4
          px-4 py-3
          text-left
          rounded-2xl
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-cyan-400/70
        "
      >
        <span className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-cyan-100/70 text-cyan-700 flex items-center justify-center shadow-inner">
            <Info size={18} />
          </span>
          <span className="text-sm font-semibold text-slate-700">How voting works</span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={transition}
          className="text-slate-500"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="voting-info-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">
              <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-cyan-50/60 p-4 text-xs sm:text-sm text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">How voting works</h3>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500/70" />
                    <span>Each property (flat) can cast one vote per question</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500/70" />
                    <span>
                      If more than one person from the same flat is registered, the flat still counts as a single vote
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500/70" />
                    <span>While voting is open, you may change your selection</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500/70" />
                    <span>The most recent choice before voting closes is the one that counts</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500/70" />
                    <span>Once voting closes, no further changes can be made</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500/70" />
                    <span>All votes are securely logged for audit purposes</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VotingInfoBox;
