import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserCredential } from 'firebase/auth';
import { Observable } from 'rxjs';
import { AfAuthenticationService } from './af-authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly afAuthenticationService = inject(AfAuthenticationService);

  loggedIn$ = this.afAuthenticationService.loggedIn$;

  login(email: string, password: string): Observable<UserCredential> {
    return this.afAuthenticationService.login(email, password);
  }

  logout(): Observable<void> {
    return this.afAuthenticationService.logout();
  }
}
