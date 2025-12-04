
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
}

type ChatStage = 'idle' | 'captured_plan' | 'awaiting_payment_choice' | 'showing_payment_data' | 'ticket_ready';

const ChatBot: React.FC<ChatBotProps> = ({ lang, text, externalState, onClose, userName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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

  // --- INITIALIZATION & TRIGGERS ---
  useEffect(() => {
    if (externalState.isOpen) {
        scrollToBottom();
        setTimeout(() => inputRef.current?.focus(), 150);

        if (externalState.intent) {
            setReservationData(prev => ({ ...prev, plan: externalState.intent }));
            setStage('captured_plan');
            
            const nameGreet = userName ? `, ${userName}` : '';
            const introMsg = lang === 'es' 
                ? `¡Esa es la actitud${nameGreet}! 🚀 **${externalState.intent}** es una inversión brutal.\n\nPara armarte la propuesta a medida, cuéntame: ¿Desde qué ciudad o país nos escribes?`
                : `That's the spirit${nameGreet}! 🚀 **${externalState.intent}** is a killer investment.\n\nTo tailor this for you, tell me: Which city or country are you writing from?`;
            
            setMessages(prev => [...prev, { role: 'model', content: introMsg }]);
        }
    }
  }, [externalState.isOpen, externalState.intent, lang, userName]);

  useEffect(() => {
    if (messages.length === 0) {
        const nameGreet = userName ? `, ${userName}` : '';
        const greeting = lang === 'es' 
            ? `¡Qué tal${nameGreet}! Soy Auréon ✨. Tu copiloto en Multiversa. ¿En qué idea andas trabajando hoy?` 
            : `What's up${nameGreet}! I'm Auréon ✨. Your co-pilot at Multiversa. What idea are you working on today?`;
        setMessages([{ role: 'model', content: greeting }]);
    }
  }, [lang, userName]);

  useEffect(() => {
    if (externalState.isOpen) scrollToBottom();
  }, [messages, externalState.isOpen]);

  // --- WHATSAPP GENERATOR ---
  const generateWhatsAppLink = () => {
      const { plan, location, paymentMethod, ticketId } = reservationData;
      const nameTxt = userName || 'Un Viajero';
      
      const msg = `Hola Mou 👋, soy ${nameTxt}.
      
Tengo el Ticket de Pre-Reserva: *#${ticketId}*
------------------------------
Plan: ${plan}
Ubicación: ${location}
Método Pago: ${paymentMethod}
------------------------------

Ya tengo los datos de pago. Quedo atento para confirmar y comenzar. 🚀`;

      const encoded = encodeURIComponent(msg);
      return `https://wa.me/14094193523?text=${encoded}`;
  };

  // --- LOGIC HANDLER ---
  const handleSend = async (manualText?: string) => {
    const textToSend = manualText || input;
    if (!textToSend.trim() || isLoading) return;

    // Add user message immediately
    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
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
                ? `Oye, he visto las noticias y sé que hay tensión y conmoción por allá... De verdad admiro que sigas apostando a construir en medio de todo. ✊ Tu inversión se va a multiplicar, ya verás que saldremos adelante.`
                : `Hey, I've seen the news and I know there's tension over there... I really admire that you keep building amidst it all. ✊ Your investment will multiply, we'll get through this.`;
            
            paymentOptions = lang === 'es'
                ? `Para tu comodidad, ¿prefieres usar **Binance (USDT)** o **Pago Móvil**?`
                : `For your convenience, do you prefer **Binance (USDT)** or **Pago Móvil**?`;
        } else {
            empathyMsg = lang === 'es'
                ? `¡Genial! ${textToSend} es un buen lugar para empezar a escalar digitalmente.`
                : `Awesome! ${textToSend} is a great place to start scaling digitally.`;
            
            paymentOptions = lang === 'es'
                ? `Generalmente operamos con **Binance (USDT)**, **Zelle** o **Stripe**. ¿Cuál te funciona mejor?`
                : `We usually operate with **Binance (USDT)**, **Zelle** or **Stripe**. Which works best for you?`;
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'model', content: `${empathyMsg}\n\n${paymentOptions}` }]);
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
            detailsMsg = `Perfecto, crypto es el futuro. ⚡\n\n**Binance Pay / Email:**\n\`Payments@multiversa.ai\`\n\n(Asegúrate de seleccionar la red correcta si envías por wallet, pero por Binance Pay es directo).`;
        } else if (choice.includes('movil') || choice.includes('banesco')) {
             detailsMsg = `Entendido, vamos con Bolívares. Aquí tienes los datos:\n\n**Pago Móvil Banesco (0134)**\n**Tel:** 0412-532.22.58\n**CI:** 16.619.748\n\nGuarda el comprobante.`;
        } else {
             detailsMsg = `Listo, anotado **${textToSend}**. Coordinaremos los detalles finales directamente con Mou.`;
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'model', content: detailsMsg }]);
            
            // Trigger Ticket Generation after a brief pause
            setTimeout(() => {
                 const ticketId = Math.floor(10000 + Math.random() * 90000).toString();
                 setReservationData(prev => ({ ...prev, ticketId }));
                 setStage('ticket_ready');
                 
                 setMessages(prev => [...prev, { 
                     role: 'model', 
                     content: lang === 'es' 
                        ? "Estoy generando tu Ticket de Pre-Reserva... Un momento 📠" 
                        : "Generating your Pre-Reservation Ticket... One moment 📠" 
                 }]);
                 setIsLoading(false);
            }, 1500);

        }, 800);
        return;
    }

    // --- STANDARD AI CHAT (Fallback) ---
    const history = messages;
    const delay = Math.random() * 800 + 600; 

    setTimeout(async () => {
        const responseText = await sendMessageToGemini(history, userMsg.content, lang, userName);
        setMessages(prev => [...prev, { role: 'model', content: responseText }]);
        setIsLoading(false);
    }, delay);
  };

  const triggers = [
    { label: text.triggers.what, val: text.triggers.what },
    { label: text.triggers.options, val: text.triggers.options },
    { label: text.triggers.stack, val: text.triggers.stack },
  ];

  return (
    <>
       {/* FAB */}
       {!externalState.isOpen && (
           <div className="fixed bottom-8 right-6 z-40 animate-reveal">
                <button 
                    onClick={() => onClose()} 
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(190,242,100,0.3)] bg-lime-neon text-black group border border-lime-neon/50 transition-transform hover:scale-110"
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

            <div className="relative w-full max-w-[480px] h-[85vh] max-h-[750px] bg-black rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-white/10 animate-scale-up">
                
                {/* Header */}
                <div className="px-5 py-4 bg-[#09090B] border-b border-white/5 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-lime-neon flex items-center justify-center shadow-lg shadow-lime-neon/20">
                            <span className="text-black font-bold font-serif text-xl">M</span>
                        </div>
                        <div>
                            <h3 className="text-white text-base font-medium tracking-tight flex items-center gap-2">
                                Auréon {userName ? `· ${userName}` : ''}
                                <span className="w-2 h-2 rounded-full bg-lime-neon animate-pulse"></span>
                            </h3>
                            <p className="text-[11px] text-zinc-500">{text.powered}</p>
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
                            <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
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
                    
                    {/* TICKET UI RENDER */}
                    {stage === 'ticket_ready' && reservationData.ticketId && (
                         <div className="animate-reveal mx-auto max-w-[90%] bg-zinc-900 border border-lime-neon/30 rounded-xl p-0 overflow-hidden shadow-[0_0_30px_rgba(212,255,112,0.1)] mb-4">
                             <div className="bg-lime-neon p-3 flex justify-between items-center">
                                 <span className="text-black font-bold font-mono text-xs tracking-widest">MULTIVERSA TICKET</span>
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
                                     <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Beneficiario</p>
                                     <p className="text-white font-medium">{userName || 'Guest'}</p>
                                 </div>
                                 <div className="relative z-10 flex justify-between">
                                     <div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Ubicación</p>
                                        <p className="text-zinc-300 text-sm">{reservationData.location}</p>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Status</p>
                                        <span className="text-lime-neon text-xs font-mono border border-lime-neon/30 px-2 py-0.5 rounded bg-lime-neon/10 animate-pulse">PRE-BOOKED</span>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="p-4 bg-[#050505] border-t border-white/5 text-center">
                                 <p className="text-zinc-500 text-xs mb-3">La intervención humana es requerida para finalizar.</p>
                                 <a 
                                    href={generateWhatsAppLink()}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full py-3 bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                                 >
                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                     Confirmar con Mou
                                 </a>
                             </div>
                         </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#121214] px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area (Disabled when ticket is ready to force WA flow) */}
                <div className="bg-[#09090B] border-t border-white/5 shrink-0 flex flex-col">
                    {stage !== 'ticket_ready' && (
                        <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar pb-0">
                            {triggers.map((t, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleSend(t.val)}
                                    disabled={isLoading}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#18181B] border border-white/5 text-[10px] text-zinc-300 hover:border-lime-neon hover:text-lime-neon transition-colors"
                                >
                                    {t.label}
                                </button>
                            ))}
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
