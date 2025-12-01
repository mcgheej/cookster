import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { defaultGoogleColor, INITIAL_ACTIVITY_DURATION_MINS } from '@util/app-config/index';
import { ActivityAction, ActivityTemplateDB } from '@util/data-types/index';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';

@Injectable()
export class ActivityTemplateFormService {
  readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required]],
    duration: [new Date(0, 0, 0, 0, INITIAL_ACTIVITY_DURATION_MINS), [Validators.required]],
    color: [defaultGoogleColor, [Validators.required]],
    actions: [[] as ActivityAction[]],
    description: [''],
    startMessage: [''],
    endMessage: [''],
  });

  // Public methods
  // --------------

  initialise(template: ActivityTemplateDB): void {
    this.loadFormData(template);
  }

  getTemplateFromForm(originalTemplate: ActivityTemplateDB): ActivityTemplateDB {
    return this.unloadFormData(originalTemplate);
  }

  // Private methods
  // ---------------

  private loadFormData(template: ActivityTemplateDB): void {
    const f = this.form;
    const duration = new Date(0, 0, 0, 0, template.duration);
    f.controls.name.setValue(template.name);
    f.controls.duration.setValue(duration);
    f.controls.color.setValue(template.color || defaultGoogleColor);
    f.controls.actions.setValue(template.actions);
    f.controls.description.setValue(template.description);
    f.controls.startMessage.setValue(template.startMessage || '');
    f.controls.endMessage.setValue(template.endMessage || '');
  }

  private unloadFormData(originalTemplate: ActivityTemplateDB): ActivityTemplateDB {
    const f = this.form;
    const durationValue = f.controls.duration.value as Date;
    const duration = durationValue ? getMinutesSinceMidnight(durationValue) : INITIAL_ACTIVITY_DURATION_MINS;
    return {
      id: originalTemplate.id,
      name: f.controls.name.value ?? 'unknown',
      description: f.controls.description.value ?? '',
      duration,
      color: f.controls.color.value ?? defaultGoogleColor,
      actions: f.controls.actions.value ?? [],
      startMessage: f.controls.startMessage.value ?? '',
      endMessage: f.controls.endMessage.value ?? '',
    } as ActivityTemplateDB;
  }
}
