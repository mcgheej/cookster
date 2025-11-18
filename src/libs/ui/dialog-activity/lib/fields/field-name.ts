import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivityFormService } from '../activity-form-service';

@Component({
  selector: 'ck-field-name',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="mt-[3px] grid grid-cols-[1fr]" [formGroup]="form">
      <mat-form-field class="mat-headline-5" floatLabel="auto">
        <mat-label>Activity Name</mat-label>
        <input type="text" matInput [formControlName]="controlName" placeholder="Name your activity..." />
        @if (form.get(controlName)?.invalid && form.get(controlName)?.touched) {
          <mat-error>Name is required</mat-error>
        }
        @if (form.get(controlName)?.invalid && !form.get(controlName)?.touched) {
          <mat-hint>The activity must have a name</mat-hint>
        }
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldName {
  readonly form = inject(ActivityFormService).form;
  readonly controlName = 'name';
}
