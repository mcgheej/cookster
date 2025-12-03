import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { Plan } from '@util/data-types/index';
import { format } from 'date-fns';

@Component({
  selector: 'ck-status-bar',
  imports: [MatDividerModule, MatTooltipModule],
  templateUrl: './status-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBar {
  readonly plan = input.required<Plan | null>();
  readonly timeSnap = input.required<number>();
  protected readonly timeSnapChangeRequest = output<void>();

  protected readonly format = format;
  protected readonly defaultTooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
}
