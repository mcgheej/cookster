import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';
import { ConfirmSnack } from '@ui/snack-bars/index';
import { PlanSummary } from '@util/data-types/index';

@Injectable({ providedIn: 'root' })
export class PlansService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly plansData = inject(PlansDataService);

  planSummaries$ = this.plansData.planSummaries$;

  addPlan() {
    console.log('addPlan click');
  }

  editPlan(planSummary: PlanSummary) {
    console.log('editPlan click', planSummary);
  }

  copyPlan(planSummary: PlanSummary) {
    this.snackBar
      .openFromComponent(ConfirmSnack, {
        duration: 0,
        verticalPosition: 'bottom',
        data: {
          title: `Copy plan '${planSummary.name}'?`,
          actionButtonLabel: 'COPY',
        },
      })
      .onAction()
      .subscribe({
        next: () => console.log('copyPlan click', planSummary),
      });
  }

  deletePlan(planSummary: PlanSummary) {
    this.snackBar
      .openFromComponent(ConfirmSnack, {
        duration: 0,
        verticalPosition: 'bottom',
        data: {
          title: `Delete plan '${planSummary.name}'?`,
          actionButtonLabel: 'DELETE',
        },
      })
      .onAction()
      .subscribe({
        next: () => console.log('deletePlan click', planSummary),
      });
  }
}
