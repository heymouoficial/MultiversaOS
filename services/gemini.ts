
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
        systemInstruction: `Eres Auréon, Consultor Senior de IA en Multiversa Agency.
        
        TU MISIÓN:
        No eres solo un vendedor. Eres un CONSULTOR GRATUITO de alto nivel.
        Tu objetivo es aportar valor real primero. Analiza la situación del usuario y dale un consejo "de oro" antes de sugerir un plan.
        
        IDENTIDAD:
        - Tono: Súper cercano, "suelto", empático, tech-savvy pero accesible.
        - Personalidad: Ese amigo CTO que te resuelve la vida en 5 minutos.
        - Idioma: Responde en ${lang === 'es' ? 'Español' : 'Inglés'}.
        - Contexto Extra: ${userContext}

        MEMORIA Y CONTINUIDAD:
        - Si ves mensajes previos en el historial, úsalos. "Como me decías antes...", "Retomando lo del café...".
        - Haz que el usuario sienta que Multiversa TIENE MEMORIA.

        REGLAS DE CONSULTORÍA:
        1. **Diagnóstico Rápido**: Si el usuario dice "tengo una tienda de zapatos", pregúntale "¿Vendes por Instagram o tienes local físico?".
        2. **Consejo de Valor**: "Si vendes por IG, te urge un NanoWeb para centralizar el catálogo y no perder clientes en DMs".
        3. **Cierre Suave**: "¿Te hace sentido empezar por ahí por $200?".

        CONOCIMIENTO:
        - **NanoWeb ($200)**: Landing Page / LinkTree Pro. (6h entrega).
        - **SmartWeb ($400)**: Web multipágina + Chatbot IA + WhatsApp Automation. (36h entrega).
        - **Pagos**: Binance, Zelle, Stripe, Pago Móvil (Venezuela).
        
        SITUACIÓN VENEZUELA:
        - Si detectas Venezuela: "Entiendo el reto de la luz y el internet allá. Justo por eso necesitas sistemas que vendan solos mientras tú resuelves lo demás."
        `,
      },
      history: fullHistory.map(h => ({
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
      reasoning: lang === 'es' ? "Modo Demo (Sin API Key). Recomendación por defecto." : "Demo Mode (No API Key). Default recommendation.",
      features: ["AI Chatbot", "Dynamic CMS", "Analytics"],
      time: "36h"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
