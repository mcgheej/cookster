import { inject, Injectable } from '@angular/core';
import { Auth, Unsubscribe } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  collectionSnapshots,
  Firestore,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { ActivityDB, PlanDB } from '@util/data-types/index';
import { doc } from 'firebase/firestore';
import { BehaviorSubject, from, map, Observable, switchMap } from 'rxjs';

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

  createPlan(newPlan: Omit<PlanDB, 'id'>): Observable<void> {
    return from(addDoc(collection(this.firestore, 'plans'), newPlan)).pipe(
      map(() => {
        return;
      })
    );
  }

  updatePlanProperties(id: string, updates: Partial<Omit<PlanDB, 'id'>>): Observable<void> {
    const docRef = doc(this.firestore, `plans/${id}`);
    return from(updateDoc(docRef, updates));
  }

  deletePlan(planId: string): Observable<void> {
    const activitiesCollection = collection(this.firestore, 'activities');
    const q = query(activitiesCollection, where('planId', '==', planId));

    return collectionSnapshots(q).pipe(
      switchMap((snapshots) => {
        const batch = writeBatch(this.firestore);
        snapshots.forEach((snapshot) => {
          batch.delete(snapshot.ref);
        });
        const planDocRef = doc(this.firestore, 'plans', planId);
        batch.delete(planDocRef);
        return from(batch.commit());
      })
    );
  }

  updateUntetheredPlanEnd(
    id: string,
    planProps: Partial<Omit<PlanDB, 'id'>>,
    activities: ActivityDB[]
  ): Observable<void> {
    const batch = writeBatch(this.firestore);
    const planDocRef = doc(this.firestore, `plans/${id}`);
    batch.update(planDocRef, planProps);
    activities.forEach((activity) => {
      const activityDocRef = doc(this.firestore, `activities/${activity.id}`);
      batch.update(activityDocRef, { startTimeOffset: activity.startTimeOffset });
    });
    return from(batch.commit());
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
