import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivityAction, ActivityDB, Plan } from '@util/data-types/index';
import { FieldActionName } from './fields/field-action-name';
import { FieldActionOffset } from './fields/field-action.offset';
import { FieldActionDirection } from './fields/field-action-direction';
import { FieldActionReferencePoint } from './fields/field-action-reference-point';
import { ActivityActionFormService } from './activity-action-form-service';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface ActivityActionDialogData {
  actionIndex: number;
  action: ActivityAction;
  activity: ActivityDB;
  plan: Plan;
}

export type ActivityActionDialogResult = { operation: 'save'; action: ActivityAction } | { operation: 'delete' };

@Component({
  selector: 'ck-activity-action-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
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
  private readonly dialogRef = inject(MatDialogRef<ActivityActionDialog, ActivityActionDialogResult>);
  protected readonly data: ActivityActionDialogData = inject(MAT_DIALOG_DATA);
  protected readonly formService = inject(ActivityActionFormService);

  readonly form = this.formService.form;

  ngOnInit(): void {
    this.formService.initialise(this.data.action, this.data.activity, this.data.plan);
  }

  deleteAction(ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();
    this.dialogRef.close({ operation: 'delete' });
  }

  saveAction(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close({ operation: 'save', action: this.formService.getActivityActionFromForm() });
  }

  // getErrorMessage(): string {
  //   if (this.form.controls.name.errors?.['invalidActionTime']) {
  //     return 'Action before time window or after plan end';
  //   }
  //   return '';
  // }
}
