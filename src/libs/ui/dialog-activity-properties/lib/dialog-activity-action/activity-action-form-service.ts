import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityAction, activityActionText, ActivityDB, Plan, ReferencePoint } from '@util/data-types/index';

export const F_ACTION_NAME = 'name';
export const F_ACTION_OFFSET = 'offset';
export const F_ACTION_DIRECTION = 'direction';
export const F_ACTION_REFERENCE_POINT = 'referencePoint';

@Injectable()
export class ActivityActionFormService {
  readonly form = inject(FormBuilder).group({
    [F_ACTION_NAME]: ['', [Validators.required]],
    [F_ACTION_OFFSET]: [0, [Validators.required]],
    [F_ACTION_DIRECTION]: ['after', [Validators.required]],
    [F_ACTION_REFERENCE_POINT]: ['start', [Validators.required]],
  });

  private formChanges = toSignal(this.form.valueChanges, { initialValue: undefined });
  actionText = computed(() => {
    const v = this.formChanges();
    if (this.action && this.form) {
      return activityActionText(this.getActionFromForm(this.form));
    }
    return '';
  });

  private action: ActivityAction | null = null;

  initialise(action: ActivityAction, activity: ActivityDB, plan: Plan) {
    this.action = action;
    this.loadFormData(this.form, action);
  }

  getAction(): ActivityAction {
    return this.getActionFromForm(this.form);
  }

  private loadFormData(form: FormGroup, action: ActivityAction) {
    const direction =
      action.referencePoint === 'start'
        ? action.timeOffset >= 0
          ? 'after'
          : 'before'
        : action.timeOffset >= 0
          ? 'before'
          : 'after';
    form.get(F_ACTION_NAME)?.setValue(action.name);
    form.get(F_ACTION_OFFSET)?.setValue(Math.abs(action.timeOffset));
    form.get(F_ACTION_DIRECTION)?.setValue(direction);
    form.get(F_ACTION_REFERENCE_POINT)?.setValue(action.referencePoint);
  }

  private getActionFromForm(f: FormGroup): ActivityAction {
    const referencePoint: ReferencePoint = f.get(F_ACTION_REFERENCE_POINT)?.value ?? 'start';
    const direction: 'before' | 'after' = f.get(F_ACTION_DIRECTION)?.value ?? 'after';
    let timeOffset = 0;
    if (referencePoint === 'end') {
      if (direction === 'before') {
        timeOffset = f.get(F_ACTION_OFFSET)?.value ?? 0;
      } else {
        timeOffset = -(f.get(F_ACTION_OFFSET)?.value ?? 0);
      }
    } else {
      if (direction === 'after') {
        timeOffset = f.get(F_ACTION_OFFSET)?.value ?? 0;
      } else {
        timeOffset = -(f.get(F_ACTION_OFFSET)?.value ?? 0);
      }
    }
    return {
      name: f.get(F_ACTION_NAME)?.value,
      timeOffset,
      referencePoint,
    };
  }
}
