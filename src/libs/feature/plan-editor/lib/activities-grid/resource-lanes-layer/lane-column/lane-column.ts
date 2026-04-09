import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CkDrop } from '@ui/drag-and-drop/index';
import { LaneColumnService } from './lane-column-service';
import { Tiler } from '@util/tiler/index';
import { ResourceLane } from '@util/data-types/index';
import { ActivityTiles } from './activity-tiles/activity-tiles';
import { ResourceActionTiles } from './resource-action-tiles/resource-action-tiles';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { PlanEditorDataService } from '@feature/plan-editor/lib/plan-editor-data-service';
import { ActivityService } from '@feature/plan-editor/lib/activity-service';
import { ResourceActionService } from '@feature/plan-editor/lib/resource-action-service';

@Component({
  selector: 'ck-lane-column',
  imports: [MatMenuModule, MatIconModule, ActivityTiles, ResourceActionTiles, CkDrop],
  templateUrl: './lane-column.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Tiler, LaneColumnService],
})
export class LaneColumn {
  private readonly planEditorData = inject(PlanEditorDataService);
  private readonly service = inject(LaneColumnService);
  private readonly activityService = inject(ActivityService);
  private readonly resourceActionService = inject(ResourceActionService);

  readonly resourceLane = input.required<ResourceLane>();

  protected readonly distinctResourceLane = this.service.computedDistinctResourceLane(this.resourceLane);
  protected readonly dropArea = this.service.computedDropArea(this.distinctResourceLane);

  private contextMenuEvent: MouseEvent | null = null;

  // User Interactions
  // -----------------

  createNewActivity(ev: MouseEvent): void {
    if (this.contextMenuEvent) {
      this.activityService.createNewActivity(this.contextMenuEvent, this.distinctResourceLane());
    }
  }

  createNewResourceAction(ev: MouseEvent): void {
    if (this.contextMenuEvent) {
      this.resourceActionService.createNewResourceAction(this.contextMenuEvent, this.distinctResourceLane());
    }
  }

  clearActivitySelection(ev: MouseEvent): void {
    ev.stopPropagation();
    this.planEditorData.setSelectedActivityId('');
  }

  onRightClick(ev: MouseEvent): void {
    this.contextMenuEvent = ev;
    this.planEditorData.setSelectedActivityId('');
  }
}
