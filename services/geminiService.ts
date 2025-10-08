
import { GoogleGenAI, Type } from "@google/genai";

// Note: Direct access to process.env is not available in the browser.
// The API key is assumed to be configured in the execution environment.
// This function will fall back to mocks if the key isn't found.
const getApiKey = (): string | undefined => {
    try {
        // Check if process and process.env exist before accessing
        if (typeof process !== 'undefined' && process.env) {
            return process.env.API_KEY;
        }
        return undefined;
    } catch (e) {
        // This will happen in a pure browser environment without a build process.
        console.warn("API key cannot be accessed:", e);
        return undefined;
    }
};

const mockIdeas = (theme: string) => {
    return new Promise<string[]>(resolve => setTimeout(() => resolve([
        `Eco-friendly ${theme} Tracker`,
        `Gamified ${theme} Learning App`,
        `AI-powered Assistant for ${theme}`
    ]), 1000));
};

export const generateProjectIdeas = async (theme: string): Promise<string[]> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("API_KEY is not set or accessible. AI features will use mock data.");
    return mockIdeas(theme);
  }
  
  // Initialize the AI client here, only when the function is called and the key is available.
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate 3 innovative and exciting hackathon project ideas based on the theme: "${theme}". For each idea, provide a short, catchy name.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    ideas: {
                        type: Type.ARRAY,
                        description: "A list of 3 hackathon project idea names.",
                        items: {
                            type: Type.STRING
                        }
                    }
                }
            }
        }
    });

    const jsonResponse = JSON.parse(response.text);
    return jsonResponse.ideas || [];
  } catch (error) {
    console.error("Error generating project ideas:", error);
    // Fallback to simpler generation or mock data on error
    return [
      `Cool Project about ${theme}`,
      `Another idea for ${theme}`,
      `A third concept for ${theme}`,
    ];
  }
};