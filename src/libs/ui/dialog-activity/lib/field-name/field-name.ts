import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivityFormService } from '../activity-form-service';

@Component({
  selector: 'ck-field-name',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './field-name.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldName {
  readonly form = inject(ActivityFormService).form;
  readonly controlName = 'name';
}
