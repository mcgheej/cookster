import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CkDrop } from '@ui/drag-and-drop/index';
import { LaneColumnService } from './lane-column-service';
import { Tiler } from '@util/tiler/index';
import { ResourceLane } from '@util/data-types/index';
import { ActivityTiles } from './activity-tiles/activity-tiles';
import { ResourceActionTiles } from './resource-action-tiles/resource-action-tiles';

@Component({
  selector: 'ck-lane-column',
  imports: [CommonModule, ActivityTiles, ResourceActionTiles, CkDrop],
  templateUrl: './lane-column.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Tiler, LaneColumnService],
})
export class LaneColumn {
  private readonly service = inject(LaneColumnService);

  readonly resourceLane = input.required<ResourceLane>();

  protected readonly distinctResourceLane = this.service.computedDistinctResourceLane(this.resourceLane);
  protected readonly dropArea = this.service.computedDropArea(this.distinctResourceLane);

  // User Interactions
  // -----------------

  createNewActivity(ev: MouseEvent): void {
    ev.stopPropagation();
    this.service.createNewActivity(ev, this.distinctResourceLane());
  }
}
