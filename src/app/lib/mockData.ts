export type RiskBand = "Low" | "Medium" | "High";

export interface ShapDriver {
  feature: string;
  impact: number; // positive = increases risk, negative = decreases
}

export interface MonthlyRecord {
  month: string;
  progressPct: number;
  expenditurePct: number;
}

export interface Project {
  id: string;
  name: string;
  ministry: string;
  sector: string;
  state: string;
  sanctionedCostCr: number;
  spentCr: number;
  physicalProgressPct: number;
  financialProgressPct: number;
  originalDeadline: string;
  revisedDeadline: string;
  predictedCostOverrunPct: number;
  predictedDelayMonths: number;
  riskScore: number;
  riskBand: RiskBand;
  shapDrivers: ShapDriver[];
  monthlyRecords: MonthlyRecord[];
}

const MONTHS = [
  "Apr 24", "May 24", "Jun 24", "Jul 24", "Aug 24", "Sep 24",
  "Oct 24", "Nov 24", "Dec 24", "Jan 25", "Feb 25", "Mar 25",
  "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25", "Sep 25",
];

function makeMonthly(progressEnd: number, expendEnd: number, divergence: number): MonthlyRecord[] {
  return MONTHS.map((month, i) => {
    const t = i / (MONTHS.length - 1);
    const p = +(progressEnd * t).toFixed(1);
    const e = +(expendEnd * t + divergence * t * t).toFixed(1);
    return { month, progressPct: p, expenditurePct: Math.min(e, 100) };
  });
}

