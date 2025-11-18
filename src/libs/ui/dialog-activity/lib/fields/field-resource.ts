import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivityFormService } from '../activity-form-service';
import { PlanKitchenResource } from '@util/data-types/index';

@Component({
  selector: 'ck-field-resource',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  template: `
    <div class="grid grid-cols-[1fr] gap-4" [formGroup]="form">
      <mat-form-field floatLabel="auto">
        <mat-label>Resource</mat-label>
        <mat-select [formControlName]="controlName" panelWidth="">
          @for (resource of kitchenResources(); track $index) {
            <mat-option [value]="resource">{{ resource.name }}</mat-option>
          }
        </mat-select>
        @if (form.get(controlName)?.invalid && form.get(controlName)?.touched) {
          <mat-error>Resource must be selected</mat-error>
        }
        @if (form.get(controlName)?.invalid && !form.get(controlName)?.touched) {
          <mat-hint>Select a kitchen</mat-hint>
        }
      </mat-form-field>
    </div>
  `,
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
