import { computed, inject, Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { DEFAULT_PIXELS_PER_HOUR, DEFAULT_TIME_SNAP_MINS } from '@util/app-config/index';
import * as LocalStorage from './local-storage';
import { PlansDataService } from '@data-access/plans/index';

interface AppSettings {
  timeSpanMins: number;
  pixelsPerHour: number;
  planEndTethered: boolean;
  flashAlarmCancelButton: boolean;
  alarmVolume: number;
}

@Injectable({ providedIn: 'root' })
export class AppSettingsService {
  private readonly plansData = inject(PlansDataService);

  readonly currentPlanId = computed(() => {
    const plan = this.plansData.currentPlan();
    return plan ? plan.properties.id : '';
  });

  private readonly settings = linkedSignal<string, AppSettings>({
    source: this.currentPlanId,
    equal: (a, b) => this.settingsEqual(a, b),
    computation: (currentPlanId) => {
      return {
        timeSpanMins:
          LocalStorage.getItem<number>(`cookster.${currentPlanId}.timeSpanMins`, DEFAULT_TIME_SNAP_MINS) ||
          DEFAULT_TIME_SNAP_MINS,
        pixelsPerHour:
          LocalStorage.getItem<number>(`cookster.${currentPlanId}.pixelsPerHour`, DEFAULT_PIXELS_PER_HOUR) ||
          DEFAULT_PIXELS_PER_HOUR,
        planEndTethered: LocalStorage.getItem<boolean>(`cookster.${currentPlanId}.planEndTethered`, true) || true,
        flashAlarmCancelButton:
          LocalStorage.getItem<boolean>(`cookster.${currentPlanId}.flashAlarmCancelButton`, true) || true,
        alarmVolume: LocalStorage.getItem<number>(`cookster.${currentPlanId}.alarmVolume`, 10) || 10,
      } as AppSettings;
    },
  });

  readonly timeSnapMins = computed(
    () => {
      const settings = this.settings();
      return settings.timeSpanMins;
    },
    {
      equal: (a, b) => a === b,
    }
  );

  readonly pixelsPerHour = computed(
    () => {
      const settings = this.settings();
      return settings.pixelsPerHour;
    },
    {
      equal: (a, b) => a === b,
    }
  );

  readonly planEndTethered = computed(
    () => {
      const settings = this.settings();
      return settings.planEndTethered;
    },
    {
      equal: (a, b) => a === b,
    }
  );

  readonly flashAlarmCancelButton = computed(
    () => {
      const settings = this.settings();
      return settings.flashAlarmCancelButton;
    },
    {
      equal: (a, b) => a === b,
    }
  );

  readonly alarmVolume = computed(
    () => {
      const settings = this.settings();
      return settings.alarmVolume;
    },
    {
      equal: (a, b) => a === b,
    }
  );

  setTimeSnapMins(planId: string, timeSpanMins: number): void {
    LocalStorage.setItem<number>(`cookster.${planId}.timeSpanMins`, timeSpanMins);
    this.settings.update((settings) => ({ ...settings, timeSpanMins }));
  }

  setPixelsPerHour(planId: string, pixelsPerHour: number): void {
    LocalStorage.setItem<number>(`cookster.${planId}.pixelsPerHour`, pixelsPerHour);
    this.settings.update((settings) => ({ ...settings, pixelsPerHour }));
  }

  setPlanEndTethered(planId: string, planEndTethered: boolean): void {
    LocalStorage.setItem<boolean>(`cookster.${planId}.planEndTethered`, planEndTethered);
    this.settings.update((settings) => ({ ...settings, planEndTethered }));
  }

  setFlashAlarmCancelButton(planId: string, flash: boolean): void {
    LocalStorage.setItem<boolean>(`cookster.${planId}.flashAlarmCancelButton`, flash);
    this.settings.update((settings) => ({ ...settings, flashAlarmCancelButton: flash }));
  }

  setAlarmVolume(planId: string, volume: number): void {
    LocalStorage.setItem<number>(`cookster.${planId}.alarmVolume`, volume);
    this.settings.update((settings) => ({ ...settings, alarmVolume: volume }));
  }

  private settingsEqual(a: AppSettings, b: AppSettings): boolean {
    return (
      a.timeSpanMins === b.timeSpanMins &&
      a.pixelsPerHour === b.pixelsPerHour &&
      a.planEndTethered === b.planEndTethered &&
      a.flashAlarmCancelButton === b.flashAlarmCancelButton &&
      a.alarmVolume === b.alarmVolume
    );
  }
}
