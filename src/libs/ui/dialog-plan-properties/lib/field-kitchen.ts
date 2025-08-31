import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FIELD_KITCHEN, PlanPropertiesFormService } from './plan-properties-form-service.ts';
import { from } from 'rxjs';

@Component({
  selector: 'ck-field-kitchen',
  imports: [],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldKitchen {
  protected readonly form = inject(PlanPropertiesFormService).form;
  protected readonly controlName = FIELD_KITCHEN;
}
