import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthenticationService } from './authentication-service';
import { map } from 'rxjs';

export function notAuthGuard(redirectUrl: string): CanActivateFn {
  return () => {
    const router = inject(Router);
    const auth = inject(AuthenticationService);
    return auth.loggedIn$.pipe(
      map((loggedIn) => {
        if (loggedIn) {
          return router.parseUrl(redirectUrl);
        }
        return true;
      })
    );
  };
}
