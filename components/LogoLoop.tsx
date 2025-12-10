
import React from 'react';

// Using React Icons as requested for the logos
// Ensure you have react-icons installed: pnpm add react-icons
import { SiGoogle, SiOpenai, SiSupabase, SiVercel, SiNextdotjs, SiN8N, SiAstro, SiReact, SiWhatsapp } from 'react-icons/si';

interface LogoLoopProps {
    logos?: any[]; // Allow custom array if provided
    speed?: number;
    direction?: 'left' | 'right';
}

const LogoLoop: React.FC<LogoLoopProps> = ({
    speed = 50,
    direction = 'left'
}) => {

    // Default Logos as requested: Gemini (Google), ChatGPT (OpenAI), Supabase, Vercel, Next, n8n, Astro, React, Whatsapp
    const defaultLogos = [
        { icon: <SiGoogle className="text-zinc-400 group-hover:text-white transition-colors" />, label: "Gemini" },
        { icon: <SiOpenai className="text-zinc-400 group-hover:text-white transition-colors" />, label: "ChatGPT" },
        { icon: <SiSupabase className="text-zinc-400 group-hover:text-[#3ECF8E] transition-colors" />, label: "Supabase" },
        { icon: <SiVercel className="text-zinc-400 group-hover:text-white transition-colors" />, label: "Vercel" },
        { icon: <SiNextdotjs className="text-zinc-400 group-hover:text-white transition-colors" />, label: "Next.js" },
        { icon: <SiN8N className="text-zinc-400 group-hover:text-[#FF6584] transition-colors" />, label: "n8n" },
        { icon: <SiAstro className="text-zinc-400 group-hover:text-[#BC52EE] transition-colors" />, label: "Astro" },
        { icon: <SiReact className="text-zinc-400 group-hover:text-[#61DAFB] transition-colors" />, label: "React" },
        { icon: <SiWhatsapp className="text-zinc-400 group-hover:text-[#25D366] transition-colors" />, label: "WhatsApp" }
    ];

    // Duplicate list for infinite loop effect
    const loopItems = [...defaultLogos, ...defaultLogos, ...defaultLogos];

    return (
        <div className="w-full relative overflow-hidden py-10 bg-black/20 backdrop-blur-md border-y border-white/5">

            {/* Gradients to fade edges */}
            <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

            <div
                className="flex items-center gap-12 w-max animate-scroll"
                style={{
                    animationDuration: `${speed}s`,
                    animationDirection: direction === 'right' ? 'reverse' : 'normal'
                }}
            >
                {loopItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 group min-w-[100px] grayscale hover:grayscale-0 transition-all duration-500 cursor-help">
                        <div className="text-4xl md:text-5xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                            {item.icon}
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 group-hover:text-lime-neon/80 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            <style>{`
            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); } /* Move half way assuming double duplication covers screen */
            }
            .animate-scroll {
                animation: scroll linear infinite;
            }
            .animate-scroll:hover {
                animation-play-state: paused;
            }
        `}</style>
        </div>
    );
};

export default LogoLoop;
