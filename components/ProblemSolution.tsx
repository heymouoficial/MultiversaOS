
import React from 'react';
import { Lang } from '../utils/translations';

interface ProblemSolutionProps {
    lang: Lang;
    text: any;
}

const ProblemSolution: React.FC<ProblemSolutionProps> = ({ text }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center px-4 relative py-20">
      
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* THE PROBLEM CARD */}
        <div className="glass-cinematic p-8 rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-900/10 to-transparent relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[60px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <h3 className="text-sm font-mono tracking-widest uppercase text-red-400">{text.problemTitle}</h3>
                </div>
                
                <p className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed">
                    {text.problemText}
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-xs text-red-400/60 font-mono uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    {text.systemCritical}
                </div>
            </div>
        </div>

        {/* THE SOLUTION CARD */}
        <div className="glass-cinematic p-8 rounded-3xl border border-spring-neon/30 bg-gradient-to-b from-spring-neon/5 to-transparent relative group overflow-hidden shadow-[0_0_30px_rgba(0,255,161,0.05)]">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-spring-neon/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-spring-neon shadow-[0_0_10px_#00FFA1] animate-pulse"></span>
                    <h3 className="text-sm font-mono tracking-widest uppercase text-spring-neon">{text.solutionTitle}</h3>
                </div>
                
                <p className="text-white text-lg md:text-xl font-light leading-relaxed">
                    {text.solutionText}
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs text-spring-neon/60 font-mono uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {text.activeAssets}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProblemSolution;
