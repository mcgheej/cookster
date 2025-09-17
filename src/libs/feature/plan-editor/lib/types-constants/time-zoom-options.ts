import { ACTIVITIES_GRID_PIXELS_PER_HOUR } from '@util/app-config/index';

export const timeZoomOptions = [
  {
    name: 'Compresssed',
    pixelsPerHour: ACTIVITIES_GRID_PIXELS_PER_HOUR.compressed,
  },
  {
    name: 'Normal',
    pixelsPerHour: ACTIVITIES_GRID_PIXELS_PER_HOUR.normal,
  },
  {
    name: 'Expanded',
    pixelsPerHour: ACTIVITIES_GRID_PIXELS_PER_HOUR.expanded,
  },
];
