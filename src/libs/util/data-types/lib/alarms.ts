export interface Alarm {
  time: Date;
  timeString: string;
  message: string;
}

export interface AlarmGroup {
  alarms: Alarm[];
}
