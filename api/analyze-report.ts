import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildReportAnalysisPrompt } from '../src/services/promptTemplates';
import { enforceClinicalSafety } from '../src/services/clinicalSafety';
import { MedicalReportData } from '../src/types/medicalReport';

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server environment. Please set GEMINI_API_KEY.'
    });
  }

  try {
    const { pages, language } = req.body;

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ error: 'No report page images provided.' });
    }

    const targetLang = language || 'en';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1 // Low temperature for high medical precision
      }
    });

    // Prepare image parts for Gemini Multimodal Vision
    const imageParts = pages.map((pageDataUrl: string) => {
      const match = pageDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (match) {
        return {
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        };
      }
      // If pure base64 string without data prefix
      return {
        inlineData: {
          mimeType: 'image/jpeg',
          data: pageDataUrl
        }
      };
    });

    const promptText = buildReportAnalysisPrompt(targetLang);

    // Call Gemini API
    const response = await model.generateContent([promptText, ...imageParts]);
    const responseText = response.response.text();

    const parsedData: MedicalReportData = JSON.parse(responseText);
    parsedData.id = `report-${Date.now()}`;
    parsedData.createdAt = new Date().toISOString();

    // Sanitize with Clinical Safety Guardrails
    const safeData = enforceClinicalSafety(parsedData);

    return res.status(200).json(safeData);
  } catch (error: any) {
    console.error('Gemini Analysis Failed:', error);
    return res.status(500).json({
      error: 'Failed to analyze report using AI engine.',
      details: error.message || String(error)
    });
  }
}
