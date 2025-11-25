import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAnnouncement = async (topic: string, tone: string): Promise<string> => {
  try {
    const prompt = `Escreva um comunicado escolar curto e profissional sobre: "${topic}". Tom: ${tone}. Formate em texto corrido, sem markdown complexo.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar o comunicado.";
  } catch (error) {
    console.error("Erro ao gerar comunicado:", error);
    return "Erro ao conectar com a IA. Tente novamente.";
  }
};

export const summarizePerformance = async (grades: any[]): Promise<string> => {
    try {
        const prompt = `Analise estas notas de um aluno e dê um feedback curto e motivacional de 2 frases: ${JSON.stringify(grades)}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Sem análise disponível.";
    } catch (error) {
        return "Não foi possível analisar o desempenho.";
    }
}
