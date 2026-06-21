import { calculateFootprint } from '../calculations';
import { UserInputs } from '../types';

// Mock the Earth Engine service since we want to unit test the math logic isolated from APIs
jest.mock('@/services/GoogleEarthEngineService', () => ({
  fetchLocalizedEarthEngineData: jest.fn().mockImplementation(async (zone) => {
    return {
      zone,
      dynamicGridFactor: 0.82, // Standard mock factor
      aqi: 150,
      dominantPollutant: 'PM2.5',
      solarPotential: 'High',
      recommendations: [],
    };
  }),
}));

describe('calculateFootprint Engine', () => {
  const baseInputs: UserInputs = {
    kilometersDrivenPerWeek: 100,
    vehicleType: 'petrol',
    indianZone: 'national-average',
    flightHoursPerYear: 0,
    electricityKWhPerMonth: 200,
    naturalGasThermsPerMonth: 0,
    lpgCylindersPerYear: 0,
    dietType: 'average',
    recyclingLevel: 'average',
  };

  it('calculates the footprint correctly for a standard user', async () => {
    const result = await calculateFootprint(baseInputs);

    expect(result).toHaveProperty('totalCO2eKg');
    expect(result).toHaveProperty('totalCO2eTons');
    expect(result).toHaveProperty('ecoScore');
    expect(result.ecoScore).toBeGreaterThanOrEqual(0);
    expect(result.ecoScore).toBeLessThanOrEqual(100);
  });

  it('calculates a higher eco-score for a vegan diet vs meat-heavy diet', async () => {
    const meatHeavyResult = await calculateFootprint({ ...baseInputs, dietType: 'meatHeavy' });
    const veganResult = await calculateFootprint({ ...baseInputs, dietType: 'vegan' });

    expect(veganResult.categories.diet).toBeLessThan(meatHeavyResult.categories.diet);
    expect(veganResult.ecoScore).toBeGreaterThan(meatHeavyResult.ecoScore);
  });

  it('penalizes extremely high electricity usage', async () => {
    const lowEnergyResult = await calculateFootprint({
      ...baseInputs,
      electricityKWhPerMonth: 100,
    });
    const highEnergyResult = await calculateFootprint({
      ...baseInputs,
      electricityKWhPerMonth: 2000,
    });

    expect(highEnergyResult.categories.homeEnergy).toBeGreaterThan(
      lowEnergyResult.categories.homeEnergy
    );
    expect(highEnergyResult.ecoScore).toBeLessThan(lowEnergyResult.ecoScore);
  });

  it('calculates lower transportation emissions for an EV compared to a Petrol car', async () => {
    const petrolResult = await calculateFootprint({
      ...baseInputs,
      vehicleType: 'petrol',
      kilometersDrivenPerWeek: 500,
    });
    const evResult = await calculateFootprint({
      ...baseInputs,
      vehicleType: 'electric',
      kilometersDrivenPerWeek: 500,
    });

    expect(evResult.categories.transportation).toBeLessThan(petrolResult.categories.transportation);
    expect(evResult.ecoScore).toBeGreaterThan(petrolResult.ecoScore);
  });

  it('handles empty string inputs properly by treating them as 0', async () => {
    const emptyInputsResult = await calculateFootprint({
      ...baseInputs,
      kilometersDrivenPerWeek: '',
      flightHoursPerYear: '',
      electricityKWhPerMonth: '',
      naturalGasThermsPerMonth: '',
      lpgCylindersPerYear: '',
    });

    expect(emptyInputsResult.categories.transportation).toBe(0);
    expect(emptyInputsResult.categories.homeEnergy).toBe(0);
  });
});
