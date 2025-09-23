import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivityPropertiesFormService } from '../activity-properties-form-service';
import { activityActionText } from '@util/data-types/index';

@Component({
  selector: 'ck-field-actions',
  imports: [],
  templateUrl: './field-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActions {
  private readonly formService = inject(ActivityPropertiesFormService);

  protected readonly actions = this.formService.actions;

  protected actionsText = computed(() => {
    const actions = this.actions();
    return actions.map((a) => activityActionText(a));
  });
}
