import { computed, inject, Injectable, InputSignal, Signal } from '@angular/core';
import { PlanEditorDataService } from '../../../plan-editor-data-service';
import { ResourceLane, resourceLanesEqual } from '@util/data-types/index';
import {
  AcceptedDragOperation,
  DropAreaResourceLaneColumn,
  PreviewChangeActivityDuration,
  PreviewMoveActionInResourceLaneColumn,
  PreviewMoveActivity,
  PreviewNewActionInResourceLaneColumn,
  PreviewTetheredPlanEnd,
  PreviewUntetheredPlanEnd,
} from '@ui/drag-and-drop/index';

@Injectable()
export class LaneColumnService {
  private readonly planEditorData = inject(PlanEditorDataService);

  // Computed Signal Factories
  // -------------------------

  /**
   * compute resource lane that is truly distinct
   */
  computedDistinctResourceLane(resourceLane: InputSignal<ResourceLane>) {
    return computed(() => resourceLane(), {
      equal: (a, b) => resourceLanesEqual(a, b),
    });
  }

  /**
   * compute drop area object from this resoiurce lane
   */
  computedDropArea(resourceLane: Signal<ResourceLane>) {
    return computed(() => {
      const index = resourceLane().kitchenResource.index;
      const dragNewResourceActionId = `drag-new-resource-action-lane-${index}`;
      const dragMoveResourceActionId = `drag-move-resource-action-lane-${index}`;
      const dropId = `drop-area-resource-lane-column-${index}`;
      return new DropAreaResourceLaneColumn({
        id: dropId,
        acceptedDragOperations: new Map<string, AcceptedDragOperation>([
          [
            dragNewResourceActionId,
            new AcceptedDragOperation(dragNewResourceActionId, dropId, PreviewNewActionInResourceLaneColumn),
          ],
          [
            dragMoveResourceActionId,
            new AcceptedDragOperation(dragMoveResourceActionId, dropId, PreviewMoveActionInResourceLaneColumn),
          ],
          [
            'drag-tethered-plan-end',
            new AcceptedDragOperation('drag-tethered-plan-end', dropId, PreviewTetheredPlanEnd),
          ],
          [
            'drag-untethered-plan-end',
            new AcceptedDragOperation('drag-untethered-plan-end', dropId, PreviewUntetheredPlanEnd),
          ],
          [
            'drag-change-activity-duration',
            new AcceptedDragOperation('drag-change-activity-duration', dropId, PreviewChangeActivityDuration),
          ],
          ['drag-activity', new AcceptedDragOperation('drag-activity', dropId, PreviewMoveActivity)],
          ['drag-template-activity', new AcceptedDragOperation('drag-template-activity', dropId, PreviewMoveActivity)],
        ]),
        scrollX: this.planEditorData.activitiesGridScrollX,
        scrollY: this.planEditorData.activitiesGridScrollY,
        resourceLane: resourceLane,
        pixelsPerHour: this.planEditorData.activitiesGridPixelsPerHour,
        timeWindow: this.planEditorData.planTimeWindow,
        timeSnapMins: this.planEditorData.timeSnapMins,
        activitiesGridRect: this.planEditorData.activitiesGridRect,
        activitiesGridBoundingRect: this.planEditorData.activitiesGridBoundingRect,
      });
    });
  }
}
