import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'ck-delete-activity-snack',
  imports: [CommonModule],
  template: `
    <div class="w-full flex items-center">
      <div class="text-white text-base grow">{{ title }}:</div>
      <button mat-button class="w-16" (click)="onCancel()">Cancel</button>
      <button mat-button color="accent" class="w-16" (click)="onDelete()">DELETE</button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteActivitySnack {
  private snackBarRef = inject(MatSnackBarRef);

  title: string = inject(MAT_SNACK_BAR_DATA);

  onDelete() {
    this.snackBarRef.dismissWithAction();
  }

  onCancel() {
    this.snackBarRef.dismiss();
  }
}
