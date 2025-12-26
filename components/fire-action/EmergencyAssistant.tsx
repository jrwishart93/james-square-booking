
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, User, Loader2, Info } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const EmergencyAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your James Square Safety Assistant. Do you have any questions about our fire procedures or general safety?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `
            You are a helpful Fire Safety Assistant for James Square residents.
            Key Facts:
            - Assembly Point: Front of James Square on Caledonian Crescent.
            - Alarm Test: Wednesdays at 10:00 AM.
            - Procedure: Sound alarm, call 999, evacuate via signed routes, close doors.
            - Restrictions: Do not use lifts, do not return until authorized.
            - Tone: Calm, professional, concise.
            If asked something unrelated to safety, politely redirect to safety topics.
          `
        }
      });

      const aiResponse = response.text || "I'm sorry, I'm having trouble connecting. Please follow the posted instructions.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not reach the safety server. Please follow printed guidelines." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] max-h-[600px]"
      >
        <div className="bg-red-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-black">Safety Assistant</h3>
              <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">James Square Support</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="bg-blue-50 p-3 text-blue-800 text-[10px] flex items-center gap-2 font-bold uppercase tracking-wider">
          <Info size={14} />
          In an actual emergency, always prioritize evacuation over chat.
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-red-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}>
                {msg.role === 'assistant' && <Bot size={18} className="shrink-0 mt-1 opacity-50" />}
                <p className="text-sm font-semibold leading-relaxed">{msg.content}</p>
                {msg.role === 'user' && <User size={18} className="shrink-0 mt-1 opacity-50" />}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-2">
                <Loader2 size={18} className="animate-spin text-red-600" />
                <span className="text-sm font-bold text-slate-400">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about fire safety..."
              className="flex-1 bg-slate-100 text-slate-900 rounded-full px-6 py-4 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-red-600 focus:bg-white transition-all shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
