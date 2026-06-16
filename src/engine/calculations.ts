import { emissionFactors } from '../config/emissionFactors';

export type UserInputs = {
  kilometersDrivenPerWeek: number | '';
  vehicleType: 'petrol' | 'diesel' | 'twoWheeler' | 'electric' | 'publicTransit';
  indianZone:
    | 'southern'
    | 'northern'
    | 'western'
    | 'eastern'
    | 'north-eastern'
    | 'national-average';
  flightHoursPerYear: number | '';
  electricityKWhPerMonth: number | '';
  naturalGasThermsPerMonth: number | '';
  lpgCylindersPerYear: number | '';
  dietType: 'meatHeavy' | 'average' | 'vegetarian' | 'vegan';
  recyclingLevel: 'high' | 'average' | 'low';
};

export type FootprintResult = {
  totalCO2eKg: number;
  totalCO2eTons: number;
  categories: {
    transportation: number;
    homeEnergy: number;
    diet: number;
    waste: number;
  };
  ecoScore: number;
  level: string;
  localData: LocalizedEnvironmentalData;
};

/**
 * Calculates the total carbon footprint and categorizes it based on user inputs.
 *
 * @param {UserInputs} inputs - The specific lifestyle data inputs provided by the user.
 * @returns {FootprintResult} An object containing total emissions, categorized emissions,
 *                            and an eco-score out of 100 with an associated level.
 */
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
  let transportPerWeek = 0;

  switch (inputs.vehicleType) {
    case 'petrol':
      transportPerWeek = kmDriven * emissionFactors.transportation.petrolCarPerKm;
      break;
    case 'diesel':
      transportPerWeek = kmDriven * emissionFactors.transportation.dieselCarPerKm;
      break;
    case 'twoWheeler':
      transportPerWeek = kmDriven * emissionFactors.transportation.twoWheelerPerKm;
      break;
    case 'electric':
      transportPerWeek = kmDriven * emissionFactors.transportation.electricCarPerKm;
      break;
    case 'publicTransit':
      transportPerWeek = kmDriven * emissionFactors.transportation.publicTransitPerKm;
      break;
    default:
      transportPerWeek = kmDriven * emissionFactors.transportation.petrolCarPerKm; // fallback
  }

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
  let dietAnnual = 0;
  if (inputs.dietType === 'meatHeavy') dietAnnual = emissionFactors.diet.meatHeavy;
  else if (inputs.dietType === 'average') dietAnnual = emissionFactors.diet.average;
  else if (inputs.dietType === 'vegetarian') dietAnnual = emissionFactors.diet.vegetarian;
  else if (inputs.dietType === 'vegan') dietAnnual = emissionFactors.diet.vegan;

  // Waste
  let wasteAnnual = 0;
  if (inputs.recyclingLevel === 'high') wasteAnnual = emissionFactors.waste.highRecycling;
  else if (inputs.recyclingLevel === 'average') wasteAnnual = emissionFactors.waste.average;
  else if (inputs.recyclingLevel === 'low') wasteAnnual = emissionFactors.waste.lowRecycling;

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
