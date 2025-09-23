import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityPropertiesFormService, F_DESCRIPTION } from '../activity-properties-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ck-field-description',
  imports: [ReactiveFormsModule, MatInputModule],
  templateUrl: './field-description.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldDescription {
  readonly form = inject(ActivityPropertiesFormService).form;
  readonly controlName = F_DESCRIPTION;
}
