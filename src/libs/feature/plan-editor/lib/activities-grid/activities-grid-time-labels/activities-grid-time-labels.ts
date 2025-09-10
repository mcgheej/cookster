import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TIMESLOTS } from '@util/app-config/index';
import { CommonModule } from '@angular/common';
import { PlanEditorDataService } from '../../plan-editor-data-service';

@Component({
  selector: 'ck-activities-grid-time-labels',
  imports: [CommonModule],
  templateUrl: './activities-grid-time-labels.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGridTimeLabels {
  private readonly editorData = inject(PlanEditorDataService);

  readonly hoursInGrid = input.required<string[]>();

  protected readonly pixelsPerHour = this.editorData.activitiesGridPixelsPerHour;

  protected readonly scrollY = computed(() => {
    const sY = this.editorData.scrollY();
    return `0 ${sY}px`;
  });
}
