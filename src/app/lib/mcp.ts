import { Project, ShapDriver } from "./mockData";

export interface McpToolCall {
  tool: string;
  result: string;
}

export interface McpAnalysis {
  toolsExecuted: McpToolCall[];
  recommendedActions: string[];
  llmReasoning: string[];
}

export function generateMcpAnalysis(
  p: {
    name: string;
    state: string;
    sanctionedCostCr: number;
    spentCr: number;
    physicalProgressPct: number;
    milestonesCompleted?: number;
    milestonesTotal?: number;
    landAcquisitionLag?: boolean;
  },
  drivers: ShapDriver[],
  costOverrunPct: number,
  delayMonths: number
): McpAnalysis {
  const spendRatio = p.spentCr / Math.max(p.sanctionedCostCr, 1);
  const milestonesTotal = p.milestonesTotal ?? 10;
  const milestonesCompleted = p.milestonesCompleted ?? Math.round((p.physicalProgressPct / 100) * milestonesTotal);
  const milestonesMissed = Math.max(milestonesTotal - milestonesCompleted - 1, 0);

  const monsoonDriver = drivers.find((d) => d.feature === "Monsoon Anomaly");
  const landDriver = drivers.find((d) => d.feature === "Land Acquisition Lag");
  const topDriver = drivers[0]?.feature || "Expenditure Ratio";

  // Tool selection rules
  const toolsExecuted: McpToolCall[] = [
    {
      tool: "get_project_exposure",
      result: `Identified 3 critical path milestones sensitive to delay in ${p.state}`,
    },
  ];

  if ((monsoonDriver && monsoonDriver.impact > 5) || ["Kerala", "West Bengal", "Odisha", "Bihar"].includes(p.state)) {
    toolsExecuted.push({
      tool: "get_weather_forecast",
      result: `IMD alert: High rainfall probability in ${p.state} over next 45 days`,
    });
  }

  if (spendRatio > 0.70 || costOverrunPct > 12) {
    toolsExecuted.push({
      tool: "get_alternate_vendor",
      result: `Found 2 pre-qualified Tier-1 suppliers available with +2.8% price hedge`,
    });
  }

  if (milestonesMissed > 1 || delayMonths > 6 || p.landAcquisitionLag) {
    toolsExecuted.push({
      tool: "get_mitigation_playbook",
      result: `Activated Protocol #4: Milestone Re-baselining & Expedited Escrow Review`,
    });
  }

  // Action generation rules
  const actions: string[] = [];

  if (costOverrunPct > 10) {
    actions.push(`Cost overrun +${costOverrunPct}% predicted — review budget re-appropriation with ministry finance division.`);
  }

  if (delayMonths > 6) {
    actions.push(`Request ${Math.round(delayMonths)}-month formal schedule extension from sanctioning authority.`);
  }

  if (topDriver === "Expenditure Ratio") {
    actions.push("Audit expenditure vs physical progress — severe financial divergence detected between billing & site execution.");
  }

  if (monsoonDriver && monsoonDriver.impact > 5) {
    actions.push("Shift site teams to indoor/foundation work; pre-position critical cement & steel before heavy monsoon window.");
  }

  if (landDriver && landDriver.impact > 5) {
    actions.push("Escalate land acquisition & right-of-way clears to District Collector for rapid review.");
  }

  if (milestonesMissed > 1) {
    actions.push("Re-baseline milestone schedule with project nodal officer and enforce SLA liquid penalties.");
  }

  if (actions.length < 3) {
    actions.push("Increase on-site drone survey verification frequency to weekly.");
    actions.push("Enforce strict escrow release tied directly to physical milestone sign-off.");
  }

  const llmReasoning = [
    `Analyzing project context for "${p.name}" (${p.state})...`,
    `Evaluating SHAP risk drivers: Top driver is '${topDriver}' (impact: +${drivers[0]?.impact})...`,
    `Calling MCP tools [${toolsExecuted.map((t) => t.tool).join(", ")}]...`,
    `Cross-referencing ministry expenditure databases & regional monsoon signals...`,
    `Generating prescriptive 4-step governance intervention plan...`,
  ];

  return {
    toolsExecuted,
    recommendedActions: actions,
    llmReasoning,
  };
}
