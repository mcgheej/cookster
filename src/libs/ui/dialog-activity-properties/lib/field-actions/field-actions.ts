import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { ActivityPropertiesFormService } from '../activity-properties-form-service';
import { activityActionText } from '@util/data-types/index';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';

@Component({
  selector: 'ck-field-actions',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './field-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActions {
  private readonly formService = inject(ActivityPropertiesFormService);

  protected readonly editAction = output<number>();

  protected readonly actions = this.formService.actions;

  protected actionsText = computed(() => {
    const actions = this.actions();
    return actions.map((a) => activityActionText(a));
  });

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
}
