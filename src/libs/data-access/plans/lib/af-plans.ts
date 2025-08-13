import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { planDB } from '@util/data-types/index';
import { collection, onSnapshot } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

interface PlanChange {
  type: 'added' | 'modified' | 'removed';
  planDB: planDB;
}

@Injectable({ providedIn: 'root' })
export class AfPlansService {
  private readonly firestore = inject(Firestore);

  private readonly plansChangesSubject$ = new BehaviorSubject<PlanChange[]>([]);
  readonly plansChanges$ = this.plansChangesSubject$.asObservable();

  constructor() {
    this.setupSnapshotListener();
  }

  private setupSnapshotListener() {
    const plansCollection = collection(this.firestore, 'plans');
    onSnapshot(plansCollection, (snapshot) => {
      const changes: PlanChange[] = [];
      snapshot.docChanges().forEach((change) => {
        changes.push({ type: change.type, planDB: { ...change.doc.data(), id: change.doc.id } as planDB });
      });
      this.plansChangesSubject$.next(changes);
    });
  }
}
