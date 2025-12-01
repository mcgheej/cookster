import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ActivityTemplateDB } from '@util/data-types/index';
import { te } from 'date-fns/locale';
import { Unsubscribe, User } from 'firebase/auth';
import { BehaviorSubject, from, map, Observable } from 'rxjs';

interface TemplateChange {
  type: 'added' | 'modified' | 'removed' | 'flush';
  templateDB?: ActivityTemplateDB;
}

@Injectable({ providedIn: 'root' })
export class AfTemplatesService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  private readonly user$ = new BehaviorSubject<User | null>(null);

  private readonly templatesChangesSubject$ = new BehaviorSubject<TemplateChange[]>([]);
  readonly templatesChanges$ = this.templatesChangesSubject$.asObservable();

  constructor() {
    let stopListener: Unsubscribe | null = null;
    this.auth.onAuthStateChanged((user) => {
      this.user$.next(user);
    });

    this.user$.pipe(map((user) => !!user)).subscribe((user) => {
      if (!user) {
        if (stopListener) {
          stopListener();
          stopListener = null;
        }
        this.templatesChangesSubject$.next([{ type: 'flush' }]);
        return;
      }
      if (stopListener) {
        stopListener();
        stopListener = null;
        this.templatesChangesSubject$.next([{ type: 'flush' }]);
      }
      stopListener = this.setupSnapshotListener();
    });
  }

  createActivityTemplate(t: ActivityTemplateDB): Observable<ActivityTemplateDB> {
    const { id, ...template } = t;
    return from(addDoc(collection(this.firestore, 'templates'), template)).pipe(
      map((docRef) => {
        return { id: docRef.id, ...template } as ActivityTemplateDB;
      })
    );
  }

  updateTemplateActivity(templateId: string, updates: Partial<ActivityTemplateDB>): Observable<void> {
    const docRef = doc(this.firestore, `templates/${templateId}`);
    return from(updateDoc(docRef, updates));
  }

  deleteActivityTemplate(templateId: string): Observable<void> {
    const docRef = doc(this.firestore, `templates/${templateId}`);
    return from(deleteDoc(docRef));
  }

  private setupSnapshotListener(): Unsubscribe {
    const templatesCollection = collection(this.firestore, 'templates');
    return onSnapshot(templatesCollection, (snapshot) => {
      const changes: TemplateChange[] = [];
      snapshot.docChanges().forEach((change) => {
        changes.push({
          type: change.type,
          templateDB: { ...change.doc.data(), id: change.doc.id } as ActivityTemplateDB,
        });
      });
      this.templatesChangesSubject$.next(changes);
    });
  }
}
