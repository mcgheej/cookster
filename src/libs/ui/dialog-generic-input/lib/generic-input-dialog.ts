import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FORM_FIELD_INPUT_STRING, GenericInputFormService } from './generic-input-form';
import { FieldInputStringComponent } from './field-input-string/field-input-string';

export interface GenericInputDialogData {
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputValue: string;
}

@Component({
  selector: 'tfx-generic-input-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, FieldInputStringComponent],
  templateUrl: './generic-input-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GenericInputFormService],
})
export class GenericInputDialog {
  data: GenericInputDialogData = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<GenericInputDialog, string | undefined>);
  formService = inject(GenericInputFormService);

  readonly form = this.formService.form;

  ngOnInit(): void {
    this.formService.initialiseForm();
  }

  onClose(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.get(FORM_FIELD_INPUT_STRING)?.value ?? '');
  }
}
