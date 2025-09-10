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
