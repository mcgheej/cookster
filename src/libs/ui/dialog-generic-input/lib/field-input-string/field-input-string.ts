import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FORM_FIELD_INPUT_STRING, GenericInputFormService } from '../generic-input-form';

@Component({
  selector: 'tfx-field-input-string',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './field-input-string.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldInputStringComponent implements OnInit {
  readonly form = inject(GenericInputFormService).form;

  inputLabel = input<string>('String Data');
  inputPlaceholder = input<string>('Enter a string value...');
  inputValue = input<string>('');

  readonly controlName = FORM_FIELD_INPUT_STRING;

  ngOnInit(): void {
    this.form.get(this.controlName)?.setValue(this.inputValue());
  }
}
