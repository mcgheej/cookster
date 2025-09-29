import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ActivityPropertiesFormService } from '../activity-properties-form-service';
import { activityActionText, activityActionTextTimed, activityActionTime } from '@util/data-types/index';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { format, isAfter } from 'date-fns';

@Component({
  selector: 'ck-field-actions',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './field-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActions {
  private readonly formService = inject(ActivityPropertiesFormService);

  readonly actionSummaries = input.required<{ overflow: boolean; text: string }[]>();
  protected readonly addAction = output<void>();
  protected readonly editAction = output<number>();

  // protected actionSummaries = computed(() => {
  //   const actions = this.formService.actions();
  //   const activity = this.formService.activity();
  //   const plan = this.formService.plan();
  //   if (!activity || !plan) {
  //     return [];
  //   }
  //   return actions.map((a) => {
  //     const actionTime = activityActionTime(a, activity.startTimeOffset, activity.duration, plan.properties.endTime);
  //     return {
  //       overflow: isAfter(actionTime, plan.properties.endTime),
  //       text: '[' + format(actionTime, 'HH:mm') + '] ' + activityActionText(a),
  //     };
  //   });
  // });

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected onAddAction(ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();
    this.addAction.emit();
  }
}
