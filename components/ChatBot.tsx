
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMessageToGemini, ChatMessage } from '../services/gemini';
import { memorySystem } from '../services/supabase';
import { Lang } from '../utils/translations';

interface ChatBotProps {
    lang: Lang;
    text: any;
    externalState: { isOpen: boolean; intent?: string };
    onClose: () => void;
    userName?: string;
}

type ChatStage = 'idle' | 'captured_plan' | 'awaiting_payment_choice' | 'showing_payment_data' | 'ticket_ready';

// Lux Image - Professional, Sleek, Lobby Host vibe
const LUX_IMAGE = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3"; 

const ChatBot: React.FC<ChatBotProps> = ({ lang, text, externalState, onClose, userName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
  }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- SUPABASE INITIALIZATION ---
  useEffect(() => {
    const initMemory = async () => {
        if (!userName) return;
        try {
            const id = await memorySystem.identifyUser(userName);
            if (id) {
                setLeadId(id);
                // Load previous context if any
                const context = await memorySystem.getContext(id);
                if (context && context.length > 0) {
                     console.log("Memory loaded:", context.length, "messages");
                }
                setContextLoaded(true);
            }
        } catch (e) {
            console.error("Memory initialization failed", e);
        }
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
            setStage('captured_plan');
            
            const nameGreet = userName ? `, ${userName}` : '';
            const introMsg = lang === 'es' 
                ? `¡Excelente elección${nameGreet}! ✨ El plan **${externalState.intent}** es uno de mis favoritos para escalar.\n\nPara preparar tu carpeta de bienvenida, cuéntame: ¿Desde qué ciudad nos visitas hoy?`
                : `Excellent choice${nameGreet}! ✨ The **${externalState.intent}** plan is one of my favorites for scaling.\n\nTo prepare your welcome kit, tell me: Which city are you visiting us from today?`;
            
            addMessage('model', introMsg);
        }
    }
  }, [externalState.isOpen, externalState.intent, lang, userName]);

  // --- INITIAL GREETING ---
  useEffect(() => {
    if (messages.length === 0 && externalState.isOpen && !externalState.intent) {
        const nameGreet = userName ? `Sr/a. ${userName}` : 'Visionario';
        const greeting = lang === 'es' 
            ? `¡Bienvenido al Lobby de Multiversa, ${nameGreet}! ✨\n\nSoy **Lux**, Directora de Comunicaciones. Estoy aquí para escucharte y asignarte los recursos perfectos. ¿En qué proyecto estás pensando?` 
            : `Welcome to the Multiversa Lobby, ${nameGreet}! ✨\n\nI'm **Lux**, Head of Communications. I'm here to listen and allocate the perfect resources for you. What project do you have in mind?`;
        
        // Only add if not already there
        setMessages([{ role: 'model', content: greeting }]);
    }
  }, [lang, userName, externalState.isOpen]);

  useEffect(() => {
    if (externalState.isOpen) scrollToBottom();
  }, [messages, externalState.isOpen]);

  // --- HELPER TO ADD & SAVE MESSAGES ---
  const addMessage = (role: 'user' | 'model', content: string) => {
      setMessages(prev => [...prev, { role, content }]);
      // Persist to Supabase
      if (leadId) {
          memorySystem.saveMessage(leadId, role, content);
      }
  };

  // --- WHATSAPP GENERATOR ---
  const generateWhatsAppLink = () => {
      const { plan, location, paymentMethod, ticketId } = reservationData;
      const nameTxt = userName || 'Un Viajero';
      
      const msg = `Hola equipo (Att: Lux) 👋, soy ${nameTxt}.
      
Tengo mi Pase de Acceso: *#${ticketId}*
------------------------------
Plan Sugerido: ${plan}
Ubicación: ${location}
Método Pago: ${paymentMethod}
------------------------------

Lux ya me dio la inducción. Quedo a la espera de los Ingenieros. 🚀`;

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
                ? `Entendido. Admiramos mucho la resiliencia en Venezuela. 💎 Ten por seguro que nuestros sistemas están optimizados para operar perfectamente allá.`
                : `Understood. We greatly admire the resilience in Venezuela. 💎 Rest assured our systems are optimized to operate perfectly there.`;
            
            paymentOptions = lang === 'es'
                ? `Para agilizar tu ingreso, ¿prefieres usar **Binance (USDT)** o **Pago Móvil**?`
                : `To expedite your entry, do you prefer **Binance (USDT)** or **Pago Móvil**?`;
        } else {
            empathyMsg = lang === 'es'
                ? `¡Qué maravilla ${textToSend}! Es un mercado vibrante para expandirse digitalmente.`
                : `How wonderful, ${textToSend}! It's a vibrant market for digital expansion.`;
            
            paymentOptions = lang === 'es'
                ? `Para tu comodidad administrativa, operamos con **Binance (USDT)**, **Zelle** o **Stripe**. ¿Cuál prefieres?`
                : `For your administrative convenience, we operate with **Binance (USDT)**, **Zelle** or **Stripe**. Which do you prefer?`;
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
            detailsMsg = `Excelente elección, somos crypto-friendly. ⚡\n\n**Binance Pay / Email:**\n\`Payments@multiversa.ai\`\n\n(Asegúrate de seleccionar la red correcta si envías por wallet, pero por Binance Pay es directo).`;
        } else if (choice.includes('movil') || choice.includes('banesco')) {
             detailsMsg = `Perfecto. Aquí tienes los datos corporativos para la transferencia:\n\n**Pago Móvil Banesco (0134)**\n**Tel:** 0412-532.22.58\n**CI:** 16.619.748\n\nPor favor conserva el comprobante.`;
        } else {
             detailsMsg = `Tomado nota: **${textToSend}**. Le pasaré este dato al departamento de administración para coordinarlo contigo.`;
        }

        setTimeout(() => {
            addMessage('model', detailsMsg);
            
            // Trigger Ticket Generation after a brief pause
            setTimeout(() => {
                 const ticketId = Math.floor(10000 + Math.random() * 90000).toString();
                 setReservationData(prev => ({ ...prev, ticketId }));
                 setStage('ticket_ready');
                 
                 addMessage('model', lang === 'es' 
                        ? "Permíteme un segundo, estoy imprimiendo tu Pase de Acceso... 📠" 
                        : "Give me a second, I'm printing your Access Pass... 📠" 
                 );
                 setIsLoading(false);
            }, 1500);

        }, 800);
        return;
    }

    // --- STANDARD AI CHAT (Lux Mode with Memory) ---
    const delay = Math.random() * 800 + 600; 

    setTimeout(async () => {
        // Load context again just in case (though we usually have local history)
        const contextMemory = leadId ? await memorySystem.getContext(leadId) : [];
        
        const responseText = await sendMessageToGemini(messages, userMsg.content, lang, userName, contextMemory);
        addMessage('model', responseText);
        setIsLoading(false);
    }, delay);

    // Need access to the message just added in the closure, so we reconstruct:
    const userMsg: ChatMessage = { role: 'user', content: textToSend };
  };

  const triggers = [
    { label: text.triggers.what, val: text.triggers.what },
    { label: text.triggers.options, val: text.triggers.options },
    { label: text.triggers.stack, val: text.triggers.stack },
  ];

  return (
    <>
       {/* FAB (Icon Outside) */}
       {!externalState.isOpen && (
           <div className="fixed bottom-8 right-6 z-40 animate-reveal">
                <button 
                    onClick={() => onClose()} 
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,161,0.3)] bg-spring-neon text-black group border border-spring-neon/50 transition-transform hover:scale-110"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
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

            <div className="relative w-full max-w-[480px] h-[85vh] max-h-[750px] bg-onyx rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-white/10 animate-scale-up">
                
                {/* Header (With Image Inside) */}
                <div className="px-5 py-4 bg-[#09090B] border-b border-white/5 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-[0_0_15px_rgba(0,255,161,0.3)] border border-spring-neon/50">
                            {/* Lux Image */}
                            <img src={LUX_IMAGE} alt="Lux" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-spring-neon rounded-full border border-black animate-pulse"></div>
                        </div>
                        <div>
                            <h3 className="text-white text-base font-medium tracking-tight flex items-center gap-2">
                                Lux {userName ? `· ${userName}` : ''}
                            </h3>
                            <p className="text-[10px] text-spring-neon/80 font-mono tracking-wider flex items-center gap-1">
                                {text.powered}
                                {contextLoaded && <span className="w-1 h-1 rounded-full bg-spring-neon"></span>}
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
                <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-onyx scroll-smooth">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            
                            {msg.role === 'model' && (
                                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mr-2 mt-2 opacity-50 border border-white/10">
                                    <img src={LUX_IMAGE} alt="Lux" className="w-full h-full object-cover grayscale" />
                                </div>
                            )}

                            <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-spring-neon text-black rounded-br-none font-medium' 
                                : 'bg-[#1F1F1F] text-zinc-200 rounded-bl-none border border-white/5 font-light'
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
                    
                    {/* TICKET UI RENDER */}
                    {stage === 'ticket_ready' && reservationData.ticketId && (
                         <div className="animate-reveal mx-auto max-w-[90%] bg-zinc-900 border border-spring-neon/30 rounded-xl p-0 overflow-hidden shadow-[0_0_30px_rgba(0,255,161,0.1)] mb-4 mt-4">
                             <div className="bg-spring-neon p-3 flex justify-between items-center">
                                 <span className="text-black font-bold font-mono text-xs tracking-widest">MULTIVERSA ACCESS</span>
                                 <span className="text-black font-bold text-xs">#{reservationData.ticketId}</span>
                             </div>
                             <div className="p-5 space-y-3 relative">
                                 {/* Background Pattern */}
                                 <div className="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),repeating-linear-gradient(45deg,#000_25%,#000_0,#000_75%,#000_0)]" style={{ backgroundSize: '20px 20px' }}></div>
                                 
                                 <div className="relative z-10">
                                     <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Plan</p>
                                     <p className="text-white font-medium text-lg">{reservationData.plan}</p>
                                 </div>
                                 <div className="relative z-10">
                                     <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Visionario</p>
                                     <p className="text-white font-medium">{userName || 'Guest'}</p>
                                 </div>
                                 <div className="relative z-10 flex justify-between">
                                     <div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Ubicación</p>
                                        <p className="text-zinc-300 text-sm">{reservationData.location}</p>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Status</p>
                                        <span className="text-spring-neon text-xs font-mono border border-spring-neon/30 px-2 py-0.5 rounded bg-spring-neon/10 animate-pulse">PRE-BOOKED</span>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="p-4 bg-[#050505] border-t border-white/5 text-center">
                                 <p className="text-zinc-500 text-xs mb-3">Lux ha pre-aprobado tu ingreso.</p>
                                 <a 
                                    href={generateWhatsAppLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                                 >
                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                     Validar con Mou (Tech Lead)
                                 </a>
                             </div>
                         </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="w-6 h-6 mr-2"></div>
                            <div className="bg-[#1F1F1F] px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-[#09090B] border-t border-white/5 shrink-0 flex flex-col">
                    {stage !== 'ticket_ready' && (
                        <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar pb-0">
                            {triggers.map((t, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleSend(t.val)}
                                    disabled={isLoading}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#18181B] border border-white/5 text-[10px] text-zinc-300 hover:border-spring-neon hover:text-spring-neon transition-colors"
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="p-3">
                        <div className={`relative flex items-center gap-2 bg-[#121214] p-2 rounded-full border border-zinc-800 focus-within:border-spring-neon/50 transition-colors shadow-inner ${stage === 'ticket_ready' ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input 
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={stage === 'ticket_ready' ? "Chat finalizado. Confirma arriba ☝️" : text.inputPlaceholder}
                                className="flex-1 bg-transparent border-none text-white text-sm px-4 py-2 focus:ring-0 outline-none placeholder-zinc-600 font-light"
                                disabled={stage === 'ticket_ready'}
                            />
                            <button 
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim() || stage === 'ticket_ready'}
                                className="p-3 bg-spring-neon text-black rounded-full hover:bg-spring-dim transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-spring-neon/10"
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
