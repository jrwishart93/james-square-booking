
import React from 'react';
import { motion } from 'framer-motion';
import { Step } from '../types';

interface StepCardProps {
  step: Step;
  index: number;
}

const variants = {
  blue: {
    border: 'border-blue-200',
    accent: 'bg-blue-600',
    icon: 'text-blue-600',
    shadow: 'hover:shadow-blue-100',
    dot: 'bg-blue-600'
  },
  green: {
    border: 'border-emerald-200',
    accent: 'bg-emerald-600',
    icon: 'text-emerald-600',
    shadow: 'hover:shadow-emerald-100',
    dot: 'bg-emerald-600'
  },
  amber: {
    border: 'border-amber-200',
    accent: 'bg-amber-600',
    icon: 'text-amber-600',
    shadow: 'hover:shadow-amber-100',
    dot: 'bg-amber-600'
  },
  red: {
    border: 'border-red-200',
    accent: 'bg-red-600',
    icon: 'text-red-600',
    shadow: 'hover:shadow-red-100',
    dot: 'bg-red-600'
  }
};

export const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  const v = variants[step.variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`bg-white ${v.border} border-2 rounded-[2rem] p-8 flex flex-col h-full shadow-sm hover:shadow-2xl ${v.shadow} transition-all duration-300 relative group overflow-hidden`}
    >
      {/* Subtle corner accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 ${v.accent} opacity-[0.03] rounded-bl-full`} />
      
      <div className="flex items-start justify-between mb-6">
        <div className={`${v.accent} text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-white`}>
          {step.id}
        </div>
        <div className={`${v.icon} p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform`}>
          {step.icon}
        </div>
      </div>
      
      <h3 className={`text-2xl font-black text-slate-800 leading-tight mb-3`}>
        {step.title}
      </h3>
      
      <p className={`text-base font-bold text-slate-500 leading-relaxed mb-6`}>
        {step.description}
      </p>

      {step.id === 2 && (
        <div className="mt-auto">
          <motion.div 
            animate={{ 
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 10px 15px -3px rgba(220, 38, 38, 0.4)',
                '0 20px 25px -5px rgba(220, 38, 38, 0.6)',
                '0 10px 15px -3px rgba(220, 38, 38, 0.4)'
              ]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-red-600 text-white rounded-2xl py-5 px-6 flex items-center justify-center border-b-4 border-red-800"
          >
            <span className="font-black text-2xl tracking-tighter">CALL 999</span>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
