import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityActionFormService } from '../activity-action-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ck-field-action-offset',
  imports: [ReactiveFormsModule, MatInputModule],
  template: `
    <div class="mt-[3px] grid grid-cols-[1fr]" [formGroup]="form">
      <mat-form-field class="mat-headline-5">
        <input type="number" matInput [formControlName]="controlName" min="0" />
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActionOffset {
  readonly form = inject(ActivityActionFormService).form;
  readonly controlName = 'offset';
}
