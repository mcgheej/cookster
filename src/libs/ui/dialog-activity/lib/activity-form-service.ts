import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DEFAULT_SNACKBAR_DURATION, defaultGoogleColor, INITIAL_ACTIVITY_DURATION_MINS } from '@util/app-config/index';
import {
  ActivityAction,
  ActivityDB,
  dummyActivity,
  dummyPlan,
  Plan,
  PlanKitchenResource,
  PlanProperties,
} from '@util/data-types/index';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { isEmptyObject } from '@util/misc-utilities/index';
import { exceedsMaxParallelActivities } from '@util/tiler/index';
import { addHours, addMinutes, isAfter, isBefore, isValid, startOfDay, subMinutes } from 'date-fns';

// export const F_NAME = 'name';
// export const F_START_TIME = 'startTime';
// export const F_DURATION = 'duration';
// export const F_COLOR = 'color';
// export const F_RESOURCE = 'resource';
// export const F_ACTIONS = 'actions';
// export const F_DESCRIPTION = 'description';
// export const F_START_MESSAGE = 'startMessage';
// export const F_END_MESSAGE = 'endMessage';

const defaultResource: PlanKitchenResource = {
  index: 0,
  name: 'Workspace',
  maxParallelActivities: 1,
  description: '',
  actions: [],
};

@Injectable()
export class ActivityFormService {
  private readonly snackBar = inject(MatSnackBar);

  // Define the form structure and validation requirements
  readonly form = inject(NonNullableFormBuilder).group(
    {
      name: ['', [Validators.required]],
      startTime: [new Date(), [Validators.required]],
      duration: [new Date(0, 0, 0, 0, INITIAL_ACTIVITY_DURATION_MINS), [Validators.required]],
      color: [defaultGoogleColor, [Validators.required]],
      resource: [defaultResource, [Validators.required]],
      actions: [[] as ActivityAction[]],
      description: [''],
      startMessage: [''],
      endMessage: [''],
    },
    { validators: [this.validateActivityWithinValidTimePeriod()] }
  );

  private readonly formChanges = toSignal(this.form.valueChanges, { initialValue: undefined });

  // Convenience copy of the current plan. This is defined public and as a signal so that
  // it can be used in a field template to populate resource options.
  readonly plan = signal<Plan>(dummyPlan());

  // Convenience copy of the original activity - simple property as it is private to this service
  private activity: ActivityDB = dummyActivity();

  // Convenience copy of current form activity
  readonly formActivity = computed(() => {
    const plan = this.plan();
    const activity = this.activity;
    const formChanges = this.formChanges();
    return this.unloadFormData(activity, plan.properties.endTime);
  });

  // Public methods
  // --------------

  // Initialise the form using the current plan and activity
  initialise(activity: ActivityDB, plan: Plan): void {
    this.plan.set(plan);
    this.activity = activity;
    this.loadFormData(activity, plan.properties);
  }

  // Get new activity from form data
  getActivityFromForm(): ActivityDB | undefined {
    const plan = this.plan();
    const activity = this.activity;
    if (!plan || !activity) {
      return undefined;
    }

    // Now that we have the plan and original activity get new activity from form data
    const newActivity = this.unloadFormData(activity, plan.properties.endTime);

    // Check whether the new activty's time slot does not overlap with more than the allowed
    // number of parallel activities. Start by getting all of the activities, other than this one,
    // that are in the same lane (resource).
    const activitiesInLane = plan.activities.filter(
      (a) => a.resourceIndex === newActivity.resourceIndex && a.id !== newActivity.id
    );
    if (exceedsMaxParallelActivities(newActivity, activitiesInLane, plan)) {
      this.snackBar.open('Max parallel activities exceeded for this resource.', undefined, {
        duration: DEFAULT_SNACKBAR_DURATION,
      });
      return undefined;
    }
    return newActivity;
  }

  // Private methods
  // ---------------

  // Load form field data
  private loadFormData(activity: ActivityDB, planProps: PlanProperties): void {
    const f = this.form;
    const startTime = subMinutes(planProps.endTime, activity.startTimeOffset);
    const duration = new Date(0, 0, 0, 0, activity.duration);
    f.controls.name.setValue(activity.name);
    f.controls.startTime.setValue(startTime);
    f.controls.duration.setValue(duration);
    f.controls.color.setValue(activity.color || defaultGoogleColor);
    f.controls.resource.setValue(planProps.kitchenResources[activity.resourceIndex] || defaultResource);
    f.controls.actions.setValue(activity.actions);
    f.controls.description.setValue(activity.description);
    f.controls.startMessage.setValue(activity.startMessage || '');
    f.controls.endMessage.setValue(activity.endMessage || '');
  }

  private unloadFormData(activity: ActivityDB, planEnd: Date): ActivityDB {
    const f = this.form;

    // Get activity duration and startTimeOffset from form durationand start time fields
    const durationValue = f.controls.duration.value as Date;
    const duration = durationValue ? getMinutesSinceMidnight(durationValue) : INITIAL_ACTIVITY_DURATION_MINS;
    const startTimeValue = f.controls.startTime.value as Date;
    const startTimeOffset = startTimeValue
      ? getMinutesSinceMidnight(planEnd) - getMinutesSinceMidnight(startTimeValue)
      : duration;

    return {
      id: activity.id,
      name: f.controls.name.value ?? 'unknown',
      description: f.controls.description.value ?? '',
      duration,
      startTimeOffset,
      planId: activity.planId,
      resourceIndex: f.controls.resource.value.index ?? 0,
      actions: f.controls.actions.value ?? [],
      color: f.controls.color.value ?? defaultGoogleColor,
      startMessage: f.controls.startMessage.value ?? '',
      endMessage: f.controls.endMessage.value ?? '',
    } as ActivityDB;
  }

  private validateActivityWithinValidTimePeriod(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.form || !this.plan) {
        return null;
      }
      const plan = this.plan();
      const activityStartTime = this.form.controls.startTime.value;
      const duration = this.form.controls.duration.value;
      if (isValid(activityStartTime) && isValid(duration) && plan) {
        const activityEndTime = addMinutes(activityStartTime, getMinutesSinceMidnight(duration));
        const timeWindowStart = addHours(startOfDay(activityStartTime), plan.properties.timeWindow.startHours);
        const isInvalid =
          isBefore(activityStartTime, timeWindowStart) || isAfter(activityEndTime, plan.properties.endTime);
        if (this.form.controls.startTime.errors) {
          if (isInvalid) {
            this.form.controls.startTime.setErrors({ outsideValidPeriod: true });
          } else {
            delete this.form.controls.startTime.errors['outsideValidPeriod'];
            if (isEmptyObject(this.form.controls.startTime.errors)) {
              this.form.controls.startTime.setErrors(null);
            }
          }
        } else {
          this.form.controls.startTime.setErrors(isInvalid ? { outsideValidPeriod: true } : null);
        }
      }
      return null;
    };
  }
}
