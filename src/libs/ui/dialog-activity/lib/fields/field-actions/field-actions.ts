import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import {
  ActivityAction,
  activityActionAfterPlanEnd,
  activityActionOutsideValidTimePeriod,
  activityActionText,
  activityActionTime,
  ActivityDB,
  Plan,
} from '@util/data-types/index';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { format } from 'date-fns';
import {
  ActivityActionDialog,
  ActivityActionDialogData,
  ActivityActionDialogResult,
} from '@ui/dialog-activity-action/index';

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
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FieldActions,
    },
  ],
})
export class FieldActions implements ControlValueAccessor, Validator, OnChanges {
  private readonly dialog = inject(MatDialog);

  // Inputs and outputs
  // -------------------
  readonly plan = input.required<Plan>();
  readonly activity = input.required<ActivityDB>();

  protected actions: ActivityAction[] = [];
  protected actionsSignal = signal<ActivityAction[]>([]);

  protected readonly actionSummaries = computed(() => {
    const actionsCopy = this.actionsSignal();
    const activity = this.activity();
    const plan = this.plan();
    return actionsCopy.map((a) => {
      const actionTime = activityActionTime(a, activity.startTimeOffset, activity.duration, plan.properties.endTime);
      const isInvalid = activityActionOutsideValidTimePeriod(
        a,
        activity.startTimeOffset,
        activity.duration,
        plan.properties.endTime,
        plan.properties.timeWindow
      );
      return {
        text: '[' + format(actionTime, 'HH:mm') + '] ' + activityActionText(a),
        color: isInvalid ? 'var(--mat-sys-error)' : 'var(--mat-sys-on-surface-variant)',
        invalid: isInvalid,
      };
    });
  });
  protected readonly errorText = computed(() => {
    const actionSummaries = this.actionSummaries();
    const invalid = actionSummaries.reduce((acc, curr, idx) => {
      return acc || curr.invalid;
    }, false);
    return invalid ? 'One or more actions are scheduled outside valid time period' : '';
  });

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  private onChange = (actions: ActivityAction[]) => {};
  private onTouched = () => {};
  private onValidatorChange = () => {};

  private touched = false;
  private disabled = false;

  // private onValidatorChange = () => {};

  // Lifecycle hooks
  // ---------------
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activity']) {
      const currStartTimeOffset = (changes['activity'].currentValue as ActivityDB).startTimeOffset;
      const prevStartTimeOffset = (changes['activity'].previousValue as ActivityDB | undefined)?.startTimeOffset;
      const currDuration = (changes['activity'].currentValue as ActivityDB).duration;
      const prevDuration = (changes['activity'].previousValue as ActivityDB | undefined)?.duration;
      if (prevStartTimeOffset && prevStartTimeOffset !== currStartTimeOffset) {
        this.onValidatorChange();
      } else if (prevDuration && prevDuration !== currDuration) {
        this.onValidatorChange();
      }
    }
    if (changes['plan']) {
      const currEndTime = (changes['plan'].currentValue as Plan).properties.endTime;
      const prevEndTime = (changes['plan'].previousValue as Plan | undefined)?.properties.endTime;
      if (prevEndTime && prevEndTime !== currEndTime) {
        this.onValidatorChange();
      }
    }
    // this.onValidatorChange();
  }

  // User interaction
  // ----------------
  onAddAction(ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();

    // Need to call the markAsTouched method.
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
          height: '420px',
          data: {
            actionIndex: -1,
            action: { name: 'New Action', timeOffset: 30, referencePoint: 'start' } as ActivityAction,
            activity,
            plan,
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

    const plan = this.plan();
    const activity = this.activity();
    if (!this.disabled && activity && plan) {
      const dialogRef: MatDialogRef<ActivityActionDialog, ActivityActionDialogResult> = this.dialog.open(
        ActivityActionDialog,
        {
          width: '500px',
          maxHeight: '100vh',
          height: '420px',
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

  // Validator interface
  // -------------------
  registerOnValidatorChange(onValidatorChange: () => void): void {
    this.onValidatorChange = onValidatorChange;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const activity = this.activity();
    const plan = this.plan();
    const actions = control.value as ActivityAction[];

    let invalidActions = false;
    const invalidFlags = actions.map((a) => {
      if (activityActionAfterPlanEnd(a, activity.startTimeOffset, activity.duration, plan.properties.endTime)) {
        invalidActions = true;
        return true;
      }
      return false;
    });

    if (invalidActions) {
      return { actionAfterPlanEnd: { invalidFlags } };
    }

    return null;
  }
}
