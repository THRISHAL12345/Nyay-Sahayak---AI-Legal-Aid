const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export async function translateAnalysis(analysisJSON, targetLanguage, targetLanguageName) {
  if (['hi', 'en'].includes(targetLanguage)) return analysisJSON;

  const stringified = JSON.stringify(analysisJSON, null, 2);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate ALL text values in the provided JSON from Hindi/English into ${targetLanguageName}. 
          
Rules:
- Keep ALL JSON keys exactly the same (do not translate keys)
- Translate ONLY the string values
- Keep numbers, booleans, and null values unchanged
- Keep legal act names in English (e.g., "Transfer of Property Act 1882")
- Keep section references in English (e.g., "Section 106")
- Keep paragraph references unchanged (e.g., "P2.3")
- Output ONLY valid JSON, nothing else`
        },
        { role: 'user', content: stringified }
      ],
      temperature: 0.1,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
