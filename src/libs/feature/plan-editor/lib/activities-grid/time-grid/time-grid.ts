import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { laneWidthPx } from '@util/data-types/index';
import { CommonModule } from '@angular/common';
import { ACTIVITIES_GRID } from '@util/app-config/index';

@Component({
  selector: 'ck-time-grid',
  host: { class: 'absolute top-0 left-0' },
  imports: [CommonModule],
  templateUrl: './time-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeGrid {
  private readonly planEditorData = inject(PlanEditorDataService);

  readonly hoursInGrid = input.required<string[]>();

  protected readonly resourceLanes = this.planEditorData.resourceLanes;
  protected readonly pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour;

  protected readonly activitiesGrid = ACTIVITIES_GRID;

  protected readonly timeGridWidth = computed(() => {
    const lanes = this.resourceLanes();
    return lanes.reduce((sum, lane) => {
      const width = lane.visible ? laneWidthPx[lane.laneWidth] : 0;
      return sum + width;
    }, 0);
  });
}
