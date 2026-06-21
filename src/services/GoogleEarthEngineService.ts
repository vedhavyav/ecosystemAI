import { UserInputs } from '@/engine/types';

export type LocalizedEnvironmentalData = {
  dynamicGridFactor: number; // kg CO2 / kWh
  regionalAirQualityIndex: number;
  evChargingStationsNearby: number;
  plantBasedRestaurantsNearby: number;
  timestamp: string;
};

/**
 * Mocks an asynchronous call to Google Earth Engine and Google Maps Platform APIs.
 * Generates dynamic, localized environmental variables to replace static emission multipliers.
 */
export async function fetchLocalizedEarthEngineData(
  zone: UserInputs['indianZone']
): Promise<LocalizedEnvironmentalData> {
  // Simulate network latency (500ms to 1200ms)
  const delay = Math.floor(Math.random() * 700) + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Determine baseline grid factors with simulated real-time fluctuations
  let baseGridFactor = 0.71;
  let aqiBase = 100;
  let evStations = 5;
  let plantRest = 10;

  switch (zone) {
    case 'northern':
      baseGridFactor = 0.76;
      aqiBase = 250; // Higher PM2.5 typically
      evStations = 45; // Delhi NCR has many
      plantRest = 120;
      break;
    case 'southern':
      baseGridFactor = 0.69; // Better renewable mix
      aqiBase = 80;
      evStations = 60; // Bengaluru/Chennai tech corridors
      plantRest = 150;
      break;
    case 'western':
      baseGridFactor = 0.81; // High coal dependence
      aqiBase = 150;
      evStations = 50; // Mumbai/Pune
      plantRest = 100;
      break;
    case 'eastern':
      baseGridFactor = 0.83; // Coal rich region
      aqiBase = 180;
      evStations = 15;
      plantRest = 40;
      break;
    case 'north-eastern':
      baseGridFactor = 0.45; // Hydro heavy
      aqiBase = 40;
      evStations = 5;
      plantRest = 20;
      break;
    default:
      baseGridFactor = 0.72;
      aqiBase = 120;
      evStations = 25;
      plantRest = 60;
  }

  // Inject real-time variance (+/- 5%) to simulate live API conditions
  const fluctuation = (Math.random() - 0.5) * 0.1;

  return {
    dynamicGridFactor: Number((baseGridFactor * (1 + fluctuation)).toFixed(3)),
    regionalAirQualityIndex: Math.floor(aqiBase * (1 + fluctuation)),
    evChargingStationsNearby: evStations + Math.floor(Math.random() * 10),
    plantBasedRestaurantsNearby: plantRest + Math.floor(Math.random() * 20),
    timestamp: new Date().toISOString(),
  };
}
