import { inject, Injectable } from '@angular/core';
import { AfPlansService } from './af-plans';
import { Plan, PlanDB, PlanProperties, PlanSummary } from '@util/data-types/index';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map } from 'rxjs';
import { compareAsc, subMinutes } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { ActivitiesDataService } from './activities-data';

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
  set currentPlanId(planId: string) {
    if (planId === this._currentPlanId) {
      return;
    }
    this._currentPlanId = planId;
    this.currentPlanId$.next(this._currentPlanId);
    this.activitiesData.currentPlanId = planId;
  }

  readonly currentPlan$ = combineLatest([
    this.currentPlanId$.pipe(distinctUntilChanged()),
    this.planSummaries$.pipe(distinctUntilChanged()),
    this.currentPlanActivities$.pipe(distinctUntilChanged()),
  ]).pipe(
    map(([currentPlanId, planSummaries, currentPlanActivities]) => {
      const currentPlanSummary = planSummaries.find((summary) => summary.id === currentPlanId);
      if (currentPlanSummary === undefined) {
        return null;
      }
      return new Plan(currentPlanSummary, currentPlanActivities);
    })
  );

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
}
