import { Timestamp } from '@angular/fire/firestore';
import { PlanBase } from './plan-base';
import { PlanProperties } from './plan-properties';
import { Plan } from './plan';

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
  if (planProperties.timeWindow) {
    updates.timeWindow = planProperties.timeWindow;
  }
  return updates;
}

export function createPlanDB(plan: Plan): PlanDB {
  return {
    id: plan.properties.id,
    name: plan.properties.name,
    description: plan.properties.description,
    color: plan.properties.color,
    kitchenName: plan.properties.kitchenName,
    kitchenResources: plan.properties.kitchenResources,
    timeWindow: plan.properties.timeWindow,
    date: Timestamp.fromDate(plan.properties.endTime),
  } as PlanDB;
}
