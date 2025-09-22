import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PlansDataService } from '@data-access/plans/index';
import { PlanPropertiesDialog } from '@ui/dialog-plan-properties/lib/plan-properties-dialog';
import { ConfirmSnack } from '@ui/snack-bars/index';
import { DEFAULT_PLAN_COLOR, DEFAULT_SNACKBAR_DURATION, INITIAL_PLAN_DURATION_MINS } from '@util/app-config/index';
import { PlanProperties, PlanSummary } from '@util/data-types/index';
import { getDateToLastHour } from '@util/date-utilities/index';
import { subMinutes } from 'date-fns';

@Injectable({ providedIn: 'root' })
export class PlansService {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly plansData = inject(PlansDataService);

  planSummaries$ = this.plansData.planSummaries$;

  addPlan() {
    const endTime = getDateToLastHour(new Date());
    const dialogRef: MatDialogRef<PlanPropertiesDialog, Partial<PlanProperties>> = this.dialog.open(
      PlanPropertiesDialog,
      {
        data: {
          id: '',
          name: 'New Plan',
          description: '',
          color: DEFAULT_PLAN_COLOR,
          kitchenName: '',
          kitchenResources: [],
          startTime: subMinutes(endTime, INITIAL_PLAN_DURATION_MINS),
          endTime,
          contentEnd: endTime,
          durationMins: INITIAL_PLAN_DURATION_MINS,
        } as PlanProperties,
        width: '600px',
        maxWidth: '800px',
        maxHeight: '100vh',
        height: '775px',
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.plansData.createPlan(result).subscribe({
          next: () => {
            this.snackBar.open('Plan created', 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
          },
          error: (error) => {
            this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
            console.error('Error creating plan', error);
          },
        });
      }
    });
  }

  editPlan(planSummary: PlanSummary) {
    this.router.navigateByUrl(`/plans/editor/${planSummary.id}`);
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
