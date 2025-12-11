
import React from 'react';
import { Lang } from '../utils/translations';

interface FinalCTAProps {
    lang: Lang;
    text: any;
    onAction: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ text, onAction }) => {
  return (
    <div className="w-full py-24 px-4 text-center relative overflow-hidden flex flex-col items-center justify-center">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-spring-neon/5 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-normal text-zinc-900 dark:text-white mb-12 tracking-tighter leading-none transition-colors duration-500">
                {text.title} <br/>
                <span className="text-grad-multiversa font-light italic">{text.span}</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                <button 
                    onClick={onAction}
                    className="px-10 py-5 bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-all w-full sm:w-auto border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 btn-shine"
                >
                    NanoWeb ($200)
                </button>
                <button 
                    onClick={onAction}
                    className="px-10 py-5 bg-spring-neon text-black text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-spring-dim hover:text-white transition-all w-full sm:w-auto shadow-[0_0_40px_rgba(0,255,161,0.4)] btn-shine"
                >
                    SmartWeb ($400)
                </button>
            </div>
             
             <div className="mt-16">
                <button onClick={onAction} className="text-zinc-500 dark:text-zinc-600 hover:text-spring-dim dark:hover:text-spring-neon text-[10px] uppercase tracking-[0.3em] font-normal transition-colors border-b border-transparent hover:border-spring-dim dark:hover:border-spring-neon pb-1">
                    {text.whatsapp}
                </button>
             </div>
        </div>
    </div>
  );
};

export default FinalCTA;
