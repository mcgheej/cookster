import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivityFormService } from '../activity-form-service';

@Component({
  selector: 'ck-field-start-end-messages',
  imports: [ReactiveFormsModule, MatInputModule],
  templateUrl: './field-start-end-messages.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldStartEndMessages {
  readonly form = inject(ActivityFormService).form;
  readonly startMessageName = 'startMessage';
  readonly endMessageName = 'endMessage';
}
