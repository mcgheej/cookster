import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { ResourceLane } from '@util/data-types/index';

@Component({
  selector: 'ck-lane-header-title',
  host: { class: 'grid grid-cols-1' },
  imports: [MatTooltipModule],
  templateUrl: './lane-header-title.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaneHeaderTitle {
  readonly resourceLane = input.required<ResourceLane>();

  protected readonly defaultTooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
}
