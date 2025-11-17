import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivityAction, activityActionAfterPlanEnd, ActivityDB, Plan, ReferencePoint } from '@util/data-types/index';
import { isEmptyObject } from '@util/misc-utilities/index';

export type BeforeAfter = 'before' | 'after';

@Injectable()
export class ActivityActionFormService {
  readonly form = inject(NonNullableFormBuilder).group(
    {
      name: ['', [Validators.required]],
      offset: [0, [Validators.required]],
      direction: ['after' as BeforeAfter, [Validators.required]],
      referencePoint: ['start' as ReferencePoint, [Validators.required]],
    },
    { validators: [this.validateActionBeforePlanEnd()] }
  );

  private action: ActivityAction | null = null;
  private plan: Plan | null = null;
  private activity: ActivityDB | null = null;

  initialise(action: ActivityAction, activity: ActivityDB, plan: Plan): void {
    this.action = action;
    this.plan = plan;
    this.activity = activity;
    this.loadFormData(action);
  }

  getActivityActionFromForm(): ActivityAction {
    return this.unloadFormData();
  }

  private loadFormData(action: ActivityAction): void {
    const f = this.form;
    const direction =
      action.referencePoint === 'start'
        ? action.timeOffset >= 0
          ? 'after'
          : 'before'
        : action.timeOffset >= 0
          ? 'before'
          : 'after';

    f.controls.name.setValue(action.name);
    f.controls.offset.setValue(Math.abs(action.timeOffset));
    f.controls.direction.setValue(direction);
    f.controls.referencePoint.setValue(action.referencePoint);
  }

  private unloadFormData(): ActivityAction {
    const f = this.form;
    const referencePoint: ReferencePoint = f.controls.referencePoint.value ?? 'start';
    const direction: 'before' | 'after' = f.controls.direction.value ?? 'after';
    let timeOffset = 0;
    if (referencePoint === 'end') {
      if (direction === 'before') {
        timeOffset = f.controls.offset.value ?? 0;
      } else {
        timeOffset = -(f.controls.offset.value ?? 0);
      }
    } else {
      if (direction === 'after') {
        timeOffset = f.controls.offset.value ?? 0;
      } else {
        timeOffset = -(f.controls.offset.value ?? 0);
      }
    }
    return {
      name: f.controls.name.value ?? 'Unnamed action',
      timeOffset,
      referencePoint,
    };
  }

  private validateActionBeforePlanEnd(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.form || !this.plan || !this.activity) {
        return null;
      }
      const action = this.unloadFormData();
      const isAfterPlanEnd = activityActionAfterPlanEnd(
        action,
        this.activity.startTimeOffset,
        this.activity.duration,
        this.plan.properties.endTime
      );
      if (this.form.controls.name.errors) {
        if (isAfterPlanEnd) {
          this.form.controls.name.setErrors({ outsidePlan: true });
        } else {
          delete this.form.controls.name.errors['outsidePlan'];
          if (isEmptyObject(this.form.controls.name.errors)) {
            this.form.controls.name.setErrors(null);
          }
        }
      } else {
        this.form.controls.name.setErrors(isAfterPlanEnd ? { outsidePlan: true } : null);
      }
      return null;
    };
  }
}
