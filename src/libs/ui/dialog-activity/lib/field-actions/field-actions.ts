import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { ActivityAction, activityActionText, activityActionTime, ActivityDB, Plan } from '@util/data-types/index';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ActivityActionDialog,
  ActivityActionDialogData,
  ActivityActionDialogResult,
} from './dialog-activity-action/activity-action-dialog';
import { format } from 'date-fns';

@Component({
  selector: 'ck-field-actions',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './field-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FieldActions,
    },
  ],
})
export class FieldActions implements ControlValueAccessor {
  private readonly dialog = inject(MatDialog);

  readonly plan = input.required<Plan>();
  readonly activity = input.required<ActivityDB>();

  protected actions: ActivityAction[] = [];
  protected actionsSignal = signal<ActivityAction[]>([]);

  protected readonly actionSummaries = computed(() => {
    const actions = this.actionsSignal();
    const activity = this.activity();
    const plan = this.plan();
    return actions.map((a) => {
      const actionTime = activityActionTime(a, activity.startTimeOffset, activity.duration, plan.properties.endTime);
      return '[' + format(actionTime, 'HH:mm') + '] ' + activityActionText(a);
    });
  });

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  private onChange = (actions: ActivityAction[]) => {};
  private onTouched = () => {};

  private touched = false;
  private disabled = false;

  // private onValidatorChange = () => {};

  // User interaction
  // ----------------
  onAddAction(ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();

    // Need to call the markAsTouched method.
    this.markAsTouched();
    const plan = this.plan();
    const activity = this.activity();
    if (!this.disabled && activity && plan) {
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
            activity,
            plan,
          } as ActivityActionDialogData,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.operation === 'save') {
            const updatedActions = [...this.actions, ...[result.action]];
            this.actions = updatedActions;
            this.actionsSignal.set(updatedActions);
            this.onChange(this.actions);
          }
        }
      });
    }
  }

  onEditAction(ev: MouseEvent, actionIndex: number): void {
    ev.stopPropagation();
    ev.preventDefault();
    console.log('Edit action', actionIndex);

    this.markAsTouched();
    const plan = this.plan();
    const activity = this.activity();
    if (!this.disabled && activity && plan) {
      const dialogRef: MatDialogRef<ActivityActionDialog, ActivityActionDialogResult> = this.dialog.open(
        ActivityActionDialog,
        {
          width: '500px',
          maxHeight: '100vh',
          height: '600px',
          data: {
            actionIndex,
            action: this.actions[actionIndex],
            activity,
            plan,
          } as ActivityActionDialogData,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.operation === 'save') {
            const updatedActions = [...this.actions];
            updatedActions[actionIndex] = result.action;
            this.actions = updatedActions;
            this.actionsSignal.set(updatedActions);
            this.onChange(this.actions);
          } else if (result.operation === 'delete') {
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
