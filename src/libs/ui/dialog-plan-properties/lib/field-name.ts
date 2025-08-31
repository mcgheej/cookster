import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FIELD_NAME, PlanPropertiesFormService } from './plan-properties-form-service.ts.js';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ck-field-name',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="mt-[3px] grid grid-cols-[1fr]" [formGroup]="form">
      <mat-form-field class="mat-headline-5" floatLabel="auto">
        <input type="text" matInput [formControlName]="controlName" placeholder="Name your plan..." />
        @if (form.get(controlName)?.invalid && form.get(controlName)?.touched) {
          <mat-error>Name is required</mat-error>
        }
        @if (form.get(controlName)?.invalid && !form.get(controlName)?.touched) {
          <mat-hint>The plan must have a name</mat-hint>
        }
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldName {
  protected readonly form = inject(PlanPropertiesFormService).form;
  protected readonly controlName = FIELD_NAME;
}
