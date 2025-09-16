import { ACTIVITIES_GRID } from '@util/app-config/index';

export const timeZoomOptions = [
  {
    name: 'Compresssed',
    pixelsPerHour: ACTIVITIES_GRID.pixelsPerHourCompressed,
  },
  {
    name: 'Normal',
    pixelsPerHour: ACTIVITIES_GRID.pixelsPerHourNormal,
  },
  {
    name: 'Expanded',
    pixelsPerHour: ACTIVITIES_GRID.pixelsPerHourExpanded,
  },
];
