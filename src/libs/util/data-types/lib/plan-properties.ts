import { PlanBase } from './plan-base';

export interface PlanProperties extends PlanBase {
  startTime: Date;
  endTime: Date;
  contentEnd: Date;
  durationMins: number;
}
