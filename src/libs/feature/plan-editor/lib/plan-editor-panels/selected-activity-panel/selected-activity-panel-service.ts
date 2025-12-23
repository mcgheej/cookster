import { computed, inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/lib/plans-data';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { addMinutes, format, interval, intervalToDuration, subMinutes } from 'date-fns';
import { activityActionTextTimed, ActivityDB } from '@util/data-types/index';
import { exceedsMaxParallelActivities } from '@util/tiler/index';
import {
  DEFAULT_COLOR_OPACITY,
  DEFAULT_SNACKBAR_DURATION,
  defaultGoogleColor,
  googleColors,
} from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { openActivityDialog } from '@ui/activity-dialog/index';
import { TemplatesDataService } from 'libs/data-access/templates';
import { DeleteActivitySnack } from '@ui/snack-bars/index';

@Injectable()
export class SelectedActivityPanelService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly plansData = inject(PlansDataService);
  private readonly templatesData = inject(TemplatesDataService);
  private readonly planEditorData = inject(PlanEditorDataService);

  // Signals and Computed Signals
  // ----------------------------
  readonly flairColor = computed(() => {
    return opaqueColor(this.planEditorData.planColor(), DEFAULT_COLOR_OPACITY);
  });

  /**
   * The currently selected activity in the plan editor, or undefined if none is selected.
   */
  readonly selectedActivity = this.planEditorData.selectedActivity;

  /**
   * A formatted string representing the start and end time of the selected activity, along with its duration.
   */
  readonly timeString = computed(() => {
    const plan = this.planEditorData.currentPlan();
    const activity = this.selectedActivity();
    if (!plan || !activity) {
      return '';
    }
    const startTime = subMinutes(plan.properties.endTime, activity.startTimeOffset);
    const endTime = addMinutes(startTime, activity.duration);
    const duration = intervalToDuration(interval(startTime, endTime));
    const hours = (duration.hours || 0).toString().padStart(2, '0');
    const mins = (duration.minutes || 0).toString().padStart(2, '0');
    return `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')} (${hours}:${mins})`;
  });

  /**
   * The name of the resource associated with the selected activity, or an empty string if not available.
   */
  readonly resourceName = computed(() => {
    const plan = this.planEditorData.currentPlan();
    const activity = this.selectedActivity();
    if (!plan || !activity) {
      return '';
    }
    return plan.properties.kitchenResources[activity.resourceIndex]?.name || '';
  });

  /**
   * An array of strings representing the actions of the selected activity, formatted with their respective times.
   */
  readonly actionsAsText = computed(() => {
    const plan = this.planEditorData.currentPlan();
    const activity = this.selectedActivity();
    if (!plan || !activity) {
      return [];
    }
    return activity.actions
      .map((action) =>
        activityActionTextTimed(action, activity.startTimeOffset, activity.duration, plan.properties.endTime)
      )
      .sort((a, b) => {
        const aTime = a.split(' - ')[0];
        const bTime = b.split(' - ')[0];
        return aTime.localeCompare(bTime);
      });
  });

  // Methods
  // -------

  editActivity() {
    const selectedActivity = this.selectedActivity();
    const plan = this.planEditorData.currentPlan();
    if (!selectedActivity || !plan) {
      return;
    }
    openActivityDialog({ activity: selectedActivity, plan: plan }, this.dialog)
      .afterClosed()
      .subscribe((newActivity) => {
        if (newActivity) {
          // check if new activity location exceeds max parallel activities for the resource lane in question
          const activitiesInLane = plan.activities.filter((a) => a.resourceIndex === newActivity.resourceIndex);
          if (exceedsMaxParallelActivities(newActivity, activitiesInLane, plan)) {
            this.snackBar.open('Max parallel activities exceeded for this resource.', undefined, {
              duration: DEFAULT_SNACKBAR_DURATION,
            });
          } else {
            const { id, ...activityUpdates } = newActivity;
            this.plansData.updateActivity(id, activityUpdates).subscribe({
              next: () => {
                this.snackBar.open('Activity updated', undefined, { duration: DEFAULT_SNACKBAR_DURATION });
              },
              error: (err) => {
                console.error('Error updating activity', err);
                this.snackBar.open('Error updating activity', undefined, { duration: DEFAULT_SNACKBAR_DURATION });
              },
            });
          }
        }
      });
  }

  createTemplateFromActivity(activity: ActivityDB) {
    this.doCreateTemplateFromActivity(activity);
  }

  deleteActivity(selectedActivity: ActivityDB) {
    this.snackBar
      .openFromComponent(DeleteActivitySnack, {
        duration: 0,
        verticalPosition: 'bottom',
        data: 'Delete activity?',
      })
      .onAction()
      .subscribe(() => {
        this.doDeleteAccrual(selectedActivity.id);
      });
  }

  deselectActivity() {
    this.planEditorData.setSelectedActivityId('');
  }

  getRGBColor(activityColor: string) {
    const rgbColor = googleColors[activityColor]?.color;
    return rgbColor
      ? opaqueColor(rgbColor, DEFAULT_COLOR_OPACITY)
      : opaqueColor(googleColors[defaultGoogleColor].color, DEFAULT_COLOR_OPACITY);
  }

  private doDeleteAccrual(id: string): void {
    this.snackBar.open('Deleting activity...', undefined, { duration: 0 });
    this.plansData.deleteActivity(id).subscribe({
      next: () => {
        this.snackBar.open('Activity deleted', undefined, { duration: DEFAULT_SNACKBAR_DURATION });
      },
      error: (error) => {
        this.snackBar.open(`Error deleting activity: ${error}`, undefined, { duration: DEFAULT_SNACKBAR_DURATION });
      },
    });
  }

  private doCreateTemplateFromActivity(activity: ActivityDB) {
    const { startTimeOffset, planId, resourceIndex, ...activityTemplate } = { ...activity, id: '' };
    this.templatesData.createActivityTemplate(activityTemplate).subscribe({
      next: (createdTemplate) => {
        this.snackBar.open('Activity template created', 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
      },
      error: (error) => {
        this.snackBar.open(`Error creating activity template: ${error}`, undefined, {
          duration: DEFAULT_SNACKBAR_DURATION,
        });
      },
    });
  }
}
