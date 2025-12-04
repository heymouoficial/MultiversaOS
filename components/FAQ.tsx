
import React, { useState } from 'react';
import { Lang } from '../utils/translations';

interface FAQProps {
    lang: Lang;
    text: any;
}

const FAQ: React.FC<FAQProps> = ({ text }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = [
    { q: text.q1, a: text.a1 },
    { q: text.q2, a: text.a2 },
    { q: text.q3, a: text.a3 },
    { q: text.q4, a: text.a4 }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-6 mb-20">
        <h2 className="text-xs font-mono text-zinc-500 mb-8 tracking-widest uppercase text-center">// FAQ Database</h2>
        
        <div className="space-y-4">
            {questions.map((item, i) => (
                <div key={i} className="glass-cinematic rounded-xl overflow-hidden bg-white/60 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 transition-colors duration-500">
                    <button 
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex justify-between items-center p-5 text-left hover:text-lime-600 dark:hover:text-lime-neon transition-colors group"
                    >
                        <span className="text-zinc-800 dark:text-zinc-300 font-medium text-sm group-hover:text-lime-600 dark:group-hover:text-lime-neon transition-colors">{item.q}</span>
                        <svg 
                            className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-lime-600 dark:text-lime-neon' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div 
                        className={`transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="px-5 pb-5 text-zinc-600 dark:text-zinc-500 text-sm font-light leading-relaxed">
                            {item.a}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default FAQ;
