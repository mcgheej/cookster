import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export const FORM_FIELD_INPUT_STRING = 'inputString';

@Injectable()
export class GenericInputFormService {
  readonly form = inject(FormBuilder).group({
    [FORM_FIELD_INPUT_STRING]: ['', Validators.required],
  });

  initialiseForm(): void {}
}
