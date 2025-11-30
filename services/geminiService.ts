import { GoogleGenAI } from "@google/genai";
import { QuadraticParams } from "../types";

export const getGeminiExplanation = async (params: QuadraticParams): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Actúa como un profesor de matemáticas experto y paciente.
      Explica paso a paso cómo resolver la siguiente ecuación de segundo grado en Español:
      
      Ecuación: ${params.a}x² + ${params.b}x + ${params.c} = 0

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No se pudo generar la explicación.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Hubo un error al contactar al tutor virtual. Por favor verifica tu conexión o intenta más tarde.";
  }
};