'use server';

import { emissionFactors } from '../config/emissionFactors';
import { UserInputs, FootprintResult } from './types';
import {
  fetchLocalizedEarthEngineData,
  LocalizedEnvironmentalData,
} from '@/services/GoogleEarthEngineService';

export async function calculateFootprint(inputs: UserInputs): Promise<FootprintResult> {
  const parseNum = (val: number | '') => (val === '' ? 0 : Number(val));

  // Await the mocked localized Earth Engine data
  const localData = await fetchLocalizedEarthEngineData(inputs.indianZone || 'national-average');

  // Transportation (factors are now strictly per km)
  const kmDriven = parseNum(inputs.kilometersDrivenPerWeek);
  // ponytail: standard object map over 18-line switch statement
  const rateMap: Record<string, number> = {
    petrol: emissionFactors.transportation.petrolCarPerKm,
    diesel: emissionFactors.transportation.dieselCarPerKm,
    twoWheeler: emissionFactors.transportation.twoWheelerPerKm,
    electric: emissionFactors.transportation.electricCarPerKm,
    publicTransit: emissionFactors.transportation.publicTransitPerKm,
  };
  const transportPerWeek = kmDriven * (rateMap[inputs.vehicleType] || rateMap.petrol);

  const transportAnnual =
    transportPerWeek * 52 +
    parseNum(inputs.flightHoursPerYear) * emissionFactors.transportation.flightPerHour;

  // Home Energy (Localized grid factors from mock Earth Engine API)
  const gridFactor = localData.dynamicGridFactor;
  const energyAnnual =
    parseNum(inputs.electricityKWhPerMonth) * 12 * gridFactor +
    parseNum(inputs.naturalGasThermsPerMonth) * 12 * emissionFactors.homeEnergy.naturalGasPerTherm +
    parseNum(inputs.lpgCylindersPerYear) * emissionFactors.homeEnergy.lpgCylinder;

  // Diet
  // ponytail: straight map lookup
  const dietAnnual = emissionFactors.diet[inputs.dietType] || 0;

  // Waste
  // ponytail: straight map lookup
  const wasteMap: Record<string, number> = {
    high: emissionFactors.waste.highRecycling,
    average: emissionFactors.waste.average,
    low: emissionFactors.waste.lowRecycling,
  };
  const wasteAnnual = wasteMap[inputs.recyclingLevel] || emissionFactors.waste.average;

  const totalCO2eKg = transportAnnual + energyAnnual + dietAnnual + wasteAnnual;
  const totalCO2eTons = totalCO2eKg / 1000;

  // Eco Score calculation (0 to 100)
  // Let's assume 15 tons (15000 kg) is a 0 score, and 2 tons (2000 kg) is 100 score.
  let ecoScore = 100 - ((totalCO2eKg - 2000) / (15000 - 2000)) * 100;
  ecoScore = Math.max(0, Math.min(100, Math.round(ecoScore)));

  let level = 'High Impact User';
  if (ecoScore >= 90) level = '🌱 Carbon Guardian';
  else if (ecoScore >= 70) level = '🌿 Eco Champion';
  else if (ecoScore >= 50) level = '🌎 Green Explorer';
  else if (ecoScore >= 30) level = '⚠️ Climate Learner';
  else level = '🔥 High Impact User';

  return {
    totalCO2eKg,
    totalCO2eTons,
    categories: {
      transportation: transportAnnual,
      homeEnergy: energyAnnual,
      diet: dietAnnual,
      waste: wasteAnnual,
    },
    ecoScore,
    level,
    localData,
  };
}
