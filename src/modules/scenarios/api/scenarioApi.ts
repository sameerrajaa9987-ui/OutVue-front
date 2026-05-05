import { http } from "@/shared/api/http";

export type Adjustment = {
  channel: string;
  changePercent: number;
};

export type ChannelDetail = {
  channel: string;
  changePercent: number;
  currentSpend: number;
  projectedSpend: number;
  currentLeads: number;
  projectedLeads: number;
  note?: string;
};

export type ScenarioResult = {
  currentSpend: number;
  projectedSpend: number;
  currentLeads: number;
  projectedLeads: number;
  currentCPL: number;
  projectedCPL: number;
  currentROI: number;
  projectedROI: number;
  currentRevenue: number;
  projectedRevenue: number;
  channelDetails: ChannelDetail[];
  summary: string;
};

export async function runScenario(adjustments: Adjustment[]) {
  const res = await http.post<{ data: ScenarioResult }>("/scenarios/model", { adjustments });
  return res.data.data;
}
