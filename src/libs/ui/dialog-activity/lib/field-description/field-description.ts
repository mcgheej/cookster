import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivityFormService } from '../activity-form-service';

@Component({
  selector: 'ck-field-description',
  imports: [ReactiveFormsModule, MatInputModule],
  templateUrl: './field-description.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldDescription {
  readonly form = inject(ActivityFormService).form;
  readonly controlName = 'description';
}
