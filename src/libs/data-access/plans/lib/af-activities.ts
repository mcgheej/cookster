import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ActivityDB } from '@util/data-types/index';
import { Unsubscribe, User } from 'firebase/auth';
import { BehaviorSubject, combineLatest, distinctUntilChanged, from, map, Observable } from 'rxjs';

interface ActivityChange {
  type: 'added' | 'modified' | 'removed' | 'flush';
  activityDB?: ActivityDB;
}

@Injectable({ providedIn: 'root' })
export class AfActivitiesService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  private readonly user$ = new BehaviorSubject<User | null>(null);

  private readonly activitiesChangesSubject$ = new BehaviorSubject<ActivityChange[]>([]);
  readonly activitiesChanges$ = this.activitiesChangesSubject$.asObservable();

  private _currentPlanId = '';
  private currentPlanId$ = new BehaviorSubject<string>(this._currentPlanId);
  set currentPlanId(planId: string) {
    if (planId === this._currentPlanId) {
      return;
    }
    this._currentPlanId = planId;
    this.currentPlanId$.next(this._currentPlanId);
  }

  constructor() {
    let stopListener: Unsubscribe | null = null;
    this.auth.onAuthStateChanged((user) => {
      this.user$.next(user);
    });
    combineLatest([
      this.user$.pipe(
        map((user) => !!user),
        distinctUntilChanged()
      ),
      this.currentPlanId$.pipe(distinctUntilChanged()),
    ]).subscribe(([user, planId]) => {
      if (!user) {
        if (stopListener) {
          stopListener();
          stopListener = null;
        }
        this.currentPlanId = '';
        this.activitiesChangesSubject$.next([{ type: 'flush' }]);
        return;
      }
      if (stopListener) {
        stopListener();
        stopListener = null;
        this.activitiesChangesSubject$.next([{ type: 'flush' }]);
      }
      if (planId) {
        stopListener = this.setupSnapshotListener(planId);
      }
    });
  }

  createActivity(a: ActivityDB): Observable<ActivityDB> {
    const { id, ...activity } = a;
    return from(
      addDoc(collection(this.firestore, 'activities'), {
        name: activity.name,
        description: activity.description,
        duration: activity.duration,
        startTimeOffset: activity.startTimeOffset,
        planId: activity.planId,
        resourceIndex: activity.resourceIndex,
        actions: activity.actions,
        color: activity.color,
        startMessage: activity.startMessage,
        endMessage: activity.endMessage,
      })
    ).pipe(
      map((docRef) => {
        return {
          id: docRef.id,
          ...activity,
        };
      })
    );
  }

  // updateActivity(a: ActivityDB): Observable<void> {
  //   const { id, ...activity } = a;
  //   const docRef = doc(this.firestore, `activities/${a.id}`);
  //   return from(updateDoc(docRef, activity));
  // }

  updateActivity(id: string, a: Partial<Omit<ActivityDB, 'id'>>): Observable<void> {
    const docRef = doc(this.firestore, `activities/${id}`);
    return from(updateDoc(docRef, a));
  }

  private setupSnapshotListener(planId: string): Unsubscribe {
    const activitiesCollection = collection(this.firestore, `activities`);
    const q = query(activitiesCollection, where('planId', '==', planId), orderBy('startTimeOffset', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const changes: ActivityChange[] = [];
      snapshot.docChanges().forEach((change) => {
        changes.push({ type: change.type, activityDB: { ...change.doc.data(), id: change.doc.id } as ActivityDB });
      });
      this.activitiesChangesSubject$.next(changes);
    });
  }

  deleteActivity(id: string): Observable<void> {
    const docRef = doc(this.firestore, `activities/${id}`);
    return from(deleteDoc(docRef));
  }
}
