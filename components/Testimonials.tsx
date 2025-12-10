import React from 'react';
import { Lang, t } from '../utils/translations';

interface TestimonialsProps {
    lang: Lang;
}

const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
    // Helper to get testimonial data dynamically
    const content = t[lang].testimonials;

    // We strictly use the 3 testimonials defined in translations
    const testimonials = [
        content.t1,
        content.t2,
        content.t3,
        content.t4,
        content.t5
    ];

    return (
        <div className="w-full py-32 px-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20 scroll-reveal">
                    <div className="flex items-center justify-center gap-2 text-lime-600 dark:text-lime-neon font-mono text-xs tracking-widest uppercase mb-4">
                        <span className="w-2 h-2 bg-lime-600 dark:bg-lime-neon rounded-full animate-pulse"></span>
                        TESTIMONIALS
                    </div>
                    <h2 className="text-3xl md:text-5xl font-light text-zinc-900 dark:text-white mb-6 tracking-tight">
                        {content.title}
                    </h2>
                    <p className="text-zinc-500 font-light text-sm md:text-base tracking-wide max-w-lg mx-auto">
                        {content.subtitle}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, i) => (
                        <div
                            key={i}
                            className={`scroll-reveal scroll-reveal-delay-${i + 1} group relative`}
                        >
                            {/* Card */}
                            <div className="h-full glass-cinematic p-8 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-lime-500/30 dark:hover:border-lime-neon/30 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden">

                                {/* Background Gradient */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                {/* Avatar */}
                                <div className="relative w-20 h-20 mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-lime-neon/20 to-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 rounded-full object-cover border-2 border-white/20 dark:border-white/10 group-hover:border-lime-neon/50 transition-all duration-500 relative z-10 grayscale group-hover:grayscale-0"
                                    />
                                </div>

                                {/* Quote Content */}
                                <blockquote className="relative z-10 text-zinc-600 dark:text-zinc-400 text-sm font-light leading-relaxed mb-8 italic">
                                    "{item.quote}"
                                </blockquote>

                                {/* Footer (Name & Role) */}
                                <div className="mt-auto flex flex-col items-center">
                                    <h3 className="text-zinc-900 dark:text-white font-medium text-base mb-1 group-hover:text-lime-600 dark:group-hover:text-lime-neon transition-colors">
                                        {item.name}
                                    </h3>
                                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                                        {item.role}
                                    </span>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
