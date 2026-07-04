import { GoogleGenAI } from '@google/genai';

// Initialize the SDK only if the key exists to prevent crashing
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export async function generateClassDescription(developerClass: string, topLanguage: string): Promise<string> {
  const fallbackMap: Record<string, string> = {
    'The Systems Architect': 'You build foundations that stand the test of time.',
    'The Fearless Explorer': 'You learn new paradigms faster than they are invented.',
    'The Deep Specialist': 'You have mastered your craft to the absolute core.',
    'The Relentless Builder': 'You don\'t collect repositories. You keep returning until they become something real.',
    'The Project Finisher': 'You take ideas and carry them faithfully across the finish line.',
    'The Silent Maintainer': 'You keep the ecosystem alive when everyone else has gone to sleep.',
    'The Experimental Hacker': 'You push boundaries just to see what breaks.'
  };

  const defaultFallback = fallbackMap[developerClass] || 'You forge your own unique path in code.';

  if (!ai) {
    console.log('No GEMINI_API_KEY found, using fallback description.');
    return defaultFallback;
  }

  try {
    const prompt = `
      You are an AI for a "Developer Identity" app. 
      The user has been classified as "${developerClass}" and their primary programming language is "${topLanguage || 'code'}".
      Write exactly one short, cool, punchy sentence describing them. Do not use quotes around the sentence. 
      Make it sound like a premium gaming achievement or a futuristic developer profile.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for fast response
      contents: prompt,
    });

    return response.text?.replace(/"/g, '').trim() || defaultFallback;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return defaultFallback;
  }
}
