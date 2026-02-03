import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { KitchenResourceFormService } from './kitchen-resource-form-service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { KitchenResourceDB } from '@util/data-types/index';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField } from '@angular/forms/signals';

export type KitchenResourceDialogResult = { operation: 'save'; resource: KitchenResourceDB } | { operation: 'delete' };

@Component({
  selector: 'ck-kitchen-resource-dialog',
  imports: [CommonModule, MatFormFieldModule, MatButtonModule, MatDialogModule, MatInputModule, FormField],
  templateUrl: './kitchen-resource-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KitchenResourceFormService],
})
export class KitchenResourceDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<KitchenResourceDialog, KitchenResourceDialogResult>);
  protected readonly data: KitchenResourceDB = inject(MAT_DIALOG_DATA);
  protected readonly formService = inject(KitchenResourceFormService);

  protected readonly form = this.formService.kitchenResourceForm;

  ngOnInit(): void {
    this.formService.initialise(this.data);
  }

  deleteResource(ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();
    this.dialogRef.close({ operation: 'delete' });
  }

  saveResource(ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();
    if (this.form().invalid()) {
      this.form().markAsTouched();
      return;
    }
    this.dialogRef.close({ operation: 'save', resource: this.getResourceFromForm() });
  }

  protected canSave(): boolean {
    return this.form().valid() && !this.formService.formEqualsResource(this.data);
  }

  private getResourceFromForm(): KitchenResourceDB {
    const formValue = this.form().value();
    return {
      id: this.data.id,
      name: formValue.name,
      description: formValue.description,
      kitchenId: this.data.kitchenId,
      maxParallelActivities: formValue.maxParallelActivities,
      seq: this.data.seq,
    };
  }
}
