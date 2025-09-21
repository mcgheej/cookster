import { inject, Injectable } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { LaneWidth, TimeWindow } from '@util/data-types/index';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TimeWindowDialog, TimeWindowDialogData } from './time-window-dialog/time-window-dialog';

@Injectable()
export class ActivitiesGridMenuService {
  private readonly dialog = inject(MatDialog);
  private readonly editorData = inject(PlanEditorDataService);

  private readonly planEndTethered = this.editorData.activitiesGridPlanEndTethered;
  private readonly laneController = this.editorData.laneController;
  private readonly timeWindow = this.editorData.activitiesGridTimeWindow;

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
      data: { timeWindow: this.timeWindow(), plan } as TimeWindowDialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editorData.setActivitiesGridTimeWindow(result);
      }
    });
  }
}
