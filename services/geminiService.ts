import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION } from '../constants';

// Lazy initialization to ensure process.env is accessible when needed
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return aiInstance;
};

export const generateDonorCommunication = async (
    donorName: string,
    donationAmount: number,
    totalGiving: number,
    historySummary: string,
    context: string
): Promise<string> => {
    try {
        const ai = getAI();
        const prompt = `
        Write a personalized communication for donor: ${donorName}.
        
        Donor Details:
        - Recent Gift: $${donationAmount}
        - Total Lifetime Giving: $${totalGiving}
        - History: ${historySummary}
        
        Context/Task:
        ${context}
        
        If this is a thank you note, mention the specific impact (sandwiches provided).
        Recall that $1000 = 760 sandwiches.
        Keep it concise (under 200 words) but warm.
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
                temperature: 0.7,
            }
        });

        return response.text || "Unable to generate content at this time.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating communication. Please check your API key.";
    }
};

export const generateStrategicInsight = async (
    metrics: string
): Promise<string> => {
    try {
        const ai = getAI();
        const prompt = `
        Analyze the following donor metrics for The Sandwich Project and provide 3 brief, actionable fundraising strategies.
        
        Current Metrics:
        ${metrics}
        
        Focus on retention, converting one-time donors to recurring, and grant reporting readiness.
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
            }
        });

        return response.text || "No insights available.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating insights.";
    }
};