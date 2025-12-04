
import React from 'react';
import { Lang } from '../utils/translations';

interface TeamMember {
    name: string;
    role: string;
    location: string;
    image: string;
}

interface TeamProps {
    lang: Lang;
}

const Team: React.FC<TeamProps> = ({ lang }) => {
    const members: TeamMember[] = [
        {
            name: 'Carmelo Petti',
            role: lang === 'es' ? 'CEO & Consultor de Negocios' : 'CEO & Business Consultant',
            location: 'USA',
            image: '/team-carmelo.png'
        },
        {
            name: 'Runa Gold',
            role: lang === 'es' ? 'Branding e Investigación IA' : 'Branding & AI Research',
            location: 'Venezuela',
            image: '/team-runa.png'
        },
        {
            name: 'MouQ',
            role: lang === 'es' ? 'Consultor IT con Visión Holística' : 'IT Consultant with Holistic Vision',
            location: 'Venezuela',
            image: '/team-mouq.png'
        }
    ];

    return (
        <div className="w-full py-32 px-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16 scroll-reveal">
                    <div className="flex items-center justify-center gap-2 text-lime-600 dark:text-lime-neon font-mono text-xs tracking-widest uppercase mb-4">
                        <span className="w-2 h-2 bg-lime-600 dark:bg-lime-neon rounded-full animate-pulse"></span>
                        {lang === 'es' ? 'Equipo Multiversa' : 'Multiversa Team'}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-light text-zinc-900 dark:text-white mb-4 tracking-tight">
                        {lang === 'es' ? 'Mentes Detrás del Código' : 'Minds Behind the Code'}
                    </h2>
                    <p className="text-zinc-500 font-light text-sm md:text-base tracking-wide max-w-lg mx-auto">
                        {lang === 'es'
                            ? 'Un equipo global con visión holística, conectando tecnología y estrategia.'
                            : 'A global team with holistic vision, connecting technology and strategy.'}
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {members.map((member, i) => (
                        <div
                            key={member.name}
                            className={`scroll-reveal scroll-reveal-delay-${i + 1} group`}
                        >
                            <div className="glass-cinematic p-6 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-lime-500/30 dark:hover:border-lime-neon/30 transition-all duration-500 hover:-translate-y-2 text-center">

                                {/* Avatar */}
                                <div className="relative w-24 h-24 mx-auto mb-4">
                                    <div className="absolute inset-0 bg-gradient-to-br from-lime-neon/20 to-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-24 h-24 rounded-full object-cover border-2 border-white/20 dark:border-white/10 group-hover:border-lime-neon/50 transition-all duration-500 relative z-10"
                                    />
                                </div>

                                {/* Info */}
                                <h3 className="text-zinc-900 dark:text-white font-medium text-lg mb-1 group-hover:text-lime-600 dark:group-hover:text-lime-neon transition-colors">
                                    {member.name}
                                </h3>
                                <p className="text-zinc-500 text-sm font-light mb-2">
                                    {member.role}
                                </p>
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {member.location}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team;
