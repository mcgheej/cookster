import { inject, Injectable } from '@angular/core';
import { PlansDataService } from '@data-access/plans/index';

@Injectable()
export class PlanEditorService {
  private readonly plansData = inject(PlansDataService);

  private planId = '';

  setPlanId(id: string) {
    if (id !== this.planId) {
      this.planId = id;
      this.plansData.currentPlanId = id;
    }
  }
}
