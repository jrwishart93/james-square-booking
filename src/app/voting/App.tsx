import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import AskQuestion from './components/AskQuestion';
import VotePage from './components/Vote';
import Results from './components/Results';
import OwnersVotingGate from './components/OwnersVotingGate';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col md:items-center md:justify-center md:px-4 md:py-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
        <div className="
          w-full max-w-4xl
          flex flex-col
          md:rounded-[32px]
          md:border md:border-slate-200
          md:bg-white
          md:shadow-[0_24px_70px_rgba(15,23,42,0.14)]
          overflow-hidden
          min-h-screen md:min-h-[600px]
          relative
        ">

          {/* Glass Header */}
          <header className="
            sticky top-0 z-20
            border-b border-slate-200
            bg-white/90
            backdrop-blur-xl
            px-6 py-5
            flex items-center justify-between
          ">
             <div>
               <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  Owners Voting Hub
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  James Square • Community
                </p>
             </div>
             {/* Desktop Nav Placeholder if we wanted side actions */}
          </header>

          <main className="flex-1 w-full overflow-y-auto custom-scrollbar pb-24 md:pb-0 relative z-10">
            <Routes>
              <Route path="/" element={<AskQuestion />} />
              <Route path="/vote" element={<VotePage />} />
              <Route
                path="/owners"
                element={
                  <OwnersVotingGate>
                    <VotePage />
                  </OwnersVotingGate>
                }
              />
              <Route path="/results" element={<Results />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Navigation stays at bottom (mobile style) or moves to top depending on pref, 
              but based on request we keep sticky bottom nav style for consistency */}
          <Navigation />
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
