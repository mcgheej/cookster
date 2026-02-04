import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore } from '@angular/fire/firestore';
import { Kitchen, KitchenDB, KitchenResourceDB } from '@util/data-types/index';
import { writeBatch } from 'firebase/firestore';
import { combineLatest, from, map, Observable, of, shareReplay } from 'rxjs';

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

  createKitchen(newKitchen: Omit<KitchenDB, 'id'>): Observable<KitchenDB> {
    return from(addDoc(collection(this.firestore, 'kitchens'), newKitchen)).pipe(
      map((docRef) => {
        return { ...newKitchen, id: docRef.id } as KitchenDB;
      })
    );
  }

  updateKitchen(
    updatedKitchens: KitchenDB[],
    updatedResources: KitchenResourceDB[],
    newResources: KitchenResourceDB[],
    deletedResourceIds: string[]
  ): Observable<void> {
    if (
      updatedKitchens.length !== 0 ||
      updatedResources.length !== 0 ||
      newResources.length !== 0 ||
      deletedResourceIds.length !== 0
    ) {
      const batch = writeBatch(this.firestore);
      if (updatedKitchens.length > 0) {
        updatedKitchens.forEach((kitchen) => {
          const kitchenDocRef = doc(this.firestore, `kitchens/${kitchen.id}`);
          batch.update(kitchenDocRef, { name: kitchen.name });
        });
      }
      if (updatedResources.length > 0) {
        updatedResources.forEach((resource) => {
          const resourceDocRef = doc(this.firestore, `kitchenResources/${resource.id}`);
          const { id, ...rest } = resource;
          batch.update(resourceDocRef, { ...rest });
        });
      }
      if (newResources.length > 0) {
        const resourcesCollection = collection(this.firestore, 'kitchenResources');
        newResources.forEach((resource) => {
          const newId = doc(resourcesCollection);
          const { id, ...rest } = resource;
          batch.set(newId, { ...rest });
        });
      }
      if (deletedResourceIds.length > 0) {
        deletedResourceIds.forEach((id) => {
          const resourceDocRef = doc(this.firestore, `kitchenResources/${id}`);
          batch.delete(resourceDocRef);
        });
      }
      return from(batch.commit());
    }
    return of(undefined);
  }
}
