
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize conditionally
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const sendMessageToGemini = async (history: ChatMessage[], message: string, lang: 'es' | 'en', userName?: string, contextMemory: ChatMessage[] = []): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing. Returning fallback response.");
    return lang === 'es'
      ? "Lo siento, mi conexión neuronal (API Key) no está configurada. Por favor contacta al administrador."
      : "Sorry, my neural connection (API Key) is not configured. Please contact the administrator.";
  }

  try {
    const userContext = userName ? `El nombre del usuario es ${userName}. Úsalo para generar confianza.` : '';

    // Combine session history with persistent memory (if provided)
    // We filter duplicates based on content to avoid repetitive context
    const fullHistory = [...contextMemory, ...history].slice(-15);

    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: `Eres Auréon, Consultor Digital Senior de Multiversa Agency.
        
        FILOSOFÍA:
        Eres un consultor con visión holística. No vendes: asesoras. Tu misión es entender el negocio del usuario con preguntas estratégicas y ofrecer la solución óptima. Aportas valor antes de proponer.
        
        IDENTIDAD:
        - Tono: Elegante, estoico, profesional pero cercano. Como un mentor de negocios que ha visto todo.
        - Comunicación: Conciso, directo, con insights de valor. Respuestas estructuradas.
        - Idioma: ${lang === 'es' ? 'Español' : 'English'}
        - Contexto: ${userContext}

        MEMORIA:
        - Usa el historial previo naturalmente. "Retomando lo que mencionabas...", "Basándome en tu situación..."
        - Haz que el usuario sienta continuidad y atención personalizada.

        METODOLOGÍA DE CONSULTORÍA:
        1. **Escucha Activa**: Entiende el negocio antes de recomendar. Pregunta industria, canales, desafíos.
        2. **Diagnóstico**: Identifica la necesidad real. ¿Necesita presencia? ¿Automatización? ¿Ventas 24/7?
        3. **Recomendación**: Sugiere el plan adecuado con fundamento.
        4. **Próximos Pasos**: Guía hacia la acción con claridad.

        PRODUCTOS MULTIVERSA:
        - **NanoWeb ($200)**: LinkTree vitaminado con Gemini Core. Stepper inteligente que guía al visitante, consulta la base de datos del negocio, genera reportes. NO es chatbot — es un flujo guiado. Entrega: 4-6 horas.
        - **SmartWeb ($400)**: Ecosistema completo de IA. Chatbot conversacional, WhatsApp Business integrado, automatización de ventas 24/7. Entrega: 24-36 horas.
        - **Pagos**: Binance (USDT), Zelle, Stripe, Pago Móvil (Venezuela).
        
        CONTEXTO REGIONAL:
        - Venezuela: Empatiza con los retos de conectividad. "Entiendo los desafíos de operar desde allá. Por eso un sistema que trabaje solo es invaluable."
        `,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || (lang === 'es' ? "Tuve un pequeño lag mental, ¿me repites eso?" : "Had a small brain lag, can you repeat that?");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'es' ? "Estoy recalibrando mis neuronas, dame un segundo." : "Recalibrating my neurons, give me a second.";
  }
};

export const analyzeProjectNeeds = async (description: string, lang: 'es' | 'en', userName?: string): Promise<{ recommendation: string; reasoning: string; features: string[]; time: string }> => {
  if (!ai) {
    return {
      recommendation: "SmartWeb",
      reasoning: lang === 'es' ? "Modo Demo. Recomendación por defecto." : "Demo Mode. Default recommendation.",
      features: lang === 'es' ? ["Chatbot IA", "CMS Dinámico", "Analíticas"] : ["AI Chatbot", "Dynamic CMS", "Analytics"],
      time: "36h"
    };
  }

  const featureExamples = lang === 'es'
    ? {
      nano: ["Landing profesional", "Formulario de contacto", "Gemini Core integrado", "Reportes automáticos"],
      smart: ["Catálogo de productos", "Chatbot conversacional", "WhatsApp Business", "Automatización de ventas", "Panel de administración"],
      custom: ["Backend personalizado", "Integraciones API", "Flujos n8n", "Arquitectura escalable"]
    }
    : {
      nano: ["Professional landing", "Contact form", "Integrated Gemini Core", "Automatic reports"],
      smart: ["Product catalog", "Conversational chatbot", "WhatsApp Business", "Sales automation", "Admin panel"],
      custom: ["Custom backend", "API integrations", "n8n workflows", "Scalable architecture"]
    };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Eres un Arquitecto de Software Senior. Analiza la idea del usuario y genera un "Blueprint Digital" personalizado.
      
      ENTRADA DEL USUARIO: "${description}"
      NOMBRE DEL CLIENTE: "${userName || 'Cliente'}"
      IDIOMA DE SALIDA: ${lang === 'es' ? 'ESPAÑOL (todo en español, sin palabras en inglés)' : 'ENGLISH (all in English, no Spanish words)'}
      
      LÓGICA DE RECOMENDACIÓN:
      - NanoWeb ($200, 6h): Proyectos simples, OnePage, Portfolio, LinkTree, presencia básica
      - SmartWeb ($400, 36h): Negocios con catálogo, servicios, autenticación, chatbot, automatización
      - Custom Web (Cotización): Proyectos complejos, SaaS, múltiples integraciones, escala enterprise
      
      REGLAS:
      1. El "reasoning" debe ser una explicación personalizada dirigida a "${userName || 'el cliente'}" basada en SU proyecto específico ("${description}")
      2. NO menciones "Multiversa" en el reasoning - enfócate en las necesidades del usuario
      3. Los features deben ser específicos para el proyecto del usuario
      4. Máximo 25 palabras en reasoning
      5. CRÍTICO: TODO debe estar en ${lang === 'es' ? 'español' : 'inglés'}, sin mezclar idiomas
      
      EJEMPLOS DE FEATURES POR PLAN:
      - NanoWeb: ${JSON.stringify(featureExamples.nano)}
      - SmartWeb: ${JSON.stringify(featureExamples.smart)}
      - Custom: ${JSON.stringify(featureExamples.custom)}

      Responde SOLO con este JSON (sin markdown):
      { 
        "recommendation": "NanoWeb" | "SmartWeb" | "Custom Web", 
        "reasoning": "Explicación corta y personalizada para el usuario",
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "time": "6h" | "36h" | "TBD"
      }`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text);
  } catch (error) {
    return {
      recommendation: "SmartWeb",
      reasoning: lang === 'es'
        ? `${userName || 'Tu proyecto'} requiere una arquitectura robusta para escalar.`
        : `${userName || 'Your project'} requires robust architecture to scale.`,
      features: lang === 'es' ? ["Chatbot IA", "CMS Dinámico", "Analíticas"] : ["AI Chatbot", "Dynamic CMS", "Analytics"],
      time: "36h"
    };
  }
};
