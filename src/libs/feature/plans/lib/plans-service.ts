import { inject, Injectable } from '@angular/core';
import { PlansDataService } from '@data-access/plans/index';
import { PlanSummary } from '@util/data-types/index';

@Injectable({ providedIn: 'root' })
export class PlansService {
  private readonly plansData = inject(PlansDataService);

  planSummaries$ = this.plansData.planSummaries$;

  addPlan() {
    console.log('addPlan click');
  }

  editPlan(planSummary: PlanSummary) {
    console.log('editPlan click', planSummary);
  }

  copyPlan(planSummary: PlanSummary) {
    console.log('copyPlan click', planSummary);
  }

  deletePlan(planSummary: PlanSummary) {
    console.log('deletePlan click', planSummary);
  }
}
