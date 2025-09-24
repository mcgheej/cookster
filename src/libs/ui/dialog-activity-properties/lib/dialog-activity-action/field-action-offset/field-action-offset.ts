import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityActionFormService, F_ACTION_OFFSET } from '../activity-action-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ck-field-action-offset',
  imports: [ReactiveFormsModule, MatInputModule],
  templateUrl: './field-action-offset.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActionOffset {
  readonly form = inject(ActivityActionFormService).form;
  readonly controlName = F_ACTION_OFFSET;
}
