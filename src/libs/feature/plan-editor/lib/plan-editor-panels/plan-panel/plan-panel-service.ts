import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/lib/plans-data';
import { openPlanPropertiesDialog } from '@ui/dialog-plan-properties/index';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { Plan } from '@util/data-types/index';

@Injectable()
export class PlanPanelService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly plansData = inject(PlansDataService);

  editPlan(plan: Plan | null) {
    if (plan) {
      openPlanPropertiesDialog(plan.properties, this.dialog)
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.plansData.updatePlanProperties(plan.properties.id, result).subscribe({
              next: () => {
                this.snackBar.open('Plan updated', 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
              },
              error: (error) => {
                this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
                console.error('Error creating plan', error);
              },
            });
          }
        });
    }
  }
}
