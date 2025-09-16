import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RESOURCE_ACTION_COMPONENT_HEIGHT } from '@util/app-config/index';
import { ActionDisplayTile } from '@util/data-types/index';

@Component({
  selector: 'ck-resource-action-tile',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './resource-action-tile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceActionTile {
  tile = input.required<ActionDisplayTile>();

  protected readonly componentHeight = RESOURCE_ACTION_COMPONENT_HEIGHT.toString() + 'px';
}
