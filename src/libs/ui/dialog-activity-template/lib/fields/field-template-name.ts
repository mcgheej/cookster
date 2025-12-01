import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivityTemplateFormService } from '../activity-template-form-service';

@Component({
  selector: 'ck-field-template-name',
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
export class FieldTemplateName {
  readonly form = inject(ActivityTemplateFormService).form;
  readonly controlName = 'name';
}
