import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivityPropertiesFormService, F_NAME } from '../activity-properties-form-service';

@Component({
  selector: 'ck-field-name',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './field-name.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldName {
  readonly form = inject(ActivityPropertiesFormService).form;
  readonly controlName = F_NAME;
}
