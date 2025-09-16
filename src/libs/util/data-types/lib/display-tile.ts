import { ActivityDB } from './activity-db';

export interface DisplayTile {
  activity: ActivityDB;
  topPx: number;
  leftPx: number;
  widthPx: number;
  heightPx: number;
  startMinsFromMidnight: number;
  endMinsFromMidnight: number;
  styles: Record<string, string>;
}
