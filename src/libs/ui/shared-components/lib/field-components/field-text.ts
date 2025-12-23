import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldError } from './field-error';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ck-field-text',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="w-full grid grid-cols-1" [formGroup]="form()">
      <mat-form-field class="mat-headline-5" floatLabel="auto">
        <mat-label>{{ controlLabel() }}</mat-label>
        <input type="text" matInput [formControlName]="controlName()" [placeholder]="placeholder()" />
        @if (form().get(controlName())?.invalid && form().get(controlName())?.touched) {
          <mat-error class="w-full min-w-[200px] overflow-auto"> {{ errorMessage() }}</mat-error>
        }
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldText {
  form = input.required<FormGroup>();
  controlName = input.required<string>();
  controlLabel = input.required<string>();
  placeholder = input<string>('');
  errors = input<FieldError[]>([]);

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
