import { FootprintResult, UserInputs, Recommendation } from './types';
import { generateLocalizedAINudge } from './LLMOrchestrator';

/**
 * Generates an array of tailored, actionable sustainability recommendations based on user footprint results.
 *
 * @param {UserInputs} inputs - The user's input data for lifestyle activities.
 * @param {FootprintResult} result - The calculated carbon footprint results.
 * @returns {Recommendation[]} A sorted array of personalized recommendations.
 */
export async function generateRecommendations(
  inputs: UserInputs,
  result: FootprintResult
): Promise<Recommendation[]> {
  const recs: Recommendation[] = [];

  // 1. Dynamic AI Context Nudge (LLM)
  const aiNudge = await generateLocalizedAINudge(inputs);
  recs.push({
    title: 'AI Contextual Insight',
    description: aiNudge,
    impactScore: 10,
    difficulty: 'Medium',
  });

  // Identify highest category
  const cats = result.categories;

  if (inputs.vehicleType === 'petrol' && cats.transportation > 1500) {
    recs.push({
      title: 'Transition to an Electric Vehicle (EV)',
      description:
        'Transportation is a major portion of your footprint. Switching to an EV could cut these emissions significantly over time.',
      impactScore: 9,
      difficulty: 'Hard',
    });
  }

  if (Number(inputs.flightHoursPerYear) > 10) {
    recs.push({
      title: 'Reduce Air Travel',
      description:
        'Flights contribute massively to carbon emissions. Consider taking trains for regional trips or utilizing virtual meetings.',
      impactScore: 8,
      difficulty: 'Medium',
    });
  }

  if (inputs.dietType === 'meatHeavy' || inputs.dietType === 'average') {
    recs.push({
      title: 'Shift Toward a Plant-Based Diet',
      description:
        'Incorporating more meat-free days into your week can reduce your dietary carbon footprint by up to 30%.',
      impactScore: 7,
      difficulty: 'Medium',
    });
  }

  if (Number(inputs.electricityKWhPerMonth) > 600) {
    recs.push({
      title: 'Adopt Renewable Energy',
      description:
        'Your home energy usage is high. Opt into a green energy program with your utility provider or explore solar options.',
      impactScore: 8,
      difficulty: 'Hard',
    });
  }

  if (inputs.recyclingLevel === 'low') {
    recs.push({
      title: 'Improve Household Recycling',
      description:
        'Properly sorting waste and participating in local recycling programs can easily offset some of your footprint.',
      impactScore: 4,
      difficulty: 'Easy',
    });
  }

  // Sort by impact score
  return recs.sort((a, b) => b.impactScore - a.impactScore);
}
