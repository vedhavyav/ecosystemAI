import { LocalizedEnvironmentalData } from '@/services/GoogleEarthEngineService';

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
  error?: string;
};

export type Recommendation = {
  title: string;
  description: string;
  impactScore: number; // 1 to 10
  difficulty: 'Easy' | 'Medium' | 'Hard';
};
