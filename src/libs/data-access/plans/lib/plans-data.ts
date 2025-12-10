import { computed, inject, Injectable } from '@angular/core';
import { AfPlansService } from './af-plans';
import {
  ActivityAction,
  activityActionTime,
  ActivityDB,
  Alarm,
  AlarmGroup,
  createPlanDbUpdates,
  Plan,
  PlanDB,
  PlanProperties,
  PlanSummary,
} from '@util/data-types/index';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { compareAsc, format, subMinutes } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { ActivitiesDataService } from './activities-data';
import { createPlanFactory } from '@util/data-types/lib/plan';
import { toSignal } from '@angular/core/rxjs-interop';
import { DEFAULT_PLAN_COLOR, googleColors } from '@util/app-config/index';

@Injectable({ providedIn: 'root' })
export class PlansDataService {
  private readonly afPlansDB = inject(AfPlansService);
  private readonly activitiesData = inject(ActivitiesDataService);

  private readonly planSummaries = new Map<string, PlanSummary>();
  private readonly planSummariesSubject$ = new BehaviorSubject<PlanSummary[]>([]);
  readonly planSummaries$ = this.planSummariesSubject$
    .asObservable()
    .pipe(map((summaries) => summaries.sort((a, b) => compareAsc(a.dateTime, b.dateTime))));

  readonly currentPlanActivities$ = this.activitiesData.activities$;

  private _currentPlanId = '';
  private currentPlanId$ = new BehaviorSubject<string>(this._currentPlanId);

  /**
   * Sets the current plan ID.
   * This will also update the current plan ID in the activities data service
   */
  set currentPlanId(planId: string) {
    if (planId === this._currentPlanId) {
      return;
    }
    this._currentPlanId = planId;
    this.currentPlanId$.next(this._currentPlanId);
    this.activitiesData.currentPlanId = planId;
  }

  private lastEmittedPlan: Plan | null = null;
  readonly currentPlan = toSignal(this.getCurrentPlan$(), { initialValue: null });
  readonly currentPlanColor = computed(() => {
    const plan = this.currentPlan();
    return plan ? googleColors[plan.properties.color].color : googleColors[DEFAULT_PLAN_COLOR].color;
  });

  readonly currentAlarms = computed(() => {
    const plan = this.currentPlan();
    if (!plan) {
      return [] as AlarmGroup[];
    }
    return getAlarmGroupsForPlan(plan);
  });

  constructor() {
    this.afPlansDB.plansChanges$.subscribe((changes) => {
      changes.forEach((change) => {
        switch (change.type) {
          case 'added':
          case 'modified':
            const { date, ...planSummary } = {
              ...(change.planDB as PlanDB),
              dateTime: ((change.planDB as PlanDB).date as Timestamp).toDate(),
            };
            this.planSummaries.set(planSummary.id, planSummary as PlanSummary);
            break;
          case 'removed':
            this.planSummaries.delete((change.planDB as PlanDB).id);
            break;
          case 'flush':
            this.planSummaries.clear();
            break;
        }
      });
      this.planSummariesSubject$.next(Array.from(this.planSummaries.values()));
    });
  }

  createPlan(planProperties: Partial<PlanProperties>): Observable<PlanDB> {
    return this.afPlansDB.createPlan(createPlanDbUpdates(planProperties) as Omit<PlanDB, 'id'>);
  }

  updatePlanProperties(id: string, changedProperties: Partial<PlanProperties>): Observable<void> {
    return this.afPlansDB.updatePlanProperties(id, createPlanDbUpdates(changedProperties));
  }

  copyPlan(planDB: PlanDB): Observable<PlanDB> {
    return this.afPlansDB.copyPlan(planDB);
  }

  deletePlan(planId: string): Observable<void> {
    return this.afPlansDB.deletePlan(planId);
  }

  createActivity(a: ActivityDB): Observable<ActivityDB> {
    return this.activitiesData.createActivity(a);
  }

  // updateActivity(a: ActivityDB): Observable<void> {
  //   return this.activitiesData.updateActivity(a);
  // }

  updateActivity(id: string, a: Partial<Omit<ActivityDB, 'id'>>): Observable<void> {
    return this.activitiesData.updateActivity(id, a);
  }

