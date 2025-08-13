import { PlanKitchenResource } from './plan-kitchen-resource';

export interface PlanBase {
  id: string;
  name: string;
  description: string;
  color: string;
  kitchenName: string;
  kitchenResources: PlanKitchenResource[];
}
