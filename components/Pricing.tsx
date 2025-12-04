
import React from 'react';
import { Lang } from '../utils/translations';

interface PricingProps {
    lang: Lang;
    text: any;
    onSelectPlan: (plan: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ lang, text, onSelectPlan }) => {
    const t = {
        investment: lang === 'es' ? 'Inversión' : 'Investment',
        select: lang === 'es' ? 'Seleccionar' : 'Select',
        bestValue: lang === 'es' ? 'Mejor Opción' : 'Best Value',
        reserveSpot: lang === 'es' ? 'Reservar Spot' : 'Reserve Spot',
        enterprise: lang === 'es' ? 'Empresarial' : 'Enterprise',
        nanoFeatures: lang === 'es'
            ? ['Astro + Gemini Core', 'Flujo guiado inteligente', 'Entrega 6 horas']
            : ['Astro + Gemini Core', 'Intelligent guided flow', '6h Delivery'],
        smartFeatures: lang === 'es'
            ? ['Next.js + Supabase', 'WhatsApp Business', 'Entrega 36 horas']
            : ['Next.js + Supabase', 'WhatsApp Business', '36h Delivery']
    };
    return (
        <div className="w-full h-full flex flex-col justify-center items-center px-4 relative py-20 md:py-0">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-neon/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-6xl w-full">

                <div className="text-center mb-16 animate-reveal">
                    <h2 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-white mb-3 tracking-tighter transition-colors duration-500">
                        {text.title}
                    </h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">{text.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-end">
                    {/* NanoWeb */}
                    <div className="glass-cinematic p-8 rounded-3xl flex flex-col h-[480px] relative group bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/5 transition-colors duration-500">
                        <div className="mb-4">
                            <h3 className="text-2xl font-normal text-zinc-900 dark:text-white">{text.freelancer}</h3>
                            <div className="w-10 h-0.5 bg-zinc-300 dark:bg-zinc-700 mt-2"></div>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-7 mb-auto font-light">
                            {text.freelancerQuote}
                        </p>

                        <div className="pt-6 border-t border-black/5 dark:border-white/5 w-full">
                            <div className="flex justify-between items-baseline mb-4">
                                <span className="text-zinc-400 text-xs tracking-widest uppercase">{t.investment}</span>
                                <span className="text-2xl font-light text-zinc-900 dark:text-white">$200</span>
                            </div>
                            <button
                                onClick={() => onSelectPlan('NanoWeb')}
                                className="w-full py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-zinc-700 dark:text-white text-xs uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 transition-colors btn-shine"
                            >
                                {t.select}
                            </button>
                        </div>
                    </div>

                    {/* SmartWeb (Hero Card) */}
                    <div className="glow-border-container p-[1px] h-[540px] flex flex-col relative group">
                        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-xl w-full h-full p-8 flex flex-col relative overflow-hidden transition-colors duration-500">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="w-2 h-2 rounded-full bg-lime-neon shadow-[0_0_10px_#D4FF70] animate-pulse"></div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-3xl font-normal text-grad-multiversa">{text.pyme}</h3>
                                <div className="w-10 h-0.5 bg-lime-500 dark:bg-lime-neon mt-2"></div>
                            </div>

                            <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-7 mb-6 font-light">
                                {text.pymeQuote}
                            </p>

                            <ul className="space-y-3 mb-auto text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                {t.smartFeatures.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3"><span className="text-lime-600 dark:text-lime-neon">✓</span> {feat}</li>
                                ))}
                            </ul>

                            <div className="pt-6 border-t border-black/10 dark:border-white/10 w-full">
                                <div className="flex justify-between items-baseline mb-4">
                                    <span className="text-lime-600 dark:text-lime-neon font-medium text-xs tracking-widest uppercase">{t.bestValue}</span>
                                    <span className="text-3xl font-light text-zinc-900 dark:text-white">$400</span>
                                </div>
                                <button
                                    onClick={() => onSelectPlan('SmartWeb')}
                                    className="w-full py-3 rounded-xl bg-lime-neon text-black text-xs font-bold uppercase tracking-widest hover:bg-lime-400 transition-colors shadow-[0_0_20px_rgba(190,242,100,0.3)] btn-shine"
                                >
                                    {t.reserveSpot}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Custom Web (Updated) */}
                    <div className="glass-cinematic p-8 rounded-3xl flex flex-col h-[600px] md:h-[540px] relative group bg-white/60 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-white/5 border border-black/5 dark:border-white/5 transition-colors duration-500">
                        <div className="mb-4">
                            <h3 className="text-2xl font-normal text-zinc-900 dark:text-white">{text.enterprise}</h3>
                            <div className="w-10 h-0.5 bg-zinc-300 dark:bg-zinc-700 mt-2"></div>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-7 mb-4 font-light">
                            {text.enterpriseQuote}
                        </p>

                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-2 mb-auto content-start">
                            {text.customStack?.map((tech: string, i: number) => (
                                <span key={i} className="px-2 py-1 rounded text-[10px] font-mono border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 bg-white/50 dark:bg-black/50">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-black/5 dark:border-white/5 w-full">
                            <div className="flex justify-between items-baseline mb-4">
                                <span className="text-zinc-400 text-xs tracking-widest uppercase">{t.enterprise}</span>
                                <span className="text-xs font-mono text-lime-600 dark:text-lime-neon border border-lime-600/20 dark:border-lime-neon/20 px-2 py-1 rounded">CONSULTING</span>
                            </div>
                            <button
                                onClick={() => onSelectPlan('Custom Web')}
                                className="w-full py-3 rounded-xl bg-transparent border border-black/10 dark:border-white/10 text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-300 hover:border-lime-600 dark:hover:border-lime-neon hover:text-lime-600 dark:hover:text-lime-neon transition-colors"
                            >
                                {text.soon}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Pricing;
