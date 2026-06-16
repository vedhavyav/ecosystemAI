import { calculateFootprint, UserInputs } from '../calculations';

describe('Calculations Engine', () => {
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

  it('calculates baseline correct values for zero inputs', async () => {
    const result = await calculateFootprint(baseInputs);
    // Even with zero, diet and waste will have some baseline
    expect(result.totalCO2eKg).toBeGreaterThan(0);
    expect(result.categories.transportation).toBe(0);
    expect(result.categories.homeEnergy).toBe(0);
    expect(result.ecoScore).toBeGreaterThanOrEqual(90);
  });

  it('correctly calculates high emissions for heavy usage', async () => {
    const heavyInputs: UserInputs = {
      ...baseInputs,
      kilometersDrivenPerWeek: 500,
      vehicleType: 'petrol',
      flightHoursPerYear: 50,
      electricityKWhPerMonth: 1000,
      dietType: 'meatHeavy',
      recyclingLevel: 'low',
    };
    const result = await calculateFootprint(heavyInputs);
    expect(result.categories.transportation).toBeGreaterThan(1000);
    expect(result.categories.homeEnergy).toBeGreaterThan(1000);
    expect(result.ecoScore).toBeLessThan(50);
  });

  it('handles empty string inputs gracefully (treated as 0)', async () => {
    const emptyInputs: UserInputs = {
      ...baseInputs,
      kilometersDrivenPerWeek: '',
      flightHoursPerYear: '',
      electricityKWhPerMonth: '',
      naturalGasThermsPerMonth: '',
      lpgCylindersPerYear: '',
    };
    const result = await calculateFootprint(emptyInputs);
    expect(result.categories.transportation).toBe(0);
    expect(result.categories.homeEnergy).toBe(0);
  });

  it('differentiates between vehicle types', async () => {
    const petrolResult = await calculateFootprint({
      ...baseInputs,
      kilometersDrivenPerWeek: 100,
      vehicleType: 'petrol',
    });
    const electricResult = await calculateFootprint({
      ...baseInputs,
      kilometersDrivenPerWeek: 100,
      vehicleType: 'electric',
    });

    expect(petrolResult.categories.transportation).toBeGreaterThan(
      electricResult.categories.transportation
    );
  });
});
