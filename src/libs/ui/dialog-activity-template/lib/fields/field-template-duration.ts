import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ActivityTemplateFormService } from '../activity-template-form-service';

@Component({
  selector: 'ck-field-template-duration',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTimepickerModule],
  template: `
    <div class="grid" [formGroup]="form">
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
export class FieldTemplateDuration {
  readonly form = inject(ActivityTemplateFormService).form;
  readonly durationControlName = 'duration';
}
