import { ResourceAction } from './resource-action';

export interface PlanKitchenResource {
  index: number;
  name: string;
  description: string;
  maxParallelActivities: number;
  actions: ResourceAction[];
}
