import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';
import { DEFAULT_PLAN_COLOR, DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { Kitchen, PlanProperties } from '@util/data-types/index';
import { getDateToLastHour, isDifferentMinute } from '@util/date-utilities/index';
import { set } from 'date-fns';

export const FIELD_NAME = 'name';
export const FIELD_DATE = 'planDate';
export const FIELD_TIME = 'planTime';
export const FIELD_COLOR = 'planColor';
export const FIELD_KITCHEN = 'planKitchen';
export const FIELD_DESCRIPTION = 'planDescription';

@Injectable()
export class PlanPropertiesFormService {
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly plansData = inject(PlansDataService);

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

  createPlanProperties() {
    const properties = this.getNewPlanPropertiesFromForm(this.form);
    this.plansData.createPlan(properties).subscribe({
      next: () => {
        this.snackBar.open('Plan created', 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
        console.error('Error creating plan', error);
      },
    });
  }

  savePlanProperties(currentProperties: PlanProperties) {
    const changedProperties = this.getChangedPlanPropertiesFromForm(this.form, currentProperties);
    this.plansData.updatePlanProperties(currentProperties.id, changedProperties).subscribe({
      next: () => {
        this.snackBar.open('Plan updated', 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
        console.error('Error creating plan', error);
      },
    });
  }

  private loadFormData(form: FormGroup, planProperties: PlanProperties) {
    form.get(FIELD_NAME)?.setValue(planProperties.name);
    form.get(FIELD_DATE)?.setValue(planProperties.endTime);
    form.get(FIELD_TIME)?.setValue(planProperties.endTime);
    form.get(FIELD_COLOR)?.setValue(planProperties.color);
    form.get(FIELD_DESCRIPTION)?.setValue(planProperties.description);
    if (planProperties.id) {
      form.get(FIELD_KITCHEN)?.setValue(planProperties.kitchenName);
    }
  }

  private getNewPlanPropertiesFromForm(form: FormGroup): Partial<PlanProperties> {
    const name = form.get(FIELD_NAME)?.value || 'unknown';
    const description = form.get(FIELD_DESCRIPTION)?.value || '';
    const color = form.get(FIELD_COLOR)?.value || DEFAULT_PLAN_COLOR;
    const day = form.get(FIELD_DATE)?.value || set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const time = form.get(FIELD_TIME)?.value || set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const endTime = set(day, { hours: time.getHours(), minutes: time.getMinutes(), seconds: 0, milliseconds: 0 });
    const { kitchenName, kitchenResources } = this.getKitchenData(form.get(FIELD_KITCHEN)?.value as Kitchen | null);

    const changedProperties = {} as Partial<PlanProperties>;
    changedProperties.name = name;
    changedProperties.description = description;
    changedProperties.color = color;
    changedProperties.endTime = endTime;
    changedProperties.kitchenName = kitchenName;
    changedProperties.kitchenResources = kitchenResources;
    return changedProperties;
  }

  private getChangedPlanPropertiesFromForm(
    form: FormGroup,
    currentProperties: PlanProperties
  ): Partial<PlanProperties> {
    const name = form.get(FIELD_NAME)?.value || 'unknown';
    const description = form.get(FIELD_DESCRIPTION)?.value || '';
    const color = form.get(FIELD_COLOR)?.value || DEFAULT_PLAN_COLOR;
    const day = form.get(FIELD_DATE)?.value || set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const time = form.get(FIELD_TIME)?.value || set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const endTime = set(day, { hours: time.getHours(), minutes: time.getMinutes(), seconds: 0, milliseconds: 0 });
    const properties = {} as Partial<PlanProperties>;
    if (name !== currentProperties.name) {
      properties.name = name;
    }
    if (description !== currentProperties.description) {
      properties.description = description;
    }
    if (color !== currentProperties.color) {
      properties.color = color;
    }
    if (isDifferentMinute(endTime, currentProperties.endTime)) {
      properties.endTime = endTime;
    }
    // if (currentProperties.id === '') {
    //   const { kitchenName, kitchenResources } = this.getKitchenData(form.get(FIELD_KITCHEN)?.value as Kitchen | null);
    //   return { ...properties, kitchenName, kitchenResources } as Partial<PlanProperties>;
    // }
    return properties;
  }

  private getKitchenData(kitchen: Kitchen | null) {
    return {
      kitchenName: kitchen?.name || '',
      kitchenResources: [
        ...[{ index: 0, name: 'Workspace', description: '', maxParallelActivities: 6, actions: [] }],
        ...(kitchen?.resourcesArray?.map((r, seq) => ({
          index: seq + 1,
          name: r.name,
          description: r.description,
          maxParallelActivities: r.maxParallelActivities,
          actions: [],
        })) || []),
      ],
    };
  }
}
