
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMessageToGemini, ChatMessage } from '../services/gemini';
import { Lang } from '../utils/translations';

interface ChatBotProps {
    lang: Lang;
    text: any;
    externalState: { isOpen: boolean; intent?: string };
    onClose: () => void;
    userName?: string;
    setUserName: (name: string) => void;
}

type ChatStage = 'idle' | 'asking_name' | 'captured_plan' | 'awaiting_payment_choice' | 'showing_payment_data' | 'ticket_ready';

// Lux Avatar
const LUX_IMAGE = "/Logotipo.svg"; // Placeholder for Lux

const ChatBot: React.FC<ChatBotProps> = ({ lang, text, externalState, onClose, userName, setUserName }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [leadId, setLeadId] = useState<string | null>(null);
    const [contextLoaded, setContextLoaded] = useState(false);

    // Lead Flow State
    const [stage, setStage] = useState<ChatStage>('idle');
    const [reservationData, setReservationData] = useState<{
        plan?: string;
        location?: string;
        paymentMethod?: string;
        ticketId?: string;
        isVenezuela?: boolean;
        briefing?: string; // NEW: Briefing field
    }>({});

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // --- SUPABASE INITIALIZATION ---
    useEffect(() => {
        // Placeholder for memory system integration
        const initMemory = async () => {
            if (userName) setContextLoaded(true);
        };
        initMemory();
    }, [userName]);

    // --- TRIGGER HANDLER ---
    useEffect(() => {
        if (externalState.isOpen) {
            scrollToBottom();
            setTimeout(() => inputRef.current?.focus(), 150);

            if (externalState.intent && stage === 'idle') {
                setReservationData(prev => ({ ...prev, plan: externalState.intent }));

                // If we don't have a name, ask for it first
                if (!userName) {
                    setStage('asking_name');
                    const introMsg = lang === 'es'
                        ? `¡Hola! Soy Lux 💫. Veo que tienes interés en: **${externalState.intent}**. Excelente elección.\n\nPara personalizar tu experiencia, ¿cómo te llamas?`
                        : `Hi! I'm Lux 💫. I see you're interested in: **${externalState.intent}**. Great choice.\n\nTo personalize your experience, what's your name?`;
                    addMessage('model', introMsg);
                } else {
                    setStage('captured_plan');
                    const nameGreet = `, ${userName}`;
                    const introMsg = lang === 'es'
                        ? `¡Hola de nuevo${nameGreet}! 💫 Trabajemos en tu **${externalState.intent}**.\n\nPara empezar el briefing, ¿desde qué ciudad o país nos escribes?`
                        : `Welcome back${nameGreet}! 💫 Let's work on your **${externalState.intent}**.\n\nTo start the briefing, which city or country are you writing from?`;
                    addMessage('model', introMsg);
                }
            }
        }
    }, [externalState.isOpen, externalState.intent, lang, userName]);

    // --- INITIAL GREETING ---
    useEffect(() => {
        if (messages.length === 0 && externalState.isOpen && !externalState.intent) {
            const greetingsEs = [
                `¡Bienvenido al Lobby! Soy Lux 💎. Tu guía en Multiversa. ¿En qué puedo ayudarte hoy?`,
                `Hola, soy Lux 💎. Estoy aquí para conectarte con la mejor tecnología. ¿Buscas algo específico?`
            ];
            const greetingsEn = [
                `Welcome to the Lobby! I'm Lux 💎. Your guide in Multiversa. How can I help you today?`,
                `Hi, I'm Lux 💎. I'm here to connect you with the best technology. Looking for something specific?`
            ];

            const greeting = lang === 'es'
                ? greetingsEs[Math.floor(Math.random() * greetingsEs.length)]
                : greetingsEn[Math.floor(Math.random() * greetingsEn.length)];

            // Only add if not already there
            setMessages([{ role: 'model', content: greeting }]);
        }
    }, [lang, externalState.isOpen]);

    useEffect(() => {
        if (externalState.isOpen) scrollToBottom();
    }, [messages, externalState.isOpen]);

    // --- HELPER TO ADD & SAVE MESSAGES ---
    const addMessage = (role: 'user' | 'model', content: string) => {
        setMessages(prev => [...prev, { role, content }]);
    };

    // --- WHATSAPP GENERATOR ---
    const generateWhatsAppLink = (type: 'confirm' | 'call') => {
        const { plan, location, paymentMethod, ticketId, briefing } = reservationData;
        const nameTxt = userName || 'Un Viajero';

        let msg = "";

        if (type === 'call') {
            msg = `Hola Mou 👋, soy ${nameTxt}.
            
Quiero agendar una llamada exploratoria sobre:
*${plan || 'Proyecto Web'}*
------------------------------
Ticket: #${ticketId || 'N/A'}
------------------------------

Quedo atento para coordinar horario.`;
        } else {
            msg = `Hola Mou 👋, soy ${nameTxt}.
      
Tengo el Ticket de Pre-Reserva: *#${ticketId}*
------------------------------
Plan: ${plan}
Ubicación: ${location}
Método Pago: ${paymentMethod}
Briefing: ${briefing ? 'Adjunto' : 'Pendiente'}
------------------------------

Ya tengo los datos de pago. Quedo atento para confirmar y comenzar. 🚀`;
        }

        const encoded = encodeURIComponent(msg);
        return `https://wa.me/14094193523?text=${encoded}`;
    };

    // --- LOGIC HANDLER ---
    const handleSend = async (manualText?: string) => {
        const textToSend = manualText || input;
        if (!textToSend.trim() || isLoading) return;

        addMessage('user', textToSend);
        setInput('');
        setIsLoading(true);

        // Dynamic Loading Text
        const loadingStates = lang === 'es'
            ? ["Lux está pensando...", "Conectando con el Core...", "Analizando..."]
            : ["Lux is thinking...", "Connecting to Core...", "Analyzing..."];
        setLoadingText(loadingStates[Math.floor(Math.random() * loadingStates.length)]);

        // --- STAGE: ASKING NAME ---
        if (stage === 'asking_name') {
            const name = textToSend.trim();
            setUserName(name);
            localStorage.setItem('multiversa_user', name);

            setTimeout(() => {
                const nextMsg = lang === 'es'
                    ? `¡Un gusto, ${name}! Ahora, para configurar tus agentes, cuéntame: ¿Desde qué ciudad o país nos escribes?`
                    : `Nice to meet you, ${name}! Now, to configure your agents, tell me: Which city or country are you writing from?`;

                addMessage('model', nextMsg);
                setStage('captured_plan'); // Move to location stage
                setIsLoading(false);
            }, 1000);
            return;
        }

        // --- STAGE: CAPTURED PLAN -> ASKING LOCATION ---
        if (stage === 'captured_plan') {
            const lowerText = textToSend.toLowerCase();
            const isVzla = lowerText.includes('venezuela') || lowerText.includes('caracas') || lowerText.includes('ccs') || lowerText.includes('maracaibo') || lowerText.includes('valencia');

            setReservationData(prev => ({ ...prev, location: textToSend, isVenezuela: isVzla }));

            // EMPATHY LOGIC
            let empathyMsg = "";
            let paymentOptions = "";

            if (isVzla) {
                empathyMsg = lang === 'es'
                    ? `Entendido. Conocemos el potencial de Venezuela. 🇻🇪 Tu proyecto tendrá toda la robustez necesaria.`
                    : `Understood. We know the potential of Venezuela. 🇻🇪 Your project will have all the necessary robustness.`;

                paymentOptions = lang === 'es'
                    ? `Para tu comodidad, aceptamos **Binance (USDT)** y **Pago Móvil**. ¿Cuál prefieres?`
                    : `For your convenience, we accept **Binance (USDT)** and **Pago Móvil**. Which do you prefer?`;
            } else {
                empathyMsg = lang === 'es'
                    ? `¡Excelente! ${textToSend} es un mercado estratégico.`
                    : `Excellent! ${textToSend} is a strategic market.`;

                paymentOptions = lang === 'es'
                    ? `Generalmente operamos con **Binance (USDT)**, **Zelle** o **Stripe**. ¿Cuál te funciona mejor?`
                    : `We usually operate with **Binance (USDT)**, **Zelle** or **Stripe**. Which works best for you?`;
            }

            setTimeout(() => {
                addMessage('model', `${empathyMsg}\n\n${paymentOptions}`);
                setStage('awaiting_payment_choice');
                setIsLoading(false);
            }, 1200);
            return;
        }

        // --- STAGE: AWAITING PAYMENT CHOICE -> SHOW DATA ---
        if (stage === 'awaiting_payment_choice') {
            const choice = textToSend.toLowerCase();
            setReservationData(prev => ({ ...prev, paymentMethod: textToSend }));

            let detailsMsg = "";

            if (choice.includes('binance') || choice.includes('usdt')) {
                detailsMsg = `Perfecto, crypto es lo ideal. ⚡\n\n**Binance Pay / Email:**\n\`Payments@multiversa.ai\`\n\n(Red directa o Binance Pay).`;
            } else if (choice.includes('movil') || choice.includes('banesco')) {
                detailsMsg = `Entendido. Aquí tienes los datos:\n\n**Pago Móvil Banesco (0134)**\n**Tel:** 0412-532.22.58\n**CI:** 16.619.748`;
            } else {
                detailsMsg = `Listo, anotado **${textToSend}**. Coordinaremos los detalles finales.`;
            }

            setTimeout(() => {
                addMessage('model', detailsMsg);

                // Trigger Ticket Generation
                setTimeout(() => {
                    const ticketId = Math.floor(10000 + Math.random() * 90000).toString();

                    // Generate Briefing based on context
                    const briefing = `${reservationData.plan} para ${userName} en ${reservationData.location}.`; // Simple briefing for now, could be enhanced with Gemini

                    setReservationData(prev => ({ ...prev, ticketId, briefing }));
                    setStage('ticket_ready');

                    addMessage('model', lang === 'es'
                        ? "Generando tu Ticket y Briefing Preliminary... Un momento 📠"
                        : "Generating your Ticket and Preliminary Briefing... One moment 📠"
                    );
                    setIsLoading(false);
                }, 1500);

            }, 800);
            return;
        }

        // --- STANDARD AI CHAT ---
        const delay = Math.random() * 800 + 1000;

        setTimeout(async () => {
            const responseText = await sendMessageToGemini(messages, userMsg.content, lang, userName);
            // Detect intent to escalate to call
            if (responseText.toLowerCase().includes('llamada') || responseText.toLowerCase().includes('call')) {
                // Could trigger call CTA here
            }
            addMessage('model', responseText);
            setIsLoading(false);
        }, delay);

        const userMsg: ChatMessage = { role: 'user', content: textToSend };
    };

    return (
        <>
            {/* FAB */}
            {!externalState.isOpen && (
                <div className="fixed bottom-8 right-6 z-40 animate-reveal">
                    <button
                        onClick={() => onClose()}
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(190,242,100,0.3)] bg-lime-neon text-black group border border-lime-neon/50 transition-transform hover:scale-110"
                    >
                        {/* Changed Icon to Chat Bubble */}
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    </button>
                </div>
            )}

            {/* Main Window */}
            {externalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
                        onClick={onClose}
                    ></div>

                    <div className="relative w-full max-w-[480px] h-[85vh] max-h-[750px] bg-black rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-white/10 animate-scale-up">

                        {/* Header */}
                        <div className="px-5 py-4 bg-[#09090B] border-b border-white/5 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-[0_0_15px_rgba(212,255,112,0.3)] border border-lime-neon/50 p-1 bg-black">
                                    <img src={LUX_IMAGE} alt="Lux" className="w-full h-full object-contain filter hover:brightness-125 transition-all duration-500" />
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-lime-neon rounded-full border border-black animate-pulse"></div>
                                </div>
                                <div>
                                    <h3 className="text-white text-base font-medium tracking-tight flex items-center gap-2">
                                        Lux {userName ? `· ${userName}` : ''}
                                    </h3>
                                    <p className="text-[10px] text-lime-neon/80 font-mono tracking-wider flex items-center gap-1">
                                        Multiversa Lobby
                                        {contextLoaded && <span className="w-1 h-1 rounded-full bg-lime-neon"></span>}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Messages Body */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-black scroll-smooth">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'model' && (
                                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mr-2 mt-2 opacity-50 border border-white/10 p-0.5">
                                            <img src={LUX_IMAGE} alt="AI" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                    <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-lime-neon text-black rounded-br-none font-medium'
                                        : 'bg-[#121214] text-zinc-200 rounded-bl-none border border-white/5 font-light'
                                        }`}>
                                        {msg.role === 'model' ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-body">
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* TICKET UI */}
                            {stage === 'ticket_ready' && reservationData.ticketId && (
                                <div className="animate-reveal mx-auto max-w-[95%] bg-zinc-900 border border-lime-neon/30 rounded-xl p-0 overflow-hidden shadow-[0_0_30px_rgba(212,255,112,0.1)] mb-4 mt-4">
                                    <div className="bg-lime-neon p-3 flex justify-between items-center">
                                        <span className="text-black font-bold font-mono text-xs tracking-widest">MULTIVERSA TICKET</span>
                                        <span className="text-black font-bold text-xs">#{reservationData.ticketId}</span>
                                    </div>
                                    <div className="p-5 space-y-3 relative">
                                        <div className="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),repeating-linear-gradient(45deg,#000_25%,#000_0,#000_75%,#000_0)]" style={{ backgroundSize: '20px 20px' }}></div>
                                        <div className="relative z-10 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Plan</p>
                                                <p className="text-white font-medium text-sm">{reservationData.plan}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Beneficiario</p>
                                                <p className="text-white font-medium text-sm">{userName || 'Guest'}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Briefing AI</p>
                                                <p className="text-zinc-300 text-xs italic border-l-2 border-lime-neon/50 pl-2 my-1">
                                                    {reservationData.briefing}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Ubicación</p>
                                                <p className="text-zinc-300 text-xs">{reservationData.location}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lime-neon text-[10px] font-mono border border-lime-neon/30 px-2 py-0.5 rounded bg-lime-neon/10 animate-pulse">PRE-BOOKED</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="p-3 bg-[#050505] border-t border-white/5 grid grid-cols-2 gap-3">
                                        <a
                                            href={generateWhatsAppLink('call')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="py-3 px-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                            Convertir a Llamada
                                        </a>
                                        <a
                                            href={generateWhatsAppLink('confirm')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="py-3 px-2 bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" /></svg>
                                            Confirmar
                                        </a>
                                    </div>
                                </div>
                            )}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="w-6 h-6 mr-2"></div>
                                    <div className="bg-[#121214] px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-2 items-center">
                                        <span className="text-xs text-zinc-500 font-mono animate-pulse">{loadingText}</span>
                                        <div className="flex gap-1">
                                            <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce"></span>
                                            <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                            <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="bg-[#09090B] border-t border-white/5 shrink-0 flex flex-col">
                            {stage !== 'ticket_ready' && (
                                <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar pb-0">
                                    {messages.length < 2 ? (
                                        <>
                                            <button onClick={() => handleSend(lang === 'es' ? "Quiero una Landing Page" : "I want a Landing Page")} className="suggestion-chip">
                                                🚀 {lang === 'es' ? "Landing Page" : "Landing Page"}
                                            </button>
                                            <button onClick={() => handleSend(lang === 'es' ? "Automatizar WhatsApp" : "Automate WhatsApp")} className="suggestion-chip">
                                                🤖 {lang === 'es' ? "Automatización" : "Automation"}
                                            </button>
                                            <button onClick={() => handleSend(lang === 'es' ? "Consultoría General" : "General Consulting")} className="suggestion-chip">
                                                💡 {lang === 'es' ? "Consultoría" : "Consulting"}
                                            </button>
                                        </>
                                    ) : (
                                        // Empty for now or custom triggers
                                        null
                                    )}
                                </div>
                            )}

                            <div className="p-3">
                                <div className={`relative flex items-center gap-2 bg-[#121214] p-2 rounded-full border border-zinc-800 focus-within:border-lime-neon/50 transition-colors shadow-inner ${stage === 'ticket_ready' ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder={stage === 'ticket_ready' ? "Sesión finalizada. Confirma arriba ☝️" : text.inputPlaceholder}
                                        className="flex-1 bg-transparent border-none text-white text-sm px-4 py-2 focus:ring-0 outline-none placeholder-zinc-600 font-light"
                                        disabled={stage === 'ticket_ready'}
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={isLoading || !input.trim() || stage === 'ticket_ready'}
                                        className="p-3 bg-lime-neon text-black rounded-full hover:bg-lime-400 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-lime-neon/10"
                                    >
                                        <svg className="w-4 h-4 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
