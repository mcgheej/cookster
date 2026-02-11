import { Injectable, signal } from '@angular/core';
import { form, max, min, required } from '@angular/forms/signals';
import { KitchenResourceDB } from '@util/data-types/index';

export interface KitchenResourceData {
  name: string;
  description: string;
  maxParallelActivities: number;
  seq: number;
}

@Injectable()
export class KitchenResourceFormService {
  private resourceCount = 0;

  private kitchenResourceModel = signal<KitchenResourceData>({
    name: '',
    description: '',
    maxParallelActivities: 1,
    seq: 0,
  });

  kitchenResourceForm = form(this.kitchenResourceModel, (p) => {
    required(p.name, { message: 'Name is required' });
    required(p.maxParallelActivities, { message: 'Must be between 1 and 6' });
    min(p.maxParallelActivities, 1, { message: 'Must be between 1 and 6' });
    max(p.maxParallelActivities, 6, { message: 'Must be between 1 and 6' });
    min(p.seq, 0, { message: 'Must be 0 or greater' });
    max(p.seq, () => this.resourceCount - 1, { message: `Must be less than ${() => this.resourceCount - 1}` });
  });

  // Public Methods
  //---------------

  initialise(resource: KitchenResourceDB, resourceCount: number): void {
    this.resourceCount = resourceCount;
    this.kitchenResourceModel.set({
      name: resource.name.slice(),
      description: resource.description.slice(),
      maxParallelActivities: resource.maxParallelActivities,
      seq: resource.seq,
    });
    this.kitchenResourceForm().reset();
  }

  formEqualsResource(resource: KitchenResourceDB): boolean {
    return (
      resource.name === this.kitchenResourceForm().value().name &&
      resource.description === this.kitchenResourceForm().value().description &&
      resource.maxParallelActivities === this.kitchenResourceForm().value().maxParallelActivities &&
      resource.seq === this.kitchenResourceForm().value().seq
    );
  }
}
