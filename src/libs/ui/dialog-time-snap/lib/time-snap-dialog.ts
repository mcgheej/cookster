import { ChangeDetectionStrategy, Component, inject, OnInit, Resource } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FORM_FIELD_SNAP_TO, TimeSnapFormService } from './time-snap-form';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TIME_SNAP_MINS_VALUES } from '@util/app-config/lib/constants';

@Component({
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './time-snap-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TimeSnapFormService],
})
export class TimeSnapDialog implements OnInit {
  dialogRef = inject(MatDialogRef<TimeSnapDialog>);
  formService = inject(TimeSnapFormService);
  private readonly timeSnapMins: number = inject(MAT_DIALOG_DATA);

  readonly form = this.formService.form;
  controlName = FORM_FIELD_SNAP_TO;
  snapToValues = TIME_SNAP_MINS_VALUES;

  ngOnInit(): void {
    this.formService.initialiseForm(this.timeSnapMins);
  }

  onClose(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.formService.getSnapTo());
  }
}
