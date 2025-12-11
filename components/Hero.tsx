
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { analyzeProjectNeeds } from '../services/gemini';
import { Lang } from '../utils/translations';

interface HeroProps {
    lang: Lang;
    text: any;
    onAnalyze?: () => void;
    onOpenChat?: (intent: string) => void;
    userName?: string;
}

const Hero: React.FC<HeroProps> = ({ lang, text, onOpenChat, userName }) => {
  const [projectInput, setProjectInput] = useState('');

  // TanStack Query Mutation for Project Analysis
  const analysisMutation = useMutation({
    mutationFn: async (input: string) => {
      return await analyzeProjectNeeds(input, lang, userName);
    },
    onError: (error) => {
      console.error("Analysis Failed", error);
    }
  });

  const handleAnalyze = () => {
    if (!projectInput.trim()) return;
    analysisMutation.mutate(projectInput);
  };

  const analysis = analysisMutation.data;
  const isAnalyzing = analysisMutation.isPending;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden px-4 perspective-1000">
      
      {/* --- ATMOSPHERE LAYERS --- */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-gradient-radial from-spring-neon/10 via-transparent to-transparent opacity-60 pointer-events-none mix-blend-screen blur-3xl dark:opacity-40 opacity-30"></div>
      
      <div className="z-10 max-w-[90vw] md:max-w-7xl mx-auto flex flex-col items-center text-center relative">
        
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight mb-8 leading-[1.1] text-zinc-900 dark:text-white animate-reveal opacity-0 select-none drop-shadow-2xl text-balance mt-10 md:mt-0 transition-colors duration-500" style={{ animationDelay: '0.2s' }}>
          {text.h1} <br className="hidden md:block" />
          <span className="text-grad-multiversa italic font-light relative inline-block">
             {text.h2}
             {/* Glow behind text */}
             <span className="absolute inset-0 bg-spring-neon/20 blur-2xl -z-10 opacity-30"></span>
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-base md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-light mb-16 animate-reveal opacity-0 leading-relaxed tracking-wide px-4 transition-colors duration-500" style={{ animationDelay: '0.4s' }}>
            {text.p}
            <span className="block mt-4 text-[10px] md:text-xs text-spring-text dark:text-spring-neon/60 font-mono tracking-[0.15em] opacity-80 uppercase">{text.powered}</span>
        </p>

        {/* UTILITY CONSOLE - LUX INTERFACE */}
        <div className="w-full max-w-2xl animate-reveal opacity-0 relative group mx-4" style={{ animationDelay: '0.6s' }}>
            {/* Glow Effect behind input */}
            <div className="absolute -inset-1 bg-gradient-to-r from-spring-neon/20 via-electric-blue/20 to-spring-neon/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="glass-cinematic p-2 rounded-2xl flex flex-col gap-2 relative bg-white/70 dark:bg-onyx/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-xl transition-colors duration-500">
                
                {/* Input Bar */}
                <div className="flex flex-col md:flex-row items-center gap-2 px-4 py-3 bg-white/50 dark:bg-onyx/40 rounded-xl border border-black/5 dark:border-white/5 focus-within:border-spring-dim dark:focus-within:border-spring-neon/30 transition-all duration-500">
                    <span className="text-spring-dim dark:text-spring-neon font-mono text-lg animate-pulse hidden md:block">{'>'}</span>
                    <input 
                        type="text" 
                        value={projectInput}
                        onChange={(e) => setProjectInput(e.target.value)}
                        placeholder={text.input}
                        className="w-full md:flex-1 bg-transparent border-none outline-none text-zinc-800 dark:text-zinc-100 text-sm md:text-base font-light placeholder-zinc-400 dark:placeholder-zinc-500 font-mono caret-spring-dim dark:caret-spring-neon tracking-wide text-center md:text-left"
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    />
                    <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full md:w-auto px-6 py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold uppercase rounded-lg hover:text-spring-dim dark:hover:text-spring-neon transition-all tracking-[0.2em] border border-black/5 dark:border-white/5 hover:border-spring-dim/20 dark:hover:border-spring-neon/20 active:scale-95 flex items-center justify-center gap-2 min-w-[140px]"
                    >
                        {isAnalyzing ? (
                            <span className="flex gap-1">
                                <span className="w-1 h-1 bg-spring-dim dark:bg-spring-neon rounded-full animate-bounce"></span>
                                <span className="w-1 h-1 bg-spring-dim dark:bg-spring-neon rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></span>
                            </span>
                        ) : (
                            <span>{text.button}</span>
                        )}
                    </button>
                </div>
                
                {/* STRATEGIC ROADMAP RESULT */}
                {analysis && (
                    <div className="mt-2 text-left p-0 rounded-xl bg-zinc-50 dark:bg-[#0A0A0B] border border-spring-dim/30 dark:border-spring-neon/30 relative overflow-hidden animate-reveal shadow-2xl">
                         
                         {/* Header Band */}
                         <div className="bg-spring-neon/10 px-6 py-3 border-b border-spring-neon/10 flex justify-between items-center">
                             <span className="text-[10px] font-mono uppercase tracking-widest text-spring-dim dark:text-spring-neon flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-spring-dim dark:bg-spring-neon animate-pulse"></span>
                                {text.resultTitle}
                             </span>
                             <span className="text-[10px] font-mono text-zinc-500">{analysis.planMatch} Protocol</span>
                         </div>

                        <div className="p-6 relative z-10">
                            {/* Briefing Section */}
                            <div className="mb-6">
                                <h3 className="text-zinc-900 dark:text-white text-lg font-medium mb-2">Briefing de Objetivo</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-light leading-relaxed border-l-2 border-spring-dim dark:border-spring-neon pl-4 italic">
                                    "{analysis.briefing}"
                                </p>
                            </div>
                            
                            {/* Roadmap Steps */}
                            <div className="space-y-3 mb-6">
                                {analysis.roadmap?.map((step: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-500 border border-black/10 dark:border-white/10">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-zinc-800 dark:text-zinc-200">{step}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Action Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/10">
                                <span className="text-zinc-500 text-xs font-mono">Status: READY TO DEPLOY</span>
                                <button 
                                    onClick={() => onOpenChat && onOpenChat(analysis.planMatch)}
                                    className="px-5 py-2.5 bg-spring-dim dark:bg-spring-neon text-white dark:text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-spring-neon dark:hover:bg-spring-dim transition-colors shadow-[0_0_15px_rgba(0,255,161,0.3)]"
                                >
                                    ACTIVAR {analysis.planMatch}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
