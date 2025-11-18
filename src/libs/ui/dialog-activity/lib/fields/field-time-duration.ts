import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ActivityFormService } from '../activity-form-service';

@Component({
  selector: 'ck-field-time-duration',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTimepickerModule],
  template: `
    <div class="mt-3 grid grid-cols-[1fr]" [formGroup]="form">
      <div class="grid grid-cols-[1fr_1fr] gap-4">
        <mat-form-field floatLabel="auto">
          <mat-label>Time</mat-label>
          <input matInput [matTimepicker]="timepicker" [formControlName]="timeControlName" />
          @if (form.get(timeControlName)?.invalid && form.get(timeControlName)?.touched) {
            <mat-error> {{ getErrorMessage() }}</mat-error>
          }
          <mat-timepicker #timepicker />
          <mat-timepicker-toggle matSuffix [for]="timepicker" />
        </mat-form-field>
        <mat-form-field floatLabel="auto">
          <mat-label>Duration</mat-label>
          <input matInput [matTimepicker]="durationpicker" [formControlName]="durationControlName" />
          <mat-timepicker interval="5m" #durationpicker />
          <mat-timepicker-toggle matSuffix [for]="durationpicker" />
        </mat-form-field>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTimeDuration {
  readonly form = inject(ActivityFormService).form;
  readonly timeControlName = 'startTime';
  readonly durationControlName = 'duration';

  protected getErrorMessage(): string {
    if (this.form.controls.startTime.errors?.['outsideValidPeriod']) {
      return 'Activity outside valid period';
    }
    return '';
  }
}
