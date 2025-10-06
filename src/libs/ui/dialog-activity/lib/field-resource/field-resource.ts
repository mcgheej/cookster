import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivityFormService } from '../activity-form-service';
import { PlanKitchenResource } from '@util/data-types/index';

@Component({
  selector: 'ck-field-resource',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './field-resource.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldResource {
  private readonly formService = inject(ActivityFormService);

  readonly form = this.formService.form;
  readonly controlName = 'resource';
  protected readonly kitchenResources = computed(() => {
    const plan = this.formService.plan();
    return plan ? plan.properties.kitchenResources : [];
  });
}
