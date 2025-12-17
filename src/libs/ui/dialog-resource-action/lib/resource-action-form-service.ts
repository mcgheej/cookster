import { inject, Injectable, signal } from '@angular/core';
import { NonNullableFormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { dummyPlan, Plan, ResourceAction } from '@util/data-types/index';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { isEmptyObject } from '@util/misc-utilities/index';
import { addHours, isAfter, isBefore, isValid, startOfDay, subMinutes } from 'date-fns';

@Injectable()
export class ResourceActionFormService {
  readonly form = inject(NonNullableFormBuilder).group(
    {
      name: ['', [Validators.required]],
      actionTime: [new Date(), [Validators.required]],
    },
    { validators: [this.validateResourceActionTime()] }
  );

  private readonly plan = signal<Plan>(dummyPlan());
  private readonly resourceAction = signal<ResourceAction | null>(null);

  initialise(resourceAction: ResourceAction, plan: Plan): void {
    this.plan.set(plan);
    this.resourceAction.set(resourceAction);
    this.loadFormData(resourceAction, plan);
  }

  getResourceActionFromForm(): ResourceAction | undefined {
    const plan = this.plan();
    if (!plan) {
      return undefined;
    }

    return this.unloadFormData(plan);
  }

  private loadFormData(resourceAction: ResourceAction, plan: Plan): void {
    const f = this.form;
    const { name, timeOffset } = resourceAction;
    const { endTime: planEnd } = plan.properties;
    const actionTime = subMinutes(planEnd, timeOffset);
    f.controls.name.setValue(name);
    f.controls.actionTime.setValue(actionTime);
  }

  private unloadFormData(plan: Plan): ResourceAction {
    const f = this.form;
    const { endTime: planEnd } = plan.properties;
    const prevActionTimeOffset = this.resourceAction()?.timeOffset || 0;
    const actionTimeValue = f.controls.actionTime.value as Date;
    const actionTimeOffset = actionTimeValue
      ? getMinutesSinceMidnight(planEnd) - getMinutesSinceMidnight(actionTimeValue)
      : prevActionTimeOffset;

    return {
      name: f.controls.name.value ?? 'unknown',
      timeOffset: actionTimeOffset,
    } as ResourceAction;
  }

  /**
   * Validate resource action is within the plan's time window and before the plan end.
   */
  private validateResourceActionTime(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.form || !this.plan) {
        return null;
      }

      const plan = this.plan();
      const f = this.form;
      const actionTime = f.controls.actionTime.value as Date;
      if (isValid(actionTime) && plan) {
        const { endTime: planEnd } = plan.properties;
        const { startHours: timeWindowStartHours } = plan.properties.timeWindow;
        const timeWindowStart = addHours(startOfDay(actionTime), timeWindowStartHours);
        const isInvalid = isBefore(actionTime, timeWindowStart) || isAfter(actionTime, planEnd);
        if (f.controls.actionTime.errors) {
          if (isInvalid) {
            f.controls.actionTime.setErrors({ invalidActionTime: true });
          } else {
            delete f.controls.actionTime.errors['invalidActionTime'];
            if (isEmptyObject(f.controls.actionTime.errors)) {
              f.controls.actionTime.setErrors(null);
            }
          }
        } else {
          f.controls.actionTime.setErrors(isInvalid ? { invalidActionTime: true } : null);
        }
      }
      return null;
    };
  }
}
