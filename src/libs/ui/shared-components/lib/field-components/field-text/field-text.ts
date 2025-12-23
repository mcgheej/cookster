import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldError } from '../field-error';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ck-field-text',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './field-text.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldText {
  form = input.required<FormGroup>();
  controlName = input.required<string>();
  controlLabel = input.required<string>();
  errors = input<FieldError[]>([]);
  placeholder = input<string>('');

  protected errorMessage = computed(() => {
    const errors = this.errors();
    const controlName = this.controlName();
    const form = this.form();
    for (let i = 0; i < errors.length; i++) {
      const errorName = errors[i].errorName;
      if (errorName && form.get(controlName)?.errors?.[errorName]) {
        console.log('Returning error message for', errorName, errors[i].errorString);
        return errors[i].errorString;
      }
    }
    return '';
  });
}
