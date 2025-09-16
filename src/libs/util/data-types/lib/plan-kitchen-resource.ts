import { KitchenResourceDB } from './kitchen-resource-db';
import { ResourceAction, resourceActionsEqual } from './resource-action';

export interface PlanKitchenResource extends Omit<KitchenResourceDB, 'id' | 'seq' | 'kitchenId'> {
  index: number;
  actions: ResourceAction[];
  // name: string;
  // description: string;
  // maxParallelActivities: number;
}

export function planKitchenResourcesEqual(a: PlanKitchenResource, b: PlanKitchenResource): boolean {
  if (
    a.index !== b.index ||
    a.actions.length !== b.actions.length ||
    a.name !== b.name ||
    a.description !== b.description ||
    a.maxParallelActivities !== b.maxParallelActivities
  ) {
    return false;
  }
  for (let i = 0; i < a.actions.length; i++) {
    if (!resourceActionsEqual(a.actions[i], b.actions[i])) {
      return false;
    }
  }
  return true;
}
