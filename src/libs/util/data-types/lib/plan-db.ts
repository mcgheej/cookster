import { Timestamp } from '@angular/fire/firestore';
import { PlanBase } from './plan-base';
import { PlanProperties } from './plan-properties';

export interface PlanDB extends PlanBase {
  date: Timestamp;
}

export function createPlanDbUpdates(planProperties: Partial<PlanProperties>): Partial<Omit<PlanDB, 'id'>> {
  const updates = {} as Partial<Omit<PlanDB, 'id'>>;
  if (planProperties.name) {
    updates.name = planProperties.name;
  }
  if (planProperties.description) {
    updates.description = planProperties.description;
  }
  if (planProperties.color) {
    updates.color = planProperties.color;
  }
  if (planProperties.kitchenName) {
    updates.kitchenName = planProperties.kitchenName;
  }
  if (planProperties.kitchenResources) {
    updates.kitchenResources = planProperties.kitchenResources;
  }
  if (planProperties.endTime) {
    updates.date = Timestamp.fromDate(planProperties.endTime);
  }
  return updates;
}
