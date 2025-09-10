import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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

  protected readonly timeLabels = computed(() => {
    const { start, end } = this.editorData.activitiesGridTimeWindow();
    return TIMESLOTS.filter((_, i) => i >= start && i < end);
  });

  protected readonly pixelsPerHour = this.editorData.activitiesGridPixelsPerHour;
}
