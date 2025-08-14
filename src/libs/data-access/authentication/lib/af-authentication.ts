import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, User, user, UserCredential } from '@angular/fire/auth';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AfAuthenticationService {
  private afAuth: Auth = inject(Auth);

  readonly loggedIn$: Observable<boolean> = user(this.afAuth).pipe(
    map((user: User | null) => {
      return !!user;
    })
  );

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.afAuth, email, password));
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }
}
