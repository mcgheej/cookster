import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '@data-access/authentication/index';
import { NavBar } from './navbar/navbar';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlansDataService } from '@data-access/plans/index';

@Component({
  selector: 'ck-shell',
  imports: [RouterOutlet, NavBar],
  template: `
    <div class="size-full grid grid-rows-[auto_minmax(0,_1fr)]">
      <ck-navbar [loggedIn]="loggedIn()" (logout)="logout()"></ck-navbar>
      <main class="size-full">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthenticationService);
  private readonly plansData = inject(PlansDataService);

  protected readonly loggedIn = toSignal(this.auth.loggedIn$, { initialValue: false });

  protected logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: () => console.error('Logout failed'),
    });
  }
}
