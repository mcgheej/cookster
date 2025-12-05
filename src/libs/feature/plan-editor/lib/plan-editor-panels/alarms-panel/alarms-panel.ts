import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { format, subMinutes } from 'date-fns';
import { ActivityAction, activityActionTime, ActivityDB } from '@util/data-types/index';
import { CommonModule } from '@angular/common';
import { opaqueColor } from '@util/color-utilities/index';
import { DEFAULT_COLOR_OPACITY } from '@util/app-config/index';

interface Alarm {
  time: Date;
  timeString: string;
  message: string;
  backgroundColor: string;
}

const backgroundColors = ['var(--mat-sys-surface-variant)', 'var(--mat-sys-surface)'];

@Component({
  selector: 'ck-alarms-panel',
  templateUrl: './alarms-panel.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmsPanel {
  private readonly planEditorData = inject(PlanEditorDataService);

  protected readonly flairColor = computed(() => {
    return opaqueColor(this.planEditorData.planColor(), DEFAULT_COLOR_OPACITY);
  });

  protected readonly alarms = computed(() => {
    const plan = this.planEditorData.currentPlan();
    if (!plan) {
      return [];
    }

    const alarms: Alarm[] = [];
    const planEnd = plan.properties.endTime;
    plan.activities.forEach((activity) => {
      alarms.push(this.activityStartAlarm(planEnd, activity));
      alarms.push(this.activityEndAlarm(planEnd, activity));
      alarms.push(...this.activityActionsAlarms(planEnd, activity));
    });
    plan.properties.kitchenResources.forEach((resource) => {
      resource.actions.forEach((action) => {
        const time = subMinutes(planEnd, action.timeOffset);
        alarms.push({
          time,
          timeString: format(time, 'HH:mm'),
          message: action.name,
          backgroundColor: '',
        });
      });
    });

    alarms.sort((a, b) => a.time.getTime() - b.time.getTime());
    let groupCounter = 0;
    return alarms.map((alarm, index) => {
      const timeString =
        index === 0 ? alarm.timeString : alarm.timeString !== alarms[index - 1].timeString ? alarm.timeString : '';
      if (timeString) {
        groupCounter++;
      }
      return { ...alarm, timeString, backgroundColor: backgroundColors[groupCounter % 2] };
    });
  });

  private activityStartAlarm(planEnd: Date, activity: ActivityDB): Alarm {
    const startTime = subMinutes(planEnd, activity.startTimeOffset);
    const message = activity.startMessage || `${activity.name} starts now.`;
    return {
      time: startTime,
      timeString: format(startTime, 'HH:mm'),
      message,
      backgroundColor: '',
    };
  }

  private activityEndAlarm(planEnd: Date, activity: ActivityDB): Alarm {
    const endTime = subMinutes(planEnd, activity.startTimeOffset - activity.duration);
    const message = activity.endMessage || `${activity.name} ends now.`;
    return {
      time: endTime,
      timeString: format(endTime, 'HH:mm'),
      message,
      backgroundColor: '',
    };
  }

  private activityActionsAlarms(planEnd: Date, activity: ActivityDB): Alarm[] {
    const alarms: Alarm[] = [];
    activity.actions.forEach((action) => {
      alarms.push(this.activityActionAlarm(planEnd, activity, action));
    });
    return alarms;
  }

  private activityActionAlarm(planEnd: Date, activity: ActivityDB, action: ActivityAction): Alarm {
    const actionTime = activityActionTime(action, activity.startTimeOffset, activity.duration, planEnd);
    return {
      time: actionTime,
      timeString: format(actionTime, 'HH:mm'),
      message: action.name,
      backgroundColor: '',
    };
  }
}
