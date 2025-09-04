import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ACTIVITIES_GRID_HEADER_HEIGHT, DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { PlanEditorDataService } from '../plan-editor-data-service';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { timeZoomOptions } from './time-zoom-options';

@Component({
  selector: 'ck-activities-grid-menu',
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './activities-grid-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGridMenu {
  private readonly editorData = inject(PlanEditorDataService);

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
  protected timeZoomOptions = timeZoomOptions;

  protected readonly gridMenuData = computed(() => {
    return {
      pixelsPerHour: this.editorData.activitiesGridPixelsPerHour(),
    };
  });

  protected readonly planEndTethered = this.editorData.activitiesGridPlanEndTethered;

  protected menuButtonClasses =
    'grid grid-cols-1 grid-rows-1 border-r-2 divider-dark h-[' + ACTIVITIES_GRID_HEADER_HEIGHT + 'px]';

  setPixelsPerHour(pixelsPerHour: number) {
    if (pixelsPerHour !== this.editorData.activitiesGridPixelsPerHour()) {
      this.editorData.setActivitiesGridPixelsPerHour(pixelsPerHour);
    }
  }

  protected togglePlanEndTethered() {
    this.editorData.setActivitiesGridPlanEndTethered(!this.planEndTethered());
  }
}
