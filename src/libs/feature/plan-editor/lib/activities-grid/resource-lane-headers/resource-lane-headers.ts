import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { laneWidthPx } from '@util/data-types/index';
import { LaneHeader } from './lane-header/lane-header';

@Component({
  selector: 'ck-resource-lane-headers',
  imports: [LaneHeader],
  templateUrl: './resource-lane-headers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceLaneHeaders {
  protected readonly resourceLanes = inject(PlanEditorDataService).resourceLanes;
  protected laneWidthPx = laneWidthPx;
}
