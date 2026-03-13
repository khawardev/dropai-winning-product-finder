'use server'

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

export async function generateProductAnalysis(payload: {
  keyword: string;
  pipelineData: any;
}) {
  try {
    const { keyword, pipelineData } = payload;
    const profitability = pipelineData.profitability || {};
    const trends = pipelineData.trends || {};
    const competitors = pipelineData.competitive?.competitors || [];

    const prompt = `
      Analyze this e-commerce product research data and provide a professional, concise winning product report.
      
      Product: ${keyword}
      Market: ${pipelineData.marketIntelligence?.region || 'Global'}
      
      Financials:
      - Retail Price: $${profitability.retailPrice || 'N/A'}
      - Sourcing Price: $${profitability.wholesalePrice || 'N/A'}
      - Margin: ${profitability.marginPercent || 0}%
      
      Market Data:
      - Competitors found: ${competitors.length}
      - Trends summary: ${trends.rising_queries?.length || 0} breakout queries.
      
      Respond in JSON format with these keys:
      - "summary": A brief executive summary (2 sentences).
      - "pros": 3 bullet points of strength.
      - "cons": 2 potential risks.
      - "targetAudience": Who should this be marketed to?
      - "marketingAngle": The #1 winning angle for ads.
      - "scalingPotential": "Low", "Medium", "High", or "Viral".
    `;

    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt,
    });

    // Try to parse JSON from the response
    try {
      // Small cleanup in case of markdown wrapping
      const jsonStr = text.replace(/```json|```/g, '').trim();
      return { success: true, analysis: JSON.parse(jsonStr) };
    } catch (e) {
      // Fallback if AI didn't return valid JSON
      return { success: true, analysis: { summary: text.slice(0, 300) } };
    }
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return { success: false, error: 'AI analysis failed.' };
  }
}
