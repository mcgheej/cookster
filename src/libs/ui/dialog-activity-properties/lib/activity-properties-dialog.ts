import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivityDB, Plan } from '@util/data-types/index';
import { ActivityPropertiesFormService } from './activity-properties-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldName } from './field-name/field-name';
import { FieldTimeDuration } from './field-time-duration/field-time-duration';
import { FieldColor } from './field-color/field-color';
import { FieldResource } from './field-resource/field-resource';
import { FieldDescription } from './field-description/field-description';
import { FieldActions } from './field-actions/field-actions';

export interface ActivityDialogData {
  activity: ActivityDB;
  plan: Plan;
}

@Component({
  selector: 'ck-activity-properties-dialog',
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
  ],
  templateUrl: './activity-properties-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActivityPropertiesFormService],
})
export class ActivityPropertiesDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ActivityPropertiesDialog, ActivityDB>);
  private readonly formService = inject(ActivityPropertiesFormService);
  protected readonly data: ActivityDialogData = inject(MAT_DIALOG_DATA);

  protected readonly form = this.formService.form;

  ngOnInit(): void {
    this.formService.initialise(this.data.activity, this.data.plan);
  }

  saveActivity(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.formService.getActivity());
  }
}
