import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ck-field-textarea',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="w-full grid grid-cols-1" [formGroup]="form()">
      <mat-form-field floatLabel="auto">
        <mat-label>{{ controlLabel() }}</mat-label>
        <textarea
          matInput
          style="resize: none"
          [formControlName]="controlName()"
          [placeholder]="placeholder()"
          [rows]="rows()"></textarea>
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTextarea {
  form = input.required<FormGroup>();
  controlName = input.required<string>();
  controlLabel = input.required<string>();
  rows = input<number>(5);
  placeholder = input<string>('');
}
