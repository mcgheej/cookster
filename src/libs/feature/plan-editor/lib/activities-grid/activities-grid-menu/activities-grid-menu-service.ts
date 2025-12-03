import { inject, Injectable } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { LaneWidth, TimeWindow } from '@util/data-types/index';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TimeWindowDialog, TimeWindowDialogData } from '@ui/dialog-time-window/index';
import { PlansDataService } from '@data-access/plans/index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { openTimeSnapDialog } from '@ui/dialog-time-snap/index';

@Injectable()
export class ActivitiesGridMenuService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly editorData = inject(PlanEditorDataService);
  private readonly db = inject(PlansDataService);

  private readonly planEndTethered = this.editorData.activitiesGridPlanEndTethered;
  private readonly laneController = this.editorData.laneController;
  // private readonly timeWindow = this.editorData.activitiesGridTimeWindow;

  setPixelsPerHour(pixelsPerHour: number) {
    if (pixelsPerHour !== this.editorData.activitiesGridPixelsPerHour()) {
      this.editorData.setActivitiesGridPixelsPerHour(pixelsPerHour);
    }
  }

  togglePlanEndTethered() {
    this.editorData.setActivitiesGridPlanEndTethered(!this.planEndTethered());
  }

  setLaneWidths(optionValue: string) {
    const laneControls = [...this.laneController().laneControls];
    laneControls.forEach((lc, i) => {
      laneControls[i] = { ...laneControls[i], laneWidth: optionValue as LaneWidth };
    });
    this.laneController.set({
      ...this.laneController(),
      flagsInitialised: true,
      laneControls,
    });
  }

  openTimeWindowDialog() {
    const plan = this.editorData.currentPlan();
    if (!plan) {
      console.warn('No plan selected - cannot set time window');
      return;
    }
    const dialogRef: MatDialogRef<TimeWindowDialog, TimeWindow> = this.dialog.open(TimeWindowDialog, {
      width: '1008px',
      maxWidth: '1008px',
      height: '200px',
      data: { plan } as TimeWindowDialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.editorData.setActivitiesGridTimeWindow(result);
        this.db.updatePlanProperties(plan.properties.id, { timeWindow: result }).subscribe({
          error: (err) => {
            this.snackBar.open(`Error updating plan time window - ${err}`, 'Close', {
              duration: DEFAULT_SNACKBAR_DURATION,
            });
          },
        });
      }
    });
  }

  openTimeSnapDialog() {
    const dialogRef = openTimeSnapDialog(this.editorData.timeSnapMins(), this.dialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editorData.setTimeSnapMins(result);
      }
    });
  }
}
