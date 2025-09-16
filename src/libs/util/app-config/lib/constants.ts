import { LaneWidth, TimeWindow } from '@util/data-types/index';

export const DEFAULT_SNACKBAR_DURATION = 3000;
export const DEFAULT_TOOLTIP_SHOW_DELAY = 500;

export const INITIAL_ROUTE_AFTER_LOGIN = '/plans';

// Plan Editor Layout
//
export const COLLAPSED_PANEL_CONTENT_WIDTH = '0';
export const EXPANDED_PANEL_CONTENT_WIDTH = '300';
export const ACTIVITIES_GRID_HEADER_HEIGHT = '32';
export const ACTIVITIES_GRID_TIME_COLUMN_WIDTH = '48';
export const ACTIVITIES_GRID_TIME_COLUMN_TICK_LENGTH = '8';
export const ACTIVITIES_GRID_TIME_COLUMN_LABEL_WIDTH = '40';
export const ACTIVITIES_GRID_LANE_BORDER_WIDTH = 2;
export const STATUS_BAR_HEIGHT = '32';

export const DEFAULT_PLAN_COLOR = 'basil';
export const DEFAULT_COLOR_OPACITY = 0.4;
export const DIALOG_COLOR_OPACITY = 0.6;

export const INITIAL_PLAN_DURATION_MINS = 60;

export const ACTIVITIES_GRID = {
  pixelsPerHourCompressed: 60,
  pixelsPerHourNormal: 120,
  pixelsPerHourExpanded: 180,
};

export const DEFAULT_PIXELS_PER_HOUR = ACTIVITIES_GRID.pixelsPerHourNormal;

export const DEFAULT_TIME_WINDOW: TimeWindow = { startHours: 9, endHours: 21 };

export const DEFAULT_LANE_WIDTH: LaneWidth = 'narrow';

export const TIMESLOTS: string[] = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];
