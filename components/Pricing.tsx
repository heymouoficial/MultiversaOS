
import React from 'react';
import { Lang } from '../utils/translations';

interface PricingProps {
    lang: Lang;
    text: any;
    onSelectPlan: (plan: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ text, onSelectPlan }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 relative py-20 pb-32 md:pb-20">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-spring-neon/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl w-full">
        
        <div className="text-center mb-16 animate-reveal">
            <h2 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-white mb-3 tracking-tighter transition-colors duration-500">
                {text.title}
            </h2>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">{text.subtitle}</p>
        </div>
        
        {/* MAIN TIERS GRID */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch mb-16">
            
            {/* OPTION A: NanoWeb */}
            <div className="glass-cinematic p-8 rounded-3xl flex flex-col relative group bg-white/[0.02] dark:bg-white/[0.02] border border-white/5 hover:border-spring-neon/30 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <div className="mb-8 border-b border-white/5 pb-6">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">{text.freelancerTag}</span>
                        {/* Price Badge */}
                        <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <span className="text-xl font-light text-spring-neon tracking-tight">$200</span>
                        </div>
                     </div>
                     <h3 className="text-3xl font-bold text-white tracking-tight mt-4">{text.freelancerName}</h3>
                     <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mt-1">{text.freelancerSub}</span>
                </div>
                
                <div className="space-y-6 mb-auto">
                    <div>
                        <p className="text-spring-neon/80 text-[10px] font-bold uppercase mb-2 tracking-widest">{text.freelancerWhat}</p>
                        <p className="text-zinc-400 text-sm font-light leading-relaxed">{text.freelancerWhatDesc}</p>
                    </div>
                    <div>
                        <p className="text-spring-neon/80 text-[10px] font-bold uppercase mb-2 tracking-widest">{text.freelancerDoes}</p>
                        <p className="text-zinc-400 text-sm font-light leading-relaxed">{text.freelancerDoesDesc}</p>
                    </div>
                     <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <p className="text-white text-xs font-medium border-l-2 border-spring-neon pl-3 italic opacity-90">{text.freelancerResult}</p>
                    </div>
                </div>
                
                <div className="pt-6 w-full mt-8">
                    <p className="text-[10px] text-zinc-500 font-mono mb-3 text-center uppercase tracking-wider">{text.freelancerDelivery}</p>
                    <button 
                        onClick={() => onSelectPlan('NanoWeb')}
                        className="w-full py-4 rounded-xl bg-transparent border border-white/20 text-zinc-300 text-xs font-bold uppercase tracking-[0.15em] hover:bg-white/5 hover:border-spring-neon/50 hover:text-spring-neon transition-all btn-shine group-hover:bg-white/[0.02]"
                    >
                        Seleccionar
                    </button>
                </div>
            </div>

            {/* OPTION B: SmartWeb (Hero Card) */}
            <div className="glow-border-container p-[1px] flex flex-col relative group md:-mt-6 md:-mb-6 z-10">
                {/* Animated Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-b from-spring-neon/50 via-electric-blue/50 to-spring-neon/50 rounded-xl opacity-40 group-hover:opacity-100 transition-opacity duration-700 blur-[2px]"></div>
                
                <div className="bg-[#1A1A1A] backdrop-blur-2xl rounded-xl w-full h-full p-8 flex flex-col relative overflow-hidden transition-colors duration-500 shadow-[0_0_50px_rgba(0,255,161,0.15)]">
                    <div className="absolute top-0 right-0 p-5">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-spring-neon uppercase tracking-wider animate-pulse">Recomendado</span>
                            <div className="w-2 h-2 rounded-full bg-spring-neon shadow-[0_0_10px_#00FFA1] animate-pulse"></div>
                        </div>
                    </div>
                    
                    <div className="mb-8 border-b border-white/10 pb-6">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono text-spring-dim bg-spring-neon/10 uppercase tracking-[0.2em] border border-spring-neon/20 px-2 py-1 rounded-md">{text.pymeTag}</span>
                             <div className="bg-spring-neon/10 px-4 py-1.5 rounded-full border border-spring-neon/20">
                                <span className="text-3xl font-light text-white tracking-tighter">$400</span>
                             </div>
                         </div>
                         <h3 className="text-4xl font-bold text-grad-multiversa tracking-tighter mt-4">{text.pymeName}</h3>
                         <span className="text-xs font-mono text-spring-dim uppercase tracking-wider block mt-1">{text.pymeSub}</span>
                    </div>

                    <div className="space-y-6 mb-auto">
                        <div>
                            <p className="text-spring-neon text-[10px] font-bold uppercase mb-2 tracking-widest">{text.pymeWhat}</p>
                            <p className="text-zinc-300 text-sm font-light leading-relaxed">{text.pymeWhatDesc}</p>
                        </div>
                        <div>
                            <p className="text-spring-neon text-[10px] font-bold uppercase mb-2 tracking-widest">{text.pymeDoes}</p>
                            <p className="text-zinc-300 text-sm font-light leading-relaxed">{text.pymeDoesDesc}</p>
                        </div>
                         <div className="bg-spring-neon/5 p-4 rounded-lg border border-spring-neon/10">
                            <p className="text-white text-sm font-medium border-l-2 border-spring-neon pl-3 italic">{text.pymeResult}</p>
                        </div>
                    </div>

                    <div className="pt-6 w-full mt-8">
                        <p className="text-[10px] text-zinc-400 font-mono mb-3 text-center uppercase tracking-wider">{text.pymeDelivery}</p>
                        <button 
                             onClick={() => onSelectPlan('SmartWeb')}
                             className="w-full py-4 rounded-xl bg-spring-neon text-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-spring-dim hover:text-white transition-all shadow-[0_0_20px_rgba(0,255,161,0.3)] hover:shadow-[0_0_30px_rgba(0,255,161,0.5)] transform hover:scale-[1.02] active:scale-[0.98] btn-shine"
                        >
                            Reservar Spot
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Web */}
            <div className="glass-cinematic p-8 rounded-3xl flex flex-col relative group bg-white/[0.02] dark:bg-white/[0.02] border border-white/5 transition-colors duration-500 hover:border-white/20">
                <div className="mb-8 border-b border-white/5 pb-6">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Enterprise</span>
                    <h3 className="text-2xl font-normal text-white mt-4">{text.enterprise}</h3>
                     <div className="w-10 h-0.5 bg-zinc-800 mt-2"></div>
                </div>

                <p className="text-zinc-400 text-sm leading-7 mb-4 font-light">
                    {text.enterpriseQuote}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-auto content-start mt-4">
                    {text.customStack?.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded text-[9px] font-mono border border-white/10 text-zinc-500 bg-black/30">
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="pt-6 w-full mt-8">
                    <div className="flex justify-between items-baseline mb-4 px-2">
                        <span className="text-zinc-600 text-[10px] tracking-widest uppercase">Quote</span>
                        <span className="text-[10px] font-mono text-zinc-400 border border-white/10 px-2 py-1 rounded">VIP ONLY</span>
                    </div>
                     <button 
                        onClick={() => onSelectPlan('Custom Web')}
                        className="w-full py-4 rounded-xl bg-transparent border border-dashed border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500 hover:border-spring-neon/50 hover:text-spring-neon hover:border-solid transition-all"
                     >
                        {text.soon}
                    </button>
                </div>
            </div>
        </div>
        
        {/* SEPARATED ADD-ONS SECTION */}
        <div className="w-full max-w-4xl mx-auto mt-12">
             <div className="flex items-center gap-4 mb-8">
                 <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1"></div>
                 <h3 className="text-center text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm border border-white/5">{text.addonsTitle}</h3>
                 <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1"></div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                 
                 {/* Maintenance Card */}
                 <div className="glass-cinematic p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-blue-950/20 to-transparent hover:border-blue-500/30 transition-all duration-300 group flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left hover:-translate-y-1">
                     <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:scale-105 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                     </div>
                     <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                             <h4 className="text-white font-semibold text-base">{text.addon1Title}</h4>
                             <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20 font-mono">{text.addon1Price}</span>
                         </div>
                         <p className="text-zinc-400 text-xs font-light leading-snug">{text.addon1Desc}</p>
                     </div>
                     <button 
                        onClick={() => onSelectPlan(`Add-on: ${text.addon1Title}`)}
                        className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-zinc-300 text-[10px] font-bold tracking-widest uppercase transition-all border border-white/10 shrink-0 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-95"
                     >
                        {text.addonBtn}
                     </button>
                 </div>
                 
                 {/* Content Mgmt Card */}
                  <div className="glass-cinematic p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-purple-950/20 to-transparent hover:border-purple-500/30 transition-all duration-300 group flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left hover:-translate-y-1">
                     <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:scale-105 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                     </div>
                     <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                             <h4 className="text-white font-semibold text-base">{text.addon2Title}</h4>
                             <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-mono">{text.addon2Price}</span>
                         </div>
                         <p className="text-zinc-400 text-xs font-light leading-snug">{text.addon2Desc}</p>
                     </div>
                     <button 
                        onClick={() => onSelectPlan(`Add-on: ${text.addon2Title}`)}
                        className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-purple-600 hover:text-white text-zinc-300 text-[10px] font-bold tracking-widest uppercase transition-all border border-white/10 shrink-0 hover:shadow-[0_0_15px_rgba(147,51,234,0.4)] active:scale-95"
                     >
                        {text.addonBtn}
                     </button>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
