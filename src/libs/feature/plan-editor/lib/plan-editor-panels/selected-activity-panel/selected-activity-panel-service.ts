import { computed, inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { addMinutes, format, interval, intervalToDuration, subMinutes } from 'date-fns';
import { activityActionTextTimed, ActivityDB } from '@util/data-types/index';
import {
  DEFAULT_COLOR_OPACITY,
  DEFAULT_SNACKBAR_DURATION,
  defaultGoogleColor,
  googleColors,
} from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { TemplatesDataService } from '@data-access/templates/index';
import { ActivityService } from '../../activity-service';

@Injectable()
export class SelectedActivityPanelService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly templatesData = inject(TemplatesDataService);
  private readonly planEditorData = inject(PlanEditorDataService);
  private readonly activityService = inject(ActivityService);

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
    if (!selectedActivity) {
      return;
    }
    this.activityService.editActivity(selectedActivity);
  }

  createTemplateFromActivity(activity: ActivityDB) {
    this.doCreateTemplateFromActivity(activity);
  }

  deleteActivity(selectedActivity: ActivityDB) {
    this.activityService.deleteActivity(selectedActivity);
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

  private doCreateTemplateFromActivity(activity: ActivityDB) {
    const { startTimeOffset, planId, resourceIndex, ...activityTemplate } = { ...activity, id: '' };
    this.templatesData.createActivityTemplate(activityTemplate).subscribe({
      next: () => {
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
