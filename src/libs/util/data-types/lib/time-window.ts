export interface TimeWindow {
  startHours: number;
  endHours: number;
}

export const FULL_TIME_WINDOW: TimeWindow = { startHours: 0, endHours: 24 };
export const DEFAULT_TIME_WINDOW: TimeWindow = { startHours: 9, endHours: 21 };
