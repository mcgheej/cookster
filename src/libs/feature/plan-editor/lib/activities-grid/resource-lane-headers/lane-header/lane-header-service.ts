import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { Plan, ResourceLane } from '@util/data-types/index';
import { compareAsc } from 'date-fns';

@Injectable()
export class LaneHeaderService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  createNewResourceAction(plan: Plan, resourceLane: ResourceLane, actionTime: Date): void {
    if (compareAsc(actionTime, plan.properties.endTime) > 0) {
      this.snackBar.open('Cannont create action beyond the end of the plan.', undefined, {
        duration: DEFAULT_SNACKBAR_DURATION,
      });
      return;
    }
    console.log('New resource action time received in LaneHeader:', actionTime);
  }
}
