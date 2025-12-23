import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivityFormService } from './activity-form-service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivityDB, Plan } from '@util/data-types/index';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FieldColor } from './fields/field-color';
import { FieldResource } from './fields/field-resource';
import { FieldDescription } from './fields/field-description';
import { FieldActions } from './fields/field-actions/field-actions';
import { FieldError, FieldText, FieldTimepicker } from '@ui/shared-components/index';

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
    FieldColor,
    FieldResource,
    FieldActions,
    FieldDescription,
    FieldTimepicker,
    FieldText,
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
