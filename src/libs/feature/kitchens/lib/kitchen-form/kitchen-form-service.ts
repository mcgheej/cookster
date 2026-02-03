import { Injectable, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { Kitchen, KitchenResourceDB } from '@util/data-types/index';

export interface KitchenData {
  name: string;
  resources: KitchenResourceDB[];
}

@Injectable()
export class KitchenFormService {
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
}
