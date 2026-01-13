import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Kitchen, KitchenDB, KitchenResourceDB } from '@util/data-types/index';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AfKitchensService {
  private readonly firestore = inject(Firestore);

  kitchens$: Observable<Map<string, Kitchen>>;

  constructor() {
    const kitchensCollection = collection(this.firestore, 'kitchens');
    const kitchenResourcesCollection = collection(this.firestore, 'kitchenResources');

    this.kitchens$ = combineLatest([
      collectionData(kitchensCollection, { idField: 'id' }) as Observable<KitchenDB[]>,
      collectionData(kitchenResourcesCollection, { idField: 'id' }) as Observable<KitchenResourceDB[]>,
    ]).pipe(
      shareReplay(1),
      map(([kitchensDB, kitchenResources]) => {
        const kitchens = new Map<string, Kitchen>(
          kitchensDB.map((kitchenDB) => [
            kitchenDB.id,
            { ...kitchenDB, resources: new Map<string, KitchenResourceDB>(), resourcesArray: [] },
          ])
        );
        kitchenResources.forEach((resource) => {
          const kitchen = kitchens.get(resource.kitchenId);
          if (kitchen) {
            kitchen.resources.set(resource.id, resource);
          }
        });
        kitchens.forEach((kitchen) => {
          kitchen.resourcesArray = [...kitchen.resources.values()].sort((a, b) => a.seq - b.seq);
        });
        return kitchens;
      })
    );
  }
}
