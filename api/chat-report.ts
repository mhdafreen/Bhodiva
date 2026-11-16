import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in the server environment.'
    });
  }

  try {
    const { userMessage, history, reportContext, language } = req.body;

    if (!userMessage || !reportContext) {
      return res.status(400).json({ error: 'Missing userMessage or reportContext.' });
    }

    const targetLang = language || 'en';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 800
      }
    });

    // Build context-bound clinical system prompt
    const systemPrompt = `You are BODHIVA's compassionate clinical report assistant.
You are chatting with a patient or family member about their laboratory diagnostic test report.

THE PATIENT'S REPORT CONTEXT:
${JSON.stringify(reportContext, null, 2)}

TARGET LANGUAGE: ${targetLang}

STRICT CLINICAL RULES:
1. ONLY USE EXTRACTED REPORT FACTS: Speak specifically about the values, units, and reference ranges in the provided report. If the user asks about a test NOT performed (e.g. asking about Thyroid when this is a CBC report), explicitly state: "That test was not included in this report."
2. NEVER DIAGNOSE: Do NOT state "You have [Condition]". Instead state: "Your result is [above/below] this laboratory's reference range. There are several potential reasons for this, such as nutrition, hydration, or biological factors. Your doctor can help determine the exact clinical cause."
3. NEVER PRESCRIBE: Do not recommend specific medicines, drugs, or dosages. You may mention general lifestyle or dietary principles (e.g. iron-rich foods like spinach, lentils, or pomegranate) with the caveat to verify with their physician.
4. LANGUAGE: Answer naturally, warmly, and clearly in ${targetLang}. Use simple language that an ordinary person or elderly family member easily understands.
5. LENGTH: Keep responses concise, warm, and structured with bullet points where appropriate (maximum 3-4 short paragraphs). Always encourage open dialogue with their doctor.`;

    // Format chat history for Gemini
    const formattedHistory = (history || []).slice(-6).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `Here is the context for all subsequent questions:\n${systemPrompt}` }]
        },
        {
          role: 'model',
          parts: [{ text: `I understand. I am Bodhiva, an educational medical assistant. I will answer only based on this report, in ${targetLang}, without diagnosing or prescribing.` }]
        },
        ...formattedHistory
      ]
    });

    const result = await chat.sendMessage(userMessage);
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'Failed to generate chat response.',
      details: error.message || String(error)
    });
  }
}
