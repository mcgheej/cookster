import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DEFAULT_TIME_SNAP_MINS } from '@util/app-config/index';

export const FORM_FIELD_SNAP_TO = 'snapTo';

@Injectable()
export class TimeSnapFormService {
  readonly form = inject(FormBuilder).group({
    [FORM_FIELD_SNAP_TO]: [DEFAULT_TIME_SNAP_MINS, Validators.required],
  });

  initialiseForm(timeSnapMins: number): void {
    this.form.get(FORM_FIELD_SNAP_TO)?.setValue(timeSnapMins);
  }

  getSnapTo(): number {
    return this.form.get(FORM_FIELD_SNAP_TO)?.value ?? DEFAULT_TIME_SNAP_MINS;
  }
}
