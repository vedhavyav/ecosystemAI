import { UserInputs } from './types';

/**
 * A sophisticated Mock LLM Orchestrator that generates hyper-personalized,
 * localized Indian nudges based on user inputs. It mimics what an LLM with RAG
 * over a local infrastructure database would output.
 */
export function generateLocalizedAINudge(inputs: UserInputs): string {
  const getNum = (val: number | '') => (val === '' ? 0 : val);

  // Example 1: Localized Transit based on Zone
  if (inputs.vehicleType !== 'publicTransit' && getNum(inputs.kilometersDrivenPerWeek) > 50) {
    if (inputs.indianZone === 'southern') {
      return `Taking the Namma Metro Purple Line from Indiranagar or the Chennai Metro could bypass massive traffic and reduce your ${inputs.vehicleType} footprint by 40%.`;
    } else if (inputs.indianZone === 'western') {
      return `Switching your commute to the Mumbai Local or BEST buses (now expanding EV fleets) for just 3 days a week saves 8kg CO2.`;
    } else if (inputs.indianZone === 'northern') {
      return `Using the Delhi Metro on high-AQI days will lower your personal commute emissions while protecting you from PM2.5 exposure.`;
    }
  }

  // Example 2: Localized Energy/AC based on grid intensity
  if (getNum(inputs.electricityKWhPerMonth) > 600) {
    if (inputs.indianZone === 'southern') {
      return `In current humid conditions (85%), shifting your AC from 18°C to 24°C saves 4.2 kWh/day on the high-intensity Southern Grid.`;
    } else if (inputs.indianZone === 'northern') {
      return `During the intense summer peak, raising your AC to 24°C saves 5 kWh/day and reduces strain on the Northern Grid (0.75 kg CO2/kWh).`;
    } else {
      return `Optimizing your AC temperature and switching to BLDC fans can cut your 600+ kWh bill by 15%, highly impactful on your local power grid.`;
    }
  }

  // Example 3: Diet Localization
  if (inputs.dietType === 'meatHeavy') {
    return `Shifting just 2 meals a week to traditional Indian lentil (dal) proteins saves ₹400 and drastically lowers your methane footprint.`;
  }

  // Example 4: LPG Optimization
  if (getNum(inputs.lpgCylindersPerYear) > 8) {
    return `You're using >8 LPG cylinders. Switching to an induction cooktop for boiling water and making tea leverages India's growing renewable grid mix and cuts indoor emissions.`;
  }

  return 'You have an excellent lifestyle! Consider advocating for neighborhood waste segregation or EV adoption in your local RWA.';
}
