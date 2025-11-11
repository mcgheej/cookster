import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { ResourceActionIcon } from './resource-action-icon/resource-action-icon';
import { ResourceLane } from '@util/data-types/index';
import { LaneHeaderTitle } from './lane-header-title/lane-header-title';
import { LaneHeaderMenu } from './lane-header-menu/lane-header-menu';
import { PlanEditorDataService } from '../../../plan-editor-data-service';
import {
  AcceptedDragOperation,
  CkDrop,
  DropAreaResourceLaneHeader,
  PreviewNewActionInResourceLaneHeader,
} from '@ui/drag-and-drop/index';

@Component({
  selector: 'ck-lane-header',
  imports: [MatIconModule, MatTooltipModule, ResourceActionIcon, LaneHeaderTitle, LaneHeaderMenu, CkDrop],
  templateUrl: './lane-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaneHeader {
  private readonly planEditorData = inject(PlanEditorDataService);

  readonly resourceLane = input.required<ResourceLane>();

  protected dropArea = computed(() => {
    const index = this.resourceLane().kitchenResource.index;
    const dragId = `drag-new-resource-action-lane-${index}`;
    const dropId = `drop-area-resource-lane-header-${index}`;
    return new DropAreaResourceLaneHeader({
      id: dropId,
      acceptedDragOperations: new Map<string, AcceptedDragOperation>([
        [dragId, new AcceptedDragOperation(dragId, dropId, PreviewNewActionInResourceLaneHeader)],
      ]),
      scrollX: this.planEditorData.activitiesGridScrollX,
      activitiesGridBoundingRect: this.planEditorData.activitiesGridBoundingRect,
    });
  });

  protected readonly defaultTooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
}
