import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'ck-root',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('cookster');
}
