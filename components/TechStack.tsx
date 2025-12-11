
import React from 'react';
import { Lang } from '../utils/translations';

interface TechStackProps {
    lang: Lang;
    text: any;
}

const TechStack: React.FC<TechStackProps> = ({ text }) => {
  const stack = [
    { 
        name: text.desc1, // "Atención 24/7"
        desc: "ALWAYS ON",
        // Icon: Chat/Communication Bubble (Dynamic)
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-[#FF5D01] drop-shadow-[0_0_15px_rgba(255,93,1,0.2)]">
               <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
        )
    },
    { 
        name: text.desc2, // "Memoria de Clientes"
        desc: "DATA LAYER",
        // Icon: Database/Brain
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-electric-dim dark:text-electric-blue drop-shadow-[0_0_15px_rgba(0,230,255,0.2)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
        )
    },
    { 
        name: text.desc3, // "Velocidad Global"
        desc: "EDGE NETWORK",
        // Icon: Lightning/Speed
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-zinc-900 dark:text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        )
    },
    { 
        name: text.desc4, // "Cierre de Ventas"
        desc: "AI AGENTS",
        // Icon: Target/Check
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-spring-dim dark:text-spring-neon drop-shadow-[0_0_15px_rgba(0,255,161,0.2)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 relative py-32 md:py-0">
       {/* Enhanced Mesh Background */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-200/50 via-zinc-50 to-zinc-50 dark:from-onyx/20 dark:via-onyx dark:to-onyx opacity-60 z-0"></div>
       <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(rgba(100, 100, 100, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 100, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-5xl mx-auto z-10 w-full flex flex-col items-center">
         
         {/* Centered Header */}
         <div className="mb-24 text-center w-full max-w-2xl border-b border-black/5 dark:border-white/5 pb-10">
            <div className="flex items-center justify-center gap-2 text-spring-dim dark:text-spring-neon font-mono text-xs tracking-widest uppercase mb-4">
                <span className="w-2 h-2 bg-spring-dim dark:bg-spring-neon rounded-full animate-pulse"></span>
                Ecosistema Digital
            </div>
            <h2 className="text-4xl md:text-6xl font-light text-zinc-900 dark:text-white mb-4 tracking-tighter">{text.title}</h2>
            <p className="text-zinc-500 font-light text-sm md:text-base tracking-wide">{text.subtitle}</p>
         </div>
         
         {/* Grid */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {stack.map((item, i) => (
                <div 
                    key={i} 
                    className="glass-cinematic p-8 rounded-2xl flex flex-col items-center text-center group bg-white/60 dark:bg-white/[0.02] hover:bg-white/80 dark:hover:bg-white/[0.05] border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all duration-500 hover:-translate-y-2 shadow-sm dark:shadow-none min-h-[220px] justify-center"
                    style={{ transitionDelay: `${i * 100}ms` }}
                >
                    <div className="mb-6 transform transition-transform duration-500 ease-out scale-100 group-hover:scale-110 group-hover:text-spring-dim dark:group-hover:text-spring-neon">
                        {item.icon}
                    </div>
                    <h4 className="text-zinc-900 dark:text-white font-medium text-lg mb-2 tracking-wide group-hover:text-spring-dim dark:group-hover:text-spring-neon transition-colors">{item.name}</h4>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">{item.desc}</p>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default TechStack;
