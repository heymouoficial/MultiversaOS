
import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Workflow from './components/Workflow';
import TechStack from './components/TechStack';
import FinalCTA from './components/FinalCTA';
import ChatBot from './components/ChatBot';
import FAQ from './components/FAQ';
import { t, Lang } from './utils/translations';
import { DottedSurface } from './components/ui/dotted-surface';

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>('es');
  const [isDark, setIsDark] = useState(true);
  const [chatTrigger, setChatTrigger] = useState<{ isOpen: boolean, intent?: string }>({ isOpen: false });
  const [activeSection, setActiveSection] = useState('home');

  // Identity State
  const [userName, setUserName] = useState<string>('');
  // const [showWelcomeModal, setShowWelcomeModal] = useState(false); // REMOVED
  // const [tempName, setTempName] = useState(''); // REMOVED

  // Refs for sections to track scrolling
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const storedName = localStorage.getItem('multiversa_user');
    if (storedName) {
      setUserName(storedName);
    }
    // else {
    //     const timer = setTimeout(() => setShowWelcomeModal(true), 500);
    //     return () => clearTimeout(timer);
    // }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);


  // Scroll Observer for Nav Rail
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of section is visible
    );

    Object.values(sectionRefs.current).forEach((el) => {
      // Ensure 'el' is an Element before observing to resolve TypeScript 'unknown' type error.
      if (el instanceof Element) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Ethereal Scroll Reveal Observer
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      revealObserver.observe(el);
    });

    return () => revealObserver.disconnect();
  }, []);

  // const handleNameSubmit = () => {
  //     if (tempName.trim()) {
  //         const name = tempName.trim();
  //         setUserName(name);
  //         localStorage.setItem('multiversa_user', name);
  //         setShowWelcomeModal(false);
  //     }
  // };

  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');
  const toggleTheme = () => setIsDark(!isDark);

  const text = t[lang];

  const handleOpenChat = (intent?: string) => {
    setChatTrigger({ isOpen: true, intent });
  };

  const toggleChat = () => {
    setChatTrigger(prev => ({ isOpen: !prev.isOpen, intent: undefined }));
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Enhanced Liquid Glass Nav Button
  const NavButton = ({ targetId, label }: { targetId: string, label: string }) => {
    const isActive = activeSection === targetId;

    return (
      <button
        onClick={() => scrollToSection(targetId)}
        className="relative group px-5 py-2 rounded-full overflow-hidden transition-all duration-500 ease-out"
      >
        {/* Glass Background & Border */}
        <div className={`absolute inset-0 rounded-full border transition-all duration-500
            ${isActive
            ? 'bg-lime-500/10 dark:bg-lime-neon/10 border-lime-500/50 dark:border-lime-neon/50 shadow-[0_0_15px_rgba(212,255,112,0.15)]'
            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 group-hover:border-lime-500/30 dark:group-hover:border-lime-neon/30'
          }`}
        ></div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-lime-400/20 dark:bg-lime-neon/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Text Content */}
        <span className={`relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300
            ${isActive
            ? 'text-lime-700 dark:text-lime-neon'
            : 'text-zinc-600 dark:text-zinc-400 group-hover:text-lime-600 dark:group-hover:text-lime-100'
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden ${isDark ? 'bg-black text-zinc-100' : 'bg-zinc-100 text-zinc-900'} transition-colors duration-500 selection:bg-lime-neon/30`}>

      {/* --- WELCOME MODAL REMOVED --- */}

      {/* --- NAVIGATION RAIL (USER JOURNEY) --- */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 items-center">
        {['home', 'stack', 'pricing', 'workflow', 'final'].map((id) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`w-1.5 rounded-full transition-all duration-300 ${activeSection === id ? 'h-8 bg-lime-600 dark:bg-lime-neon shadow-[0_0_10px_currentColor]' : 'h-1.5 bg-zinc-400/50 hover:bg-zinc-400'}`}
            title={id.toUpperCase()}
          />
        ))}
      </div>

      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DottedSurface theme={isDark ? 'dark' : 'light'} className="opacity-50" />
        {isDark ? (
          <>
            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vh] bg-violet-deep/20 blur-[150px] rounded-full animate-pulse-slow"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen animate-float"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[40vh] bg-lime-900/20 blur-[120px] rounded-full mix-blend-screen animate-float" style={{ animationDelay: '4s' }}></div>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          </>
        ) : (
          <>
            <div className="absolute top-[30%] left-[20%] w-[60vw] h-[60vh] bg-lime-200/40 blur-[120px] rounded-full animate-pulse-slow mix-blend-multiply opacity-50"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-cyan-200/40 blur-[100px] rounded-full mix-blend-multiply animate-float opacity-50"></div>
            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </>
        )}
      </div>

      {/* --- LEFT DOCK (HEADER) --- */}
      <div className="fixed top-6 left-4 md:left-8 z-50 animate-reveal flex items-center gap-4" style={{ animationDelay: '0.2s' }}>

        {/* Main Dock */}
        <header className="header-dock h-14 rounded-2xl px-4 flex gap-4 items-center shadow-2xl transition-colors duration-500">
          {/* Logo */}
          <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-2.5 h-2.5 rounded-full bg-lime-600 dark:bg-lime-neon shadow-[0_0_12px_rgba(77,124,15,0.5)] dark:shadow-[0_0_12px_#D4FF70] animate-pulse"></div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-[0.2em] text-zinc-900 dark:text-white">MULTIVERSA</span>
              <span className="text-[8px] font-mono text-zinc-500 dark:text-lime-neon/80 tracking-widest text-right">OS v0.9.5</span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 hidden md:block"></div>

          <nav className="hidden md:flex gap-2">
            <NavButton targetId="home" label="Home" />
            <NavButton targetId="stack" label="Core" />
            <NavButton targetId="pricing" label="Access" />
          </nav>
        </header>

        {/* Controls (Lang + Theme) */}
        <div className="flex gap-2">
          <button
            onClick={toggleLang}
            className="header-dock h-14 rounded-2xl px-4 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-black/5 dark:border-white/10 hover:border-lime-500 dark:hover:border-lime-neon/50 transition-all uppercase flex items-center gap-2 group"
          >
            <span className="text-lime-600 dark:text-lime-neon group-hover:shadow-[0_0_10px_currentColor] transition-shadow">LAN</span> {lang}
          </button>

          <button
            onClick={toggleTheme}
            className="header-dock w-14 h-14 rounded-2xl flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-yellow-600 dark:hover:text-yellow-300 border border-black/5 dark:border-white/10 hover:border-yellow-500 dark:hover:border-yellow-300/50 transition-all group"
          >
            {isDark ? (
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ) : (
              <svg className="w-5 h-5 group-hover:-rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            )}
          </button>
        </div>
      </div>

      {/* --- RIGHT DOCK (STATUS BADGE) --- */}
      <div className="fixed top-6 right-4 md:right-8 z-50 animate-reveal" style={{ animationDelay: '0.4s' }}>
        <div className="h-14 rounded-2xl px-5 flex items-center gap-3 border border-lime-neon bg-lime-neon shadow-[0_0_20px_rgba(212,255,112,0.4)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-30"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
          </span>
          <span className="text-[10px] md:text-[11px] font-mono text-black tracking-[0.15em] uppercase font-bold leading-none">
            {text.hero.spots}
          </span>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <main className="snap-container relative z-10" id="scroll-container">

        <section id="home" ref={(el) => (sectionRefs.current['home'] = el)} className="snap-section">
          <Hero lang={lang} text={text.hero} onOpenChat={handleOpenChat} userName={userName} />
        </section>

        <section id="stack" ref={(el) => (sectionRefs.current['stack'] = el)} className="snap-section">
          <TechStack lang={lang} text={text.stack} />
        </section>

        <section id="pricing" ref={(el) => (sectionRefs.current['pricing'] = el)} className="snap-section">
          <Pricing lang={lang} text={text.pricing} onSelectPlan={handleOpenChat} />
        </section>

        <section id="workflow" ref={(el) => (sectionRefs.current['workflow'] = el)} className="snap-section">
          <Workflow lang={lang} text={text.workflow} />
        </section>

        <section id="final" ref={(el) => (sectionRefs.current['final'] = el)} className="snap-section justify-start pt-20 overflow-y-auto">
          <FAQ lang={lang} text={text.faq} />
          <FinalCTA lang={lang} text={text.cta} onAction={() => handleOpenChat('Final Interest')} />
          <div className="w-full py-6 text-center text-[10px] text-zinc-500 dark:text-zinc-600 font-mono tracking-widest border-t border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md">
            <span>{text.footer?.copyright || '© 2025-2026 Multiversa Group, LLC'}</span>
            <span className="mx-2">·</span>
            <span className="text-lime-600 dark:text-lime-neon/80">{text.footer?.powered || 'Powered By AI & heyMou'}</span>
          </div>
        </section>
      </main>

      <ChatBot
        lang={lang}
        text={text.chat}
        externalState={chatTrigger}
        onClose={toggleChat}
        userName={userName}
        setUserName={setUserName}
      />

    </div>
  );
};

export default App;
