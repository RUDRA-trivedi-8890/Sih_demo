export interface StateProjectData {
  id: string;
  stateName: string;
  projectCount: number;
  originalCost: number; // in Cr
  revisedCost: number; // in Cr
  expenditure: number; // in Cr
  completedThisMonth: number;
  newlyAdded: number;
  capitalCostOverrunPct?: number;
  topSectors?: string[];
}

export const NATIONAL_SUMMARY_DATA: StateProjectData = {
  id: "all",
  stateName: "All-India National Summary",
  projectCount: 1981,
  originalCost: 3125600.0,
  revisedCost: 3489200.0,
  expenditure: 2084500.0,
  completedThisMonth: 5,
  newlyAdded: 4,
  capitalCostOverrunPct: 11.63,
  topSectors: ["Roads & Highways", "Railways", "Petroleum & Natural Gas", "Power"],
};

export const STATE_PROJECTS_MAP: Record<string, StateProjectData> = {
  gj: {
    id: "gj",
    stateName: "Gujarat",
    projectCount: 96,
    originalCost: 268554.15,
    revisedCost: 282728.11,
    expenditure: 163717.59,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 5.28,
    topSectors: ["Petroleum & Chemicals", "Ports & Shipping", "High-Speed Rail", "Renewable Energy"],
  },
  mh: {
    id: "mh",
    stateName: "Maharashtra",
    projectCount: 184,
    originalCost: 412980.5,
    revisedCost: 448120.3,
    expenditure: 279400.12,
    completedThisMonth: 2,
    newlyAdded: 1,
    capitalCostOverrunPct: 8.51,
    topSectors: ["Metro Rail & Urban Transit", "Expressways", "Power Grid", "Dedicated Freight Corridors"],
  },
  up: {
    id: "up",
    stateName: "Uttar Pradesh",
    projectCount: 162,
    originalCost: 358240.2,
    revisedCost: 389110.85,
    expenditure: 231500.4,
    completedThisMonth: 1,
    newlyAdded: 2,
    capitalCostOverrunPct: 8.62,
    topSectors: ["Expressways & NH", "Rail Doubling & Electrification", "Civil Aviation", "Namami Gange"],
  },
  tn: {
    id: "tn",
    stateName: "Tamil Nadu",
    projectCount: 128,
    originalCost: 245100.8,
    revisedCost: 262300.0,
    expenditure: 172400.6,
    completedThisMonth: 1,
    newlyAdded: 0,
    capitalCostOverrunPct: 7.02,
    topSectors: ["Major Ports & Logistics", "Defense Industrial Corridor", "Nuclear & Thermal Energy", "Railways"],
  },
  ka: {
    id: "ka",
    stateName: "Karnataka",
    projectCount: 114,
    originalCost: 218700.0,
    revisedCost: 234150.4,
    expenditure: 148900.25,
    completedThisMonth: 0,
    newlyAdded: 1,
    capitalCostOverrunPct: 7.06,
    topSectors: ["Urban Metro", "Industrial Corridors", "Renewable Parks", "National Highways"],
  },
  mp: {
    id: "mp",
    stateName: "Madhya Pradesh",
    projectCount: 98,
    originalCost: 195400.3,
    revisedCost: 209800.75,
    expenditure: 132100.5,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 7.37,
    topSectors: ["River Interlinking", "Solar Parks", "Railways", "National Highways"],
  },
  rj: {
    id: "rj",
    stateName: "Rajasthan",
    projectCount: 88,
    originalCost: 182300.5,
    revisedCost: 194600.2,
    expenditure: 118400.3,
    completedThisMonth: 1,
    newlyAdded: 0,
    capitalCostOverrunPct: 6.75,
    topSectors: ["Ultra Mega Solar", "Green Hydrogen", "Freight Corridor", "Road Connectivity"],
  },
  wb: {
    id: "wb",
    stateName: "West Bengal",
    projectCount: 82,
    originalCost: 174200.0,
    revisedCost: 191300.6,
    expenditure: 110250.8,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 9.82,
    topSectors: ["Kolkata Metro Expansion", "Inland Waterways (NW-1)", "Thermal Power", "Railways"],
  },
  br: {
    id: "br",
    stateName: "Bihar",
    projectCount: 76,
    originalCost: 165800.2,
    revisedCost: 182900.4,
    expenditure: 98400.7,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 10.31,
    topSectors: ["Bridge & Road Connectivity", "Electrification", "Fertilizer Plants", "Petroleum Pipelines"],
  },
  ap: {
    id: "ap",
    stateName: "Andhra Pradesh",
    projectCount: 72,
    originalCost: 154300.1,
    revisedCost: 168200.5,
    expenditure: 95100.2,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 9.01,
    topSectors: ["Polavaram Irrigation", "Visakhapatnam Port", "Industrial Corridors", "Petroleum Refineries"],
  },
  or: {
    id: "or",
    stateName: "Odisha",
    projectCount: 68,
    originalCost: 142100.0,
    revisedCost: 153400.0,
    expenditure: 89600.0,
    completedThisMonth: 1,
    newlyAdded: 0,
    capitalCostOverrunPct: 7.95,
    topSectors: ["Steel & Mining Infrastructure", "Rail Freight Evacuation", "Paradeep Port Expansion"],
  },
  tg: {
    id: "tg",
    stateName: "Telangana",
    projectCount: 58,
    originalCost: 128900.0,
    revisedCost: 139200.0,
    expenditure: 81200.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 7.99,
    topSectors: ["Regional Ring Road", "Pharma City Hubs", "Rail Terminals", "Thermal Power"],
  },
  jh: {
    id: "jh",
    stateName: "Jharkhand",
    projectCount: 52,
    originalCost: 104500.0,
    revisedCost: 114200.0,
    expenditure: 68900.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 9.28,
    topSectors: ["Coal Evacuation Lines", "Steel Plant Modernization", "Highways"],
  },
  ct: {
    id: "ct",
    stateName: "Chhattisgarh",
    projectCount: 48,
    originalCost: 96800.0,
    revisedCost: 104500.0,
    expenditure: 62400.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 7.95,
    topSectors: ["Railway Freight Corridors", "Power Generation", "Mining Infrastructure"],
  },
  kl: {
    id: "kl",
    stateName: "Kerala",
    projectCount: 46,
    originalCost: 92400.5,
    revisedCost: 98100.2,
    expenditure: 59300.4,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 6.17,
    topSectors: ["Vizhinjam Transshipment Port", "National Highway 66 Expansion", "Kochi Metro"],
  },
  as: {
    id: "as",
    stateName: "Assam",
    projectCount: 42,
    originalCost: 84200.0,
    revisedCost: 91500.0,
    expenditure: 51200.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 8.67,
    topSectors: ["Brahmaputra Bridge Projects", "Numaligarh Refinery Expansion", "Northeast Gas Grid"],
  },
  pb: {
    id: "pb",
    stateName: "Punjab",
    projectCount: 38,
    originalCost: 71200.0,
    revisedCost: 76500.0,
    expenditure: 44800.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 7.44,
    topSectors: ["Delhi-Amritsar-Katra Expressway", "Border Logistics", "Rail Connectivity"],
  },
  hr: {
    id: "hr",
    stateName: "Haryana",
    projectCount: 36,
    originalCost: 68900.0,
    revisedCost: 73400.0,
    expenditure: 43100.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 6.53,
    topSectors: ["Orbital Rail Corridor", "Expressways & Flyovers", "Multi-Modal Logistics Parks"],
  },
  jk: {
    id: "jk",
    stateName: "Jammu and Kashmir",
    projectCount: 34,
    originalCost: 78500.0,
    revisedCost: 89400.0,
    expenditure: 46800.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 13.89,
    topSectors: ["Udhampur-Srinagar-Baramulla Rail Link (USBRL)", "Zojila Tunnel", "Hydroelectric Projects"],
  },
  dl: {
    id: "dl",
    stateName: "Delhi",
    projectCount: 32,
    originalCost: 62400.0,
    revisedCost: 67100.0,
    expenditure: 39500.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 7.53,
    topSectors: ["Delhi Metro Phase IV", "Regional Rapid Transit System (RRTS)", "Urban Ext. Road-II"],
  },
  ut: {
    id: "ut",
    stateName: "Uttarakhand",
    projectCount: 28,
    originalCost: 54600.0,
    revisedCost: 61200.0,
    expenditure: 34200.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 12.09,
    topSectors: ["Rishikesh-Karnaprayag Rail Link", "Char Dham Highway", "Tehri Hydro Complex"],
  },
  hp: {
    id: "hp",
    stateName: "Himachal Pradesh",
    projectCount: 22,
    originalCost: 42800.0,
    revisedCost: 48500.0,
    expenditure: 27900.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 13.32,
    topSectors: ["Bhanupali-Bilaspur Rail Link", "Hydro Power Projects", "Strategic Tunnels"],
  },
  ar: {
    id: "ar",
    stateName: "Arunachal Pradesh",
    projectCount: 16,
    originalCost: 28900.0,
    revisedCost: 32400.0,
    expenditure: 17800.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 12.11,
    topSectors: ["Frontier Highway", "Subansiri Lower Hydroelectric", "Border Border Roads"],
  },
  tr: {
    id: "tr",
    stateName: "Tripura",
    projectCount: 14,
    originalCost: 16800.0,
    revisedCost: 18200.0,
    expenditure: 10400.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 8.33,
    topSectors: ["Agartala-Akhaura Rail Link", "National Highways", "Border Haats Infrastructure"],
  },
  ga: {
    id: "ga",
    stateName: "Goa",
    projectCount: 12,
    originalCost: 18400.0,
    revisedCost: 19800.0,
    expenditure: 12400.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 7.61,
    topSectors: ["Zuari Bridge Corridor", "Mormugao Port Modernization", "Konkan Railway Doubling"],
  },
  ml: {
    id: "ml",
    stateName: "Meghalaya",
    projectCount: 11,
    originalCost: 14200.0,
    revisedCost: 15600.0,
    expenditure: 8900.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 9.86,
    topSectors: ["Tetelia-Byrnihat Rail Project", "Shillong Bypass", "Regional Airport Link"],
  },
  mn: {
    id: "mn",
    stateName: "Manipur",
    projectCount: 10,
    originalCost: 13500.0,
    revisedCost: 14800.0,
    expenditure: 7800.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 9.63,
    topSectors: ["Jiribam-Imphal Rail Link", "Asian Highway-1 (Imphal-Moreh)", "Power Transmission"],
  },
  nl: {
    id: "nl",
    stateName: "Nagaland",
    projectCount: 9,
    originalCost: 11800.0,
    revisedCost: 12900.0,
    expenditure: 6700.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 9.32,
    topSectors: ["Dimapur-Zubza Rail Link", "Trans-Nagaland Highway", "Power Grid Enhancement"],
  },
  mz: {
    id: "mz",
    stateName: "Mizoram",
    projectCount: 8,
    originalCost: 9400.0,
    revisedCost: 10200.0,
    expenditure: 5600.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 8.51,
    topSectors: ["Bairabi-Sairang Rail Project", "Kaladan Multi-Modal Transit Transport", "National Highways"],
  },
  sk: {
    id: "sk",
    stateName: "Sikkim",
    projectCount: 7,
    originalCost: 8900.0,
    revisedCost: 9600.0,
    expenditure: 5100.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 7.87,
    topSectors: ["Sivok-Rangpo Rail Link", "NH-10 Alternate Connectivity", "Teesta Hydroelectric"],
  },
  ch: {
    id: "ch",
    stateName: "Chandigarh",
    projectCount: 6,
    originalCost: 5900.0,
    revisedCost: 6200.0,
    expenditure: 3900.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 5.08,
    topSectors: ["Railway Station World-Class Redevelopment", "Smart Mobility Corridor"],
  },
  an: {
    id: "an",
    stateName: "Andaman and Nicobar Islands",
    projectCount: 6,
    originalCost: 9200.0,
    revisedCost: 9800.0,
    expenditure: 5400.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 6.52,
    topSectors: ["Great Nicobar International Transshipment Port", "Submarine Optical Fibre", "Airport Upgrade"],
  },
  py: {
    id: "py",
    stateName: "Puducherry",
    projectCount: 5,
    originalCost: 4800.0,
    revisedCost: 5100.0,
    expenditure: 3200.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 6.25,
    topSectors: ["Coastal Port Development", "Road Over Bridges", "Urban Water Mission"],
  },
  dn: {
    id: "dn",
    stateName: "Dadra and Nagar Haveli",
    projectCount: 4,
    originalCost: 3400.0,
    revisedCost: 3600.0,
    expenditure: 2100.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 5.88,
    topSectors: ["Highway Connectivity", "Power Distribution Grid Modernization"],
  },
  dd: {
    id: "dd",
    stateName: "Daman and Diu",
    projectCount: 3,
    originalCost: 2800.0,
    revisedCost: 2950.0,
    expenditure: 1800.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 5.36,
    topSectors: ["Coastal Road Marine Promenade", "Sub-station Expansion"],
  },
  ld: {
    id: "ld",
    stateName: "Lakshadweep",
    projectCount: 2,
    originalCost: 1600.0,
    revisedCost: 1720.0,
    expenditure: 950.0,
    completedThisMonth: 0,
    newlyAdded: 0,
    capitalCostOverrunPct: 7.5,
    topSectors: ["Submarine Optical Fibre Connectivity", "Desalination & Solar Microgrids"],
  },
};

