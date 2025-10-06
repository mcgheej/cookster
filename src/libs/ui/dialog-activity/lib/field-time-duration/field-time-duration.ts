import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ActivityFormService } from '../activity-form-service';

@Component({
  selector: 'ck-field-time-duration',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTimepickerModule],
  templateUrl: './field-time-duration.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTimeDuration {
  readonly form = inject(ActivityFormService).form;
  readonly timeControlName = 'startTime';
  readonly durationControlName = 'duration';

  protected getErrorMessage(): string {
    if (this.form.controls.startTime.errors?.['outsidePlan']) {
      return 'Activity outside plan period';
    }
    return '';
  }
}
