import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AfKitchensService } from '@data-access/kitchens/index';
import { Kitchen } from '@util/data-types/index';
import { map } from 'rxjs';
import { KitchensService } from './kitchens-service';

@Injectable({ providedIn: 'root' })
export class KitchensStore {
  // private readonly kitchensData = inject(AfKitchensService);

  // readonly kitchens = toSignal(
  //   this.kitchensData.kitchens$.pipe(
  //     map((kitchensMap) => [...kitchensMap.values()].sort((a, b) => a.name.localeCompare(b.name)))
  //   ),
  //   {
  //     initialValue: [] as Kitchen[],
  //   }
  // );
  private readonly kitchensService = inject(KitchensService);

  readonly kitchens = toSignal(this.kitchensService.kitchensArray$, { initialValue: [] as Kitchen[] });

  readonly currentKitchenId = signal<string>('');
  readonly currentKitchen = computed(() => {
    const k = this.kitchens().find((kitchen) => kitchen.id === this.currentKitchenId());
    return k ?? null;
  });

  setCurrentKitchenId(kitchenId: string) {
    this.currentKitchenId.set(kitchenId);
  }
}
