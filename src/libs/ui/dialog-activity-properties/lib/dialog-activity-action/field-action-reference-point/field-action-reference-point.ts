import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityActionFormService, F_ACTION_REFERENCE_POINT } from '../activity-action-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'ck-field-action-reference-point',
  imports: [ReactiveFormsModule, MatButtonToggleModule],
  templateUrl: './field-action-reference-point.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActionReferencePoint {
  readonly form = inject(ActivityActionFormService).form;
  readonly controlName = F_ACTION_REFERENCE_POINT;
}
