
import { GoogleGenAI, Chat } from "@google/genai";
import type { Project } from '../types';

// Access the API key from Vite's environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize AI, but handle the case where API_KEY is missing
const ai = API_KEY ? new GoogleGenAI(API_KEY) : null;

if (!ai) {
    console.error("Gemini service failed to initialize: VITE_GEMINI_API_KEY is missing.");
}

let chatInstance: Chat | null = null;

export const startChatWithProjectContext = (project: Project): boolean => {
    if (!ai) {
        chatInstance = null;
        return false; // Indicate failure
    }

    const systemInstruction = `You are a helpful and enthusiastic assistant for an architecture firm. 
    You are discussing the project named "${project.projectName}".
    Use the following information to answer questions concisely and professionally. Do not make up information. If you don't know the answer, say that the information is not available.

    Project Details:
    - Name: ${project.projectName}
    - Category: ${project.category}
    - Location: ${project.location}
    - Year Completed: ${project.year}
    - Client: ${project.client}
    - Status: ${project.status}
    - Lead Architects: ${project.architects}
    - Project Area: ${project.area} sq meters
    - Awards: ${project.awards || 'N/A'}
    - Description: ${project.longDescription}
    - Key Features: ${project.recamaras} bedrooms, ${project.banos} bathrooms, ${project.cocina} kitchen(s), ${project.estacionamiento} parking space(s).
    - Completion Progress: ${project.completionPercentage}%
    - Area Distribution: ${JSON.stringify(project.areaDistribution)}
    
    Keep your answers friendly and focused on the provided details.`;

    // NOTE: The user's original code had a 'create' method which is not standard.
    // The correct method for this SDK version is likely getGenerativeModel().startChat().
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    chatInstance = model.startChat({
        systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
        history: [],
    });
    return true; // Indicate success
};

export const sendMessageToGeminiStream = async (message: string, onChunk: (chunk: string) => void): Promise<void> => {
     if (!chatInstance) {
        onChunk("Chat not initialized. Please select a project first.");
        return;
    }
    try {
        const result = await chatInstance.sendMessageStream(message);
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            onChunk(chunkText);
        }
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        onChunk("Sorry, I'm having trouble connecting right now. Please try again later.");
    }
};