import { PlanKitchenResource } from './plan-kitchen-resource';
import { TimeWindow } from './time-window';

export interface PlanBase {
  id: string;
  name: string;
  description: string;
  color: string;
  kitchenName: string;
  kitchenResources: PlanKitchenResource[];
  timeWindow: TimeWindow;
}
