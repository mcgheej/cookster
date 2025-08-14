import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export interface ConfirmSnackData {
  title: string;
  actionButtonLabel: string;
  cancelButtonLabel?: string;
}

@Component({
  imports: [],
  template: `
    <div class="w-full flex items-center">
      <div class="text-white text-base grow select-none">{{ data.title }}</div>
      <button mat-button class="w-16 cursor-pointer" (click)="cancel()">
        {{ data.cancelButtonLabel ?? 'Cancel' }}
      </button>
      <button mat-button color="accent" class="w-16 cursor-pointer" (click)="confirm()">
        {{ data.actionButtonLabel }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmSnack {
  protected readonly data: ConfirmSnackData = inject(MAT_SNACK_BAR_DATA);
  private readonly snackBarRef = inject(MatSnackBarRef);

  protected confirm(): void {
    this.snackBarRef.dismissWithAction();
  }

  protected cancel(): void {
    this.snackBarRef.dismiss();
  }
}
