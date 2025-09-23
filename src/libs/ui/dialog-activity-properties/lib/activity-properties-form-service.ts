import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DEFAULT_SNACKBAR_DURATION, defaultGoogleColor, INITIAL_ACTIVITY_DURATION_MINS } from '@util/app-config/index';
import { ActivityAction, ActivityDB, Plan, PlanKitchenResource, PlanProperties } from '@util/data-types/index';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { exceedsMaxParallelActivities } from '@util/tiler/index';
import { subMinutes } from 'date-fns';

export const F_NAME = 'name';
export const F_START_TIME = 'startTime';
export const F_DURATION = 'duration';
export const F_COLOR = 'color';
export const F_RESOURCE = 'resource';
export const F_DESCRIPTION = 'description';

const defaultResource: PlanKitchenResource = {
  index: 0,
  name: 'Workspace',
  maxParallelActivities: 1,
  description: '',
  actions: [],
};

@Injectable()
export class ActivityPropertiesFormService {
  private readonly snackBar = inject(MatSnackBar);

  readonly form = inject(FormBuilder).group({
    [F_NAME]: ['', [Validators.required]],
    [F_START_TIME]: [new Date(), [Validators.required]],
    [F_DURATION]: [new Date(0, 0, 0, 0, INITIAL_ACTIVITY_DURATION_MINS), [Validators.required]],
    [F_COLOR]: [defaultGoogleColor, [Validators.required]],
    [F_RESOURCE]: [defaultResource, [Validators.required]],
    [F_DESCRIPTION]: [''],
  });

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
      actions: [...activity.actions],
      color: f.get(F_COLOR)?.value ?? defaultGoogleColor,
    } as ActivityDB;
  }
}
