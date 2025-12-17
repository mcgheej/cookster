import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Plan, ResourceAction } from '@util/data-types/index';
import { ResourceActionFormService } from './resource-action-form-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

export interface ResourceActionDialogData {
  plan: Plan;
  resourceAction: ResourceAction;
}

export type ResourceActionDialogResult = { operation: 'save'; action: ResourceAction } | { operation: 'delete' };

@Component({
  selector: 'ck-resource-action-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
  ],
  templateUrl: './resource-action-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResourceActionFormService],
})
export class ResourceActionDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ResourceActionDialog, ResourceActionDialogResult>);
  private readonly formService = inject(ResourceActionFormService);
  private readonly data: ResourceActionDialogData = inject(MAT_DIALOG_DATA);

  protected readonly form = this.formService.form;

  // Lifecyle methods
  // ----------------

  ngOnInit(): void {
    this.formService.initialise(this.data.resourceAction, this.data.plan);
  }

  // User actions
  // ------------

  protected deleteAction(ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();
    this.dialogRef.close({ operation: 'delete' });
  }

  protected saveActivity(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close({ operation: 'save', action: this.formService.getResourceActionFromForm() });
  }

  // Protected methods
  // -----------------

  protected getErrorMessage(): string {
    if (this.form.controls.actionTime.errors?.['invalidActionTime']) {
      return 'Action time outside valid period';
    }
    return '';
  }
}
