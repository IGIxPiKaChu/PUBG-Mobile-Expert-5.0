import { GoogleGenerativeAI } from '@google/genai';

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export interface PlayerProfile {
  currentSeason: string;
  playstyle: string;
  favoriteWeapons: string[];
  preferredMaps: string[];
  currentChallenges: string[];
}

export interface HistoricalContext {
  relevantUpdates: any[];
  weaponMeta: any[];
}

export interface GeminiPromptRequest {
  playerProfile: PlayerProfile;
  historicalContext?: HistoricalContext;
  situationalQuery?: string;
}

export async function generateStrategyAdvice(request: GeminiPromptRequest): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = buildPrompt(request);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

function buildPrompt(request: GeminiPromptRequest): string {
  const { playerProfile, historicalContext, situationalQuery } = request;

  let prompt = `You are a PUBG Mobile strategy coach. Provide personalized tactical advice based on the following player profile:\n\n`;
  
  prompt += `**Player Profile:**\n`;
  prompt += `- Current Season: ${playerProfile.currentSeason}\n`;
  prompt += `- Playstyle: ${playerProfile.playstyle}\n`;
  prompt += `- Favorite Weapons: ${playerProfile.favoriteWeapons.join(', ')}\n`;
  prompt += `- Preferred Maps: ${playerProfile.preferredMaps.join(', ')}\n`;
  prompt += `- Current Challenges: ${playerProfile.currentChallenges.join(', ')}\n\n`;

  if (historicalContext && historicalContext.relevantUpdates.length > 0) {
    prompt += `**Historical Context:**\n`;
    historicalContext.relevantUpdates.forEach((update: any) => {
      prompt += `- Version ${update.versionName} (${update.year}): ${update.metaSummary}\n`;
      if (update.weaponChanges && update.weaponChanges.length > 0) {
        prompt += `  Weapon Changes: ${update.weaponChanges.join(', ')}\n`;
      }
    });
    prompt += `\n`;
  }

  if (situationalQuery) {
    prompt += `**Current Situation:**\n${situationalQuery}\n\n`;
    prompt += `Provide immediate tactical advice for this specific situation.\n`;
  } else {
    prompt += `Provide personalized strategy advice covering:\n`;
    prompt += `1. Recommended weapons and loadout based on current meta and player preferences\n`;
    prompt += `2. Map-specific tactics for their preferred maps\n`;
    prompt += `3. Tips to overcome their current challenges\n`;
    prompt += `4. Overall strategy based on their playstyle\n`;
  }

  return prompt;
}
