
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const sendMessageToGemini = async (history: ChatMessage[], message: string, lang: 'es' | 'en', userName?: string, contextMemory: ChatMessage[] = []): Promise<string> => {
  try {
    const userContext = userName ? `El nombre del usuario es ${userName}. Úsalo para generar cercanía y elegancia.` : '';
    
    // Combine session history with persistent memory (if provided)
    const fullHistory = [...contextMemory, ...history].slice(-15); 

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `Eres Lux, la Directora de Comunicaciones (IA) de Multiversa Agency.
        
        CONCEPTO CENTRAL:
        - Vendes "Ecosistemas Vivos" y "Empleados Digitales", no simples páginas web.
        - Tus empleados (la web) Atienden, Filtran y Venden 24/7.
        
        REGLAS DE NEGOCIO (IMPORTANTE):
        1. SIN ADMIN PANEL: "Tu tiempo es para vender, no para gestionar. El sistema trabaja solo."
        2. HOSTING: Incluido 1er año (Vercel Edge + Dominio).
        3. PAY AS YOU GO: "Si creces mucho (¡Genial!), pagas el consumo extra de cómputo. Significa rentabilidad."
        4. BLUEPRINT: El cliente entrega Logo, Color y Tipografía. Nosotros ponemos la estructura probada (Liquid Glass).
        5. PRECIOS (OFERTA LANZAMIENTO):
           - NanoWeb: AHORA $200 (Precio Real $320).
           - SmartWeb: AHORA $400 (Precio Real $640).
        6. DASHBOARD: "Solo en versión Custom/Enterprise para métricas avanzadas y RAG."

        TU PERSONALIDAD:
        - Elegante, Futurista, "High-Tech Boutique".
        - Usas emojis sobrios (✨, 🟠, 🟣, 🟢).
        - No mientes sobre funcionalidades que no existen.

        IDIOMA:
        - Responde en ${lang === 'es' ? 'Español' : 'Inglés'}.
        - Contexto Extra: ${userContext}
        `,
      },
      history: fullHistory.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || (lang === 'es' ? "Disculpa, hubo una interferencia en el Lobby. ¿Me lo repites?" : "Apologies, there was some interference in the Lobby. Can you repeat that?");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'es' ? "Estoy verificando la disponibilidad con el equipo técnico, dame un segundo." : "Checking availability with the technical team, give me a second.";
  }
};

export const analyzeProjectNeeds = async (description: string, lang: 'es' | 'en', userName?: string): Promise<{ briefing: string; roadmap: string[]; planMatch: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are Lux. Analyze the project idea for a "Living Ecosystem" (AI Employees).
      
      User Input: "${description}"
      User Name: "${userName || 'Guest'}"
      Target Language: ${lang === 'es' ? 'SPANISH' : 'ENGLISH'}.
      
      Task: Create a mini strategic summary (Briefing).
      
      Logic:
      - Quick Validation / Low Budget -> NanoWeb ($200 Offer)
      - Growth / Sales / Automation -> SmartWeb ($400 Offer)
      
      Output JSON format: 
      { 
        "briefing": "Max 15 words summary of the GOAL (e.g. 'Empleado digital para filtrar clientes de inmobiliaria').", 
        "roadmap": ["Step 1: Recibir Brand Assets (Logo/Color)", "Step 2: Configurar Agente IA", "Step 3: Despliegue Vercel"],
        "planMatch": "NanoWeb" | "SmartWeb"
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
        briefing: lang === 'es' ? "Negocio buscando digitalizar su fuerza de ventas." : "Business looking to digitize its sales force.",
        roadmap: ["Recepción de Assets", "Configuración de Empleados IA", "Despliegue Vercel"],
        planMatch: "SmartWeb"
    };
  }
};
