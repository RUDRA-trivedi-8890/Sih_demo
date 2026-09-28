import { Project, ShapDriver, RiskBand, MonthlyRecord } from "./mockData";

export interface PredictionResult {
  predictedCostOverrunPct: number;
  predictedDelayMonths: number;
  riskScore: number;
  riskBand: RiskBand;
  shapDrivers: ShapDriver[];
  costCi: [number, number];
  delayCi: [number, number];
  explanationSummary: string;
}

export function predictCostOverrun(p: {
  sanctionedCostCr: number;
  spentCr: number;
  physicalProgressPct: number;
  sector: string;
  state: string;
}): number {
  const spendRatio = p.spentCr / Math.max(p.sanctionedCostCr, 1);
  const progressRatio = p.physicalProgressPct / 100;
  
  // Assume time ratio baseline estimated from physical progress vs expected pace
  const timeRatio = Math.min(Math.max(progressRatio + 0.12, 0.4), 0.9);

  let overrun = 0;

  // Rule 1: Spent more than progress -> cost risk
  if (spendRatio > progressRatio) {
    overrun += (spendRatio - progressRatio) * 40;
  }

  // Rule 2: Spending faster than time
  if (spendRatio > timeRatio) {
    overrun += (spendRatio - timeRatio) * 25;
  }

  // Rule 3: Sector multiplier
  const sectorMultipliers: Record<string, number> = {
    Roadways: 1.20,
    Railways: 1.25,
    "Urban Transit": 1.30,
    Power: 1.10,
    Water: 1.15,
    "Renewable Energy": 0.80,
    Aviation: 1.05,
    Ports: 1.22,
    "Urban Infra": 1.15,
  };
  const multiplier = sectorMultipliers[p.sector] || 1.0;
  overrun *= multiplier;

  // Rule 4: Monsoon states get bonus risk
  const monsoonStates = ["Kerala", "West Bengal", "Odisha", "Bihar", "Assam"];
  if (monsoonStates.includes(p.state)) {
    overrun += 3;
  }

  // Cap at 35%
  return +Math.min(Math.max(overrun, 1.5), 35).toFixed(1);
}

export function predictDelayMonths(p: {
  physicalProgressPct: number;
  milestonesCompleted?: number;
  milestonesTotal?: number;
  landAcquisitionLag?: boolean;
  revisedDeadline?: string;
}): number {
  const shortfall = 100 - p.physicalProgressPct;
  const totalMonths = 36; // nominal project timeline
  const monthsElapsed = Math.max(Math.round((p.physicalProgressPct / 100) * totalMonths), 6);
  const timeLeft = Math.max(totalMonths - monthsElapsed, 4);

  const requiredRate = shortfall / Math.max(timeLeft, 1);
  const currentRate = Math.max(p.physicalProgressPct / monthsElapsed, 0.5);

  let delay = 0;
  if (currentRate < requiredRate) {
    delay = (requiredRate - currentRate) * timeLeft * 0.6;
  }

  const milestonesTotal = p.milestonesTotal ?? 10;
  const milestonesCompleted = p.milestonesCompleted ?? Math.round((p.physicalProgressPct / 100) * milestonesTotal);
  const milestonesMissed = Math.max(milestonesTotal - milestonesCompleted - 1, 0);

  if (milestonesMissed > 0) {
    delay += milestonesMissed * 1.5;
  }

  if (p.landAcquisitionLag) {
    delay += 2.5;
  }

  // Cap at 18 months
  return +Math.min(Math.max(delay, 0.5), 18).toFixed(1);
}

export function computeRiskScore(costOverrun: number, delayMonths: number): number {
  const costComponent = Math.min(costOverrun * 2.5, 55);
  const delayComponent = Math.min(delayMonths * 4, 45);
  return Math.round(Math.min(Math.max(costComponent + delayComponent, 5), 98));
}

