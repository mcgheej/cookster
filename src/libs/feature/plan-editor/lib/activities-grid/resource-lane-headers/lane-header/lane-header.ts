import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { ResourceActionIcon } from './resource-action-icon/resource-action-icon';
import { ResourceLane } from '@util/data-types/index';
import { LaneHeaderTitle } from './lane-header-title/lane-header-title';
import { LaneHeaderMenu } from './lane-header-menu/lane-header-menu';

@Component({
  selector: 'ck-lane-header',
  imports: [MatIconModule, MatTooltipModule, ResourceActionIcon, LaneHeaderTitle, LaneHeaderMenu],
  templateUrl: './lane-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaneHeader {
  readonly resourceLane = input.required<ResourceLane>();

  protected readonly defaultTooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
}
