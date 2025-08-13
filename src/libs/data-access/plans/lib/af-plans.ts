import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { planDB } from '@util/data-types/index';
import { collection, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

interface PlanChange {
  type: 'added' | 'modified' | 'removed';
  planDB: planDB;
}

@Injectable({ providedIn: 'root' })
export class AfPlansService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  private readonly plansChangesSubject$ = new BehaviorSubject<PlanChange[]>([]);
  readonly plansChanges$ = this.plansChangesSubject$.asObservable();

  constructor() {
    let unsubscribe: Unsubscribe | null;
    this.auth.onAuthStateChanged((user) => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      if (user) {
        unsubscribe = this.setupSnapshotListener();
        console.log('User is logged in:', user);
      } else {
        if (unsubscribe) {
          (unsubscribe as Unsubscribe)();
          unsubscribe = null;
        }
        console.log('User is logged out');
      }
    });
  }

  private setupSnapshotListener(): Unsubscribe {
    const plansCollection = collection(this.firestore, 'plans');
    return onSnapshot(plansCollection, (snapshot) => {
      const changes: PlanChange[] = [];
      snapshot.docChanges().forEach((change) => {
        changes.push({ type: change.type, planDB: { ...change.doc.data(), id: change.doc.id } as planDB });
      });
      this.plansChangesSubject$.next(changes);
    });
  }
}
