export interface TimeWindow {
  startHours: number;
  endHours: number;
}

export const FULL_TIME_WINDOW: TimeWindow = { startHours: 0, endHours: 24 };
