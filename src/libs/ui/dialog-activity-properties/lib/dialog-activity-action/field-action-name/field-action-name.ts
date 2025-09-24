import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityActionFormService, F_ACTION_NAME } from '../activity-action-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ck-field-action-name',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './field-action-name.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActionName {
  readonly form = inject(ActivityActionFormService).form;
  readonly controlName = F_ACTION_NAME;
}
