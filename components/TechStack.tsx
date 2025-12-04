
import React from 'react';
import { Lang } from '../utils/translations';

interface TechStackProps {
    lang: Lang;
    text: any;
}

const TechStack: React.FC<TechStackProps> = ({ lang, text }) => {
    return (
        <div className="w-full flex flex-col justify-center items-center px-4 relative py-16">
            {/* Header */}
            <div className="text-center w-full max-w-2xl scroll-reveal mb-8">
                <div className="flex items-center justify-center gap-2 text-lime-600 dark:text-lime-neon font-mono text-xs tracking-widest uppercase mb-4">
                    <span className="w-2 h-2 bg-lime-600 dark:bg-lime-neon rounded-full animate-pulse"></span>
                    {lang === 'es' ? 'Arquitectura del Sistema' : 'System Architecture'}
                </div>
                <h2 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-white mb-4 tracking-tighter">{text.title}</h2>
                <p className="text-zinc-500 font-light text-sm md:text-base tracking-wide">{text.subtitle}</p>
            </div>
        </div>
    );
};

export default TechStack;
