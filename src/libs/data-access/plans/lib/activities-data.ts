import { inject, Injectable } from '@angular/core';
import { AfActivitiesService } from './af-activities';
import { ActivityDB } from '@util/data-types/index';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivitiesDataService {
  private readonly db = inject(AfActivitiesService);

  private readonly activities = new Map<string, ActivityDB>();
  private readonly activitiesMapSubject$ = new BehaviorSubject<Map<string, ActivityDB>>(this.activities);
  readonly activitiesMap$ = this.activitiesMapSubject$.asObservable();
  readonly activities$ = this.activitiesMap$.pipe(map((map) => Array.from(map.values())));

  private _currentPlanId = '';
  set currentPlanId(planId: string) {
    if (planId === this._currentPlanId) {
      return;
    }
    this._currentPlanId = planId;
    this.db.currentPlanId = planId;
  }

  constructor() {
    this.db.activitiesChanges$.subscribe((changes) => {
      changes.forEach((change) => {
        switch (change.type) {
          case 'added':
          case 'modified':
            this.activities.set((change.activityDB as ActivityDB).id, change.activityDB as ActivityDB);
            break;
          case 'removed':
            this.activities.delete((change.activityDB as ActivityDB).id);
            break;
          case 'flush':
            this.activities.clear();
            break;
        }
      });
      this.activitiesMapSubject$.next(this.activities);
    });
  }
}
