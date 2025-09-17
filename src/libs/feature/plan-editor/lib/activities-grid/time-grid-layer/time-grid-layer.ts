import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { CommonModule } from '@angular/common';
import { ACTIVITIES_GRID_PIXELS_PER_HOUR } from '@util/app-config/index';

@Component({
  selector: 'ck-time-grid-layer',
  host: { class: 'absolute top-0 left-0' },
  imports: [CommonModule],
  templateUrl: './time-grid-layer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeGridLayer {
  private readonly planEditorData = inject(PlanEditorDataService);

  readonly hoursInGrid = input.required<string[]>();

  protected readonly resourceLanes = this.planEditorData.resourceLanes;
  protected readonly pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour;
  protected readonly timeGridWidth = this.planEditorData.activitiesGridWidth;

  protected readonly activitiesGridPixelsPerHour = ACTIVITIES_GRID_PIXELS_PER_HOUR;
}
