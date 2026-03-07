import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, context } = await req.json()

  const systemPrompt = `You are DropAI Assistant, a helpful AI expert in dropshipping, product sourcing, and e-commerce strategy.

You help users understand their product research data, explain metrics, and provide actionable advice.

${context ? `Current dashboard context: ${JSON.stringify(context)}` : ''}

Guidelines:
- Be concise and actionable
- Use specific numbers when referencing data
- Suggest concrete next steps
- Explain metrics like demand score, profit margin, and competition level when asked
- Recommend marketing strategies, pricing, and supplier selection
- Be enthusiastic but realistic about product potential`

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: systemPrompt,
    messages,
  })

  return result.toTextStreamResponse()
}