function band(score: number): RiskBand {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function makeProject(
  id: string,
  name: string,
  ministry: string,
  sector: string,
  state: string,
  sanctionedCostCr: number,
  riskScore: number,
  overrunPct: number,
  delayMonths: number,
  physicalPct: number,
  financialPct: number
): Project {
  const progressRatio = physicalPct / 100;
  const spendRatio = financialPct / 100;
  const spentCr = +(sanctionedCostCr * spendRatio).toFixed(1);

  const baseDrivers: ShapDriver[] = [
    { feature: "Expenditure Ratio", impact: +(overrunPct * 0.9).toFixed(1) },
    { feature: "Progress Shortfall", impact: +((100 - physicalPct) * 0.3).toFixed(1) },
    { feature: "Schedule Slippage", impact: +(delayMonths * 1.8).toFixed(1) },
    { feature: "Progress Rate", impact: -(progressRatio * 8).toFixed(1) },
    { feature: "Milestone Compliance", impact: -(spendRatio * 4).toFixed(1) },
    { feature: "Monsoon Anomaly", impact: +(Math.random() * 8 + 3).toFixed(1) },
    { feature: "Cement Price Spike", impact: +(Math.random() * 5 + 1).toFixed(1) },
    { feature: "Land Acquisition Lag", impact: +(Math.random() * 6).toFixed(1) },
  ];

  return {
    id,
    name,
    ministry,
    sector,
    state,
    sanctionedCostCr,
    spentCr,
    physicalProgressPct: physicalPct,
    financialProgressPct: financialPct,
    originalDeadline: "31 Mar 2026",
    revisedDeadline: `30 ${["Jun", "Sep", "Dec"][Math.floor(Math.random() * 3)]} ${2026 + Math.floor(delayMonths / 12)}`,
    predictedCostOverrunPct: overrunPct,
    predictedDelayMonths: delayMonths,
    riskScore,
    riskBand: band(riskScore),
    shapDrivers: baseDrivers,
    monthlyRecords: makeMonthly(physicalPct, financialPct, overrunPct * 0.5),
  };
}

export const PROJECTS: Project[] = [
  makeProject("SIH-PRJ-001", "NH-44 Widening (4-lane)", "MoRTH", "Roadways", "Bihar", 4820, 89, 22.4, 11.5, 38, 62),
  makeProject("SIH-PRJ-002", "Metro Phase III Extension", "MoHUA", "Urban Transit", "Maharashtra", 12500, 76, 14.2, 8.4, 52, 61),
  makeProject("SIH-PRJ-003", "Eastern DFC Corridor", "Ministry of Railways", "Railways", "Uttar Pradesh", 15600, 82, 17.8, 12.1, 44, 63),
  makeProject("SIH-PRJ-004", "Smart City Command Center", "MoHUA", "Urban Infra", "Gujarat", 890, 34, 5.2, 2.1, 72, 68),
  makeProject("SIH-PRJ-005", "Solar Park Phase II", "MNRE", "Renewable Energy", "Rajasthan", 3200, 41, 6.8, 3.4, 66, 71),
  makeProject("SIH-PRJ-006", "Coastal Highway Bridge", "MoRTH", "Roadways", "Kerala", 2100, 68, 12.1, 7.2, 55, 68),
  makeProject("SIH-PRJ-007", "Metro Depot Construction", "MoHUA", "Urban Transit", "Karnataka", 3400, 58, 9.4, 5.8, 61, 66),
  makeProject("SIH-PRJ-008", "Rural Electrification IV", "Ministry of Power", "Power", "Madhya Pradesh", 1780, 45, 7.2, 4.1, 64, 70),
  makeProject("SIH-PRJ-009", "Water Supply Augmentation", "Jal Shakti", "Water", "Tamil Nadu", 2650, 72, 13.6, 7.9, 51, 65),
  makeProject("SIH-PRJ-010", "Airport Terminal Expansion", "MoCA", "Aviation", "Telangana", 5400, 39, 5.8, 2.8, 74, 70),
  makeProject("SIH-PRJ-011", "Freight Corridor Phase II", "Ministry of Railways", "Railways", "Punjab", 8900, 61, 10.5, 6.4, 58, 64),
  makeProject("SIH-PRJ-012", "Greenfield Port Terminal", "Ministry of Shipping", "Ports", "Andhra Pradesh", 7200, 84, 18.6, 10.4, 42, 62),
  makeProject("SIH-PRJ-013", "Highway Bypass (6-lane)", "MoRTH", "Roadways", "Rajasthan", 3900, 55, 9.1, 5.2, 60, 66),
  makeProject("SIH-PRJ-014", "Nuclear Power Unit V", "DAE", "Power", "Karnataka", 22000, 47, 8.4, 5.6, 62, 68),
  makeProject("SIH-PRJ-015", "Rail Over Bridge (ROB)", "Ministry of Railways", "Railways", "West Bengal", 620, 79, 16.2, 9.1, 48, 63),
  makeProject("SIH-PRJ-016", "Smart Water Metering", "Jal Shakti", "Water", "Maharashtra", 1180, 31, 4.6, 1.9, 78, 73),
  makeProject("SIH-PRJ-017", "Border Fencing Project", "MHA", "Defence", "Punjab", 2400, 66, 11.8, 7.1, 54, 65),
  makeProject("SIH-PRJ-018", "Metro Line-5 Extension", "MoHUA", "Urban Transit", "Tamil Nadu", 9800, 74, 13.9, 8.2, 50, 63),
  makeProject("SIH-PRJ-019", "Expressway Access Road", "MoRTH", "Roadways", "Haryana", 1450, 51, 8.2, 4.6, 62, 68),
  makeProject("SIH-PRJ-020", "Gas Pipeline Network", "MoPNG", "Oil & Gas", "Gujarat", 4100, 44, 7.1, 3.9, 66, 69),
  makeProject("SIH-PRJ-021", "Rural Road Connectivity", "MoRD", "Roadways", "Odisha", 320, 36, 5.4, 2.4, 71, 69),
  makeProject("SIH-PRJ-022", "Flyover at Junction", "MoHUA", "Urban Infra", "Delhi", 780, 57, 9.6, 5.5, 60, 65),
  makeProject("SIH-PRJ-023", "Dedicated Freight Terminal", "Ministry of Railways", "Railways", "Jharkhand", 3600, 78, 15.4, 9.6, 46, 62),
  makeProject("SIH-PRJ-024", "Wind Farm Phase III", "MNRE", "Renewable Energy", "Tamil Nadu", 2800, 42, 6.5, 3.1, 68, 71),
  makeProject("SIH-PRJ-025", "Coastal Erosion Control", "MoEFCC", "Environment", "Kerala", 980, 63, 10.9, 6.2, 56, 66),
  makeProject("SIH-PRJ-026", "Urban Sewerage Network", "MoHUA", "Water", "Uttar Pradesh", 1650, 48, 7.8, 4.4, 63, 68),
  makeProject("SIH-PRJ-027", "Tunnel Boring Project", "MoRTH", "Roadways", "Himachal Pradesh", 5600, 81, 17.2, 10.8, 44, 62),
  makeProject("SIH-PRJ-028", "Smart Grid Upgrade", "Ministry of Power", "Power", "Gujarat", 2200, 37, 5.6, 2.6, 70, 72),
  makeProject("SIH-PRJ-029", "Logistics Park", "Ministry of Commerce", "Logistics", "Haryana", 1900, 53, 8.9, 4.8, 62, 67),
  makeProject("SIH-PRJ-030", "Drinking Water Pipeline", "Jal Shakti", "Water", "Madhya Pradesh", 1280, 59, 10.1, 5.7, 59, 65),
  makeProject("SIH-PRJ-031", "Airport Runway Upgrade", "MoCA", "Aviation", "Kerala", 3400, 46, 7.4, 4.0, 64, 68),
  makeProject("SIH-PRJ-032", "Inland Waterway Terminal", "Ministry of Shipping", "Ports", "West Bengal", 1580, 69, 12.4, 7.4, 53, 64),
  makeProject("SIH-PRJ-033", "Smart Traffic Management", "MoHUA", "Urban Infra", "Karnataka", 640, 33, 4.8, 2.0, 76, 72),
  makeProject("SIH-PRJ-034", "Highway Toll Plaza", "MoRTH", "Roadways", "Andhra Pradesh", 420, 38, 5.7, 2.5, 70, 70),
  makeProject("SIH-PRJ-035", "Solar Rooftop Mission", "MNRE", "Renewable Energy", "Maharashtra", 880, 29, 4.2, 1.7, 80, 74),
  makeProject("SIH-PRJ-036", "Metro Station Upgrade", "MoHUA", "Urban Transit", "Delhi", 1240, 71, 13.2, 7.8, 52, 64),
  makeProject("SIH-PRJ-037", "Bridges on NH-16", "MoRTH", "Roadways", "Odisha", 890, 64, 11.2, 6.6, 56, 65),
  makeProject("SIH-PRJ-038", "Coal Handling Plant", "Ministry of Coal", "Power", "Chhattisgarh", 2400, 56, 9.3, 5.0, 60, 66),
  makeProject("SIH-PRJ-039", "Rural Solar Mini-Grid", "MNRE", "Renewable Energy", "Bihar", 320, 43, 6.7, 3.2, 67, 70),
  makeProject("SIH-PRJ-040", "Urban Metro Phase IV", "MoHUA", "Urban Transit", "Maharashtra", 18500, 77, 15.1, 9.2, 47, 63),
];

export const ALERTS_POOL = [
  { level: "high", text: "NH-44 Widening (MoRTH, Bihar): 89% probability of 11-month delay. Drivers: land acquisition lag, monsoon anomaly." },
  { level: "high", text: "Greenfield Port Terminal (Shipping, AP): cost overrun risk 18.6% — 3 critical milestones missed." },
  { level: "medium", text: "Metro Phase III (MoHUA, Maharashtra): 14.2% cost overrun predicted. Cement +6.2% impact." },
  { level: "high", text: "Eastern DFC (Railways, UP): 17.8% cost overrun predicted. Vendor concentration risk flagged." },
  { level: "medium", text: "Coastal Highway Bridge (MoRTH, Kerala): monsoon exposure — 7.2 mo delay predicted." },
  { level: "low", text: "Solar Park Phase II (MNRE, Rajasthan): on-track. Minor cement price sensitivity noted." },
  { level: "high", text: "Tunnel Boring (MoRTH, HP): 17.2% overrun risk. Geological delays observed." },
  { level: "medium", text: "Freight Corridor Phase II (Railways, Punjab): 10.5% overrun, 6.4 mo delay risk." },
  { level: "low", text: "Smart City Command Center (MoHUA, Gujarat): 34 risk score — healthy progress." },
  { level: "high", text: "Dedicated Freight Terminal (Railways, Jharkhand): 15.4% cost overrun predicted." },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export const PIPELINE_STEPS = [
  { icon: "📥", title: "PAIMANA / Project Data", sub: "API / Raw CSV" },
  { icon: "🗄️", title: "Ingestion & Validation", sub: "Schema + quality checks" },
  { icon: "🧹", title: "Data Cleaning", sub: "Master Dataset" },
  { icon: "⚙️", title: "Feature Engineering", sub: "CUF + variables" },
  { icon: "📐", title: "Statistical Baseline", sub: "OLS / ARIMA" },
  { icon: "🤖", title: "ML Models", sub: "Cost + Time" },
  { icon: "🎲", title: "Risk Scoring Engine", sub: "0 – 100" },
  { icon: "🔍", title: "SHAP Explainability", sub: "Attribution Logic" },
  { icon: "📊", title: "Dashboard & Alerts", sub: "Web + Mobile" },
];