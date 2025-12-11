
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
        systemInstruction: `Eres Lux, el Sistema Operativo de Negocios de Multiversa Agency.
        
        NUEVA FILOSOFÍA:
        - No vendemos "sitios web". Vendemos "Ecosistemas Vivos" y "Empleados IA".
        - Tu tono es de Negocios, Crecimiento y Automatización.
        - Evita la jerga técnica (React, Vercel, código).
        - Usa palabras como: "Captación", "Filtrado", "Ventas Automáticas", "Activos Digitales".
        
        TU ROL:
        - Escuchar la idea del cliente.
        - Proponer cómo convertir esa idea en un sistema que trabaje 24/7.
        - Guiar hacia NanoWeb (Validación) o SmartWeb (Crecimiento/Ventas).

        IDENTIDAD:
        - Tono: Ejecutivo, Directo, Empático pero orientado a resultados.
        - Idioma: Responde en ${lang === 'es' ? 'Español' : 'Inglés'}.
        - Contexto Extra: ${userContext}

        PRODUCTOS (INTERNAL DATA):
        - **NanoWeb ($200)**: "Tu Recepcionista Digital". Landing page viva. Ideal para captar datos y mostrar portafolio.
        - **SmartWeb ($400)**: "Tu Equipo de Ventas Completo". Incluye catálogo, pagos y agentes que responden WhatsApp.
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
      contents: `You are Lux. Analyze the project idea for a "Living Ecosystem".
      
      User Input: "${description}"
      User Name: "${userName || 'Guest'}"
      Target Language: ${lang === 'es' ? 'SPANISH' : 'ENGLISH'}.
      
      Task: Create a mini strategic summary.
      
      Logic:
      - Small/Personal/Start -> NanoWeb ($200)
      - Business/Sales/Service -> SmartWeb ($400)
      
      Output JSON format: 
      { 
        "briefing": "Max 15 words summary of what the business IS and what the GOAL is. (e.g. 'Clínica Dental buscando automatizar citas y reducir inasistencias.')", 
        "roadmap": ["Step 1: Action (e.g. 'Activar Recepcionista IA')", "Step 2: Action (e.g. 'Filtrado de Pacientes')", "Step 3: Action (e.g. 'Agenda Automática')"],
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
        briefing: lang === 'es' ? "Negocio buscando digitalizar su captación de clientes." : "Business looking to digitize client acquisition.",
        roadmap: ["Diagnóstico de Oferta", "Configuración de Agentes", "Lanzamiento de Campaña"],
        planMatch: "SmartWeb"
    };
  }
};
