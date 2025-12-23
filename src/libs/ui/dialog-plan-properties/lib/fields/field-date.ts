import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FIELD_DATE, FIELD_TIME, PlanPropertiesFormService } from '../plan-properties-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'ck-field-date',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatTimepickerModule],
  template: `
    <div class="grid grid-cols-[1fr]" [formGroup]="form">
      <div class="grid grid-cols-[1fr_1fr] gap-4">
        <mat-form-field floatLabel="auto">
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="datepicker" [formControlName]="dateControlName" />
          <mat-datepicker #datepicker />
          <mat-datepicker-toggle matSuffix [for]="datepicker" />
        </mat-form-field>
        <mat-form-field floatLabel="auto">
          <mat-label>Time</mat-label>
          <input matInput [matTimepicker]="timepicker" [formControlName]="timeControlName" />
          <mat-timepicker #timepicker />
          <mat-timepicker-toggle matSuffix [for]="timepicker" />
        </mat-form-field>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldDate {
  protected readonly form = inject(PlanPropertiesFormService).form;
  protected readonly dateControlName = FIELD_DATE;
  protected readonly timeControlName = FIELD_TIME;
}
