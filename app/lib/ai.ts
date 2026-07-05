import { GoogleGenAI } from '@google/genai';

// Initialize the SDK only if the key exists to prevent crashing
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export async function generateClassDescription(developerClass: string, topLanguage: string): Promise<string> {
  const fallbackMap: Record<string, string> = {
    'The Seasoned Architect': 'You build foundations that stand the test of time.',
    'The Infinite Hacker': 'You push boundaries just to see what breaks.',
    'The Deep Systems Master': 'You have mastered your craft to the absolute core.',
    'The Open Source Celebrity': 'Your code echoes across the developer ecosystem.',
    'The Elite Engineer': 'You ship robust, high-quality code at an exceptional pace.',
    'The Generalist': 'You effortlessly adapt to any paradigm or language thrown your way.',
    'The Rising Developer': 'You are rapidly forging your own unique path in code.',
    'The Ghost': 'Your code remains completely hidden in the shadows.'
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
