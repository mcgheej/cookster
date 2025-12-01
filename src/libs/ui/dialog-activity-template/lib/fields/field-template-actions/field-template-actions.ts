import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ActivityActionDialog,
  ActivityActionDialogData,
  ActivityActionDialogResult,
} from '@ui/dialog-activity-action/index';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { ActivityAction, activityActionText } from '@util/data-types/index';

@Component({
  selector: 'ck-field-template-actions',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './field-template-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FieldTemplateActions,
    },
  ],
})
export class FieldTemplateActions implements ControlValueAccessor {
  private readonly dialog = inject(MatDialog);

  protected actions: ActivityAction[] = [];
  protected actionsSignal = signal<ActivityAction[]>([]);

  protected readonly actionSummaries = computed(() => {
    const actionsCopy = this.actionsSignal();
    return actionsCopy.map((a) => activityActionText(a));
  });

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  private onChange = (actions: ActivityAction[]) => {};
  private onTouched = () => {};

  private touched = false;
  private disabled = false;

  // User interaction
  // ----------------
  onAddAction(ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();

    // Need to call the markAsTouched method.
    if (!this.disabled) {
      // If an action is added then need to call the onChange callback. Will need to do similar
      // if an action is modified or removed.
      const dialogRef: MatDialogRef<ActivityActionDialog, ActivityActionDialogResult> = this.dialog.open(
        ActivityActionDialog,
        {
          width: '500px',
          maxHeight: '100vh',
          height: '600px',
          data: {
            actionIndex: -1,
            action: { name: 'New Action', timeOffset: 30, referencePoint: 'start' } as ActivityAction,
          } as ActivityActionDialogData,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.operation === 'save') {
          this.markAsTouched();
          const updatedActions = [...this.actions, ...[result.action]];
          this.actions = updatedActions;
          this.actionsSignal.set(updatedActions);
          this.onChange(this.actions);
        }
      });
    }
  }

  onEditAction(ev: MouseEvent, actionIndex: number): void {
    ev.stopPropagation();
    ev.preventDefault();

    if (!this.disabled) {
      const dialogRef: MatDialogRef<ActivityActionDialog, ActivityActionDialogResult> = this.dialog.open(
        ActivityActionDialog,
        {
          width: '500px',
          maxHeight: '100vh',
          height: '600px',
          data: {
            actionIndex,
            action: this.actions[actionIndex],
          } as ActivityActionDialogData,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.operation === 'save') {
            this.markAsTouched();
            const updatedActions = [...this.actions];
            updatedActions[actionIndex] = result.action;
            this.actions = updatedActions;
            this.actionsSignal.set(updatedActions);
            this.onChange(this.actions);
          } else if (result.operation === 'delete') {
            this.markAsTouched();
            const updatedActions = [...this.actions];
            updatedActions.splice(actionIndex, 1);
            this.actions = updatedActions;
            this.actionsSignal.set(updatedActions);
            this.onChange(this.actions);
          }
        }
      });
    }
  }

  // ControlValueAccessor
  // --------------------
  writeValue(actions: ActivityAction[]): void {
    this.actions = actions;
    this.actionsSignal.set(actions);
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
