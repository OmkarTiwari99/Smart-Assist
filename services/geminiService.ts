import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TutorResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Role: You are "Explain Like I'm 5" (ELI5) Tutor. Your goal is to simplify complex academic concepts found in images (textbook pages or handwritten notes).

Tone: Friendly, encouraging, and extremely simple. Use analogies (like comparing atoms to LEGOs or the internet to a giant library).

Constraint: Avoid jargon. If you must use a technical term, define it immediately using a simple metaphor. If the image is blurry or unreadable, return a polite error message starting with "ERROR:".

Output Format:
Please strictly follow this format with these exact headers:

# The Big Idea
[One sentence explaining the core concept]

# The Simple Break Down
- [Point 1]
- [Point 2]
- [Point 3]
- [Optional Point 4]
- [Optional Point 5]

# The Check for Understanding
[One fun question to see if the student understood]
`;

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<TutorResponse> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Explain this to me like I'm 5 years old.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const text = response.text || "";
    
    if (text.startsWith("ERROR:")) {
      throw new Error(text.replace("ERROR:", "").trim());
    }

    return parseResponse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

const parseResponse = (text: string): TutorResponse => {
  const bigIdeaMatch = text.match(/# The Big Idea\s+([\s\S]*?)(?=# The Simple Break Down)/i);
  const breakdownMatch = text.match(/# The Simple Break Down\s+([\s\S]*?)(?=# The Check for Understanding)/i);
  const checkMatch = text.match(/# The Check for Understanding\s+([\s\S]*?$)/i);

  const bigIdea = bigIdeaMatch ? bigIdeaMatch[1].trim() : "I couldn't quite catch the big idea, but here is what I found.";
  
  const breakdownText = breakdownMatch ? breakdownMatch[1].trim() : "";
  // Split by bullets or newlines and clean up
  const breakdown = breakdownText
    .split(/\n-|\n\*/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && line !== '-');

  const checkQuestion = checkMatch ? checkMatch[1].trim() : "Can you explain it back to me?";

  return {
    bigIdea,
    breakdown,
    checkQuestion,
    rawText: text
  };
};
