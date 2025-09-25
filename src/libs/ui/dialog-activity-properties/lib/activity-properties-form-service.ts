import { inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DEFAULT_SNACKBAR_DURATION, defaultGoogleColor, INITIAL_ACTIVITY_DURATION_MINS } from '@util/app-config/index';
import { ActivityAction, ActivityDB, Plan, PlanKitchenResource, PlanProperties } from '@util/data-types/index';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { exceedsMaxParallelActivities } from '@util/tiler/index';
import { addMinutes, isAfter, isValid, subMinutes } from 'date-fns';
import {
  ActivityActionDialog,
  ActivityActionDialogData,
  ActivityActionDialogResult,
} from './dialog-activity-action/activity-action-dialog';

export const F_NAME = 'name';
export const F_START_TIME = 'startTime';
export const F_DURATION = 'duration';
export const F_COLOR = 'color';
export const F_RESOURCE = 'resource';
export const F_DESCRIPTION = 'description';
export const F_START_MESSAGE = 'startMessage';
export const F_END_MESSAGE = 'endMessage';

const defaultResource: PlanKitchenResource = {
  index: 0,
  name: 'Workspace',
  maxParallelActivities: 1,
  description: '',
  actions: [],
};

@Injectable()
export class ActivityPropertiesFormService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = inject(FormBuilder).group(
    {
      [F_NAME]: ['', [Validators.required]],
      [F_START_TIME]: [new Date(), [Validators.required]],
      [F_DURATION]: [new Date(0, 0, 0, 0, INITIAL_ACTIVITY_DURATION_MINS), [Validators.required]],
      [F_COLOR]: [defaultGoogleColor, [Validators.required]],
      [F_RESOURCE]: [defaultResource, [Validators.required]],
      [F_DESCRIPTION]: [''],
      [F_START_MESSAGE]: [''],
      [F_END_MESSAGE]: [''],
    },
    { validators: [this.validateActivityBeforePlanEnd()] }
  );

  readonly kitchenResources = signal<PlanKitchenResource[]>([]);

  private plan: Plan | null = null;
  private activity: ActivityDB | null = null;
  readonly actions = signal<ActivityAction[]>([]);

  initialise(activity: ActivityDB, plan: Plan) {
    this.activity = activity;
    this.plan = plan;
    this.actions.set([...activity.actions]);
    this.kitchenResources.set(plan.properties.kitchenResources);
    this.loadFormData(this.form, activity, plan.properties);
  }

  addAction(): void {
    if (!this.activity || !this.plan) {
      return undefined;
    }
    const dialogRef: MatDialogRef<ActivityActionDialog, ActivityActionDialogResult> = this.dialog.open(
      ActivityActionDialog,
      {
        width: '500px',
        maxHeight: '100vh',
        height: '600px',
        data: {
          actionIndex: -1,
          action: { name: 'New Action', timeOffset: 30, referencePoint: 'start' } as ActivityAction,
          activity: this.getActivityFromForm(this.activity, this.plan?.properties.endTime, this.form),
          plan: this.plan,
        } as ActivityActionDialogData,
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.operation === 'save') {
          const updatedActions = [...this.actions(), ...[result.action]];
          this.actions.set(updatedActions);
        }
      }
    });
  }

  editAction(actionIndex: number): void {
    if (!this.activity || !this.plan) {
      return undefined;
    }
    const dialogRef: MatDialogRef<ActivityActionDialog, ActivityActionDialogResult> = this.dialog.open(
      ActivityActionDialog,
      {
        width: '500px',
        maxHeight: '100vh',
        height: '600px',
        data: {
          actionIndex,
          action: this.actions()[actionIndex],
          activity: this.getActivityFromForm(this.activity, this.plan?.properties.endTime, this.form),
          plan: this.plan,
        } as ActivityActionDialogData,
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.operation === 'save') {
          const updatedActions = [...this.actions()];
          updatedActions[actionIndex] = result.action;
          this.actions.set(updatedActions);
        } else if (result.operation === 'delete') {
          const updatedActions = [...this.actions()];
          updatedActions.splice(actionIndex, 1);
          this.actions.set(updatedActions);
        }
      }
    });
  }

  getActivity(): ActivityDB | undefined {
    if (!this.activity || !this.plan) {
      return undefined;
    }
    const newActivity = this.getActivityFromForm(this.activity, this.plan.properties.endTime, this.form);
    const activitiesInLane = this.plan.activities.filter(
      (a) => a.resourceIndex === newActivity.resourceIndex && a.id !== newActivity.id
    );
    if (exceedsMaxParallelActivities(newActivity, activitiesInLane, this.plan)) {
      this.snackBar.open('Max parallel activities exceeded for this resource.', undefined, {
        duration: DEFAULT_SNACKBAR_DURATION,
      });
      return undefined;
    }
    return newActivity;
  }

  private loadFormData(form: FormGroup, activity: ActivityDB, plan: PlanProperties) {
    const startTime = subMinutes(plan.endTime, activity.startTimeOffset);
    const duration = new Date(0, 0, 0, 0, activity.duration);
    form.get(F_NAME)?.setValue(activity.name);
    form.get(F_START_TIME)?.setValue(startTime);
    form.get(F_DURATION)?.setValue(duration);
    form.get(F_COLOR)?.setValue(activity.color || defaultGoogleColor);
    form.get(F_RESOURCE)?.setValue(plan.kitchenResources[activity.resourceIndex] || defaultResource);
    form.get(F_DESCRIPTION)?.setValue(activity.description);
    form.get(F_START_MESSAGE)?.setValue(activity.startMessage || '');
    form.get(F_END_MESSAGE)?.setValue(activity.endMessage || '');
  }

  private getActivityFromForm(activity: ActivityDB, planEnd: Date, f: FormGroup): ActivityDB {
    const durationValue = f.get(F_DURATION)?.value;
    const duration = durationValue ? getMinutesSinceMidnight(durationValue) : INITIAL_ACTIVITY_DURATION_MINS;
    const startTimeValue = f.get(F_START_TIME)?.value;
    const startTimeOffset = startTimeValue
      ? getMinutesSinceMidnight(planEnd) - getMinutesSinceMidnight(startTimeValue)
      : duration;
    return {
      id: activity.id,
      name: f.get(F_NAME)?.value ?? 'unknown',
      description: f.get(F_DESCRIPTION)?.value ?? '',
      duration,
      startTimeOffset,
      planId: activity.planId,
      resourceIndex: f.get(F_RESOURCE)?.value.index ?? 0,
      actions: this.actions(),
      color: f.get(F_COLOR)?.value ?? defaultGoogleColor,
      startMessage: f.get(F_START_MESSAGE)?.value ?? '',
      endMessage: f.get(F_END_MESSAGE)?.value ?? '',
    } as ActivityDB;
  }

  private validateActivityBeforePlanEnd(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startTime = control.get(F_START_TIME)?.value as Date;
      const duration = control.get(F_DURATION)?.value as Date;
      if (isValid(startTime) && isValid(duration) && this.plan) {
        const isValid = !isAfter(
          addMinutes(startTime, getMinutesSinceMidnight(duration)),
          this.plan.properties.endTime
        );
        if (control.get(F_START_TIME)?.errors) {
          if (isValid) {
            delete control.get(F_START_TIME)?.errors?.['outsidePlan'];
            if (isEmpty(control.get(F_START_TIME)?.errors)) {
              control.get(F_START_TIME)?.setErrors(null);
            }
          } else {
            control.get(F_START_TIME)?.setErrors({ outsidePlan: true });
          }
        } else {
          control.get(F_START_TIME)?.setErrors(isValid ? null : { outsidePlan: true });
        }
      }
      return null;
    };
  }
}

function isEmpty(obj: any): boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}
