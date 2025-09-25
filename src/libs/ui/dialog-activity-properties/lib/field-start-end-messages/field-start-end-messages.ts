import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityPropertiesFormService, F_END_MESSAGE, F_START_MESSAGE } from '../activity-properties-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ck-field-start-end-messages',
  imports: [ReactiveFormsModule, MatInputModule],
  templateUrl: './field-start-end-messages.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldStartEndMessages {
  readonly form = inject(ActivityPropertiesFormService).form;
  readonly startMessageName = F_START_MESSAGE;
  readonly endMessageName = F_END_MESSAGE;
}
