import { LaneWidth } from '@util/data-types/index';

export interface LaneController {
  flagsInitialised: boolean;
  laneControls: LaneControl[];
}

export interface LaneControl {
  visible: boolean;
  name: string;
  description: string;
  tooltip: string;
  laneWidth: LaneWidth;
}

export function laneControllersEqual(a: LaneController, b: LaneController): boolean {
  if (a.flagsInitialised !== b.flagsInitialised || a.laneControls.length !== b.laneControls.length) {
    return false;
  }
  for (let i = 0; i < a.laneControls.length; i++) {
    if (!laneControlsEqual(a.laneControls[i], b.laneControls[i])) {
      return false;
    }
  }
  return true;
}

function laneControlsEqual(a: LaneControl, b: LaneControl): boolean {
  if (
    a.visible !== b.visible ||
    a.name !== b.name ||
    a.description !== b.description ||
    a.tooltip !== b.tooltip ||
    a.laneWidth !== b.laneWidth
  ) {
    return false;
  }
  return true;
}
