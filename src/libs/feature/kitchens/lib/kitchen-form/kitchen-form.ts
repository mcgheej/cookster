import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, OnChanges, untracked } from '@angular/core';
import { Kitchen, kitchenResourceDBsDifferent } from '@util/data-types/index';
import { KitchenFormService } from './kitchen-form-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField } from '@angular/forms/signals';
import { FieldResources } from './field-resources/field-resources';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ck-kitchen-form',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormField, FieldResources],
  templateUrl: './kitchen-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KitchenFormService],
})
export class KitchenForm implements OnChanges {
  private readonly kitchenFormService = new KitchenFormService();

  currentKitchen = input<Kitchen | null>(null);

  protected readonly form = this.kitchenFormService.kitchenForm;
  protected readonly canSave = computed(() => {
    const name = this.form.name().value();
    const resources = this.form.resources().value();
    if (this.form().invalid()) {
      return false;
    }
    const kitchen = untracked(this.currentKitchen);
    if (kitchen) {
      if (name !== kitchen.name) {
        return true;
      }
      if (resources.length !== kitchen.resourcesArray.length) {
        return true;
      }
      for (let i = 0; i < resources.length; i++) {
        if (kitchenResourceDBsDifferent(resources[i], kitchen.resourcesArray[i])) {
          return true;
        }
      }
    }
    return false;
  });

  ngOnChanges(): void {
    const kitchen = this.currentKitchen();
    if (kitchen) {
      this.kitchenFormService.initialise(kitchen);
    }
  }

  saveKitchen(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('Saving kitchen...');
  }
}
