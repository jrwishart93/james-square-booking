import React from 'react';
import { NavLink } from 'react-router-dom';
import { PenSquare, Vote, BarChart3 } from 'lucide-react';

const Navigation: React.FC = () => {
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
      <div className="max-w-md mx-auto px-6 py-4 flex justify-between gap-2">
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
    </nav>
  );
};

export default Navigation;