import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/lib/plans-data';
import { PlanPropertiesDialog } from '@ui/dialog-plan-properties/lib/plan-properties-dialog';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { Plan, PlanProperties } from '@util/data-types/index';

@Injectable()
export class PlanPanelService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly plansData = inject(PlansDataService);

  editPlan(plan: Plan | null) {
    if (plan) {
      const dialogRef: MatDialogRef<PlanPropertiesDialog, Partial<PlanProperties>> = this.dialog.open(
        PlanPropertiesDialog,
        {
          data: plan.properties,
          width: '600px',
          maxWidth: '800px',
          maxHeight: '100vh',
          height: '775px',
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
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
