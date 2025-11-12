import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';
import { GenericInputDialog, GenericInputDialogData } from '@ui/dialog-generic-input/index';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { Plan, ResourceAction, ResourceLane } from '@util/data-types/index';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { compareAsc, format } from 'date-fns';

@Injectable()
export class LaneHeaderService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly plansData = inject(PlansDataService);

  createNewResourceAction(plan: Plan, resourceLane: ResourceLane, actionTime: Date): void {
    if (compareAsc(actionTime, plan.properties.endTime) > 0) {
      this.snackBar.open('Can not create action beyond the end of the plan.', 'Close', {
        duration: DEFAULT_SNACKBAR_DURATION,
      });
      return;
    }
    this.dialog
      .open<GenericInputDialog, GenericInputDialogData, string | undefined>(GenericInputDialog, {
        data: {
          title: 'New Resource Action',
          description: `Enter a name for the new action at ${format(actionTime, 'HH:mm')}.`,
          inputLabel: 'Resource Action Name',
          inputPlaceholder: '',
          inputValue: '',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          console.log(`Create new resource action ${result} at`, format(actionTime, 'HH:mm'));
          const timeOffset = Math.max(
            0,
            getMinutesSinceMidnight(plan.properties.endTime) - getMinutesSinceMidnight(actionTime)
          );
          const newAction: ResourceAction = { name: result, timeOffset };
          const resourceActions = [...resourceLane.kitchenResource.actions, newAction];
          const updatedkitchenResources = plan.properties.kitchenResources.map((kr) => {
            if (kr.index === resourceLane.kitchenResource.index) {
              return { ...kr, actions: resourceActions };
            }
            return kr;
          });
          this.plansData
            .updatePlanProperties(plan.properties.id, { kitchenResources: updatedkitchenResources })
            .subscribe({
              next: () => {
                this.snackBar.open(`Resource action "${result}" created.`, 'Close', {
                  duration: DEFAULT_SNACKBAR_DURATION,
                });
              },
              error: (error) => {
                this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
                console.error('Error creating resource action', error);
              },
            });
        }
      });
  }
}
