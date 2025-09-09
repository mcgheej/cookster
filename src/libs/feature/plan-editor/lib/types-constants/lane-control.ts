import { LaneWidth } from '@util/data-types/index';

export interface laneController {
  flagsInitialised: boolean;
  laneControls: LaneControl[];
}

export interface LaneControl {
  visible: boolean;
  name: string;
  tooltip: string;
  laneWidth: LaneWidth;
}
