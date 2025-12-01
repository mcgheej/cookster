import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityActionFormService } from '../activity-action-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'ck-field-action-direction',
  imports: [ReactiveFormsModule, MatButtonToggleModule],
  template: `
    <div class="mt-[3px]" [formGroup]="form">
      <mat-button-toggle-group [formControlName]="controlName">
        <mat-button-toggle value="before">Before</mat-button-toggle>
        <mat-button-toggle value="after">After</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActionDirection {
  readonly form = inject(ActivityActionFormService).form;
  readonly controlName = 'direction';
}
