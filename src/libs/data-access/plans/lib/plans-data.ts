import { inject, Injectable } from '@angular/core';
import { AfPlansService } from './af-plans';
import { PlanSummary } from '@util/data-types/index';
import { BehaviorSubject, map } from 'rxjs';
import { compareAsc } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class PlansDataService {
  private readonly db = inject(AfPlansService);

  private planSummaries = new Map<string, PlanSummary>();
  private planSummariesSubject$ = new BehaviorSubject<PlanSummary[]>(Array.from(this.planSummaries.values()));
  planSummaries$ = this.planSummariesSubject$
    .asObservable()
    .pipe(map((summaries) => summaries.sort((a, b) => compareAsc(a.dateTime, b.dateTime))));

  constructor() {
    this.db.plansChanges$.subscribe((changes) => {
      changes.forEach((change) => {
        switch (change.type) {
          case 'added':
          case 'modified':
            const { date, ...planSummary } = { ...change.planDB, dateTime: (change.planDB.date as Timestamp).toDate() };
            this.planSummaries.set(planSummary.id, planSummary as PlanSummary);
            console.log('add/modify', planSummary);
            break;
          case 'removed':
            console.log('remove', change.planDB);
            this.planSummaries.delete(change.planDB.id);
            break;
        }
      });
    });
  }
}
