import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivityFormService } from './activity-form-service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivityDB, Plan } from '@util/data-types/index';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FieldResource } from './fields/field-resource';
import { FieldActions } from './fields/field-actions/field-actions';
import { FieldColor, FieldError, FieldText, FieldTextarea, FieldTimepicker } from '@ui/shared-components/index';
import { DEFAULT_ACTIVITY_COLOR } from '@util/app-config/index';

export interface ActivityDialogData {
  plan: Plan;
  activity: ActivityDB;
}

@Component({
  selector: 'ck-activity-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    FieldResource,
    FieldActions,
    FieldTimepicker,
    FieldText,
    FieldTextarea,
    FieldColor,
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

  protected readonly nameErrors: FieldError[] = [{ errorName: 'required', errorString: 'Name is required' }] as const;

  protected defaultActivityColor = DEFAULT_ACTIVITY_COLOR;

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
