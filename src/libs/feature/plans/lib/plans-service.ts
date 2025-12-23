import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PlansDataService } from '@data-access/plans/index';
import { openPlanPropertiesDialog } from '@ui/dialog-plan-properties/index';
import { ConfirmSnack } from '@ui/snack-bars/index';
import {
  DEFAULT_PLAN_COLOR,
  DEFAULT_SNACKBAR_DURATION,
  DEFAULT_TIME_WINDOW,
  INITIAL_PLAN_DURATION_MINS,
} from '@util/app-config/index';
import { createPlanDB, createPlanFactory, PlanProperties, PlanSummary } from '@util/data-types/index';
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
    openPlanPropertiesDialog(
      {
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
        timeWindow: DEFAULT_TIME_WINDOW,
      } as PlanProperties,
      this.dialog
    )
      .afterClosed()
      .subscribe((result) => {
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
        next: () => this.doCopy(planSummary),
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
        next: () => this.doDeletePlan(planSummary),
      });
  }

  runAlarms(planSummary: PlanSummary) {
    this.router.navigateByUrl(`/plans/alarms/${planSummary.id}`);
  }

  private doCopy(planSummary: PlanSummary): void {
    this.snackBar.open('Copying plan...', undefined, { duration: 0 });

    // Create a PlanDB instance from the supplied PlanSummary object
    const plan = createPlanFactory(planSummary, []);
    const planDB = createPlanDB(plan);

    this.plansData.copyPlan(planDB).subscribe({
      next: () => {
        this.snackBar.open(`Plan copied`, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
      },
    });
  }

  private doDeletePlan(planSummary: PlanSummary): void {
    this.snackBar.open('Deleting plan...', undefined, { duration: 0 });
    this.plansData.deletePlan(planSummary.id).subscribe({
      next: () => {
        this.snackBar.open(`${planSummary.name} deleted`, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
      },
    });
  }
}
