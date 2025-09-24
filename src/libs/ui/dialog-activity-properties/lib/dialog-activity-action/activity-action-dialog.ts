import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivityAction, Plan, ActivityDB, activityActionText } from '@util/data-types/index';
import { ActivityActionFormService } from './activity-action-form-service';
import { MatButtonModule } from '@angular/material/button';
import { FieldActionName } from './field-action-name/field-action-name';
import { FieldActionOffset } from './field-action-offset/field-action-offset';
import { FieldActionDirection } from './field-action-direction/field-action-direction';
import { FieldActionReferencePoint } from './field-action-reference-point/field-action-reference-point';

export interface ActivityActionDialogData {
  actionIndex: number;
  action: ActivityAction;
  activity: ActivityDB;
  plan: Plan;
}

@Component({
  selector: 'ck-activity-action-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    FieldActionName,
    FieldActionOffset,
    FieldActionDirection,
    FieldActionReferencePoint,
  ],
  templateUrl: './activity-action-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActivityActionFormService],
})
export class ActivityActionDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ActivityActionDialog, ActivityAction>);
  protected readonly data: ActivityActionDialogData = inject(MAT_DIALOG_DATA);
  protected readonly formService = inject(ActivityActionFormService);

  readonly form = this.formService.form;

  ngOnInit(): void {
    this.formService.initialise(this.data.action, this.data.activity, this.data.plan);
  }

  saveAction(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.formService.getAction());
  }
}
