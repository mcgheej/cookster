import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityActionFormService, F_ACTION_DIRECTION } from '../activity-action-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'ck-field-action-direction',
  imports: [ReactiveFormsModule, MatButtonToggleModule],
  templateUrl: './field-action-direction.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActionDirection {
  readonly form = inject(ActivityActionFormService).form;
  readonly controlName = F_ACTION_DIRECTION;
}
