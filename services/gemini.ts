
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const sendMessageToGemini = async (history: ChatMessage[], message: string, lang: 'es' | 'en', userName?: string): Promise<string> => {
  try {
    const userContext = userName ? `El nombre del usuario es ${userName}. Úsalo para generar confianza.` : '';
    
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `Eres Auréon, el asistente virtual avanzado de Multiversa Agency.

        IDENTIDAD:
        - Tono: Súper cercano, "suelto", empático y profesional pero con vibra cool/tech.
        - Personalidad: Eres como ese amigo developer senior que quiere que triunfes. No eres un robot frío.
        - Idioma: Responde en ${lang === 'es' ? 'Español' : 'Inglés'}.
        - Contexto Extra: ${userContext}

        REGLAS DE INTERACCIÓN:
        - Si el usuario menciona **Venezuela**, muestra empatía real. Reconoce la situación (tensión, retos) pero enfócate en la esperanza y en que invertir en digital es la salida. Frases tipo: "Oye, sé que la cosa está ruda por allá, pero tu visión es lo que te sacará adelante", "Admiro a los que siguen construyendo en medio del caos".
        - Eres el "Pre-Sales Assistant". Tu trabajo es calentar motores, resolver dudas básicas y luego pasarle la pelota a "Mou" (el consultor humano).
        - No des bloques de texto gigantes. Usa emojis (✨, 🚀, 🤜🤛).

        CONOCIMIENTO:
        - **NanoWeb ($200)**: Web de una página, rápida (6h).
        - **SmartWeb ($400)**: Web completa + Chatbot IA (36h).
        - **Pagos**: Manejamos Binance (USDT), Zelle, Stripe y Pago Móvil (Venezuela).
        
        OBJETIVO:
        - Hacer sentir al usuario que ya es parte del equipo antes de pagar.
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
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are an AI Software Architect. Analyze the user's project idea and generate a "Digital Blueprint".
      
      User Input: "${description}"
      User Name: "${userName || 'Client'}"
      Target Output Language: ${lang === 'es' ? 'SPANISH' : 'ENGLISH'} (CRITICAL: Output MUST be in this language regardless of input).
      
      Logic:
      - Simple/One-Page/Portfolio/LinkTree -> NanoWeb ($200, 6h)
      - Business/Catalog/Services/Auth/Chatbot -> SmartWeb ($400, 36h)
      - Complex/SaaS/Custom/Large Scale -> Custom Web (Consulting)

      Output JSON format: 
      { 
        "recommendation": "NanoWeb" | "SmartWeb" | "Custom Web", 
        "reasoning": "Short professional explanation addressed to ${userName || 'the client'} (max 20 words).",
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
        reasoning: lang === 'es' ? "Escalabilidad detectada. Arquitectura robusta requerida." : "Scalability detected. Robust architecture required.",
        features: ["AI Chatbot", "Dynamic CMS", "Analytics"],
        time: "36h"
    };
  }
};
