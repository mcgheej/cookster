import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PlanProperties } from '@util/data-types/index';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FieldDate } from './fields/field-date';
import { FieldKitchen } from './fields/field-kitchen';
import { PlanPropertiesFormService } from './plan-properties-form-service';
import { FieldColor, FieldError, FieldText, FieldTextarea } from '@ui/shared-components/index';
import { DEFAULT_PLAN_COLOR } from '@util/app-config/index';

@Component({
  selector: 'ck-plan-properties-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FieldDate,
    FieldKitchen,
    FieldText,
    FieldTextarea,
    FieldColor,
  ],
  template: `
    <h2 mat-dialog-title>{{ planProperties.id ? 'Edit Plan Properties' : 'Create Plan Properties' }}</h2>
    <form [formGroup]="form" (ngSubmit)="saveProperties()">
      <div class="mt-[3px] px-6">
        <ck-field-text
          [form]="form"
          controlName="name"
          controlLabel="Plan Name"
          placeholder="Name your plan..."
          [errors]="nameErrors" />
        <div class="mt-3 grid grid-cols-[10fr_6fr] gap-4">
          <ck-field-date></ck-field-date>
          <ck-field-color
            [form]="form"
            controlName="planColor"
            controlLabel="Color"
            [defaultColor]="defaultPlanColor" />
        </div>
        @if (!planProperties.id) {
          <div class="grid grid-cols-[3fr_1fr] gap-4">
            <ck-field-kitchen></ck-field-kitchen>
            <div></div>
          </div>
        }
        <div class="mt-3 grid grid-cols-1">
          <ck-field-textarea
            [form]="form"
            controlName="planDescription"
            controlLabel="Description"
            placeholder="Add a description here..." />
        </div>
      </div>
      <mat-dialog-actions [align]="'end'" [style.padding-right.px]="24">
        <button matButton [mat-dialog-close]="undefined">Cancel</button>
        <button matButton [disabled]="form.invalid" type="submit">Save</button>
      </mat-dialog-actions>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlanPropertiesFormService],
})
export class PlanPropertiesDialog implements OnInit {
  private readonly formService = inject(PlanPropertiesFormService);
  private readonly dialogRef: MatDialogRef<PlanPropertiesDialog, Partial<PlanProperties>> = inject(MatDialogRef);
  protected readonly planProperties: PlanProperties = inject(MAT_DIALOG_DATA);

  protected form = this.formService.form;

  protected readonly nameErrors: FieldError[] = [{ errorName: 'required', errorString: 'Name is required' }] as const;

  protected readonly defaultPlanColor = DEFAULT_PLAN_COLOR;

  ngOnInit() {
    this.formService.initialise(this.planProperties);
  }

  saveProperties() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.planProperties.id) {
      this.dialogRef.close(this.formService.savePlanProperties(this.planProperties));
    } else {
      this.dialogRef.close(this.formService.createPlanProperties());
    }
  }
}
