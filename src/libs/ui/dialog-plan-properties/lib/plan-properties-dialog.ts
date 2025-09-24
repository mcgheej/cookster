import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PlanProperties } from '@util/data-types/index';
import { PlanPropertiesFormService } from './plan-properties-form-service.ts';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldName } from './field-name.js';
import { MatButtonModule } from '@angular/material/button';
import { FieldDate } from './field-date.js';
import { FieldColor } from './field-color.js';
import { FieldKitchen } from './field-kitchen.js';
import { FieldDescription } from './field-description.js';

@Component({
  selector: 'ck-plan-properties-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FieldName,
    FieldDate,
    FieldColor,
    FieldKitchen,
    FieldDescription,
  ],
  template: `
    <h2 mat-dialog-title>{{ planProperties.id ? 'Edit Plan Properties' : 'Create Plan Properties' }}</h2>
    <form [formGroup]="form" (ngSubmit)="saveProperties()">
      <div class="p-4">
        <ck-field-name></ck-field-name>
        <div class="grid grid-cols-[10fr_6fr] gap-4">
          <ck-field-date></ck-field-date>
          <ck-field-color></ck-field-color>
        </div>
        @if (planProperties.id) {
          <ck-field-description></ck-field-description>
        } @else {
          <div class="grid grid-cols-[3fr_1fr] gap-4">
            <ck-field-kitchen></ck-field-kitchen>
            <div></div>
          </div>
          <ck-field-description></ck-field-description>
        }
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
