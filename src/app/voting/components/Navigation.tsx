import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PenSquare, Vote, BarChart3, ChevronDown, Info } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isVotingInfoOpen, setIsVotingInfoOpen] = useState(false);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-1 items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-full transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-cyan-50 to-indigo-50 text-cyan-700 border border-cyan-100 shadow-[0_10px_30px_rgba(12,74,110,0.12)]'
        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
    }`;

  return (
    <nav className="
      fixed bottom-0 left-0 w-full z-50
      md:absolute md:bottom-0
      bg-white/95
      backdrop-blur-xl
      border-t border-slate-200
      shadow-[0_-8px_30px_rgba(15,23,42,0.08)]
      pb-safe
    ">
      <div className="max-w-md mx-auto px-6 pt-4 pb-5 space-y-3">
        <div className="space-y-3">
          <button
            type="button"
            className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition hover:border-cyan-200 hover:bg-white"
            onClick={() => setIsVotingInfoOpen((prev) => !prev)}
            aria-expanded={isVotingInfoOpen}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                  <Info size={16} />
                </span>
                <span>How voting works</span>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-500 transition-transform duration-200 ${isVotingInfoOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </div>
          </button>
          <div
            className={`overflow-hidden rounded-2xl text-sm text-slate-700 transition-[max-height,opacity] duration-300 ease-out ${
              isVotingInfoOpen
                ? 'max-h-96 opacity-100 border border-cyan-100/70 bg-gradient-to-br from-cyan-50/70 via-white to-indigo-50/60 px-4 py-4 shadow-[0_10px_30px_rgba(14,116,144,0.08)]'
                : 'max-h-0 opacity-0 border border-transparent bg-transparent px-4 py-0 shadow-none'
            }`}
          >
            <div className={`${isVotingInfoOpen ? 'translate-y-0' : '-translate-y-1'} transition-transform duration-200`}>
              <h3 className="text-sm font-semibold text-slate-900">How voting works</h3>
              <ul className="mt-3 space-y-2 text-slate-700">
                <li>• Each property (flat) can cast one vote per question</li>
                <li>• If more than one person from the same flat is registered, the flat still counts as a single vote</li>
                <li>• While voting is open, you may change your selection</li>
                <li>• The most recent choice before voting closes is the one that counts</li>
                <li>• Once voting closes, no further changes can be made</li>
                <li>• All votes are securely logged for audit purposes</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <NavLink to="/" className={linkClass}>
            <PenSquare size={18} />
            <span>Ask</span>
          </NavLink>
          <NavLink to="/vote" className={linkClass}>
            <Vote size={18} />
            <span>Vote</span>
          </NavLink>
          <NavLink to="/results" className={linkClass}>
            <BarChart3 size={18} />
            <span>Results</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
