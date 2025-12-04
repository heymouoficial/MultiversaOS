
import React from 'react';
import { Lang } from '../utils/translations';

interface WorkflowProps {
    lang: Lang;
    text: any;
}

const Workflow: React.FC<WorkflowProps> = ({ text }) => {
    
  const steps = [
    { id: '01', title: text.step1Title, desc: text.step1Desc, icon: '⚡' },
    { id: '02', title: text.step2Title, desc: text.step2Desc, icon: '📐' },
    { id: '03', title: text.step3Title, desc: text.step3Desc, icon: '🤖' },
    { id: '04', title: text.step4Title, desc: text.step4Desc, icon: '🚀' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 md:px-6 relative py-20">
       
       <div className="max-w-6xl w-full relative z-10 flex flex-col items-center">
         
         <div className="text-center mb-16 md:mb-24">
             <div className="flex items-center justify-center gap-2 mb-3">
                 <span className="w-2 h-2 rounded-full bg-lime-600 dark:bg-lime-neon animate-pulse"></span>
                 <h2 className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Process Automation</h2>
             </div>
             <h3 className="text-3xl md:text-5xl font-light text-zinc-900 dark:text-white tracking-tight">System Workflow</h3>
         </div>

         {/* n8n Style Pipeline - Responsive Layout */}
         <div className="relative w-full grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            
            {/* Connection Line Layer (Desktop) */}
            <div className="absolute top-1/2 left-0 w-full h-1 hidden md:block -translate-y-1/2 -z-10">
                <svg className="w-full h-20 -translate-y-[40px]" preserveAspectRatio="none">
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="2" className="text-black/5 dark:text-white/10" strokeDasharray="6 6" />
                    {/* Animated Data Flow */}
                    <circle r="4" fill="#D4FF70" className="hidden dark:block">
                        <animateMotion dur="3s" repeatCount="indefinite" path="M0,40 L1500,40" />
                    </circle>
                    <circle r="4" fill="#4D7C0F" className="block dark:hidden">
                        <animateMotion dur="3s" repeatCount="indefinite" path="M0,40 L1500,40" />
                    </circle>
                </svg>
            </div>

            {/* Connection Line Layer (Mobile) */}
             <div className="absolute top-0 left-8 h-full w-1 block md:hidden -z-10">
                 <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-lime-600/30 dark:via-lime-neon/30 to-transparent"></div>
            </div>

            {steps.map((step, index) => (
                <div key={step.id} className="relative group">
                    
                    {/* Node Card */}
                    <div className="glass-cinematic p-6 rounded-2xl bg-white/60 dark:bg-[#0A0A0C]/80 border border-black/5 dark:border-white/10 hover:border-lime-500/50 dark:hover:border-lime-neon/50 transition-all duration-300 h-full flex flex-col md:items-center md:text-center text-left relative overflow-hidden group-hover:-translate-y-2 shadow-sm hover:shadow-xl dark:shadow-none">
                        
                        {/* Connection Point (Desktop) */}
                        <div className="absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-zinc-100 dark:border-black hidden md:block"></div>
                        <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-zinc-100 dark:border-black hidden md:block"></div>
                        
                         {/* Connection Point (Mobile) */}
                         <div className="absolute top-0 left-8 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-lime-600 dark:bg-lime-neon md:hidden shadow-[0_0_10px_currentColor]"></div>

                        {/* Top Tag */}
                        <div className="flex justify-between items-center w-full mb-4 md:justify-center">
                             <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 text-xl">
                                {step.icon}
                             </div>
                             <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 tracking-widest md:absolute md:top-4 md:right-4">
                                NODE_{step.id}
                             </span>
                        </div>

                        <h4 className="text-lg font-medium text-zinc-900 dark:text-white mb-2 group-hover:text-lime-600 dark:group-hover:text-lime-neon transition-colors">
                            {step.title}
                        </h4>
                        
                        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                            {step.desc}
                        </p>
                        
                        {/* Active State Indicator */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-600 dark:via-lime-neon to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
            ))}
         </div>
         
         {/* Bottom Label */}
         <div className="mt-16 text-center">
            <span className="px-3 py-1 rounded-full border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 text-[10px] font-mono text-zinc-500">
                ● Executing Pipeline...
            </span>
         </div>

       </div>
    </div>
  );
};

export default Workflow;
