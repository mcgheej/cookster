import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { timeZoomOptions } from './time-zoom-options';
import { PlanEditorDataService } from '../../plan-editor-data-service';

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

  setPixelsPerHour(pixelsPerHour: number) {
    if (pixelsPerHour !== this.editorData.activitiesGridPixelsPerHour()) {
      this.editorData.setActivitiesGridPixelsPerHour(pixelsPerHour);
    }
  }

  protected togglePlanEndTethered() {
    this.editorData.setActivitiesGridPlanEndTethered(!this.planEndTethered());
  }
}
