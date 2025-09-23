import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivityPropertiesFormService, F_RESOURCE } from '../activity-properties-form-service';

@Component({
  selector: 'ck-field-resource',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './field-resource.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldResource {
  private readonly formService = inject(ActivityPropertiesFormService);

  readonly form = this.formService.form;
  readonly controlName = F_RESOURCE;

  protected readonly kitchenResources = this.formService.kitchenResources;
}
