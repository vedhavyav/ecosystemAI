'use server';

import { UserInputs } from './types';
import OpenAI from 'openai';

const getOpenAIClient = () => {
  return new OpenAI({
    apiKey:
      process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || 'missing_key',
    baseURL: 'https://openrouter.ai/api/v1',
  });
};

/**
 * Generate a localized sustainability nudge using a real LLM.
 * Runs securely on the server to protect API keys.
 * Falls back to a generic message if the API key is missing or the call fails.
 */
export async function generateLocalizedAINudge(inputs: UserInputs): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'missing_key') {
    console.warn('OPENROUTER_API_KEY not set; returning fallback message.');
    return 'You have an excellent lifestyle! Consider advocating for neighborhood waste segregation or EV adoption in your local RWA.';
  }

  const openai = getOpenAIClient();

  // Build a concise prompt that asks the model to give a localized, actionable tip.
  const prompt = `
You are an AI assistant that provides hyper-localized, actionable sustainability advice for users in India.
Given the following user details, produce a single short suggestion (one sentence) that is specific to the user's Indian zone (southern, western, northern, eastern) and lifestyle.
User inputs:
- kilometers driven per week: ${inputs.kilometersDrivenPerWeek}
- vehicle type: ${inputs.vehicleType}
- Indian zone: ${inputs.indianZone}
- flight hours per year: ${inputs.flightHoursPerYear}
- electricity kWh per month: ${inputs.electricityKWhPerMonth}
- LPG cylinders per year: ${inputs.lpgCylindersPerYear}
- diet type: ${inputs.dietType}
- recycling level: ${inputs.recyclingLevel}
- natural gas therms per month: ${inputs.naturalGasThermsPerMonth}

The suggestion should be practical, localized (mention a local transit option, grid condition, or cultural practice if relevant), and encouraging.
Keep it under 25 words.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini', // OpenRouter model string
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 60,
    });

    const message = completion.choices[0]?.message?.content?.trim();
    if (message) {
      return message;
    }
    // If empty, fallback
    return 'You have an excellent lifestyle! Consider advocating for neighborhood waste segregation or EV adoption in your local RWA.';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return 'You have an excellent lifestyle! Consider advocating for neighborhood waste segregation or EV adoption in your local RWA.';
  }
}
