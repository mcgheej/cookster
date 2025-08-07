import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthenticationService } from '@data-access/authentication/index';

@Component({
  selector: 'ck-shell',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar>
      <span>My App</span>
      <span class="flex-auto"></span>
      @if (loggedIn()) {
        <button matIconButton class="example-icon favorite-icon" aria-label="Example icon-button with heart icon">
          <mat-icon>favorite</mat-icon>
        </button>
      }
      <button
        matIconButton
        class="example-icon"
        aria-label="Example icon-button with share icon"
        (click)="toggleLogin()">
        <mat-icon [fontIcon]="loggedIn() ? 'logout' : 'login'"></mat-icon>
      </button>
    </mat-toolbar>
  `,
})
export class Shell {
  private readonly auth = inject(AuthenticationService);

  protected readonly loggedIn = this.auth.loggedIn;

  toggleLogin() {
    if (this.loggedIn()) {
      this.auth.logout();
    } else {
      this.auth.login('mcghee.j@btinternet.com', 'howdydoodee');
    }
  }
}
