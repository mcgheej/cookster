import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AfKitchensService } from '@data-access/kitchens/index';
import { Kitchen } from '@util/data-types/index';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KitchensService {
  private readonly kitchensData = inject(AfKitchensService);

  kitchens = toSignal(
    this.kitchensData.kitchens$.pipe(
      map((kitchensMap) => {
        return [...kitchensMap.values()];
      })
    ),
    { initialValue: [] as Kitchen[] }
  );
}
