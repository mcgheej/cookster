import { inject, Injectable } from '@angular/core';
import { Auth, Unsubscribe } from '@angular/fire/auth';
import { collection, Firestore, onSnapshot } from '@angular/fire/firestore';
import { PlanDB } from '@util/data-types/index';
import { BehaviorSubject } from 'rxjs';

interface PlanChange {
  type: 'added' | 'modified' | 'removed' | 'flush';
  planDB?: PlanDB;
}

@Injectable({ providedIn: 'root' })
export class AfPlansService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  private readonly plansChangesSubject$ = new BehaviorSubject<PlanChange[]>([]);
  readonly plansChanges$ = this.plansChangesSubject$.asObservable();

  constructor() {
    let stopListener: Unsubscribe | null;
    this.auth.onAuthStateChanged((user) => {
      if (stopListener) {
        stopListener();
        stopListener = null;
        this.plansChangesSubject$.next([{ type: 'flush' }]);
      }
      if (user) {
        stopListener = this.setupSnapshotListener();
      }
    });
  }

  private setupSnapshotListener(): Unsubscribe {
    const plansCollection = collection(this.firestore, 'plans');
    return onSnapshot(plansCollection, (snapshot) => {
      const changes: PlanChange[] = [];
      snapshot.docChanges().forEach((change) => {
        changes.push({ type: change.type, planDB: { ...change.doc.data(), id: change.doc.id } as PlanDB });
      });
      this.plansChangesSubject$.next(changes);
    });
  }
}
