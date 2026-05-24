import { buildSystemPrompt, buildUserPrompt } from './prompts';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export async function analyzeDocument({ numberedText, documentType, targetLanguage }) {
  const systemPrompt = buildSystemPrompt(documentType, targetLanguage);
  const userPrompt = buildUserPrompt(numberedText);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0].message.content;

  try {
    return JSON.parse(rawContent);
  } catch (e) {
    const cleaned = rawContent.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  }
}
