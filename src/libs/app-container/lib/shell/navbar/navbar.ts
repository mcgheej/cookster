
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { navItems } from './navbar-props';

@Component({
  selector: 'ck-navbar',
  imports: [RouterModule],
  template: `
    <nav
      class="flex flex-wrap items-center w-full py-0 px-4 text-xl font-medium text-[var(--mat-sys-on-primary)] bg-[var(--mat-sys-primary)]">
      <a class="mt-1" routerLink="/home">Cookster</a>
      <span class="block flex-auto"></span>
      <ul class="flex text-base justify-between pt-0">
        @for (navItem of navItems; track $index) {
          <li>
            @if (loggedIn() === navItem.loggedInRequired) {
              <a
                class="px-4 py-2 block hover:text-[var(--mat-sys-inverse-primary)]"
                [routerLink]="navItem.url"
                routerLinkActive="active-link"
                >{{ navItem.title }}</a
              >
            }
          </li>
        }
        @if (loggedIn()) {
          <li>
            <div
              class="px-4 py-2 block hover:text-[var(--mat-sys-inverse-primary)] cursor-pointer select-none box-border"
              (click)="logout.emit()">
              Logout
            </div>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: [
    `
      .active-link {
        @apply underline decoration-2 underline-offset-8 decoration-[var(--mat-sys-on-primary)];
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar {
  readonly loggedIn = input.required<boolean>();
  protected readonly logout = output<void>();

  protected readonly navItems = navItems;
}
