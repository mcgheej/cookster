import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { laneWidthPx } from '@util/data-types/index';
import { LaneColumn } from './lane-column/lane-column';

@Component({
  selector: 'ck-resource-lanes-layer',
  host: { class: 'absolute top-0 left-0' },
  imports: [LaneColumn],
  templateUrl: './resource-lanes-layer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceLanesLayer {
  private readonly planEditorData = inject(PlanEditorDataService);

  readonly hoursInGrid = input.required<string[]>();

  protected readonly resourceLanes = this.planEditorData.resourceLanes;
  protected readonly laneWidthPx = laneWidthPx;

  protected laneHeight = computed(() => this.hoursInGrid().length * this.planEditorData.activitiesGridPixelsPerHour());
}
