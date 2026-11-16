import { GoogleGenerativeAI } from '@google/generative-ai';
import { MedicalReportData } from '../types/medicalReport';
import { buildReportAnalysisPrompt } from './promptTemplates';
import { enforceClinicalSafety } from './clinicalSafety';
import { getSampleDemonstrationReport } from './clinicalSampleData';

export interface AnalyzeReportParams {
  pages: string[]; // Base64 data URLs
  language: string;
}

/**
 * Analyzes uploaded medical report pages using Gemini Multimodal Vision.
 * Tries serverless backend (/api/analyze-report) first, falls back to local client key if provided.
 */
export async function analyzeMedicalReport({
  pages,
  language
}: AnalyzeReportParams): Promise<MedicalReportData> {
  // 1. Attempt call to Backend Serverless Endpoint (/api/analyze-report)
  try {
    const response = await fetch('/api/analyze-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pages, language })
    });

    if (response.ok) {
      const data: MedicalReportData = await response.json();
      return enforceClinicalSafety(data);
    }
  } catch (err) {
    console.info('Backend endpoint not responding, checking client-side environment key...');
  }

  // 2. Direct client SDK fallback if VITE_GEMINI_API_KEY is configured in local development
  const clientKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (clientKey && clientKey.trim().length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(clientKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      });

      const imageParts = pages.map((pageDataUrl) => {
        const match = pageDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
        if (match) {
          return {
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          };
        }
        return {
          inlineData: {
            mimeType: 'image/jpeg',
            data: pageDataUrl
          }
        };
      });

      const promptText = buildReportAnalysisPrompt(language);
      const result = await model.generateContent([promptText, ...imageParts]);
      const text = result.response.text();

      const parsed: MedicalReportData = JSON.parse(text);
      parsed.id = `report-${Date.now()}`;
      parsed.createdAt = new Date().toISOString();

      return enforceClinicalSafety(parsed);
    } catch (e: any) {
      console.error('Direct Gemini SDK call failed:', e);
      throw new Error(`AI Analysis Error: ${e.message || String(e)}`);
    }
  }

  // 3. If no API key is present in environment, throw structured notification
  const error: any = new Error(
    'GEMINI_API_KEY is not configured in your environment variables. Please add VITE_GEMINI_API_KEY to your .env file or GEMINI_API_KEY to Vercel.'
  );
  error.code = 'API_KEY_MISSING';
  throw error;
}

/**
 * Loads realistic, medically verified sample diagnostic reports for demonstration.
 */
export function loadSampleReport(language: string): MedicalReportData {
  return getSampleDemonstrationReport(language);
}
