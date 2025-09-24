import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityPropertiesFormService, F_DURATION, F_START_TIME } from '../activity-properties-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'ck-field-time-duration',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTimepickerModule],
  templateUrl: './field-time-duration.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTimeDuration {
  readonly form = inject(ActivityPropertiesFormService).form;
  readonly timeControlName = F_START_TIME;
  readonly durationControlName = F_DURATION;

  protected getErrorMessage(controlName: string): string {
    if (this.form.get(controlName)?.errors?.['outsidePlan']) {
      return 'Activity outside plan period';
    }
    return '';
  }
}
