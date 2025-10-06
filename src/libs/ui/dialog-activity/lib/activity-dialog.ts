import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivityFormService } from './activity-form-service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivityDB } from '@util/data-types/index';
import { ActivityDialogData } from './types/activities-dialog-data';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FieldName } from './field-name/field-name';
import { FieldTimeDuration } from './field-time-duration/field-time-duration';
import { FieldColor } from './field-color/field-color';
import { FieldResource } from './field-resource/field-resource';
import { FieldDescription } from './field-description/field-description';
import { FieldStartEndMessages } from './field-start-end-messages/field-start-end-messages';
import { FieldActions } from './field-actions/field-actions';

@Component({
  selector: 'ck-activity-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    FieldName,
    FieldTimeDuration,
    FieldColor,
    FieldResource,
    FieldActions,
    FieldDescription,
    FieldStartEndMessages,
  ],
  templateUrl: './activity-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActivityFormService],
})
export class ActivityDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ActivityDialog, ActivityDB>);
  protected readonly formService = inject(ActivityFormService);
  protected readonly data: ActivityDialogData = inject(MAT_DIALOG_DATA);

  protected readonly form = this.formService.form;

  // Lifecyle methods
  // ----------------

  ngOnInit(): void {
    this.formService.initialise(this.data.activity, this.data.plan);
  }

  // User actions
  // ------------

  saveActivity(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.formService.getActivityFromForm());
  }
}
