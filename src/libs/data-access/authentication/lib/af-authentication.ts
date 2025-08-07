import { inject, Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AfAuthenticationService {
  private afAuth: Auth = inject(Auth);
  private authState$ = authState(this.afAuth);

  loggedIn$: Observable<boolean> = this.authState$.pipe(map((user) => !!user));

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.afAuth, email, password));
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }
}
