import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { Plan } from '@util/data-types/lib/plan';
import { format } from 'date-fns';

@Component({
  selector: 'ck-status-bar',
  imports: [MatDividerModule],
  templateUrl: './status-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBar {
  plan = input.required<Plan | null>();

  protected readonly format = format;
}
