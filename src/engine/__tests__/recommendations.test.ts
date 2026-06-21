import { generateRecommendations } from '../recommendations';
import { UserInputs, FootprintResult } from '../types';

// Mock the AI module since we are testing recommendations logic
jest.mock('../LLMOrchestrator', () => ({
  generateLocalizedAINudge: jest.fn(() => Promise.resolve('Mocked AI Insight')),
}));

describe('Recommendations Engine', () => {
  const baseInputs: UserInputs = {
    kilometersDrivenPerWeek: 0,
    vehicleType: 'electric',
    indianZone: 'national-average',
    flightHoursPerYear: 0,
    electricityKWhPerMonth: 0,
    naturalGasThermsPerMonth: 0,
    lpgCylindersPerYear: 0,
    dietType: 'vegan',
    recyclingLevel: 'high',
  };

  const baseResult: FootprintResult = {
    totalCO2eKg: 1000,
    totalCO2eTons: 1,
    categories: {
      transportation: 0,
      homeEnergy: 0,
      diet: 1000,
      waste: 0,
    },
    ecoScore: 90,
    level: 'Carbon Guardian',
  };

  it('always includes the AI contextual insight as the highest impact recommendation', async () => {
    const recs = await generateRecommendations(baseInputs, baseResult);

    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].title).toBe('AI Contextual Insight');
    expect(recs[0].description).toBe('Mocked AI Insight');
  });

  it('recommends EV transition for high petrol transport emissions', async () => {
    const inputs = { ...baseInputs, vehicleType: 'petrol' as const };
    const result = {
      ...baseResult,
      categories: { ...baseResult.categories, transportation: 2000 },
    };

    const recs = await generateRecommendations(inputs, result);
    expect(recs.some((r) => r.title === 'Transition to an Electric Vehicle (EV)')).toBe(true);
  });

  it('recommends reducing flights if flight hours are high', async () => {
    const inputs = { ...baseInputs, flightHoursPerYear: 20 };
    const recs = await generateRecommendations(inputs, baseResult);

    expect(recs.some((r) => r.title === 'Reduce Air Travel')).toBe(true);
  });

  it('recommends plant-based diet for meat-heavy inputs', async () => {
    const inputs = { ...baseInputs, dietType: 'meatHeavy' as const };
    const recs = await generateRecommendations(inputs, baseResult);

    expect(recs.some((r) => r.title === 'Shift Toward a Plant-Based Diet')).toBe(true);
  });

  it('recommends renewable energy for high electricity usage', async () => {
    const inputs = { ...baseInputs, electricityKWhPerMonth: 800 };
    const recs = await generateRecommendations(inputs, baseResult);

    expect(recs.some((r) => r.title === 'Adopt Renewable Energy')).toBe(true);
  });

  it('recommends improving recycling for low recycling level', async () => {
    const inputs = { ...baseInputs, recyclingLevel: 'low' as const };
    const recs = await generateRecommendations(inputs, baseResult);

    expect(recs.some((r) => r.title === 'Improve Household Recycling')).toBe(true);
  });
});
