import { KitchenResourceDB } from './kitchen-resource-db';
import { ResourceAction } from './resource-action';

export interface PlanKitchenResource extends Omit<KitchenResourceDB, 'id' | 'seq' | 'kitchenId'> {
  index: number;
  actions: ResourceAction[];
  // name: string;
  // description: string;
  // maxParallelActivities: number;
}