/**
 * Format Indian currency with rupee symbol and two decimals, e.g. "₹ 268,554.15"
 */
export function formatIndianCurrency(val: number): string {
  // Format with standard Indian locale or standard comma separation
  const parts = val.toFixed(2).split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian numbering regex: last 3 digits, then groups of 2 digits
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedInt =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return `₹ ${formattedInt}.${decimalPart}`;
}

/**
 * Calculate choropleth color scale interpolation:
 * 0 -> #FEF9C3 (light cream/yellow: 254, 249, 195)
 * 45 -> #FDBA74 (light orange: 253, 186, 116)
 * 90 -> #F87171 (coral/light red: 248, 113, 113)
 * 135 -> #EF4444 (red: 239, 68, 68)
 * 180+ -> #991B1B (deep crimson: 153, 27, 27)
 */
interface ColorStop {
  val: number;
  r: number;
  g: number;
  b: number;
}

const COLOR_STOPS: ColorStop[] = [
  { val: 0, r: 254, g: 249, b: 195 }, // #FEF9C3
  { val: 45, r: 253, g: 186, b: 116 }, // #FDBA74
  { val: 90, r: 248, g: 113, b: 113 }, // #F87171
  { val: 135, r: 239, g: 68, b: 68 }, // #EF4444
  { val: 180, r: 153, g: 27, b: 27 }, // #991B1B
];

export function getChoroplethColor(count: number): string {
  if (count <= 0) return "#FEF9C3";
  if (count >= 180) return "#991B1B";

  // Find surrounding stops
  let lower = COLOR_STOPS[0];
  let upper = COLOR_STOPS[COLOR_STOPS.length - 1];

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (count >= COLOR_STOPS[i].val && count <= COLOR_STOPS[i + 1].val) {
      lower = COLOR_STOPS[i];
      upper = COLOR_STOPS[i + 1];
      break;
    }
  }

  const range = upper.val - lower.val;
  const factor = range === 0 ? 0 : (count - lower.val) / range;

  const r = Math.round(lower.r + factor * (upper.r - lower.r));
  const g = Math.round(lower.g + factor * (upper.g - lower.g));
  const b = Math.round(lower.b + factor * (upper.b - lower.b));

  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}
