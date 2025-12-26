
import React from 'react';
import { 
  MapPin, 
  ShieldAlert, 
  Volume2,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StepCard } from './StepCard';
import { NoticeBox } from './NoticeBox';
import { DISCOVERY_STEPS, RESPONSE_STEPS, NOTICES } from './constants';

const App: React.FC = () => {
  // User provided exact location link: https://maps.app.goo.gl/fYAyX7zCPfEcovjU6
  const assemblyPointMapsUrl = "https://maps.app.goo.gl/fYAyX7zCPfEcovjU6";
  
  // Vimeo Video Orbit URL (autoplay, loop, and background mode for seamless repeat)
  const vimeoOrbitUrl = "https://player.vimeo.com/video/1149530594?autoplay=1&loop=1&background=1&quality=1080p&muted=1";

  return (
    <div className="w-full bg-slate-100 flex flex-col items-center p-4 md:p-8 lg:p-12 transition-colors duration-500 rounded-[2rem] shadow-inner border border-slate-200">
      {/* Main Poster Container */}
      <motion.main 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="poster-container w-full max-w-5xl bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2.5rem] overflow-hidden border border-slate-200"
      >
        {/* Modern High-Impact Header */}
        <header className="bg-slate-900 p-10 md:p-16 text-white relative overflow-hidden">
          {/* Animated Background Element */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-red-600 rounded-full blur-[100px]"
          />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center shrink-0 shadow-[0_0_50px_rgba(220,38,38,0.5)] border-4 border-red-500/50"
            >
                <ShieldAlert size={56} className="text-white" />
              </motion.div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                FIRE ACTION
              </h1>
              <p className="text-lg md:text-2xl font-bold text-red-500 uppercase tracking-widest">
                James Square Safety Protocol
              </p>
            </div>
          </div>
        </header>

        <div className="p-8 md:p-12 space-y-16">
          
          {/* Section 1: Discovery - Blue Grouping */}
          <section className="relative p-8 rounded-[2rem] bg-slate-50 border border-slate-200 shadow-inner">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                <Volume2 size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">If you discover a fire:</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {DISCOVERY_STEPS.map((step, idx) => (
                <StepCard key={step.id} step={step} index={idx} />
              ))}
            </div>
          </section>

          {/* Section 2: Response - Green Grouping */}
          <section className="relative p-8 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 shadow-inner">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg">
                <Navigation size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">On hearing the alarm:</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {RESPONSE_STEPS.map((step, idx) => (
                <StepCard key={step.id} step={step} index={idx + 3} />
              ))}
            </div>
          </section>

          {/* Assembly Point Feature - Split Layout with Video Orbit */}
          <section className="bg-emerald-600 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-10 items-stretch">
            {/* Decorative Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            {/* Left Column: Text Info */}
            <div className="flex-1 flex flex-col items-center lg:items-start justify-center text-center lg:text-left gap-6 relative z-10">
              <div className="bg-white text-emerald-600 p-5 rounded-3xl shadow-2xl self-center lg:self-start">
                <MapPin size={40} strokeWidth={2.5} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Assembly Point</h3>
                <p className="text-xl md:text-2xl font-bold text-emerald-100 leading-tight">
                  Corner of Caledonian Crescent <br className="hidden lg:block"/> 
                  & Orwell Terrace
                </p>
                <div className="bg-emerald-700/50 backdrop-blur-sm border border-white/20 p-6 rounded-2xl">
                   <p className="text-base font-bold text-emerald-50 leading-relaxed">
                     Recommended assembly point is across the road from James Square on the corner of Caledonian Crescent and Orwell Terrace.
                   </p>
                   <p className="text-sm font-medium text-emerald-100 mt-4 leading-relaxed italic">
                     Find a safe and suitable location ensuring to keep a clear space for emergency services to attend ensuring you are out of harms way.
                   </p>
                </div>
                <a 
                  href={assemblyPointMapsUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-8 py-4 bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl font-black text-base md:text-lg transition-all shadow-xl no-print"
                >
                  GET DIRECTIONS <ExternalLink size={20} />
                </a>
              </div>
            </div>

            {/* Right Column: Video Orbit Embed */}
            <div className="flex-1 min-h-[240px] md:min-h-[360px] lg:min-h-auto aspect-video rounded-[2rem] overflow-hidden border-4 border-white/30 shadow-2xl relative z-10 bg-black group">
              <div className="absolute inset-0 w-full h-full pointer-events-none no-print flex items-center justify-center">
                <iframe 
                  src={vimeoOrbitUrl}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    objectFit: 'cover'
                  }} 
                  allow="autoplay; fullscreen; picture-in-picture"
                  title="Assembly Point Video Orbit"
                ></iframe>
              </div>
              
              {/* Video Overlay Label */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl no-print border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Visual Guide
              </div>

              {/* Static placeholder for print */}
             <div className="hidden print:flex h-full w-full bg-slate-100 flex-col items-center justify-center text-slate-600 font-bold p-10 text-center gap-4">
                 <MapPin size={40} />
                 <div>
                   <p className="text-xl">Assembly Point Location:</p>
                   <p className="text-lg font-black text-emerald-800 uppercase">Caledonian Crescent & Orwell Terrace Junction</p>
                   <p className="text-sm font-normal mt-4 italic text-slate-500">
                     Recommended assembly point is across the road from James Square. Keep clear for emergency services.
                   </p>
                 </div>
              </div>
            </div>
          </section>

          {/* Notices Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            {NOTICES.map((notice, idx) => (
              <NoticeBox key={idx} notice={notice} />
            ))}
          </div>
        </div>

      {/* Footer Accent */}
      <div className="h-4 bg-slate-900 flex">
         <div className="w-1/3 bg-red-600" />
         <div className="w-1/3 bg-blue-600" />
         <div className="w-1/3 bg-emerald-600" />
      </div>
    </motion.main>
    </div>
  );
};

export default App;
