import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityActionFormService } from '../activity-action-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'ck-field-action-reference-point',
  imports: [ReactiveFormsModule, MatButtonToggleModule],
  template: `
    <div class="mt-[24px]" [formGroup]="form">
      <mat-button-toggle-group [formControlName]="controlName">
        <mat-button-toggle value="start">Start</mat-button-toggle>
        <mat-button-toggle value="end">End</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActionReferencePoint {
  readonly form = inject(ActivityActionFormService).form;
  readonly controlName = 'referencePoint';
}
