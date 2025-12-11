
import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Pricing from './components/Pricing';
import Workflow from './components/Workflow';
import TechStack from './components/TechStack';
import FinalCTA from './components/FinalCTA';
import ChatBot from './components/ChatBot';
import FAQ from './components/FAQ';
import { t, Lang } from './utils/translations';

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>('es');
  const [isDark, setIsDark] = useState(true);
  const [chatTrigger, setChatTrigger] = useState<{ isOpen: boolean, intent?: string }>({ isOpen: false });
  const [activeSection, setActiveSection] = useState('home');
  
  // Identity State
  const [userName, setUserName] = useState<string>('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [tempName, setTempName] = useState('');

  // Refs for sections to track scrolling
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const storedName = localStorage.getItem('multiversa_user');
    const hasSkipped = sessionStorage.getItem('multiversa_skip_auth');

    if (storedName) {
        setUserName(storedName);
    } else if (!hasSkipped) {
        const timer = setTimeout(() => setShowWelcomeModal(true), 800);
        return () => clearTimeout(timer);
    }

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

  const handleNameSubmit = () => {
      if (tempName.trim()) {
          const name = tempName.trim();
          setUserName(name);
          localStorage.setItem('multiversa_user', name);
          setShowWelcomeModal(false);
      }
  };

  const handleSkip = () => {
      setShowWelcomeModal(false);
      sessionStorage.setItem('multiversa_skip_auth', 'true');
  };

  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');
  const toggleTheme = () => setIsDark(!isDark);
  
  const text = t[lang];

  // Helper for dynamic section names in Rail
  const sectionNames: Record<string, string> = {
      home: text.dock.home,
      reality: text.dock.reality,
      stack: text.dock.core,
      pricing: text.dock.access,
      workflow: text.dock.algo,
      final: 'FAQ'
  };

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
                ? 'bg-spring-neon/10 dark:bg-spring-neon/10 border-spring-neon/50 dark:border-spring-neon/50 shadow-[0_0_15px_rgba(0,255,161,0.15)]' 
                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 group-hover:border-spring-neon/30 dark:group-hover:border-spring-neon/30'
            }`}
        ></div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-spring-neon/20 dark:bg-spring-neon/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Text Content */}
        <span className={`relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300
            ${isActive 
                ? 'text-spring-text dark:text-spring-neon' 
                : 'text-zinc-600 dark:text-zinc-400 group-hover:text-spring-dim dark:group-hover:text-spring-neon'
            }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-onyx text-zinc-100 transition-colors duration-500 selection:bg-spring-neon/30`}>
      
      {/* --- VISION OS WELCOME MODAL --- */}
      {showWelcomeModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              {/* Deep blur backdrop */}
              <div className="absolute inset-0 bg-onyx/40 backdrop-blur-[20px] animate-reveal"></div>
              
              {/* Floating Glass Pane */}
              <div className="relative w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-scale-up flex flex-col items-center text-center overflow-hidden group">
                  
                  {/* Internal Glow */}
                  <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-radial from-spring-neon/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>

                  <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-spring-neon to-electric-blue flex items-center justify-center shadow-[0_0_30px_rgba(0,255,161,0.3)] mb-6 animate-float">
                        <span className="text-black font-bold font-serif text-3xl">M</span>
                  </div>
                  
                  <h2 className="relative z-10 text-2xl text-white font-medium mb-3 tracking-wide drop-shadow-lg">{text.modal.title}</h2>
                  <p className="relative z-10 text-zinc-300 text-sm mb-8 font-light leading-relaxed max-w-xs">{text.modal.label}</p>
                  
                  <div className="relative z-10 w-full group/input">
                    <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                        placeholder={text.modal.placeholder}
                        className="w-full bg-onyx/40 border border-white/10 rounded-2xl px-6 py-4 text-center text-white placeholder-zinc-500 focus:border-spring-neon/50 focus:bg-onyx/60 focus:outline-none transition-all mb-4 font-mono text-sm tracking-wide"
                        autoFocus
                    />
                  </div>
                  
                  <button 
                    onClick={handleNameSubmit}
                    disabled={!tempName.trim()}
                    className="relative z-10 w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-spring-neon transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,161,0.4)] btn-shine mb-4"
                  >
                      {text.modal.button}
                  </button>

                  <button
                    onClick={handleSkip}
                    className="relative z-10 text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest hover:underline decoration-spring-neon underline-offset-4"
                  >
                      {text.modal.skip}
                  </button>
              </div>
          </div>
      )}

      {/* --- NAVIGATION RAIL (USER JOURNEY) --- */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 items-center">
          {['home', 'reality', 'stack', 'pricing', 'workflow', 'final'].map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`w-1.5 rounded-full transition-all duration-300 ${activeSection === id ? 'h-8 bg-spring-dim dark:bg-spring-neon shadow-[0_0_10px_currentColor]' : 'h-1.5 bg-zinc-400/50 hover:bg-zinc-400'}`}
                title={sectionNames[id] || id.toUpperCase()}
              />
          ))}
      </div>

      {/* --- BACKGROUND (ONYX & SPRING) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-onyx">
          {/* Onyx Base with deep gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-onyx via-[#111] to-[#050505]"></div>
          
          {/* Spring & Electric Orbs - Updated Palette */}
          <div className="absolute top-[10%] left-[20%] w-[50vw] h-[50vh] bg-spring-neon/5 blur-[150px] rounded-full animate-float"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vh] bg-electric-blue/5 blur-[130px] rounded-full animate-float-delayed"></div>
          
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* --- LEFT DOCK (HEADER) --- */}
      <div className="fixed top-6 left-4 md:left-8 z-50 animate-reveal flex items-center gap-4" style={{animationDelay: '0.2s'}}>
        
        {/* Main Dock */}
        <header className="header-dock h-14 rounded-2xl px-4 flex gap-4 items-center shadow-2xl transition-colors duration-500">
            {/* Logo */}
            <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => scrollToSection('home')}>
                <div className="w-2.5 h-2.5 rounded-full bg-spring-dim dark:bg-spring-neon shadow-[0_0_12px_rgba(0,255,161,0.5)] dark:shadow-[0_0_12px_#00FFA1] animate-pulse"></div>
                <div className="flex flex-col leading-none">
                    <span className="text-sm font-bold tracking-[0.2em] text-zinc-900 dark:text-white">MULTIVERSA</span>
                    <span className="text-[8px] font-mono text-zinc-500 dark:text-spring-neon/80 tracking-widest text-right">OS v1.0</span>
                </div>
            </div>

            <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 hidden md:block"></div>

            <nav className="hidden md:flex gap-2">
                <NavButton targetId="home" label={text.dock.home} />
                <NavButton targetId="reality" label={text.dock.reality} />
                <NavButton targetId="stack" label={text.dock.core} />
                <NavButton targetId="pricing" label={text.dock.access} />
                <NavButton targetId="workflow" label={text.dock.algo} />
            </nav>
        </header>

        {/* Controls (Lang) */}
        <div className="flex gap-2">
           <button 
              onClick={toggleLang} 
              className="header-dock h-14 rounded-2xl px-4 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-black/5 dark:border-white/10 hover:border-spring-dim dark:hover:border-spring-neon/50 transition-all uppercase flex items-center gap-2 group"
           >
              <span className="text-spring-text dark:text-spring-neon group-hover:shadow-[0_0_10px_currentColor] transition-shadow">LAN</span> {lang}
           </button>
        </div>
      </div>

      {/* --- RIGHT DOCK (STATUS BADGE) --- */}
      <div className="fixed top-6 right-4 md:right-8 z-50 animate-reveal" style={{animationDelay: '0.4s'}}>
         <div className="h-14 rounded-2xl px-5 flex items-center gap-3 border border-spring-neon bg-spring-neon shadow-[0_0_20px_rgba(0,255,161,0.4)]">
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
        
        <section id="home" ref={(el) => { if(el) sectionRefs.current['home'] = el; }} className="snap-section">
            <Hero lang={lang} text={text.hero} onOpenChat={handleOpenChat} userName={userName} />
        </section>

        <section id="reality" ref={(el) => { if(el) sectionRefs.current['reality'] = el; }} className="snap-section">
            <ProblemSolution lang={lang} text={text.reality} />
        </section>

        <section id="stack" ref={(el) => { if(el) sectionRefs.current['stack'] = el; }} className="snap-section">
            <TechStack lang={lang} text={text.stack} />
        </section>

        <section id="pricing" ref={(el) => { if(el) sectionRefs.current['pricing'] = el; }} className="snap-section">
            <Pricing lang={lang} text={text.pricing} onSelectPlan={handleOpenChat} />
        </section>

        <section id="workflow" ref={(el) => { if(el) sectionRefs.current['workflow'] = el; }} className="snap-section">
            <Workflow lang={lang} text={text.workflow} />
        </section>

        <section id="final" ref={(el) => { if(el) sectionRefs.current['final'] = el; }} className="snap-section justify-start pt-20 overflow-y-auto">
            <FAQ lang={lang} text={text.faq} />
            <FinalCTA lang={lang} text={text.cta} onAction={() => handleOpenChat('Final Interest')} />
            
            {/* FOOTER & SAFE CREATIVE BADGE */}
            <div className="w-full py-8 border-t border-black/5 dark:border-white/5 bg-white/40 dark:bg-onyx/40 backdrop-blur-md flex flex-col items-center justify-center gap-2">
                <div className="text-[10px] text-zinc-500 dark:text-zinc-600 font-mono tracking-widest">
                   MULTIVERSA OS [BETA] • 2024
                </div>
                <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-help" title="Digital Fingerprint Protected">
                    <svg className="w-3 h-3 text-spring-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">Protected by SafeCreative</span>
                </div>
            </div>
        </section>
      </main>

      <ChatBot 
        lang={lang} 
        text={text.chat} 
        externalState={chatTrigger} 
        onClose={toggleChat} 
        userName={userName}
      />

    </div>
  );
};

export default App;
