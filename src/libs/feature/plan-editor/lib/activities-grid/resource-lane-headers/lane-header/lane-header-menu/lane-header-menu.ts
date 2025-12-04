
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { LaneWidth, ResourceLane } from '@util/data-types/index';
import { laneWidthOptions } from '../../../../types-constants/lane-width-options';
import { PlanEditorDataService } from '@feature/plan-editor/lib/plan-editor-data-service';

@Component({
  selector: 'ck-lane-header-menu',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './lane-header-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaneHeaderMenu {
  private readonly laneController = inject(PlanEditorDataService).laneController;

  readonly resourceLane = input.required<ResourceLane>();

  protected readonly defaultTooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
  protected readonly laneWidthOptions = laneWidthOptions;

  protected setLaneWidth(optionValue: string) {
    const resourceLane = this.resourceLane();
    if (optionValue !== resourceLane.laneWidth) {
      const index = resourceLane.kitchenResource.index;
      const laneControls = [...this.laneController().laneControls];
      laneControls[index] = { ...laneControls[index], laneWidth: optionValue as LaneWidth };
      this.laneController.set({
        ...this.laneController(),
        flagsInitialised: true,
        laneControls,
      });
    }
  }
}
