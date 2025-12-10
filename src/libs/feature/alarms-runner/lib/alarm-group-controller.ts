import { AlarmGroup } from '@util/data-types/index';

export interface AlarmGroupController {
  group: AlarmGroup;
  expired: boolean;
}

export interface AlarmsByCategory {
  soundingAlarms: AlarmGroupController[];
  nextAlarm: AlarmGroupController | undefined;
  upcomingAlarms: AlarmGroupController[];
}
