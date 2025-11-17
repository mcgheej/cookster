import { inject, Injectable } from '@angular/core';
import { AfPlansService } from './af-plans';
import { ActivityDB, createPlanDbUpdates, Plan, PlanDB, PlanProperties, PlanSummary } from '@util/data-types/index';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { compareAsc } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { ActivitiesDataService } from './activities-data';
import { createPlanFactory } from '@util/data-types/lib/plan';

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
  readonly currentPlan$ = this.getCurrentPlan$();

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

  createPlan(planProperties: Partial<PlanProperties>): Observable<void> {
    return this.afPlansDB.createPlan(createPlanDbUpdates(planProperties) as Omit<PlanDB, 'id'>);
  }

  updatePlanProperties(id: string, changedProperties: Partial<PlanProperties>): Observable<void> {
    return this.afPlansDB.updatePlanProperties(id, createPlanDbUpdates(changedProperties));
  }

  createActivity(a: ActivityDB): Observable<ActivityDB> {
    return this.activitiesData.createActivity(a);
  }

  updateActivity(a: ActivityDB): Observable<void> {
    return this.activitiesData.updateActivity(a);
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