  deleteActivity(id: string): Observable<void> {
    return this.activitiesData.deleteActivity(id);
  }

  updateUntetheredPlanEnd(plan: Plan): Observable<void> {
    return this.afPlansDB.updateUntetheredPlanEnd(
      plan.properties.id,
      createPlanDbUpdates({
        endTime: plan.properties.endTime,
        kitchenResources: plan.properties.kitchenResources,
      }),
      plan.activities
    );
  }

  private getCurrentPlan$(): Observable<Plan | null> {
    return combineLatest([
      this.currentPlanId$.pipe(distinctUntilChanged()),
      this.planSummaries$.pipe(distinctUntilChanged()),
      this.currentPlanActivities$.pipe(distinctUntilChanged()),
    ]).pipe(
      map(([currentPlanId, planSummaries, currentPlanActivities]) => {
        // If no current plan ID is set, reset state and emit null as a plan cannot be created
        if (currentPlanId === '') {
          this.lastEmittedPlan = null;
          return null;
        }

        // If no plan summary is found reset state and emit null as a plan cannot be created
        const currentPlanSummary = planSummaries.find((summary) => summary.id === currentPlanId);
        if (currentPlanSummary === undefined) {
          this.lastEmittedPlan = null;
          return null;
        }

        // this.lastEmittedPlan = new Plan(currentPlanSummary, currentPlanActivities);
        this.lastEmittedPlan = createPlanFactory(currentPlanSummary, currentPlanActivities);
        return this.lastEmittedPlan;
      })
    );
  }
}

function getAlarmGroupsForPlan(plan: Plan): AlarmGroup[] {
  const allAlarms: Alarm[] = [];
  const planEnd = plan.properties.endTime;
  plan.activities.forEach((activity) => {
    allAlarms.push(activityStartAlarm(planEnd, activity));
    allAlarms.push(activityEndAlarm(planEnd, activity));
    allAlarms.push(...activityActionsAlarms(planEnd, activity));
  });
  plan.properties.kitchenResources.forEach((resource) => {
    resource.actions.forEach((action) => {
      const time = subMinutes(planEnd, action.timeOffset);
      allAlarms.push({
        time,
        timeString: format(time, 'HH:mm'),
        message: action.name,
      });
    });
  });

  allAlarms.sort((a, b) => a.time.getTime() - b.time.getTime());

  const alarmGroups: AlarmGroup[] = [];
  let currentGroup: Alarm[] = [];
  let lastTimeString = '';
  allAlarms.forEach((alarm) => {
    if (alarm.timeString !== lastTimeString && lastTimeString) {
      // Store current group and start a new group
      alarmGroups.push({ alarms: currentGroup });
      currentGroup = [alarm];
      lastTimeString = alarm.timeString;
    } else {
      // Add to current group
      currentGroup.push(alarm);
      lastTimeString = alarm.timeString;
    }
  });
  // Push the final group if it has alarms
  if (currentGroup.length > 0) {
    alarmGroups.push({ alarms: currentGroup });
  }

  return alarmGroups;
}

function activityStartAlarm(planEnd: Date, activity: ActivityDB): Alarm {
  const startTime = subMinutes(planEnd, activity.startTimeOffset);
  const message = activity.startMessage || `${activity.name} starts now.`;
  return {
    time: startTime,
    timeString: format(startTime, 'HH:mm'),
    message,
  };
}

function activityEndAlarm(planEnd: Date, activity: ActivityDB): Alarm {
  const endTime = subMinutes(planEnd, activity.startTimeOffset - activity.duration);
  const message = activity.endMessage || `${activity.name} ends now.`;
  return {
    time: endTime,
    timeString: format(endTime, 'HH:mm'),
    message,
  };
}

function activityActionsAlarms(planEnd: Date, activity: ActivityDB): Alarm[] {
  const alarms: Alarm[] = [];
  activity.actions.forEach((action) => {
    alarms.push(activityActionAlarm(planEnd, activity, action));
  });
  return alarms;
}

function activityActionAlarm(planEnd: Date, activity: ActivityDB, action: ActivityAction): Alarm {
  const actionTime = activityActionTime(action, activity.startTimeOffset, activity.duration, planEnd);
  return {
    time: actionTime,
    timeString: format(actionTime, 'HH:mm'),
    message: action.name,
  };
}
