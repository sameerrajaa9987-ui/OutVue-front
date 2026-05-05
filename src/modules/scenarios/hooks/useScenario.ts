import { useMutation } from "@tanstack/react-query";
import * as scenarioApi from "../api/scenarioApi";
import type { Adjustment } from "../api/scenarioApi";

export function useRunScenario() {
  return useMutation({
    mutationFn: (adjustments: Adjustment[]) =>
      scenarioApi.runScenario(adjustments),
  });
}
