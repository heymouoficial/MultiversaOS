
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
        <div className="w-full h-full flex flex-col justify-center items-center px-4 relative py-20 md:py-32">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-neon/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-6xl w-full">

                <div className="text-center mb-16 animate-reveal">
                    <h2 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-white mb-3 tracking-tighter transition-colors duration-500">
                        {text.title}
                    </h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">{text.subtitle}</p>
                </div>

                {/* BENTO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* 1. NanoWeb (Col 1) */}
                    <div className="md:col-span-1 glass-cinematic p-6 rounded-3xl flex flex-col relative group bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/5 transition-colors duration-500 h-[420px]">
                        <h3 className="text-xl font-normal text-zinc-900 dark:text-white mb-2">{text.freelancer}</h3>
                        <div className="w-8 h-0.5 bg-zinc-300 dark:bg-zinc-700 mb-4"></div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-6 mb-auto font-light">
                            {text.freelancerQuote}
                        </p>
                        <div className="pt-4 border-t border-black/5 dark:border-white/5 w-full mt-4">
                            <span className="text-2xl font-light text-zinc-900 dark:text-white block mb-3">$200</span>
                            <button
                                onClick={() => onSelectPlan('NanoWeb')}
                                className="w-full py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-zinc-700 dark:text-white text-[10px] uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            >
                                {t.select}
                            </button>
                        </div>
                    </div>

                    {/* 2. SmartWeb (Main - Col 2&3) */}
                    <div className="md:col-span-2 glow-border-container p-[1px] flex flex-col relative group h-[420px]">
                        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl w-full h-full p-8 flex flex-col relative overflow-hidden transition-colors duration-500">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="px-2 py-1 bg-lime-neon text-black text-[10px] font-bold uppercase tracking-wider rounded">
                                    {t.bestValue}
                                </span>
                            </div>

                            <h3 className="text-3xl font-normal text-grad-multiversa mb-2">{text.pyme}</h3>
                            <div className="w-12 h-0.5 bg-lime-500 dark:bg-lime-neon mb-6"></div>

                            <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-7 mb-6 font-light max-w-md">
                                {text.pymeQuote}
                            </p>

                            <ul className="grid grid-cols-2 gap-2 mb-auto text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                {t.smartFeatures.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-2"><span className="text-lime-600 dark:text-lime-neon">✓</span> {feat}</li>
                                ))}
                            </ul>

                            <div className="pt-6 border-t border-black/10 dark:border-white/10 w-full flex items-center justify-between gap-4">
                                <span className="text-4xl font-light text-zinc-900 dark:text-white">$360 <span className="text-sm text-zinc-500 line-through decoration-lime-neon decoration-2">$400</span></span>
                                <button
                                    onClick={() => onSelectPlan('SmartWeb')}
                                    className="flex-1 py-3 rounded-xl bg-lime-neon text-black text-xs font-bold uppercase tracking-widest hover:bg-lime-400 transition-colors shadow-[0_0_20px_rgba(190,242,100,0.3)]"
                                >
                                    {t.reserveSpot}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3. Custom Web (Col 4) */}
                    <div className="md:col-span-1 glass-cinematic p-6 rounded-3xl flex flex-col relative group bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/5 transition-colors duration-500 h-[420px]">
                        <h3 className="text-xl font-normal text-zinc-900 dark:text-white mb-2">{text.enterprise}</h3>
                        <div className="w-8 h-0.5 bg-zinc-300 dark:bg-zinc-700 mb-4"></div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-6 mb-auto font-light">
                            {text.enterpriseQuote}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {text.customStack?.slice(0, 3).map((tech: string, i: number) => (
                                <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-mono border border-black/10 dark:border-white/10 text-zinc-500 dark:text-zinc-500 bg-white/50 dark:bg-black/50">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-black/5 dark:border-white/5 w-full mt-4">
                            <span className="text-sm font-mono text-zinc-500 block mb-3 uppercase">Blueprint Gratis</span>
                            <button
                                onClick={() => onSelectPlan('Custom Web')}
                                className="w-full py-2.5 rounded-xl bg-transparent border border-black/10 dark:border-white/10 text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-300 hover:border-lime-600 dark:hover:border-lime-neon hover:text-lime-600 dark:hover:text-lime-neon transition-colors"
                            >
                                {text.soon}
                            </button>
                        </div>
                    </div>

                    {/* 4. Add-on 1: Support */}
                    <div className="md:col-span-2 glass-cinematic p-6 rounded-3xl flex items-center justify-between relative group bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/5">
                        <div>
                            <h4 className="text-lg text-zinc-900 dark:text-white mb-1">{text.support}</h4>
                            <p className="text-xs text-zinc-500">{text.supportDesc}</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-light text-zinc-900 dark:text-white">$10<span className="text-xs text-zinc-500">/mo</span></span>
                            <button onClick={() => onSelectPlan('Addon: Support')} className="text-[10px] text-lime-600 dark:text-lime-neon hover:underline uppercase tracking-wider mt-1">{text.add}</button>
                        </div>
                    </div>

                    {/* 5. Add-on 2: Content */}
                    <div className="md:col-span-2 glass-cinematic p-6 rounded-3xl flex items-center justify-between relative group bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/5">
                        <div>
                            <h4 className="text-lg text-zinc-900 dark:text-white mb-1">{text.content}</h4>
                            <p className="text-xs text-zinc-500">{text.contentDesc}</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-light text-zinc-900 dark:text-white">$20<span className="text-xs text-zinc-500">/mo</span></span>
                            <button onClick={() => onSelectPlan('Addon: Content')} className="text-[10px] text-lime-600 dark:text-lime-neon hover:underline uppercase tracking-wider mt-1">{text.add}</button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Pricing;
