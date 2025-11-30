import { GoogleGenAI } from "@google/genai";
import { QuadraticParams } from "../types";

export const getGeminiExplanation = async (params: QuadraticParams): Promise<string> => {
  try {
    // Initialize GoogleGenAI with the API key from process.env directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      Actúa como un profesor de matemáticas experto y paciente.
      Explica paso a paso cómo resolver la siguiente ecuación de segundo grado en Español.

      Reglas:
      1. Identifica primero el tipo de ecuación (Completa, Incompleta falta b, Incompleta falta c).
      2. Si es incompleta, explica el método rápido (factor común o despeje).
      3. Si es completa, usa la fórmula general: x = (-b ± √(b² - 4ac)) / 2a.
      4. Calcula el discriminante y explica qué significa su signo (2 soluciones, 1 doble, o ninguna real).
      5. Muestra los pasos de cálculo claramente.
      6. Concluye con las soluciones.
      7. Usa formato Markdown limpio.
      
      Sé conciso pero didáctico, como los ejemplos de un libro de texto.
    `;

    const prompt = `Ecuación: ${params.a}x² + ${params.b}x + ${params.c} = 0`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using gemini-3-pro-preview for math tasks as recommended
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "No se pudo generar la explicación.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Hubo un error al contactar al tutor virtual. Por favor verifica tu conexión o intenta más tarde.";
  }
};