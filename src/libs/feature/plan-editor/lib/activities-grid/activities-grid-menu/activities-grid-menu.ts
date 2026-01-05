import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { MatDividerModule } from '@angular/material/divider';

import { timeZoomOptions } from '../../types-constants/time-zoom-options';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { laneWidthOptions } from '../../types-constants/lane-width-options';
import { ActivitiesGridMenuService } from './activities-grid-menu-service';

@Component({
  selector: 'ck-activities-grid-menu',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './activities-grid-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActivitiesGridMenuService],
})
export class ActivitiesGridMenu {
  private readonly planEditorData = inject(PlanEditorDataService);
  protected readonly service = inject(ActivitiesGridMenuService);

  protected readonly planEndTethered = this.planEditorData.activitiesGridPlanEndTethered;
  protected readonly showActivityDurationOnHover = this.planEditorData.showActivityDurationOnHover;
  private readonly laneController = this.planEditorData.laneController;

  protected readonly gridMenuData = computed(() => {
    return {
      pixelsPerHour: this.planEditorData.activitiesGridPixelsPerHour(),
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
}
