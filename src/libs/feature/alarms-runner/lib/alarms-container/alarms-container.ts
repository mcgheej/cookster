import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, untracked } from '@angular/core';
import { PlansDataService } from '@data-access/plans/index';
import { format } from 'date-fns';
import { AlarmGroupController, AlarmsByCategory } from '../alarm-group-controller';
import { SoundingAlarms } from './sounding-alarms/sounding-alarms';
import { UpcomingAlarms } from './upcoming-alarms/upcoming-alarms';
import { NextAlarm } from './next-alarm/next-alarm';

@Component({
  selector: 'ck-alarms-container',
  imports: [SoundingAlarms, NextAlarm, UpcomingAlarms],
  templateUrl: './alarms-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmsContainer {
  private readonly plansData = inject(PlansDataService);

  readonly currentTime = input.required<Date>();

  readonly currentAlarmGroups = this.plansData.currentAlarms;

  protected distinctTime = computed(
    () => {
      const currentTime = this.currentTime();
      const timeString = format(this.currentTime(), 'HH:mm');
      return { currentTime, timeString };
    },
    { equal: (a, b) => a.timeString === b.timeString }
  );

  protected alarms = linkedSignal({
    source: this.currentAlarmGroups,
    computation: (groups) => {
      const time = untracked(this.distinctTime);
      return groups.map((group) => {
        if (group.alarms[0].time < time.currentTime) {
          return { group, expired: true } as AlarmGroupController;
        }
        return { group, expired: false } as AlarmGroupController;
      });
    },
  });

  protected alarmsByCategory = computed(() => {
    const alarms = this.alarms();
    const time = this.distinctTime();
    const soundingAlarms: AlarmGroupController[] = [];
    const upcomingAlarms: AlarmGroupController[] = [];
    alarms.forEach((alarm) => {
      if (alarm.expired) {
        return;
      }
      if (alarm.group.alarms[0].time < time.currentTime) {
        soundingAlarms.push(alarm);
      } else {
        upcomingAlarms.push(alarm);
      }
    });
    let nextAlarm = undefined as AlarmGroupController | undefined;
    if (upcomingAlarms.length > 0) {
      nextAlarm = upcomingAlarms[0];
      upcomingAlarms.splice(0, 1);
    }
    return { soundingAlarms, nextAlarm, upcomingAlarms } as AlarmsByCategory;
  });

  cancelAlarm(): void {
    const alarms = [...this.alarms()];
    const idx = alarms.findIndex((a) => !a.expired);
    if (idx !== -1) {
      alarms[idx] = { ...alarms[idx], expired: true };
      this.alarms.set(alarms);
    }
  }
}
