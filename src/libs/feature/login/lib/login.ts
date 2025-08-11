import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthenticationService } from '@data-access/authentication/index';
import { take } from 'rxjs';

@Component({
  selector: 'ck-login',
  imports: [MatButtonModule],
  template: `
    <div>Login page under construction</div>
    <button mat-raised-button color="primary" (click)="login()">Login</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthenticationService);
  login() {
    this.auth.login('mcghee.j@btinternet.com', 'howdydoodee').subscribe({
      next: () => {
        this.router.navigateByUrl('/plans');
      },
      error: () => console.error('Login failed'),
    });
  }
}
