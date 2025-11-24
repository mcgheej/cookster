import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'tfx-snack-confirm-delete',
  imports: [CommonModule],
  template: `
    <div class="w-full flex items-center">
      <div class="text-white text-base grow select-none">Delete resource?</div>
      <button mat-button class="w-16 cursor-pointer mr-1" (click)="onCancel()">cancel</button>
      <button mat-button class="w-16 cursor-pointer" (click)="onDelete()">DELETE</button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackConfirmDelete {
  private snackBarRef = inject(MatSnackBarRef);

  onDelete() {
    this.snackBarRef.dismissWithAction();
  }

  onCancel() {
    this.snackBarRef.dismiss();
  }
}
