import React, { useState } from 'react';
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
    const [analysis, setAnalysis] = useState<{ recommendation: string; reasoning: string; features?: string[]; time?: string } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!projectInput.trim()) return;
        setIsAnalyzing(true);
        setAnalysis(null);
        const result = await analyzeProjectNeeds(projectInput, lang, userName);
        setAnalysis(result);
        setIsAnalyzing(false);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden px-4 perspective-1000">

            {/* --- ATMOSPHERE LAYERS --- */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-gradient-radial from-violet-glow/10 via-transparent to-transparent opacity-60 pointer-events-none mix-blend-screen blur-3xl dark:opacity-60 opacity-30"></div>

            {/* Ghost Cursor Background */}
            <div className="absolute inset-0 z-0 opacity-40">
                {/* Dynamically imported to avoid SSR issues if needed, but direct use is fine for client apps */}
                {/* <GhostCursor color="#a3e635" /> // lime-400 equivalent */}
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-32 md:pt-48 pb-20 flex flex-col items-center text-center">

                {/* Badge */}
                <div className="mb-8 animate-fade-in-down rounded-full px-3 py-1 bg-lime-500/10 dark:bg-lime-neon/10 border border-lime-500/30 dark:border-lime-neon/30 backdrop-blur-md">
                    <span className="text-[10px] md:text-xs font-mono font-bold text-lime-700 dark:text-lime-neon tracking-[0.2em] uppercase">
                        {text.spots}
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="flex flex-col items-center justify-center font-light tracking-tighter leading-[0.9] mb-8 select-none">
                    <span className="text-5xl md:text-8xl lg:text-9xl text-zinc-900 dark:text-white mix-blend-difference animate-slide-up bg-clip-text text-transparent bg-gradient-to-b from-zinc-800 to-black dark:from-white dark:to-zinc-400">
                        {text.h1}
                    </span>
                    <span className="text-5xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-600 dark:from-lime-300 dark:to-emerald-400 italic font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {text.h2}
                    </span>
                </h1>

                {/* LOGO LOOP REMOVED - MOVED TO APP.TSX FOR FULL WIDTH */}

                {/* Description - Added spacing */}
                <p className="max-w-2xl text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {text.p}
                </p>

                {/* UTILITY CONSOLE - AI ARCHITECT */}
                <div className="w-full max-w-2xl relative group mx-4">
                    {/* Glow Effect behind input */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-lime-neon/20 via-cyan-500/20 to-violet-500/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                    <div className="glass-cinematic p-2 rounded-2xl flex flex-col gap-2 relative bg-white/70 dark:bg-black/60 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-xl transition-colors duration-500">

                        {/* Input Bar */}
                        <div className="flex flex-col md:flex-row items-center gap-2 px-4 py-3 bg-white/50 dark:bg-black/40 rounded-xl border border-black/5 dark:border-white/5 focus-within:border-lime-500 dark:focus-within:border-lime-neon/30 transition-all duration-500">
                            <span className="text-lime-600 dark:text-lime-neon font-mono text-lg animate-pulse hidden md:block">{'>'}</span>
                            <input
                                type="text"
                                value={projectInput}
                                onChange={(e) => setProjectInput(e.target.value)}
                                placeholder={text.input}
                                className="w-full md:flex-1 bg-transparent border-none outline-none text-zinc-800 dark:text-zinc-100 text-sm md:text-base font-light placeholder-zinc-400 dark:placeholder-zinc-500 font-mono caret-lime-500 dark:caret-lime-neon tracking-wide text-center md:text-left"
                                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            />
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full md:w-auto px-6 py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold uppercase rounded-lg hover:text-lime-600 dark:hover:text-lime-neon transition-all tracking-[0.2em] border border-black/5 dark:border-white/5 hover:border-lime-500/20 dark:hover:border-lime-neon/20 active:scale-95 flex items-center justify-center gap-2 min-w-[140px]"
                            >
                                {isAnalyzing ? (
                                    <span className="flex gap-1">
                                        <span className="w-1 h-1 bg-lime-500 dark:bg-lime-neon rounded-full animate-bounce"></span>
                                        <span className="w-1 h-1 bg-lime-500 dark:bg-lime-neon rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                    </span>
                                ) : (
                                    <span>{text.button}</span>
                                )}
                            </button>
                        </div>

                        {/* BLUEPRINT RESULT CARD */}
                        {analysis && (
                            <div className="mt-2 text-left p-6 rounded-xl bg-zinc-50 dark:bg-[#0A0A0B] border border-lime-500/30 dark:border-lime-neon/30 relative overflow-hidden animate-reveal shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
                                {/* Card Decoration */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-lime-500 to-cyan-500 shadow-[0_0_15px_#D4FF70]"></div>
                                <div className="absolute top-0 right-0 text-[200px] leading-none text-black/5 dark:text-white/5 font-bold -translate-y-10 translate-x-10 pointer-events-none select-none">AI</div>

                                <div className="relative z-10 grid md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-zinc-500 text-[10px] font-mono mb-1 uppercase tracking-widest">
                                    // {userName ? `BLUEPRINT FOR ${userName.toUpperCase()}` : 'STRATEGY DETECTED'}
                                        </p>
                                        <h3 className="text-zinc-900 dark:text-white text-xl font-medium mb-3">{analysis.recommendation} Architecture</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-light leading-relaxed mb-4">{analysis.reasoning}</p>
                                    </div>

                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <p className="text-zinc-500 text-[10px] font-mono mb-2 uppercase tracking-widest">// SPECS</p>
                                            <ul className="space-y-1 mb-4">
                                                {analysis.features?.map((f, i) => (
                                                    <li key={i} className="text-xs text-lime-600 dark:text-lime-neon flex items-center gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-lime-600 dark:bg-lime-neon"></span> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/10">
                                            <span className="text-zinc-500 text-xs font-mono">{analysis.time} EST. TIME</span>
                                            <button
                                                onClick={() => onOpenChat && onOpenChat(analysis.recommendation)}
                                                className="px-4 py-2 bg-lime-neon text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-colors"
                                            >
                                                EXECUTE PLAN
                                            </button>
                                        </div>
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
