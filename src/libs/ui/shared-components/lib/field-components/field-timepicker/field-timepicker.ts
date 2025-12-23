import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { FieldError } from '../field-error';

@Component({
  selector: 'ck-field-timepicker',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTimepickerModule],
  templateUrl: './field-timepicker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTimepicker {
  form = input.required<FormGroup>();
  controlName = input.required<string>();
  controlLabel = input<string>('Time');
  errors = input<FieldError[]>([]);
  pickerInterval = input<string>('30m');

  protected errorMessage = computed(() => {
    const errors = this.errors();
    const controlName = this.controlName();
    const form = this.form();
    for (let i = 0; i < errors.length; i++) {
      const errorName = errors[i].errorName;
      if (errorName && form.get(controlName)?.errors?.[errorName]) {
        return errors[i].errorString;
      }
    }
    return '';
  });
}
