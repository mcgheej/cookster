import { TimeWindow } from '@util/data-types/index';

export interface TilerConfig {
  pixelsPerHour: number;
  timeWindow: TimeWindow;
  laneWidthPx: number;
  leftMarginPx?: number;
  rightMarginPx?: number;
  gapPx?: number;
}
