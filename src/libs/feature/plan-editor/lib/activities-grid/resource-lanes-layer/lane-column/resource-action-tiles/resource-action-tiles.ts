import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActionDisplayTile, ResourceLane } from '@util/data-types/index';
import { ResourceActionTilesService } from './resource-action-tiles-service';
import { CommonModule } from '@angular/common';
import { ResourceActionTile } from './resource-action-tile/resource-action-tile';

@Component({
  selector: 'ck-resource-action-tiles',
  imports: [CommonModule, ResourceActionTile],
  templateUrl: './resource-action-tiles.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResourceActionTilesService],
})
export class ResourceActionTiles {
  protected readonly service = inject(ResourceActionTilesService);

  readonly resourceLane = input.required<ResourceLane>();

  protected readonly plan = this.service.plan;
  protected readonly resourceActions = this.service.computedResourceActions(this.resourceLane);
  protected readonly actionDisplayTiles = this.service.computedActionDisplayTiles(this.resourceActions);

  // User Interactions
  // -----------------

  deleteResourceAction(actionTile: ActionDisplayTile): void {
    const plan = this.plan();
    if (!plan) {
      return;
    }
    this.service.deleteResourceAction(plan, this.resourceLane(), actionTile.index);
  }

  updateResourceActionTime(tile: ActionDisplayTile, newTime: Date): void {
    const plan = this.plan();
    if (!plan) {
      return;
    }
    this.service.modifyResourceAction(plan, this.resourceLane(), tile.index, newTime);
  }
}
