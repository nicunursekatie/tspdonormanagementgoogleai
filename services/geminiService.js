import { GoogleGenerativeAI } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION } from '../constants.js';

// Lazy initialization - uses window.GEMINI_API_KEY for browser-native setup
let aiInstance = null;
let model = null;

const getModel = () => {
    if (!model) {
        const apiKey = window.GEMINI_API_KEY || '';
        if (!apiKey) {
            console.warn('GEMINI_API_KEY not set. Set window.GEMINI_API_KEY before using AI features.');
        }
        aiInstance = new GoogleGenerativeAI(apiKey);
        model = aiInstance.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
        });
    }
    return model;
};

export const generateDonorCommunication = async (
    donorName,
    donationAmount,
    totalGiving,
    historySummary,
    context
) => {
    try {
        const genModel = getModel();
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

        const result = await genModel.generateContent(prompt);
        const response = await result.response;
        return response.text() || "Unable to generate content at this time.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating communication. Please check your API key.";
    }
};

export const generateStrategicInsight = async (metrics) => {
    try {
        const genModel = getModel();
        const prompt = `
        Analyze the following donor metrics for The Sandwich Project and provide 3 brief, actionable fundraising strategies.

        Current Metrics:
        ${metrics}

        Focus on retention, converting one-time donors to recurring, and grant reporting readiness.
        `;

        const result = await genModel.generateContent(prompt);
        const response = await result.response;
        return response.text() || "No insights available.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating insights.";
    }
};
