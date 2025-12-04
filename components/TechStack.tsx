
import React from 'react';
import { Lang } from '../utils/translations';

interface TechStackProps {
    lang: Lang;
    text: any;
}

const TechStack: React.FC<TechStackProps> = ({ text }) => {
    const stack = [
        {
            name: 'Astro',
            desc: text.desc1,
            // Astro Line Icon (Rocket/Launch)
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-[#FF5D01] drop-shadow-[0_0_15px_rgba(255,93,1,0.2)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
            )
        },
        {
            name: 'Supabase',
            desc: text.desc2,
            // Supabase Line Icon (Database/Bolt)
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-[#3ECF8E] drop-shadow-[0_0_15px_rgba(62,207,142,0.2)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 8.75L10 12.25H14L11 15.75" />
                </svg>
            )
        },
        {
            name: 'Vercel',
            desc: text.desc3,
            // Vercel Line Icon (Triangle)
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-zinc-900 dark:text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L4 20H20L12 4Z" />
                </svg>
            )
        },
        {
            name: 'Gemini 3.0',
            desc: text.desc4,
            // Gemini Line Icon (Sparkle/Star)
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-[#4aa1f3] drop-shadow-[0_0_15px_rgba(74,161,243,0.2)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 19.455L18 20.25l-.259-.795a2.25 2.25 0 00-1.545-1.545L15.375 17.5l.821-.41a2.25 2.25 0 001.545-1.545L18 14.75l.259.795a2.25 2.25 0 001.545 1.545l.821.41-.821.41a2.25 2.25 0 00-1.545 1.545z" />
                </svg>
            )
        }
    ];

    return (
        <div className="w-full h-full flex flex-col justify-center items-center px-4 relative py-32 md:py-0">
            {/* Enhanced Mesh Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-200/50 via-zinc-50 to-zinc-50 dark:from-zinc-800/20 dark:via-black dark:to-black opacity-60 z-0"></div>
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(rgba(100, 100, 100, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 100, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-5xl mx-auto z-10 w-full flex flex-col items-center">

                {/* Centered Header */}
                <div className="mb-32 text-center w-full max-w-2xl border-b border-black/5 dark:border-white/5 pb-10 scroll-reveal">
                    <div className="flex items-center justify-center gap-2 text-lime-600 dark:text-lime-neon font-mono text-xs tracking-widest uppercase mb-4">
                        <span className="w-2 h-2 bg-lime-600 dark:bg-lime-neon rounded-full animate-pulse"></span>
                        System Architecture
                    </div>
                    <h2 className="text-4xl md:text-6xl font-light text-zinc-900 dark:text-white mb-4 tracking-tighter">{text.title}</h2>
                    <p className="text-zinc-500 font-light text-sm md:text-base tracking-wide">{text.subtitle}</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    {stack.map((tech, i) => (
                        <div
                            key={tech.name}
                            className={`glass-cinematic p-8 rounded-2xl flex flex-col items-center text-center group bg-white/60 dark:bg-white/[0.02] hover:bg-white/80 dark:hover:bg-white/[0.05] border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all duration-500 hover:-translate-y-2 shadow-sm dark:shadow-none min-h-[220px] justify-center scroll-reveal scroll-reveal-delay-${i + 1}`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <div className="mb-6 transform transition-transform duration-500 ease-out scale-100 group-hover:scale-110 group-hover:text-lime-600 dark:group-hover:text-lime-neon">
                                {tech.icon}
                            </div>
                            <h4 className="text-zinc-900 dark:text-white font-medium text-lg mb-2 tracking-wide group-hover:text-lime-600 dark:group-hover:text-lime-neon transition-colors">{tech.name}</h4>
                            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">{tech.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TechStack;
