import React from 'react';
import { NavLink } from 'react-router-dom';
import { PenSquare, Vote, BarChart3 } from 'lucide-react';

const Navigation: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `flex flex-1 items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-full transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 text-cyan-100 border border-white/10 shadow-[0_0_20px_rgba(56,189,248,0.15)] backdrop-blur-md' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
    }`;

  return (
    <nav className="
      fixed bottom-0 left-0 w-full z-50 
      md:absolute md:bottom-0 
      bg-slate-950/80 
      backdrop-blur-xl 
      border-t border-white/10 
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