export function computeRiskBand(score: number): RiskBand {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export function generateShapDrivers(
  p: {
    sanctionedCostCr: number;
    spentCr: number;
    physicalProgressPct: number;
    state: string;
    milestonesCompleted?: number;
    milestonesTotal?: number;
    landAcquisitionLag?: boolean;
  },
  costOverrun: number,
  delay: number
): ShapDriver[] {
  const spendRatio = p.spentCr / Math.max(p.sanctionedCostCr, 1);
  const progressRatio = p.physicalProgressPct / 100;

  const milestonesTotal = p.milestonesTotal ?? 10;
  const milestonesCompleted = p.milestonesCompleted ?? Math.round(progressRatio * milestonesTotal);

  const monsoonStates = ["Kerala", "West Bengal", "Odisha", "Bihar", "Assam"];
  const isMonsoon = monsoonStates.includes(p.state);

  const drivers: ShapDriver[] = [
    {
      feature: "Expenditure Ratio",
      impact: +((spendRatio - progressRatio) * 60).toFixed(1),
    },
    {
      feature: "Progress Shortfall",
      impact: +((100 - p.physicalProgressPct) * 0.25).toFixed(1),
    },
    {
      feature: "Schedule Slippage",
      impact: +(delay * 1.9).toFixed(1),
    },
    {
      feature: "Milestone Compliance",
      impact: -(milestonesCompleted * 1.5),
    },
    {
      feature: "Progress Rate",
      impact: -(progressRatio * 12),
    },
    {
      feature: "Monsoon Anomaly",
      impact: isMonsoon ? 6.2 : 1.4,
    },
    {
      feature: "Cement Price Spike",
      impact: +(3.5 + (p.physicalProgressPct % 5) * 0.4).toFixed(1),
    },
    {
      feature: "Land Acquisition Lag",
      impact: p.landAcquisitionLag ? 7.1 : 1.2,
    },
  ];

  return drivers.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
}

export function generateMonthlyRecords(physicalPct: number, financialPct: number, overrunPct: number): MonthlyRecord[] {
  const MONTHS = [
    "Apr 24", "May 24", "Jun 24", "Jul 24", "Aug 24", "Sep 24",
    "Oct 24", "Nov 24", "Dec 24", "Jan 25", "Feb 25", "Mar 25",
    "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25", "Sep 25",
  ];

  return MONTHS.map((month, i) => {
    const t = i / (MONTHS.length - 1);
    const p = +(physicalPct * t).toFixed(1);
    const e = +(financialPct * t + (overrunPct * 0.3) * t * t).toFixed(1);
    return { month, progressPct: p, expenditurePct: Math.min(e, 100) };
  });
}

export function runFullPrediction(p: {
  sanctionedCostCr: number;
  spentCr: number;
  physicalProgressPct: number;
  sector: string;
  state: string;
  milestonesCompleted?: number;
  milestonesTotal?: number;
  landAcquisitionLag?: boolean;
}): PredictionResult {
  const costOverrun = predictCostOverrun(p);
  const delayMonths = predictDelayMonths(p);
  const riskScore = computeRiskScore(costOverrun, delayMonths);
  const band = computeRiskBand(riskScore);
  const shapDrivers = generateShapDrivers(p, costOverrun, delayMonths);

  const financialPct = Math.min(Math.round((p.spentCr / Math.max(p.sanctionedCostCr, 1)) * 100), 100);
  const divergence = (financialPct - p.physicalProgressPct).toFixed(1);

  const topDriver = shapDrivers[0]?.feature || "Expenditure Ratio";

  const costCi: [number, number] = [
    +(costOverrun * 0.7).toFixed(1),
    +(costOverrun * 1.3).toFixed(1),
  ];
  const delayCi: [number, number] = [
    +(delayMonths * 0.75).toFixed(1),
    +(delayMonths * 1.25).toFixed(1),
  ];

  const explanationSummary = `This project is flagged ${band.toUpperCase()} RISK (Score: ${riskScore}/100) primarily due to a ${divergence}% expenditure-progress divergence and a top driver of '${topDriver}' (impact: +${shapDrivers[0]?.impact}). Predicted cost overrun is ${costOverrun}% [CI: ${costCi[0]}–${costCi[1]}%] with a ${delayMonths} month delay [CI: ${delayCi[0]}–${delayCi[1]} mo].`;

  return {
    predictedCostOverrunPct: costOverrun,
    predictedDelayMonths: delayMonths,
    riskScore,
    riskBand: band,
    shapDrivers,
    costCi,
    delayCi,
    explanationSummary,
  };
}
