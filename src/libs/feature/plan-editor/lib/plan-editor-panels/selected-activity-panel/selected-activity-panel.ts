import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { DEFAULT_COLOR_OPACITY, defaultGoogleColor, googleColors } from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/lib/color-utilities';
import { addMinutes, format, interval, intervalToDuration, subMinutes } from 'date-fns';
import { activityActionTextTimed } from '@util/data-types/index';
import { ActivityPanelButtons } from './activity-panel-buttons/activity-panel-buttons';

@Component({
  selector: 'ck-selected-activity-panel',
  imports: [ActivityPanelButtons],
  templateUrl: './selected-activity-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedActivityPanel {
  private readonly planEditorData = inject(PlanEditorDataService);

  protected readonly selectedActivity = this.planEditorData.selectedActivity;

  protected timeString = computed(() => {
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

  protected resourceName = computed(() => {
    const plan = this.planEditorData.currentPlan();
    const activity = this.selectedActivity();
    if (!plan || !activity) {
      return '';
    }
    return plan.properties.kitchenResources[activity.resourceIndex]?.name || '';
  });

  protected actionsAsText = computed(() => {
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

  getRGBColor(activityColor: string) {
    const rgbColor = googleColors[activityColor]?.color;
    return rgbColor
      ? opaqueColor(rgbColor, DEFAULT_COLOR_OPACITY)
      : opaqueColor(googleColors[defaultGoogleColor].color, DEFAULT_COLOR_OPACITY);
  }
}
