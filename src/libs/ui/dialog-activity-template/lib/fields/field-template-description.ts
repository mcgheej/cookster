import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivityTemplateFormService } from '../activity-template-form-service';

@Component({
  selector: 'ck-field-template-description',
  imports: [ReactiveFormsModule, MatInputModule],
  template: `
    <div class="mt-3 grid grid-cols-[1fr]" [formGroup]="form">
      <mat-form-field floatLabel="auto">
        <mat-label>Description</mat-label>
        <textarea
          matInput
          style="resize: none"
          [formControlName]="controlName"
          placeholder="Add a description here..."
          rows="5"></textarea>
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTemplateDescription {
  readonly form = inject(ActivityTemplateFormService).form;
  readonly controlName = 'description';
}
