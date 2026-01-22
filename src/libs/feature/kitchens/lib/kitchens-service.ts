import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AfKitchensService } from '@data-access/kitchens/index';
import { Kitchen } from '@util/data-types/index';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KitchensService {
  private readonly kitchensData = inject(AfKitchensService);

  kitchens = toSignal(
    this.kitchensData.kitchens$.pipe(
      map((kitchensMap) => [...kitchensMap.values()].sort((a, b) => a.name.localeCompare(b.name)))
    ),
    {
      initialValue: [] as Kitchen[],
    }
  );

  currentKitchenId = signal<string>('');
  currentKitchen = computed(() => {
    const k = this.kitchens().find((kitchen) => kitchen.id === this.currentKitchenId());
    return k ?? null;
  });

  setCurrentKitchenId(kitchenId: string) {
    this.currentKitchenId.set(kitchenId);
  }
}
