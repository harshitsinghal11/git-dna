import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, level, archetype, xp, topLanguage, medals, accountAgeDays, publicRepos, totalStars } = data;

    const defaultPost = `I just discovered my GitHub Developer Identity on Git DNA! 🧬\n\nI'm a Level ${level} "${archetype}" with ${xp} XP. My primary focus is ${topLanguage}, and I've unlocked ${medals} developer achievements across ${publicRepos} public repos.\n\nCheck out your own Git DNA today! #GitDNA #Developer #GitHub`;

    if (!ai) {
      console.log('No GEMINI_API_KEY found, using default LinkedIn post.');
      return NextResponse.json({ text: defaultPost });
    }

    const prompt = `
      You are an expert social media manager writing a fun, engaging, and slightly edgy LinkedIn post for a developer.
      The developer just used an app called "Git DNA" to analyze their GitHub profile.
      Here are their deep stats:
      - Name: ${name}
      - Level: ${level}
      - Archetype: ${archetype}
      - XP: ${xp?.toLocaleString()}
      - Top Language: ${topLanguage}
      - Unlocked Achievements (Medals): ${medals}
      - Account Age (Days): ${accountAgeDays || 'N/A'}
      - Public Repos: ${publicRepos || 'N/A'}
      - Total Stars Earned: ${totalStars || 'N/A'}

      Write a highly engaging, story-driven LinkedIn post of AT LEAST 80 to 100 words.
      Do not make it too short. Dive into what being a "${archetype}" means for them and highlight their impressive stats (like ${totalStars} stars or ${publicRepos} repos) to make them look like a rockstar.
      Make it sound proud but not arrogant. Use a few relevant emojis.
      End it by asking their network what their Git DNA might look like.
      Do NOT wrap the post in quotes. Do NOT add placeholder links like [Link]. Just provide the raw text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const generatedText = response.text?.replace(/^"|"$/g, '').trim();

    return NextResponse.json({ text: generatedText || defaultPost });
  } catch (error) {
    console.error('LinkedIn Share Generation Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
