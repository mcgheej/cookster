import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_PLAN_COLOR } from '@util/app-config/index';
import { PlanProperties } from '@util/data-types/index';
import { getDateToLastHour } from '@util/date-utilities/index';

export const FIELD_NAME = 'name';
export const FIELD_DATE = 'planDate';
export const FIELD_TIME = 'planTime';
export const FIELD_COLOR = 'planColor';
export const FIELD_KITCHEN = 'planKitchen';
export const FIELD_DESCRIPTION = 'planDescription';

@Injectable()
export class PlanPropertiesFormService {
  private readonly formBuilder = inject(FormBuilder);

  private now = new Date();

  readonly form = this.formBuilder.group({
    [FIELD_NAME]: ['', Validators.required],
    [FIELD_DATE]: [getDateToLastHour(this.now), [Validators.required]],
    [FIELD_TIME]: [getDateToLastHour(this.now), [Validators.required]],
    [FIELD_COLOR]: [DEFAULT_PLAN_COLOR, [Validators.required]],
    [FIELD_KITCHEN]: [null, [Validators.required]],
    [FIELD_DESCRIPTION]: [''],
  });

  initialise(planProperties: PlanProperties) {
    this.loadFormData(this.form, planProperties);
  }

  private loadFormData(formGroup: FormGroup, planProperties: PlanProperties) {
    formGroup.get(FIELD_NAME)?.setValue(planProperties.name);
    formGroup.get(FIELD_DATE)?.setValue(planProperties.endTime);
    formGroup.get(FIELD_TIME)?.setValue(planProperties.endTime);
    formGroup.get(FIELD_COLOR)?.setValue(planProperties.color);
  }
}
