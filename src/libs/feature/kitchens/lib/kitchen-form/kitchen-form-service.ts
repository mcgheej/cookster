import { inject, Injectable, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { Kitchen, KitchenDB, KitchenResourceDB, kitchenResourceDBsDifferent } from '@util/data-types/index';
import { NEW_KITCHEN_RESOURCE_ID } from '../constants';
import { KitchensService } from '../kitchens-service';

export interface KitchenData {
  name: string;
  resources: KitchenResourceDB[];
}

@Injectable()
export class KitchenFormService {
  private readonly kitchensService = inject(KitchensService);

  kitchenModel = signal<KitchenData>({ name: '', resources: [] });
  kitchenForm = form(this.kitchenModel, (p) => {
    required(p.name);
  });

  initialise(kitchen: Kitchen): void {
    this.kitchenModel.set({
      name: kitchen.name.slice(),
      resources: [...kitchen.resourcesArray],
    });
    this.kitchenForm().reset();
  }

  saveChanges(kitchen: Kitchen): void {
    const updatedKitchens: KitchenDB[] =
      kitchen.name === this.kitchenForm().value().name
        ? []
        : [{ id: kitchen.id, name: this.kitchenForm().value().name }];
    const t = new Map<string, KitchenResourceDB>(
      this.kitchenForm()
        .value()
        .resources.map((r) => [r.id, r])
    );
    const updatedResources: KitchenResourceDB[] = [];
    const newResources: KitchenResourceDB[] = [];
    const deletedResourceIds: string[] = [];
    this.kitchenForm()
      .value()
      .resources.forEach((r) => {
        if (r.id === NEW_KITCHEN_RESOURCE_ID) {
          newResources.push(r);
        } else {
          const existingResource = kitchen.resources.get(r.id);
          if (existingResource && kitchenResourceDBsDifferent(r, existingResource)) {
            updatedResources.push(r);
          }
        }
      });
    kitchen.resourcesArray.forEach((r) => {
      if (!t.has(r.id)) {
        deletedResourceIds.push(r.id);
      }
    });
    this.kitchensService.updateKitchen(updatedKitchens, updatedResources, newResources, deletedResourceIds);
  }
}
