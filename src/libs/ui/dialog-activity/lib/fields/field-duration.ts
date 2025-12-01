import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ActivityFormService } from '../activity-form-service';

@Component({
  selector: 'ck-field-duration',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTimepickerModule],
  template: `
    <div [formGroup]="form">
      <mat-form-field floatLabel="auto">
        <mat-label>Duration</mat-label>
        <input matInput [matTimepicker]="durationpicker" [formControlName]="durationControlName" />
        <mat-timepicker interval="5m" #durationpicker />
        <mat-timepicker-toggle matSuffix [for]="durationpicker" />
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldDuration {
  readonly form = inject(ActivityFormService).form;
  readonly durationControlName = 'duration';
}
