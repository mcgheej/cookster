import { inject, Injectable } from '@angular/core';
import { AfPlansService } from './af-plans';
import { PlanDB, PlanSummary } from '@util/data-types/index';
import { BehaviorSubject, map } from 'rxjs';
import { compareAsc } from 'date-fns';
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
  set currentPlanId(planId: string) {
    if (planId === this._currentPlanId) {
      return;
    }
    this._currentPlanId = planId;
    this.activitiesData.currentPlanId = planId;
  }

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
