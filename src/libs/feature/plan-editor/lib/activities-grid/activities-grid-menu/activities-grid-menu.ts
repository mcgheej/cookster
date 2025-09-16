import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { timeZoomOptions } from '../../types-constants/time-zoom-options';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { laneWidthOptions } from '../../types-constants/lane-width-options';
import { LaneWidth } from '@util/data-types/index';

@Component({
  selector: 'ck-activities-grid-menu',
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './activities-grid-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGridMenu {
  private readonly editorData = inject(PlanEditorDataService);

  protected readonly planEndTethered = this.editorData.activitiesGridPlanEndTethered;
  private readonly laneController = this.editorData.laneController;

  protected readonly gridMenuData = computed(() => {
    return {
      pixelsPerHour: this.editorData.activitiesGridPixelsPerHour(),
    };
  });

  protected readonly laneWidths = computed(() => {
    const laneControls = this.laneController().laneControls;
    let result = '';
    laneControls.forEach((lc) => {
      if (result === '') {
        result = lc.laneWidth;
      } else if (result !== lc.laneWidth) {
        result = 'varied';
      }
    });
    return result;
  });

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
  protected timeZoomOptions = timeZoomOptions;
  protected readonly laneWidthOptions = laneWidthOptions;

  setPixelsPerHour(pixelsPerHour: number) {
    if (pixelsPerHour !== this.editorData.activitiesGridPixelsPerHour()) {
      this.editorData.setActivitiesGridPixelsPerHour(pixelsPerHour);
    }
  }

  protected togglePlanEndTethered() {
    this.editorData.setActivitiesGridPlanEndTethered(!this.planEndTethered());
  }

  protected setLaneWidths(optionValue: string) {
    const laneControls = [...this.laneController().laneControls];
    laneControls.forEach((lc, i) => {
      laneControls[i] = { ...laneControls[i], laneWidth: optionValue as LaneWidth };
    });
    this.laneController.set({
      ...this.laneController(),
      flagsInitialised: true,
      laneControls,
    });
  }
}
