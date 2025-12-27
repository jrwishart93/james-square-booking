
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Notice } from './types';

interface NoticeBoxProps {
  notice: Notice;
}

export const NoticeBox: React.FC<NoticeBoxProps> = ({ notice }) => {
  const isRed = notice.variant === 'red';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`rounded-[2rem] overflow-hidden border-2 shadow-lg h-full flex flex-col ${
        isRed
          ? 'bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800'
          : 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-700'
      }`}
    >
      <div className={`px-8 py-5 flex items-center gap-4 text-white font-black tracking-tighter text-xl ${
        isRed ? 'bg-red-600 shadow-[0_4px_20px_rgba(220,38,38,0.3)]' : 'bg-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.3)]'
      }`}>
        <div className="bg-white/20 p-2 rounded-xl">
          {isRed ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
        </div>
        {notice.title}
      </div>
      
      <div className="p-8 space-y-5 flex-1">
        {notice.items.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 shadow-sm ${
              isRed ? 'bg-red-400' : 'bg-amber-400'
            }`} />
            <p className={`text-lg font-bold leading-snug ${
              isRed ? 'text-red-950 dark:text-red-100' : 'text-amber-950 dark:text-amber-100'
            }`}>
              {item}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
