import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActionDisplayTile, ResourceAction, ResourceLane } from '@util/data-types/index';
import { ResourceActionTilesService } from './resource-action-tiles-service';

import { ResourceActionTile } from './resource-action-tile/resource-action-tile';

@Component({
  selector: 'ck-resource-action-tiles',
  imports: [ResourceActionTile],
  template: `
    @for (actionTile of actionDisplayTiles(); track $index) {
      <ck-resource-action-tile
        [resourceLane]="resourceLane()"
        [plan]="plan()"
        [tile]="actionTile"
        (deleteResourceAction)="deleteResourceAction(actionTile)"
        (updateResourceActionTime)="updateResourceActionTime(actionTile, $event)"
        (updateResourceAction)="updateResourceAction(actionTile, $event)" />
    }
  `,
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
    this.service.modifyResourceActionTime(plan, this.resourceLane(), tile.index, newTime);
  }

  updateResourceAction(tile: ActionDisplayTile, updatedAction: ResourceAction): void {
    const plan = this.plan();
    if (!plan) {
      return;
    }
    this.service.modifyResourceAction(plan, this.resourceLane(), tile.index, updatedAction);
  }
}
