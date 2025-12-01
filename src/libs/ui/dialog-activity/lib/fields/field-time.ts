import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ActivityFormService } from '../activity-form-service';

@Component({
  selector: 'ck-field-time',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTimepickerModule],
  template: `
    <div [formGroup]="form">
      <mat-form-field floatLabel="auto">
        <mat-label>Time</mat-label>
        <input matInput [matTimepicker]="timepicker" [formControlName]="timeControlName" />
        @if (form.get(timeControlName)?.invalid && form.get(timeControlName)?.touched) {
          <mat-error> {{ getErrorMessage() }}</mat-error>
        }
        <mat-timepicker #timepicker />
        <mat-timepicker-toggle matSuffix [for]="timepicker" />
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTime {
  readonly form = inject(ActivityFormService).form;
  readonly timeControlName = 'startTime';

  protected getErrorMessage(): string {
    if (this.form.controls.startTime.errors?.['outsideValidPeriod']) {
      return 'Activity outside valid period';
    }
    return '';
  }
}
