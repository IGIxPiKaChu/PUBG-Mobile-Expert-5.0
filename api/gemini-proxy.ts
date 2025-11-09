import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateStrategyAdvice, type GeminiPromptRequest } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const request: GeminiPromptRequest = req.body;

    if (!request.playerProfile) {
      return res.status(400).json({ error: 'Player profile is required' });
    }

    const advice = await generateStrategyAdvice(request);

    return res.status(200).json({ 
      success: true,
      advice 
    });

  } catch (error) {
    console.error('Error generating strategy advice:', error);
    return res.status(500).json({ error: 'Failed to generate strategy advice' });
  }
}
