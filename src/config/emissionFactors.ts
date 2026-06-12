// Indian Context Emission Factors (CEA & ARAI/MoRTH)
export const emissionFactors = {
  // Transportation (kg CO2e per km) based on ARAI / MoRTH data
  transportation: {
    petrolCarPerKm: 0.140, // Indian average petrol hatchback/sedan
    dieselCarPerKm: 0.170, // Indian average diesel
    twoWheelerPerKm: 0.040, // ARAI average for 100cc-150cc scooters/bikes
    electricCarPerKm: 0.090, // EV charged on Indian grid (average)
    publicTransitPerKm: 0.035, // BEST Bus / Delhi Metro average per passenger
    flightPerHour: 90.0, // Domestic flight average (e.g. Indigo/AirIndia)
  },
  // Home Energy (kg CO2e per unit) based on CEA CO2 Baseline Database
  homeEnergy: {
    // CEA Grid Emission Factors (kg CO2 / kWh)
    electricityByGrid: {
      'southern': 0.71, // Southern Grid (Tamil Nadu, Karnataka, etc.)
      'northern': 0.75, // Northern Grid
      'western': 0.80,  // Western Grid (highest coal mix)
      'eastern': 0.82,  // Eastern Grid
      'north-eastern': 0.50, // Hydro-heavy
      'national-average': 0.71,
    },
    naturalGasPerTherm: 5.302, // Piped Natural Gas (PNG) average
    lpgCylinder: 42.5, // kg CO2e per standard 14.2kg domestic LPG cylinder
  },
  // Diet (Annual kg CO2e based on Indian dietary context)
  diet: {
    meatHeavy: 2500, // Indian non-veg is still lower than Western heavy meat
    average: 1800, // Occasional non-veg (chicken/fish)
    vegetarian: 1200, // Indian lacto-vegetarian (high dairy)
    vegan: 900, // Plant-based
  },
  // Waste (Annual kg CO2e)
  waste: {
    highRecycling: 100, // Kabadiwala / source segregation
    average: 350, // Mixed disposal
    lowRecycling: 700, // Open burning / dumping
  }
};
