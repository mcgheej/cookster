import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FIELD_DESCRIPTION, PlanPropertiesFormService } from './plan-properties-form-service.ts';

@Component({
  selector: 'ck-field-description',
  imports: [ReactiveFormsModule, MatInputModule],
  template: `
    <div class="mt-4 grid grid-cols-[1fr]" [formGroup]="form">
      <mat-form-field floatLabel="auto">
        <mat-label>Description</mat-label>
        <textarea
          matInput
          style="resize:none"
          [formControlName]="controlName"
          placeholder="Add a description here..."
          rows="5"></textarea>
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldDescription {
  readonly form = inject(PlanPropertiesFormService).form;
  readonly controlName = FIELD_DESCRIPTION;
}
