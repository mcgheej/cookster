import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'ck-shell',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar>
      <span>My App</span>
      <span class="flex-auto"></span>
      <button matIconButton class="example-icon favorite-icon" aria-label="Example icon-button with heart icon">
        <mat-icon>favorite</mat-icon>
      </button>
      <button matIconButton class="example-icon" aria-label="Example icon-button with share icon">
        <mat-icon fontIcon="share"></mat-icon>
      </button>
    </mat-toolbar>
  `,
})
export class Shell {}
