import { ActivityDB, PlanKitchenResource } from '@util/data-types/index';

export interface KitchenResourceLane {
  visible: boolean;
  activities: ActivityDB[];
  kitchenResource: PlanKitchenResource;
}
