import { PlanBase } from './plan-base';
import { PlanSummary } from './plan-summary';

export interface PlanProperties extends PlanBase {
  startTime: Date;
  endTime: Date;
  contentEnd: Date;
  durationMins: number;
}

export function createPlanPropertiesFromPlanSummary(summary: PlanSummary): PlanProperties {
  const { dateTime, ...base } = summary;
  return {
    ...base,
    startTime: dateTime,
    endTime: dateTime,
    contentEnd: dateTime,
    durationMins: 0,
  };
}
