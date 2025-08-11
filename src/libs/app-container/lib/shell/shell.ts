import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '@data-access/authentication/index';
import { NavBar } from './navbar/navbar';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ck-shell',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, NavBar],
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

  protected readonly loggedIn = toSignal(this.auth.loggedIn$, { initialValue: false });

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: () => console.error('Logout failed'),
    });
  }
}
