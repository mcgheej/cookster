import { PlanKitchenResource, planKitchenResourcesEqual } from './plan-kitchen-resource';

export type LaneWidth = 'narrow' | 'medium' | 'wide';
export const supportedLaneWidths: LaneWidth[] = ['narrow', 'medium', 'wide'];
export const laneWidthPx: Record<LaneWidth, number> = {
  narrow: 300,
  medium: 600,
  wide: 900,
};

export interface ResourceLane {
  kitchenResource: PlanKitchenResource;
  visible: boolean;
  laneWidth: LaneWidth;
}

export function resourceLanesEqual(a: ResourceLane, b: ResourceLane): boolean {
  return (
    planKitchenResourcesEqual(a.kitchenResource, b.kitchenResource) &&
    a.visible === b.visible &&
    a.laneWidth === b.laneWidth
  );
}
