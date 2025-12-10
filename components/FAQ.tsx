
import React, { useState } from 'react';
import { Lang } from '../utils/translations';

interface FAQProps {
    lang: Lang;
    text: any;
}

const FAQ: React.FC<FAQProps> = ({ text }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Dynamic questions list from translations
    const questions = text.questions || [];

    return (
        <div className="w-full max-w-3xl mx-auto px-6 mb-20">
            <h2 className="text-xs font-mono text-zinc-500 mb-8 tracking-widest uppercase text-center">// KNOWLEDGE BASE</h2>

            <div className="space-y-3">
                {questions.map((item: any, i: number) => (
                    <div key={i} className={`glass-cinematic rounded-xl overflow-hidden bg-white/60 dark:bg-white/[0.02] border transition-all duration-500 ${openIndex === i ? 'border-lime-500/30 dark:border-lime-neon/30 bg-white/80 dark:bg-white/[0.04]' : 'border-black/5 dark:border-white/5'}`}>
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex justify-between items-start gap-4 p-5 text-left hover:text-lime-600 dark:hover:text-lime-neon transition-colors group"
                        >
                            <span className={`text-sm transition-colors duration-300 ${openIndex === i ? 'text-lime-700 dark:text-lime-neon font-medium' : 'text-zinc-800 dark:text-zinc-300 font-normal group-hover:text-lime-600 dark:group-hover:text-lime-neon'}`}>
                                {item.q}
                            </span>
                            <svg
                                className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 flex-shrink-0 mt-0.5 ${openIndex === i ? 'rotate-180 text-lime-600 dark:text-lime-neon' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="px-5 pb-5 text-zinc-600 dark:text-zinc-400 text-sm font-light leading-relaxed border-t border-black/5 dark:border-white/5 pt-3 mt-1">
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
